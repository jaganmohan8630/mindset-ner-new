const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");
const Patient = require("../models/Patient");
const User = require("../models/User");
const ElderConnection = require("../models/ElderConnection");
const ElderMessage = require("../models/ElderMessage");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
const audioDirectory = path.join(__dirname, "..", "uploads", "elder-messages");
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024, files: 1 }, fileFilter: (_req, file, done) => done(null, /^audio\//.test(file.mimetype)) });

const patientOnly = async (req, res, next) => {
  const user = await User.findById(req.user.userId).select("role patientId");
  if (!user || user.role !== "patient" || !user.patientId) return res.status(403).json({ success: false, message: "Only patients can send elder messages" });
  req.elderPatientId = user.patientId;
  next();
};
const acceptedPeer = async (ownId, peerId) => ElderConnection.findOne({ status: "accepted", $or: [{ senderPatientId: ownId, receiverPatientId: peerId }, { senderPatientId: peerId, receiverPatientId: ownId }] });
const saveAudio = (file) => { fs.mkdirSync(audioDirectory, { recursive: true }); const extension = file.mimetype.includes("ogg") ? ".ogg" : file.mimetype.includes("mp4") ? ".m4a" : ".webm"; const filename = `${crypto.randomUUID()}${extension}`; fs.writeFileSync(path.join(audioDirectory, filename), file.buffer); return filename; };
const messageView = (message, ownId) => ({ id: message._id, type: message.type, text: message.text, createdAt: message.createdAt, mine: String(message.senderPatientId) === String(ownId), audioUrl: message.type === "audio" ? `/api/elder-messages/audio/${message._id}` : null });

router.use(protect, patientOnly);
router.get("/connections", async (req, res) => {
  const rows = await ElderConnection.find({ status: "accepted", $or: [{ senderPatientId: req.elderPatientId }, { receiverPatientId: req.elderPatientId }] }).populate("senderPatientId", "name age language").populate("receiverPatientId", "name age language");
  res.json({ success: true, connections: rows.map((row) => { const patient = String(row.senderPatientId._id) === String(req.elderPatientId) ? row.receiverPatientId : row.senderPatientId; return { id: patient._id, name: patient.name, age: patient.age, language: patient.language }; }) });
});
router.get("/with/:patientId", async (req, res) => {
  if (!(await acceptedPeer(req.elderPatientId, req.params.patientId))) return res.status(403).json({ success: false, message: "Messaging is available only for connected elders" });
  const messages = await ElderMessage.find({ $or: [{ senderPatientId: req.elderPatientId, receiverPatientId: req.params.patientId }, { senderPatientId: req.params.patientId, receiverPatientId: req.elderPatientId }] }).sort({ createdAt: -1 }).limit(100).lean();
  res.json({ success: true, messages: messages.reverse().map((message) => messageView(message, req.elderPatientId)) });
});
router.post("/text/:patientId", async (req, res) => {
  const text = String(req.body.text || "").trim();
  if (!text) return res.status(400).json({ success: false, message: "Write a message first" });
  if (!(await acceptedPeer(req.elderPatientId, req.params.patientId))) return res.status(403).json({ success: false, message: "Messaging is available only for connected elders" });
  const message = await ElderMessage.create({ senderPatientId: req.elderPatientId, receiverPatientId: req.params.patientId, type: "text", text });
  const receiver = await User.findOne({ role: "patient", patientId: req.params.patientId }).select("_id");
  req.app.get("io")?.to(`user:${receiver._id}`).emit("elder-message:new", { fromPatientId: String(req.elderPatientId) });
  res.status(201).json({ success: true, message: messageView(message, req.elderPatientId) });
});
router.post("/audio/:patientId", upload.single("audio"), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "Audio recording is required" });
  if (!(await acceptedPeer(req.elderPatientId, req.params.patientId))) return res.status(403).json({ success: false, message: "Messaging is available only for connected elders" });
  const filename = saveAudio(req.file);
  const message = await ElderMessage.create({ senderPatientId: req.elderPatientId, receiverPatientId: req.params.patientId, type: "audio", audio: { filename, mimeType: req.file.mimetype, durationMs: Number(req.body.durationMs) || 0 } });
  const receiver = await User.findOne({ role: "patient", patientId: req.params.patientId }).select("_id");
  req.app.get("io")?.to(`user:${receiver._id}`).emit("elder-message:new", { fromPatientId: String(req.elderPatientId) });
  res.status(201).json({ success: true, message: messageView(message, req.elderPatientId) });
});
router.get("/audio/:messageId", async (req, res) => {
  const message = await ElderMessage.findById(req.params.messageId);
  if (!message || message.type !== "audio" || (![message.senderPatientId, message.receiverPatientId].some((id) => String(id) === String(req.elderPatientId)))) return res.status(404).json({ success: false, message: "Audio message not found" });
  const filePath = path.join(audioDirectory, message.audio.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, message: "Audio file not found" });
  res.type(message.audio.mimeType); return res.sendFile(filePath);
});
module.exports = router;
