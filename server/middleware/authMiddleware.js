const jwt = require("jsonwebtoken");
const User = require("../models/User");
const CaregiverPatientConnection = require("../models/CaregiverPatientConnection");
const HealthcareWorkerPatientAssignment = require("../models/HealthcareWorkerPatientAssignment");

const JWT_SECRET = process.env.JWT_SECRET || "mindset-ner-development-secret";

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

const authorizePatient = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const requestedPatientId =
      req.params.patientId || req.params.id || req.body?.patientId;

    if (!requestedPatientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    // Caregivers can access only patients
    // with an accepted connection.
    // Patients can access only their own patient data.
    if (user.role === "patient") {
      if (
        !user.patientId ||
        String(user.patientId) !== String(requestedPatientId)
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to access this patient",
        });
      }
    }
    if (user.role === "caregiver") {
      const connection = await CaregiverPatientConnection.findOne({
        caregiverId: user._id,
        patientId: requestedPatientId,
        status: "accepted",
      });

      if (!connection) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to access this patient",
        });
      }
    }
    if (user.role === "healthcare_worker") {
      const assignment = await HealthcareWorkerPatientAssignment.findOne({ healthcareWorkerId: user._id, patientId: requestedPatientId, active: true });
      if (!assignment) return res.status(403).json({ success: false, message: "You are not authorized to access this patient" });
      req.healthcareWorkerAssignment = assignment;
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to verify patient access",
      error: error.message,
    });
  }
};

const authorizeMoodHistory = (req, res, next) => {
  if (req.user.role !== "healthcare_worker" || req.healthcareWorkerAssignment?.permissions?.canViewMoodHistory) return next();
  return res.status(403).json({ success: false, message: "Mood history is not authorized for this patient" });
};

module.exports = {
  protect,
  authorizePatient,
  authorizeMoodHistory,
};
