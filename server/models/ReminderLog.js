const mongoose = require("mongoose");

const reminderLogSchema = new mongoose.Schema(
  {
    reminderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reminder",
      required: true,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    // Preserve what was scheduled even if the reminder is edited later.
    reminderTitle: {
      type: String,
      default: "",
    },

    scheduledTime: {
      type: String,
      default: "",
    },

    scheduledFor: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["completed", "missed"],
      required: true,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

reminderLogSchema.index(
  {
    reminderId: 1,
    scheduledFor: 1,
  },
  {
    unique: true,
  },
);

const ReminderLog = mongoose.model("ReminderLog", reminderLogSchema);

module.exports = ReminderLog;
