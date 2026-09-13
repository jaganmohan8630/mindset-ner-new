import { useEffect, useState } from "react";
import { API_URL } from "../api";
import { NER_MEMORY_CARDS } from "../culturalContent/nerContent";
const CARD_VALUES = ["🍚", "🥭", "🥥", "☕", "🌾", "🪔", "🥄", "🌿"];
const DIFFICULTY_PAIRS = {
  1: 3,
  2: 4,
  3: 5,
  4: 6,
  5: 8,
};

const OFFLINE_GAMES_KEY = "mindset_ner_offline_games";

function getOfflineGames() {
  try {
    return JSON.parse(localStorage.getItem(OFFLINE_GAMES_KEY)) || [];
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

  localStorage.setItem(OFFLINE_GAMES_KEY, JSON.stringify(games));
}

function clearOfflineGames(games) {
  localStorage.setItem(OFFLINE_GAMES_KEY, JSON.stringify(games));
}

function shuffleCards(numberOfPairs, regionalMode = false) {
  const selectedValues = (regionalMode ? NER_MEMORY_CARDS : CARD_VALUES).slice(0, numberOfPairs);

  const values = [...selectedValues, ...selectedValues];

  return values
    .sort(() => Math.random() - 0.5)
    .map((value, index) => ({
      id: index,
      value,
      matched: false,
    }));
}

function MemoryGame({ onBack, language = "en-IN", regionalMode = false }) {
  const isHindi = language === "hi-IN";
  const isTelugu = language === "te-IN";
  const isAssamese = language === "as-IN";
  const isBengali = language === "bn-IN";
  const isNagamese = language === "nag-IN";
  const text = isHindi
    ? {
        back: "वापस",
        eyebrow: "स्मृति गतिविधि",
        title: "मिलते-जुलते जोड़े खोजें",
        description:
          "आराम से खेलें। दो कार्ड पलटें और याद रखने की कोशिश करें कि हर चित्र कहाँ है।",
        moves: "चालें",
        level: "स्तर",
        progress: "खेल की प्रगति",
        pairsFound: "मिले हुए जोड़े",
        turnsTaken: "ली गई चालें",
        activityLevel: "गतिविधि स्तर",
        loading: "लोड हो रहा है",
        tip: "एक कार्ड चुनें, फिर उसका जोड़ा ढूँढने के लिए दूसरा कार्ड चुनें।",
        matchedCard: "मिलान किया हुआ कार्ड",
        selectedCard: "चुना गया कार्ड",
        faceDownCard: "बंद कार्ड",
        wonderful: "बहुत बढ़िया!",
        saving: "आपकी प्रगति सहेजी जा रही है...",
        playAgain: "फिर से खेलें",
      }
    : isTelugu
      ? {
          back: "వెనుకకు",
          eyebrow: "జ్ఞాపకశక్తి కార్యకలాపం",
          title: "సరిపోయే జతలను కనుగొనండి",
          description:
            "నెమ్మదిగా ఆడండి. రెండు కార్డులను తిప్పి, ప్రతి చిత్రం ఎక్కడ ఉందో గుర్తుంచుకోండి.",
          moves: "చలనాలు",
          level: "స్థాయి",
          progress: "ఆట పురోగతి",
          pairsFound: "కనుగొన్న జతలు",
          turnsTaken: "తీసుకున్న చలనాలు",
          activityLevel: "కార్యకలాప స్థాయి",
          loading: "లోడ్ అవుతోంది",
          tip: "ఒక కార్డును ఎంచుకుని, దాని జతను కనుగొనడానికి మరో కార్డును ఎంచుకోండి.",
          matchedCard: "సరిపోయిన కార్డు",
          selectedCard: "ఎంచుకున్న కార్డు",
          faceDownCard: "మూసి ఉన్న కార్డు",
          wonderful: "చాలా బాగా చేశారు!",
          saving: "మీ పురోగతి సేవ్ అవుతోంది...",
          playAgain: "మళ్లీ ఆడండి",
        }
      : isAssamese
        ? {
            back: "পিছলৈ",
            eyebrow: "স্মৃতি কাৰ্যকলাপ",
            title: "মিলা যোৰবোৰ বিচাৰি উলিয়াওক",
            description:
              "ধীৰে ধীৰে খেলক। দুখন কাৰ্ড উলটাওক আৰু প্ৰতিখন ছবি ক’ত আছে মনত ৰাখিবলৈ চেষ্টা কৰক।",
            moves: "চাল",
            level: "স্তৰ",
            progress: "খেলৰ অগ্ৰগতি",
            pairsFound: "পোৱা যোৰ",
            turnsTaken: "লোৱা চাল",
            activityLevel: "কাৰ্যকলাপৰ স্তৰ",
            loading: "লোড হৈ আছে",
            tip: "এখন কাৰ্ড বাছক, তাৰ পিছত মিল বিচাৰিবলৈ আন এখন কাৰ্ড বাছক।",
            matchedCard: "মিলা কাৰ্ড",
            selectedCard: "বাছনি কৰা কাৰ্ড",
            faceDownCard: "বন্ধ কাৰ্ড",
            wonderful: "খুব ভাল!",
            saving: "আপোনাৰ অগ্ৰগতি সংৰক্ষণ হৈ আছে...",
            playAgain: "আকৌ খেলক",
          }
        : isBengali
          ? {
              back: "ফিরে যান",
              eyebrow: "স্মৃতি কার্যক্রম",
              title: "মিল খুঁজে জোড়া তৈরি করুন",
              description:
                "ধীরে ধীরে খেলুন। দুটি কার্ড উল্টে দেখুন এবং প্রতিটি ছবি কোথায় আছে মনে রাখার চেষ্টা করুন।",
              moves: "চাল",
              level: "স্তর",
              progress: "খেলার অগ্রগতি",
              pairsFound: "পাওয়া জোড়া",
              turnsTaken: "নেওয়া চাল",
              activityLevel: "কার্যক্রমের স্তর",
              loading: "লোড হচ্ছে",
              tip: "একটি কার্ড বেছে নিন, তারপর তার মিল খুঁজতে আরেকটি কার্ড বেছে নিন।",
              matchedCard: "মিলেছে এমন কার্ড",
              selectedCard: "নির্বাচিত কার্ড",
              faceDownCard: "বন্ধ কার্ড",
              wonderful: "খুব ভালো!",
              saving: "আপনার অগ্রগতি সংরক্ষণ হচ্ছে...",
              playAgain: "আবার খেলুন",
            }
          : isNagamese
            ? {
                back: "Piche jai",
                eyebrow: "Memory activity",
                title: "Mil thaka jora bisari ulabo",
                description:
                  "Lahai lahai khelibo. Duta card ulatai aru sob picture kot ase monot rakhibo try koribo.",
                moves: "Chal",
                level: "Level",
                progress: "Game progress",
                pairsFound: "Puwa jora",
                turnsTaken: "Lua chal",
                activityLevel: "Activity level",
                loading: "Load hoi ase",
                tip: "Ekta card bachibo, pichete mil bisaribole aru ekta card bachibo.",
                matchedCard: "Mil card",
                selectedCard: "Bacha card",
                faceDownCard: "Bondho card",
                wonderful: "Besi bhal!",
                saving: "Apunar progress save hoi ase...",
                playAgain: "Abar khelibo",
              }
            : {
                back: "Back",
                eyebrow: "MEMORY ACTIVITY",
                title: "Find the matching pairs",
                description:
                  "Take your time. Turn over two cards and try to remember where each picture is.",
                moves: "Moves",
                level: "Level",
                progress: "Game progress",
                pairsFound: "Pairs found",
                turnsTaken: "Turns taken",
                activityLevel: "Activity level",
                loading: "Loading",
                tip: "Choose one card, then choose another card to look for its match.",
                matchedCard: "Matched card",
                selectedCard: "Selected card",
                faceDownCard: "Face-down card",
                wonderful: "Wonderful!",
                saving: "Saving your progress...",
                playAgain: "Play Again",
              };
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
  const syncOfflineGames = async () => {
    const offlineGames = getOfflineGames();

    if (offlineGames.length === 0) {
      return;
    }

    const remainingGames = [];

    for (const game of offlineGames) {
      try {
        const response = await fetch(`${API_URL}/api/games/sessions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...game,
            offlineId: undefined,
            playedOffline: true,
            synced: true,
          }),
        });

        if (!response.ok) {
          remainingGames.push(game);
        }
      } catch (error) {
        console.error("Offline sync failed:", error);
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
  useEffect(() => {
    const fetchDifficulty = async () => {
      try {
        const token = localStorage.getItem("mindset_ner_token");

        const response = await fetch(
          `${API_URL}/api/games/adaptive/${patientId}?gameType=memory`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

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
      } finally {
        setLoadingDifficulty(false);
      }
    };

    fetchDifficulty();
  }, []);

  const handleCardClick = (card) => {
    if (
      selectedCards.length === 2 ||
      card.matched ||
      selectedCards.some((selected) => selected.id === card.id)
    ) {
      return;
    }

    const newSelectedCards = [...selectedCards, card];

    setSelectedCards(newSelectedCards);

    if (newSelectedCards.length === 2) {
      setMoves((currentMoves) => currentMoves + 1);

      const [firstCard, secondCard] = newSelectedCards;

      if (firstCard.value === secondCard.value) {
        setCards((currentCards) =>
          currentCards.map((currentCard) =>
            currentCard.value === firstCard.value
              ? { ...currentCard, matched: true }
              : currentCard,
          ),
        );

        setSelectedCards([]);
      } else {
        setTimeout(() => {
          setSelectedCards([]);
        }, 800);
      }
    }
  };

  useEffect(() => {
    const allMatched = cards.length > 0 && cards.every((card) => card.matched);

    if (allMatched && !gameComplete) {
      setGameComplete(true);
    }
  }, [cards, gameComplete]);

  useEffect(() => {
    if (gameComplete) {
      saveGameSession();
    }
  }, [gameComplete]);

  const saveGameSession = async () => {
    try {
      setSaving(true);

      const totalPairs = DIFFICULTY_PAIRS[difficulty];

      const accuracy = 100;

      const efficiency = Math.max(
        0,
        Math.round((totalPairs / Math.max(moves, totalPairs)) * 100),
      );

      const score = Math.round((accuracy + efficiency) / 2);

      // Create the game data once so both online and offline
      // saving can use the same object.
      console.log("SAVING MEMORY GAME:", {
        difficulty,
        patientId,
      });
      const gameData = {
        patientId: patientId,
        gameType: "memory",
        difficulty,
        score,
        totalQuestions: totalPairs,
        correctAnswers: totalPairs,
        accuracy,
        averageResponseTime: 0,
      };

      console.log("SAVE GAME - navigator.onLine =", navigator.onLine);

      // If browser is offline, save directly to localStorage.
      if (!navigator.onLine) {
        saveOfflineGame({
          ...gameData,
          playedOffline: true,
          synced: false,
        });

        console.log("GAME SAVED LOCALLY");

        setSaveMessage(
          "Game saved offline. It will sync when internet returns.",
        );

        return;
      }

      // Try saving to the server.
      try {
        console.log("ONLINE MODE - trying server");

        const response = await fetch(`${API_URL}/api/games/sessions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("mindset_ner_token")}`,
          },
          body: JSON.stringify({
            ...gameData,
            playedOffline: false,
            synced: true,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to save game");
        }

        console.log("SERVER SAVE SUCCESS");

        setSaveMessage("Your progress has been saved.");
      } catch (serverError) {
        console.error("SERVER UNAVAILABLE:", serverError);

        // Server unavailable → save locally.
        saveOfflineGame({
          ...gameData,
          playedOffline: true,
          synced: false,
        });

        console.log("GAME SAVED LOCALLY BECAUSE SERVER IS UNAVAILABLE");

        setSaveMessage(
          "Game saved offline. It will sync when internet returns.",
        );
      }
    } catch (error) {
      console.error("Game save error:", error);

      setSaveMessage("Game completed, but progress could not be saved.");
    } finally {
      setSaving(false);
    }
  };
  const restartGame = async () => {
    try {
      setLoadingDifficulty(true);

      const token = localStorage.getItem("mindset_ner_token");

      const response = await fetch(
        `${API_URL}/api/games/adaptive/${patientId}?gameType=memory`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to get next difficulty");
      }

      const nextDifficulty = Math.min(
        Math.max(Number(data.recommendation.difficulty) || difficulty, 1),
        5,
      );

      console.log("NEXT MEMORY LEVEL:", nextDifficulty);

      setDifficulty(nextDifficulty);
      setCards(shuffleCards(DIFFICULTY_PAIRS[nextDifficulty], regionalMode));
      setSelectedCards([]);
      setMoves(0);
      setGameComplete(false);
      setSaveMessage("");
    } catch (error) {
      console.error("Failed to get next difficulty:", error);

      // Keep the current level only if the server cannot be reached.
      setCards(shuffleCards(DIFFICULTY_PAIRS[difficulty], regionalMode));
      setSelectedCards([]);
      setMoves(0);
      setGameComplete(false);
      setSaveMessage("");
    } finally {
      setLoadingDifficulty(false);
    }
  };

  return (
    <div className="game-page memory-game-page">
      <button className="back-button" onClick={onBack}>
        ← {text.back}
      </button>

      <div className="game-header memory-game-header">
        <p className="eyebrow">{text.eyebrow}</p>

        <h1>{text.title}</h1>

        <p>{text.description}</p>

        <div className="moves-counter">
          {text.moves}: <strong>{moves}</strong>
          {" • "}
          {text.level}:{" "}
          <strong>{loadingDifficulty ? "..." : difficulty}</strong>
        </div>

        <div className="memory-game-status" aria-label={text.progress}>
          <div>
            <span>{text.pairsFound}</span>
            <strong>
              {matchedPairs} of {DIFFICULTY_PAIRS[difficulty]}
            </strong>
          </div>
          <div>
            <span>{text.turnsTaken}</span>
            <strong>{moves}</strong>
          </div>
          <div>
            <span>{text.activityLevel}</span>
            <strong>{loadingDifficulty ? text.loading : difficulty}</strong>
          </div>
        </div>
        <p className="memory-game-tip">{text.tip}</p>
      </div>

      <div className={`memory-grid difficulty-${difficulty}`}>
        {cards.map((card) => {
          const isSelected = selectedCards.some(
            (selected) => selected.id === card.id,
          );

          const showValue = card.matched || isSelected;

          return (
            <button
              key={card.id}
              className={`memory-card ${
                showValue ? "memory-card-visible" : ""
              }`}
              onClick={() => handleCardClick(card)}
              disabled={card.matched}
              aria-label={
                card.matched
                  ? text.matchedCard
                  : showValue
                    ? `${text.selectedCard}: ${card.value}`
                    : text.faceDownCard
              }
            >
              {showValue ? card.value : "?"}
            </button>
          );
        })}
      </div>

      {gameComplete && (
        <div className="game-complete">
          <div className="success-icon">🎉</div>

          <h2>{text.wonderful}</h2>

          <p>
            {isHindi ? (
              <>
                आपने सभी जोड़े <strong>{moves}</strong> चालों में ढूँढ लिए।
              </>
            ) : isTelugu ? (
              <>
                మీరు అన్ని జతలను <strong>{moves}</strong> చలనాలలో కనుగొన్నారు.
              </>
            ) : isAssamese ? (
              <>
                আপুনি সকলো যোৰ <strong>{moves}</strong> চালত বিচাৰি উলিয়ালে।
              </>
            ) : isBengali ? (
              <>
                আপনি সব জোড়া <strong>{moves}</strong> চালে খুঁজে পেয়েছেন।
              </>
            ) : isNagamese ? (
              <>
                Apuni sob jora <strong>{moves}</strong> chal te bisari paishe.
              </>
            ) : (
              <>
                You found all the pairs in <strong>{moves}</strong> moves.
              </>
            )}
          </p>

          {saving && <p>{text.saving}</p>}

          {saveMessage && <p>{saveMessage}</p>}

          <button className="start-button" onClick={restartGame}>
            {text.playAgain}
          </button>
        </div>
      )}
    </div>
  );
}

export default MemoryGame;
