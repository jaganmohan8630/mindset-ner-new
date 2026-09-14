import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { getUIText } from "./uiTranslations";

const notificationIdFor = (alertId) => {
  let hash = 0;
  for (const character of String(alertId)) hash = (hash * 31 + character.charCodeAt(0)) | 0;
  return (hash & 0x7fffffff) || 1;
};

const EMERGENCY_CHANNEL_ID = "wandering-emergency-alerts";

const ensureEmergencyChannel = async (language) => {
  if (!Capacitor.isNativePlatform()) return;
  await LocalNotifications.createChannel({
    id: EMERGENCY_CHANNEL_ID,
    name: getUIText(language, "emergencyNotificationChannelName"),
    description: getUIText(language, "emergencyNotificationChannelDescription"),
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

export const sendWanderingNotification = async ({ patientName, alert, language }) => {
  const distance = alert.distanceFromSafeZoneMeters >= 1000
    ? getUIText(language, "emergencyNotificationDistanceKilometers", { distance: (alert.distanceFromSafeZoneMeters / 1000).toFixed(1) })
    : getUIText(language, "emergencyNotificationDistanceMeters", { distance: Math.round(alert.distanceFromSafeZoneMeters) });
  const title = getUIText(language, "emergencyNotificationTitle");
  const body = getUIText(language, "emergencyNotificationBody", { patientName: patientName || getUIText(language, "patient"), distance });
  if (Capacitor.isNativePlatform()) {
    if (!(await requestEmergencyNotificationPermission())) return false;
    await ensureEmergencyChannel(language);
    await LocalNotifications.schedule({ notifications: [{ id: notificationIdFor(alert._id), title, body, channelId: EMERGENCY_CHANNEL_ID, schedule: { at: new Date(Date.now() + 1500), allowWhileIdle: true }, extra: { wanderingAlertId: alert._id, patientId: alert.patientId } }] });
    return true;
  }
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body, tag: `wandering-${alert._id}`, renotify: true });
    return true;
  }
  return false;
};

export const sendEmergencyTestNotification = async (language) => {
  const testAlert = {
    _id: `wandering-notification-test-${Date.now()}`,
    patientId: "test",
    distanceFromSafeZoneMeters: 100,
  };
  return sendWanderingNotification({ patientName: getUIText(language, "emergencyTestPatient"), alert: testAlert, language });
};
