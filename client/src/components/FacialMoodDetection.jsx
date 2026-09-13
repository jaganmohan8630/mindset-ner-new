import { useEffect, useRef, useState } from "react";
import {
  expressionDisplayNames,
  mapExpressionsToMood,
} from "../utils/facialMoodMapping";

const MODEL_URL = "/models/face-api";
const DETECTION_ATTEMPTS = 8;
const MODEL_LOAD_TIMEOUT_MS = 25000;
const CAMERA_PERMISSION_TIMEOUT_MS = 8000;

let faceApiPromise;
let modelsPromise;

const loadFaceApi = async () => {
  if (!faceApiPromise) {
    faceApiPromise = import("@vladmandic/face-api");
  }
  return faceApiPromise;
};

const loadModels = async () => {
  if (!modelsPromise) {
    modelsPromise = loadFaceApi().then(async (faceapi) => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      return faceapi;
    }).catch((error) => {
      // A transient network or WebGL failure should not make every retry fail.
      modelsPromise = undefined;
      throw error;
    });
  }
  return modelsPromise;
};

const withTimeout = (promise, timeoutMs, timeoutMessage) =>
  Promise.race([
    promise,
    new Promise((_, reject) => {
      window.setTimeout(
        () => reject(new Error(timeoutMessage)),
        timeoutMs,
      );
    }),
  ]);

function FacialMoodDetection({ onDetected }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mountedRef = useRef(true);
  const detectionRunRef = useRef(0);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      stopCamera();
    };
  }, []);

  const startDetection = async () => {
    const runId = detectionRunRef.current + 1;
    detectionRunRef.current = runId;
    setError("");
    setResult(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera access is not supported on this device or browser.");
      return;
    }

    // Browsers permit camera access only from HTTPS origins, except localhost.
    // Native Capacitor is exempt because it uses the platform WebView bridge.
    if (!window.isSecureContext) {
      setError(
        "Camera access in a browser requires HTTPS (or localhost). Open this site at https://… or http://localhost:5173.",
      );
      return;
    }

    try {
      // This call must stay directly in the click handler. Some desktop
      // browsers will not show a permission prompt after an async delay.
      const cameraRequest = navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "user" },
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });
      setStatus("permission");
      // Querying this is informational only. Do not await it before the
      // request: an await can lose the browser's user-gesture permission.
      navigator.permissions?.query?.({ name: "camera" }).then((permission) => {
        if (permission.state === "denied" && detectionRunRef.current === runId) {
          setError("Camera access is blocked for this website. Use the camera icon in the browser address bar to allow it, then try again.");
        }
      }).catch(() => {});
      const stream = await withTimeout(
        cameraRequest,
        CAMERA_PERMISSION_TIMEOUT_MS,
        "The browser did not respond to the camera permission request.",
      );
      streamRef.current = stream;
      if (!mountedRef.current || detectionRunRef.current !== runId) {
        stopCamera();
        return;
      }

      const video = videoRef.current;
      if (!video) {
        stopCamera();
        return;
      }

      video.srcObject = stream;
      await video.play();
      if (!mountedRef.current || detectionRunRef.current !== runId) {
        stopCamera();
        return;
      }

      setStatus("loading");
      await withTimeout(
        loadModels(),
        MODEL_LOAD_TIMEOUT_MS,
        "The on-device model took too long to load.",
      );
      if (!mountedRef.current || detectionRunRef.current !== runId) {
        stopCamera();
        return;
      }
      setStatus("ready");
    } catch (detectionError) {
      stopCamera();
      if (!mountedRef.current) return;

      console.error("Facial mood detection failed:", detectionError);
      setStatus("idle");
      const message = detectionError?.message === "The browser did not respond to the camera permission request."
        ? "Camera permission did not open. Allow camera access using the browser's camera icon/address-bar site settings, then try again."
        : detectionError?.message === "The on-device model took too long to load."
          ? "The camera opened, but the on-device model did not load in time. Please check your connection and try again."
        : detectionError?.name === "NotAllowedError"
          ? "Camera permission was not granted. Please allow camera access and try again."
          : "We could not use the camera right now. Please try again.";
      setError(message);
    }
  };

  const analyzeFace = async () => {
    const video = videoRef.current;
    if (!video || !streamRef.current) return;

    const runId = detectionRunRef.current;
    try {
      setError("");
      setStatus("detecting");
      const faceapi = await loadModels();
      let detection;

      for (let attempt = 0; attempt < DETECTION_ATTEMPTS; attempt += 1) {
        detection = await faceapi
          .detectSingleFace(
            video,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 320,
              scoreThreshold: 0.55,
            }),
          )
          .withFaceExpressions();

        if (detection) break;
        await new Promise((resolve) => window.setTimeout(resolve, 350));
        if (detectionRunRef.current !== runId) return;
      }

      stopCamera();
      if (!mountedRef.current || detectionRunRef.current !== runId) return;

      if (!detection) {
        setStatus("idle");
        setError("No face was detected. Please face the camera in good light and try again.");
        return;
      }

      const expressions = Object.fromEntries(
        Object.entries(detection.expressions).map(([name, score]) => [name, Number(score)]),
      );
      const nextResult = { expressions, ...mapExpressionsToMood(expressions) };
      setResult(nextResult);
      setStatus("complete");
      onDetected(nextResult);
    } catch (detectionError) {
      stopCamera();
      if (!mountedRef.current) return;
      console.error("Facial expression analysis failed:", detectionError);
      setStatus("idle");
      setError("We could not analyze the camera image. Please try again.");
    }
  };

  const cancelDetection = () => {
    detectionRunRef.current += 1;
    stopCamera();
    setStatus("idle");
  };

  const isCameraActive = status === "permission" || status === "loading" || status === "ready" || status === "detecting";
  const sortedExpressions = result
    ? Object.entries(result.expressions).sort(([, first], [, second]) => second - first)
    : [];

  return (
    <section className="facial-mood-card" aria-labelledby="camera-mood-heading">
      <div className="mood-card-heading">
        <span>2</span>
        <div>
          <h2 id="camera-mood-heading">Estimate with camera</h2>
          <p>Optional. The camera is used only after you start detection.</p>
        </div>
      </div>

      <p className="facial-mood-disclaimer">
        This estimates facial expression only. It is not a medical diagnosis,
        and no photo or video is uploaded.
      </p>

      {isCameraActive && (
        <div className="facial-camera-preview" aria-live="polite">
          <video ref={videoRef} autoPlay playsInline muted />
          <p>
            {status === "loading"
              ? "Camera is on. Preparing on-device model…"
              : status === "permission"
                ? "Waiting for camera permission in your browser…"
                : status === "ready"
                  ? "Camera is ready. Center your face, then select Analyze my expression."
                  : "Analyzing your expression…"}
          </p>
        </div>
      )}

      {result && (
        <div className="facial-mood-result" aria-live="polite">
          <p className="mood-selected-label">DETECTED MOOD</p>
          <h3>
            {result.moodId.charAt(0).toUpperCase() + result.moodId.slice(1)}
            <span>{Math.round(result.confidence * 100)}% confidence</span>
          </h3>
          <div className="facial-expression-list" aria-label="Expression probabilities">
            {sortedExpressions.map(([expression, score]) => (
              <div key={expression}>
                <span>{expressionDisplayNames[expression] || expression}</span>
                <strong>{Math.round(score * 100)}%</strong>
              </div>
            ))}
          </div>
          <p>Your detected mood has been selected and saved using your existing mood check-in.</p>
        </div>
      )}

      {error && <p className="facial-mood-error" role="alert">{error}</p>}

      <button
        className="facial-mood-start-button"
        onClick={startDetection}
        disabled={isCameraActive}
      >
        <span aria-hidden="true">📷</span>
        {isCameraActive ? "Camera is open" : result ? "Detect again" : "Start mood detection"}
      </button>
      {status === "ready" && (
        <button className="facial-mood-analyze-button" onClick={analyzeFace}>
          Analyze my expression
        </button>
      )}
      {isCameraActive && (
        <button className="facial-mood-cancel-button" onClick={cancelDetection}>
          Stop camera
        </button>
      )}
    </section>
  );
}

export default FacialMoodDetection;
