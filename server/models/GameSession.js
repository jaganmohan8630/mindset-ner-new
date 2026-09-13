const mongoose = require("mongoose");

const gameSessionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    gameType: {
      type: String,
      enum: [
        "memory",
        "attention",
        "pattern",
        "objectRecognition",
        "familyFamiliarity",
        "routineRecall",
      ],
      required: true,
    },

    difficulty: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
    },

    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },

    correctAnswers: {
      type: Number,
      required: true,
      min: 0,
    },

    accuracy: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    averageResponseTime: {
      type: Number,
      required: true,
      min: 0,
    },

    completed: {
      type: Boolean,
      default: true,
    },

    playedOffline: {
      type: Boolean,
      default: false,
    },

    synced: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const GameSession = mongoose.model(
  "GameSession",
  gameSessionSchema
);

module.exports = GameSession;
