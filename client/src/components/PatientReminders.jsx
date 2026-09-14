import { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { API_URL } from "../api";
import { socket } from "../socket";
import { syncReminderNotifications } from "../reminderNotifications";
import { getUIText } from "../uiTranslations";

function PatientReminders({ language = "en-IN" }) {
  const t = (key) => getUIText(language, key);
  const [reminders, setReminders] = useState([]);
  const [activeReminder, setActiveReminder] = useState(null);

  // Timer that controls the 5-minute reminder window.
  const reminderTimerRef = useRef(null);

  // Timer that controls repeated voice announcements.
  const speechTimerRef = useRef(null);

  // Prevents the same occurrence from opening repeatedly.
  const shownReminderRef = useRef(null);

  // Keeps track of the currently active reminder independently
  // from React state.
  const activeReminderRef = useRef(null);

  // True while an announcement is being created or played. Some browsers do
  // not update speechSynthesis.speaking immediately, so this prevents a
  // second utterance from being queued during that small gap.
  const isSpeakingRef = useRef(false);

  // Persist completed/dismissed occurrences across page reloads.
  const completedRemindersRef = useRef(
    new Set(
      JSON.parse(
        localStorage.getItem("mindset_ner_completed_reminders") || "[]",
      ),
    ),
  );

  const user = JSON.parse(localStorage.getItem("mindset_ner_user") || "null");

  const patientId = user?.patientId;
  const token = localStorage.getItem("mindset_ner_token");

  const loadReminders = async () => {
    if (!patientId || !token) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/reminders/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Unable to load reminders (${response.status})`);
      }

      const data = await response.json();

      const currentReminders = data.reminders || [];
      setReminders(currentReminders);
      window.dispatchEvent(new Event("mindset-ner:reminders-refreshed"));
      await syncReminderNotifications(currentReminders, language);
    } catch (error) {
      console.error("Failed to load patient reminders:", error);
    }
  };

  useEffect(() => {
    loadReminders();

    const handleFocus = () => loadReminders();

    const handleStorageChange = (event) => {
      if (event.key === "mindset_ner_reminders_updated") {
        loadReminders();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const getReminderIcon = (type) => {
    if (type === "medicine") {
      return "💊";
    }

    if (type === "hydration") {
      return "💧";
    }

    if (type === "daily_activity") {
      return "🌿";
    }

    if (type === "appointment") {
      return "🏥";
    }

    return "🔔";
  };

  const getReminderLabel = (type) => {
    if (type === "medicine") {
      return "Medicine";
    }

    if (type === "hydration") {
      return "Hydration";
    }

    if (type === "daily_activity") {
      return "Daily Activity";
    }

    if (type === "appointment") {
      return "Appointment";
    }

    return "Reminder";
  };

  const getReminderDisplayLabel = (type) => {
    if (type === "medicine") return t("medicine");
    if (type === "hydration") return t("hydration");
    if (type === "daily_activity") return t("dailyActivity");
    if (type === "appointment") return t("appointment");
    return t("reminder");
  };

  const getReminderKey = (reminder, date = new Date()) => {
    const dateKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    return `${reminder._id}-${dateKey}-${reminder.scheduledTime}`;
  };

  const isCorrectDateForReminder = (reminder, now) => {
    if (reminder.recurrence === "daily") {
      return true;
    }

    if (reminder.recurrence === "weekly") {
      if (reminder.daysOfWeek?.length > 0) {
        return reminder.daysOfWeek.includes(now.getDay());
      }

      return true;
    }

    if (reminder.recurrence === "once") {
      if (!reminder.scheduledDate) {
        return true;
      }

      const scheduledDate = new Date(reminder.scheduledDate);

      return (
        scheduledDate.getFullYear() === now.getFullYear() &&
        scheduledDate.getMonth() === now.getMonth() &&
        scheduledDate.getDate() === now.getDate()
      );
    }

    return false;
  };

  const stopReminderVoice = () => {
    if (speechTimerRef.current) {
      clearInterval(speechTimerRef.current);
      speechTimerRef.current = null;
    }

    if (Capacitor.isNativePlatform()) {
      TextToSpeech.stop().catch((error) =>
        console.error("Failed to stop native reminder speech:", error),
      );
    } else if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    isSpeakingRef.current = false;
  };

  const speakReminder = async (reminder) => {
    if (!reminder) {
      return;
    }

    // Do not speak if this reminder is no longer active.
    if (
      !activeReminderRef.current ||
      activeReminderRef.current._id !== reminder._id
    ) {
      return;
    }

    if (isSpeakingRef.current) {
      return;
    }

    isSpeakingRef.current = true;

    const text =
      `${getReminderLabel(reminder.type)} reminder. ` +
      `${reminder.title}. ` +
      `${reminder.description || ""}`;

    if (Capacitor.isNativePlatform()) {
      try {
        await TextToSpeech.stop();
        await TextToSpeech.speak({
          text,
          lang: "en-IN",
          rate: 0.85,
          pitch: 1,
          volume: 1,
        });
      } catch (error) {
        console.error("Native reminder speech error:", error);
      } finally {
        isSpeakingRef.current = false;
      }
      return;
    }

    if (!("speechSynthesis" in window)) {
      isSpeakingRef.current = false;
      return;
    }

    // If browser speech is already playing, don't interrupt it.
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      isSpeakingRef.current = false;
      return;
    }

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";
    speech.rate = 0.85;
    speech.pitch = 1;
    speech.volume = 1;

    speech.onstart = () => {
      console.log("Reminder voice started:", text);
    };

    speech.onend = () => {
      isSpeakingRef.current = false;
    };

    speech.onerror = (event) => {
      isSpeakingRef.current = false;

      if (event.error !== "canceled" && event.error !== "interrupted") {
        console.error("Reminder speech error:", event.error);
      }
    };

    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    const checkReminders = () => {
      // Never open another reminder while one is active.
      if (activeReminderRef.current) {
        return;
      }

      const now = new Date();

      const dueReminder = reminders.find((reminder) => {
        if (!reminder.active || !reminder.scheduledTime) {
          return false;
        }

        const [hours, minutes] = reminder.scheduledTime.split(":").map(Number);

        if (Number.isNaN(hours) || Number.isNaN(minutes)) {
          return false;
        }

        const scheduledToday = new Date();

        scheduledToday.setHours(hours, minutes, 0, 0);

        const difference = now.getTime() - scheduledToday.getTime();

        // Before scheduled time.
        if (difference < 0) {
          return false;
        }

        // Reminder is allowed to remain active
        // for exactly 5 minutes.
        if (difference >= 5 * 60 * 1000) {
          return false;
        }

        if (!isCorrectDateForReminder(reminder, now)) {
          return false;
        }

        const reminderKey = getReminderKey(reminder, now);

        // Already completed/acknowledged.
        if (completedRemindersRef.current.has(reminderKey)) {
          return false;
        }

        return true;
      });

      if (!dueReminder) {
        return;
      }

      const reminderKey = getReminderKey(dueReminder, now);

      // Prevent duplicate activation.
      if (shownReminderRef.current === reminderKey) {
        return;
      }

      shownReminderRef.current = reminderKey;

      activeReminderRef.current = dueReminder;

      setActiveReminder(dueReminder);

      // Give the patient exactly 5 minutes.
      const [dueHours, dueMinutes] = dueReminder.scheduledTime
        .split(":")
        .map(Number);
      const dueScheduledTime = new Date(now);

      dueScheduledTime.setHours(dueHours, dueMinutes, 0, 0);

      const timeRemaining = Math.max(
        0,
        5 * 60 * 1000 - (now.getTime() - dueScheduledTime.getTime()),
      );

      reminderTimerRef.current = setTimeout(
        async () => {
          // Stop voice.
          stopReminderVoice();

          // Clear active reminder.
          activeReminderRef.current = null;

          setActiveReminder(null);

          // Backend records the missed occurrence.
          try {
            const response = await fetch(
              `${API_URL}/api/reminders/${dueReminder._id}/missed`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            if (!response.ok) {
              const data = await response.json();

              throw new Error(
                data.message || "Failed to mark reminder as missed",
              );
            }

            console.log("Reminder automatically marked as missed");

            await loadReminders();
          } catch (error) {
            console.error("Failed to mark reminder as missed:", error);
          }
        },
        timeRemaining,
      );
    };

    checkReminders();

    const checkInterval = setInterval(checkReminders, 10000);

    return () => {
      clearInterval(checkInterval);
    };
  }, [reminders]);

  // Only stop an active reminder when this component is actually unmounted.
  // Refreshing the reminders list must not stop its five-minute window.
  useEffect(() => {
    return () => {
      if (reminderTimerRef.current) {
        clearTimeout(reminderTimerRef.current);
        reminderTimerRef.current = null;
      }

      stopReminderVoice();
    };
  }, []);

  useEffect(() => {
    const handleReminderUpdate = (event) => {
      if (String(event.patientId) !== String(patientId)) return;

      // Apply the socket payload immediately. This avoids a visible delay (or
      // stale HTTP response) when a caregiver creates or edits a reminder.
      if (event.action === "deleted") {
        setReminders((current) =>
          current.filter((reminder) => reminder._id !== event.reminderId),
        );
      } else if (event.reminder) {
        setReminders((current) => {
          const exists = current.some(
            (reminder) => reminder._id === event.reminder._id,
          );
          const next = exists
            ? current.map((reminder) =>
                reminder._id === event.reminder._id
                  ? event.reminder
                  : reminder,
              )
            : [event.reminder, ...current];

          window.dispatchEvent(
            new CustomEvent("mindset-ner:reminders-refreshed", {
              detail: event,
            }),
          );
          return next;
        });
      }

      loadReminders();
    };
    const handleSocketConnect = () => loadReminders();

    socket.on("reminder:updated", handleReminderUpdate);
    socket.on("connect", handleSocketConnect);

    return () => {
      socket.off("reminder:updated", handleReminderUpdate);
      socket.off("connect", handleSocketConnect);
    };
  }, [patientId]);

  useEffect(() => {
    if (!activeReminder) {
      return;
    }

    const reminder = activeReminder;

    // Speak immediately.
    speakReminder(reminder);

    // Keep announcing every 12 seconds.
    speechTimerRef.current = setInterval(() => {
      if (!activeReminderRef.current) {
        return;
      }

      if (activeReminderRef.current._id !== reminder._id) {
        return;
      }

      speakReminder(reminder);
    }, 12000);

    return () => {
      if (speechTimerRef.current) {
        clearInterval(speechTimerRef.current);

        speechTimerRef.current = null;
      }

      stopReminderVoice();
    };
  }, [activeReminder]);
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      return;
    }

    if (Notification.permission === "default") {
      try {
        await Notification.requestPermission();
      } catch (error) {
        console.error("Notification permission failed:", error);
      }
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  if (!patientId) {
    return null;
  }

  return (
    <>
      {activeReminder && (
        <div className="patient-reminder-overlay">
          <div className="patient-reminder-card">
            <div className="patient-reminder-icon">
              {getReminderIcon(activeReminder.type)}
            </div>

            <p className="eyebrow">{t("reminder")}</p>

            <h2>{activeReminder.title}</h2>

            <p className="patient-reminder-type">
              {getReminderDisplayLabel(activeReminder.type)}
            </p>

            {activeReminder.description && (
              <p className="patient-reminder-description">
                {activeReminder.description}
              </p>
            )}

            <p className="patient-reminder-time">
              ⏰ {activeReminder.scheduledTime}
            </p>

            <button
              className="start-button"
              onClick={async () => {
                const reminder = activeReminder;

                if (!reminder) {
                  return;
                }

                const now = new Date();

                const reminderKey = getReminderKey(reminder, now);

                // Persist completion so a page
                // reload cannot show this occurrence again.
                completedRemindersRef.current.add(reminderKey);

                localStorage.setItem(
                  "mindset_ner_completed_reminders",
                  JSON.stringify([...completedRemindersRef.current]),
                );

                // Stop the 5-minute timer.
                if (reminderTimerRef.current) {
                  clearTimeout(reminderTimerRef.current);

                  reminderTimerRef.current = null;
                }

                // Stop repeating voice.
                stopReminderVoice();

                // Clear active reminder.
                activeReminderRef.current = null;

                setActiveReminder(null);

                // Mark completed in backend.
                try {
                  const response = await fetch(
                    `${API_URL}/api/reminders/${reminder._id}/complete`,
                    {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    },
                  );

                  const data = await response.json();

                  if (!response.ok) {
                    throw new Error(
                      data.message || "Failed to complete reminder",
                    );
                  }

                  console.log("Reminder completed:", data);

                  await loadReminders();
                } catch (error) {
                  console.error("Failed to mark reminder as completed:", error);

                  // The patient already acknowledged
                  // the reminder, so it remains dismissed
                  // locally even if the network fails.
                }
              }}
            >
              ✓ {t("gotIt")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default PatientReminders;
