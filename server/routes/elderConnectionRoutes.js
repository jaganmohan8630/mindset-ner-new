const express = require("express");
const mongoose = require("mongoose");
const Patient = require("../models/Patient");
const User = require("../models/User");
const ElderConnection = require("../models/ElderConnection");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const patientOnly = async (req, res, next) => {
  const user = await User.findById(req.user.userId).select("role patientId");
  if (!user || user.role !== "patient" || !user.patientId) {
    return res.status(403).json({ success: false, message: "Only patient accounts can use Elder Connect" });
  }
  req.elderUser = user;
  next();
};

const safeProfile = (patient) => ({
  id: patient._id,
  name: patient.name,
  age: patient.age,
  gender: patient.gender,
  language: patient.language,
  patientCode: patient.patientCode,
});

const connectionBetween = (first, second) => ElderConnection.findOne({
  $or: [
    { senderPatientId: first, receiverPatientId: second },
    { senderPatientId: second, receiverPatientId: first },
  ],
});
const pairKeyFor = (first, second) => [String(first), String(second)].sort().join(":");

router.use(protect, patientOnly);

router.get("/search/:patientCode", async (req, res) => {
  const patient = await Patient.findOne({ patientCode: req.params.patientCode.trim().toUpperCase(), isActive: true })
    .select("name age gender language patientCode");
  if (!patient || !(await User.exists({ role: "patient", patientId: patient._id }))) {
    return res.status(404).json({ success: false, message: "Elder not found" });
  }
  if (String(patient._id) === String(req.elderUser.patientId)) {
    return res.status(400).json({ success: false, message: "Cannot connect with yourself" });
  }
  const existing = await connectionBetween(req.elderUser.patientId, patient._id);
  res.json({ success: true, patient: safeProfile(patient), connectionStatus: existing?.status || null });
});

router.post("/request", async (req, res) => {
  const code = String(req.body.patientCode || "").trim().toUpperCase();
  if (!code) return res.status(400).json({ success: false, message: "Patient Code is required" });
  const target = await Patient.findOne({ patientCode: code, isActive: true });
  if (!target || !(await User.exists({ role: "patient", patientId: target._id }))) {
    return res.status(404).json({ success: false, message: "Elder not found" });
  }
  if (String(target._id) === String(req.elderUser.patientId)) {
    return res.status(400).json({ success: false, message: "Cannot connect with yourself" });
  }
  const existing = await connectionBetween(req.elderUser.patientId, target._id);
  if (existing && ["pending", "accepted"].includes(existing.status)) {
    return res.status(409).json({ success: false, message: existing.status === "accepted" ? "Already connected" : "Request already pending" });
  }
  let connection;
  try {
    connection = existing
      ? await ElderConnection.findByIdAndUpdate(existing._id, { senderPatientId: req.elderUser.patientId, receiverPatientId: target._id, pairKey: pairKeyFor(req.elderUser.patientId, target._id), status: "pending", requestedAt: new Date(), acceptedAt: null }, { new: true })
      : await ElderConnection.create({ senderPatientId: req.elderUser.patientId, receiverPatientId: target._id, pairKey: pairKeyFor(req.elderUser.patientId, target._id) });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ success: false, message: "Request already pending" });
    throw error;
  }
  const targetUser = await User.findOne({ role: "patient", patientId: target._id }).select("_id");
  req.app.get("io")?.to(`user:${targetUser._id}`).emit("elder-connection-request", { connectionId: String(connection._id) });
  res.status(201).json({ success: true, message: "Connection request sent", connectionId: connection._id });
});

router.get("/requests", async (req, res) => {
  const requests = await ElderConnection.find({ receiverPatientId: req.elderUser.patientId, status: "pending" })
    .populate("senderPatientId", "name age gender language patientCode")
    .sort({ requestedAt: -1 });
  res.json({ success: true, requests: requests.filter((item) => item.senderPatientId).map((item) => ({ id: item._id, requestedAt: item.requestedAt, patient: safeProfile(item.senderPatientId) })) });
});

router.put("/:connectionId/accept", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.connectionId)) return res.status(400).json({ success: false, message: "Invalid connection request" });
  const connection = await ElderConnection.findOneAndUpdate(
    { _id: req.params.connectionId, receiverPatientId: req.elderUser.patientId, status: "pending" },
    { status: "accepted", acceptedAt: new Date() }, { new: true },
  );
  if (!connection) return res.status(404).json({ success: false, message: "Connection request not found" });
  const senderUser = await User.findOne({ role: "patient", patientId: connection.senderPatientId }).select("_id");
  req.app.get("io")?.to(`user:${senderUser._id}`).emit("elder-connection-accepted", { connectionId: String(connection._id) });
  res.json({ success: true, message: "Connection accepted", connectionId: connection._id });
});

router.put("/:connectionId/reject", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.connectionId)) return res.status(400).json({ success: false, message: "Invalid connection request" });
  const connection = await ElderConnection.findOneAndUpdate(
    { _id: req.params.connectionId, receiverPatientId: req.elderUser.patientId, status: "pending" },
    { status: "rejected" }, { new: true },
  );
  if (!connection) return res.status(404).json({ success: false, message: "Connection request not found" });
  res.json({ success: true, message: "Connection request rejected" });
});

router.get("/connections", async (req, res) => {
  const rows = await ElderConnection.find({ status: "accepted", $or: [{ senderPatientId: req.elderUser.patientId }, { receiverPatientId: req.elderUser.patientId }] })
    .populate("senderPatientId", "name age gender language patientCode")
    .populate("receiverPatientId", "name age gender language patientCode")
    .sort({ acceptedAt: -1 });
  res.json({ success: true, connections: rows.map((row) => {
    const other = String(row.senderPatientId._id) === String(req.elderUser.patientId) ? row.receiverPatientId : row.senderPatientId;
    return { id: row._id, acceptedAt: row.acceptedAt, patient: safeProfile(other) };
  }) });
});

router.delete("/:connectionId", async (req, res) => {
  const connection = await ElderConnection.findOneAndDelete({ _id: req.params.connectionId, status: "accepted", $or: [{ senderPatientId: req.elderUser.patientId }, { receiverPatientId: req.elderUser.patientId }] });
  if (!connection) return res.status(404).json({ success: false, message: "Connection not found" });
  res.json({ success: true, message: "Connection removed" });
});

module.exports = router;
