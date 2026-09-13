const mongoose = require("mongoose");

const caregiverActionPlanSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    caregiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    actionKey: { type: String, required: true },
    actionType: { type: String, enum: ["cognitive_activity", "mood_follow_up", "reminder_follow_up", "monitoring", "safety_follow_up"], required: true },
    recommendation: { type: String, required: true },
    reason: { type: String, required: true },
    priority: { type: String, enum: ["high", "medium", "low"], required: true },
    status: { type: String, enum: ["pending", "completed", "dismissed"], default: "pending" },
    completedAt: { type: Date, default: null },
    dismissedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

caregiverActionPlanSchema.index({ patientId: 1, caregiverId: 1, actionKey: 1 }, { unique: true });

module.exports = mongoose.model("CaregiverActionPlan", caregiverActionPlanSchema);
