const GameSession = require("../models/GameSession");
const MoodEntry = require("../models/MoodEntry");
const Reminder = require("../models/Reminder");
const ReminderLog = require("../models/ReminderLog");
const DailyCarePlanCompletion = require("../models/DailyCarePlanCompletion");
const { getActivityRecommendation } = require("./recommendationService");

const activityTypes = { "Memory Activity": "memory", "Attention Activity": "attention", "Daily Routine Recall": "routineRecall", "Pattern Recognition": "pattern", "Object Recognition": "objectRecognition" };
const dateKey = (date) => new Intl.DateTimeFormat("en-CA").format(date);
const isScheduledToday = (reminder, now) => {
  if (!reminder.active) return false;
  if (reminder.recurrence === "daily") return true;
  if (reminder.recurrence === "weekly") return !reminder.daysOfWeek?.length || reminder.daysOfWeek.includes(now.getDay());
  return reminder.scheduledDate && dateKey(new Date(reminder.scheduledDate)) === dateKey(now);
};

async function getDailyCarePlan(patientId, requestedDate) {
  const date = requestedDate ? new Date(`${requestedDate}T12:00:00`) : new Date();
  if (Number.isNaN(date.getTime())) throw new Error("Invalid care plan date");
  const planDate = requestedDate || dateKey(date);
  const [recommendation, reminders, moods, logs, sessions, completions] = await Promise.all([
    getActivityRecommendation(patientId),
    Reminder.find({ patientId, active: true }).lean(),
    MoodEntry.find({ patientId }).sort({ createdAt: -1 }).limit(20).lean(),
    ReminderLog.find({ patientId }).sort({ scheduledFor: -1 }).limit(100).lean(),
    GameSession.find({ patientId, completed: true }).sort({ createdAt: -1 }).limit(100).lean(),
    DailyCarePlanCompletion.find({ patientId, date: planDate }).lean(),
  ]);
  const completionKeys = new Set(completions.map((completion) => completion.itemKey));
  const todayMoods = moods.filter((entry) => dateKey(new Date(entry.createdAt)) === planDate);
  const type = activityTypes[recommendation.activity] || "memory";
  const activityDone = completionKeys.has(`activity-${type}`) || sessions.some((session) => session.gameType === type && dateKey(new Date(session.createdAt)) === planDate);
  const items = [{ key: `activity-${type}`, type: "activity", title: recommendation.activity, detail: recommendation.reason, completed: activityDone, canComplete: true }];
  items.push({ key: "mood-check", type: "mood", title: "Mood Check", detail: todayMoods.length ? "Today's mood check is complete." : "Complete today's mood check.", completed: todayMoods.length > 0, canComplete: false });
  for (const reminder of reminders.filter((reminder) => isScheduledToday(reminder, date))) {
    const completed = logs.some((log) => String(log.reminderId) === String(reminder._id) && log.status === "completed" && dateKey(new Date(log.scheduledFor)) === planDate);
    items.push({ key: `reminder-${reminder._id}`, type: "reminder", title: reminder.title, detail: `${reminder.scheduledTime} reminder`, completed, canComplete: false, scheduledTime: reminder.scheduledTime });
  }
  const completed = items.filter((item) => item.completed).length;
  return { date: planDate, focus: recommendation.activity, items, progress: { completed, total: items.length } };
}

module.exports = { getDailyCarePlan };
