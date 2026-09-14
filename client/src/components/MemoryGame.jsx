import { useEffect, useState } from "react";
import { API_URL } from "../api";
import { NER_MEMORY_CARDS } from "../culturalContent/nerContent";
import { getUIText } from "../uiTranslations";

const CARD_VALUES = ["🍚", "🥭", "🥥", "☕", "🌾", "🪔", "🥄", "🌿"];
const DIFFICULTY_PAIRS = { 1: 3, 2: 4, 3: 5, 4: 6, 5: 8 };
const OFFLINE_GAMES_KEY = "mindset_ner_offline_games";

function getOfflineGames() {
  try { return JSON.parse(localStorage.getItem(OFFLINE_GAMES_KEY)) || []; }
  catch { return []; }
}
function saveOfflineGame(game) {
  const games = getOfflineGames();
  games.push({ ...game, offlineId: Date.now() });
  localStorage.setItem(OFFLINE_GAMES_KEY, JSON.stringify(games));
}
function clearOfflineGames(games) { localStorage.setItem(OFFLINE_GAMES_KEY, JSON.stringify(games)); }
function shuffleCards(numberOfPairs, regionalMode = false) {
  const selectedValues = (regionalMode ? NER_MEMORY_CARDS : CARD_VALUES).slice(0, numberOfPairs);
  const values = [...selectedValues, ...selectedValues];
  return values.sort(() => Math.random() - 0.5).map((value, index) => ({ id: index, value, matched: false }));
}

function MemoryGame({ onBack, language = "en-IN", regionalMode = false }) {
  const t = (key) => getUIText(language, key);
  const storedUser = JSON.parse(localStorage.getItem("mindset_ner_user"));
  const patientId = storedUser?.patientId;
  const [difficulty, setDifficulty] = useState(1);
  const [loadingDifficulty, setLoadingDifficulty] = useState(true);
  const [cards, setCards] = useState(() => shuffleCards(DIFFICULTY_PAIRS[1], regionalMode));
  const [selectedCards, setSelectedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const matchedPairs = cards.filter((card) => card.matched).length / 2;
  const completionText = t("foundAllPairsInMoves").split("{moves}");

  const syncOfflineGames = async () => {
    const offlineGames = getOfflineGames();
    if (offlineGames.length === 0) return;
    const remainingGames = [];
    for (const game of offlineGames) {
      try {
        const response = await fetch(`${API_URL}/api/games/sessions`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...game, offlineId: undefined, playedOffline: true, synced: true }) });
        if (!response.ok) remainingGames.push(game);
      } catch (error) {
        console.error("Offline sync failed:", error);
        remainingGames.push(game);
      }
    }
    clearOfflineGames(remainingGames);
  };

  useEffect(() => {
    const handleOnline = () => { syncOfflineGames(); };
    window.addEventListener("online", handleOnline);
    if (navigator.onLine) syncOfflineGames();
    return () => { window.removeEventListener("online", handleOnline); };
  }, []);

  useEffect(() => {
    const fetchDifficulty = async () => {
      try {
        const token = localStorage.getItem("mindset_ner_token");
        const response = await fetch(`${API_URL}/api/games/adaptive/${patientId}?gameType=memory`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await response.json();
        if (data.success) {
          const recommendedLevel = data.recommendation.difficulty;
          setDifficulty(recommendedLevel);
          setCards(shuffleCards(DIFFICULTY_PAIRS[recommendedLevel], regionalMode));
        }
      } catch (error) {
        console.error("Difficulty fetch error:", error);
        setDifficulty(1);
        setCards(shuffleCards(DIFFICULTY_PAIRS[1], regionalMode));
      } finally { setLoadingDifficulty(false); }
    };
    fetchDifficulty();
  }, []);

  const handleCardClick = (card) => {
    if (selectedCards.length === 2 || card.matched || selectedCards.some((selected) => selected.id === card.id)) return;
    const newSelectedCards = [...selectedCards, card];
    setSelectedCards(newSelectedCards);
    if (newSelectedCards.length === 2) {
      setMoves((currentMoves) => currentMoves + 1);
      const [firstCard, secondCard] = newSelectedCards;
      if (firstCard.value === secondCard.value) {
        setCards((currentCards) => currentCards.map((currentCard) => currentCard.value === firstCard.value ? { ...currentCard, matched: true } : currentCard));
        setSelectedCards([]);
      } else setTimeout(() => { setSelectedCards([]); }, 800);
    }
  };

  useEffect(() => {
    const allMatched = cards.length > 0 && cards.every((card) => card.matched);
    if (allMatched && !gameComplete) setGameComplete(true);
  }, [cards, gameComplete]);
  useEffect(() => { if (gameComplete) saveGameSession(); }, [gameComplete]);

  const saveGameSession = async () => {
    try {
      setSaving(true);
      const totalPairs = DIFFICULTY_PAIRS[difficulty];
      const accuracy = 100;
      const efficiency = Math.max(0, Math.round((totalPairs / Math.max(moves, totalPairs)) * 100));
      const score = Math.round((accuracy + efficiency) / 2);
      console.log("SAVING MEMORY GAME:", { difficulty, patientId });
      const gameData = { patientId, gameType: "memory", difficulty, score, totalQuestions: totalPairs, correctAnswers: totalPairs, accuracy, averageResponseTime: 0 };
      console.log("SAVE GAME - navigator.onLine =", navigator.onLine);
      if (!navigator.onLine) {
        saveOfflineGame({ ...gameData, playedOffline: true, synced: false });
        console.log("GAME SAVED LOCALLY");
        setSaveMessage(t("gameSavedOffline"));
        return;
      }
      try {
        console.log("ONLINE MODE - trying server");
        const response = await fetch(`${API_URL}/api/games/sessions`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("mindset_ner_token")}` }, body: JSON.stringify({ ...gameData, playedOffline: false, synced: true }) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to save game");
        console.log("SERVER SAVE SUCCESS");
        setSaveMessage(t("progressSaved"));
      } catch (serverError) {
        console.error("SERVER UNAVAILABLE:", serverError);
        saveOfflineGame({ ...gameData, playedOffline: true, synced: false });
        console.log("GAME SAVED LOCALLY BECAUSE SERVER IS UNAVAILABLE");
        setSaveMessage(t("gameSavedOffline"));
      }
    } catch (error) {
      console.error("Game save error:", error);
      setSaveMessage(t("gameCompletedProgressNotSaved"));
    } finally { setSaving(false); }
  };

  const restartGame = async () => {
    try {
      setLoadingDifficulty(true);
      const token = localStorage.getItem("mindset_ner_token");
      const response = await fetch(`${API_URL}/api/games/adaptive/${patientId}?gameType=memory`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Failed to get next difficulty");
      const nextDifficulty = Math.min(Math.max(Number(data.recommendation.difficulty) || difficulty, 1), 5);
      console.log("NEXT MEMORY LEVEL:", nextDifficulty);
      setDifficulty(nextDifficulty);
      setCards(shuffleCards(DIFFICULTY_PAIRS[nextDifficulty], regionalMode));
      setSelectedCards([]);
      setMoves(0);
      setGameComplete(false);
      setSaveMessage("");
    } catch (error) {
      console.error("Failed to get next difficulty:", error);
      setCards(shuffleCards(DIFFICULTY_PAIRS[difficulty], regionalMode));
      setSelectedCards([]);
      setMoves(0);
      setGameComplete(false);
      setSaveMessage("");
    } finally { setLoadingDifficulty(false); }
  };

  return <div className="game-page memory-game-page">
    <button className="back-button" onClick={onBack}>← {t("back")}</button>
    <div className="game-header memory-game-header">
      <p className="eyebrow">{t("memoryGameEyebrow")}</p>
      <h1>{t("memoryGameTitle")}</h1>
      <p>{t("memoryGameDescription")}</p>
      <div className="moves-counter">{t("moves")}: <strong>{moves}</strong>{" • "}{t("level")}: <strong>{loadingDifficulty ? "..." : difficulty}</strong></div>
      <div className="memory-game-status" aria-label={t("memoryGameProgress")}>
        <div><span>{t("pairsFound")}</span><strong>{t("pairsProgress").replace("{found}", String(matchedPairs)).replace("{total}", String(DIFFICULTY_PAIRS[difficulty]))}</strong></div>
        <div><span>{t("turnsTaken")}</span><strong>{moves}</strong></div>
        <div><span>{t("activityLevel")}</span><strong>{loadingDifficulty ? t("loading") : difficulty}</strong></div>
      </div>
      <p className="memory-game-tip">{t("memoryGameTip")}</p>
    </div>
    <div className={`memory-grid difficulty-${difficulty}`}>
      {cards.map((card) => {
        const isSelected = selectedCards.some((selected) => selected.id === card.id);
        const showValue = card.matched || isSelected;
        return <button key={card.id} className={`memory-card ${showValue ? "memory-card-visible" : ""}`} onClick={() => handleCardClick(card)} disabled={card.matched} aria-label={card.matched ? t("matchedCard") : showValue ? `${t("selectedCard")}: ${card.value}` : t("faceDownCard")}>
          {showValue ? card.value : "?"}
        </button>;
      })}
    </div>
    {gameComplete && <div className="game-complete">
      <div className="success-icon">🎉</div>
      <h2>{t("wonderful")}</h2>
      <p>{completionText[0]}<strong>{moves}</strong>{completionText[1]}</p>
      {saving && <p>{t("savingProgress")}</p>}
      {saveMessage && <p>{saveMessage}</p>}
      <button className="start-button" onClick={restartGame}>{t("playAgain")}</button>
    </div>}
  </div>;
}

export default MemoryGame;
