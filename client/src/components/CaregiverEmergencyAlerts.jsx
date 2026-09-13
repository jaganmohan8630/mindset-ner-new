import { useEffect, useState } from "react";
import { API_URL } from "../api";
import { socket } from "../socket";
import EmergencyAlertMap from "./EmergencyAlertMap";
import { caregiverText } from "../caregiverTranslations";
import {
  requestEmergencyNotificationPermission,
  hasEmergencyNotificationPermission,
  sendEmergencyTestNotification,
} from "../emergencyNotifications";

const formatTime = (value) => new Date(value).toLocaleString();
const formatDistance = (value) => value >= 1000 ? `${(value / 1000).toFixed(2)} km outside` : `${Math.round(value)} m outside`;
const directionsUrl = (alert) => {
  const origin = `${alert.safeZone.latitude},${alert.safeZone.longitude}`;
  const destination = `${alert.lastKnownLocation.latitude},${alert.lastKnownLocation.longitude}`;
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
};

function CaregiverEmergencyAlerts({ patient, language = "en-IN" }) {
  const t = (key) => caregiverText(language, key);
  const [alerts, setAlerts] = useState([]);
  const [zone, setZone] = useState(() => ({
    enabled: Boolean(patient?.safeZone?.enabled),
    latitude: patient?.safeZone?.latitude ?? "",
    longitude: patient?.safeZone?.longitude ?? "",
    radiusMeters: patient?.safeZone?.radiusMeters ?? 100,
  }));
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const token = localStorage.getItem("mindset_ner_token");

  useEffect(() => {
    if (!patient?._id) return undefined;
    const load = async () => {
      const response = await fetch(`${API_URL}/api/wandering/${patient._id}/alerts`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      if (response.ok) setAlerts(data.alerts || []);
    };
    const upsert = ({ alert }) => {
      if (!alert) return;
      setAlerts((current) => [alert, ...current.filter((item) => item._id !== alert._id)]);
    };
    load().catch((error) => console.error("Failed to load emergency alerts:", error));
    socket.on("wandering:alertCreated", upsert);
    socket.on("wandering:alertUpdated", upsert);
    return () => {
      socket.off("wandering:alertCreated", upsert);
      socket.off("wandering:alertUpdated", upsert);
    };
  }, [patient?._id, patient?.name, token, patient?.safeZone]);

  useEffect(() => {
    hasEmergencyNotificationPermission()
      .then(setNotificationsEnabled)
      .catch((error) => console.warn("Could not read notification permission:", error));
  }, []);

  const saveZone = async (event) => {
    event.preventDefault();
    setSaving(true); setMessage("");
    try {
      const response = await fetch(`${API_URL}/api/wandering/${patient._id}/safe-zone`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ enabled: zone.enabled, latitude: Number(zone.latitude), longitude: Number(zone.longitude), radiusMeters: Number(zone.radiusMeters) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save safe zone");
      setZone(data.safeZone);
      setMessage(zone.enabled ? "Safe zone is active." : "Safe zone is saved but monitoring is off.");
    } catch (error) { setMessage(error.message); } finally { setSaving(false); }
  };

  const updateAlert = async (alertId, action) => {
    const response = await fetch(`${API_URL}/api/wandering/${patient._id}/alerts/${alertId}/${action}`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
    const data = await response.json();
    if (response.ok) setAlerts((current) => current.map((item) => item._id === data.alert._id ? data.alert : item));
  };

  const currentAlerts = alerts.filter((alert) => alert.status !== "resolved");
  const visibleAlerts = showAllAlerts ? alerts : alerts.slice(0, 5);
  const enableNotifications = async () => {
    const enabled = await requestEmergencyNotificationPermission();
    setNotificationsEnabled(enabled);
    setMessage(enabled ? "Emergency notifications are enabled on this device." : "Notification permission was not granted. Enable it in browser or app settings.");
  };
  const testNotifications = async () => {
    const enabled = await requestEmergencyNotificationPermission();
    setNotificationsEnabled(enabled);
    if (!enabled) {
      setMessage("Notification permission was not granted. Enable it in Android app settings.");
      return;
    }
    const sent = await sendEmergencyTestNotification();
    setMessage(sent ? "Test emergency notification sent. Check the notification shade." : "Test notification could not be sent.");
  };
  return (
    <section className="caregiver-card emergency-alerts-card">
      <div className="caregiver-section-heading">
        <p className="eyebrow">{t("patientSafety").toUpperCase()}</p><h2>{t("emergencyAlerts")}</h2>
        <p>{currentAlerts.length ? `${currentAlerts.length} ${t("alertsNeedAttention")}` : t("noActiveAlerts")}</p>
        <div className="emergency-notification-actions"><button type="button" className="enable-emergency-notifications" onClick={enableNotifications}>{notificationsEnabled ? t("notificationsEnabled") : t("enableNotifications")}</button><button type="button" className="enable-emergency-notifications" onClick={testNotifications}>{t("sendTestNotification")}</button></div>
      </div>
      <form className="safe-zone-form" onSubmit={saveZone}>
        <label><input type="checkbox" checked={zone.enabled} onChange={(event) => setZone({ ...zone, enabled: event.target.checked })} /> {t("enableSafeZone")}</label>
        <input aria-label={t("latitude")} type="number" step="any" placeholder={t("latitude")} value={zone.latitude} onChange={(event) => setZone({ ...zone, latitude: event.target.value })} required />
        <input aria-label={t("longitude")} type="number" step="any" placeholder={t("longitude")} value={zone.longitude} onChange={(event) => setZone({ ...zone, longitude: event.target.value })} required />
        <input aria-label={t("radiusMetres")} type="number" min="25" max="100000" placeholder={t("radiusMetres")} value={zone.radiusMeters} onChange={(event) => setZone({ ...zone, radiusMeters: event.target.value })} required />
        <button type="submit" disabled={saving}>{saving ? t("saving") : t("saveSafeZone")}</button>
      </form>
      {message && <p className="safe-zone-message">{message}</p>}
      <div className="emergency-alert-list">
        {visibleAlerts.map((alert) => <article className={`emergency-alert ${alert.status}`} key={alert._id}>
          <div><strong>{t("wanderingAlert")} — {caregiverText(language, alert.status)}</strong><p>{formatTime(alert.createdAt)} · {formatDistance(alert.distanceFromSafeZoneMeters)}</p><small>{t("lastKnown")}: {alert.lastKnownLocation.latitude.toFixed(5)}, {alert.lastKnownLocation.longitude.toFixed(5)} ({formatTime(alert.lastKnownLocation.capturedAt)})</small></div>
          <EmergencyAlertMap alert={alert} />
          <a className="emergency-directions-link" href={directionsUrl(alert)} target="_blank" rel="noreferrer" aria-label={t("directions")}>{t("directions")}</a>
          {alert.status === "active" && <button onClick={() => updateAlert(alert._id, "acknowledge")}>{t("acknowledge")}</button>}
          {alert.status !== "resolved" && <button onClick={() => updateAlert(alert._id, "resolve")}>{t("resolve")}</button>}
        </article>)}
        {alerts.length > 5 && <button type="button" className="show-all-emergency-alerts" onClick={() => setShowAllAlerts((showing) => !showing)}>{showAllAlerts ? t("showLess") : `${t("showAll")} ${alerts.length} ${t("alerts")}`}</button>}
      </div>
    </section>
  );
}

export default CaregiverEmergencyAlerts;
