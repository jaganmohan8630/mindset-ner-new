const express = require("express");
const Patient = require("../models/Patient");
const User = require("../models/User");
const CaregiverPatientConnection = require("../models/CaregiverPatientConnection");
const WanderingAlert = require("../models/WanderingAlert");
const { protect } = require("../middleware/authMiddleware");
const { emitPatientEvent } = require("../sockets/socketServer");

const router = express.Router();

const isCoordinate = (value, min, max) => Number.isFinite(value) && value >= min && value <= max;
const distanceInMeters = (fromLat, fromLng, toLat, toLng) => {
  const earthRadius = 6371000;
  const radians = (value) => (value * Math.PI) / 180;
  const dLat = radians(toLat - fromLat);
  const dLng = radians(toLng - fromLng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(radians(fromLat)) * Math.cos(radians(toLat)) * Math.sin(dLng / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const canAccessPatient = async (user, patientId) => {
  if (user.role === "admin") return true;
  if (user.role === "patient") return String(user.patientId) === String(patientId);
  if (user.role === "caregiver" || user.role === "healthcare_worker") {
    return Boolean(await CaregiverPatientConnection.exists({ caregiverId: user._id, patientId, status: "accepted" }));
  }
  return false;
};

const loadUser = (id) => User.findById(id).select("_id role patientId");

router.put("/:patientId/safe-zone", protect, async (req, res) => {
  try {
    const user = await loadUser(req.user.userId);
    if (!user || !(await canAccessPatient(user, req.params.patientId)) || user.role === "patient") {
      return res.status(403).json({ success: false, message: "Only a connected caregiver or administrator can configure the safe zone" });
    }
    const { enabled, latitude, longitude, radiusMeters } = req.body;
    if (typeof enabled !== "boolean" || !isCoordinate(latitude, -90, 90) || !isCoordinate(longitude, -180, 180) || !Number.isFinite(radiusMeters) || radiusMeters < 25 || radiusMeters > 100000) {
      return res.status(400).json({ success: false, message: "A valid safe-zone location and radius (25–100000 metres) are required" });
    }
    const patient = await Patient.findByIdAndUpdate(req.params.patientId, { safeZone: { enabled, latitude, longitude, radiusMeters, updatedAt: new Date() } }, { returnDocument: "after", runValidators: true });
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });
    res.json({ success: true, safeZone: patient.safeZone });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update safe zone", error: error.message });
  }
});

router.get("/:patientId/alerts", protect, async (req, res) => {
  try {
    const user = await loadUser(req.user.userId);
    if (!user || !(await canAccessPatient(user, req.params.patientId))) return res.status(403).json({ success: false, message: "Not authorized to view these alerts" });
    const alerts = await WanderingAlert.find({ patientId: req.params.patientId }).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load emergency alerts", error: error.message });
  }
});

router.post("/:patientId/location", protect, async (req, res) => {
  try {
    const user = await loadUser(req.user.userId);
    if (!user || user.role !== "patient" || String(user.patientId) !== String(req.params.patientId)) return res.status(403).json({ success: false, message: "Only the patient app can report its location" });
    const { latitude, longitude, accuracyMeters, capturedAt } = req.body;
    if (!isCoordinate(latitude, -90, 90) || !isCoordinate(longitude, -180, 180) || (accuracyMeters != null && (!Number.isFinite(accuracyMeters) || accuracyMeters < 0))) return res.status(400).json({ success: false, message: "Invalid location data" });
    const patient = await Patient.findById(req.params.patientId).select("safeZone");
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });
    const zone = patient.safeZone;
    if (!zone?.enabled || zone.latitude == null || zone.longitude == null) return res.json({ success: true, monitored: false });
    const distance = distanceInMeters(zone.latitude, zone.longitude, latitude, longitude);
    const outsideDistance = Math.max(0, distance - zone.radiusMeters);
    if (distance <= zone.radiusMeters) {
      // A return to the safe zone completes any ongoing wandering incident.
      // Caregivers can still manually resolve an alert at any earlier point.
      const returnedAlert = await WanderingAlert.findOneAndUpdate(
        { patientId: patient._id, status: { $in: ["active", "acknowledged"] } },
        { status: "resolved", resolvedAt: new Date(), resolvedBy: null },
        { returnDocument: "after" },
      );
      if (returnedAlert) {
        returnedAlert.lastKnownLocation = {
          latitude,
          longitude,
          accuracyMeters: accuracyMeters ?? null,
          capturedAt: capturedAt ? new Date(capturedAt) : new Date(),
        };
        returnedAlert.distanceFromSafeZoneMeters = 0;
        await returnedAlert.save();
        emitPatientEvent(req.app.get("io"), patient._id, "wandering:alertUpdated", { alert: returnedAlert });
      }
      return res.json({ success: true, monitored: true, outsideSafeZone: false, distanceFromSafeZoneMeters: 0, returnedAlert });
    }

    // One open alert is maintained per patient to avoid an alert for every GPS sample.
    let alert = await WanderingAlert.findOne({ patientId: patient._id, status: { $in: ["active", "acknowledged"] } });
    const location = { latitude, longitude, accuracyMeters: accuracyMeters ?? null, capturedAt: capturedAt ? new Date(capturedAt) : new Date() };
    let created = false;
    if (alert) {
      alert.lastKnownLocation = location;
      alert.distanceFromSafeZoneMeters = outsideDistance;
      await alert.save();
      emitPatientEvent(req.app.get("io"), patient._id, "wandering:alertUpdated", { alert });
    } else {
      alert = await WanderingAlert.create({ patientId: patient._id, lastKnownLocation: location, safeZone: { latitude: zone.latitude, longitude: zone.longitude, radiusMeters: zone.radiusMeters }, distanceFromSafeZoneMeters: outsideDistance });
      created = true;
      emitPatientEvent(req.app.get("io"), patient._id, "wandering:alertCreated", { alert });
    }
    res.status(created ? 201 : 200).json({ success: true, monitored: true, outsideSafeZone: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to process location", error: error.message });
  }
});

router.put("/:patientId/alerts/:alertId/:action", protect, async (req, res) => {
  try {
    if (!["acknowledge", "resolve"].includes(req.params.action)) return res.status(400).json({ success: false, message: "Unknown alert action" });
    const user = await loadUser(req.user.userId);
    if (!user || user.role === "patient" || !(await canAccessPatient(user, req.params.patientId))) return res.status(403).json({ success: false, message: "Only a connected caregiver or administrator can update alerts" });
    const patch = req.params.action === "acknowledge" ? { status: "acknowledged", acknowledgedAt: new Date(), acknowledgedBy: user._id } : { status: "resolved", resolvedAt: new Date(), resolvedBy: user._id };
    const alert = await WanderingAlert.findOneAndUpdate({ _id: req.params.alertId, patientId: req.params.patientId, ...(req.params.action === "acknowledge" ? { status: "active" } : { status: { $in: ["active", "acknowledged"] } }) }, patch, { returnDocument: "after" });
    if (!alert) return res.status(404).json({ success: false, message: "Alert not found or already updated" });
    emitPatientEvent(req.app.get("io"), req.params.patientId, "wandering:alertUpdated", { alert });
    res.json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update alert", error: error.message });
  }
});

module.exports = router;
