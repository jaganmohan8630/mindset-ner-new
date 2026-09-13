import { useEffect, useState } from "react";
import { API_URL } from "../api";
import { socket } from "../socket";

function PatientReminderList({ onBack }) {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("mindset_ner_user") || "null",
  );

  const patientId = user?.patientId;
  const token = localStorage.getItem("mindset_ner_token");

  const loadReminders = async () => {
    if (!patientId || !token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/reminders/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load reminders");
      }

      setReminders(data.reminders || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load reminders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReminders();

    const handleFocus = () => loadReminders();
    const handleReminderRefresh = (event) => {
      const update = event.detail;

      if (update?.action === "deleted") {
        setReminders((current) =>
          current.filter((reminder) => reminder._id !== update.reminderId),
        );
      } else if (update?.reminder) {
        setReminders((current) => {
          const exists = current.some(
            (reminder) => reminder._id === update.reminder._id,
          );
          return exists
            ? current.map((reminder) =>
                reminder._id === update.reminder._id
                  ? update.reminder
                  : reminder,
              )
            : [update.reminder, ...current];
        });
      } else {
        loadReminders();
      }
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener(
      "mindset-ner:reminders-refreshed",
      handleReminderRefresh,
    );

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener(
        "mindset-ner:reminders-refreshed",
        handleReminderRefresh,
      );
    };
  }, []);

  useEffect(() => {
    const handleReminderUpdate = (event) => {
      if (String(event.patientId) === String(patientId)) loadReminders();
    };
    const handleSocketConnect = () => loadReminders();

    socket.on("reminder:updated", handleReminderUpdate);
    socket.on("connect", handleSocketConnect);

    return () => {
      socket.off("reminder:updated", handleReminderUpdate);
      socket.off("connect", handleSocketConnect);
    };
  }, [patientId]);

  const getIcon = (type) => {
    if (type === "medicine") return "💊";
    if (type === "hydration") return "💧";
    if (type === "daily_activity") return "🌿";
    if (type === "appointment") return "🏥";
    return "🔔";
  };

  const getLabel = (type) => {
    if (type === "medicine") return "Medicine";
    if (type === "hydration") return "Hydration";
    if (type === "daily_activity") return "Daily Activity";
    if (type === "appointment") return "Appointment";
    return "Reminder";
  };

  const getRecurrence = (recurrence) => {
    if (recurrence === "daily") return "Every day";
    if (recurrence === "weekly") return "Every week";
    return "Once";
  };

  const activeReminders = reminders.filter((reminder) => reminder.active);

  if (loading) {
    return (
      <div className="dashboard-page">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>

        <div className="dashboard-loading">
          Loading reminders...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>

      <div className="reminders-page-header patient-reminders-hero">
        <p className="eyebrow">PATIENT REMINDERS</p>

        <h1>My Reminders</h1>

        <p>
          View your scheduled medicines, activities, hydration,
          and appointments.
        </p>

        <div className="reminder-total-card" aria-label={`${activeReminders.length} active reminders`}>
          <span>Today&apos;s routine</span>
          <strong>{activeReminders.length}</strong>
          <small>active reminder{activeReminders.length === 1 ? "" : "s"}</small>
        </div>
      </div>

      {error && (
        <div className="reminder-error">
          {error}
        </div>
      )}

      {!error && activeReminders.length === 0 && (
        <div className="empty-reminders-card">
          <div className="empty-reminders-icon">🔔</div>

          <h2>No reminders yet</h2>

          <p>
            Your caregiver has not added any reminders yet.
          </p>
        </div>
      )}

      <div className="patient-reminders-list">
        {activeReminders.map((reminder) => (
            <div
              className="patient-reminder-list-card"
              key={reminder._id}
            >
              <div className="patient-reminder-list-icon">
                {getIcon(reminder.type)}
              </div>

              <div className="patient-reminder-list-content">
                <span className="patient-reminder-list-type">
                  {getLabel(reminder.type)}
                </span>

                <h2>{reminder.title}</h2>

                {reminder.description && (
                  <p>{reminder.description}</p>
                )}

                <div className="patient-reminder-list-details">
                  <span>🕐 {reminder.scheduledTime}</span>

                  <span>
                    🔁 {getRecurrence(reminder.recurrence)}
                  </span>
                </div>
              </div>
              <span className="patient-reminder-active-status">Active</span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default PatientReminderList;
