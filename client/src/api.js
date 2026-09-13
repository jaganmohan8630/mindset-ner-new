import { Capacitor } from "@capacitor/core";

const browserApiUrl =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:5000`
    : "http://localhost:5000";

// Browser builds should call the backend on the same host as the page. The
// previous fixed LAN address works only on one local network and made the
// caregiver dashboard fail on a desktop browser. Native Capacitor builds keep
// their LAN fallback; deployments should set VITE_API_URL explicitly.
export const API_URL =
  import.meta.env.VITE_API_URL ||
  (Capacitor.isNativePlatform()
    ? "http://192.168.137.1:5000"
    : browserApiUrl);

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || API_URL;
