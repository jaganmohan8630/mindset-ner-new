const GameSession = require("../models/GameSession");

const activityNames = { memory: "Memory", attention: "Attention", routineRecall: "Routine Recall", pattern: "Pattern Recognition", objectRecognition: "Object Recognition" };
const average = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;

async function getCognitiveRisk(patientId) {
  const sessions = await GameSession.find({ patientId, completed: true }).select("gameType accuracy score averageResponseTime createdAt").sort({ createdAt: -1 }).lean();
  if (sessions.length < 6) return { success: true, sufficientData: false, overallStatus: "Insufficient data", riskLevel: "Insufficient data", confidence: 0, dataPoints: sessions.length, activityTrends: [], keyChanges: [], explanation: "At least 6 completed activity sessions are needed before a trend can be shown.", explanationCode: "riskNeedSixSessions", explanationParams: { count: 6 }, calculatedAt: new Date() };
  const activityTrends = Object.entries(activityNames).map(([gameType, name]) => {
    const records = sessions.filter((session) => session.gameType === gameType);
    if (records.length < 4) return { gameType, name, activityCode: gameType, status: "Insufficient data", dataPoints: records.length };
    const windowSize = Math.floor(records.length / 2);
    const recent = records.slice(0, windowSize);
    const previous = records.slice(windowSize, windowSize * 2);
    const recentAccuracy = average(recent.map((session) => session.accuracy));
    const previousAccuracy = average(previous.map((session) => session.accuracy));
    const change = Math.round((recentAccuracy - previousAccuracy) * 10) / 10;
    const recentResponseTime = average(recent.map((session) => session.averageResponseTime).filter(Number.isFinite));
    const previousResponseTime = average(previous.map((session) => session.averageResponseTime).filter(Number.isFinite));
    const responseTimeChange = recentResponseTime !== null && previousResponseTime !== null ? Math.round((recentResponseTime - previousResponseTime) * 10) / 10 : null;
    return { gameType, name, activityCode: gameType, status: change >= 5 ? "Improving" : change <= -5 ? "Declining" : "Stable", dataPoints: records.length, recentAccuracy: Math.round(recentAccuracy), previousAccuracy: Math.round(previousAccuracy), accuracyChange: change, responseTimeChange };
  });
  const measured = activityTrends.filter((trend) => trend.status !== "Insufficient data");
  if (!measured.length) return { success: true, sufficientData: false, overallStatus: "Insufficient data", riskLevel: "Insufficient data", confidence: 0, dataPoints: sessions.length, activityTrends, keyChanges: [], explanation: "More repeated sessions within an activity are needed to compare performance periods.", explanationCode: "riskNeedRepeatedSessions", explanationParams: {}, calculatedAt: new Date() };
  const averageChange = average(measured.map((trend) => trend.accuracyChange));
  const declining = measured.filter((trend) => trend.status === "Declining");
  const improving = measured.filter((trend) => trend.status === "Improving");
  const overallStatus = averageChange <= -5 || declining.length > improving.length ? "Declining" : averageChange >= 5 || improving.length > declining.length ? "Improving" : "Stable";
  const riskLevel = overallStatus !== "Declining" ? "Low" : (averageChange <= -12 || declining.length >= 2 ? "High" : "Moderate");
  const explanationCode = overallStatus === "Declining" ? "riskDecliningExplanation" : overallStatus === "Improving" ? "riskImprovingExplanation" : "riskStableExplanation";
  return { success: true, sufficientData: true, overallStatus, riskLevel, confidence: Math.min(90, Math.round(45 + Math.min(sessions.length, 24) * 1.5 + measured.length * 5)), dataPoints: sessions.length, recentPeriod: "Most recent half of sessions per activity", previousPeriod: "Previous comparable half of sessions", activityTrends, keyChanges: measured.filter((trend) => Math.abs(trend.accuracyChange) >= 5).sort((a, b) => Math.abs(b.accuracyChange) - Math.abs(a.accuracyChange)).slice(0, 3), explanation: overallStatus === "Declining" ? "Recent activity accuracy is lower than the previous comparable sessions. This is a performance trend, not a medical diagnosis." : overallStatus === "Improving" ? "Recent activity accuracy is higher than the previous comparable sessions." : "Recent activity performance has remained relatively stable across comparable sessions.", explanationCode, explanationParams: {}, calculatedAt: new Date() };
}
module.exports = { getCognitiveRisk };
