import { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { API_URL } from "../api";
import { getUIText } from "../uiTranslations";

const MAX_PEOPLE_PER_SESSION = 5;
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

const familiaritySpeechTemplates = {
  "en-IN": (name) => `This is ${name}.`,
  "hi-IN": (name) => `ये ${name} हैं।`,
  "te-IN": (name) => `వీరు ${name}.`,
  "as-IN": (name) => `এওঁ হৈছে ${name}।`,
  "bn-IN": (name) => `ইনি হলেন ${name}।`,
  "nag-IN": (name) => `Eitu ${name} ase.`,
};

function FamilyFamiliarityTraining({ onBack, language = "en-IN" }) {
  const t = (key) => getUIText(language, key);
  const say = familiaritySpeechTemplates[language] || familiaritySpeechTemplates["en-IN"];
  const [person, setPerson] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [personIndex, setPersonIndex] = useState(0);
  const [totalPeople, setTotalPeople] = useState(0);
  const peopleRef = useRef([]);
  const photoCacheRef = useRef(new Map());
  const completionInFlightRef = useRef(false);
  const user = JSON.parse(localStorage.getItem("mindset_ner_user") || "null");
  const patientId = user?.patientId;
  const token = localStorage.getItem("mindset_ner_token");

  const getPhotoUrl = async (personId) => {
    const cacheKey = String(personId);
    const cached = photoCacheRef.current.get(cacheKey);
    if (cached) return cached;

    const request = fetch(`${API_URL}/api/familiar-people/photo/${personId}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "force-cache",
    }).then(async (response) => {
      if (!response.ok) throw new Error(t("familiarPhotoCouldNotLoad"));
      return URL.createObjectURL(await response.blob());
    });
    photoCacheRef.current.set(cacheKey, request);
    return request;
  };

  const clearPhotoCache = () => {
    photoCacheRef.current.forEach((item) => {
      Promise.resolve(item).then((url) => URL.revokeObjectURL(url)).catch(() => {});
    });
    photoCacheRef.current.clear();
  };

  // Kept separate from Voice AI: this only announces the visible name.
  const speakName = async (name) => {
    const message = say(name);
    const speechLanguage = language === "nag-IN" ? "en-IN" : language;
    if (Capacitor.isNativePlatform()) {
      try {
        await TextToSpeech.stop();
        await TextToSpeech.speak({ text: message, lang: speechLanguage, rate: 0.75, pitch: 1 });
      } catch (speechError) {
        console.warn("Could not speak familiar person's name:", speechError);
      }
      return;
    }

    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = speechLanguage;
    utterance.rate = 0.75;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const loadPerson = async (index, people = peopleRef.current) => {
    const nextPerson = people[index];
    if (!nextPerson) return;

    setLoading(true);
    setError("");
    setPhotoUrl("");
    try {
      const objectUrl = await getPhotoUrl(nextPerson._id);
      setPhotoUrl(objectUrl);
      setPerson(nextPerson);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const initialize = async () => {
      try {
        const response = await fetch(`${API_URL}/api/familiar-people/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || t("couldNotPrepareFamiliaritySession"));
        if ((data.people || []).length === 0) throw new Error(t("noFamiliarPeopleAdded"));

        const sessionPeople = shuffle(data.people).slice(0, MAX_PEOPLE_PER_SESSION);
        if (cancelled) return;
        peopleRef.current = sessionPeople;
        setTotalPeople(sessionPeople.length);
        sessionPeople.forEach((item) => getPhotoUrl(item._id).catch(() => {}));
        await loadPerson(0, sessionPeople);
      } catch (initializeError) {
        if (!cancelled) {
          setError(initializeError.message);
          setLoading(false);
        }
      }
    };

    initialize();
    return () => {
      cancelled = true;
      clearPhotoCache();
      if (Capacitor.isNativePlatform()) TextToSpeech.stop().catch(() => {});
      else if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (person?.name && photoUrl) speakName(person.name);
  }, [person, photoUrl]);

  const saveCompletedSession = async () => {
    const totalQuestions = peopleRef.current.length;
    const response = await fetch(`${API_URL}/api/games/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        patientId,
        gameType: "familyFamiliarity",
        difficulty: 1,
        score: 100,
        totalQuestions,
        correctAnswers: totalQuestions,
        accuracy: 100,
        averageResponseTime: 0,
        playedOffline: false,
        synced: true,
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || t("couldNotSaveFamiliaritySession"));
  };

  const showNextPerson = async () => {
    if (personIndex + 1 >= totalPeople) {
      if (completionInFlightRef.current) return;
      completionInFlightRef.current = true;
      setError("");
      try {
        await saveCompletedSession();
        setPhotoUrl("");
        setPerson(null);
        setPersonIndex(totalPeople);
      } catch (saveError) {
        setError(saveError.message);
      } finally {
        completionInFlightRef.current = false;
      }
      return;
    }
    const nextIndex = personIndex + 1;
    setPersonIndex(nextIndex);
    loadPerson(nextIndex);
  };

  if (totalPeople > 0 && personIndex >= totalPeople) {
    const reviewedPeople = t("reviewedFamiliarPeople").split("{count}");

    return <div className="family-training-page"><button className="back-button" onClick={onBack}>{t("back")}</button><main className="family-training-card"><h1>{t("familiaritySessionComplete")}</h1><p>{reviewedPeople[0]}<strong>{totalPeople}</strong>{reviewedPeople[1]}</p><button className="start-button" onClick={onBack}>{t("backToHome")}</button></main></div>;
  }

  return <div className="family-training-page"><button className="back-button" onClick={onBack}>{t("back")}</button><main className="family-training-card"><p className="eyebrow">{t("familyFamiliarity")}</p><h1>{t("familyFamiliarityTitle")}</h1>{totalPeople > 0 && <p>{t("familiarPersonProgress").replace("{current}", String(personIndex + 1)).replace("{total}", String(totalPeople))}</p>}{loading && <p>{t("preparingFamiliarPhoto")}</p>}{error && <p className="family-training-error">{error}</p>}{person && photoUrl && <><img className="family-training-photo" src={photoUrl} alt={t("photoOfPerson").replace("{name}", person.name)} /><p className="family-person-introduction">{t("thisIs")}</p><h2 className="family-person-name">{person.name}</h2><div className="family-training-options"><button type="button" onClick={() => speakName(person.name)}>{t("hearNameAgain")}</button><button type="button" className="correct" onClick={showNextPerson}>{personIndex + 1 >= totalPeople ? t("finishFamiliarity") : t("nextPerson")}</button></div></>}</main></div>;
}

export default FamilyFamiliarityTraining;
