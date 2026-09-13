const EXPRESSION_TO_MOOD = {
  happy: "happy",
  neutral: "neutral",
  sad: "sad",
  surprised: "okay",
  angry: "worried",
  fearful: "worried",
  disgusted: "worried",
};

export const expressionDisplayNames = {
  happy: "Happy",
  neutral: "Neutral",
  sad: "Sad",
  surprised: "Surprised",
  angry: "Angry",
  fearful: "Fearful",
  disgusted: "Disgusted",
};

// The expression model has seven labels while MINDSET-NER intentionally has
// five patient-friendly mood options. Scores that map to the same option are
// combined so the displayed confidence describes the saved mood.
export function mapExpressionsToMood(expressions) {
  const moodScores = {
    happy: 0,
    okay: 0,
    neutral: 0,
    worried: 0,
    sad: 0,
  };

  Object.entries(expressions || {}).forEach(([expression, score]) => {
    const mood = EXPRESSION_TO_MOOD[expression];
    if (mood) moodScores[mood] += Number(score) || 0;
  });

  const [moodId, confidence] = Object.entries(moodScores).reduce(
    (best, current) => (current[1] > best[1] ? current : best),
    ["neutral", 0],
  );

  return {
    moodId,
    confidence,
    moodScores,
  };
}
