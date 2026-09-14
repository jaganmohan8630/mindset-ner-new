import { useState, useRef, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { API_URL } from "./api";
import socket from "./socket";
import CaregiverConnectPatient from "./components/CaregiverConnectPatient";
import AdminPatientLink from "./components/AdminPatientLink";
import PatientReminderList from "./components/PatientReminderList";
import MemoryGame from "./components/MemoryGame";
import AttentionGame from "./components/AttentionGame";
import CaregiverDashboard from "./components/CaregiverDashboard";
import HealthcareWorkerDashboard from "./components/HealthcareWorkerDashboard";
import ReminderManager from "./components/ReminderManager";
import PatientReminders from "./components/PatientReminders";
import PatientProfile from "./components/PatientProfile";
import DailyCarePlan from "./components/DailyCarePlan";
import DailyRoutineRecall from "./components/DailyRoutineRecall";
import PatternGame from "./components/PatternGame";
import ObjectRecognition from "./components/ObjectRecognition";
import MoodCheckIn from "./components/MoodCheckIn";
import FamilyFamiliarityTraining from "./components/FamilyFamiliarityTraining";
import ElderConnect from "./components/ElderConnect";
import ElderMessages from "./components/ElderMessages";
import Login from "./components/Login";
import DashboardLanguageSelector from "./components/DashboardLanguageSelector";
import "./App.css";
import CaregiverRequests from "./components/CaregiverRequests";
import HealthcareWorkerRequests from "./components/HealthcareWorkerRequests";
import PatientSafetyMonitor from "./components/PatientSafetyMonitor";
import { sendWanderingNotification } from "./emergencyNotifications";
import { getUIText } from "./uiTranslations";

function App() {
  const recognitionRef = useRef(null);
  const speechRef = useRef(null);
  const speechTimerRef = useRef(null);
  const emergencyNotificationTimesRef = useRef(new Map());
  const socketUserIdRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  // A voice message needs exclusive access to Android's microphone. Keep the
  // existing assistant unchanged, but let another deliberate audio action
  // release an active recognition session before it opens the microphone.
  useEffect(() => {
    const releaseRecognitionMicrophone = () => {
      try {
        recognitionRef.current?.abort();
      } catch {
        // The recognition session may already have ended.
      }
      recognitionRef.current = null;
      setIsListening(false);
    };

    window.addEventListener("mindset-ner:release-microphone", releaseRecognitionMicrophone);
    return () => window.removeEventListener("mindset-ner:release-microphone", releaseRecognitionMicrophone);
  }, []);
  const [language, setLanguage] = useState(() => localStorage.getItem("mindset_ner_language") || "en-IN");
  const changeLanguage = (value) => { setLanguage(value); localStorage.setItem("mindset_ner_language", value); };
  const [regionalMode, setRegionalMode] = useState(() => localStorage.getItem("mindset_ner_regional_mode") === "true");
  const translations = {
    "en-IN": {
      title: "Remember. Engage. Connect.",
      description:
        "A simple cognitive companion designed to help you stay engaged, remember daily activities, and stay connected.",
      voice: "Use Voice Assistant",
      memory: "Start Memory Activity",
      attention: "Start Attention Activity",
      routine: "Start Daily Routine Recall",
      pattern: "Start Pattern Recognition",
      object: "Start Object Recognition",
      reminders: "🔔 My Reminders",
      logout: "Log Out",
      footer: "Simple • Friendly • Designed for you",
    },

    "hi-IN": {
      title: "याद रखें। जुड़ें। सक्रिय रहें।",
      description:
        "एक सरल संज्ञानात्मक सहायक जो आपको सक्रिय रहने, दैनिक गतिविधियों को याद रखने और जुड़े रहने में मदद करता है।",
      voice: "वॉइस असिस्टेंट का उपयोग करें",
      memory: "मेमोरी गतिविधि शुरू करें",
      attention: "ध्यान गतिविधि शुरू करें",
      routine: "दैनिक दिनचर्या याद करें",
      pattern: "पैटर्न पहचान शुरू करें",
      object: "वस्तु पहचान शुरू करें",
      reminders: "🔔 मेरे रिमाइंडर",
      logout: "लॉग आउट",
      footer: "सरल • मैत्रीपूर्ण • आपके लिए बनाया गया",
    },

    "te-IN": {
      title: "గుర్తుంచుకోండి. పాల్గొనండి. అనుసంధానంగా ఉండండి.",
      description:
        "మీరు చురుకుగా ఉండటానికి, రోజువారీ కార్యకలాపాలను గుర్తుంచుకోవడానికి మరియు అనుసంధానంగా ఉండటానికి సహాయపడే సరళమైన జ్ఞాపక సహాయకుడు.",
      voice: "వాయిస్ అసిస్టెంట్ ఉపయోగించండి",
      memory: "మెమరీ కార్యకలాపాన్ని ప్రారంభించండి",
      attention: "శ్రద్ధ కార్యకలాపాన్ని ప్రారంభించండి",
      routine: "రోజువారీ దినచర్యను గుర్తుచేసుకోండి",
      pattern: "ప్యాటర్న్ గుర్తింపును ప్రారంభించండి",
      object: "వస్తువు గుర్తింపును ప్రారంభించండి",
      reminders: "🔔 నా రిమైండర్లు",
      logout: "లాగ్ అవుట్",
      footer: "సరళమైనది • స్నేహపూర్వకమైనది • మీ కోసం రూపొందించబడింది",
    },
    "as-IN": {
      title:
        "\u09ae\u09a8\u09c7 \u09f0\u09be\u0996\u09bf\u09ac\u0964 \u0985\u09a4\u09bf\u09ac\u09be\u09b9\u09bf\u09a4 \u09b9\u2019\u0993\u0995\u0964 \u09af\u09cb\u0997\u09be\u09af\u09cb\u0997\u09f0 \u09ae\u09be\u09a7\u09cd\u09af\u09ae\u09f0\u09c7 \u09a5\u09be\u0995\u09bf\u09ac\u0964",
      description:
        "\u0986\u09aa\u09cb\u09a8\u09be\u09f0 \u09a6\u09bf\u09a8\u09a6\u09bf\u09a8\u09f0 \u0995\u09be\u09f0\u09cd\u09af\u0995\u09b2\u09be\u09aa \u09ae\u09a8\u09c7 \u09f0\u09be\u0996\u09bf\u09ac\u09b2\u09c8 \u0986\u09f0\u09c1 \u09b8\u0995\u09cd\u09b0\u09bf\u09af\u09bc \u09f0\u09be\u0996\u09bf\u09ac\u09b2\u09c8 \u09b8\u09b9\u09be\u09af\u09cd\u09af \u0995\u09f0\u09be \u098f\u099f\u09be \u098f\u0995 \u09b8\u09f0\u09b2 \u09b8\u09be\u09a5\u09c0\u0964",
      voice:
        "\u09ad\u09af\u09bc\u09c7\u099a \u0985\u09b8\u09bf\u09b8\u09cd\u099f\u09c7\u09a8\u09cd\u099f \u09ac\u09cd\u09af\u09f1\u09b9\u09be\u09f0 \u0995\u09f0\u09bf\u09ac\u0964",
      memory:
        "\u09b8\u09cd\u09ae\u09c3\u09a4\u09bf\u09f0 \u0995\u09be\u09f0\u09cd\u09af\u0995\u09b2\u09be\u09aa \u0986\u09f0\u09ae\u09cd\u09ad \u0995\u09f0\u09bf\u09ac\u0964",
      attention:
        "\u09ae\u09a8\u09cb\u09af\u09cb\u0997\u09f0 \u0995\u09be\u09f0\u09cd\u09af\u0995\u09b2\u09be\u09aa \u0986\u09f0\u09ae\u09cd\u09ad \u0995\u09f0\u09bf\u09ac\u0964",
      routine:
        "\u09a6\u09bf\u09a8\u09a6\u09bf\u09a8\u09f0 \u09a6\u09bf\u09a8\u099a\u09f0\u09cd\u09af\u09be \u09ae\u09a8\u09c7 \u09f0\u09be\u0996\u09bf\u09ac\u0964",
      pattern:
        "\u09a8\u09ae\u09c1\u09a8\u09be \u099a\u09bf\u09a8\u09be\u0995\u09cd\u09a4 \u0995\u09f0\u09be\u09f0 \u0995\u09be\u09f0\u09cd\u09af\u0995\u09b2\u09be\u09aa \u0986\u09f0\u09ae\u09cd\u09ad \u0995\u09f0\u09bf\u09ac\u0964",
      object:
        "\u09ac\u09b8\u09cd\u09a4\u09c1 \u099a\u09bf\u09a8\u09be\u0995\u09cd\u09a4 \u0995\u09f0\u09be\u09f0 \u0995\u09be\u09f0\u09cd\u09af\u0995\u09b2\u09be\u09aa \u0986\u09f0\u09ae\u09cd\u09ad \u0995\u09f0\u09bf\u09ac\u0964",
      reminders:
        "\ud83d\udd14 \u09ae\u09cb\u09f0 \u09b8\u09cd\u09ae\u09f0\u09a3\u09bf\u0995\u09be",
      logout: "\u09b2\u0997 \u0986\u0989\u099f",
      footer:
        "\u09b8\u09f0\u09b2 \u2022 \u09ac\u09a8\u09cd\u09a7\u09c1\u09b8\u09c1\u09b2\u09ad \u2022 \u0986\u09aa\u09cb\u09a8\u09be\u09f0 \u09ac\u09be\u09ac\u09c7 \u09a4\u09c8\u09af\u09bc\u09be\u09f0\u09bf \u0995\u09f0\u09be",
    },

    "bn-IN": {
      title:
        "\u09ae\u09a8\u09c7 \u09b0\u09be\u0996\u09c1\u09a8\u0964 \u09af\u09c1\u0995\u09cd\u09a4 \u09a5\u09be\u0995\u09c1\u09a8\u0964 \u09af\u09cb\u0997\u09be\u09af\u09cb\u0997\u09c7\u09b0 \u09ae\u09be\u09a7\u09cd\u09af\u09ae\u09c7 \u09a5\u09be\u0995\u09c1\u09a8\u0964",
      description:
        "\u0986\u09aa\u09a8\u09be\u09b0 \u09a6\u09bf\u09a8\u09c7\u09b0 \u0995\u09be\u099c\u0997\u09c1\u09b2\u09bf \u09ae\u09a8\u09c7 \u09b0\u09be\u0996\u09a4\u09c7 \u098f\u09ac\u0982 \u09b8\u0995\u09cd\u09b0\u09bf\u09af\u09bc \u09a5\u09be\u0995\u09a4\u09c7 \u09b8\u09be\u09b9\u09be\u09af\u09cd\u09af \u0995\u09b0\u09be\u09b0 \u099c\u09a8\u09cd\u09af \u098f\u099f\u09bf \u098f\u0995\u099f\u09bf \u09b8\u09b0\u09b2 \u09b8\u0999\u09cd\u0997\u09c0\u0964",
      voice:
        "\u09ad\u09df\u09c7\u09b8 \u0985\u09cd\u09af\u09be\u09b8\u09bf\u09b8\u09cd\u099f\u09cd\u09af\u09be\u09a8\u09cd\u099f \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09c1\u09a8",
      memory:
        "\u09ae\u09c7\u09ae\u09b0\u09bf \u0985\u09cd\u09af\u09be\u0995\u09cd\u099f\u09bf\u09ad\u09bf\u099f\u09bf \u09b6\u09c1\u09b0\u09c1 \u0995\u09b0\u09c1\u09a8",
      attention:
        "\u09ae\u09a8\u09cb\u09af\u09cb\u0997\u09c7\u09b0 \u0985\u09cd\u09af\u09be\u0995\u09cd\u099f\u09bf\u09ad\u09bf\u099f\u09bf \u09b6\u09c1\u09b0\u09c1 \u0995\u09b0\u09c1\u09a8",
      routine:
        "\u09a6\u09bf\u09a8\u09c7\u09b0 \u09a6\u09bf\u09a8\u099a\u09b0\u09cd\u09af\u09be \u09ae\u09a8\u09c7 \u0995\u09b0\u09c1\u09a8",
      pattern:
        "\u09aa\u09cd\u09af\u09be\u099f\u09be\u09b0\u09cd\u09a8 \u099a\u09bf\u09a8\u09a4\u09c7 \u09b6\u09c1\u09b0\u09c1 \u0995\u09b0\u09c1\u09a8",
      object:
        "\u09ac\u09b8\u09cd\u09a4\u09c1 \u099a\u09bf\u09a8\u09a4\u09c7 \u09b6\u09c1\u09b0\u09c1 \u0995\u09b0\u09c1\u09a8",
      reminders:
        "\ud83d\udd14 \u0986\u09ae\u09be\u09b0 \u09b0\u09bf\u09ae\u09be\u0987\u09a8\u09cd\u09a1\u09be\u09b0",
      logout: "\u09b2\u0997 \u0986\u0989\u099f",
      footer:
        "\u09b8\u09b0\u09b2 \u2022 \u09ac\u09a8\u09cd\u09a7\u09c1\u09a4\u09cd\u09ac\u09aa\u09c2\u09b0\u09cd\u09a3 \u2022 \u0986\u09aa\u09a8\u09be\u09b0 \u099c\u09a8\u09cd\u09af \u09a4\u09c8\u09b0\u09bf",
    },

    "nag-IN": {
      title: "Monot rakhibo. Active thakibo. Jogajogot thakibo.",
      description:
        "Etu ek simple cognitive companion ase, juntu apunak daily kaam monot rakhibole, active thakibole aru family logot jogajogot thakibole help kore.",
      voice: "Voice Assistant use koribo",
      memory: "Memory Activity start koribo",
      attention: "Attention Activity start koribo",
      routine: "Daily Routine Recall start koribo",
      pattern: "Pattern Recognition start koribo",
      object: "Object Recognition start koribo",
      reminders: "🔔 Mur Reminders",
      logout: "Log Out",
      footer: "Simple • Friendly • Apunar babe bonua",
    },
  };

  const t = translations[language] || translations["en-IN"];
  const uiT = (key) => getUIText(language, key);
  const patientHomeText = {
    "en-IN": {
      patientCode: "YOUR PATIENT CODE",
      patientCodeHelp: "Share this code with your caregiver to connect.",
      language: "Language",
      listening: "Listening...",
      cognitive: "COGNITIVE ACTIVITIES",
      memory: "Memory",
      activity: "Activity",
      attention: "Attention",
      routine: "Daily Routine",
      recall: "Recall",
      pattern: "Pattern",
      recognition: "Recognition",
      object: "Object",
      wellbeing: "WELL-BEING & DAILY SUPPORT",
      mood: "Mood Check-In",
      reminders: "My Reminders",
      logout: "Log Out",
      footer: "Simple • Friendly • Designed for you",
    },
    "hi-IN": {
      patientCode: "आपका मरीज कोड",
      patientCodeHelp:
        "कनेक्ट करने के लिए यह कोड अपने देखभालकर्ता के साथ साझा करें।",
      language: "भाषा",
      listening: "सुन रहे हैं...",
      cognitive: "संज्ञानात्मक गतिविधियाँ",
      memory: "स्मृति",
      activity: "गतिविधि",
      attention: "ध्यान",
      routine: "दैनिक दिनचर्या",
      recall: "याद करें",
      pattern: "पैटर्न",
      recognition: "पहचान",
      object: "वस्तु",
      wellbeing: "स्वास्थ्य और दैनिक सहायता",
      mood: "मनोदशा जाँच",
      reminders: "मेरे रिमाइंडर",
      logout: "लॉग आउट",
      footer: "सरल • मित्रवत • आपके लिए बनाया गया",
    },
    "te-IN": {
      patientCode: "मी पेषंट् कोड",
      patientCodeHelp: "कनेक्ट क्वाली मी कोड्नु मी केर्गिवर्तो पंचुकोंडि।",
      language: "भाष",
      listening: "विंटुन्नामु...",
      cognitive: "ज्ञान कार्यकलापालु",
      memory: "ज्ञापकशक्ति",
      activity: "कार्यकलापमु",
      attention: "दृष्टि",
      routine: "दैनंदिन दिनचर्य",
      recall: "गुर्तिंचुकोंडि",
      pattern: "नमूना",
      recognition: "गुर्तिंपु",
      object: "वस्तुवु",
      wellbeing: "श्रेयस्सु और दैनंदिन सहायमु",
      mood: "मनोभाव जाँच",
      reminders: "ना रिमाइंडर्लु",
      logout: "लाग् आउट",
      footer: "सरळमैनदि • स्नेहपूर्वकमैनदि • मी कोसं",
    },
    "as-IN": {
      patientCode: "আপোনাৰ ৰোগীৰ কোড",
      patientCodeHelp:
        "সংযোগ কৰিবলৈ এই কোডটো আপোনাৰ তত্ত্বাৱধায়কৰ সৈতে ভাগ কৰক।",
      language: "ভাষা",
      listening: "শুনি আছে...",
      cognitive: "জ্ঞানীয় কাৰ্যকলাপ",
      memory: "স্মৃতি",
      activity: "কাৰ্যকলাপ",
      attention: "মনোযোগ",
      routine: "দৈনিক দিনচৰ্যা",
      recall: "মনত পেলাওক",
      pattern: "নমুনা",
      recognition: "চিনাক্তকৰণ",
      object: "বস্তু",
      wellbeing: "সুস্থতা আৰু দৈনিক সহায়",
      mood: "মনোভাৱ পৰীক্ষা",
      reminders: "মোৰ স্মৰণিকা",
      logout: "লগ আউট",
      footer: "সৰল • বন্ধুসুলভ • আপোনাৰ বাবে",
    },
    "bn-IN": {
      patientCode: "আপনার রোগী কোড",
      patientCodeHelp:
        "সংযোগ করতে এই কোডটি আপনার তত্ত্বাবধায়কের সাথে শেয়ার করুন।",
      language: "ভাষা",
      listening: "শুনছে...",
      cognitive: "জ্ঞানীয় কার্যক্রম",
      memory: "স্মৃতি",
      activity: "কার্যক্রম",
      attention: "মনোযোগ",
      routine: "দৈনিক রুটিন",
      recall: "মনে করুন",
      pattern: "প্যাটার্ন",
      recognition: "শনাক্তকরণ",
      object: "বস্তু",
      wellbeing: "সুস্থতা ও দৈনিক সহায়তা",
      mood: "মেজাজ চেক-ইন",
      reminders: "আমার রিমাইন্ডার",
      logout: "লগ আউট",
      footer: "সরল • বন্ধুসুলভ • আপনার জন্য",
    },
    "nag-IN": {
      patientCode: "Apunar Patient Code",
      patientCodeHelp: "Connect koribole code tu caregiver logot share koribo.",
      language: "Bhasa",
      listening: "Huni ase...",
      cognitive: "Monor Kaam",
      memory: "Monot Rakhibo",
      activity: "Kaam",
      attention: "Monojaag",
      routine: "Roj Routine",
      recall: "Monot Anibo",
      pattern: "Pattern",
      recognition: "Chinibo",
      object: "Object",
      wellbeing: "Bhal Thaka & Roj Support",
      mood: "Mood Check Koribo",
      reminders: "Mur Reminders",
      logout: "Bahiro Ulabo",
      footer: "Simple • Friendly • Apunar babe bonua",
    },
  };
  const teluguPatientHomeText = {
    patientCode: "మీ పేషెంట్ కోడ్",
    patientCodeHelp: "కనెక్ట్ కావడానికి ఈ కోడ్‌ను మీ సంరక్షకుడితో పంచుకోండి.",
    language: "భాష",
    listening: "వింటున్నాము...",
    cognitive: "జ్ఞాన కార్యకలాపాలు",
    memory: "జ్ఞాపకశక్తి",
    activity: "కార్యకలాపం",
    attention: "దృష్టి",
    routine: "రోజువారీ దినచర్య",
    recall: "గుర్తుచేసుకోండి",
    pattern: "నమూనా",
    recognition: "గుర్తింపు",
    object: "వస్తువు",
    wellbeing: "శ్రేయస్సు & రోజువారీ సహాయం",
    mood: "మానసిక స్థితి తనిఖీ",
    reminders: "నా రిమైండర్లు",
    logout: "లాగ్ అవుట్",
    footer: "సరళమైనది • స్నేహపూర్వకమైనది • మీ కోసం రూపొందించబడింది",
  };
  const home =
    language === "te-IN"
      ? teluguPatientHomeText
      : patientHomeText[language] || patientHomeText["en-IN"];
  const speak = (message) => {
    const speakNow = async () => {
      const speechLanguage = language === "nag-IN" ? "en-IN" : language;

      // Android WebView does not reliably speak with the browser Web Speech
      // API after a speech-recognition session. Use Android's native TTS engine
      // in the installed app, while preserving the browser fallback for web.
      if (Capacitor.isNativePlatform()) {
        try {
          await TextToSpeech.stop();
          await TextToSpeech.speak({
            text: message,
            lang: speechLanguage,
            rate: 0.85,
            pitch: 1,
            volume: 1,
          });
        } catch (error) {
          console.error("Native speech error:", error);
        }
        return;
      }

      if (!("speechSynthesis" in window)) {
        console.warn("Speech synthesis is not supported.");
        return;
      }

      window.speechSynthesis.cancel();

      const speech = new SpeechSynthesisUtterance(message);
      speechRef.current = speech;

      speech.lang = speechLanguage;
      speech.rate = 0.85;
      speech.pitch = 1;
      speech.volume = 1;

      const voices = window.speechSynthesis.getVoices();

      const languageCode = language.split("-")[0].toLowerCase();

      const matchingVoice =
        voices.find(
          (voice) => voice.lang.toLowerCase() === language.toLowerCase(),
        ) ||
        voices.find((voice) =>
          voice.lang.toLowerCase().startsWith(languageCode),
        );

      if (matchingVoice) {
        speech.voice = matchingVoice;

        console.log("Selected voice:", matchingVoice.name, matchingVoice.lang);
      } else {
        console.warn(
          `No ${language} speech voice is installed. Browser default voice will be used.`,
        );
      }

      speech.onstart = () => {
        console.log("🔊 Speech started:", message);
      };

      speech.onend = () => {
        console.log("🔊 Speech finished:", message);
        speechRef.current = null;
      };

      speech.onerror = (event) => {
        console.error("🔊 Speech error:", event.error);
        speechRef.current = null;
      };

      window.speechSynthesis.speak(speech);
    };

    // Small delay allows speech recognition to finish cleanly.
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    speechTimerRef.current = setTimeout(speakNow, 150);
  };

  const stopAllScreens = () => {
    setShowGame(false);
    setShowAttentionGame(false);
    setShowDashboard(false);
    setShowReminders(false);
    setShowProfile(false);
    setShowRoutineRecall(false);
    setShowPatternGame(false);
    setShowObjectRecognition(false);
    setShowConnectPatient(false);
  };

  const handleVoiceCommand = (command) => {
    const text = command.toLowerCase().trim();

    const isHindi = language === "hi-IN";
    const isTelugu = language === "te-IN";
    const isAssamese = language === "as-IN";
    const isBengali = language === "bn-IN";
    const isNagamese = language === "nag-IN";
    const teluguText = text.normalize("NFC");
    console.log("VOICE COMMAND:", text);
    // alert("Heard: " + text);

    // =========================
    // MEMORY
    // =========================
    if (
      text.includes("memory") ||
      text.includes("remember") ||
      (isHindi &&
        (text.includes("\u092e\u0947\u092e\u094b\u0930\u0940") ||
          text.includes("\u092f\u093e\u0926"))) ||
      (isTelugu &&
        (text.includes("\u0c2e\u0c46\u0c2e\u0c30\u0c40") ||
          text.includes("\u0c1c\u0c4d\u0c1e\u0c3e\u0c2a\u0c15"))) ||
      (isAssamese &&
        (text.includes("\u09b8\u09cd\u09ae\u09c3\u09a4\u09bf") ||
          text.includes("\u09ae\u09a8\u09c7"))) ||
      (isBengali &&
        (text.includes("\u09ae\u09c7\u09ae\u09b0\u09bf") ||
          text.includes("\u09ae\u09a8\u09c7"))) ||
      (isNagamese && text.includes("memory"))
    ) {
      stopAllScreens();
      setShowGame(true);

      if (isHindi) {
        speak(
          "\u092e\u0947\u092e\u094b\u0930\u0940 \u0917\u0924\u093f\u0935\u093f\u0927\u093f \u0936\u0941\u0930\u0942 \u0939\u094b \u0930\u0939\u0940 \u0939\u0948\u0964",
        );
      } else if (isTelugu) {
        speak(
          "\u0c2e\u0c46\u0c2e\u0c30\u0c40 \u0c15\u0c3e\u0c30\u0c4d\u0c2f\u0c15\u0c32\u0c3e\u0c2a\u0c02 \u0c2a\u0c4d\u0c30\u0c3e\u0c30\u0c02\u0c2d\u0c2e\u0c35\u0c41\u0c24\u0c4b\u0c02\u0c26\u0c3f\u002e",
        );
      } else if (isAssamese) {
        speak(
          "\u09b8\u09cd\u09ae\u09c3\u09a4\u09bf\u09f0 \u0995\u09be\u09f0\u09cd\u09af\u0995\u09b2\u09be\u09aa \u0986\u09f0\u09ae\u09cd\u09ad \u09b9\u09c8 \u0986\u099b\u09c7\u0964",
        );
      } else if (isBengali) {
        speak(
          "\u09ae\u09c7\u09ae\u09b0\u09bf \u0985\u09cd\u09af\u09be\u0995\u09cd\u099f\u09bf\u09ad\u09bf\u099f\u09bf \u09b6\u09c1\u09b0\u09c1 \u09b9\u099a\u09cd\u099b\u09c7\u0964",
        );
      } else if (isNagamese) {
        speak("Memory activity start kori ase.");
      } else {
        speak("Starting memory activity.");
      }

      return;
    }

    // =========================
    // ATTENTION
    // =========================
    if (
      text.includes("attention") ||
      text.includes("focus") ||
      (isHindi &&
        (text.includes("\u0927\u094d\u092f\u093e\u0928") ||
          text.includes("\u090f\u0915\u093e\u0917\u094d\u0930\u0924\u093e"))) ||
      (isTelugu &&
        (text.includes("\u0c36\u0c4d\u0930\u0c26\u0c4d\u0c27") ||
          text.includes("\u0c0f\u0c15\u0c3e\u0c17\u0c4d\u0c30\u0c24"))) ||
      (isAssamese &&
        (text.includes("\u09ae\u09a8\u09cb\u09af\u09cb\u0997") ||
          text.includes("\u09a7\u09cd\u09af\u09be\u09a8"))) ||
      (isBengali &&
        (text.includes("\u09ae\u09a8\u09cb\u09af\u09cb\u0997") ||
          text.includes("\u09a7\u09cd\u09af\u09be\u09a8"))) ||
      (isNagamese && text.includes("attention"))
    ) {
      stopAllScreens();
      setShowAttentionGame(true);

      if (isHindi) {
        speak(
          "\u0927\u094d\u092f\u093e\u0928 \u0917\u0924\u093f\u0935\u093f\u0927\u093f \u0936\u0941\u0930\u0942 \u0939\u094b \u0930\u0939\u0940 \u0939\u0948\u0964",
        );
      } else if (isTelugu) {
        speak(
          "\u0c36\u0c4d\u0c30\u0c26\u0c4d\u0c27 \u0c15\u0c3e\u0c30\u0c4d\u0c2f\u0c15\u0c32\u0c3e\u0c2a\u0c02 \u0c2a\u0c4d\u0c30\u0c3e\u0c30\u0c02\u0c2d\u0c2e\u0c35\u0c41\u0c24\u0c4b\u0c02\u0c26\u0c3f\u002e",
        );
      } else if (isAssamese) {
        speak(
          "\u09ae\u09a8\u09cb\u09af\u09cb\u0997\u09f0 \u0995\u09be\u09f0\u09cd\u09af\u0995\u09b2\u09be\u09aa \u0986\u09f0\u09ae\u09cd\u09ad \u09b9\u09c8 \u0986\u099b\u09c7\u0964",
        );
      } else if (isBengali) {
        speak(
          "\u09ae\u09a8\u09cb\u09af\u09cb\u0997\u09c7\u09b0 \u0985\u09cd\u09af\u09be\u0995\u09cd\u099f\u09bf\u09ad\u09bf\u099f\u09bf \u09b6\u09c1\u09b0\u09c1 \u09b9\u099a\u09cd\u099b\u09c7\u0964",
        );
      } else if (isNagamese) {
        speak("Attention activity start kori ase.");
      } else {
        speak("Starting attention activity.");
      }

      return;
    }

    // =========================
    // DAILY ROUTINE
    // =========================
    if (
      text.includes("routine") ||
      text.includes("daily routine") ||
      (isHindi &&
        (text.includes("\u0926\u093f\u0928\u091a\u0930\u094d\u092f\u093e") ||
          text.includes("\u0930\u0942\u091f\u0940\u0928"))) ||
      (isTelugu &&
        (text.includes("\u0c26\u0c3f\u0c28\u0c1a\u0c30\u0c4d\u0c2f") ||
          text.includes("\u0c30\u0c4b\u0c1f\u0c40\u0c28"))) ||
      (isAssamese &&
        (text.includes("\u09a6\u09bf\u09a8\u099a\u09f0\u09cd\u09af\u09be") ||
          text.includes("\u09a6\u09bf\u09a8\u09f0"))) ||
      (isBengali &&
        (text.includes("\u09a6\u09bf\u09a8\u099a\u09b0\u09cd\u09af\u09be") ||
          text.includes("\u09b0\u09c1\u099f\u09bf\u09a8"))) ||
      (isNagamese && text.includes("routine"))
    ) {
      stopAllScreens();
      setShowRoutineRecall(true);

      if (isHindi) {
        speak(
          "\u0926\u0948\u0928\u093f\u0915 \u0926\u093f\u0928\u091a\u0930\u094d\u092f\u093e \u092f\u093e\u0926 \u0915\u0930\u0928\u0947 \u0915\u0940 \u0917\u0924\u093f\u0935\u093f\u0927\u093f \u0936\u0941\u0930\u0942 \u0939\u094b \u0930\u0939\u0940 \u0939\u0948\u0964",
        );
      } else if (isTelugu) {
        speak(
          "\u0c30\u0c4b\u0c1c\u0c41\u0c35\u0c3e\u0c30\u0c40 \u0c26\u0c3f\u0c28\u0c1a\u0c30\u0c4d\u0c2f \u0c17\u0c41\u0c30\u0c4d\u0c24\u0c3f\u0c02\u0c2a\u0c41 \u0c15\u0c3e\u0c30\u0c4d\u0c2f\u0c15\u0c32\u0c3e\u0c2a\u0c02 \u0c2a\u0c4d\u0c30\u0c3e\u0c30\u0c02\u0c2d\u0c2e\u0c35\u0c41\u0c24\u0c4b\u0c02\u0c26\u0c3f.",
        );
      } else if (isAssamese) {
        speak(
          "\u09a6\u09bf\u09a8\u09a6\u09bf\u09a8\u09f0 \u09a6\u09bf\u09a8\u099a\u09f0\u09cd\u09af\u09be \u09ae\u09a8\u09c7 \u09f0\u09be\u0996\u09bf\u09ac\u09b2\u09c8 \u0995\u09be\u09f0\u09cd\u09af\u0995\u09b2\u09be\u09aa \u0986\u09f0\u09ae\u09cd\u09ad \u09b9\u09c8 \u0986\u099b\u09c7\u0964",
        );
      } else if (isBengali) {
        speak(
          "\u09a6\u09bf\u09a8\u09c7\u09b0 \u09a6\u09bf\u09a8\u099a\u09b0\u09cd\u09af\u09be \u09ae\u09a8\u09c7 \u0995\u09b0\u09be\u09b0 \u0985\u09cd\u09af\u09be\u0995\u09cd\u099f\u09bf\u09ad\u09bf\u099f\u09bf \u09b6\u09c1\u09b0\u09c1 \u09b9\u099a\u09cd\u099b\u09c7\u0964",
        );
      } else if (isNagamese) {
        speak("Daily routine activity start kori ase.");
      } else {
        speak("Starting daily routine recall.");
      }

      return;
    }

    // =========================
    // PATTERN
    // =========================
    if (
      text.includes("pattern") ||
      text.includes("sequence") ||
      (isHindi && text.includes("\u092a\u0948\u091f\u0930\u094d\u0928")) ||
      (isTelugu &&
        (text.includes(
          "\u0c2a\u0c4d\u0c2f\u0c3e\u0c1f\u0c30\u0c4d\u0c28\u0c4d",
        ) ||
          text.includes("\u0c28\u0c2e\u0c42\u0c28\u0c3e"))) ||
      (isAssamese &&
        (text.includes("\u09a8\u09ae\u09c1\u09a8\u09be") ||
          text.includes("\u09aa\u09be\u099f\u09be\u09f0\u09cd\u09a8"))) ||
      (isBengali &&
        (text.includes(
          "\u09aa\u09cd\u09af\u09be\u099f\u09be\u09b0\u09cd\u09a8",
        ) ||
          text.includes("\u09a8\u09ae\u09c1\u09a8\u09be"))) ||
      (isNagamese && text.includes("pattern"))
    ) {
      stopAllScreens();
      setShowPatternGame(true);

      if (isHindi) {
        speak(
          "\u092a\u0948\u091f\u0930\u094d\u0928 \u092a\u0939\u091a\u093e\u0928 \u0917\u0924\u093f\u0935\u093f\u0927\u093f \u0936\u0941\u0930\u0942 \u0939\u094b \u0930\u0939\u0940 \u0939\u0948\u0964",
        );
      } else if (isTelugu) {
        speak(
          "\u0c28\u0c2e\u0c42\u0c28\u0c3e \u0c17\u0c41\u0c30\u0c4d\u0c24\u0c3f\u0c02\u0c2a\u0c41 \u0c15\u0c3e\u0c30\u0c4d\u0c2f\u0c15\u0c32\u0c3e\u0c2a\u0c02 \u0c2a\u0c4d\u0c30\u0c3e\u0c30\u0c02\u0c2d\u0c2e\u0c35\u0c41\u0c24\u0c4b\u0c02\u0c26\u0c3f.",
        );
      } else if (isAssamese) {
        speak(
          "\u09a8\u09ae\u09c1\u09a8\u09be \u099a\u09bf\u09a8\u09be\u0995\u09cd\u09a4 \u0995\u09f0\u09be\u09f0 \u0995\u09be\u09f0\u09cd\u09af\u0995\u09b2\u09be\u09aa \u0986\u09f0\u09ae\u09cd\u09ad \u09b9\u09c8 \u0986\u099b\u09c7\u0964",
        );
      } else if (isBengali) {
        speak(
          "\u09aa\u09cd\u09af\u09be\u099f\u09be\u09b0\u09cd\u09a8 \u099a\u09bf\u09a8\u09a4\u09c7 \u09b6\u09c1\u09b0\u09c1 \u09b9\u099a\u09cd\u099b\u09c7\u0964",
        );
      } else if (isNagamese) {
        speak("Pattern activity start kori ase.");
      } else {
        speak("Starting pattern recognition.");
      }

      return;
    }

    // =========================
    // OBJECT RECOGNITION
    // =========================
    if (
      text.includes("object") ||
      text.includes("objects") ||
      text.includes("recognize object") ||
      (isHindi &&
        (text.includes("\u0935\u0938\u094d\u0924\u0941") ||
          text.includes("\u0911\u092c\u094d\u091c\u0947\u0915\u094d\u091f"))) ||
      (isTelugu &&
        (text.includes("\u0c35\u0c38\u0c4d\u0c24\u0c41\u0c35\u0c41") ||
          text.includes("\u0c06\u0c2c\u0c4d\u0c1c\u0c46\u0c15\u0c4d\u0c1f"))) ||
      (isAssamese &&
        (text.includes("\u09ac\u09b8\u09cd\u09a4\u09c1") ||
          text.includes("\u099a\u09bf\u09a8\u09be\u0995\u09cd\u09a4"))) ||
      (isBengali &&
        (text.includes("\u09ac\u09b8\u09cd\u09a4\u09c1") ||
          text.includes("\u099a\u09bf\u09a8\u09a4\u09c7"))) ||
      (isNagamese && text.includes("object"))
    ) {
      stopAllScreens();
      setShowObjectRecognition(true);

      if (isHindi) {
        speak(
          "\u0935\u0938\u094d\u0924\u0941 \u092a\u0939\u091a\u093e\u0928 \u0917\u0924\u093f\u0935\u093f\u0927\u093f \u0936\u0941\u0930\u0942 \u0939\u094b \u0930\u0939\u0940 \u0939\u0948\u0964",
        );
      } else if (isTelugu) {
        speak(
          "\u0c35\u0c38\u0c4d\u0c24\u0c41\u0c35\u0c41 \u0c17\u0c41\u0c30\u0c4d\u0c24\u0c3f\u0c02\u0c2a\u0c41 \u0c15\u0c3e\u0c30\u0c4d\u0c2f\u0c15\u0c32\u0c3e\u0c2a\u0c02 \u0c2a\u0c4d\u0c30\u0c3e\u0c30\u0c02\u0c2d\u0c2e\u0c35\u0c41\u0c24\u0c4b\u0c02\u0c26\u0c3f.",
        );
      } else if (isAssamese) {
        speak(
          "\u09ac\u09b8\u09cd\u09a4\u09c1 \u099a\u09bf\u09a8\u09be\u0995\u09cd\u09a4 \u0995\u09f0\u09be\u09f0 \u0995\u09be\u09f0\u09cd\u09af\u0995\u09b2\u09be\u09aa \u0986\u09f0\u09ae\u09cd\u09ad \u09b9\u09c8 \u0986\u099b\u09c7\u0964",
        );
      } else if (isBengali) {
        speak(
          "\u09ac\u09b8\u09cd\u09a4\u09c1 \u099a\u09bf\u09a8\u09a4\u09c7 \u09b6\u09c1\u09b0\u09c1 \u09b9\u099a\u09cd\u099b\u09c7\u0964",
        );
      } else if (isNagamese) {
        speak("Object recognition activity start kori ase.");
      } else {
        speak("Starting object recognition.");
      }

      return;
    }

    // =========================
    // CAREGIVER DASHBOARD
    // =========================
    if (
      (text.includes("dashboard") || text.includes("caregiver dashboard")) &&
      isCaregiver
    ) {
      stopAllScreens();
      setShowDashboard(true);
      speak("Opening caregiver dashboard.");
      return;
    }

    // =========================
    // REMINDERS
    // =========================
    if (
      (text.includes("reminder") || text.includes("reminders")) &&
      isCaregiver
    ) {
      stopAllScreens();
      setShowReminders(true);
      speak("Opening reminder manager.");
      return;
    }

    // Patient reminders
    if (
      (text.includes("reminder") || text.includes("reminders")) &&
      isPatient
    ) {
      stopAllScreens();
      setShowPatientReminders(true);

      if (isHindi) {
        speak(
          "\u092e\u0947\u0930\u0947 \u0930\u093f\u092e\u093e\u0907\u0902\u0921\u0930 \u0916\u094b\u0932 \u0930\u0939\u0947 \u0939\u0948\u0902\u0964",
        );
      } else if (isTelugu) {
        speak(
          "\u0c28\u0c3e \u0c30\u0c3f\u0c2e\u0c48\u0c02\u0c21\u0c30\u0c4d\u0c32\u0c28\u0c41 \u0c24\u0c46\u0c30\u0c41\u0c38\u0c4d\u0c24\u0c41\u0c28\u0c4d\u0c28\u0c3e\u0c2e\u0c41",
        );
      } else {
        speak("Opening your reminders.");
      }

      return;
    }

    // =========================
    // PROFILE
    // =========================
    if (
      (text.includes("profile") || text.includes("my profile")) &&
      isPatient
    ) {
      stopAllScreens();
      setShowProfile(true);
      speak("Opening your profile.");
      return;
    }

    // =========================
    // HOME / BACK
    // =========================
    if (
      text.includes("home") ||
      text.includes("go home") ||
      text.includes("back") ||
      text.includes("go back")
    ) {
      stopAllScreens();

      if (isHindi) {
        speak(
          "\u0939\u094b\u092e \u092a\u0947\u091c \u092a\u0930 \u0935\u093e\u092a\u0938 \u091c\u093e \u0930\u0939\u0947 \u0939\u0948\u0902\u0964",
        );
      } else if (isTelugu) {
        speak(
          "\u0c39\u0c4b\u0c2e\u0c4d \u0c2a\u0c47\u0c1c\u0c4d\u0c15\u0c41 \u0c24\u0c3f\u0c30\u0c3f\u0c17\u0c3f \u0c35\u0c46\u0c33\u0c4d\u0c24\u0c41\u0c28\u0c4d\u0c28\u0c3e\u0c2e\u0c41",
        );
      } else {
        speak("Going back to home.");
      }

      return;
    }

    // =========================
    // REPEAT
    // =========================
    if (text.includes("repeat") || text.includes("say again")) {
      if (isHindi) {
        speak(
          "\u0915\u0943\u092a\u092f\u093e \u0915\u093f\u0938\u0940 \u0917\u0924\u093f\u0935\u093f\u0927\u093f \u0915\u093e \u0928\u093e\u092e \u0932\u0947\u0902\u0964",
        );
      } else if (isTelugu) {
        speak(
          "\u0c26\u0c2f\u0c1a\u0c47\u0c38\u0c3f \u0c0f\u0c26\u0c48\u0c28\u0c3e \u0c15\u0c3e\u0c30\u0c4d\u0c2f\u0c15\u0c32\u0c3e\u0c2a\u0c3e\u0c28\u0c4d\u0c28\u0c3f \u0c15\u0c4b\u0c30\u0c02\u0c21\u0c3f",
        );
      } else {
        speak("Please choose an activity or ask me to start a game.");
      }

      return;
    }

    // =========================
    // UNKNOWN COMMAND
    // =========================
    if (isHindi) {
      speak(
        "\u0915\u094d\u0937\u092e\u093e \u0915\u0930\u0947\u0902, \u092e\u0948\u0902 \u0906\u092a\u0915\u0940 \u092c\u093e\u0924 \u0938\u092e\u091d \u0928\u0939\u0940\u0902 \u0938\u0915\u093e\u0964",
      );
    } else if (isTelugu) {
      speak(
        "\u0c15\u0c4d\u0c37\u0c2e\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f, \u0c2e\u0c40 \u0c15\u0c4b\u0c30\u0c3f\u0c15\u0c28\u0c41 \u0c05\u0c30\u0c4d\u0c25\u0c02\u0c35\u0c32\u0c47\u0c26\u0c41",
      );
    } else {
      speak(
        "Sorry, I did not understand. Please say memory, attention, routine, pattern, or object.",
      );
    }
  };

  const startVoiceAssistant = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice recognition is not supported in this browser. Please use Google Chrome.",
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("🎤 Voice recognition started");
      setIsListening(true);
    };

    recognition.onaudiostart = () => {
      console.log("🎙️ Microphone started");
    };

    recognition.onspeechstart = () => {
      console.log("🗣️ Speech detected");
    };

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript;

      console.log("✅ VOICE RESULT:", command);

      setIsListening(false);

      handleVoiceCommand(command);
    };

    recognition.onerror = (event) => {
      console.error("❌ VOICE ERROR:", event.error);

      setIsListening(false);

      if (event.error === "not-allowed") {
        alert(
          "Microphone permission was denied. Please allow microphone access.",
        );
      } else if (event.error === "no-speech") {
        alert("No speech detected. Please speak after pressing the button.");
      } else if (event.error === "audio-capture") {
        alert("Microphone could not be accessed.");
      } else {
        alert("Voice recognition error: " + event.error);
      }
    };

    recognition.onend = () => {
      console.log("🛑 Voice recognition ended");
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (error) {
      console.error("Could not start recognition:", error);
      setIsListening(false);
    }
  };
  const [showGame, setShowGame] = useState(false);
  const [showAttentionGame, setShowAttentionGame] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showHealthcareDashboard, setShowHealthcareDashboard] = useState(false);
  const [showAdminLink, setShowAdminLink] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [showConnectPatient, setShowConnectPatient] = useState(false);
  const [showPatientReminders, setShowPatientReminders] = useState(false);
  const [showElderConnect, setShowElderConnect] = useState(false);
  const [showElderMessages, setShowElderMessages] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showRoutineRecall, setShowRoutineRecall] = useState(false);
  const [showPatternGame, setShowPatternGame] = useState(false);
  const [showObjectRecognition, setShowObjectRecognition] = useState(false);
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(false);
  const [showFamilyFamiliarity, setShowFamilyFamiliarity] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mindset_ner_user"));
    } catch {
      return null;
    }
  });
  useEffect(() => {
    const currentUserId = user?._id || user?.id;
    if (!currentUserId) return undefined;

    const handleConnect = () => {
      console.log("MINDSET NER Socket connected:", socket.id);
    };

    const handleDisconnect = () => {
      console.log("MINDSET NER Socket disconnected");
    };

    // Keep an established connection when non-auth user details change (for
    // example, when a patient's code is loaded after sign-in). Previously the
    // effect cleanup disconnected the socket whenever the whole user object
    // changed, which produced unnecessary disconnect/reconnect cycles.
    const accountChanged =
      socket.connected &&
      socketUserIdRef.current &&
      socketUserIdRef.current !== currentUserId;

    if (accountChanged) {
      socket.disconnect();
    }

    socket.auth = {
      token: localStorage.getItem("mindset_ner_token"),
    };
    socketUserIdRef.current = currentUserId;

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [user?._id, user?.id]);
  useEffect(() => {
    if (user?.role !== "caregiver" && user?.role !== "healthcare_worker") {
      return undefined;
    }

    const handleWanderingAlert = ({ alert }) => {
      if (!alert) return;
      if (alert.status === "resolved") return;
      const now = Date.now();
      const lastNotificationAt = emergencyNotificationTimesRef.current.get(alert._id) || 0;
      // Initial alert and one reminder every five minutes while the patient
      // remains outside the safe zone. This prevents GPS updates from causing
      // a notification every 15 seconds.
      if (now - lastNotificationAt < 5 * 60 * 1000) return;
      emergencyNotificationTimesRef.current.set(alert._id, now);
      sendWanderingNotification({ patientName: getUIText(language, "yourPatient"), alert, language }).catch(
        (error) => console.warn("Emergency notification could not be shown:", error),
      );
    };

    socket.on("wandering:alertCreated", handleWanderingAlert);
    socket.on("wandering:alertUpdated", handleWanderingAlert);
    return () => {
      socket.off("wandering:alertCreated", handleWanderingAlert);
      socket.off("wandering:alertUpdated", handleWanderingAlert);
    };
  }, [user?.role, language]);
  useEffect(() => {
    const loadPatientCode = async () => {
      if (user?.role !== "patient" || user?.patientCode || !user?.patientId) {
        return;
      }

      try {
        const token = localStorage.getItem("mindset_ner_token");

        if (!token) return;

        const response = await fetch(
          `${API_URL}/api/patients/${user.patientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok || !data.patient?.patientCode) {
          console.error("Patient code could not be loaded:", data);
          return;
        }

        const updatedUser = {
          ...user,
          patientCode: data.patient.patientCode,
        };

        localStorage.setItem("mindset_ner_user", JSON.stringify(updatedUser));

        setUser(updatedUser);
      } catch (error) {
        console.error("Failed to load patient code:", error);
      }
    };

    loadPatientCode();
  }, [user]);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    if (socket.connected) {
      socket.disconnect();
    }
    socketUserIdRef.current = null;
    localStorage.removeItem("mindset_ner_token");
    localStorage.removeItem("mindset_ner_user");
    setUser(null);
    setShowGame(false);
    setShowAttentionGame(false);
    setShowDashboard(false);
    setShowHealthcareDashboard(false);
    setShowElderConnect(false);
    setShowElderMessages(false);
  };

  const isHealthcareWorker = user?.role === "healthcare_worker";
  const isCaregiver = user?.role === "caregiver" || user?.role === "admin";
  const isAdmin = user?.role === "admin";
  const isPatient = user?.role === "patient";
  const withPatientOverlays = (view) =>
    isPatient ? (
      <>
        {view}
        <PatientSafetyMonitor patientId={user?.patientId} language={language} />
        <PatientReminders language={language} />
        {!showElderConnect && <div className="elder-connect-listener"><ElderConnect language={language} /></div>}
        <CaregiverRequests language={language} />
        <HealthcareWorkerRequests language={language} />
      </>
    ) : (
      view
    );

  if (!user) {
    return <Login onLogin={handleLogin} language={language} />;
  }
  if (showAdminLink && isAdmin) {
    return <AdminPatientLink onBack={() => setShowAdminLink(false)} language={language} />;
  }
  if (showDashboard && isCaregiver) {
    return <CaregiverDashboard onBack={() => setShowDashboard(false)} language={language} />;
  }
  if (showConnectPatient && isCaregiver) {
    return (
      <CaregiverConnectPatient language={language} onBack={() => setShowConnectPatient(false)} />
    );
  }
  if (showReminders && isCaregiver) {
    return <ReminderManager onBack={() => setShowReminders(false)} language={language} />;
  }
  if (showPatientReminders && isPatient) {
    return withPatientOverlays(
      <PatientReminderList onBack={() => setShowPatientReminders(false)} language={language} />
    );
  }
  if (showElderConnect && isPatient) {
    return withPatientOverlays(
      <ElderConnect onBack={() => setShowElderConnect(false)} language={language} />,
    );
  }
  if (showElderMessages && isPatient) {
    return withPatientOverlays(
      <ElderMessages onBack={() => setShowElderMessages(false)} language={language} />,
    );
  }
  if (showHealthcareDashboard && isHealthcareWorker) {
    return <HealthcareWorkerDashboard onBack={() => setShowHealthcareDashboard(false)} language={language} />;
  }
  if (showProfile && isPatient) {
    return withPatientOverlays(
      <PatientProfile onBack={() => setShowProfile(false)} language={language} />,
    );
  }

  if (showGame && isPatient) {
    return withPatientOverlays(
      <MemoryGame onBack={() => setShowGame(false)} language={language} regionalMode={regionalMode} />,
    );
  }

  if (showAttentionGame && isPatient) {
    return withPatientOverlays(
      <AttentionGame onBack={() => setShowAttentionGame(false)} language={language} regionalMode={regionalMode} />,
    );
  }
  if (showRoutineRecall && isPatient) {
    return withPatientOverlays(
      <DailyRoutineRecall onBack={() => setShowRoutineRecall(false)} language={language} regionalMode={regionalMode} />,
    );
  }
  if (showPatternGame && isPatient) {
    return withPatientOverlays(
      <PatternGame onBack={() => setShowPatternGame(false)} language={language} regionalMode={regionalMode} />,
    );
  }
  if (showObjectRecognition && isPatient) {
    return withPatientOverlays(
      <ObjectRecognition onBack={() => setShowObjectRecognition(false)} language={language} regionalMode={regionalMode} />,
    );
  }
  if (showMoodCheckIn && isPatient) {
    return withPatientOverlays(
      <MoodCheckIn onBack={() => setShowMoodCheckIn(false)} language={language} />,
    );
  }
  if (showFamilyFamiliarity && isPatient) {
    return withPatientOverlays(
      <FamilyFamiliarityTraining onBack={() => setShowFamilyFamiliarity(false)} language={language} />,
    );
  }

  return withPatientOverlays(
    <>
      <div className={`app ${isCaregiver ? "caregiver-home-page" : ""} ${isHealthcareWorker ? "healthcare-worker-home-page" : ""}`}>
        <main
          className={`welcome-card ${isPatient ? "patient-home-card" : ""} ${isCaregiver ? "caregiver-home-card" : ""} ${isHealthcareWorker ? "healthcare-worker-home-card" : ""}`}
        >
          <div className="logo-circle">🧠</div>

          <p className="eyebrow">MINDSET NER</p>

          {isHealthcareWorker ? (
            <div className="healthcare-worker-home-content">
              <h1>{uiT("healthcareWorkerPortal")}</h1>
              <p className="welcome-text">{uiT("healthcareWorkerHomeDescription")}</p>
              <div className="healthcare-worker-action-grid">
                <button className="healthcare-worker-action-card" onClick={() => setShowHealthcareDashboard(true)}>
                  <span className="caregiver-action-icon" aria-hidden="true">◴</span><strong>{uiT("openHealthcareDashboard")}</strong><i></i><p>{uiT("healthcareDashboardDescription")}</p><b aria-hidden="true">›</b>
                </button>
              </div>
              <button className="caregiver-logout-card" onClick={handleLogout}><span aria-hidden="true">⇥</span><p><strong>{uiT("logout")}</strong><small>{uiT("signOutHealthcareAccount")}</small></p><b aria-hidden="true">›</b></button>
            </div>
          ) : isCaregiver ? (
            <div className="caregiver-home-content">
              <h1>{uiT("dashboard")}</h1>

              <p className="welcome-text">
                {uiT("caregiverHomeDescription")}
              </p>

              <div className="caregiver-language-control">
                <DashboardLanguageSelector language={language} onChange={changeLanguage} />
              </div>

              <div className="caregiver-home-divider">
                <i></i>
                <span aria-hidden="true">♥</span>
                <i></i>
              </div>
              <div className="caregiver-action-grid">
                <button
                  className="caregiver-action-card dashboard-action"
                  onClick={() => setShowDashboard(true)}
                >
                  <span className="caregiver-action-icon" aria-hidden="true">
                    ◴
                  </span>
                  <strong>{uiT("openCaregiverDashboard")}</strong>
                  <i></i>
                  <p>{uiT("caregiverDashboardDescription")}</p>
                  <b aria-hidden="true">›</b>
                </button>
                <button
                  className="caregiver-action-card connect-action"
                  onClick={() => setShowConnectPatient(true)}
                >
                  <span className="caregiver-action-icon" aria-hidden="true">
                    ♧
                  </span>
                  <strong>{uiT("connectPatientHome")}</strong>
                  <i></i>
                  <p>{uiT("connectPatientHomeDescription")}</p>
                  <b aria-hidden="true">›</b>
                </button>
                <button
                  className="caregiver-action-card reminders-action"
                  onClick={() => setShowReminders(true)}
                >
                  <span className="caregiver-action-icon" aria-hidden="true">
                    ♟
                  </span>
                  <strong>{uiT("managePatientRemindersHome")}</strong>
                  <i></i>
                  <p>{uiT("managePatientRemindersHomeDescription")}</p>
                  <b aria-hidden="true">›</b>
                </button>
              </div>
              <button className="caregiver-logout-card" onClick={handleLogout}>
                <span aria-hidden="true">⇥</span>
                <p>
                  <strong>{uiT("logout")}</strong>
                  <small>{uiT("signOutCaregiverAccount")}</small>
                </p>
                <b aria-hidden="true">›</b>
              </button>
              {isAdmin && (
                <button
                  className="caregiver-admin-link"
                  onClick={() => setShowAdminLink(true)}
                >
                  {uiT("manageCaregiverAndPatient")}
                </button>
              )}
            </div>
          ) : (
            <>
              <h1>{uiT("appHomeTitle")}</h1>

              <p className="welcome-text">{uiT("appHomeDescription")}</p>

              <div className="patient-greeting" role="status">
                <span aria-hidden="true">👋</span>
                <div>
                  <strong>{uiT("patientGreeting").replace("{name}", user?.name || uiT("greetingFallbackName"))}</strong>
                  <small>{uiT("welcomeBackGoodDay")}</small>
                </div>
              </div>

              {/* PATIENT CODE */}
              <div className="patient-code-card">
                <p className="patient-code-label">{uiT("patientCodeLabel")}</p>

                <span className="patient-code-value">
                  {user?.patientCode || uiT("patientCodeUnavailable")}
                </span>

                <p className="patient-code-help">{uiT("patientCodeHelp")}</p>
              </div>

              {/* LANGUAGE + VOICE */}
              <div className="patient-support-row">
                <div className="language-selector patient-language">
                  <label htmlFor="language">
                    🌐 <span>{uiT("language")}</span>
                  </label>

                  <select
                    id="language"
                    value={language}
                    onChange={(event) => changeLanguage(event.target.value)}
                  >
                    <option value="en-IN">English</option>
                    <option value="hi-IN">हिन्दी</option>
                    <option value="te-IN">తెలుగు</option>
                    <option value="as-IN">অসমীয়া</option>
                    <option value="bn-IN">বাংলা</option>
                    <option value="nag-IN">Nagamese</option>
                  </select>
                </div>

                <label className="regional-mode-toggle">
                  <input type="checkbox" checked={regionalMode} onChange={(event) => { setRegionalMode(event.target.checked); localStorage.setItem("mindset_ner_regional_mode", String(event.target.checked)); }} />
                  <span><strong>🌿 {getUIText(language, "regionalMode")}</strong><small>{getUIText(language, "regionalModeHelp")}</small></span>
                </label>

                <button
                  className="patient-voice-button"
                  onClick={startVoiceAssistant}
                  disabled={isListening}
                >
                  <span className="big-action-icon">🎙️</span>

                  <span>{isListening ? home.listening : t.voice}</span>
                </button>
              </div>

              {/* COGNITIVE ACTIVITIES */}
              <DailyCarePlan language={language} />
              <div className="patient-section-title">{uiT("cognitiveActivities")}</div>

              <div className="patient-activity-grid">
                <button
                  className="patient-activity-card memory-card"
                  onClick={() => setShowGame(true)}
                >
                  <div className="activity-image">🧠</div>
                  <strong>{uiT("memoryActivityShort")}</strong>
                  <span>{uiT("activityShort")}</span>
                </button>

                <button
                  className="patient-activity-card attention-card"
                  onClick={() => setShowAttentionGame(true)}
                >
                  <div className="activity-image">🎯</div>
                  <strong>{uiT("attentionActivityShort")}</strong>
                  <span>{uiT("activityShort")}</span>
                </button>

                <button
                  className="patient-activity-card routine-card"
                  onClick={() => setShowRoutineRecall(true)}
                >
                  <div className="activity-image">📋</div>
                  <strong>{uiT("dailyRoutineShort")}</strong>
                  <span>{uiT("recallShort")}</span>
                </button>

                <button
                  className="patient-activity-card pattern-card"
                  onClick={() => setShowPatternGame(true)}
                >
                  <div className="activity-image">🔷</div>
                  <strong>{uiT("patternShort")}</strong>
                  <span>{uiT("recognitionShort")}</span>
                </button>

                <button
                  className="patient-activity-card object-card"
                  onClick={() => setShowObjectRecognition(true)}
                >
                  <div className="activity-image">🔍</div>
                  <strong>{uiT("objectShort")}</strong>
                  <span>{uiT("recognitionShort")}</span>
                </button>
                <button
                  className="patient-activity-card familiarity-card"
                  onClick={() => setShowFamilyFamiliarity(true)}
                >
                  <div className="activity-image">👨‍👩‍👧</div>
                  <strong>{uiT("appFamily")}</strong>
                  <span>{uiT("appFamiliarity")}</span>
                </button>
              </div>

              {/* WELL-BEING */}
              <div className="patient-section-title">{uiT("wellbeingDailySupport")}</div>

              <div className="patient-wellbeing-grid">
                <button
                  className="patient-support-card mood-card"
                  onClick={() => setShowMoodCheckIn(true)}
                >
                  <span className="support-big-icon">❤️</span>

                  <span className="support-card-text">{uiT("moodCheckIn")}</span>
                </button>

                <button
                  className="patient-support-card reminder-card"
                  onClick={() => setShowPatientReminders(true)}
                >
                  <span className="support-big-icon">🔔</span>

                  <span className="support-card-text">{uiT("reminders")}</span>
                </button>
                <button
                  className="patient-support-card elder-connect-card"
                  onClick={() => setShowElderConnect(true)}
                >
                  <span className="support-big-icon">🤝</span>
                  <span className="support-card-text">{uiT("appElderConnect")}</span>
                </button>
                <button
                  className="patient-support-card message-card"
                  onClick={() => setShowElderMessages(true)}
                >
                  <span className="support-big-icon">💬</span>
                  <span className="support-card-text">{uiT("messages")}</span>
                </button>
                <button
                  className="patient-support-card profile-card"
                  onClick={() => setShowProfile(true)}
                >
                  <span className="support-big-icon">👤</span>
                  <span className="support-card-text">{uiT("profile")}</span>
                </button>
              </div>

              {/* LOGOUT */}
              <button className="patient-logout-button" onClick={handleLogout}>
                🚪 &nbsp; {uiT("logout")}
              </button>

              <p className="support-text">{uiT("simple")} • {uiT("friendly")} • {uiT("designedForYou")}</p>
            </>
          )}
        </main>
      </div>
      {isCaregiver && (
        <p className="caregiver-page-footer">
          <span aria-hidden="true">♥</span> {uiT("simple")} <b>·</b> {uiT("friendly")} <b>·</b>{" "}
          {uiT("designedForYou")}
        </p>
      )}
    </>
  );
}

export default App;
