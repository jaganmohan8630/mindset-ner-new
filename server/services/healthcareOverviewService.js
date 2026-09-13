const average = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
const activityNames = { memory: "Memory", attention: "Attention", routineRecall: "Routine Recall", pattern: "Pattern Recognition", objectRecognition: "Object Recognition" };

// Mirrors the thresholds used by the existing cognitive-risk endpoint. This is
// intentionally a shared summary of stored sessions, not a new prediction.
const cognitiveStatus = (sessions) => {
  if (sessions.length < 6) return { trend: "Insufficient data", status: "Insufficient data", riskLevel: "Insufficient data" };
  const trends = Object.keys(activityNames).map((gameType) => {
    const records = sessions.filter((session) => session.gameType === gameType);
    if (records.length < 4) return null;
    const window = Math.floor(records.length / 2);
    const recent = average(records.slice(0, window).map((session) => session.accuracy));
    const previous = average(records.slice(window, window * 2).map((session) => session.accuracy));
    return recent - previous;
  }).filter((change) => change !== null);
  if (!trends.length) return { trend: "Insufficient data", status: "Insufficient data", riskLevel: "Insufficient data" };
  const change = average(trends);
  const declining = trends.filter((value) => value <= -5).length;
  const improving = trends.filter((value) => value >= 5).length;
  const trend = change <= -5 || declining > improving ? "Declining" : change >= 5 || improving > declining ? "Improving" : "Stable";
  return { trend, status: trend === "Declining" ? "Needs Attention" : trend, riskLevel: trend === "Declining" ? (change <= -12 || declining >= 2 ? "High" : "Moderate") : "Low" };
};

module.exports = { cognitiveStatus };
