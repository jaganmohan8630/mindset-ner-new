const express = require("express");
const Patient = require("../models/Patient");
const User = require("../models/User");
const { protect, authorizePatient } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new patient
router.post("/", async (req, res) => {
  try {
    const patientCode = `MNR-P-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    const patient = await Patient.create({
      ...req.body,
      patientCode,
    });

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      patient,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create patient",
      error: error.message,
    });
  }
});

// Get all patients
router.get("/", protect, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Only administrators can view all patients",
    });
  }
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch patients",
      error: error.message,
    });
  }
});

// Get one patient
router.get("/:id", protect, authorizePatient, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      user.role === "caregiver" &&
      String(user.patientId) !== String(req.params.id)
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this patient",
      });
    }
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
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
    res.status(500).json({
      success: false,
      message: "Failed to fetch patient",
      error: error.message,
    });
  }
});

// Update one patient
router.put("/:id", protect, authorizePatient, async (req, res) => {
  try {
    if (req.user.role === "healthcare_worker") return res.status(403).json({ success: false, message: "Healthcare workers have read-only patient access" });
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      user.role === "caregiver" &&
      String(user.patientId) !== String(req.params.id)
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this patient",
      });
    }
    const allowedFields = [
      "name",
      "age",
      "gender",
      "language",
      "caregiverName",
      "caregiverPhone",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const patient = await Patient.findByIdAndUpdate(req.params.id, updates, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.json({
      success: true,
      message: "Patient updated successfully",
      patient,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update patient",
      error: error.message,
    });
  }
});

module.exports = router;
