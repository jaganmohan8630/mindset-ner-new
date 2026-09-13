const mongoose = require("mongoose");

const moodEntrySchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    mood: {
      type: String,
      enum: ["happy", "okay", "neutral", "worried", "sad"],
      required: true,
    },

    label: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MoodEntry = mongoose.model("MoodEntry", moodEntrySchema);

module.exports = MoodEntry;
