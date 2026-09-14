import { useEffect, useState } from "react";
import { API_URL } from "../api";
import { assameseObjectLabels, bengaliObjectLabels, hindiObjectLabels, nagameseObjectLabels, teluguObjectLabels } from "../activityTranslations";
import { NER_OBJECTS } from "../culturalContent/nerContent";
import { getUIText } from "../uiTranslations";

const OBJECTS = [
  // Level 1 - very familiar household objects
  {
    level: 1,
    emoji: "🥄",
    name: "Spoon",
    options: ["Spoon", "Book", "Cup", "Clock"],
    answer: 0,
  },
  {
    level: 1,
    emoji: "📖",
    name: "Book",
    options: ["Plate", "Book", "Spoon", "Bottle"],
    answer: 1,
  },
  {
    level: 1,
    emoji: "☕",
    name: "Cup",
    options: ["Cup", "Chair", "Clock", "Key"],
    answer: 0,
  },
  {
    level: 1,
    emoji: "🔑",
    name: "Key",
    options: ["Bottle", "Plate", "Key", "Book"],
    answer: 2,
  },

  // Level 2 - familiar food and household objects
  {
    level: 2,
    emoji: "🥭",
    name: "Mango",
    options: ["Banana", "Mango", "Orange", "Apple"],
    answer: 1,
  },
  {
    level: 2,
    emoji: "🍚",
    name: "Rice",
    options: ["Rice", "Bread", "Apple", "Banana"],
    answer: 0,
  },
  {
    level: 2,
    emoji: "💧",
    name: "Water",
    options: ["Milk", "Water", "Juice", "Tea"],
    answer: 1,
  },
  {
    level: 2,
    emoji: "🪑",
    name: "Chair",
    options: ["Table", "Chair", "Bed", "Door"],
    answer: 1,
  },

  // Level 3 - familiar daily-life objects
  {
    level: 3,
    emoji: "📱",
    name: "Mobile Phone",
    options: ["Television", "Mobile Phone", "Radio", "Camera"],
    answer: 1,
  },
  {
    level: 3,
    emoji: "🧹",
    name: "Broom",
    options: ["Broom", "Chair", "Spoon", "Plate"],
    answer: 0,
  },
  {
    level: 3,
    emoji: "🧴",
    name: "Medicine Bottle",
    options: ["Water Bottle", "Medicine Bottle", "Cup", "Glass"],
    answer: 1,
  },
  {
    level: 3,
    emoji: "☂️",
    name: "Umbrella",
    options: ["Umbrella", "Hat", "Bag", "Shoes"],
    answer: 0,
  },

  // Level 4 - culturally familiar daily-life objects
  {
    level: 4,
    emoji: "🫖",
    name: "Teapot",
    options: ["Teapot", "Cup", "Bottle", "Plate"],
    answer: 0,
  },
  {
    level: 4,
    emoji: "🍌",
    name: "Banana",
    options: ["Banana", "Mango", "Rice", "Orange"],
    answer: 0,
  },
  {
    level: 4,
    emoji: "🪥",
    name: "Toothbrush",
    options: ["Comb", "Spoon", "Toothbrush", "Pen"],
    answer: 2,
  },
  {
    level: 4,
    emoji: "🪣",
    name: "Water Bucket",
    options: ["Water Bucket", "Chair", "Plate", "Book"],
    answer: 0,
  },

  // Level 5 - healthcare and regional everyday context
  {
    level: 5,
    emoji: "🩺",
    name: "Stethoscope",
    options: ["Stethoscope", "Thermometer", "Glasses", "Watch"],
    answer: 0,
  },
  {
    level: 5,
    emoji: "🌾",
    name: "Rice Crop",
    options: ["Rice Crop", "Flower", "Tree", "Grass"],
    answer: 0,
  },
  {
    level: 5,
    emoji: "🧺",
    name: "Basket",
    options: ["Basket", "Bottle", "Clock", "Spoon"],
    answer: 0,
  },
  {
    level: 5,
    emoji: "🥥",
    name: "Coconut",
    options: ["Coconut", "Apple", "Orange", "Bread"],
    answer: 0,
  },
];

const OFFLINE_GAMES_KEY = "mindset_ner_offline_games";

function getOfflineGames() {
  try {
    return JSON.parse(
      localStorage.getItem(OFFLINE_GAMES_KEY) || "[]",
    );
  } catch {
    return [];
  }
}

function saveOfflineGame(game) {
  const games = getOfflineGames();

  games.push({
    ...game,
    offlineId: Date.now(),
  });

  localStorage.setItem(
    OFFLINE_GAMES_KEY,
    JSON.stringify(games),
  );
}

function clearOfflineGames(games) {
  localStorage.setItem(
    OFFLINE_GAMES_KEY,
    JSON.stringify(games),
  );
}

function ObjectRecognition({ onBack, language = "en-IN", regionalMode = false }) {
  const t = (key) => getUIText(language, key);
  const user = JSON.parse(
    localStorage.getItem("mindset_ner_user") || "null",
  );

  const patientId = user?.patientId;
  const token = localStorage.getItem("mindset_ner_token");

  const [difficulty, setDifficulty] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);

  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [score, setScore] = useState(0);

  const [startTime, setStartTime] = useState(null);
  const [responseTimes, setResponseTimes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const prepareQuestions = (level) => {
    let count = 5;

    if (level >= 3) {
      count = 7;
    }

    if (level >= 5) {
      count = 10;
    }

    let available = (regionalMode ? NER_OBJECTS : OBJECTS).filter(
      (object) => object.level <= level,
    );

    if (available.length < count) {
      available = [...(regionalMode ? NER_OBJECTS : OBJECTS)];
    }

    const selected = [...available]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);

    setQuestions(selected);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setCorrectAnswers(0);
    setScore(0);
    setResponseTimes([]);
    setStartTime(Date.now());
  };

  const loadDifficulty = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/games/adaptive/${patientId}?gameType=objectRecognition`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();

        const recommendedDifficulty =
          data.difficulty ||
          data.recommendation?.difficulty ||
          1;

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
      console.error(
        "Failed to load object recognition difficulty:",
        error,
      );

      prepareQuestions(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      loadDifficulty();
    }
  }, []);

  const syncOfflineGames = async () => {
    const offlineGames = getOfflineGames();

    if (offlineGames.length === 0) {
      return;
    }

    const remainingGames = [];

    for (const game of offlineGames) {
      try {
        const response = await fetch(
          `${API_URL}/api/games/sessions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...game,
              offlineId: undefined,
              playedOffline: true,
              synced: true,
            }),
          },
        );

        if (!response.ok) {
          remainingGames.push(game);
        }
      } catch (error) {
        console.error(
          "Offline sync failed:",
          error,
        );

        remainingGames.push(game);
      }
    }

    clearOfflineGames(remainingGames);
  };

  useEffect(() => {
    const handleOnline = () => {
      syncOfflineGames();
    };

    window.addEventListener("online", handleOnline);

    if (navigator.onLine) {
      syncOfflineGames();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  const finishGame = async (
    finalCorrect,
    finalResponseTimes,
  ) => {
    const totalQuestions = questions.length;

    const accuracy =
      totalQuestions > 0
        ? Math.round(
            (finalCorrect / totalQuestions) * 100,
          )
        : 0;

    const finalScore = accuracy;

    const averageResponseTime =
      finalResponseTimes.length > 0
        ? Math.round(
            (finalResponseTimes.reduce(
              (sum, time) => sum + time,
              0,
            ) /
              finalResponseTimes.length) *
              100,
          ) / 100
        : 0;

    setCorrectAnswers(finalCorrect);
    setScore(finalScore);
    setCompleted(true);

    const gameData = {
      patientId,
      gameType: "objectRecognition",
      difficulty,
      score: finalScore,
      totalQuestions,
      correctAnswers: finalCorrect,
      accuracy,
      averageResponseTime,
    };

    try {
      if (!navigator.onLine) {
        saveOfflineGame({
          ...gameData,
          playedOffline: true,
          synced: false,
        });

        setSaveMessage(
          t("gameSavedOffline"),
        );

        return;
      }

      const response = await fetch(
        `${API_URL}/api/games/sessions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...gameData,
            playedOffline: false,
            synced: true,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          "Failed to save object recognition session",
        );
      }

      setSaveMessage(
        t("progressSaved"),
      );
    } catch (error) {
      console.error(
        "Object recognition save failed:",
        error,
      );

      saveOfflineGame({
        ...gameData,
        playedOffline: true,
        synced: false,
      });

      setSaveMessage(
        t("gameSavedOffline"),
      );
    }
  };

  const handleAnswer = (index) => {
    if (
      answered ||
      !questions[currentQuestion]
    ) {
      return;
    }

    const question = questions[currentQuestion];

    const responseTime =
      (Date.now() - startTime) / 1000;

    const updatedResponseTimes = [
      ...responseTimes,
      responseTime,
    ];

    const isCorrect =
      index === question.answer;

    const updatedCorrectAnswers =
      correctAnswers +
      (isCorrect ? 1 : 0);

    setSelectedAnswer(index);
    setAnswered(true);
    setCorrectAnswers(updatedCorrectAnswers);
    setResponseTimes(updatedResponseTimes);

    if (isCorrect) {
      setScore(
        (previous) => previous + 100,
      );
    }

    setTimeout(() => {
      if (
        currentQuestion ===
        questions.length - 1
      ) {
        finishGame(
          updatedCorrectAnswers,
          updatedResponseTimes,
        );
      } else {
        setCurrentQuestion(
          (previous) => previous + 1,
        );

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
          <p className="eyebrow">
          {t("objectRecognitionActivity")}
          </p>

          <h1>{t("preparingActivity")}</h1>
        </div>
      </div>
    );
  }

  if (completed) {
    const accuracy =
      questions.length > 0
        ? Math.round(
            (correctAnswers /
              questions.length) *
              100,
          )
        : 0;

    return (
      <div className="game-page">
        <button
          className="back-button"
          onClick={onBack}
        >
          ← {t("back")}
        </button>

        <div className="game-header">
          <p className="eyebrow">
            {t("objectRecognitionActivity")}
          </p>

          <h1>{t("wellDone")}</h1>

          <p>
            {t("objectRecognitionCompletion")}
          </p>
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
            {t("difficulty")}:{" "}
            <strong>{t("objectRecognitionDifficultyLevel").replace("{level}", String(difficulty))}</strong>
          </p>

          {saveMessage && (
            <p>{saveMessage}</p>
          )}

          <button
            className="start-button"
            onClick={onBack}
          >
            {t("backToHome")}
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const objectLabels = {
    "hi-IN": hindiObjectLabels,
    "te-IN": teluguObjectLabels,
    "as-IN": assameseObjectLabels,
    "bn-IN": bengaliObjectLabels,
    "nag-IN": nagameseObjectLabels,
  }[language];
  const displayQuestion = objectLabels
    ? { ...question, options: question.options.map((option) => objectLabels[option] || option) }
    : question;

  return (
    <div className="game-page object-recognition-game-page">
      <button
        className="back-button"
        onClick={onBack}
      >
        ← {t("back")}
      </button>

      <div className="game-header object-recognition-game-header">
        <p className="eyebrow">
          {t("objectRecognitionActivity")}
        </p>

        <h1>{t("objectRecognitionTitle")}</h1>

        <p>
          {t("objectRecognitionDescription")}
        </p>

        <p>
          {t("objectRecognitionQuestionProgress").replace("{current}", String(currentQuestion + 1)).replace("{total}", String(questions.length))}
        </p>
        <div className="object-recognition-status" aria-label={t("activityProgress")}>
          <div>
            <span>{t("question")}</span>
            <strong>{t("objectRecognitionQuestionProgress").replace("{current}", String(currentQuestion + 1)).replace("{total}", String(questions.length))}</strong>
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
        <p className="object-recognition-tip">{t("objectRecognitionTip")}</p>
      </div>

      <div className="object-question-card object-recognition-question-card">
        <div className="object-display">
          {displayQuestion.emoji}
        </div>

        <h2>{t("whatIsThis")}</h2>

        <div className="object-options">
          {displayQuestion.options.map(
            (option, index) => {
              let className =
                "object-option";

              if (answered) {
                if (
                  index === question.answer
                ) {
                  className += " correct";
                } else if (
                  index === selectedAnswer
                ) {
                  className += " incorrect";
                }
              }

              return (
                <button
                  key={option}
                  className={className}
                  onClick={() =>
                    handleAnswer(index)
                  }
                  disabled={answered}
                  aria-label={t("answerOption").replace("{option}", option)}
                >
                  {option}
                </button>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}

export default ObjectRecognition;
