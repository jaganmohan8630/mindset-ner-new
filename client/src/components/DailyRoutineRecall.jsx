import { useEffect, useState } from "react";
import { API_URL } from "../api";
import { assameseRoutineQuestions, bengaliRoutineQuestions, hindiRoutineQuestions, nagameseRoutineQuestions, teluguRoutineQuestions } from "../activityTranslations";
import { NER_ROUTINE_QUESTIONS } from "../culturalContent/nerContent";

function DailyRoutineRecall({ onBack, language = "en-IN", regionalMode = false }) {
  const isHindi = language === "hi-IN";
  const isTelugu = language === "te-IN";
  const isAssamese = language === "as-IN";
  const isBengali = language === "bn-IN";
  const isNagamese = language === "nag-IN";
  const text = isTelugu
    ? { eyebrow: "రోజువారీ దినచర్య గుర్తింపు", title: "మీ దినచర్యను గుర్తు చేసుకోండి", preparing: "మీ కార్యకలాపం సిద్ధమవుతోంది...", description: "మీ సాధారణ రోజువారీ పనుల గురించి ఆలోచించి సరైన సమాధానాన్ని ఎంచుకోండి.", question: "ప్రశ్న", correct: "సరైన సమాధానాలు", level: "కార్యకలాప స్థాయి", tip: "ప్రతి ఎంపికను జాగ్రత్తగా చదివి సరైన సమాధానాన్ని ఎంచుకోండి." }
    : isAssamese ? { eyebrow: "দৈনন্দিন দিনচৰ্যা মনত পেলোৱা", title: "আপোনাৰ দিনচৰ্যা মনত পেলাওক", preparing: "আপোনাৰ কাৰ্যকলাপ প্ৰস্তুত হৈ আছে...", description: "আপোনাৰ দৈনন্দিন কামবোৰৰ বিষয়ে ভাবক আৰু সঠিক উত্তৰ বাছক।", question: "প্ৰশ্ন", correct: "সঠিক উত্তৰ", level: "কাৰ্যকলাপৰ স্তৰ", tip: "প্ৰতিটো বিকল্প মনোযোগেৰে পঢ়ক আৰু সঠিক উত্তৰ বাছক।" }
    : isBengali ? { eyebrow: "দৈনন্দিন রুটিন স্মরণ", title: "আপনার রুটিন মনে করুন", preparing: "আপনার কার্যক্রম প্রস্তুত হচ্ছে...", description: "আপনার দৈনন্দিন কাজের কথা ভাবুন এবং সঠিক উত্তরটি বেছে নিন।", question: "প্রশ্ন", correct: "সঠিক উত্তর", level: "কার্যক্রমের স্তর", tip: "প্রতিটি বিকল্প মনোযোগ দিয়ে পড়ুন এবং সঠিক উত্তরটি বেছে নিন।" }
    : isNagamese ? { eyebrow: "Daily routine recall", title: "Apunar routine monot anibo", preparing: "Apunar activity ready kori ase...", description: "Apunar roj kaam khan bhabi aru thik answer bachibo.", question: "Question", correct: "Thik answer", level: "Activity level", tip: "Protek option bhal porhi aru thik answer bachibo." } : null;
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

    const activeQuestionBank = regionalMode && language === "en-IN" ? [...questionBank, ...NER_ROUTINE_QUESTIONS] : questionBank;
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
          <p className="eyebrow">{text?.eyebrow || (isHindi ? "दैनिक दिनचर्या" : "DAILY ROUTINE")}</p>

          <h1>{text?.preparing || (isHindi ? "आपकी गतिविधि तैयार की जा रही है..." : "Preparing your activity...")}</h1>
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
          <p className="eyebrow">DAILY ROUTINE RECALL</p>

          <h1>Well done!</h1>

          <p>You completed today's routine recall activity.</p>
        </div>

        <div className="routine-recall-card">
          {" "}
          <h2>Activity Complete</h2>
          <p>
            Score: <strong>{score}</strong>
          </p>
          <p>
            Correct answers:{" "}
            <strong>
              {correctAnswers} / {questions.length}
            </strong>
          </p>
          <p>
            Accuracy: <strong>{accuracy}%</strong>
          </p>
          <p>
            Difficulty: <strong>Level {difficulty}</strong>
          </p>
          <button className="start-button" onClick={onBack}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const localizedQuestions = isHindi ? hindiRoutineQuestions : isTelugu ? teluguRoutineQuestions : isAssamese ? assameseRoutineQuestions : isBengali ? bengaliRoutineQuestions : isNagamese ? nagameseRoutineQuestions : null;
  const displayQuestion = localizedQuestions?.[currentQuestion]
    ? { ...question, question: localizedQuestions[currentQuestion][0], options: localizedQuestions[currentQuestion][1] }
    : question;

  if (!question) {
    return null;
  }

  return (
    <div className="game-page routine-recall-game-page">
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>

      <div className="game-header routine-recall-game-header">
        <p className="eyebrow">{text?.eyebrow || (isHindi ? "दैनिक दिनचर्या स्मरण" : "DAILY ROUTINE RECALL")}</p>

        <h1>{text?.title || (isHindi ? "अपनी दिनचर्या याद करें" : "Remember your routine")}</h1>

        <p>
          {text?.description || (isHindi ? "अपनी रोज़ की गतिविधियों के बारे में सोचें और सबसे अच्छा उत्तर चुनें।" : "Think about your usual daily activities and choose the best answer.")}
        </p>

        <p>
          {text?.question || (isHindi ? "प्रश्न" : "Question")} {currentQuestion + 1} {(isHindi || isTelugu) ? "/" : "of"} {questions.length}
        </p>
        <div className="routine-recall-status" aria-label="Activity progress">
          <div>
            <span>{text?.question || "Question"}</span>
            <strong>{currentQuestion + 1} {(isHindi || isTelugu) ? "/" : "of"} {questions.length}</strong>
          </div>
          <div>
            <span>{text?.correct || (isHindi ? "सही उत्तर" : "Correct answers")}</span>
            <strong>{correctAnswers}</strong>
          </div>
          <div>
            <span>{text?.level || (isHindi ? "गतिविधि स्तर" : "Activity level")}</span>
            <strong>{difficulty}</strong>
          </div>
        </div>
        <p className="routine-recall-tip">{text?.tip || (isHindi ? "हर विकल्प को ध्यान से पढ़ें और सही उत्तर चुनें।" : "Read each choice carefully, then select the answer that feels right.")}</p>
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

export default DailyRoutineRecall;
