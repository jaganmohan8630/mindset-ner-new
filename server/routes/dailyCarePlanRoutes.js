const express = require("express");
const DailyCarePlanCompletion = require("../models/DailyCarePlanCompletion");
const { protect, authorizePatient } = require("../middleware/authMiddleware");
const { getDailyCarePlan } = require("../services/dailyCarePlanService");
const router = express.Router();

router.get("/:patientId", protect, authorizePatient, async (req, res) => {
  try { res.json({ success: true, plan: await getDailyCarePlan(req.params.patientId, req.query.date) }); }
  catch (error) { res.status(500).json({ success: false, message: "Failed to load daily care plan", error: error.message }); }
});

router.put("/:patientId/items/:itemKey/complete", protect, authorizePatient, async (req, res) => {
  try {
    if (req.user.role !== "patient") return res.status(403).json({ success: false, message: "Only the patient can complete daily care plan items" });
    const plan = await getDailyCarePlan(req.params.patientId, req.body.date);
    const item = plan.items.find((candidate) => candidate.key === req.params.itemKey);
    if (!item?.canComplete) return res.status(400).json({ success: false, message: "This plan item is completed by its existing activity or reminder workflow" });
    const completion = await DailyCarePlanCompletion.findOneAndUpdate(
      { patientId: req.params.patientId, date: plan.date, itemKey: item.key },
      { $setOnInsert: { patientId: req.params.patientId, date: plan.date, itemKey: item.key, completedBy: req.user.userId, completedAt: new Date() } },
      { returnDocument: "after", upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
    res.json({ success: true, completion });
  } catch (error) { res.status(500).json({ success: false, message: "Failed to complete daily care plan item", error: error.message }); }
});

module.exports = router;
