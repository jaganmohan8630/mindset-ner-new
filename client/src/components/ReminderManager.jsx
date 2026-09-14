import { useEffect, useState } from "react";
import { API_URL } from "../api";
import { socket } from "../socket";
import { getUIText } from "../uiTranslations";

const initialForm = {
  type: "medicine", title: "", description: "", scheduledDate: "", scheduledTime: "", recurrence: "once",
};

function ReminderManager({ onBack, language = "en-IN" }) {
  const t = (key) => getUIText(language, key);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingReminder, setEditingReminder] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [patientId, setPatientId] = useState(null);
  const token = localStorage.getItem("mindset_ner_token");

  const loadReminders = async () => {
    try {
      setLoading(true); setError("");
      if (!token) throw new Error(t("authenticationRequired"));
      const connectionsResponse = await fetch(`${API_URL}/api/connections/my-patients`, { headers: { Authorization: `Bearer ${token}` } });
      const connectionsData = await connectionsResponse.json();
      if (!connectionsResponse.ok) throw new Error(connectionsData.message || t("failedToLoadConnectedPatients"));
      if (!connectionsData.patients?.length) throw new Error(t("noAcceptedPatientsConnected"));
      const connectedPatientId = connectionsData.patients[0].patient._id;
      setPatientId(connectedPatientId);
      const response = await fetch(`${API_URL}/api/reminders/${connectedPatientId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || t("failedToLoadReminders"));
      setReminders(data.reminders || []);
    } catch (err) {
      console.error(err); setError(err.message);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadReminders(); }, []);
  useEffect(() => {
    const handleReminderUpdate = (event) => {
      if (patientId && String(event.patientId) === String(patientId)) loadReminders();
    };
    socket.on("reminder:updated", handleReminderUpdate);
    return () => socket.off("reminder:updated", handleReminderUpdate);
  }, [patientId]);
  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const setTimePart = (part, value) => {
    const [currentHour = "", currentMinute = ""] = form.scheduledTime.split(":");
    setForm({
      ...form,
      scheduledTime: part === "hour"
        ? `${value}:${currentMinute}`
        : `${currentHour}:${value}`,
    });
  };
  const notifyUpdate = () => localStorage.setItem("mindset_ner_reminders_updated", Date.now().toString());

  const submitReminder = async (event) => {
    event.preventDefault(); setMessage(""); setError("");
    if (!form.title || !/^\d{2}:\d{2}$/.test(form.scheduledTime)) { setError(t("titleAndCompleteTimeRequired")); return; }
    try {
      const isEditing = Boolean(editingReminder);
      const response = await fetch(isEditing ? `${API_URL}/api/reminders/${editingReminder._id}` : `${API_URL}/api/reminders`, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ patientId, ...form, scheduledDate: form.scheduledDate || null }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || (isEditing ? t("failedToUpdateReminder") : t("failedToCreateReminder")));
      setMessage(isEditing ? t("reminderUpdatedSuccessfully") : t("reminderCreatedSuccessfully")); notifyUpdate(); setEditingReminder(null); setForm(initialForm); await loadReminders();
    } catch (err) { setError(err.message); }
  };

  const deleteReminder = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/reminders/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || t("failedToDeleteReminder"));
      setReminders((current) => current.filter((reminder) => reminder._id !== id)); notifyUpdate(); setMessage(t("reminderDeletedSuccessfully"));
    } catch (err) { setError(err.message); }
  };

  const startEditing = (reminder) => {
    setEditingReminder(reminder);
    setForm({ type: reminder.type, title: reminder.title, description: reminder.description || "", scheduledDate: reminder.scheduledDate ? new Date(reminder.scheduledDate).toISOString().split("T")[0] : "", scheduledTime: reminder.scheduledTime || "", recurrence: reminder.recurrence || "once" });
    setMessage(""); setError("");
  };
  const cancelEditing = () => { setEditingReminder(null); setForm(initialForm); };
  const getIcon = (type) => ({ medicine: "💊", hydration: "💧", daily_activity: "🌿", appointment: "🏥" }[type] || "🔔");
  const recurrenceLabel = (recurrence) => {
    if (recurrence === "daily") return t("everyDay");
    if (recurrence === "weekly") return t("everyWeek");
    return t("once");
  };
  const activeReminderLabel = reminders.length === 1 ? t("activeReminder") : t("activeReminders");

  if (loading) return <div className="reminder-manager-page"><div className="reminder-manager-loading">{t("loadingReminders")}</div></div>;

  return (
    <div className="reminder-manager-page">
      <main className="reminder-manager-shell">
        <header className="reminder-manager-header">
          <button className="reminder-back-button" onClick={onBack}><span aria-hidden="true">←</span> {t("backToDashboard")}</button>
          <div className="reminder-manager-intro">
            <div className="reminder-header-icon" aria-hidden="true">🔔</div>
            <div><p className="eyebrow">{t("caregiverTools")}</p><h1>{t("patientReminders")}</h1><p>{t("reminderManagerDescription")}</p></div>
          </div>
          <div className="reminder-overview" aria-label={t("reminderOverview")}><span className="reminder-overview-icon" aria-hidden="true">✓</span><div><strong>{reminders.length}</strong><span>{activeReminderLabel}</span></div></div>
        </header>

        {message && <div className="reminder-notice reminder-notice-success" role="status">{message}</div>}
        {error && <div className="reminder-notice reminder-notice-error" role="alert">{error}</div>}

        <div className="reminder-layout">
          <section className="reminder-form-card">
            <div className="reminder-card-heading"><span aria-hidden="true">{editingReminder ? "✎" : "+"}</span><div><p className="eyebrow">{editingReminder ? t("editReminder") : t("createReminder")}</p><h2>{editingReminder ? t("updateReminderDetails") : t("setNewReminder")}</h2></div></div>
            <form onSubmit={submitReminder}>
              <label>{t("reminderType")}<select name="type" value={form.type} onChange={handleChange}><option value="medicine">💊 {t("medicine")}</option><option value="hydration">💧 {t("hydration")}</option><option value="daily_activity">🌿 {t("dailyActivity")}</option><option value="appointment">🏥 {t("appointment")}</option></select></label>
              <label>{t("title")}<input name="title" value={form.title} onChange={handleChange} placeholder={t("exampleMorningMedicine")} /></label>
              <label>{t("description")}<textarea name="description" value={form.description} onChange={handleChange} placeholder={t("addSimpleInstructions")} /></label>
              <div className="reminder-form-row">
                <label><span className="reminder-field-label">{t("date")} <span className="reminder-optional">{t("optional")}</span></span><input type="date" name="scheduledDate" value={form.scheduledDate} onChange={handleChange} /></label>
                <label><span className="reminder-field-label">{t("time")}</span><span className="reminder-time-picker"><select aria-label={t("hour")} value={form.scheduledTime.split(":")[0] || ""} onChange={(event) => setTimePart("hour", event.target.value)}><option value="" disabled>{t("hourPlaceholder")}</option>{Array.from({ length: 24 }, (_, hour) => <option key={hour} value={String(hour).padStart(2, "0")}>{String(hour).padStart(2, "0")}</option>)}</select><span aria-hidden="true">:</span><select aria-label={t("minute")} value={form.scheduledTime.split(":")[1] || ""} onChange={(event) => setTimePart("minute", event.target.value)}><option value="" disabled>{t("minutePlaceholder")}</option>{Array.from({ length: 60 }, (_, minute) => <option key={minute} value={String(minute).padStart(2, "0")}>{String(minute).padStart(2, "0")}</option>)}</select></span></label>
              </div>
              <label>{t("repeat")}<select name="recurrence" value={form.recurrence} onChange={handleChange}><option value="once">{t("once")}</option><option value="daily">{t("everyDay")}</option><option value="weekly">{t("everyWeek")}</option></select></label>
              <button className="reminder-submit-button" type="submit">{editingReminder ? t("saveChanges") : t("createReminder")}</button>
              {editingReminder && <button type="button" className="reminder-cancel-button" onClick={cancelEditing}>{t("cancelEditing")}</button>}
            </form>
          </section>

          <section className="reminder-list-card">
            <div className="reminder-list-heading"><div><p className="eyebrow">{t("activeRemindersHeading")}</p><h2>{t("yourCareSchedule")}</h2></div><span>{reminders.length}</span></div>
            {reminders.length === 0 ? <div className="reminder-empty-state"><span aria-hidden="true">✦</span><h3>{t("noReminders")}</h3><p>{t("createFirstReminder")}</p></div> : <div className="reminder-list">{reminders.map((reminder) => <article className="reminder-item" key={reminder._id}><div className="reminder-icon">{getIcon(reminder.type)}</div><div className="reminder-info"><h3>{reminder.title}</h3>{reminder.description && <p>{reminder.description}</p>}<div className="reminder-meta"><strong>{reminder.scheduledTime}</strong><span>{recurrenceLabel(reminder.recurrence)}</span></div></div><div className="reminder-actions"><button className="reminder-edit-button" onClick={() => startEditing(reminder)}>{t("edit")}</button><button className="reminder-delete-button" onClick={() => deleteReminder(reminder._id)}>{t("delete")}</button></div></article>)}</div>}
          </section>
        </div>
      </main>
    </div>
  );
}

export default ReminderManager;
