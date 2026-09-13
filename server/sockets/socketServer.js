const jwt = require("jsonwebtoken");
const User = require("../models/User");
const CaregiverPatientConnection = require("../models/CaregiverPatientConnection");
const ElderConnection = require("../models/ElderConnection");
const Patient = require("../models/Patient");

const JWT_SECRET = process.env.JWT_SECRET || "mindset-ner-development-secret";

const emitPatientEvent = (io, patientId, eventName, payload) => {
  if (!io || !patientId) return;

  io.to(`patient:${patientId}`).emit(eventName, {
    patientId: String(patientId),
    ...payload,
  });
};

const joinCaregiverSocketsToPatient = (io, caregiverId, patientId) => {
  if (!io || !caregiverId || !patientId) return;

  io.in(`user:${caregiverId}`).socketsJoin(`patient:${patientId}`);
};

const acceptedElderPeer = async (socket, targetPatientId) => {
  if (socket.user.role !== "patient" || !socket.user.patientId || !targetPatientId) return null;
  const connection = await ElderConnection.findOne({
    status: "accepted",
    $or: [
      { senderPatientId: socket.user.patientId, receiverPatientId: targetPatientId },
      { senderPatientId: targetPatientId, receiverPatientId: socket.user.patientId },
    ],
  });
  if (!connection) return null;
  return User.findOne({ role: "patient", patientId: targetPatientId }).select("_id patientId");
};

const setupSocketServer = (io) => {
  // Authenticate every Socket.IO connection
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;
      socket.userId = String(user._id);

      next();
    } catch (error) {
      console.error("Socket authentication failed:", error.message);
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", async (socket) => {
    console.log(
      "Authenticated socket connected:",
      socket.id,
      "User:",
      socket.user.email,
      "Role:",
      socket.user.role,
    );

    // Every user gets a private room
    socket.join(`user:${socket.userId}`);

    // Patient joins their own patient room
    if (socket.user.role === "patient" && socket.user.patientId) {
      socket.join(`patient:${socket.user.patientId}`);

      console.log(`Patient joined room: patient:${socket.user.patientId}`);
    }

    // Caregiver joins rooms for all accepted patient connections
    if (
      socket.user.role === "caregiver" ||
      socket.user.role === "healthcare_worker"
    ) {
      const connections = await CaregiverPatientConnection.find({
        caregiverId: socket.user._id,
        status: "accepted",
      }).select("patientId");

      for (const connection of connections) {
        if (connection.patientId) {
          socket.join(`patient:${connection.patientId}`);

          console.log(`Caregiver joined room: patient:${connection.patientId}`);
        }
      }
    }
    // WebRTC audio uses only these authenticated Socket.IO messages for
    // signaling. Every relay re-checks the accepted elder relationship.
    const relayElderCall = (eventName) => socket.on(eventName, async (payload = {}, acknowledgement) => {
      try {
        const target = await acceptedElderPeer(socket, payload.targetPatientId);
        if (!target) {
          acknowledgement?.({ ok: false, message: "Audio calls are available only for accepted elder connections." });
          return;
        }
        const caller = await Patient.findById(socket.user.patientId).select("name patientCode");
        io.to(`user:${target._id}`).emit(eventName, {
          ...payload,
          targetPatientId: String(target.patientId),
          caller: caller ? { name: caller.name, patientCode: caller.patientCode, patientId: String(socket.user.patientId) } : undefined,
        });
        acknowledgement?.({ ok: true });
      } catch (error) {
        console.error(`Elder call ${eventName} failed:`, error.message);
        acknowledgement?.({ ok: false, message: "Unable to send call signal." });
      }
    });

    [
      "elder-call-request",
      "elder-call-accepted",
      "elder-call-rejected",
      "elder-call-offer",
      "elder-call-answer",
      "elder-call-ice-candidate",
      "elder-call-ended",
    ].forEach(relayElderCall);
    socket.on("disconnect", () => {
      console.log("Authenticated socket disconnected:", socket.id);
    });
  });
};

module.exports = {
  setupSocketServer,
  emitPatientEvent,
  joinCaregiverSocketsToPatient,
};
