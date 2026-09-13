import { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { API_URL } from "../api";

const MAX_PEOPLE_PER_SESSION = 5;
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

const copy = {
  "en-IN": { heading: "FAMILY FAMILIARITY", title: "Let's remember together", person: "Person", preparing: "Preparing a familiar photo...", noPeople: "No familiar people have been added yet", intro: "This is", replay: "Hear the name again", next: "Next person", finish: "Finish", complete: "Familiarity session complete", reviewed: "You reviewed", people: "familiar people.", home: "Back to home", back: "Back", say: (name) => `This is ${name}.` },
  "hi-IN": { heading: "पारिवारिक परिचय", title: "आइए साथ में याद करें", person: "व्यक्ति", preparing: "परिचित फोटो तैयार की जा रही है...", noPeople: "अभी कोई परिचित व्यक्ति नहीं जोड़ा गया है", intro: "ये हैं", replay: "नाम फिर से सुनें", next: "अगला व्यक्ति", finish: "पूरा करें", complete: "परिचित लोगों का सत्र पूरा हुआ", reviewed: "आपने", people: "परिचित लोगों को देखा।", home: "होम पर वापस जाएँ", back: "वापस", say: (name) => `ये ${name} हैं।` },
  "te-IN": { heading: "కుటుంబ పరిచయం", title: "కలిసి గుర్తు చేసుకుందాం", person: "వ్యక్తి", preparing: "తెలిసిన వ్యక్తి ఫోటో సిద్ధం అవుతోంది...", noPeople: "ఇంకా తెలిసిన వ్యక్తులను జోడించలేదు", intro: "వీరు", replay: "పేరును మళ్లీ వినండి", next: "తర్వాతి వ్యక్తి", finish: "ముగించు", complete: "పరిచయ సత్రం పూర్తయింది", reviewed: "మీరు", people: "తెలిసిన వ్యక్తులను చూశారు.", home: "హోమ్‌కు తిరిగి వెళ్ళండి", back: "వెనుకకు", say: (name) => `వీరు ${name}.` },
  "as-IN": { heading: "পৰিয়ালৰ চিনাকি", title: "একেলগে মনত পেলাওঁ", person: "ব্যক্তি", preparing: "চিনাকি ফটো প্ৰস্তুত কৰা হৈছে...", noPeople: "এতিয়ালৈ কোনো চিনাকি ব্যক্তি যোগ কৰা হোৱা নাই", intro: "এওঁ হৈছে", replay: "নামটো আকৌ শুনক", next: "পৰৱৰ্তী ব্যক্তি", finish: "সমাপ্ত কৰক", complete: "চিনাকি সঁহাৰি সম্পূৰ্ণ", reviewed: "আপুনি", people: "চিনাকি ব্যক্তিসকলক চালে।", home: "হোমলৈ উভতি যাওক", back: "উভতি যাওক", say: (name) => `এওঁ হৈছে ${name}।` },
  "bn-IN": { heading: "পারিবারিক পরিচিতি", title: "চলুন একসাথে মনে করি", person: "ব্যক্তি", preparing: "পরিচিত ছবি তৈরি হচ্ছে...", noPeople: "এখনও কোনো পরিচিত ব্যক্তি যোগ করা হয়নি", intro: "ইনি হলেন", replay: "নামটি আবার শুনুন", next: "পরের ব্যক্তি", finish: "শেষ করুন", complete: "পরিচিতি সেশন সম্পন্ন", reviewed: "আপনি", people: "পরিচিত ব্যক্তিদের দেখেছেন।", home: "হোমে ফিরে যান", back: "ফিরে যান", say: (name) => `ইনি হলেন ${name}।` },
  "nag-IN": { heading: "Family Chinaki", title: "Ekloge monot rakhibo", person: "Manuh", preparing: "Chinaki photo tayari kori ase...", noPeople: "Etuya eku chinaki manuh add kora nai", intro: "Eitu ase", replay: "Naam tu abar hunibo", next: "Pechor manuh", finish: "Ses koribo", complete: "Chinaki session ses hoise", reviewed: "Apuni", people: "chinaki manuh khan sai loise.", home: "Home loi jabo", back: "Ghuribo", say: (name) => `Eitu ${name} ase.` },
};

function FamilyFamiliarityTraining({ onBack, language = "en-IN" }) {
  const text = copy[language] || copy["en-IN"];
  const [person, setPerson] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [personIndex, setPersonIndex] = useState(0);
  const [totalPeople, setTotalPeople] = useState(0);
  const peopleRef = useRef([]);
  const photoCacheRef = useRef(new Map());
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
      if (!response.ok) throw new Error("The familiar person's photo could not be loaded");
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
    const message = text.say(name);
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
        if (!response.ok) throw new Error(data.message || "Could not prepare familiarity session");
        if ((data.people || []).length === 0) throw new Error(text.noPeople);

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

  const showNextPerson = () => {
    if (personIndex + 1 >= totalPeople) {
      setPhotoUrl("");
      setPerson(null);
      setPersonIndex(totalPeople);
      return;
    }
    const nextIndex = personIndex + 1;
    setPersonIndex(nextIndex);
    loadPerson(nextIndex);
  };

  if (totalPeople > 0 && personIndex >= totalPeople) {
    return <div className="family-training-page"><button className="back-button" onClick={onBack}>{text.back}</button><main className="family-training-card"><h1>{text.complete}</h1><p>{text.reviewed} <strong>{totalPeople}</strong> {text.people}</p><button className="start-button" onClick={onBack}>{text.home}</button></main></div>;
  }

  return <div className="family-training-page"><button className="back-button" onClick={onBack}>{text.back}</button><main className="family-training-card"><p className="eyebrow">{text.heading}</p><h1>{text.title}</h1>{totalPeople > 0 && <p>{text.person} {personIndex + 1} / {totalPeople}</p>}{loading && <p>{text.preparing}</p>}{error && <p className="family-training-error">{error}</p>}{person && photoUrl && <><img className="family-training-photo" src={photoUrl} alt={`Photo of ${person.name}`} /><p className="family-person-introduction">{text.intro}</p><h2 className="family-person-name">{person.name}</h2><div className="family-training-options"><button type="button" onClick={() => speakName(person.name)}>{text.replay}</button><button type="button" className="correct" onClick={showNextPerson}>{personIndex + 1 >= totalPeople ? text.finish : text.next}</button></div></>}</main></div>;
}

export default FamilyFamiliarityTraining;
