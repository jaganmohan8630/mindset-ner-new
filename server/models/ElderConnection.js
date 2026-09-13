const mongoose = require("mongoose");

const elderConnectionSchema = new mongoose.Schema(
  {
    senderPatientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    receiverPatientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    // Canonical pair key makes A↔B unique regardless of which elder sent it.
    pairKey: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    requestedAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ElderConnection", elderConnectionSchema);
