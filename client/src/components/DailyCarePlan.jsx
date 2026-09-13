import { useEffect, useState } from "react";
import { API_URL } from "../api";

const patientFromStorage = () => {
  try { return JSON.parse(localStorage.getItem("mindset_ner_user") || "null")?.patientId; }
  catch { return null; }
};
const today = () => new Intl.DateTimeFormat("en-CA").format(new Date());
const copy = {
  "en-IN": { eyebrow: "DAILY CARE PLAN", title: "Today's Care Plan", focus: "Today's focus:", mood: "Mood Check", moodDone: "Today's mood check is complete.", moodTodo: "Complete today's mood check.", reminder: "reminder", recommended: "Recommended from your recent activity.", complete: "Mark complete", progress: "Progress:", completed: "completed", loading: "Loading today's care plan…" },
  "hi-IN": { eyebrow: "दैनिक देखभाल योजना", title: "आज की देखभाल योजना", focus: "आज का मुख्य ध्यान:", mood: "मनोदशा जाँच", moodDone: "आज की मनोदशा जाँच पूरी हो गई है।", moodTodo: "आज की मनोदशा जाँच पूरी करें।", reminder: "रिमाइंडर", recommended: "आपकी हाल की गतिविधि के आधार पर सुझाव।", complete: "पूरा करें", progress: "प्रगति:", completed: "पूर्ण", loading: "आज की देखभाल योजना लोड हो रही है…" },
  "te-IN": { eyebrow: "రోజువారీ సంరక్షణ ప్రణాళిక", title: "నేటి సంరక్షణ ప్రణాళిక", focus: "నేటి ప్రధాన దృష్టి:", mood: "మానసిక స్థితి తనిఖీ", moodDone: "నేటి మానసిక స్థితి తనిఖీ పూర్తయింది.", moodTodo: "నేటి మానసిక స్థితి తనిఖీ పూర్తి చేయండి.", reminder: "రిమైండర్", recommended: "మీ ఇటీవలి కార్యకలాపం ఆధారంగా సిఫార్సు.", complete: "పూర్తి చేయండి", progress: "పురోగతి:", completed: "పూర్తయింది", loading: "నేటి సంరక్షణ ప్రణాళిక లోడ్ అవుతోంది…" },
  "as-IN": { eyebrow: "দৈনিক যত্ন পৰিকল্পনা", title: "আজিৰ যত্ন পৰিকল্পনা", focus: "আজিৰ মূল লক্ষ্য:", mood: "মনোভাৱ পৰীক্ষা", moodDone: "আজিৰ মনোভাৱ পৰীক্ষা সম্পূৰ্ণ হৈছে।", moodTodo: "আজিৰ মনোভাৱ পৰীক্ষা সম্পূৰ্ণ কৰক।", reminder: "সোঁৱৰণী", recommended: "আপোনাৰ শেহতীয়া কাৰ্যকলাপৰ ভিত্তিত পৰামৰ্শ।", complete: "সম্পূৰ্ণ কৰক", progress: "অগ্ৰগতি:", completed: "সম্পূৰ্ণ", loading: "আজিৰ যত্ন পৰিকল্পনা লোড হৈছে…" },
  "bn-IN": { eyebrow: "দৈনিক যত্ন পরিকল্পনা", title: "আজকের যত্ন পরিকল্পনা", focus: "আজকের প্রধান লক্ষ্য:", mood: "মেজাজ পরীক্ষা", moodDone: "আজকের মেজাজ পরীক্ষা সম্পন্ন হয়েছে।", moodTodo: "আজকের মেজাজ পরীক্ষা সম্পন্ন করুন।", reminder: "রিমাইন্ডার", recommended: "আপনার সাম্প্রতিক কার্যকলাপের ভিত্তিতে পরামর্শ।", complete: "সম্পন্ন করুন", progress: "অগ্রগতি:", completed: "সম্পন্ন", loading: "আজকের যত্ন পরিকল্পনা লোড হচ্ছে…" },
  "nag-IN": { eyebrow: "Daily Care Plan", title: "Aji Care Plan", focus: "Aji main focus:", mood: "Mood Check", moodDone: "Aji mood check complete hoi ase.", moodTodo: "Aji mood check complete koribo.", reminder: "reminder", recommended: "Apunar recent activity hisab te recommendation.", complete: "Complete koribo", progress: "Progress:", completed: "complete", loading: "Aji care plan load hoi ase…" },
};
const activities = {
  "en-IN": { "Memory Activity": "Memory Activity", "Attention Activity": "Attention Activity", "Daily Routine Recall": "Daily Routine Recall", "Pattern Recognition": "Pattern Recognition", "Object Recognition": "Object Recognition" },
  "hi-IN": { "Memory Activity": "स्मृति गतिविधि", "Attention Activity": "ध्यान गतिविधि", "Daily Routine Recall": "दैनिक दिनचर्या याद", "Pattern Recognition": "पैटर्न पहचान", "Object Recognition": "वस्तु पहचान" },
  "te-IN": { "Memory Activity": "జ్ఞాపకశక్తి కార్యకలాపం", "Attention Activity": "శ్రద్ధ కార్యకలాపం", "Daily Routine Recall": "రోజువారీ దినచర్య గుర్తింపు", "Pattern Recognition": "నమూనా గుర్తింపు", "Object Recognition": "వస్తు గుర్తింపు" },
  "as-IN": { "Memory Activity": "স্মৃতি কাৰ্যকলাপ", "Attention Activity": "মনোযোগ কাৰ্যকলাপ", "Daily Routine Recall": "দৈনিক দিনচৰ্যা মনত পেলোৱা", "Pattern Recognition": "নমুনা চিনাক্তকৰণ", "Object Recognition": "বস্তু চিনাক্তকৰণ" },
  "bn-IN": { "Memory Activity": "স্মৃতি কার্যক্রম", "Attention Activity": "মনোযোগ কার্যক্রম", "Daily Routine Recall": "দৈনিক রুটিন স্মরণ", "Pattern Recognition": "প্যাটার্ন শনাক্তকরণ", "Object Recognition": "বস্তু শনাক্তকরণ" },
  "nag-IN": { "Memory Activity": "Memory Activity", "Attention Activity": "Attention Activity", "Daily Routine Recall": "Daily Routine Recall", "Pattern Recognition": "Pattern Recognition", "Object Recognition": "Object Recognition" },
};

function DailyCarePlan({ patientId = patientFromStorage(), readOnly = false, language = "en-IN" }) {
  const text = copy[language] || copy["en-IN"];
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState("");
  const loadPlan = async () => {
    if (!patientId) return;
    try {
      const token = localStorage.getItem("mindset_ner_token");
      const response = await fetch(`${API_URL}/api/daily-care-plan/${patientId}?date=${today()}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load today's care plan");
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
      if (!response.ok) throw new Error(data.message || "Unable to complete care plan item");
      setPlan((current) => ({ ...current, items: current.items.map((currentItem) => currentItem.key === item.key ? { ...currentItem, completed: true } : currentItem), progress: { ...current.progress, completed: current.progress.completed + 1 } }));
    } catch (completeError) { setError(completeError.message); }
    finally { setUpdating(""); }
  };
  if (!patientId || error) return null;
  if (!plan) return <section className="daily-care-plan"><p>{text.loading}</p></section>;
  return <section className={`daily-care-plan ${readOnly ? "readonly" : ""}`}>
    <p className="eyebrow">{text.eyebrow}</p>
    <h2>📅 {text.title}</h2>
    <p className="daily-care-focus">{text.focus} <strong>{activities[language]?.[plan.focus] || plan.focus}</strong></p>
    <div className="daily-care-items">{plan.items.map((item) => <article key={item.key} className={item.completed ? "completed" : ""}>
      <span aria-hidden="true">{item.completed ? "✓" : "○"}</span>
      <div><strong>{item.type === "mood" ? text.mood : activities[language]?.[item.title] || item.title}</strong><small>{item.type === "mood" ? (item.completed ? text.moodDone : text.moodTodo) : item.type === "activity" ? text.recommended : `${item.scheduledTime} — ${text.reminder}`}</small></div>
      {!readOnly && item.canComplete && !item.completed && <button type="button" disabled={updating === item.key} onClick={() => complete(item)}>{text.complete}</button>}
    </article>)}</div>
    <p className="daily-care-progress">{text.progress} <strong>{plan.progress.completed} / {plan.progress.total} {text.completed}</strong></p>
  </section>;
}

export default DailyCarePlan;
