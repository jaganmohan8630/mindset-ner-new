import { useEffect, useRef, useState } from "react";
import { API_URL } from "../api";
import { NER_PATTERN_SYMBOLS } from "../culturalContent/nerContent";
import { getUIText } from "../uiTranslations";

function PatternGame({ onBack, language = "en-IN", regionalMode = false }) {
  const t = (key) => getUIText(language, key);
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
          <p className="eyebrow">{t("patternGameEyebrow")}</p>

          <h1>{t("preparingActivity")}</h1>
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
          ← {t("back")}
        </button>

        <div className="game-header">
          <p className="eyebrow">{t("patternGameEyebrow")}</p>

          <h1>{t("wellDone")}</h1>

          <p>{t("patternActivityCompletion")}</p>
        </div>

        <div className="game-complete">
          <h2>{t("activityComplete")}</h2>

          <p>
            {t("score")}: <strong>{score}</strong>
          </p>

          <p>
            {t("correctAnswers")}:{" "}
            <strong>
              {correctAnswers} / {questions.length}
            </strong>
          </p>

          <p>
            {t("accuracy")}: <strong>{accuracy}%</strong>
          </p>

          <p>
            {t("difficulty")}: <strong>{t("level")} {difficulty}</strong>
          </p>

          <button className="start-button" onClick={onBack}>
            {t("backToHome")}
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
        ← {t("back")}
      </button>

      <div className="game-header pattern-game-header">
        <p className="eyebrow">{t("patternGameEyebrow")}</p>

        <h1>{t("patternGameTitle")}</h1>

        <p>{t("patternGameDescription")}</p>

        <p>
          {t("patternQuestionProgress").replace("{current}", String(currentQuestion + 1)).replace("{total}", String(questions.length))}
        </p>
        <div className="pattern-game-status" aria-label={t("activityProgress")}>
          <div>
            <span>{t("question")}</span>
            <strong>{t("patternQuestionProgress").replace("{current}", String(currentQuestion + 1)).replace("{total}", String(questions.length))}</strong>
          </div>
          <div>
            <span>{t("correctAnswers")}</span>
            <strong>{correctAnswers}</strong>
          </div>
          <div>
            <span>{t("activityLevel")}</span>
            <strong>{difficulty}</strong>
          </div>
        </div>
        <p className="pattern-game-tip">{t("patternGameTip")}</p>
      </div>

      <div className="routine-question-card pattern-question-card">
        <div className="pattern-display">
          {question.pattern.map((item, index) => (
            <span key={`${item}-${index}`} className="pattern-item">
              {item}
            </span>
          ))}
        </div>

        <h2>{t("whatComesNext")}</h2>

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
                aria-label={t("answerOption").replace("{option}", option)}
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
