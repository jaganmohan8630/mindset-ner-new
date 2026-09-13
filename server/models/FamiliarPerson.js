const mongoose = require("mongoose");

const familiarPersonSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    photo: {
      filename: { type: String, required: true },
      mimeType: { type: String, required: true },
      uploadedAt: { type: Date, default: Date.now },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

familiarPersonSchema.index({ patientId: 1, isActive: 1, name: 1 });

module.exports = mongoose.model("FamiliarPerson", familiarPersonSchema);
