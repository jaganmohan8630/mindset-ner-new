const Reminder = require("../models/Reminder");
const ReminderLog = require("../models/ReminderLog");

const CHECK_INTERVAL = 60 * 1000; // check every 1 minute

const getScheduledDate = (reminder, now) => {
  const [hours, minutes] = reminder.scheduledTime.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  const scheduled = new Date(now);

  scheduled.setHours(hours, minutes, 0, 0);

  if (reminder.recurrence === "once") {
    if (!reminder.scheduledDate) {
      return null;
    }

    const reminderDate = new Date(reminder.scheduledDate);

    scheduled.setFullYear(
      reminderDate.getFullYear(),
      reminderDate.getMonth(),
      reminderDate.getDate(),
    );

    return scheduled;
  }

  if (reminder.recurrence === "daily") {
    return scheduled;
  }

  if (reminder.recurrence === "weekly") {
    if (
      reminder.daysOfWeek?.length > 0 &&
      !reminder.daysOfWeek.includes(now.getDay())
    ) {
      return null;
    }

    return scheduled;
  }

  return null;
};

const checkMissedReminders = async (io) => {
  try {
    const now = new Date();

    const reminders = await Reminder.find({
      active: true,
    });

    for (const reminder of reminders) {
      const scheduledFor = getScheduledDate(reminder, now);

      if (!scheduledFor) {
        continue;
      }

      if (scheduledFor >= now) {
        continue;
      }

      const ageInMinutes = (now.getTime() - scheduledFor.getTime()) / 60000;

      // Give the patient 5 minutes to respond.
      if (ageInMinutes < 5) {
        continue;
      }

      // Check whether this reminder occurrence already has a log.
      const existingLog = await ReminderLog.findOne({
        reminderId: reminder._id,
        patientId: reminder.patientId,
        scheduledFor,
      });

      // Never overwrite a completed reminder.
      if (existingLog?.status === "completed") {
        continue;
      }

      // Already recorded as missed.
      if (existingLog?.status === "missed") {
        continue;
      }

      const log = await ReminderLog.create({
        reminderId: reminder._id,
        patientId: reminder.patientId,
        reminderTitle: reminder.title,
        scheduledTime: reminder.scheduledTime,
        scheduledFor,
        status: "missed",
        completedAt: null,
      });

      // Notify only the patient and caregivers already authorized for this
      // patient room, so an open caregiver dashboard refreshes immediately.
      if (io) {
        io.to(`patient:${reminder.patientId}`).emit("reminder:updated", {
          patientId: String(reminder.patientId),
          action: "missed",
          reminderId: String(reminder._id),
          log,
        });
      }

      console.log(
        `Missed reminder recorded: ${reminder.title} (${scheduledFor.toISOString()})`,
      );
    }
  } catch (error) {
    console.error("Reminder scheduler error:", error.message);
  }
};

const startReminderScheduler = (io) => {
  console.log("Reminder scheduler started");

  checkMissedReminders(io);

  setInterval(() => checkMissedReminders(io), CHECK_INTERVAL);
};

module.exports = {
  startReminderScheduler,
  checkMissedReminders,
};
