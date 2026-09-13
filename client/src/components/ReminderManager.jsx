import { useEffect, useState } from "react";
import { API_URL } from "../api";
import { socket } from "../socket";

const initialForm = {
  type: "medicine", title: "", description: "", scheduledDate: "", scheduledTime: "", recurrence: "once",
};

function ReminderManager({ onBack }) {
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
      if (!token) throw new Error("Authentication required.");
      const connectionsResponse = await fetch(`${API_URL}/api/connections/my-patients`, { headers: { Authorization: `Bearer ${token}` } });
      const connectionsData = await connectionsResponse.json();
      if (!connectionsResponse.ok) throw new Error(connectionsData.message || "Failed to load connected patients");
      if (!connectionsData.patients?.length) throw new Error("No accepted patients are connected to this caregiver.");
      const connectedPatientId = connectionsData.patients[0].patient._id;
      setPatientId(connectedPatientId);
      const response = await fetch(`${API_URL}/api/reminders/${connectedPatientId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to load reminders");
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
    if (!form.title || !/^\d{2}:\d{2}$/.test(form.scheduledTime)) { setError("Title and a complete time are required."); return; }
    try {
      const isEditing = Boolean(editingReminder);
      const response = await fetch(isEditing ? `${API_URL}/api/reminders/${editingReminder._id}` : `${API_URL}/api/reminders`, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ patientId, ...form, scheduledDate: form.scheduledDate || null }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Failed to ${isEditing ? "update" : "create"} reminder`);
      setMessage(`Reminder ${isEditing ? "updated" : "created"} successfully.`); notifyUpdate(); setEditingReminder(null); setForm(initialForm); await loadReminders();
    } catch (err) { setError(err.message); }
  };

  const deleteReminder = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/reminders/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete reminder");
      setReminders((current) => current.filter((reminder) => reminder._id !== id)); notifyUpdate(); setMessage("Reminder deleted successfully.");
    } catch (err) { setError(err.message); }
  };

  const startEditing = (reminder) => {
    setEditingReminder(reminder);
    setForm({ type: reminder.type, title: reminder.title, description: reminder.description || "", scheduledDate: reminder.scheduledDate ? new Date(reminder.scheduledDate).toISOString().split("T")[0] : "", scheduledTime: reminder.scheduledTime || "", recurrence: reminder.recurrence || "once" });
    setMessage(""); setError("");
  };
  const cancelEditing = () => { setEditingReminder(null); setForm(initialForm); };
  const getIcon = (type) => ({ medicine: "💊", hydration: "💧", daily_activity: "🌿", appointment: "🏥" }[type] || "🔔");

  if (loading) return <div className="reminder-manager-page"><div className="reminder-manager-loading">Loading reminders…</div></div>;

  return (
    <div className="reminder-manager-page">
      <main className="reminder-manager-shell">
        <header className="reminder-manager-header">
          <button className="reminder-back-button" onClick={onBack}><span aria-hidden="true">←</span> Back to dashboard</button>
          <div className="reminder-manager-intro">
            <div className="reminder-header-icon" aria-hidden="true">🔔</div>
            <div><p className="eyebrow">CAREGIVER TOOLS</p><h1>Patient reminders</h1><p>Plan gentle prompts for medicines, hydration, activities and appointments.</p></div>
          </div>
          <div className="reminder-overview" aria-label="Reminder overview"><span className="reminder-overview-icon" aria-hidden="true">✓</span><div><strong>{reminders.length}</strong><span>active {reminders.length === 1 ? "reminder" : "reminders"}</span></div></div>
        </header>

        {message && <div className="reminder-notice reminder-notice-success" role="status">{message}</div>}
        {error && <div className="reminder-notice reminder-notice-error" role="alert">{error}</div>}

        <div className="reminder-layout">
          <section className="reminder-form-card">
            <div className="reminder-card-heading"><span aria-hidden="true">{editingReminder ? "✎" : "+"}</span><div><p className="eyebrow">{editingReminder ? "EDIT REMINDER" : "CREATE REMINDER"}</p><h2>{editingReminder ? "Update the details" : "Set a new reminder"}</h2></div></div>
            <form onSubmit={submitReminder}>
              <label>Reminder type<select name="type" value={form.type} onChange={handleChange}><option value="medicine">💊 Medicine</option><option value="hydration">💧 Hydration</option><option value="daily_activity">🌿 Daily activity</option><option value="appointment">🏥 Appointment</option></select></label>
              <label>Title<input name="title" value={form.title} onChange={handleChange} placeholder="Example: Morning medicine" /></label>
              <label>Description<textarea name="description" value={form.description} onChange={handleChange} placeholder="Add simple instructions" /></label>
              <div className="reminder-form-row">
                <label><span className="reminder-field-label">Date <span className="reminder-optional">Optional</span></span><input type="date" name="scheduledDate" value={form.scheduledDate} onChange={handleChange} /></label>
                <label><span className="reminder-field-label">Time</span><span className="reminder-time-picker"><select aria-label="Hour" value={form.scheduledTime.split(":")[0] || ""} onChange={(event) => setTimePart("hour", event.target.value)}><option value="" disabled>HH</option>{Array.from({ length: 24 }, (_, hour) => <option key={hour} value={String(hour).padStart(2, "0")}>{String(hour).padStart(2, "0")}</option>)}</select><span aria-hidden="true">:</span><select aria-label="Minute" value={form.scheduledTime.split(":")[1] || ""} onChange={(event) => setTimePart("minute", event.target.value)}><option value="" disabled>MM</option>{Array.from({ length: 60 }, (_, minute) => <option key={minute} value={String(minute).padStart(2, "0")}>{String(minute).padStart(2, "0")}</option>)}</select></span></label>
              </div>
              <label>Repeat<select name="recurrence" value={form.recurrence} onChange={handleChange}><option value="once">Once</option><option value="daily">Every day</option><option value="weekly">Every week</option></select></label>
              <button className="reminder-submit-button" type="submit">{editingReminder ? "Save changes" : "Create reminder"}</button>
              {editingReminder && <button type="button" className="reminder-cancel-button" onClick={cancelEditing}>Cancel editing</button>}
            </form>
          </section>

          <section className="reminder-list-card">
            <div className="reminder-list-heading"><div><p className="eyebrow">ACTIVE REMINDERS</p><h2>Your care schedule</h2></div><span>{reminders.length}</span></div>
            {reminders.length === 0 ? <div className="reminder-empty-state"><span aria-hidden="true">✦</span><h3>No reminders yet</h3><p>Create the first reminder to help your patient stay on track.</p></div> : <div className="reminder-list">{reminders.map((reminder) => <article className="reminder-item" key={reminder._id}><div className="reminder-icon">{getIcon(reminder.type)}</div><div className="reminder-info"><h3>{reminder.title}</h3>{reminder.description && <p>{reminder.description}</p>}<div className="reminder-meta"><strong>{reminder.scheduledTime}</strong><span>{reminder.recurrence === "daily" ? "Every day" : reminder.recurrence === "weekly" ? "Every week" : "Once"}</span></div></div><div className="reminder-actions"><button className="reminder-edit-button" onClick={() => startEditing(reminder)}>Edit</button><button className="reminder-delete-button" onClick={() => deleteReminder(reminder._id)}>Delete</button></div></article>)}</div>}
          </section>
        </div>
      </main>
    </div>
  );
}

export default ReminderManager;
