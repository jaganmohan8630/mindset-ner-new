const express = require("express");
const Patient = require("../models/Patient");
const CaregiverPatientConnection = require(
  "../models/CaregiverPatientConnection"
);
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Search patient by MongoDB Patient ID
// Search patient by public Patient Code
router.get("/search-patient/:patientId", protect, async (req, res) => {
  try {
    const patient = await Patient.findOne({
      patientCode: req.params.patientId.toUpperCase(),
    }).select(
      "name age gender language isActive patientCode"
    );

    if (!patient || !patient.isActive) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.json({
      success: true,
      patient,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid patient ID",
    });
  }
});

// Send connection request
router.post("/request", protect, async (req, res) => {
  try {
    const { patientId } = req.body;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "patientId is required",
      });
    }

    // Make sure the logged-in user is a caregiver
    if (req.user.role !== "caregiver") {
      return res.status(403).json({
        success: false,
        message: "Only caregivers can send connection requests",
      });
    }

    // Check patient exists
    const patient = await Patient.findById(patientId);

    if (!patient || !patient.isActive) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Check for an existing request/connection
    const existingConnection =
      await CaregiverPatientConnection.findOne({
        caregiverId: req.user.userId,
        patientId,
      });

    if (existingConnection) {
      return res.status(409).json({
        success: false,
        message: `Connection request already exists with status: ${existingConnection.status}`,
        connection: existingConnection,
      });
    }

    const connection = await CaregiverPatientConnection.create({
      caregiverId: req.user.userId,
      patientId,
      status: "pending",
      requestedBy: "caregiver",
    });

    // The patient receives this request in their private user room.
    const patientUser = await require("../models/User").findOne({
      role: "patient",
      patientId,
    }).select("_id");
    const io = req.app.get("io");
    if (io && patientUser) {
      io.to(`user:${patientUser._id}`).emit("caregiverRequest:created", {
        connection,
      });
    }

    res.status(201).json({
      success: true,
      message: "Connection request sent successfully",
      connection,
    });
  } catch (error) {
    console.error("Connection request error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send connection request",
      error: error.message,
    });
  }
});

// Get connection requests for a patient
router.get("/patient-requests", protect, async (req, res) => {
  try {
    const user = await require("../models/User").findById(req.user.userId);

    if (!user || user.role !== "patient" || !user.patientId) {
      return res.status(403).json({
        success: false,
        message: "Only patients can view connection requests",
      });
    }

    const requests = await CaregiverPatientConnection.find({
      patientId: user.patientId,
      status: "pending",
    })
      .populate("caregiverId", "name email role")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Failed to load patient requests:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load connection requests",
      error: error.message,
    });
  }
});

// Accept a caregiver connection request
router.put("/:connectionId/accept", protect, async (req, res) => {
  try {
    const user = await require("../models/User").findById(req.user.userId);

    if (!user || user.role !== "patient" || !user.patientId) {
      return res.status(403).json({
        success: false,
        message: "Only patients can accept connection requests",
      });
    }

    // Use an atomic update so a double-tap or a retry cannot leave the
    // patient facing a false "not found" error after the first request wins.
    let connection = await CaregiverPatientConnection.findOneAndUpdate(
      {
        _id: req.params.connectionId,
        patientId: user.patientId,
        status: "pending",
      },
      {
        $set: {
          status: "accepted",
          acceptedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    );

    if (!connection) {
      connection = await CaregiverPatientConnection.findOne({
        _id: req.params.connectionId,
        patientId: user.patientId,
      });

      if (connection?.status === "accepted") {
        return res.json({
          success: true,
          message: "Caregiver connection already accepted",
          connection,
        });
      }

      return res.status(404).json({
        success: false,
        message: "Connection request not found",
      });
    }

    const io = req.app.get("io");
    const { joinCaregiverSocketsToPatient } = require("../sockets/socketServer");
    joinCaregiverSocketsToPatient(io, connection.caregiverId, connection.patientId);
    if (io) {
      io.to(`user:${connection.caregiverId}`).emit("caregiverRequest:accepted", {
        connection,
      });
    }

    res.json({
      success: true,
      message: "Caregiver connection accepted",
      connection,
    });
  } catch (error) {
    console.error("Failed to accept connection:", error);

    res.status(500).json({
      success: false,
      message: "Failed to accept connection",
      error: error.message,
    });
  }
});

// Reject a caregiver connection request
router.put("/:connectionId/reject", protect, async (req, res) => {
  try {
    const user = await require("../models/User").findById(req.user.userId);

    if (!user || user.role !== "patient" || !user.patientId) {
      return res.status(403).json({
        success: false,
        message: "Only patients can reject connection requests",
      });
    }

    let connection = await CaregiverPatientConnection.findOneAndUpdate(
      {
        _id: req.params.connectionId,
        patientId: user.patientId,
        status: "pending",
      },
      { $set: { status: "rejected" } },
      { returnDocument: "after" },
    );

    if (!connection) {
      connection = await CaregiverPatientConnection.findOne({
        _id: req.params.connectionId,
        patientId: user.patientId,
      });

      if (connection?.status === "rejected") {
        return res.json({
          success: true,
          message: "Caregiver connection already rejected",
          connection,
        });
      }

      return res.status(404).json({
        success: false,
        message: "Connection request not found",
      });
    }

    res.json({
      success: true,
      message: "Caregiver connection rejected",
      connection,
    });
  } catch (error) {
    console.error("Failed to reject connection:", error);

    res.status(500).json({
      success: false,
      message: "Failed to reject connection",
      error: error.message,
    });
  }
});

// Get patients connected to the logged-in caregiver
router.get("/my-patients", protect, async (req, res) => {
  try {
    if (req.user.role !== "caregiver") {
      return res.status(403).json({
        success: false,
        message: "Only caregivers can view connected patients",
      });
    }

    const connections =
      await CaregiverPatientConnection.find({
        caregiverId: req.user.userId,
        status: "accepted",
      })
        .populate(
  "patientId",
  "name age gender language difficultyLevel isActive patientCode safeZone",
)
        .sort({ acceptedAt: -1 });

    const patients = connections
      .filter(
        (connection) =>
          connection.patientId && connection.patientId.isActive,
      )
      .map((connection) => ({
        connectionId: connection._id,
        patient: connection.patientId,
        acceptedAt: connection.acceptedAt,
      }));

    res.json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    console.error("Failed to load connected patients:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load connected patients",
      error: error.message,
    });
  }
});

module.exports = router;
