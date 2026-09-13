const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    caregiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    requestedBy: {
      type: String,
      enum: ["caregiver", "patient"],
      required: true,
    },

    acceptedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const CaregiverPatientConnection =
  mongoose.model(
    "CaregiverPatientConnection",
    connectionSchema,
  );

module.exports = CaregiverPatientConnection;