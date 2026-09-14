import { useEffect, useState } from "react";
import { API_URL } from "../api";
import { getUIText } from "../uiTranslations";

function PatientProfile({ onBack, language = "en-IN" }) {
  const t = (key) => getUIText(language, key);
  const genderLabel = (value) => {
    const key = String(value || "").toLowerCase();
    return ["female", "male", "other"].includes(key) ? t(key) : value;
  };

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "female",
    language: "English",
    caregiverName: "",
    caregiverPhone: "",
  });

  const storedUser = JSON.parse(
    localStorage.getItem("mindset_ner_user"),
  );

  const patientId = storedUser?.patientId;
  const token = localStorage.getItem("mindset_ner_token");

  const loadPatient = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/patients/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || t("failedToLoadProfile"),
        );
      }

      setPatient(data.patient);

      setForm({
        name: data.patient.name || "",
        age: data.patient.age || "",
        gender: data.patient.gender || "female",
        language: data.patient.language || "English",
        caregiverName: data.patient.caregiverName || "",
        caregiverPhone: data.patient.caregiverPhone || "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId && token) {
      loadPatient();
    } else {
      setError(t("patientAccountInformationMissing"));
      setLoading(false);
    }
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const updateProfile = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/patients/${patientId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            age: Number(form.age),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || t("failedToUpdateProfile"),
        );
      }

      setPatient(data.patient);
      setEditing(false);
      setMessage(t("profileUpdatedSuccessfully"));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        {t("loadingProfile")}
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="dashboard-container">
        <p className="error-message">
          {error || t("patientProfileNotFound")}
        </p>

        <button
          className="reminder-back-button"
          onClick={onBack}
        >
          ← {t("back")}
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">{t("patientAccount")}</p>

          <h1>{t("profile")}</h1>

          <p>
            {t("viewProfile")}
          </p>
        </div>

        <button
          className="reminder-back-button"
          onClick={onBack}
        >
          ← {t("back")}
        </button>
      </div>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!editing ? (
        <>
          <div className="profile-hero-card">
            <div className="profile-avatar">
              👤
            </div>

            <div>
              <p className="eyebrow">{t("patient")}</p>

              <h2>{patient.name}</h2>

              <p>
                {patient.age} {t("yearsOld")} •{" "}
                {genderLabel(patient.gender)}
              </p>
            </div>
          </div>

          <div className="profile-grid">
            <div className="profile-info-card">
              <span>🎂</span>
              <p className="eyebrow">{t("age")}</p>
              <h3>{patient.age} {t("years")}</h3>
            </div>

            <div className="profile-info-card">
              <span>⚧</span>
              <p className="eyebrow">{t("gender")}</p>
              <h3>{genderLabel(patient.gender)}</h3>
            </div>

            <div className="profile-info-card">
              <span>🌐</span>
              <p className="eyebrow">{t("language")}</p>
              <h3>{patient.language}</h3>
            </div>

            <div className="profile-info-card">
              <span>🧠</span>
              <p className="eyebrow">
                {t("cognitiveLevel")}
              </p>
              <h3>
                {t("level")} {patient.difficultyLevel}
              </h3>
            </div>
          </div>

          <div className="profile-caregiver-card">
            <p className="eyebrow">
              {t("caregiverInformation")}
            </p>

            <h2>{patient.caregiverName || t("notProvided")}</h2>

            <p>
              📞{" "}
              {patient.caregiverPhone ||
                t("phoneNumberNotProvided")}
            </p>
          </div>

          <div className="profile-status-card">
            <div>
              <p className="eyebrow">{t("accountStatus")}</p>

              <h2>
                {patient.isActive
                  ? `🟢 ${t("active")}`
                  : `🔴 ${t("inactive")}`}
              </h2>
            </div>

            <button
              className="start-button"
              onClick={() => {
                setMessage("");
                setError("");
                setEditing(true);
              }}
            >
              {t("editProfile")}
            </button>
          </div>
        </>
      ) : (
        <div className="profile-edit-card">
          <p className="eyebrow">{t("editProfile")}</p>

          <h2>{t("updatePatientInformation")}</h2>

          <form onSubmit={updateProfile}>
            <label>
              {t("name")}
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              {t("age")}
              <input
                type="number"
                name="age"
                min="1"
                max="120"
                value={form.age}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              {t("gender")}
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="female">{t("female")}</option>
                <option value="male">{t("male")}</option>
                <option value="other">{t("other")}</option>
              </select>
            </label>

            <label>
              {t("language")}
              <input
                name="language"
                value={form.language}
                onChange={handleChange}
              />
            </label>

            <label>
              {t("caregiverName")}
              <input
                name="caregiverName"
                value={form.caregiverName}
                onChange={handleChange}
              />
            </label>

            <label>
              {t("caregiverPhone")}
              <input
                name="caregiverPhone"
                value={form.caregiverPhone}
                onChange={handleChange}
              />
            </label>

            <div className="profile-actions">
              <button
                type="submit"
                className="start-button"
              >
                {t("saveChanges")}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() => setEditing(false)}
              >
                {t("cancel")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default PatientProfile;
