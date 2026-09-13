import { useEffect, useRef, useState } from "react";
import { API_URL } from "../api";
import { NER_PATTERN_SYMBOLS } from "../culturalContent/nerContent";

function PatternGame({ onBack, language = "en-IN", regionalMode = false }) {
  const isHindi = language === "hi-IN";
  const isTelugu = language === "te-IN";
  const isAssamese = language === "as-IN";
  const isBengali = language === "bn-IN";
  const isNagamese = language === "nag-IN";
  const patternText = isTelugu ? { eyebrow: "నమూనా గుర్తింపు", preparing: "మీ కార్యకలాపం సిద్ధమవుతోంది...", title: "తప్పిపోయిన నమూనాను కనుగొనండి", description: "క్రమాన్ని జాగ్రత్తగా చూసి, తదుపరి ఏమి వస్తుందో ఎంచుకోండి.", question: "ప్రశ్న", correct: "సరైన సమాధానాలు", level: "కార్యకలాప స్థాయి", tip: "ఏది పునరావృతమవుతుందో చూడండి, నమూనాను పూర్తి చేసే చిహ్నాన్ని ఎంచుకోండి.", prompt: "తర్వాత ఏమి వస్తుంది?", back: "వెనుకకు", wellDone: "చాలా బాగా చేశారు!", completion: "మీరు నమూనా గుర్తింపు కార్యకలాపాన్ని పూర్తి చేశారు.", complete: "కార్యకలాపం పూర్తయింది", score: "స్కోర్", accuracy: "ఖచ్చితత్వం", difficulty: "కష్టతర స్థాయి", home: "హోమ్‌కు తిరిగి వెళ్లండి" } : isAssamese ? { eyebrow: "আৰ্হি চিনাক্তকৰণ", preparing: "আপোনাৰ কাৰ্যকলাপ প্ৰস্তুত হৈ আছে...", title: "হেৰাই যোৱা আৰ্হিটো বিচাৰি উলিয়াওক", description: "ক্ৰমটো মনোযোগেৰে চাওক আৰু তাৰ পিছত কি আহিব বাছক।", question: "প্ৰশ্ন", correct: "সঠিক উত্তৰ", level: "কাৰ্যকলাপৰ স্তৰ", tip: "কি পুনৰাবৃত্তি হৈছে চাওক, তাৰ পিছত আৰ্হিটো সম্পূৰ্ণ কৰা চিহ্ন বাছক।", prompt: "তাৰ পিছত কি আহিব?", back: "পিছলৈ", wellDone: "খুব ভাল!", completion: "আপুনি আৰ্হি চিনাক্তকৰণ কাৰ্যকলাপ সম্পূৰ্ণ কৰিলে।", complete: "কাৰ্যকলাপ সম্পূৰ্ণ", score: "স্ক’ৰ", accuracy: "সঠিকতা", difficulty: "কঠিনতাৰ স্তৰ", home: "হোমলৈ উভতি যাওক" } : isBengali ? { eyebrow: "প্যাটার্ন শনাক্তকরণ", preparing: "আপনার কার্যক্রম প্রস্তুত হচ্ছে...", title: "হারিয়ে যাওয়া প্যাটার্নটি খুঁজুন", description: "ক্রমটি মনোযোগ দিয়ে দেখুন এবং এরপর কী আসবে বেছে নিন।", question: "প্রশ্ন", correct: "সঠিক উত্তর", level: "কার্যক্রমের স্তর", tip: "কী পুনরাবৃত্তি হচ্ছে দেখুন, তারপর প্যাটার্নটি সম্পূর্ণ করা চিহ্নটি বেছে নিন।", prompt: "এর পরে কী আসবে?", back: "ফিরে যান", wellDone: "খুব ভালো!", completion: "আপনি প্যাটার্ন শনাক্তকরণ কার্যক্রম সম্পূর্ণ করেছেন।", complete: "কার্যক্রম সম্পূর্ণ", score: "স্কোর", accuracy: "সঠিকতা", difficulty: "কঠিনতার স্তর", home: "হোমে ফিরে যান" } : isNagamese ? { eyebrow: "Pattern recognition", preparing: "Apunar activity ready kori ase...", title: "Missing pattern bisaribo", description: "Sequence bhal sai aru next te ki ahibo bachibo.", question: "Question", correct: "Thik answers", level: "Activity level", tip: "Ki repeat hoi ase sai, pichete pattern complete koribole symbol bachibo.", prompt: "Pichete ki ahibo?", back: "Piche jai", wellDone: "Besi bhal!", completion: "Apuni pattern recognition activity complete korise.", complete: "Activity complete", score: "Score", accuracy: "Accuracy", difficulty: "Difficulty", home: "Home te jai" } : null;
  const user = JSON.parse(localStorage.getItem("mindset_ner_user") || "null");

  const patientId = user?.patientId;
  const token = localStorage.getItem("mindset_ner_token");

  const [difficulty, setDifficulty] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const correctAnswersRef = useRef(0);

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);

  const [startTime, setStartTime] = useState(null);
  const [responseTimes, setResponseTimes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  /*
   * Pattern question bank.
   *
   * Difficulty 1:
   * Simple repeating patterns.
   *
   * Difficulty 2:
   * Longer repeating patterns.
   *
   * Difficulty 3:
   * More complex sequences.
   *
   * Difficulty 4-5:
   * Alternating and directional patterns.
   */

  const questionBank = [
    // LEVEL 1 — Simple familiar patterns
    {
      level: 1,
      pattern: ["🍚", "🥭", "🍚", "🥭", "?"],
      options: ["🍚", "🥥", "☕", "🌾"],
      answer: 0,
    },
    {
      level: 1,
      pattern: ["☕", "☕", "?"],
      options: ["🥭", "☕", "🍚", "🥥"],
      answer: 1,
    },
    {
      level: 1,
      pattern: ["🌾", "🍚", "🌾", "🍚", "?"],
      options: ["🥥", "🌾", "☕", "🥭"],
      answer: 1,
    },
    {
      level: 1,
      pattern: ["🪔", "🌿", "🪔", "🌿", "?"],
      options: ["🪔", "🥭", "🍚", "☕"],
      answer: 0,
    },

    // LEVEL 2 — Longer familiar patterns
    {
      level: 2,
      pattern: ["🍚", "🥭", "🥥", "🍚", "🥭", "?"],
      options: ["🥥", "🍚", "☕", "🌾"],
      answer: 0,
    },
    {
      level: 2,
      pattern: ["☕", "🌾", "☕", "🌾", "?"],
      options: ["🥭", "☕", "🍚", "🪔"],
      answer: 1,
    },
    {
      level: 2,
      pattern: ["🪔", "🌿", "🌿", "🪔", "🌿", "?"],
      options: ["🌿", "🪔", "🥥", "🍚"],
      answer: 0,
    },
    {
      level: 2,
      pattern: ["🥭", "🥥", "🍚", "🥭", "🥥", "?"],
      options: ["☕", "🥭", "🍚", "🌾"],
      answer: 2,
    },

    // LEVEL 3 — More complex sequences
    {
      level: 3,
      pattern: ["🍚", "🥭", "🥭", "🥥", "🍚", "🥭", "🥭", "?"],
      options: ["🍚", "🥥", "🥭", "🌾"],
      answer: 1,
    },
    {
      level: 3,
      pattern: ["☕", "🌾", "🪔", "☕", "🌾", "🪔", "?"],
      options: ["☕", "🌿", "🥭", "🌾"],
      answer: 0,
    },
    {
      level: 3,
      pattern: ["🥥", "🍚", "🥭", "🥥", "🍚", "🥭", "?"],
      options: ["🥭", "🍚", "🥥", "☕"],
      answer: 2,
    },
    {
      level: 3,
      pattern: ["🌿", "🪔", "🪔", "🌾", "🌿", "🪔", "🪔", "?"],
      options: ["🌿", "🪔", "🌾", "🍚"],
      answer: 2,
    },

    // LEVEL 4 — Repeating and alternating patterns
    {
      level: 4,
      pattern: ["🍚", "🥭", "🥥", "🥥", "🥭", "🍚", "?"],
      options: ["🍚", "🥭", "🥥", "☕"],
      answer: 0,
    },
    {
      level: 4,
      pattern: ["☕", "🌾", "🌾", "☕", "☕", "🌾", "?"],
      options: ["☕", "🌾", "🪔", "🥥"],
      answer: 0,
    },
    {
      level: 4,
      pattern: ["🥭", "🍚", "🥥", "🍚", "🥭", "?"],
      options: ["🍚", "🥥", "🥭", "🌾"],
      answer: 1,
    },

    // LEVEL 5 — Complex familiar patterns
    {
      level: 5,
      pattern: ["🍚", "🥭", "🥥", "🥭", "🍚", "🥭", "🥥", "?"],
      options: ["🍚", "🥥", "🥭", "🌾"],
      answer: 1,
    },
    {
      level: 5,
      pattern: ["🪔", "🌿", "🌾", "☕", "🪔", "🌿", "🌾", "?"],
      options: ["🥭", "☕", "🌾", "🪔"],
      answer: 1,
    },
  ];

  const prepareQuestions = (level) => {
    let count = 5;

    if (level >= 3) {
      count = 7;
    }

    if (level >= 5) {
      count = 10;
    }

    let available = questionBank.filter((question) => question.level <= level);

    if (available.length < count) {
      available = [...questionBank];
    }

    const visualMap = regionalMode ? {
      "🍚": NER_PATTERN_SYMBOLS[0], "🥭": NER_PATTERN_SYMBOLS[1], "🥥": NER_PATTERN_SYMBOLS[2], "☕": NER_PATTERN_SYMBOLS[3],
    } : null;
    const regionalize = (symbol) => visualMap?.[symbol] || symbol;
    const shuffled = [...available]
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
      .map((question) => regionalMode ? { ...question, pattern: question.pattern.map(regionalize), options: question.options.map(regionalize) } : question);

    setQuestions(shuffled);
    setCurrentQuestion(0);
    setScore(0);
    setCorrectAnswers(0);
    correctAnswersRef.current = 0;
    setSelectedAnswer(null);
    setAnswered(false);
    setResponseTimes([]);
    setStartTime(Date.now());
  };

  useEffect(() => {
    const loadDifficulty = async () => {
      if (!patientId || !token) {
        prepareQuestions(1);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/games/adaptive/${patientId}?gameType=pattern`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();

          const recommendedDifficulty =
            data.difficulty || data.recommendation?.difficulty || 1;

          const safeDifficulty = Math.min(
            Math.max(Number(recommendedDifficulty), 1),
            5,
          );

          setDifficulty(safeDifficulty);
          prepareQuestions(safeDifficulty);
        } else {
          prepareQuestions(1);
        }
      } catch (error) {
        console.error("Failed to load pattern difficulty:", error);

        prepareQuestions(1);
      } finally {
        setLoading(false);
      }
    };

    loadDifficulty();
  }, []);

  const finishGame = async (finalCorrect, finalResponseTimes) => {
    const totalQuestions = questions.length;

    const accuracy =
      totalQuestions > 0
        ? Math.round((finalCorrect / totalQuestions) * 100)
        : 0;

    const finalScore = accuracy;

    const averageResponseTime =
      finalResponseTimes.length > 0
        ? Math.round(
            (finalResponseTimes.reduce((sum, time) => sum + time, 0) /
              finalResponseTimes.length) *
              100,
          ) / 100
        : 0;

    setScore(finalScore);
    setCorrectAnswers(finalCorrect);
    setCompleted(true);

    const session = {
      patientId,
      gameType: "pattern",
      difficulty,
      score: finalScore,
      totalQuestions,
      correctAnswers: finalCorrect,
      accuracy,
      averageResponseTime,
      completed: true,
      playedOffline: false,
      synced: true,
    };

    try {
      const response = await fetch(`${API_URL}/api/games/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(session),
      });

      if (!response.ok) {
        throw new Error("Failed to save pattern session");
      }
    } catch (error) {
      console.error("Failed to save pattern session:", error);

      const offlineSessions = JSON.parse(
        localStorage.getItem("mindset_ner_offline_games") || "[]",
      );

      offlineSessions.push({
        ...session,
        playedOffline: true,
        synced: false,
      });

      localStorage.setItem(
        "mindset_ner_offline_games",
        JSON.stringify(offlineSessions),
      );
    }
  };
  const syncOfflineSessions = async () => {
    const offlineSessions = JSON.parse(
      localStorage.getItem("mindset_ner_offline_games") || "[]",
    );

    if (offlineSessions.length === 0) return;

    const remainingSessions = [];

    for (const session of offlineSessions) {
      try {
        const response = await fetch(
          `${API_URL}/api/games/sessions`,
          {
            method: "POST",
            headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("mindset_ner_token")}`,
},
            body: JSON.stringify({
              ...session,
              playedOffline: true,
              synced: true,
            }),
          },
        );

        if (!response.ok) {
          remainingSessions.push(session);
        }
      } catch (error) {
        console.error("Offline pattern sync failed:", error);
        remainingSessions.push(session);
      }
    }

    localStorage.setItem(
      "mindset_ner_offline_games",
      JSON.stringify(remainingSessions),
    );
  };

  useEffect(() => {
    const handleOnline = () => {
      syncOfflineSessions();
    };

    window.addEventListener("online", handleOnline);

    if (navigator.onLine) {
      syncOfflineSessions();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  const handleAnswer = (index) => {
    if (answered || !questions[currentQuestion]) {
      return;
    }

    const question = questions[currentQuestion];

    const responseTime = (Date.now() - startTime) / 1000;

    const updatedResponseTimes = [...responseTimes, responseTime];

    const isCorrect = index === question.answer;

    // Keep the correct-answer count in a ref
    // so the final result always gets the latest value.
    if (isCorrect) {
      correctAnswersRef.current += 1;
    }

    const updatedCorrectAnswers = correctAnswersRef.current;

    setSelectedAnswer(index);
    setAnswered(true);

    if (isCorrect) {
      setScore((previous) => previous + 100);
    }

    setCorrectAnswers(updatedCorrectAnswers);
    setResponseTimes(updatedResponseTimes);

    setTimeout(() => {
      if (currentQuestion === questions.length - 1) {
        finishGame(correctAnswersRef.current, updatedResponseTimes);
      } else {
        setCurrentQuestion((previous) => previous + 1);

        setSelectedAnswer(null);
        setAnswered(false);
        setStartTime(Date.now());
      }
    }, 900);
  };

  if (!patientId) {
    return null;
  }

  if (loading) {
    return (
      <div className="game-page">
        <div className="game-header">
          <p className="eyebrow">{patternText?.eyebrow || (isHindi ? "पैटर्न पहचान" : "PATTERN RECOGNITION")}</p>

          <h1>{patternText?.preparing || (isHindi ? "आपकी गतिविधि तैयार की जा रही है..." : "Preparing your activity...")}</h1>
        </div>
      </div>
    );
  }

  if (completed) {
    const accuracy =
      questions.length > 0
        ? Math.round((correctAnswers / questions.length) * 100)
        : 0;

    return (
      <div className="game-page">
        <button className="back-button" onClick={onBack}>
          ← {patternText?.back || "Back"}
        </button>

        <div className="game-header">
          <p className="eyebrow">{patternText?.eyebrow || "PATTERN RECOGNITION"}</p>

          <h1>{patternText?.wellDone || "Well done!"}</h1>

          <p>{patternText?.completion || "You completed the pattern recognition activity."}</p>
        </div>

        <div className="game-complete">
          <h2>{patternText?.complete || "Activity Complete"}</h2>

          <p>
            {patternText?.score || "Score"}: <strong>{score}</strong>
          </p>

          <p>
            {patternText?.correct || "Correct answers"}:{" "}
            <strong>
              {correctAnswers} / {questions.length}
            </strong>
          </p>

          <p>
            {patternText?.accuracy || "Accuracy"}: <strong>{accuracy}%</strong>
          </p>

          <p>
            {patternText?.difficulty || "Difficulty"}: <strong>{patternText?.level || "Level"} {difficulty}</strong>
          </p>

          <button className="start-button" onClick={onBack}>
            {patternText?.home || "Back to Home"}
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  if (!question) {
    return null;
  }

  return (
    <div className="game-page pattern-game-page">
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>

      <div className="game-header pattern-game-header">
        <p className="eyebrow">{patternText?.eyebrow || (isHindi ? "पैटर्न पहचान" : "PATTERN RECOGNITION")}</p>

        <h1>{patternText?.title || (isHindi ? "गायब पैटर्न खोजें" : "Find the missing pattern")}</h1>

        <p>{patternText?.description || (isHindi ? "क्रम को ध्यान से देखें और अगला चिन्ह चुनें।" : "Look carefully at the sequence and choose what comes next.")}</p>

        <p>
          {patternText?.question || (isHindi ? "प्रश्न" : "Question")} {currentQuestion + 1} {(isHindi || isTelugu || isAssamese || isBengali) ? "/" : "of"} {questions.length}
        </p>
        <div className="pattern-game-status" aria-label="Activity progress">
          <div>
            <span>Question</span>
            <strong>{currentQuestion + 1} of {questions.length}</strong>
          </div>
          <div>
            <span>{patternText?.correct || (isHindi ? "सही उत्तर" : "Correct answers")}</span>
            <strong>{correctAnswers}</strong>
          </div>
          <div>
            <span>{patternText?.level || (isHindi ? "गतिविधि स्तर" : "Activity level")}</span>
            <strong>{difficulty}</strong>
          </div>
        </div>
        <p className="pattern-game-tip">{patternText?.tip || (isHindi ? "जो दोहराया जा रहा है उसे देखें, फिर पैटर्न पूरा करने वाला चिन्ह चुनें।" : "Look for what repeats, then choose the symbol that completes the pattern.")}</p>
      </div>

      <div className="routine-question-card pattern-question-card">
        <div className="pattern-display">
          {question.pattern.map((item, index) => (
            <span key={`${item}-${index}`} className="pattern-item">
              {item}
            </span>
          ))}
        </div>

        <h2>{patternText?.prompt || (isHindi ? "इसके बाद क्या आएगा?" : "What comes next?")}</h2>

        <div className="routine-options">
          {question.options.map((option, index) => {
            let className = "routine-option";

            if (answered) {
              if (index === question.answer) {
                className += " correct";
              } else if (index === selectedAnswer) {
                className += " incorrect";
              }
            }

            return (
              <button
                key={`${option}-${index}`}
                className={className}
                onClick={() => handleAnswer(index)}
                disabled={answered}
                aria-label={`Answer: ${option}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PatternGame;
