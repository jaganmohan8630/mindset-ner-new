import { useState } from "react";
import { API_URL } from "../api";
import FacialMoodDetection from "./FacialMoodDetection";
import { getUIText } from "../uiTranslations";

function MoodCheckIn({ onBack, language = "en-IN" }) {
  const t = (key) => getUIText(language, key);
  const [selectedMood, setSelectedMood] = useState(null);
  const [saved, setSaved] = useState(false);

  const moods = [
    {
      id: "happy",
      emoji: "😊",
      label: t("moodHappy"),
      message: t("moodHappyMessage"),
    },
    {
      id: "okay",
      emoji: "🙂",
      label: t("moodOkay"),
      message: t("moodOkayMessage"),
    },
    {
      id: "neutral",
      emoji: "😐",
      label: t("moodNotSure"),
      message: t("moodNotSureMessage"),
    },
    {
      id: "worried",
      emoji: "😟",
      label: t("moodWorried"),
      message: t("moodWorriedMessage"),
    },
    {
      id: "sad",
      emoji: "😢",
      label: t("moodSad"),
      message: t("moodSadMessage"),
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
      alert(t("unableToSaveFeeling"));
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
          <span aria-hidden="true">←</span> {t("backToHome")}
        </button>

        <header className="mood-header">
          <div className="mood-header-icon" aria-hidden="true">
            ♥
          </div>
          <p>{t("moodCheckInEyebrow")}</p>
          <h1>{t("moodCheckInTitle")}</h1>
          <span>
            {t("moodCheckInSubtitle")}
          </span>
        </header>

        <section className="mood-checkin-card" aria-label={t("chooseFeeling")}>
          <div className="mood-card-heading">
            <span>1</span>
            <div>
              <h2>{t("chooseFeeling")}</h2>
              <p>{t("moodNoWrongAnswer")}</p>
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
                    {t("moodYouChose").replace("{mood}", selectedMood.label)}
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
                {saved ? t("moodFeelingSaved") : t("saveMyFeeling")}
              </button>
            </div>
          )}
        </section>

        <FacialMoodDetection onDetected={handleDetectedMood} />

        <footer className="mood-footer-note">
          <span aria-hidden="true">♢</span> {t("moodPrivacy")}
        </footer>
      </main>
    </div>
  );
}

export default MoodCheckIn;
