import { useState } from "react";
import { API_URL } from "../api";
import FacialMoodDetection from "./FacialMoodDetection";
function MoodCheckIn({ onBack, language = "en-IN" }) {
  const isHindi = language === "hi-IN";
  const isTelugu = language === "te-IN";
  const isAssamese = language === "as-IN";
  const isBengali = language === "bn-IN";
  const isNagamese = language === "nag-IN";
  const text = isHindi
    ? { eyebrow: "भावनात्मक स्वास्थ्य", title: "आज आप कैसा महसूस कर रहे हैं?", subtitle: "उस भावना को चुनें जो इस समय आपकी भावना को सबसे अच्छी तरह बताती है।", choose: "अपनी भावना चुनें", noWrongAnswer: "कोई उत्तर सही या गलत नहीं है।", selected: "आपने चुना", saved: "भावना सहेज ली गई", save: "अपनी भावना सहेजें", privacy: "आपकी भावनाएँ निजी हैं और समय के साथ आपकी सेहत को समझने में मदद करती हैं।" }
    : isTelugu
      ? { eyebrow: "భావోద్వేగ శ్రేయస్సు", title: "ఈ రోజు మీరు ఎలా భావిస్తున్నారు?", subtitle: "ఇప్పుడు మీరు ఎలా భావిస్తున్నారో ఉత్తమంగా తెలిపే భావనను ఎంచుకోండి.", choose: "మీ భావనను ఎంచుకోండి", noWrongAnswer: "సరైన లేదా తప్పు సమాధానం లేదు.", selected: "మీరు ఎంచుకున్నది", saved: "భావన సేవ్ చేయబడింది", save: "నా భావనను సేవ్ చేయండి", privacy: "మీ భావనలు వ్యక్తిగతమైనవి మరియు కాలక్రమేణా మీ శ్రేయస్సును గమనించడంలో సహాయపడతాయి." }
      : isAssamese
        ? { eyebrow: "আৱেগিক সুস্থতা", title: "আজি আপোনাৰ কেনে লাগিছে?", subtitle: "এতিয়া আপোনাৰ অনুভৱক আটাইতকৈ ভালদৰে বৰ্ণনা কৰা অনুভূতিটো বাছক।", choose: "আপোনাৰ অনুভূতি বাছক", noWrongAnswer: "ইয়াত কোনো সঠিক বা ভুল উত্তৰ নাই।", selected: "আপুনি বাছিলে", saved: "অনুভূতি সংৰক্ষণ কৰা হ’ল", save: "মোৰ অনুভূতি সংৰক্ষণ কৰক", privacy: "আপোনাৰ অনুভূতিবোৰ ব্যক্তিগত আৰু সময়ৰ সৈতে আপোনাৰ সুস্থতা লক্ষ্য কৰাত সহায় কৰে।" }
        : isBengali
          ? { eyebrow: "মানসিক সুস্থতা", title: "আজ আপনার কেমন লাগছে?", subtitle: "এখন আপনার অনুভূতিকে সবচেয়ে ভালোভাবে বর্ণনা করে এমন অনুভূতিটি বেছে নিন।", choose: "আপনার অনুভূতি বেছে নিন", noWrongAnswer: "এখানে কোনো সঠিক বা ভুল উত্তর নেই।", selected: "আপনি বেছে নিয়েছেন", saved: "অনুভূতি সংরক্ষিত হয়েছে", save: "আমার অনুভূতি সংরক্ষণ করুন", privacy: "আপনার অনুভূতিগুলি ব্যক্তিগত এবং সময়ের সঙ্গে আপনার সুস্থতা বুঝতে সাহায্য করে।" }
          : isNagamese
            ? { eyebrow: "Emotional well-being", title: "Aji apunak keneka lagise?", subtitle: "Etiya apunar feeling bhal pora kowa feeling tu bachibo.", choose: "Apunar feeling bachibo", noWrongAnswer: "Eitu te thik ba bhul answer nai.", selected: "Apuni bacha", saved: "Feeling save hoise", save: "Mur feeling save koribo", privacy: "Apunar feelings private ase aru time logot apunar bhal thaka bujhibole help kore." }
      : { eyebrow: "EMOTIONAL WELL-BEING", title: "How are you feeling today?", subtitle: "Choose the feeling that best describes how you feel right now.", choose: "Choose a feeling", noWrongAnswer: "There is no right or wrong answer.", selected: "YOU CHOSE", saved: "Feeling Saved", save: "Save My Feeling", privacy: "Your feelings are private and help you notice your well-being over time." };
  const [selectedMood, setSelectedMood] = useState(null);
  const [saved, setSaved] = useState(false);

  const moods = [
    {
      id: "happy",
      emoji: "😊",
      label: isHindi ? "खुश" : isTelugu ? "సంతోషంగా" : isAssamese ? "সুখী" : isBengali ? "খুশি" : isNagamese ? "Khushi" : "Happy",
      message: isHindi ? "यह बहुत अच्छा है! अपने दिन का आनंद लेते रहें।" : isTelugu ? "అది చాలా బాగుంది! మీ రోజును ఆనందంగా గడపండి." : isAssamese ? "এইটো খুব ভাল! আপোনাৰ দিনটো উপভোগ কৰি থাকক।" : isBengali ? "এটি দারুণ! আপনার দিনটি উপভোগ করতে থাকুন।" : isNagamese ? "Eitu bohut bhal! Apunar din enjoy kori thakibo." : "That's wonderful! Keep enjoying your day.",
    },
    {
      id: "okay",
      emoji: "🙂",
      label: isHindi ? "ठीक" : isTelugu ? "బాగున్నాను" : isAssamese ? "ভাল" : isBengali ? "ভালো" : isNagamese ? "Thik ase" : "Okay",
      message: isHindi ? "यह अच्छा है। आराम से अपना दिन बिताएँ।" : isTelugu ? "అది మంచిది. నెమ్మదిగా మీ రోజును ఆనందించండి." : isAssamese ? "এইটো ভাল। সময় লৈ আপোনাৰ দিনটো উপভোগ কৰক।" : isBengali ? "এটি ভালো। সময় নিয়ে আপনার দিনটি উপভোগ করুন।" : "That's good. Take your time and enjoy your day.",
    },
    {
      id: "neutral",
      emoji: "😐",
      label: isHindi ? "पता नहीं" : isTelugu ? "తెలియదు" : isAssamese ? "নিশ্চিত নহয়" : isBengali ? "নিশ্চিত নই" : isNagamese ? "Najane" : "Not sure",
      message: isHindi ? "कोई बात नहीं। अपने लिए एक शांत पल लें।" : isTelugu ? "పర్వాలేదు. మీ కోసం ఒక ప్రశాంతమైన క్షణం తీసుకోండి." : isAssamese ? "কোনো কথা নাই। নিজৰ বাবে অলপ শান্ত সময় লওক।" : isBengali ? "কোনো সমস্যা নেই। নিজের জন্য একটু শান্ত সময় নিন।" : "That's okay. Take a gentle moment for yourself.",
    },
    {
      id: "worried",
      emoji: "😟",
      label: isHindi ? "चिंतित" : isTelugu ? "ఆందోళనగా" : isAssamese ? "চিন্তিত" : isBengali ? "চিন্তিত" : isNagamese ? "Chinta" : "Worried",
      message: isHindi ? "चिंतित महसूस करना ठीक है। धीरे से साँस लें और आराम करें।" : isTelugu ? "ఆందోళన చెందడం సహజం. నెమ్మదిగా శ్వాస తీసుకుని విశ్రాంతి తీసుకోండి." : isAssamese ? "চিন্তা অনুভৱ কৰাটো স্বাভাৱিক। লাহে লাহে শ্বাস লওক আৰু জিৰণি লওক।" : isBengali ? "চিন্তিত হওয়া স্বাভাবিক। ধীরে শ্বাস নিন এবং আরাম করুন।" : "It's okay to feel worried. Take a slow breath and relax.",
    },
    {
      id: "sad",
      emoji: "😢",
      label: isHindi ? "उदास" : isTelugu ? "విచారంగా" : isAssamese ? "দুখী" : isBengali ? "দুঃখিত" : isNagamese ? "Dukhi" : "Sad",
      message: isHindi ? "मुझे दुख है कि आप उदास हैं। आप अकेले नहीं हैं।" : isTelugu ? "మీరు విచారంగా ఉన్నందుకు బాధగా ఉంది. మీరు ఒంటరిగా లేరు." : isAssamese ? "আপোনাৰ দুখ লাগিছে বুলি শুনি বেয়া লাগিল। আপুনি অকলশৰীয়া নহয়।" : isBengali ? "আপনার মন খারাপ শুনে দুঃখিত। আপনি একা নন।" : "I'm sorry you're feeling sad. You are not alone.",
    },
  ];

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setSaved(false);
  };

  const saveMood = async (moodToSave = selectedMood) => {
    if (!moodToSave) return;

    try {
      const user = JSON.parse(
        localStorage.getItem("mindset_ner_user") || "null",
      );

      const token = localStorage.getItem("mindset_ner_token");

      const response = await fetch(`${API_URL}/api/moods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patientId: user?.patientId,
          mood: moodToSave.id,
          label: moodToSave.label,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save mood");
      }

      setSaved(true);
    } catch (error) {
      console.error("Mood save error:", error);
      alert("Unable to save your feeling. Please try again.");
    }
  };

  const handleDetectedMood = (detection) => {
    const detectedMood = moods.find((mood) => mood.id === detection.moodId);
    if (!detectedMood) return;

    setSelectedMood(detectedMood);
    setSaved(false);
    saveMood(detectedMood);
  };

  return (
    <div className="mood-page">
      <main className="mood-shell">
        <button className="mood-back-button" onClick={onBack}>
          <span aria-hidden="true">←</span> {isHindi ? "होम पर वापस जाएँ" : isTelugu ? "హోమ్‌కు తిరిగి వెళ్లండి" : isAssamese ? "হোমলৈ উভতি যাওক" : isBengali ? "হোমে ফিরে যান" : isNagamese ? "Home te piche jai" : "Back to home"}
        </button>

        <header className="mood-header">
          <div className="mood-header-icon" aria-hidden="true">
            ♥
          </div>
          <p>{text.eyebrow}</p>
          <h1>{text.title}</h1>
          <span>
            {text.subtitle}
          </span>
        </header>

        <section className="mood-checkin-card" aria-label={text.choose}>
          <div className="mood-card-heading">
            <span>1</span>
            <div>
              <h2>{text.choose}</h2>
              <p>{text.noWrongAnswer}</p>
            </div>
          </div>
          <div className="mood-options">
            {moods.map((mood) => (
              <button
                key={mood.id}
                className={`mood-option ${selectedMood?.id === mood.id ? "selected" : ""}`}
                onClick={() => handleMoodSelect(mood)}
                aria-pressed={selectedMood?.id === mood.id}
              >
                <span className="mood-emoji">{mood.emoji}</span>
                <span>{mood.label}</span>
              </button>
            ))}
          </div>

          {selectedMood && (
            <div className="mood-feedback">
              <div className="mood-feedback-copy">
                <div className="mood-feedback-emoji">{selectedMood.emoji}</div>
                <div>
                  <p className="mood-selected-label">
                    {text.selected} {selectedMood.label}
                  </p>
                  <h2>{selectedMood.message}</h2>
                </div>
              </div>
              <button
                className="mood-save-button"
                onClick={saveMood}
                disabled={saved}
              >
                <span aria-hidden="true">{saved ? "✓" : "♥"}</span>
                {saved ? text.saved : text.save}
              </button>
            </div>
          )}
        </section>

        <FacialMoodDetection onDetected={handleDetectedMood} />

        <footer className="mood-footer-note">
          <span aria-hidden="true">♢</span> {text.privacy}
        </footer>
      </main>
    </div>
  );
}

export default MoodCheckIn;
