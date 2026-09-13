import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

const notificationIdFor = (alertId) => {
  let hash = 0;
  for (const character of String(alertId)) hash = (hash * 31 + character.charCodeAt(0)) | 0;
  return (hash & 0x7fffffff) || 1;
};

const EMERGENCY_CHANNEL_ID = "wandering-emergency-alerts";

const ensureEmergencyChannel = async () => {
  if (!Capacitor.isNativePlatform()) return;
  await LocalNotifications.createChannel({
    id: EMERGENCY_CHANNEL_ID,
    name: "Wandering and emergency alerts",
    description: "Urgent notifications when a patient leaves the configured safe zone.",
    importance: 5,
    visibility: 1,
    sound: "default",
    vibration: true,
  });
};

export const requestEmergencyNotificationPermission = async () => {
  if (Capacitor.isNativePlatform()) {
    const permission = await LocalNotifications.checkPermissions();
    return permission.display === "granted" || (await LocalNotifications.requestPermissions()).display === "granted";
  }
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  return (await Notification.requestPermission()) === "granted";
};

export const hasEmergencyNotificationPermission = async () => {
  if (Capacitor.isNativePlatform()) {
    return (await LocalNotifications.checkPermissions()).display === "granted";
  }
  return "Notification" in window && Notification.permission === "granted";
};

export const sendWanderingNotification = async ({ patientName, alert }) => {
  const distance = alert.distanceFromSafeZoneMeters >= 1000 ? `${(alert.distanceFromSafeZoneMeters / 1000).toFixed(1)} km` : `${Math.round(alert.distanceFromSafeZoneMeters)} m`;
  const title = "Emergency: patient outside safe zone";
  const body = `${patientName || "Patient"} is ${distance} outside the safe zone.`;
  if (Capacitor.isNativePlatform()) {
    if (!(await requestEmergencyNotificationPermission())) return false;
    await ensureEmergencyChannel();
    await LocalNotifications.schedule({ notifications: [{ id: notificationIdFor(alert._id), title, body, channelId: EMERGENCY_CHANNEL_ID, schedule: { at: new Date(Date.now() + 1500), allowWhileIdle: true }, extra: { wanderingAlertId: alert._id, patientId: alert.patientId } }] });
    return true;
  }
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body, tag: `wandering-${alert._id}`, renotify: true });
    return true;
  }
  return false;
};

export const sendEmergencyTestNotification = async () => {
  const testAlert = {
    _id: `wandering-notification-test-${Date.now()}`,
    patientId: "test",
    distanceFromSafeZoneMeters: 100,
  };
  return sendWanderingNotification({ patientName: "Test patient", alert: testAlert });
};
