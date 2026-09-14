import { useEffect, useRef, useState } from "react";
import { API_URL } from "../api";
import { NER_ATTENTION_SYMBOLS } from "../culturalContent/nerContent";
import { getUIText } from "../uiTranslations";

const LEVEL_CONFIG = { 1: { rounds: 5, choices: 4, timeLimit: 10 }, 2: { rounds: 7, choices: 4, timeLimit: 7 }, 3: { rounds: 9, choices: 5, timeLimit: 6 }, 4: { rounds: 11, choices: 6, timeLimit: 5 }, 5: { rounds: 13, choices: 6, timeLimit: 4 } };
const OPTIONS = ["🍚", "🥭", "🥥", "☕", "🌾", "🪔", "🥄"];
const OFFLINE_ATTENTION_KEY = "mindset_ner_offline_attention_games";

function getOfflineAttentionGames() {
  try { return JSON.parse(localStorage.getItem(OFFLINE_ATTENTION_KEY)) || []; }
  catch { return []; }
}
function saveOfflineAttentionGame(game) {
  const games = getOfflineAttentionGames();
  games.push({ ...game, offlineId: Date.now() });
  localStorage.setItem(OFFLINE_ATTENTION_KEY, JSON.stringify(games));
}
function clearOfflineAttentionGames(games) { localStorage.setItem(OFFLINE_ATTENTION_KEY, JSON.stringify(games)); }

function AttentionGame({ onBack, language = "en-IN", regionalMode = false }) {
  const t = (key) => getUIText(language, key);
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
    if (offlineGames.length === 0) return;
    const remainingGames = [];
    for (const game of offlineGames) {
      try {
        const token = localStorage.getItem("mindset_ner_token");
        const response = await fetch(`${API_URL}/api/games/sessions`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ ...game, offlineId: undefined, playedOffline: true, synced: true }) });
        if (!response.ok) remainingGames.push(game);
      } catch (error) {
        console.error("Attention offline sync failed:", error);
        remainingGames.push(game);
      }
    }
    clearOfflineAttentionGames(remainingGames);
  };

  useEffect(() => {
    const handleOnline = () => { syncOfflineAttentionGames(); };
    window.addEventListener("online", handleOnline);
    if (navigator.onLine) syncOfflineAttentionGames();
    return () => { window.removeEventListener("online", handleOnline); };
  }, []);

  const generateRound = (level = difficulty) => {
    const config = LEVEL_CONFIG[level];
    const availableOptions = (regionalMode ? NER_ATTENTION_SYMBOLS : OPTIONS).slice(0, config.choices);
    const randomTarget = availableOptions[Math.floor(Math.random() * availableOptions.length)];
    const shuffled = [...availableOptions].sort(() => Math.random() - 0.5);
    setTarget(randomTarget);
    setOptions(shuffled);
    setTimeLeft(config.timeLimit);
    roundLocked.current = false;
  };

  const handleAnswer = (answer) => {
    if (roundLocked.current || gameComplete) return;
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
        const response = await fetch(`${API_URL}/api/games/adaptive/${patientId}?gameType=attention`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await response.json();
        let recommendedLevel = 1;
        if (data.success && data.recommendation?.difficulty) recommendedLevel = data.recommendation.difficulty;
        setDifficulty(recommendedLevel);
        generateRound(recommendedLevel);
      } catch (error) {
        console.error("Attention difficulty error:", error);
        setDifficulty(1);
        generateRound(1);
      } finally { setSaving(false); }
    };
    if (patientId) fetchDifficulty();
    else {
      generateRound(1);
      setSaving(false);
    }
  }, [patientId]);

  useEffect(() => {
    if (gameComplete || roundLocked.current) return;
    const interval = setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          clearInterval(interval);
          if (!roundLocked.current) handleAnswer(null);
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
      const gameData = { patientId, gameType: "attention", difficulty, score, totalQuestions: totalRounds, correctAnswers, accuracy, averageResponseTime: 0 };
      if (!navigator.onLine) {
        saveOfflineAttentionGame({ ...gameData, playedOffline: true, synced: false });
        setSaveMessage(t("gameSavedOffline"));
        return;
      }
      const token = localStorage.getItem("mindset_ner_token");
      try {
        const response = await fetch(`${API_URL}/api/games/sessions`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ ...gameData, playedOffline: false, synced: true }) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to save activity");
        setSaveMessage(t("progressSaved"));
      } catch (serverError) {
        console.error("Attention server save failed:", serverError);
        saveOfflineAttentionGame({ ...gameData, playedOffline: true, synced: false });
        setSaveMessage(t("gameSavedOffline"));
      }
    } catch (error) {
      console.error("Attention save error:", error);
      setSaveMessage(t("activityCompletedProgressNotSaved"));
    } finally { setSaving(false); }
  };

  useEffect(() => { if (gameComplete) saveGameSession(); }, [gameComplete]);

  const restartGame = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("mindset_ner_token");
      const response = await fetch(`${API_URL}/api/games/adaptive/${patientId}?gameType=attention`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      let nextDifficulty = difficulty;
      if (data.success && data.recommendation?.difficulty) nextDifficulty = data.recommendation.difficulty;
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
    } finally { setSaving(false); }
  };

  const currentConfig = LEVEL_CONFIG[difficulty];
  const summaryTemplate = t("attentionGameSummary");
  const [beforeRound, afterRound] = summaryTemplate.split("{round}");
  const [betweenRoundAndLevel, afterLevel] = afterRound.split("{level}");
  const [betweenLevelAndTime, afterTime] = afterLevel.split("{time}");
  const roundProgress = t("attentionRoundProgress").replace("{current}", String(round + 1)).replace("{total}", String(currentConfig.rounds));
  const answeredCorrectly = t("answeredCorrectly").replace("{correct}", String(correctAnswers)).replace("{total}", String(currentConfig.rounds));

  return <div className="game-page attention-game-page">
    <button className="back-button" onClick={onBack}>← {t("back")}</button>
    <div className="game-header attention-game-header">
      <p className="eyebrow">{t("attentionGameEyebrow")}</p>
      <h1>{t("attentionGameTitle")}</h1>
      <p>{t("attentionGameDescription")}</p>
      <div className="moves-counter">{beforeRound}<strong>{round}</strong>{betweenRoundAndLevel}<strong>{difficulty}</strong>{betweenLevelAndTime}<strong>{timeLeft}</strong>{afterTime}</div>
      <div className="attention-game-status" aria-label={t("attentionGameProgress")}>
        <div><span>{t("round")}</span><strong>{roundProgress}</strong></div>
        <div><span>{t("correctAnswers")}</span><strong>{correctAnswers}</strong></div>
        <div><span>{t("timeRemaining")}</span><strong>{timeLeft} {t("secondsRemaining")}</strong></div>
      </div>
      <p className="attention-game-tip">{t("attentionGameTip")}</p>
    </div>
    {!gameComplete ? <div className="attention-card attention-game-board">
      <p className="eyebrow">{t("targetLabel")}</p>
      <div className="attention-target">{target}</div>
      <p className="attention-timer">{timeLeft} {t("secondsRemaining")}</p>
      <div className="attention-options">
        {options.map((option, index) => <button key={`${option}-${index}`} className="attention-option" onClick={() => handleAnswer(option)} aria-label={t("chooseSymbol")}>{option}</button>)}
      </div>
    </div> : <div className="completion-card">
      <div className="completion-icon">🎉</div>
      <h2>{t("wellDone")}</h2>
      <p>{answeredCorrectly}</p>
      <p>{t("accuracy")}: {Math.round((correctAnswers / currentConfig.rounds) * 100)}%</p>
      <p>{t("attentionCompletedAt").replace("{level}", String(difficulty))}</p>
      {saving && <p>{t("savingProgress")}</p>}
      {saveMessage && <p>{saveMessage}</p>}
      <button className="start-button" onClick={restartGame}>{t("playAgain")}</button>
    </div>}
  </div>;
}

export default AttentionGame;
