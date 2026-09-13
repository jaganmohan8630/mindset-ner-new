const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "medicine",
        "hydration",
        "daily_activity",
        "appointment",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    scheduledDate: {
      type: Date,
      default: null,
    },

    scheduledTime: {
      type: String,
      required: true,
    },

    recurrence: {
      type: String,
      enum: ["once", "daily", "weekly"],
      default: "once",
    },

    daysOfWeek: {
      type: [Number],
      default: [],
    },

    active: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Reminder = mongoose.model("Reminder", reminderSchema);

module.exports = Reminder;
