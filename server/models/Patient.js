const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    patientCode: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    language: {
      type: String,
      default: "English",
    },

    caregiverName: {
      type: String,
      trim: true,
    },

    caregiverPhone: {
      type: String,
      trim: true,
    },

    difficultyLevel: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Coordinates are deliberately kept with the patient rather than the
    // user account: several users may be connected to the same patient.
    safeZone: {
      enabled: { type: Boolean, default: false },
      latitude: { type: Number, min: -90, max: 90, default: null },
      longitude: { type: Number, min: -180, max: 180, default: null },
      radiusMeters: { type: Number, min: 25, max: 100000, default: 100 },
      updatedAt: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  },
);

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
