const express = require("express");
const Reminder = require("../models/Reminder");
const ReminderLog = require("../models/ReminderLog");
const { protect, authorizePatient } = require("../middleware/authMiddleware");
const router = express.Router();
const preventHealthcareWorkerWrite = (req, res, next) => {
  if (req.user.role === "healthcare_worker") return res.status(403).json({ success: false, message: "Healthcare workers have read-only patient access" });
  next();
};

const getScheduledFor = (reminder, now = new Date()) => {
  const [hours, minutes] = reminder.scheduledTime.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  const scheduledFor = new Date(now);

  if (reminder.recurrence === "once" && reminder.scheduledDate) {
    const configuredDate = new Date(reminder.scheduledDate);
    scheduledFor.setFullYear(
      configuredDate.getFullYear(),
      configuredDate.getMonth(),
      configuredDate.getDate(),
    );
  }

  scheduledFor.setHours(hours, minutes, 0, 0);
  return scheduledFor;
};

const authorizeReminderPatient = async (req, res, next) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found",
      });
    }

    const User = require("../models/User");
    const CaregiverPatientConnection = require("../models/CaregiverPatientConnection");

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Patient can access only their own reminders.
    if (user.role === "patient") {
      if (
        !user.patientId ||
        String(user.patientId) !== String(reminder.patientId)
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to access this reminder",
        });
      }
    }

    // Caregivers and healthcare workers can access
    // reminders only for patients with an accepted connection.
    if (
      user.role === "caregiver" ||
      user.role === "healthcare_worker"
    ) {
      const connection =
        await CaregiverPatientConnection.findOne({
          caregiverId: user._id,
          patientId: reminder.patientId,
          status: "accepted",
        });

      if (!connection) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to access this reminder",
        });
      }
    }

    req.reminder = reminder;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to verify reminder access",
      error: error.message,
    });
  }
};
// Get all reminders for a patient
router.get("/:patientId", protect, authorizePatient, async (req, res) => {
  try {
    const reminders = await Reminder.find({
      patientId: req.params.patientId,
      active: true,
    }).sort({
      scheduledDate: 1,
      scheduledTime: 1,
    });

    res.json({
      success: true,
      count: reminders.length,
      reminders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reminders",
      error: error.message,
    });
  }
});

// Create a reminder
router.post("/", protect, authorizePatient, preventHealthcareWorkerWrite, async (req, res) => {
  try {
    const reminder = await Reminder.create({
      ...req.body,
      createdBy: req.user.userId,
    });

    const { emitPatientEvent } = require("../sockets/socketServer");
    emitPatientEvent(req.app.get("io"), reminder.patientId, "reminder:updated", {
      action: "created",
      reminder,
    });

    res.status(201).json({
      success: true,
      message: "Reminder created successfully",
      reminder,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create reminder",
      error: error.message,
    });
  }
});

// Update a reminder
// Mark a reminder as completed
// Mark a reminder as completed
router.post(
  "/:id/complete",
  protect,
  authorizeReminderPatient,
  preventHealthcareWorkerWrite,
  async (req, res) => {
    try {
      const reminder = await Reminder.findById(req.params.id);

      if (!reminder) {
        return res.status(404).json({
          success: false,
          message: "Reminder not found",
        });
      }

      const now = new Date();

      const [hours, minutes] = reminder.scheduledTime.split(":").map(Number);

      if (Number.isNaN(hours) || Number.isNaN(minutes)) {
        return res.status(400).json({
          success: false,
          message: "Invalid reminder time",
        });
      }

      const scheduledFor = getScheduledFor(reminder, now);
      console.log("COMPLETE DEBUG");
      console.log("Reminder:", reminder.title);
      console.log("Scheduled time:", reminder.scheduledTime);
      console.log("Generated scheduledFor:", scheduledFor.toISOString());
      const log = await ReminderLog.findOneAndUpdate(
        {
          reminderId: reminder._id,
          patientId: reminder.patientId,
          scheduledFor,
        },
        {
          reminderId: reminder._id,
          patientId: reminder.patientId,
          reminderTitle: reminder.title,
          scheduledTime: reminder.scheduledTime,
          scheduledFor,
          status: "completed",
          completedAt: new Date(),
        },
        {
          returnDocument: "after",
          upsert: true,
          setDefaultsOnInsert: true,
        },
      );

      const { emitPatientEvent } = require("../sockets/socketServer");
      emitPatientEvent(req.app.get("io"), reminder.patientId, "reminder:updated", {
        action: "completed",
        reminderId: String(reminder._id),
        log,
      });

      res.json({
        success: true,
        message: "Reminder marked as completed",
        log,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to complete reminder",
        error: error.message,
      });
    }
  },
);
// Mark a reminder as missed
router.post(
  "/:id/missed",
  protect,
  authorizeReminderPatient,
  preventHealthcareWorkerWrite,
  async (req, res) => {
    try {
      const reminder = await Reminder.findById(req.params.id);

      if (!reminder) {
        return res.status(404).json({
          success: false,
          message: "Reminder not found",
        });
      }

      const now = new Date();

      const [hours, minutes] = reminder.scheduledTime.split(":").map(Number);

      if (Number.isNaN(hours) || Number.isNaN(minutes)) {
        return res.status(400).json({
          success: false,
          message: "Invalid reminder time",
        });
      }

      const scheduledFor = getScheduledFor(reminder, now);

      const ageInMinutes = (now.getTime() - scheduledFor.getTime()) / 60000;

      // The patient gets 5 minutes to respond.
      if (ageInMinutes < 5) {
        return res.status(400).json({
          success: false,
          message: "Reminder is still within the 5-minute response window",
        });
      }

      // Don't overwrite a completed reminder.
      const existingLog = await ReminderLog.findOne({
        reminderId: reminder._id,
        patientId: reminder.patientId,
        scheduledFor,
      });

      if (existingLog?.status === "completed") {
        return res.json({
          success: true,
          message: "Reminder was already completed",
          log: existingLog,
        });
      }

      const log = await ReminderLog.findOneAndUpdate(
        {
          reminderId: reminder._id,
          patientId: reminder.patientId,
          scheduledFor,
        },
        {
          reminderId: reminder._id,
          patientId: reminder.patientId,
          reminderTitle: reminder.title,
          scheduledTime: reminder.scheduledTime,
          scheduledFor,
          status: "missed",
          completedAt: null,
        },
        {
          returnDocument: "after",
          upsert: true,
          setDefaultsOnInsert: true,
        },
      );

      const { emitPatientEvent } = require("../sockets/socketServer");
      emitPatientEvent(req.app.get("io"), reminder.patientId, "reminder:updated", {
        action: "missed",
        reminderId: String(reminder._id),
        log,
      });

      res.json({
        success: true,
        message: "Reminder marked as missed",
        log,
      });
    } catch (error) {
      console.error("Failed to mark reminder as missed:", error);

      res.status(500).json({
        success: false,
        message: "Failed to mark reminder as missed",
        error: error.message,
      });
    }
  },
);

router.put("/:id", protect, authorizeReminderPatient, preventHealthcareWorkerWrite, async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found",
      });
    }

    const { emitPatientEvent } = require("../sockets/socketServer");
    emitPatientEvent(req.app.get("io"), reminder.patientId, "reminder:updated", {
      action: "updated",
      reminder,
    });

    res.json({
      success: true,
      message: "Reminder updated successfully",
      reminder,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update reminder",
      error: error.message,
    });
  }
});

// Delete/deactivate a reminder
router.delete("/:id", protect, authorizeReminderPatient, preventHealthcareWorkerWrite, async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { returnDocument: "after" },
    );

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found",
      });
    }

    const { emitPatientEvent } = require("../sockets/socketServer");
    emitPatientEvent(req.app.get("io"), reminder.patientId, "reminder:updated", {
      action: "deleted",
      reminderId: String(reminder._id),
    });

    res.json({
      success: true,
      message: "Reminder deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete reminder",
      error: error.message,
    });
  }
});

// Get reminder adherence for a patient
router.get(
  "/:patientId/adherence",
  protect,
  authorizePatient,
  async (req, res) => {
    try {
      const patientId = req.params.patientId;

      const reminders = await Reminder.find({
        patientId,
        active: true,
      });

      const now = new Date();

      // Create missed logs for reminders that have passed
      for (const reminder of reminders) {
        if (!reminder.scheduledTime) {
          continue;
        }

        const [hours, minutes] = reminder.scheduledTime.split(":").map(Number);

        if (Number.isNaN(hours) || Number.isNaN(minutes)) {
          continue;
        }

        // DAILY REMINDER
        if (reminder.recurrence === "daily") {
          const scheduledFor = new Date();

          scheduledFor.setHours(hours, minutes, 0, 0);

          // Only process reminders whose time has passed
          const ageInMinutes = (now.getTime() - scheduledFor.getTime()) / 60000;

          if (ageInMinutes >= 5) {
            const existingLog = await ReminderLog.findOne({
              reminderId: reminder._id,
              patientId,
              scheduledFor,
            });

            if (!existingLog) {
              await ReminderLog.create({
                reminderId: reminder._id,
                patientId,
                reminderTitle: reminder.title,
                scheduledTime: reminder.scheduledTime,
                scheduledFor,
                status: "missed",
              });
            }
          }
        }

        // ONCE REMINDER
        if (reminder.recurrence === "once") {
          if (!reminder.scheduledDate) {
            continue;
          }

          const scheduledFor = new Date(reminder.scheduledDate);

          scheduledFor.setHours(hours, minutes, 0, 0);

          const ageInMinutes = (now.getTime() - scheduledFor.getTime()) / 60000;

          // Do not count a reminder while its five-minute response window is open.
          if (ageInMinutes >= 5) {
            const existingLog = await ReminderLog.findOne({
              reminderId: reminder._id,
              patientId,
              scheduledFor,
            });

            if (!existingLog) {
              await ReminderLog.create({
                reminderId: reminder._id,
                patientId,
                reminderTitle: reminder.title,
                scheduledTime: reminder.scheduledTime,
                scheduledFor,
                status: "missed",
              });
            }
          }
        }

        // WEEKLY REMINDER
        if (reminder.recurrence === "weekly") {
          const scheduledFor = new Date();

          scheduledFor.setHours(hours, minutes, 0, 0);

          const today = scheduledFor.getDay();

          const ageInMinutes = (now.getTime() - scheduledFor.getTime()) / 60000;

          if (
            ageInMinutes >= 5 &&
            (!reminder.daysOfWeek?.length ||
              reminder.daysOfWeek.includes(today))
          ) {
            const existingLog = await ReminderLog.findOne({
              reminderId: reminder._id,
              patientId,
              scheduledFor,
            });

            if (!existingLog) {
              await ReminderLog.create({
                reminderId: reminder._id,
                patientId,
                reminderTitle: reminder.title,
                scheduledTime: reminder.scheduledTime,
                scheduledFor,
                status: "missed",
              });
            }
          }
        }
      }

      // Get all logs after missed detection
      const logs = await ReminderLog.find({
        patientId,
      })
        .populate("reminderId", "title type scheduledTime recurrence")
        .sort({ scheduledFor: -1 })
        .limit(30);

      const completed = logs.filter((log) => log.status === "completed").length;

      const missed = logs.filter((log) => log.status === "missed").length;

      const total = logs.length;

      const adherenceRate =
        total > 0 ? Math.round((completed / total) * 100) : 0;

      res.json({
        success: true,
        adherence: {
          total,
          completed,
          missed,
          adherenceRate,
          logs,
        },
      });
    } catch (error) {
      console.error("Reminder adherence error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch reminder adherence",
        error: error.message,
      });
    }
  },
);

module.exports = router;
