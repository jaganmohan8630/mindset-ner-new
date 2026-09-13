const express = require("express");
const CaregiverActionPlan = require("../models/CaregiverActionPlan");
const { protect, authorizePatient } = require("../middleware/authMiddleware");
const { buildCaregiverActionPlan } = require("../services/caregiverActionPlanService");
const router = express.Router();

const requireCaregiver = (req, res, next) => req.user.role === "caregiver" ? next() : res.status(403).json({ success: false, message: "Only an authorized caregiver can access a caregiver action plan" });

router.get("/:patientId", protect, requireCaregiver, authorizePatient, async (req, res) => {
  try {
    const plan = await buildCaregiverActionPlan(req.params.patientId);
    const records = await CaregiverActionPlan.find({ patientId: req.params.patientId, caregiverId: req.user.userId }).sort({ updatedAt: -1 }).lean();
    const decisions = new Map(records.map((item) => [item.actionKey, item]));
    const pendingActions = plan.actions
      .map((action) => ({ ...action, ...(decisions.get(action.actionKey) || { status: "pending" }) }))
      .filter((action) => action.status === "pending");
    const historyActions = await CaregiverActionPlan.find({
      patientId: req.params.patientId,
      caregiverId: req.user.userId,
      status: { $in: ["completed", "dismissed"] },
    })
      .sort({ completedAt: -1, dismissedAt: -1, updatedAt: -1 })
      .lean();
    res.json({ success: true, ...plan, pendingActions, historyActions });
  } catch (error) { res.status(500).json({ success: false, message: "Failed to build caregiver action plan", error: error.message }); }
});

router.put("/:patientId/actions/:actionKey", protect, requireCaregiver, authorizePatient, async (req, res) => {
  try {
    const { status, action: submittedAction } = req.body;
    if (!["completed", "dismissed"].includes(status)) return res.status(400).json({ success: false, message: "Action status must be completed or dismissed" });
    let action = await CaregiverActionPlan.findOne({ patientId: req.params.patientId, caregiverId: req.user.userId, actionKey: req.params.actionKey });

    // Preserve the exact action that was displayed. Recalculating the live
    // plan here caused valid actions to be rejected when data changed.
    if (!action) {
      const validActionTypes = ["cognitive_activity", "mood_follow_up", "reminder_follow_up", "monitoring", "safety_follow_up"];
      const validPriorities = ["high", "medium", "low"];
      if (!submittedAction || !validActionTypes.includes(submittedAction.actionType) || !validPriorities.includes(submittedAction.priority) || typeof submittedAction.recommendation !== "string" || typeof submittedAction.reason !== "string") {
        return res.status(400).json({ success: false, message: "The pending action details are required" });
      }
      action = await CaregiverActionPlan.findOneAndUpdate(
        { patientId: req.params.patientId, caregiverId: req.user.userId, actionKey: req.params.actionKey },
        { $setOnInsert: { patientId: req.params.patientId, caregiverId: req.user.userId, actionKey: req.params.actionKey, actionType: submittedAction.actionType, recommendation: submittedAction.recommendation, reason: submittedAction.reason, priority: submittedAction.priority, status: "pending" } },
        { returnDocument: "after", upsert: true, runValidators: true, setDefaultsOnInsert: true },
      );
    }
    if (action.status !== "pending") return res.status(409).json({ success: false, message: "This action has already been handled" });
    const now = new Date();
    const saved = await CaregiverActionPlan.findOneAndUpdate(
      { _id: action._id, patientId: req.params.patientId, caregiverId: req.user.userId, status: "pending" },
      { $set: { status, completedAt: status === "completed" ? now : null, dismissedAt: status === "dismissed" ? now : null } },
      { returnDocument: "after", runValidators: true },
    );
    res.json({ success: true, action: saved });
  } catch (error) { res.status(500).json({ success: false, message: "Failed to update caregiver action", error: error.message }); }
});
module.exports = router;
