const GameSession = require("../models/GameSession");

async function getPerformanceAlert(patientId, gameType) {
  const query = {
    patientId,
    completed: true,
  };

  // Keep alerts separate for each activity.
  if (gameType) {
    query.gameType = gameType;
  }

  const recentSessions = await GameSession.find(query)
    .sort({ createdAt: -1 })
    .limit(5);

  if (recentSessions.length < 3) {
    return {
      alert: false,
      severity: "low",
      title: "Not Enough Data",
      message: `More completed ${
        gameType || ""
      } activities are needed before detecting a performance trend.`,
      basedOnSessions: recentSessions.length,
    };
  }

  const recentScores = recentSessions.map(
    (session) => session.score,
  );

  const newestAverage =
    (recentScores[0] + recentScores[1]) / 2;

  const olderAverage =
    (recentScores[2] +
      (recentScores[3] ?? recentScores[2]) +
      (recentScores[4] ?? recentScores[2])) /
    3;

  const decline = olderAverage - newestAverage;

  const activityName =
    gameType === "memory"
      ? "Memory"
      : gameType === "attention"
        ? "Attention"
        : "Cognitive";

  if (decline >= 15) {
    return {
      alert: true,
      severity: "high",
      title: `${activityName} Performance Decline`,
      message:
        `Recent ${activityName.toLowerCase()} performance is lower than the previous trend. ` +
        "Consider monitoring the next few activities.",
      decline: Math.round(decline),
      basedOnSessions: recentSessions.length,
    };
  }

  if (decline >= 8) {
    return {
      alert: true,
      severity: "medium",
      title: `${activityName} Performance Change`,
      message:
        `Recent ${activityName.toLowerCase()} performance shows some decline. ` +
        "Continued activities will help determine whether the change persists.",
      decline: Math.round(decline),
      basedOnSessions: recentSessions.length,
    };
  }

  return {
    alert: false,
    severity: "low",
    title: `${activityName} Performance Stable`,
    message:
      `Recent ${activityName.toLowerCase()} performance does not show a significant decline.`,
    decline: Math.max(0, Math.round(decline)),
    basedOnSessions: recentSessions.length,
  };
}

module.exports = {
  getPerformanceAlert,
};