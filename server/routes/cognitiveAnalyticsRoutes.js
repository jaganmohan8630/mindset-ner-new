const express = require("express");
const { protect, authorizePatient } = require("../middleware/authMiddleware");
const { getCognitiveRisk } = require("../services/cognitiveRiskService");

const router = express.Router();

router.get("/cognitive-risk/:patientId", protect, authorizePatient, async (req, res) => {
  try {
    res.json(await getCognitiveRisk(req.params.patientId));
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to calculate cognitive trend", error: error.message });
  }
});

module.exports = router;
