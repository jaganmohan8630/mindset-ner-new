import { useEffect, useState } from "react";
import { API_URL } from "../api";
import { socket } from "../socket";
import { getUIText } from "../uiTranslations";

function PatientReminderList({ onBack, language = "en-IN" }) {
  const t = (key) => getUIText(language, key);
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
        throw new Error(data.message || t("failedToLoadReminders"));
      }

      setReminders(data.reminders || []);
    } catch (err) {
      console.error(err);
      setError(t("unableToLoadReminders"));
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
    if (type === "medicine") return t("medicine");
    if (type === "hydration") return t("hydration");
    if (type === "daily_activity") return t("dailyActivity");
    if (type === "appointment") return t("appointment");
    return t("reminder");
  };

  const getRecurrence = (recurrence) => {
    if (recurrence === "daily") return t("everyDay");
    if (recurrence === "weekly") return t("everyWeek");
    return t("once");
  };

  const activeReminders = reminders.filter((reminder) => reminder.active);
  const activeReminderLabel = activeReminders.length === 1
    ? t("activeReminder")
    : t("activeReminders");

  if (loading) {
    return (
      <div className="dashboard-page">
        <button className="back-button" onClick={onBack}>
          ← {t("back")}
        </button>

        <div className="dashboard-loading">
          {t("loadingReminders")}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <button className="back-button" onClick={onBack}>
        ← {t("back")}
      </button>

      <div className="reminders-page-header patient-reminders-hero">
        <p className="eyebrow">{t("patientReminders")}</p>

        <h1>{t("myReminders")}</h1>

        <p>
          {t("reminderPageDescription")}
        </p>

        <div className="reminder-total-card" aria-label={`${activeReminders.length} ${activeReminderLabel}`}>
          <span>{t("todaysRoutine")}</span>
          <strong>{activeReminders.length}</strong>
          <small>{activeReminderLabel}</small>
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

          <h2>{t("noReminders")}</h2>

          <p>
            {t("caregiverHasNotAddedReminders")}
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
            <span className="patient-reminder-active-status">{t("active")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PatientReminderList;
