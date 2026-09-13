const mongoose = require("mongoose");

const elderMessageSchema = new mongoose.Schema({
  senderPatientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  receiverPatientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  type: { type: String, enum: ["text", "audio"], required: true },
  text: { type: String, trim: true, maxlength: 1000, default: "" },
  audio: { filename: String, mimeType: String, durationMs: Number },
}, { timestamps: true });

elderMessageSchema.index({ senderPatientId: 1, receiverPatientId: 1, createdAt: -1 });
module.exports = mongoose.model("ElderMessage", elderMessageSchema);
