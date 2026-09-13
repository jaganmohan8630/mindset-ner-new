import { useEffect, useRef, useState } from "react";
import { API_URL } from "../api";
import { getActivityText } from "../activityTranslations";
import { NER_ATTENTION_SYMBOLS } from "../culturalContent/nerContent";

const LEVEL_CONFIG = {
  1: {
    rounds: 5,
    choices: 4,
    timeLimit: 10,
  },
  2: {
    rounds: 7,
    choices: 4,
    timeLimit: 7,
  },
  3: {
    rounds: 9,
    choices: 5,
    timeLimit: 6,
  },
  4: {
    rounds: 11,
    choices: 6,
    timeLimit: 5,
  },
  5: {
    rounds: 13,
    choices: 6,
    timeLimit: 4,
  },
};

const OPTIONS = [
  "🍚", // Rice
  "🥭", // Mango
  "🥥", // Coconut
  "☕", // Tea
  "🌾", // Rice crop
  "🪔", // Lamp
  "🥄", // Spoon
];
const OFFLINE_ATTENTION_KEY = "mindset_ner_offline_attention_games";

function getOfflineAttentionGames() {
  try {
    return JSON.parse(localStorage.getItem(OFFLINE_ATTENTION_KEY)) || [];
  } catch {
    return [];
  }
}

function saveOfflineAttentionGame(game) {
  const games = getOfflineAttentionGames();

  games.push({
    ...game,
    offlineId: Date.now(),
  });

  localStorage.setItem(OFFLINE_ATTENTION_KEY, JSON.stringify(games));
}

function clearOfflineAttentionGames(games) {
  localStorage.setItem(OFFLINE_ATTENTION_KEY, JSON.stringify(games));
}

function AttentionGame({ onBack, language = "en-IN", regionalMode = false }) {
  const isHindi = language === "hi-IN";
  const isTelugu = language === "te-IN";
  const isAssamese = language === "as-IN";
  const isBengali = language === "bn-IN";
  const isNagamese = language === "nag-IN";
  const common = getActivityText(language);
  const text = isHindi
    ? { eyebrow: "ध्यान गतिविधि", title: "लक्ष्य पर ध्यान दें", description: "लक्ष्य चिन्ह को देखें और उसे जल्दी व सही चुनें।", round: "दौर", time: "समय", remaining: "शेष समय", tip: "नीचे लक्ष्य बॉक्स में दिखा वही चिन्ह खोजें।", target: "लक्ष्य", secondsRemaining: "सेकंड शेष", chooseSymbol: "यह चिन्ह चुनें", completedAt: "स्तर {level} पर पूरा हुआ" }
    : isTelugu
      ? { eyebrow: "శ్రద్ధ కార్యకలాపం", title: "లక్ష్యంపై దృష్టి పెట్టండి", description: "లక్ష్య చిహ్నాన్ని చూసి వీలైనంత త్వరగా, సరిగ్గా ఎంచుకోండి.", round: "రౌండ్", time: "సమయం", remaining: "మిగిలిన సమయం", tip: "క్రింది లక్ష్య పెట్టెలో చూపిన అదే చిహ్నాన్ని కనుగొనండి.", target: "లక్ష్యం", secondsRemaining: "సెకన్లు మిగిలి ఉన్నాయి", chooseSymbol: "ఈ చిహ్నాన్ని ఎంచుకోండి", completedAt: "స్థాయి {level} వద్ద పూర్తి చేశారు" }
      : isAssamese
        ? { eyebrow: "মনোযোগ কাৰ্যকলাপ", title: "লক্ষ্যত মনোযোগ দিয়ক", description: "লক্ষ্য চিহ্নটো চাওক আৰু যিমান পাৰি সোনকালে আৰু সঠিকভাৱে বাছক।", round: "পৰ্যায়", time: "সময়", remaining: "বাকী সময়", tip: "তলৰ লক্ষ্য বাকচত দেখুওৱা একে চিহ্নটো বিচাৰি উলিয়াওক।", target: "লক্ষ্য", secondsRemaining: "ছেকেণ্ড বাকী", chooseSymbol: "এই চিহ্নটো বাছক", completedAt: "স্তৰ {level} ত সম্পূৰ্ণ কৰিছে" }
        : isBengali
          ? { eyebrow: "মনোযোগ কার্যক্রম", title: "লক্ষ্যে মনোযোগ দিন", description: "লক্ষ্য চিহ্নটি দেখুন এবং যত দ্রুত ও সঠিকভাবে সম্ভব সেটি বেছে নিন।", round: "পর্ব", time: "সময়", remaining: "বাকি সময়", tip: "নিচের লক্ষ্য বাক্সে দেখানো একই চিহ্নটি খুঁজুন।", target: "লক্ষ্য", secondsRemaining: "সেকেন্ড বাকি", chooseSymbol: "এই চিহ্নটি বেছে নিন", completedAt: "স্তর {level} এ সম্পন্ন হয়েছে" }
          : isNagamese
            ? { eyebrow: "Attention activity", title: "Target te focus koribo", description: "Target symbol sai aru jiman jaldi aru thik paribo, bachibo.", round: "Round", time: "Time", remaining: "Baki time", tip: "Niche target box te dikhai thaka eku symbol bisaribo.", target: "TARGET", secondsRemaining: "seconds baki", chooseSymbol: "Etu symbol bachibo", completedAt: "Level {level} te complete hoise" }
            : { eyebrow: "ATTENTION ACTIVITY", title: "Focus on the target", description: "Look at the target symbol and select it as quickly and accurately as you can.", round: "Round", time: "Time", remaining: "Time remaining", tip: "Find the same symbol shown in the target box below.", target: "TARGET", secondsRemaining: "seconds remaining", chooseSymbol: "Choose this symbol", completedAt: "Completed at Level {level}" };
  const [difficulty, setDifficulty] = useState(1);
  const [round, setRound] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [target, setTarget] = useState("");
  const [options, setOptions] = useState([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(10);

  const roundLocked = useRef(false);

  const storedUser = JSON.parse(localStorage.getItem("mindset_ner_user"));

  const patientId = storedUser?.patientId;
  const syncOfflineAttentionGames = async () => {
    const offlineGames = getOfflineAttentionGames();

    if (offlineGames.length === 0) {
      return;
    }

    const remainingGames = [];

    for (const game of offlineGames) {
      try {
        const token = localStorage.getItem("mindset_ner_token");

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
        console.error("Attention offline sync failed:", error);

        remainingGames.push(game);
      }
    }

    clearOfflineAttentionGames(remainingGames);
  };

  useEffect(() => {
    const handleOnline = () => {
      syncOfflineAttentionGames();
    };

    window.addEventListener("online", handleOnline);

    if (navigator.onLine) {
      syncOfflineAttentionGames();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);
  const generateRound = (level = difficulty) => {
    const config = LEVEL_CONFIG[level];

    const availableOptions = (regionalMode ? NER_ATTENTION_SYMBOLS : OPTIONS).slice(0, config.choices);

    const randomTarget =
      availableOptions[Math.floor(Math.random() * availableOptions.length)];

    const shuffled = [...availableOptions].sort(() => Math.random() - 0.5);

    setTarget(randomTarget);
    setOptions(shuffled);
    setTimeLeft(config.timeLimit);
    roundLocked.current = false;
  };

  const handleAnswer = (answer) => {
    if (roundLocked.current || gameComplete) {
      return;
    }

    roundLocked.current = true;

    const isCorrect = answer === target;

    const nextCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0);

    setCorrectAnswers(nextCorrectAnswers);

    const totalRounds = LEVEL_CONFIG[difficulty].rounds;
    const nextRound = round + 1;

    setRound(nextRound);

    if (nextRound >= totalRounds) {
      setGameComplete(true);
      return;
    }

    generateRound();
  };

  useEffect(() => {
    const fetchDifficulty = async () => {
      try {
        const token = localStorage.getItem("mindset_ner_token");

        const response = await fetch(
          `${API_URL}/api/games/adaptive/${patientId}?gameType=attention`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        let recommendedLevel = 1;

        if (data.success && data.recommendation?.difficulty) {
          recommendedLevel = data.recommendation.difficulty;
        }

        setDifficulty(recommendedLevel);
        generateRound(recommendedLevel);
      } catch (error) {
        console.error("Attention difficulty error:", error);

        setDifficulty(1);
        generateRound(1);
      } finally {
        setSaving(false);
      }
    };

    if (patientId) {
      fetchDifficulty();
    } else {
      generateRound(1);
      setSaving(false);
    }
  }, [patientId]);

  useEffect(() => {
    if (gameComplete || roundLocked.current) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          clearInterval(interval);

          if (!roundLocked.current) {
            handleAnswer(null);
          }

          return 0;
        }

        return currentTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [round, difficulty, gameComplete]);

  const saveGameSession = async () => {
    try {
      setSaving(true);

      const totalRounds = LEVEL_CONFIG[difficulty].rounds;

      const accuracy = Math.round((correctAnswers / totalRounds) * 100);

      const score = accuracy;

      const gameData = {
        patientId,
        gameType: "attention",
        difficulty,
        score,
        totalQuestions: totalRounds,
        correctAnswers,
        accuracy,
        averageResponseTime: 0,
      };

      // No internet: save locally
      if (!navigator.onLine) {
        saveOfflineAttentionGame({
          ...gameData,
          playedOffline: true,
          synced: false,
        });

        setSaveMessage(
          "Game saved offline. It will sync when internet returns.",
        );

        return;
      }

      const token = localStorage.getItem("mindset_ner_token");

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
              ...gameData,
              playedOffline: false,
              synced: true,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to save activity");
        }

        setSaveMessage("Your progress has been saved.");
      } catch (serverError) {
        console.error("Attention server save failed:", serverError);

        saveOfflineAttentionGame({
          ...gameData,
          playedOffline: true,
          synced: false,
        });

        setSaveMessage(
          "Game saved offline. It will sync when internet returns.",
        );
      }
    } catch (error) {
      console.error("Attention save error:", error);

      setSaveMessage("Activity completed, but progress could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (gameComplete) {
      saveGameSession();
    }
  }, [gameComplete]);

  const restartGame = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem("mindset_ner_token");

      const response = await fetch(
        `${API_URL}/api/games/adaptive/${patientId}?gameType=attention`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      let nextDifficulty = difficulty;

      if (data.success && data.recommendation?.difficulty) {
        nextDifficulty = data.recommendation.difficulty;
      }

      setDifficulty(nextDifficulty);
      setRound(0);
      setCorrectAnswers(0);
      setGameComplete(false);
      setSaveMessage("");

      generateRound(nextDifficulty);
    } catch (error) {
      console.error("Failed to get next difficulty:", error);

      setRound(0);
      setCorrectAnswers(0);
      setGameComplete(false);
      setSaveMessage("");

      generateRound(difficulty);
    } finally {
      setSaving(false);
    }
  };

  const currentConfig = LEVEL_CONFIG[difficulty];

  return (
    <div className="game-page attention-game-page">
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>

      <div className="game-header attention-game-header">
        <p className="eyebrow">{text.eyebrow}</p>

        <h1>{text.title}</h1>

        <p>
          {text.description}
        </p>

        <div className="moves-counter">
          Round: <strong>{round}</strong> • Level <strong>{difficulty}</strong>{" "}
          • Time: <strong>{timeLeft}s</strong>
        </div>
        <div className="attention-game-status" aria-label="Game progress">
          <div>
            <span>Round</span>
            <strong>{round + 1} of {currentConfig.rounds}</strong>
          </div>
          <div>
            <span>{common.correctAnswers}</span>
            <strong>{correctAnswers}</strong>
          </div>
          <div>
            <span>{text.remaining}</span>
            <strong>{timeLeft} {isHindi ? "सेकंड" : isTelugu ? "సెకన్లు" : isAssamese ? "ছেকেণ্ড" : isBengali ? "সেকেন্ড" : "seconds"}</strong>
          </div>
        </div>
        <p className="attention-game-tip">{text.tip}</p>
      </div>

      {!gameComplete ? (
        <div className="attention-card attention-game-board">
          <p className="eyebrow">{text.target}</p>

          <div className="attention-target">{target}</div>

          <p className="attention-timer">{timeLeft} {text.secondsRemaining}</p>

          <div className="attention-options">
            {options.map((option, index) => (
              <button
                key={`${option}-${index}`}
                className="attention-option"
                onClick={() => handleAnswer(option)}
                aria-label={text.chooseSymbol}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="completion-card">
          <div className="completion-icon">🎉</div>

          <h2>{common.wellDone}</h2>

          <p>
            You answered {correctAnswers} out of {currentConfig.rounds}{" "}
            correctly.
          </p>

          <p>
            {common.accuracy}:{" "}
            {Math.round((correctAnswers / currentConfig.rounds) * 100)}%
          </p>

          <p>{text.completedAt.replace("{level}", difficulty)}</p>

          {saving && <p>{common.saving}</p>}

          {saveMessage && <p>{saveMessage}</p>}

          <button className="start-button" onClick={restartGame}>
            {common.playAgain}
          </button>
        </div>
      )}
    </div>
  );
}

export default AttentionGame;
