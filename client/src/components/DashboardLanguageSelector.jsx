import { getUIText } from "../uiTranslations";

const options = [
  ["en-IN", "English"],
  ["hi-IN", "हिंदी"],
  ["te-IN", "తెలుగు"],
  ["as-IN", "অসমীয়া"],
  ["bn-IN", "বাংলা"],
  ["nag-IN", "Nagamese"],
];

export default function DashboardLanguageSelector({ language, onChange }) {
  return <label className="dashboard-language-selector">
    <span>{getUIText(language, "language")}</span>
    <select value={language} onChange={(event) => onChange(event.target.value)}>
      {options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
    </select>
  </label>;
}
