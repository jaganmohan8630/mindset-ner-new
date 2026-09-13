const express = require("express");
const MoodEntry = require("../models/MoodEntry");
const { protect, authorizePatient, authorizeMoodHistory } = require("../middleware/authMiddleware");
const router = express.Router();

// Save patient mood
router.post("/", protect, authorizePatient, async (req, res) => {
  try {
    if (req.user.role !== "patient") return res.status(403).json({ success: false, message: "Only patients can record mood check-ins" });
    const { patientId, mood, label } = req.body;

    const moodEntry = await MoodEntry.create({
      patientId,
      mood,
      label,
    });

    const { emitPatientEvent } = require("../sockets/socketServer");
    emitPatientEvent(req.app.get("io"), moodEntry.patientId, "mood:updated", {
      moodEntry,
      updatedAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: "Mood saved successfully",
      moodEntry,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to save mood",
      error: error.message,
    });
  }
});

// Get moods for a patient
router.get("/:patientId", protect, authorizePatient, authorizeMoodHistory, async (req, res) => {
  try {
    const moods = await MoodEntry.find({
      patientId: req.params.patientId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      moods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch moods",
      error: error.message,
    });
  }
});

module.exports = router;
