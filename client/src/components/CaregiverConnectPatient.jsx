import { useState } from "react";
import { API_URL } from "../api";
import { caregiverText } from "../caregiverTranslations";

function CaregiverConnectPatient({ onBack, language = "en-IN" }) {
  const t = (key) => caregiverText(language, key);
  const [patientId, setPatientId] = useState("");
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("mindset_ner_token");

  const searchPatient = async () => {
    if (!patientId.trim()) {
      setError("Please enter a Patient ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");
      setPatient(null);

      const response = await fetch(
        `${API_URL}/api/connections/search-patient/${patientId.trim()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Patient not found");
      }

      setPatient(data.patient);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/connections/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            patientId: patient._id,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send connection request");
      }

      setMessage("Connection request sent successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="connect-patient-page">
      <main className="connect-patient-shell">
        <button className="connect-back-button" onClick={onBack}>
          <span aria-hidden="true">←</span> {t("back")}
        </button>

        <section className="connect-patient-hero">
          <div className="connect-hero-icon" aria-hidden="true">♧</div>
          <p className="connect-eyebrow">{t("caregiverTools").toUpperCase()}</p>
          <h1>{t("connectPatient")}</h1>
          <p>{t("connectPatientHelp")}</p>
        </section>

        <section className="connect-workspace" aria-label="Patient connection">
          <div className="connect-search-card">
            <div className="connect-card-heading">
              <span className="connect-step">1</span>
              <div><h2>{t("findPatient")}</h2><p>{t("findPatientHelp")}</p></div>
            </div>
            <label htmlFor="patientId">{t("patientCode")}</label>
            <div className="connect-search-row">
              <input
                id="patientId"
                type="text"
                value={patientId}
                onChange={(event) => setPatientId(event.target.value)}
                onKeyDown={(event) => { if (event.key === "Enter") searchPatient(); }}
                placeholder="e.g. PAT-12345"
                autoComplete="off"
              />
              <button onClick={searchPatient} disabled={loading}>{loading ? t("searching") : t("searchPatient")}</button>
            </div>
            <p className="connect-help">{t("privacyHelp")}</p>
          </div>

          {error && <p className="connect-message connect-error" role="alert">{error}</p>}
          {message && <p className="connect-message connect-success" role="status">{message}</p>}

          {patient ? (
            <article className="connect-result-card">
              <div className="connect-card-heading">
                <span className="connect-step">2</span>
                <div><p className="connect-result-label">{t("patientFound").toUpperCase()}</p><h2>{patient.name}</h2></div>
                {patient.isActive && <span className="connect-active">{t("active")}</span>}
              </div>
              <dl className="connect-patient-details">
                <div><dt>{t("patientCode")}</dt><dd>{patient.patientCode}</dd></div>
                <div><dt>{t("age")}</dt><dd>{patient.age || t("notProvided")}</dd></div>
                <div><dt>{t("gender")}</dt><dd>{patient.gender || t("notProvided")}</dd></div>
                <div><dt>{t("language")}</dt><dd>{patient.language || t("notProvided")}</dd></div>
              </dl>
              <button className="connect-request-button" onClick={sendRequest} disabled={loading || Boolean(message)}>
                <span aria-hidden="true">♧</span>{message ? t("requestSent") : t("sendConnectionRequest")}
              </button>
            </article>
          ) : (
            <aside className="connect-empty-card">
              <span aria-hidden="true">⌕</span>
              <div><strong>{t("searchResultHere")}</strong><p>{t("verifyPatient")}</p></div>
            </aside>
          )}
        </section>

        <footer className="connect-security-note">
          <span aria-hidden="true">♢</span>
          <p><strong>{t("privateSecure")}</strong> {t("privateSecureHelp")}</p>
        </footer>
      </main>
    </div>
  );
}

export default CaregiverConnectPatient;
