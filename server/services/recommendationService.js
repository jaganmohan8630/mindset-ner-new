const GameSession = require("../models/GameSession");
const MoodEntry = require("../models/MoodEntry");
const { getRecommendedDifficulty } = require("./adaptiveService");
async function getActivityRecommendation(patientId) {
  const latestMood = await MoodEntry.findOne({ patientId }).sort({
    createdAt: -1,
  });
  const gameTypes = [
    {
      type: "memory",
      name: "Memory Activity",
    },
    {
      type: "attention",
      name: "Attention Activity",
    },
    {
      type: "routineRecall",
      name: "Daily Routine Recall",
    },
    {
      type: "pattern",
      name: "Pattern Recognition",
    },
    {
      type: "objectRecognition",
      name: "Object Recognition",
    },
  ];

  const activityData = {};

  // Get recent history for all five cognitive activities.
  for (const game of gameTypes) {
    activityData[game.type] = await GameSession.find({
      patientId,
      completed: true,
      gameType: game.type,
    })
      .sort({ createdAt: -1 })
      .limit(5);
  }

  const totalSessions = Object.values(activityData).reduce(
    (total, sessions) => total + sessions.length,
    0,
  );

  // No previous activity history.
  if (totalSessions === 0) {
    return {
      activity: "Memory Activity",
      activityCode: "memory",
      difficulty: 1,

      memoryScore: 0,
      memoryAccuracy: 0,

      attentionScore: 0,
      attentionAccuracy: 0,

      routineRecallScore: 0,
      routineRecallAccuracy: 0,

      patternScore: 0,
      patternAccuracy: 0,

      objectRecognitionScore: 0,
      objectRecognitionAccuracy: 0,

      reason:
        "No previous activity history. Starting with a simple memory activity.",
      reasonCode: "recommendationNoHistory",
      reasonParams: {},
      basedOnSessions: 0,
    };
  }

  const calculateAverage = (sessions, field) => {
    if (sessions.length === 0) return 0;

    return (
      sessions.reduce((total, session) => total + (session[field] || 0), 0) /
      sessions.length
    );
  };

  const scores = {};
  const accuracies = {};

  gameTypes.forEach((game) => {
    scores[game.type] = calculateAverage(activityData[game.type], "score");

    accuracies[game.type] = calculateAverage(
      activityData[game.type],
      "accuracy",
    );
  });
  const performanceIndexes = {};

  gameTypes.forEach((game) => {
    // Accuracy is normalized to 0-100 across all activities,
    // so it is safer for comparing different cognitive games.
    performanceIndexes[game.type] = accuracies[game.type];
  });

  /*
   * Find the weakest activity.
   *
   * Activities with no history are ignored because we do not
   * yet have enough information to say that they are weak.
   */
  const availableActivities = gameTypes
    .filter((game) => activityData[game.type].length > 0)
    .sort((a, b) => performanceIndexes[a.type] - performanceIndexes[b.type]);

  const weakestActivity = availableActivities[0];

  let activity = weakestActivity.name;
  let activityCode = weakestActivity.type;
  let difficulty = 1;

  const adaptiveRecommendation = await getRecommendedDifficulty(
    patientId,
    weakestActivity.type,
  );

  difficulty = adaptiveRecommendation.difficulty;

  let reason = "";
  let reasonCode = "";
  let reasonParams = {};
  let priority = "low";
  const mood = latestMood?.mood;

  if (mood === "sad" || mood === "worried") {
    reason =
      "The patient's recent mood suggests a gentle and supportive activity may be helpful.";
  } else if (mood === "happy") {
    reason =
      "The patient is in a positive mood. Continue regular cognitive activities.";
  }
  const weakestPerformance = performanceIndexes[weakestActivity.type];

  // Determine recommendation priority.
  if (weakestPerformance < 60) {
    priority = "high";

    reason = `${weakestActivity.name} performance is currently ${Math.round(
      weakestPerformance,
    )}%. Additional practice and caregiver support are recommended.`;
    reasonCode = "recommendationLowPerformance";
    reasonParams = { activityCode: weakestActivity.type, score: Math.round(weakestPerformance) };
  } else if (weakestPerformance < 80) {
    priority = "medium";

    reason = `${weakestActivity.name} performance is currently ${Math.round(
      weakestPerformance,
    )}%. Additional practice is recommended.`;
    reasonCode = "recommendationMediumPerformance";
    reasonParams = { activityCode: weakestActivity.type, score: Math.round(weakestPerformance) };
  } else {
    /*
     * If all available activities are performing reasonably well,
     * choose an activity that has not been practiced recently.
     */
    const leastRecentlyPracticed = gameTypes
      .filter((game) => activityData[game.type].length === 0)
      .sort((a, b) => a.name.localeCompare(b.name))[0];

    if (leastRecentlyPracticed) {
      activity = leastRecentlyPracticed.name;
      activityCode = leastRecentlyPracticed.type;
      difficulty = 1;
      priority = "low";

      reason = `${activity} has not been practiced recently, so it is recommended to broaden cognitive training.`;
      reasonCode = "recommendationUnpracticedActivity";
      reasonParams = { activityCode };
    } else {
      activity = weakestActivity.name;
      priority = "low";

      reason =
        "Recent cognitive performance is stable, so continued practice of the lowest-performing activity is recommended.";
      reasonCode = "recommendationStablePerformance";
      reasonParams = { activityCode: weakestActivity.type };
    }
  }
  if (mood === "sad" || mood === "worried") {
    reason += " The patient may benefit from a gentle and supportive approach.";
  } else if (mood === "happy") {
    reason += " The patient appears to be in a positive mood.";
  } else if (mood === "neutral") {
    reason += " The patient may benefit from a calm and simple activity.";
  } else if (mood === "okay") {
    reason += " The patient appears to be doing okay.";
  }
  const reasonSuffixCode = mood === "sad" || mood === "worried"
    ? "recommendationMoodSupport"
    : mood === "happy"
      ? "recommendationMoodPositive"
      : mood === "neutral"
        ? "recommendationMoodCalm"
        : mood === "okay"
          ? "recommendationMoodOkay"
          : undefined;
  return {
    activity,
    activityCode,
    difficulty,
    priority,
    memoryScore: Math.round(scores.memory),
    memoryAccuracy: Math.round(accuracies.memory),

    attentionScore: Math.round(scores.attention),
    attentionAccuracy: Math.round(accuracies.attention),

    routineRecallScore: Math.round(scores.routineRecall),
    routineRecallAccuracy: Math.round(accuracies.routineRecall),

    patternScore: Math.round(scores.pattern),
    patternAccuracy: Math.round(accuracies.pattern),

    objectRecognitionScore: Math.round(scores.objectRecognition),
    objectRecognitionAccuracy: Math.round(accuracies.objectRecognition),

    reason,
    reasonCode,
    reasonParams,
    reasonSuffixCode,
    basedOnSessions: totalSessions,
  };
}

module.exports = {
  getActivityRecommendation,
};
