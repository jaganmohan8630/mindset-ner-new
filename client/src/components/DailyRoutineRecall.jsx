import { useEffect, useState } from "react";
import { API_URL } from "../api";
import {
  assameseRegionalRoutineQuestions,
  assameseRoutineQuestions,
  bengaliRegionalRoutineQuestions,
  bengaliRoutineQuestions,
  hindiRegionalRoutineQuestions,
  hindiRoutineQuestions,
  nagameseRegionalRoutineQuestions,
  nagameseRoutineQuestions,
  teluguRegionalRoutineQuestions,
  teluguRoutineQuestions,
} from "../activityTranslations";
import { NER_ROUTINE_QUESTIONS } from "../culturalContent/nerContent";
import { getUIText } from "../uiTranslations";

function DailyRoutineRecall({ onBack, language = "en-IN", regionalMode = false }) {
  const t = (key) => getUIText(language, key);
  const user = JSON.parse(localStorage.getItem("mindset_ner_user") || "null");

  const patientId = user?.patientId;
  const token = localStorage.getItem("mindset_ner_token");

  const [difficulty, setDifficulty] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);

  const [startTime, setStartTime] = useState(null);
  const [responseTimes, setResponseTimes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  const questionBank = [
    {
      question: "What do you usually do after waking up in the morning?",
      options: ["Brush your teeth", "Go to sleep", "Have dinner", "Go to bed"],
      answer: 0,
    },

    {
      question: "What would you normally do before having breakfast?",
      options: [
        "Wash your face and brush your teeth",
        "Go to sleep for the night",
        "Have dinner",
        "Watch television until midnight",
      ],
      answer: 0,
    },

    {
      question:
        "After having your morning tea or breakfast, what would you usually do?",
      options: [
        "Continue with your morning activities",
        "Go to bed for the night",
        "Have dinner",
        "Wake up",
      ],
      answer: 0,
    },

    {
      question:
        "What should you remember to do when it is time for your medicine?",
      options: [
        "Take the medicine as instructed",
        "Skip the medicine",
        "Go back to sleep",
        "Wait until tomorrow",
      ],
      answer: 0,
    },

    {
      question:
        "If you feel thirsty during the day, what should you remember to do?",
      options: [
        "Drink water",
        "Skip all meals",
        "Go to sleep",
        "Stay awake all night",
      ],
      answer: 0,
    },

    {
      question: "What would you normally do around lunchtime?",
      options: [
        "Have lunch",
        "Have breakfast",
        "Go to bed for the night",
        "Wake up",
      ],
      answer: 0,
    },

    {
      question:
        "After lunch, which activity could be part of your normal afternoon routine?",
      options: [
        "Rest or continue your daily activities",
        "Have breakfast",
        "Start the morning",
        "Go to bed for the night",
      ],
      answer: 0,
    },

    {
      question: "Which activity normally happens in the evening?",
      options: [
        "Have dinner",
        "Have breakfast",
        "Wake up",
        "Start the morning",
      ],
      answer: 0,
    },

    {
      question: "What might you do with family members during the evening?",
      options: [
        "Talk together or spend time together",
        "Go to sleep immediately after waking",
        "Have breakfast",
        "Start the morning routine",
      ],
      answer: 0,
    },

    {
      question: "What do you usually do before going to bed at night?",
      options: [
        "Prepare for sleep",
        "Have breakfast",
        "Start the morning",
        "Have lunch",
      ],
      answer: 0,
    },
  ];

  useEffect(() => {
    const loadDifficulty = async () => {
      if (!patientId || !token) {
        prepareQuestions(1);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/games/adaptive/${patientId}?gameType=routineRecall`,
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

          setDifficulty(recommendedDifficulty);
          prepareQuestions(recommendedDifficulty);
        } else {
          prepareQuestions(1);
        }
      } catch (error) {
        console.error("Failed to load routine recall difficulty:", error);

        prepareQuestions(1);
      } finally {
        setLoading(false);
      }
    };

    loadDifficulty();
  }, []);

  const prepareQuestions = (level) => {
    let count = 5;

    if (level >= 3) {
      count = 7;
    }

    if (level >= 5) {
      count = 10;
    }

    const regionalQuestions = {
      "en-IN": NER_ROUTINE_QUESTIONS,
      "hi-IN": hindiRegionalRoutineQuestions,
      "te-IN": teluguRegionalRoutineQuestions,
      "as-IN": assameseRegionalRoutineQuestions,
      "bn-IN": bengaliRegionalRoutineQuestions,
      "nag-IN": nagameseRegionalRoutineQuestions,
    }[language] || NER_ROUTINE_QUESTIONS;
    const activeQuestionBank = regionalMode
      ? [...questionBank, ...regionalQuestions.map((question) => ({ ...question, isRegionalRoutineQuestion: true }))]
      : questionBank;
    const shuffled = [...activeQuestionBank]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);

    setQuestions(shuffled);
    setCurrentQuestion(0);
    setScore(0);
    setCorrectAnswers(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setResponseTimes([]);
    setStartTime(Date.now());
  };

  const handleAnswer = (index) => {
    if (answered || !questions[currentQuestion]) {
      return;
    }

    const question = questions[currentQuestion];

    const responseTime = (Date.now() - startTime) / 1000;

    setResponseTimes((previous) => [...previous, responseTime]);

    setSelectedAnswer(index);
    setAnswered(true);

    if (index === question.answer) {
      setCorrectAnswers((previous) => previous + 1);

      setScore((previous) => previous + 100);
    }

    setTimeout(() => {
      if (currentQuestion === questions.length - 1) {
        finishGame(index === question.answer);
      } else {
        setCurrentQuestion((previous) => previous + 1);

        setSelectedAnswer(null);
        setAnswered(false);
        setStartTime(Date.now());
      }
    }, 900);
  };

  const finishGame = async (lastAnswerCorrect) => {
    const finalCorrect = correctAnswers + (lastAnswerCorrect ? 1 : 0);

    const totalQuestions = questions.length;

    const accuracy =
      totalQuestions > 0
        ? Math.round((finalCorrect / totalQuestions) * 100)
        : 0;

    const finalScore =
      totalQuestions > 0
        ? Math.round((finalCorrect / totalQuestions) * 100)
        : 0;
    const allResponseTimes = [
      ...responseTimes,
      (Date.now() - startTime) / 1000,
    ];

    const averageResponseTime =
      allResponseTimes.length > 0
        ? Math.round(
            (allResponseTimes.reduce((sum, time) => sum + time, 0) /
              allResponseTimes.length) *
              100,
          ) / 100
        : 0;

    setScore(finalScore);
    setCorrectAnswers(finalCorrect);
    setCompleted(true);

    const session = {
      patientId,
      gameType: "routineRecall",
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
        throw new Error("Failed to save routine recall session");
      }
    } catch (error) {
      console.error("Failed to save routine recall session:", error);

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
        console.error("Offline routine sync failed:", error);
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

  if (!patientId) {
    return null;
  }

  if (loading) {
    return (
      <div className="game-page">
        <div className="game-header">
          <p className="eyebrow">{t("dailyRoutineRecallActivityName")}</p>

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
        <div className="game-header">
          <p className="eyebrow">{t("dailyRoutineRecallActivityName")}</p>

          <h1>{t("wellDone")}</h1>

          <p>{t("dailyRoutineRecallCompletion")}</p>
        </div>

        <div className="routine-recall-card">
          {" "}
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
            {t("difficulty")}: <strong>{t("dailyRoutineRecallDifficultyLevel").replace("{level}", String(difficulty))}</strong>
          </p>
          <button className="start-button" onClick={onBack}>
            {t("backToHome")}
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const localizedQuestions = {
    "hi-IN": hindiRoutineQuestions,
    "te-IN": teluguRoutineQuestions,
    "as-IN": assameseRoutineQuestions,
    "bn-IN": bengaliRoutineQuestions,
    "nag-IN": nagameseRoutineQuestions,
  }[language];
  const displayQuestion = question.isRegionalRoutineQuestion
    ? question
    : localizedQuestions?.[currentQuestion]
    ? { ...question, question: localizedQuestions[currentQuestion][0], options: localizedQuestions[currentQuestion][1] }
    : question;

  if (!question) {
    return null;
  }

  return (
    <div className="game-page routine-recall-game-page">
      <button className="back-button" onClick={onBack}>
        ← {t("back")}
      </button>

      <div className="game-header routine-recall-game-header">
        <p className="eyebrow">{t("dailyRoutineRecallActivityName")}</p>

        <h1>{t("dailyRoutineRecallTitle")}</h1>

        <p>
          {t("dailyRoutineRecallDescription")}
        </p>

        <p>
          {t("dailyRoutineRecallQuestionProgress").replace("{current}", String(currentQuestion + 1)).replace("{total}", String(questions.length))}
        </p>
        <div className="routine-recall-status" aria-label={t("activityProgress")}>
          <div>
            <span>{t("question")}</span>
            <strong>{t("dailyRoutineRecallQuestionProgress").replace("{current}", String(currentQuestion + 1)).replace("{total}", String(questions.length))}</strong>
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
        <p className="routine-recall-tip">{t("dailyRoutineRecallTip")}</p>
      </div>

      <div className="routine-question-card">
        <h2>{displayQuestion.question}</h2>

        <div className="routine-options">
          {displayQuestion.options.map((option, index) => {
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
                key={option}
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

export default DailyRoutineRecall;
