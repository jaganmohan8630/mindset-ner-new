import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

const STORAGE_KEY = "mindset_ner_scheduled_notification_ids";

const notificationIdFor = (reminderId) => {
  let hash = 0;

  for (const character of String(reminderId)) {
    hash = (hash * 31 + character.charCodeAt(0)) | 0;
  }

  return (hash & 0x7fffffff) || 1;
};

const readScheduledIds = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

const getSchedule = (reminder) => {
  const [hour, minute] = String(reminder.scheduledTime || "")
    .split(":")
    .map(Number);

  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null;

  if (reminder.recurrence === "daily") {
    return { on: { hour, minute }, allowWhileIdle: true };
  }

  if (reminder.recurrence === "weekly") {
    const day = reminder.daysOfWeek?.[0];
    // Capacitor's Weekday enum starts at Sunday = 1; JavaScript starts at 0.
    const weekday = Number.isInteger(day) ? day + 1 : undefined;
    return {
      on: { hour, minute, ...(weekday ? { weekday } : {}) },
      allowWhileIdle: true,
    };
  }

  // The caregiver form permits an optional date. In that case, schedule the
  // one-time reminder for today instead of silently discarding it. This is
  // what allows a reminder to fire after the patient closes the app.
  const at = reminder.scheduledDate
    ? new Date(reminder.scheduledDate)
    : new Date();
  at.setHours(hour, minute, 0, 0);
  if (at <= new Date()) return null;

  return { at, allowWhileIdle: true };
};

export const syncReminderNotifications = async (reminders) => {
  if (!Capacitor.isNativePlatform()) return;

  const permission = await LocalNotifications.checkPermissions();
  if (permission.display !== "granted") {
    const requested = await LocalNotifications.requestPermissions();
    if (requested.display !== "granted") return;
  }

  const previousIds = readScheduledIds();
  const nextIds = {};
  const notifications = [];

  for (const reminder of reminders) {
    if (!reminder.active) continue;

    const schedule = getSchedule(reminder);
    if (!schedule) continue;

    const id = notificationIdFor(reminder._id);
    nextIds[reminder._id] = id;
    notifications.push({
      id,
      title: `Reminder: ${reminder.title}`,
      body: reminder.description || "It is time for your scheduled activity.",
      largeBody: reminder.description || reminder.title,
      schedule,
      autoCancel: true,
      foreground: true,
      extra: { reminderId: reminder._id },
    });
  }

  const idsToCancel = [...new Set(Object.values(previousIds))];
  if (idsToCancel.length) {
    await LocalNotifications.cancel({
      notifications: idsToCancel.map((id) => ({ id })),
    });
  }

  if (notifications.length) {
    await LocalNotifications.schedule({ notifications });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds));
};
