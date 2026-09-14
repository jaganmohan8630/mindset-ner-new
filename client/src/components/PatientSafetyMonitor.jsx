import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
import { API_URL } from "../api";

// This is intentionally independent of the voice-assistant lifecycle.
// It monitors only while this React app is open in the foreground.
function PatientSafetyMonitor({ patientId, language: _language = "en-IN" }) {
  useEffect(() => {
    if (!patientId) return undefined;

    const token = localStorage.getItem("mindset_ner_token");
    let browserWatchId = null;
    let nativeWatchId = null;
    let cancelled = false;
    let monitoringStarted = false;
    let monitoringStarting = false;
    let lastSentAt = 0;

    const reportPosition = async (position) => {
      // GPS may update several times per second. A 15-second cadence keeps the
      // alert current without unnecessary battery or network use.
      if (Date.now() - lastSentAt < 15000) return;
      lastSentAt = Date.now();
      try {
        await fetch(`${API_URL}/api/wandering/${patientId}/location`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracyMeters: position.coords.accuracy,
            capturedAt: new Date(position.timestamp).toISOString(),
          }),
        });
      } catch (error) {
        console.warn("Safety location report failed:", error);
      }
    };

    const startWatchIfConfigured = async () => {
      if (monitoringStarted || monitoringStarting || cancelled) return;
      monitoringStarting = true;
      try {
        const response = await fetch(`${API_URL}/api/patients/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        // The effect may have been cleaned up while this request was in
        // flight (including React development-mode's effect check). Never
        // start a watcher that belongs to a cleaned-up component instance.
        if (cancelled || !response.ok || !data.patient?.safeZone?.enabled) return;
        if (Capacitor.isNativePlatform()) {
          let permission = await Geolocation.checkPermissions();
          if (permission.location !== "granted") {
            permission = await Geolocation.requestPermissions({ permissions: ["location"] });
          }
          if (permission.location !== "granted" || cancelled) {
            console.warn("Safety location permission was not granted.");
            return;
          }

          monitoringStarted = true;
          nativeWatchId = await Geolocation.watchPosition(
            { enableHighAccuracy: true, maximumAge: 15000, timeout: 30000 },
            (position, error) => {
              if (error || !position) {
                console.warn("Native safety location unavailable:", error?.message);
                return;
              }
              reportPosition(position);
            },
          );
          return;
        }

        if (cancelled || !navigator.geolocation) return;
        monitoringStarted = true;
        browserWatchId = navigator.geolocation.watchPosition(
          reportPosition,
          (error) => console.warn("Safety location unavailable:", error.message),
          { enableHighAccuracy: true, maximumAge: 15000, timeout: 20000 },
        );
      } catch (error) {
        console.warn("Safety monitoring could not start:", error);
      } finally {
        monitoringStarting = false;
      }
    };

    startWatchIfConfigured();
    // A caregiver can turn monitoring on after the patient has already
    // opened the app. Re-check until the watcher begins, instead of requiring
    // the patient to sign out or relaunch the app.
    const configurationTimer = window.setInterval(startWatchIfConfigured, 60000);
    const refreshOnFocus = () => startWatchIfConfigured();
    window.addEventListener("focus", refreshOnFocus);
    return () => {
      cancelled = true;
      window.clearInterval(configurationTimer);
      window.removeEventListener("focus", refreshOnFocus);
      if (browserWatchId !== null) navigator.geolocation?.clearWatch(browserWatchId);
      if (nativeWatchId) Geolocation.clearWatch({ id: nativeWatchId });
    };
  }, [patientId]);

  return null;
}

export default PatientSafetyMonitor;
