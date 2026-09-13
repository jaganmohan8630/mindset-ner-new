const express = require("express");
const GameSession = require("../models/GameSession");
const { getRecommendedDifficulty } = require("../services/adaptiveService");
const { getPerformanceAlert } = require("../services/alertService");
const {
  getActivityRecommendation,
} = require("../services/recommendationService");
const { protect, authorizePatient } = require("../middleware/authMiddleware");
const router = express.Router();

// Save a completed game session
// Save a completed game session
router.post(
  "/sessions",
  protect,
  authorizePatient,
  async (req, res) => {  try {
    if (req.user.role !== "patient") return res.status(403).json({ success: false, message: "Only patients can record cognitive sessions" });
    const session = await GameSession.create(req.body);

    const { emitPatientEvent } = require("../sockets/socketServer");
    emitPatientEvent(req.app.get("io"), session.patientId, "activity:updated", {
      session: {
        id: session._id,
        gameType: session.gameType,
        difficulty: session.difficulty,
        score: session.score,
        accuracy: session.accuracy,
        completed: session.completed,
        createdAt: session.createdAt,
      },
      updatedAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: "Game session saved successfully",
      session,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to save game session",
      error: error.message,
    });
  }
});

// Get game sessions for a patient
router.get(
  "/sessions/:patientId",
  protect,
  authorizePatient,
  async (req, res) => {
  try {
    const sessions = await GameSession.find({
      patientId: req.params.patientId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch game sessions",
      error: error.message,
    });
  }
});

// Get recommended difficulty for a patient
router.get(
  "/adaptive/:patientId",
  protect,
  authorizePatient,
  async (req, res) => {
    try {
      const { gameType } = req.query;

      const recommendation = await getRecommendedDifficulty(
        req.params.patientId,
        req.query.gameType,
      );

      res.json({
        success: true,
        recommendation,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to calculate adaptive difficulty",
        error: error.message,
      });
    }
  },
);

// Get patient cognitive analytics
// Get patient cognitive analytics
// Get patient cognitive analytics
router.get(
  "/analytics/:patientId",
  protect,
  authorizePatient,
  async (req, res) => {
    try {
      const sessions = await GameSession.find({
        patientId: req.params.patientId,
        completed: true,
      }).sort({ createdAt: -1 });

      // Separate sessions by cognitive activity
      const memorySessions = sessions.filter(
        (session) => session.gameType === "memory",
      );

      const attentionSessions = sessions.filter(
        (session) => session.gameType === "attention",
      );

      const routineRecallSessions = sessions.filter(
        (session) => session.gameType === "routineRecall",
      );

      const patternSessions = sessions.filter(
        (session) => session.gameType === "pattern",
      );

      const objectRecognitionSessions = sessions.filter(
        (session) => session.gameType === "objectRecognition",
      );
      const familyFamiliaritySessions = sessions.filter(
        (session) => session.gameType === "familyFamiliarity",
      );

      // Calculate average value
      const calculateAverage = (items, field) => {
        if (items.length === 0) return 0;

        return Math.round(
          items.reduce((total, item) => total + (item[field] || 0), 0) /
            items.length,
        );
      };

      const totalGames = sessions.length;

      const averageScore = calculateAverage(sessions, "score");
      const averageAccuracy = calculateAverage(sessions, "accuracy");

      // Average accuracy for each cognitive activity
      // Average accuracy using the latest 5 sessions
      // for each cognitive activity.
      const getRecentSessions = (sessions) => sessions.slice(0, 5);

      const memoryAverage = calculateAverage(
        getRecentSessions(memorySessions),
        "accuracy",
      );

      const attentionAverage = calculateAverage(
        getRecentSessions(attentionSessions),
        "accuracy",
      );

      const routineRecallAverage = calculateAverage(
        getRecentSessions(routineRecallSessions),
        "accuracy",
      );

      const patternAverage = calculateAverage(
        getRecentSessions(patternSessions),
        "accuracy",
      );

      const objectRecognitionAverage = calculateAverage(
        getRecentSessions(objectRecognitionSessions),
        "accuracy",
      );
      const familyFamiliarityAverage = calculateAverage(
        getRecentSessions(familyFamiliaritySessions),
        "accuracy",
      );
      const memoryPerformanceIndex =
        calculateAverage(getRecentSessions(memorySessions), "score") * 0.6 +
        memoryAverage * 0.4;

      const attentionPerformanceIndex =
        calculateAverage(getRecentSessions(attentionSessions), "score") * 0.6 +
        attentionAverage * 0.4;

      const routineRecallPerformanceIndex =
        calculateAverage(getRecentSessions(routineRecallSessions), "score") *
          0.6 +
        routineRecallAverage * 0.4;

      const patternPerformanceIndex =
        calculateAverage(getRecentSessions(patternSessions), "score") * 0.6 +
        patternAverage * 0.4;

      const objectRecognitionPerformanceIndex =
        calculateAverage(
          getRecentSessions(objectRecognitionSessions),
          "score",
        ) *
          0.6 +
        objectRecognitionAverage * 0.4;

      const currentDifficulty =
        sessions.length > 0 ? sessions[0].difficulty : 1;

      // Recent sessions for dashboard
      const recentSessions = sessions.slice(0, 30).map((session) => ({
        id: session._id,
        gameType: session.gameType,
        difficulty: session.difficulty,
        score: session.score,
        accuracy: session.accuracy,
        completed: session.completed,
        playedOffline: session.playedOffline,
        createdAt: session.createdAt,
      }));

      // Overall performance trend
      const performanceTrend = sessions
        .slice()
        .reverse()
        .map((session, index) => ({
          game: index + 1,
          gameType: session.gameType,
          score: session.score,
          accuracy: session.accuracy,
          difficulty: session.difficulty,
          createdAt: session.createdAt,
        }));

      // Memory trend
      const memoryTrend = memorySessions
        .slice()
        .reverse()
        .map((session, index) => ({
          game: index + 1,
          gameType: "memory",
          score: session.score,
          accuracy: session.accuracy,
          difficulty: session.difficulty,
          createdAt: session.createdAt,
        }));

      // Attention trend
      const attentionTrend = attentionSessions
        .slice()
        .reverse()
        .map((session, index) => ({
          game: index + 1,
          gameType: "attention",
          score: session.score,
          accuracy: session.accuracy,
          difficulty: session.difficulty,
          createdAt: session.createdAt,
        }));

      // Daily routine recall trend
      const routineRecallTrend = routineRecallSessions
        .slice()
        .reverse()
        .map((session, index) => ({
          game: index + 1,
          gameType: "routineRecall",
          score: session.score,
          accuracy: session.accuracy,
          difficulty: session.difficulty,
          createdAt: session.createdAt,
        }));

      // Pattern recognition trend
      const patternTrend = patternSessions
        .slice()
        .reverse()
        .map((session, index) => ({
          game: index + 1,
          gameType: "pattern",
          score: session.score,
          accuracy: session.accuracy,
          difficulty: session.difficulty,
          createdAt: session.createdAt,
        }));

      // Object recognition trend
      const objectRecognitionTrend = objectRecognitionSessions
        .slice()
        .reverse()
        .map((session, index) => ({
          game: index + 1,
          gameType: "objectRecognition",
          score: session.score,
          accuracy: session.accuracy,
          difficulty: session.difficulty,
          createdAt: session.createdAt,
        }));
      // Calculate cognitive trend for an activity
      const calculateTrend = (activitySessions) => {
        if (activitySessions.length < 4) {
          return {
            trend: "stable",
            change: 0,
          };
        }

        const recent = activitySessions.slice(0, 3);
        const previous = activitySessions.slice(3, 6);

        if (previous.length === 0) {
          return {
            trend: "stable",
            change: 0,
          };
        }

        const recentAverage = calculateAverage(recent, "accuracy");
        const previousAverage = calculateAverage(previous, "accuracy");

        const change = recentAverage - previousAverage;

        if (change >= 5) {
          return {
            trend: "improving",
            change,
          };
        }

        if (change <= -5) {
          return {
            trend: "declining",
            change,
          };
        }

        return {
          trend: "stable",
          change,
        };
      };

      const cognitiveTrends = {
        memory: calculateTrend(memorySessions),
        attention: calculateTrend(attentionSessions),
        routineRecall: calculateTrend(routineRecallSessions),
        pattern: calculateTrend(patternSessions),
        objectRecognition: calculateTrend(objectRecognitionSessions),
      };
      res.json({
        success: true,

        analytics: {
          // Overall statistics
          totalGames,
          averageScore,
          averageAccuracy,

          // Number of games completed
          memoryGames: memorySessions.length,
          attentionGames: attentionSessions.length,
          routineRecallGames: routineRecallSessions.length,
          patternGames: patternSessions.length,
          objectRecognitionGames: objectRecognitionSessions.length,
          familyFamiliarityGames: familyFamiliaritySessions.length,

          // Accuracy by activity
          memoryAverage,
          attentionAverage,
          routineRecallAverage,
          patternAverage,
          objectRecognitionAverage,
          familyFamiliarityAverage,
          memoryPerformanceIndex: Math.round(memoryPerformanceIndex),
          attentionPerformanceIndex: Math.round(attentionPerformanceIndex),
          routineRecallPerformanceIndex: Math.round(
            routineRecallPerformanceIndex,
          ),
          patternPerformanceIndex: Math.round(patternPerformanceIndex),
          objectRecognitionPerformanceIndex: Math.round(
            objectRecognitionPerformanceIndex,
          ),
          currentDifficulty,

          // Session history
          recentSessions,

          // Trends
          performanceTrend,
          memoryTrend,
          attentionTrend,
          routineRecallTrend,
          patternTrend,
          objectRecognitionTrend,
          cognitiveTrends,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to calculate patient analytics",
        error: error.message,
      });
    }
  },
);

// Get caregiver performance alert
// Get caregiver performance alert
router.get("/alerts/:patientId", protect, authorizePatient, async (req, res) => {
  try {
    const { gameType } = req.query;

    const alert = await getPerformanceAlert(req.params.patientId, gameType);

    res.json({
      success: true,
      alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to calculate performance alert",
      error: error.message,
    });
  }
});

// Get personalized activity recommendation
router.get(
  "/recommendation/:patientId",
  protect,
  authorizePatient,
  async (req, res) => {
    try {
      const recommendation = await getActivityRecommendation(
        req.params.patientId,
      );

      res.json({
        success: true,
        recommendation,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to generate activity recommendation",
        error: error.message,
      });
    }
  },
);

module.exports = router;
