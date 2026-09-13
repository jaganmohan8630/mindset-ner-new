const GameSession = require("../models/GameSession");
const MoodEntry = require("../models/MoodEntry");
const ReminderLog = require("../models/ReminderLog");
const WanderingAlert = require("../models/WanderingAlert");
const { getActivityRecommendation } = require("./recommendationService");
const { getCognitiveRisk } = require("./cognitiveRiskService");

const activityNames = { memory: "Memory", attention: "Attention", routineRecall: "Daily Routine Recall", pattern: "Pattern Recognition", objectRecognition: "Object Recognition" };
const priorityRank = { high: 0, medium: 1, low: 2 };

async function buildCaregiverActionPlan(patientId) {
  const [risk, recommendation, moods, recentSessions, logs, activeAlerts] = await Promise.all([
    getCognitiveRisk(patientId), getActivityRecommendation(patientId),
    MoodEntry.find({ patientId }).sort({ createdAt: -1 }).limit(3).lean(),
    GameSession.find({ patientId, completed: true }).sort({ createdAt: -1 }).limit(1).lean(),
    ReminderLog.find({ patientId }).sort({ scheduledFor: -1 }).limit(30).lean(),
    WanderingAlert.find({ patientId, status: { $in: ["active", "acknowledged"] } }).sort({ createdAt: -1 }).lean(),
  ]);
  const actions = [];
  const add = (action) => actions.push(action);
  const declining = risk.activityTrends.filter((trend) => trend.status === "Declining");
  for (const trend of declining) {
    add({ actionKey: `cognitive-declining-${trend.gameType}-${trend.previousAccuracy}-${trend.recentAccuracy}`, actionType: "cognitive_activity", priority: risk.riskLevel === "High" ? "high" : "medium", recommendation: `Encourage ${activityNames[trend.gameType] || trend.name} activity`, reason: `${trend.name} accuracy declined from ${trend.previousAccuracy}% to ${trend.recentAccuracy}% across comparable recent sessions.` });
  }
  if (!declining.length && ["high", "medium"].includes(recommendation.priority)) {
    add({ actionKey: `cognitive-performance-${recommendation.activity.replace(/[^a-z]/gi, "").toLowerCase()}-${recommendation.basedOnSessions}`, actionType: "cognitive_activity", priority: recommendation.priority, recommendation: `Encourage ${recommendation.activity}`, reason: recommendation.reason });
  }
  const latestMood = moods[0];
  if (latestMood && ["sad", "worried"].includes(latestMood.mood)) {
    const changed = moods[1] && moods[1].mood !== latestMood.mood;
    add({ actionKey: `mood-follow-up-${latestMood._id}`, actionType: "mood_follow_up", priority: latestMood.mood === "worried" ? "medium" : "low", recommendation: "Review recent mood changes", reason: changed ? `The latest mood is ${latestMood.label}, which changed from the previous check-in.` : `The latest mood check-in is ${latestMood.label}; a supportive follow-up may be helpful.` });
  }
  const lastSessionAt = recentSessions[0]?.createdAt;
  if (!lastSessionAt || Date.now() - new Date(lastSessionAt).getTime() > 7 * 24 * 60 * 60 * 1000) {
    add({ actionKey: `activity-frequency-${lastSessionAt ? new Date(lastSessionAt).toISOString() : "none"}`, actionType: "monitoring", priority: "low", recommendation: "Encourage regular cognitive activity", reason: lastSessionAt ? "No completed cognitive activity has been recorded in the past 7 days." : "No completed cognitive activity has been recorded yet." });
  }
  if (logs.length) {
    const completed = logs.filter((log) => log.status === "completed").length;
    const adherence = Math.round((completed / logs.length) * 100);
    if (adherence < 80) add({ actionKey: `reminder-adherence-${logs[0]._id}-${adherence}`, actionType: "reminder_follow_up", priority: adherence < 50 ? "high" : "medium", recommendation: "Check reminder adherence", reason: `Reminder completion is ${adherence}% across the latest ${logs.length} recorded reminders.` });
  }
  for (const alert of activeAlerts) add({ actionKey: `safety-${alert._id}`, actionType: "safety_follow_up", priority: "high", recommendation: "Follow up on active safety alert", reason: `A wandering safety alert is ${alert.status} and requires caregiver attention.` });
  actions.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
  const status = actions.some((action) => action.priority === "high") ? "Needs Attention" : actions.length ? "Monitor" : "Stable";
  return { status, summary: actions.length ? "Recommended actions are based on current patient activity, trend, mood, reminder, and safety data." : "Patient is currently stable. Continue regular cognitive activities and monitoring.", actions, risk };
}

module.exports = { buildCaregiverActionPlan };
