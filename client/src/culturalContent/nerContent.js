// Lightweight, offline-safe regional visual sets. These are neutral daily-life
// references found across parts of North-Eastern India; they do not identify
// any community, festival, or sacred tradition.
export const NER_MEMORY_CARDS = ["🍵", "🌾", "🧺", "🌿", "🏞️", "🏠", "🥬", "🌧️"];
export const NER_ATTENTION_SYMBOLS = ["🍵", "🌾", "🧺", "🌿", "🏞️", "🏠", "🥬"];
export const NER_PATTERN_SYMBOLS = ["🍵", "🌾", "🧺", "🌿"];

export const NER_OBJECTS = [
  { level: 1, emoji: "🍵", name: "Tea", options: ["Tea", "Water", "Milk", "Juice"], answer: 0 },
  { level: 2, emoji: "🌾", name: "Rice Crop", options: ["Rice Crop", "Flower", "Tree", "Grass"], answer: 0 },
  { level: 3, emoji: "🧺", name: "Basket", options: ["Basket", "Bottle", "Clock", "Spoon"], answer: 0 },
  { level: 4, emoji: "🥬", name: "Leafy vegetables", options: ["Leafy vegetables", "Mango", "Banana", "Orange"], answer: 0 },
  { level: 5, emoji: "🏞️", name: "River valley", options: ["River valley", "Road", "Building", "Station"], answer: 0 },
  { level: 1, emoji: "🌿", name: "Leaf", options: ["Leaf", "Flower", "Grass", "Tree"], answer: 0 },
  { level: 2, emoji: "🏠", name: "Home", options: ["Home", "School", "Market", "Hospital"], answer: 0 },
  { level: 3, emoji: "🌧️", name: "Rain", options: ["Rain", "Sun", "Wind", "Cloud"], answer: 0 },
  { level: 4, emoji: "🫖", name: "Teapot", options: ["Teapot", "Cup", "Bottle", "Plate"], answer: 0 },
  { level: 5, emoji: "🥭", name: "Mango", options: ["Mango", "Banana", "Orange", "Apple"], answer: 0 },
];

export const REGIONAL_MODE_TEXT = {
  "en-IN": { label: "Regional Mode", help: "North-Eastern familiar visuals" },
  "hi-IN": { label: "क्षेत्रीय मोड", help: "उत्तर-पूर्व के परिचित दृश्य" },
  "te-IN": { label: "ప్రాంతీయ మోడ్", help: "ఈశాన్య ప్రాంతానికి పరిచితమైన దృశ్యాలు" },
  "as-IN": { label: "আঞ্চলিক মোড", help: "উত্তৰ-পূবৰ চিনাকি দৃশ্য" },
  "bn-IN": { label: "আঞ্চলিক মোড", help: "উত্তর-পূর্বের পরিচিত দৃশ্য" },
  "nag-IN": { label: "Regional Mode", help: "North-East chinaki visuals" },
};

export const getRegionalModeText = (language) => REGIONAL_MODE_TEXT[language] || REGIONAL_MODE_TEXT["en-IN"];

export const NER_ROUTINE_QUESTIONS = [
  { question: "After morning tea, what can be part of a familiar daily routine?", options: ["Continue with morning tasks", "Go to bed for the night", "Have dinner", "Skip the whole day"], answer: 0 },
  { question: "When returning from a nearby market or garden, what is helpful to remember?", options: ["Keep belongings in their usual place", "Leave everything outside", "Skip water all day", "Go back to sleep"], answer: 0 },
];
