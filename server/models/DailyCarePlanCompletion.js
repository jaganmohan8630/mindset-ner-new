const mongoose = require("mongoose");

const dailyCarePlanCompletionSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    date: { type: String, required: true },
    itemKey: { type: String, required: true },
    completedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

dailyCarePlanCompletionSchema.index({ patientId: 1, date: 1, itemKey: 1 }, { unique: true });

module.exports = mongoose.model("DailyCarePlanCompletion", dailyCarePlanCompletionSchema);
