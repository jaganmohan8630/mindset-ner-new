const express = require("express");
const User = require("../models/User");
const Patient = require("../models/Patient");
const Assignment = require("../models/HealthcareWorkerPatientAssignment");
const GameSession = require("../models/GameSession");
const { cognitiveStatus } = require("../services/healthcareOverviewService");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
const average = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
const requireAdmin = (req, res, next) => req.user.role === "admin"
  ? next()
  : res.status(403).json({ success: false, message: "Only administrators can manage healthcare worker assignments" });

router.get("/patients", protect, async (req, res) => {
  if (req.user.role !== "healthcare_worker") return res.status(403).json({ success: false, message: "Healthcare worker access required" });
  const assignments = await Assignment.find({ healthcareWorkerId: req.user.userId, active: true })
    .populate("patientId", "name age gender language isActive patientCode")
    .sort({ assignedAt: -1 }).lean();
  const patients = assignments.filter(({ patientId }) => patientId?.isActive)
    .map(({ _id, patientId, permissions, assignedAt }) => ({ assignmentId: _id, patient: patientId, permissions, assignedAt }));
  res.json({ success: true, count: patients.length, patients });
});

// One server-side query for all assigned patients' completed sessions. The
// worker never supplies patient IDs, so unrelated records cannot enter this
// overview.
router.get("/overview", protect, async (req, res) => {
  try {
    if (req.user.role !== "healthcare_worker") return res.status(403).json({ success: false, message: "Healthcare worker access required" });
    const assignments = await Assignment.find({ healthcareWorkerId: req.user.userId, active: true, status: "active" })
      .populate("patientId", "name isActive")
      .lean();
    const assigned = assignments.filter(({ patientId }) => patientId?.isActive);
    const patientIds = assigned.map(({ patientId }) => patientId._id);
    const sessions = patientIds.length ? await GameSession.find({ patientId: { $in: patientIds }, completed: true })
      .select("patientId gameType accuracy createdAt").sort({ createdAt: -1 }).lean() : [];
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const byPatient = new Map(patientIds.map((id) => [String(id), []]));
    sessions.forEach((session) => byPatient.get(String(session.patientId))?.push(session));
    const patients = assigned.map(({ patientId }) => {
      const patientSessions = byPatient.get(String(patientId._id)) || [];
      const recentSessions = patientSessions.filter((session) => new Date(session.createdAt) >= cutoff);
      const accuracy = average(patientSessions.map((session) => session.accuracy));
      const cognitive = cognitiveStatus(patientSessions);
      const activityLevel = recentSessions.length >= 5 ? "High" : recentSessions.length >= 2 ? "Medium" : recentSessions.length ? "Low" : "No recent activity";
      return { patientId: patientId._id, name: patientId.name, trend: cognitive.trend, status: cognitive.status, riskLevel: cognitive.riskLevel, accuracy: accuracy === null ? null : Math.round(accuracy), sessionsThisWeek: recentSessions.length, activityLevel, totalSessions: patientSessions.length };
    });
    const counted = patients.filter((patient) => patient.accuracy !== null);
    const summary = {
      timeWindow: "Last 7 days",
      totalAssignedPatients: patients.length,
      activePatients: patients.filter((patient) => patient.sessionsThisWeek > 0).length,
      stablePatients: patients.filter((patient) => patient.status === "Stable").length,
      improvingPatients: patients.filter((patient) => patient.status === "Improving").length,
      patientsNeedingAttention: patients.filter((patient) => patient.status === "Needs Attention").length,
      insufficientDataPatients: patients.filter((patient) => patient.status === "Insufficient data").length,
      averageCognitiveAccuracy: counted.length ? Math.round(average(counted.map((patient) => patient.accuracy))) : null,
      activitiesThisWeek: patients.reduce((sum, patient) => sum + patient.sessionsThisWeek, 0),
      averageActivityLevel: patients.length ? Math.round(patients.reduce((sum, patient) => sum + patient.sessionsThisWeek, 0) / patients.length * 10) / 10 : 0,
    };
    res.json({ success: true, summary, patients });
  } catch (error) { res.status(500).json({ success: false, message: "Failed to calculate healthcare overview", error: error.message }); }
});

// A worker can request access using a private patient code, but this never
// grants access until the patient explicitly accepts the request.
router.post("/assignment-requests", protect, async (req, res) => {
  try {
    if (req.user.role !== "healthcare_worker") return res.status(403).json({ success: false, message: "Healthcare worker access required" });
    const patientCode = req.body.patientCode?.trim().toUpperCase();
    if (!patientCode) return res.status(400).json({ success: false, message: "A patient code is required" });
    const patient = await Patient.findOne({ patientCode, isActive: true });
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });
    const existing = await Assignment.findOne({ healthcareWorkerId: req.user.userId, patientId: patient._id });
    if (existing?.active) return res.status(409).json({ success: false, message: "This patient is already assigned to you" });
    if (existing?.status === "pending") return res.status(409).json({ success: false, message: "An assignment request is already awaiting review" });
    const assignment = await Assignment.findOneAndUpdate(
      { healthcareWorkerId: req.user.userId, patientId: patient._id },
      { $set: { active: false, status: "pending", requestedBy: req.user.userId, assignedBy: null, assignedAt: null } },
      { upsert: true, new: true, runValidators: true },
    );
    const patientUser = await User.findOne({ role: "patient", patientId: patient._id }).select("_id");
    const io = req.app.get("io");
    if (io && patientUser) io.to(`user:${patientUser._id}`).emit("healthcareWorkerRequest:created", { assignment });
    res.status(201).json({ success: true, message: "Assignment request sent to the patient for approval", assignment });
  } catch (error) { res.status(400).json({ success: false, message: "Could not send assignment request", error: error.message }); }
});

router.get("/assignment-requests/patient", protect, async (req, res) => {
  const user = await User.findById(req.user.userId).select("role patientId");
  if (!user || user.role !== "patient" || !user.patientId) return res.status(403).json({ success: false, message: "Only patients can view healthcare worker requests" });
  const requests = await Assignment.find({ patientId: user.patientId, status: "pending", active: false })
    .populate("healthcareWorkerId", "name email")
    .sort({ updatedAt: -1 });
  res.json({ success: true, requests });
});

router.put("/assignment-requests/:assignmentId/:action", protect, async (req, res) => {
  try {
    if (!["accept", "reject"].includes(req.params.action)) return res.status(400).json({ success: false, message: "Unknown request action" });
    const user = await User.findById(req.user.userId).select("role patientId");
    if (!user || user.role !== "patient" || !user.patientId) return res.status(403).json({ success: false, message: "Only patients can respond to healthcare worker requests" });
    const accepted = req.params.action === "accept";
    const assignment = await Assignment.findOneAndUpdate(
      { _id: req.params.assignmentId, patientId: user.patientId, status: "pending", active: false },
      { $set: accepted ? { active: true, status: "active", assignedBy: user._id, assignedAt: new Date() } : { active: false, status: "rejected" } },
      { new: true },
    );
    if (!assignment) return res.status(404).json({ success: false, message: "Pending healthcare worker request not found" });
    const io = req.app.get("io");
    if (io) io.to(`user:${assignment.healthcareWorkerId}`).emit(`healthcareWorkerRequest:${accepted ? "accepted" : "rejected"}`, { assignment });
    res.json({ success: true, message: accepted ? "Healthcare worker access approved" : "Healthcare worker request declined", assignment });
  } catch (error) { res.status(500).json({ success: false, message: "Could not respond to healthcare worker request", error: error.message }); }
});

router.get("/assignment-requests", protect, requireAdmin, async (_req, res) => {
  const requests = await Assignment.find({ status: "pending", active: false }).populate("healthcareWorkerId", "name email").populate("patientId", "name patientCode").sort({ updatedAt: -1 });
  res.json({ success: true, requests });
});

router.post("/assignments", protect, requireAdmin, async (req, res) => {
  try {
    const { healthcareWorkerId, patientId, canViewMoodHistory = false } = req.body;
    if (!healthcareWorkerId || !patientId) return res.status(400).json({ success: false, message: "healthcareWorkerId and patientId are required" });
    const [worker, patient] = await Promise.all([User.findOne({ _id: healthcareWorkerId, role: "healthcare_worker" }), Patient.findById(patientId)]);
    if (!worker) return res.status(404).json({ success: false, message: "Healthcare worker not found" });
    if (!patient || !patient.isActive) return res.status(404).json({ success: false, message: "Patient not found" });
    const assignment = await Assignment.findOneAndUpdate(
      { healthcareWorkerId, patientId },
      { $set: { active: true, status: "active", permissions: { canViewMoodHistory: Boolean(canViewMoodHistory) }, assignedBy: req.user.userId, assignedAt: new Date() } },
      { upsert: true, new: true, runValidators: true },
    );
    res.status(201).json({ success: true, assignment });
  } catch (error) { res.status(400).json({ success: false, message: "Failed to assign healthcare worker", error: error.message }); }
});

router.delete("/assignments/:healthcareWorkerId/:patientId", protect, requireAdmin, async (req, res) => {
  const assignment = await Assignment.findOneAndUpdate({ healthcareWorkerId: req.params.healthcareWorkerId, patientId: req.params.patientId, active: true }, { $set: { active: false, status: "revoked" } }, { new: true });
  if (!assignment) return res.status(404).json({ success: false, message: "Active assignment not found" });
  res.json({ success: true, message: "Healthcare worker access revoked", assignment });
});

module.exports = router;
