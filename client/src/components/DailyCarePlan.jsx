import { useEffect, useState } from "react";
import { API_URL } from "../api";
import { getUIText } from "../uiTranslations";

const patientFromStorage = () => {
  try { return JSON.parse(localStorage.getItem("mindset_ner_user") || "null")?.patientId; }
  catch { return null; }
};
const today = () => new Intl.DateTimeFormat("en-CA").format(new Date());

function DailyCarePlan({ patientId = patientFromStorage(), readOnly = false, language = "en-IN" }) {
  const t = (key) => getUIText(language, key);
  const displayActivity = (value) => {
    const key = {
      "Memory Activity": "memoryActivityName",
      "Attention Activity": "attentionActivityName",
      "Daily Routine Recall": "dailyRoutineRecallActivityName",
      "Pattern Recognition": "patternRecognitionActivityName",
      "Object Recognition": "objectRecognitionActivityName",
    }[value];
    return key ? t(key) : value;
  };
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState("");
  const loadPlan = async () => {
    if (!patientId) return;
    try {
      const token = localStorage.getItem("mindset_ner_token");
      const response = await fetch(`${API_URL}/api/daily-care-plan/${patientId}?date=${today()}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || t("unableToLoadDailyCarePlan"));
      setPlan(data.plan);
    } catch (loadError) { setError(loadError.message); }
  };
  useEffect(() => { loadPlan(); }, [patientId]);
  const complete = async (item) => {
    try {
      setUpdating(item.key);
      const token = localStorage.getItem("mindset_ner_token");
      const response = await fetch(`${API_URL}/api/daily-care-plan/${patientId}/items/${encodeURIComponent(item.key)}/complete`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ date: plan.date }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || t("unableToCompleteDailyCarePlanItem"));
      setPlan((current) => ({ ...current, items: current.items.map((currentItem) => currentItem.key === item.key ? { ...currentItem, completed: true } : currentItem), progress: { ...current.progress, completed: current.progress.completed + 1 } }));
    } catch (completeError) { setError(completeError.message); }
    finally { setUpdating(""); }
  };
  if (!patientId || error) return null;
  if (!plan) return <section className="daily-care-plan"><p>{t("loadingDailyCarePlan")}</p></section>;
  return <section className={`daily-care-plan ${readOnly ? "readonly" : ""}`}>
    <p className="eyebrow">{t("dailyCarePlanHeading")}</p>
    <h2>📅 {t("todaysCarePlan")}</h2>
    <p className="daily-care-focus">{t("todaysFocus")} <strong>{displayActivity(plan.focus)}</strong></p>
    <div className="daily-care-items">{plan.items.map((item) => <article key={item.key} className={item.completed ? "completed" : ""}>
      <span aria-hidden="true">{item.completed ? "✓" : "○"}</span>
      <div><strong>{item.type === "mood" ? t("moodCheckIn") : displayActivity(item.title)}</strong><small>{item.type === "mood" ? (item.completed ? t("todaysMoodCheckComplete") : t("completeTodaysMoodCheck")) : item.type === "activity" ? t("recommendedFromRecentActivity") : `${item.scheduledTime} — ${t("reminder")}`}</small></div>
      {!readOnly && item.canComplete && !item.completed && <button type="button" disabled={updating === item.key} onClick={() => complete(item)}>{t("markComplete")}</button>}
    </article>)}</div>
    <p className="daily-care-progress">{t("progress")} <strong>{plan.progress.completed} / {plan.progress.total} {t("completed")}</strong></p>
  </section>;
}

export default DailyCarePlan;
