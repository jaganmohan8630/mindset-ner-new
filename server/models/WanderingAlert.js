const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    latitude: { type: Number, required: true, min: -90, max: 90 },
    longitude: { type: Number, required: true, min: -180, max: 180 },
    accuracyMeters: { type: Number, min: 0, default: null },
    capturedAt: { type: Date, required: true },
  },
  { _id: false },
);

const wanderingAlertSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    type: { type: String, enum: ["wandering"], default: "wandering" },
    status: { type: String, enum: ["active", "acknowledged", "resolved"], default: "active", index: true },
    lastKnownLocation: { type: locationSchema, required: true },
    safeZone: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      radiusMeters: { type: Number, required: true },
    },
    distanceFromSafeZoneMeters: { type: Number, required: true, min: 0 },
    acknowledgedAt: { type: Date, default: null },
    acknowledgedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    resolvedAt: { type: Date, default: null },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

wanderingAlertSchema.index({ patientId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("WanderingAlert", wanderingAlertSchema);
