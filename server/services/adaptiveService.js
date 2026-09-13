const GameSession = require("../models/GameSession");

async function getRecommendedDifficulty(patientId, gameType) {
  const query = {
    patientId,
    completed: true,
  };

  // Keep adaptation separate for each cognitive activity.
  if (gameType) {
    query.gameType = gameType;
  }

  // Analyze the most recent 5 sessions.
  const recentSessions = await GameSession.find(query)
    .sort({ createdAt: -1 })
    .limit(5);

  // No previous history.
  if (recentSessions.length === 0) {
    return {
      difficulty: 1,
      averageScore: 0,
      averageAccuracy: 0,
      averageResponseTime: 0,
      performanceIndex: 0,
      trend: "baseline",
      reason: `No previous ${gameType || "game"} history. Starting with an easy level.`,
      basedOnSessions: 0,
      adaptationModel: "adaptive-performance-model",
    };
  }

  // ---------------------------------------------------------
  // 1. Average accuracy
  // ---------------------------------------------------------
  const averageAccuracy =
    recentSessions.reduce(
      (total, session) => total + (session.accuracy || 0),
      0,
    ) / recentSessions.length;

  // ---------------------------------------------------------
  // 2. Average score
  // ---------------------------------------------------------
  const averageScore =
    recentSessions.reduce(
      (total, session) => total + (session.score || 0),
      0,
    ) / recentSessions.length;

  // ---------------------------------------------------------
  // 3. Average response time
  // ---------------------------------------------------------
  const responseTimes = recentSessions
    .map((session) => session.averageResponseTime || 0)
    .filter((time) => time > 0);

  const averageResponseTime =
    responseTimes.length > 0
      ? responseTimes.reduce((total, time) => total + time, 0) /
        responseTimes.length
      : 0;

  // ---------------------------------------------------------
  // 4. Response-time performance
  //
  // Compare the latest session with the previous sessions.
  // Lower response time with good accuracy indicates stronger
  // task performance.
  // ---------------------------------------------------------
  let responsePerformance = 50;

  if (responseTimes.length >= 2) {
    const latestResponseTime = responseTimes[0];

    const previousResponseTimes = responseTimes.slice(1);

    const previousAverage =
      previousResponseTimes.reduce(
        (total, time) => total + time,
        0,
      ) / previousResponseTimes.length;

    if (previousAverage > 0) {
      const improvement =
        ((previousAverage - latestResponseTime) /
          previousAverage) *
        100;

      responsePerformance = Math.min(
        Math.max(50 + improvement, 0),
        100,
      );
    }
  }

  // ---------------------------------------------------------
  // 5. Consistency
  //
  // Smaller accuracy variation = more consistent performance.
  // ---------------------------------------------------------
  const accuracyValues = recentSessions.map(
    (session) => session.accuracy || 0,
  );

  const accuracyVariance =
    accuracyValues.reduce(
      (total, accuracy) =>
        total + Math.pow(accuracy - averageAccuracy, 2),
      0,
    ) / accuracyValues.length;

  const accuracyStandardDeviation = Math.sqrt(accuracyVariance);

  const consistencyScore = Math.min(
    Math.max(100 - accuracyStandardDeviation * 2, 0),
    100,
  );

  // ---------------------------------------------------------
  // 6. Adaptive Performance Index
  //
  // Accuracy      = 60%
  // Response time = 25%
  // Consistency   = 15%
  // ---------------------------------------------------------
  const performanceIndex =
    averageAccuracy * 0.6 +
    responsePerformance * 0.25 +
    consistencyScore * 0.15;

  // ---------------------------------------------------------
  // 7. Current difficulty
  // ---------------------------------------------------------
  const currentDifficulty = Math.min(
    Math.max(recentSessions[0].difficulty || 1, 1),
    5,
  );

  let recommendedDifficulty = currentDifficulty;
  let trend = "stable";
  let reason = "";

  // ---------------------------------------------------------
  // 8. Adaptive decision
  // ---------------------------------------------------------

  if (performanceIndex >= 80 && averageAccuracy >= 75) {
    recommendedDifficulty = Math.min(
      currentDifficulty + 1,
      5,
    );

    trend = "improving";

    reason =
      "The patient's recent accuracy, response performance, and consistency indicate strong cognitive performance. A slightly higher difficulty is recommended.";
  } else if (performanceIndex < 55 || averageAccuracy < 50) {
    recommendedDifficulty = Math.max(
      currentDifficulty - 1,
      1,
    );

    trend = "declining";

    reason =
      "Recent performance indicates difficulty with the activity. A slightly easier level is recommended to support continued engagement.";
  } else {
    recommendedDifficulty = currentDifficulty;

    trend = "stable";

    reason =
      "Recent cognitive performance is within the stable range, so the current difficulty is maintained.";
  }

  console.log("ADAPTIVE PERFORMANCE:", {
    patientId,
    gameType,
    averageAccuracy: Math.round(averageAccuracy),
    averageScore: Math.round(averageScore),
    averageResponseTime: Math.round(averageResponseTime),
    responsePerformance: Math.round(responsePerformance),
    consistencyScore: Math.round(consistencyScore),
    performanceIndex: Math.round(performanceIndex),
    currentDifficulty,
    recommendedDifficulty,
    trend,
  });

  return {
    difficulty: recommendedDifficulty,

    averageScore: Math.round(averageScore),

    averageAccuracy: Math.round(averageAccuracy),

    averageResponseTime: Math.round(averageResponseTime),

    responsePerformance: Math.round(responsePerformance),

    consistencyScore: Math.round(consistencyScore),

    performanceIndex: Math.round(performanceIndex),

    trend,

    reason,

    basedOnSessions: recentSessions.length,

    adaptationModel: "adaptive-performance-model",
  };
}

module.exports = {
  getRecommendedDifficulty,
};