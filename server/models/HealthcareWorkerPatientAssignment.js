const mongoose = require("mongoose");

// Healthcare access is separate from caregiver consent/connection and is
// granted or revoked only by an administrator.
const schema = new mongoose.Schema({
  healthcareWorkerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  permissions: { canViewMoodHistory: { type: Boolean, default: false } },
  status: { type: String, enum: ["pending", "active", "rejected", "revoked"], default: "active" },
  active: { type: Boolean, default: true },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  assignedAt: { type: Date, default: Date.now },
}, { timestamps: true });

schema.index({ healthcareWorkerId: 1, patientId: 1 }, { unique: true });

module.exports = mongoose.model("HealthcareWorkerPatientAssignment", schema);
