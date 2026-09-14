import { useEffect, useState } from "react";
import { API_URL } from "../api";
import { getUIText } from "../uiTranslations";

function AdminPatientLink({ onBack, language = "en-IN" }) {
  const t = (key) => getUIText(language, key);
  const [caregivers, setCaregivers] = useState([]);
  const [patients, setPatients] = useState([]);

  const [caregiverId, setCaregiverId] = useState("");
  const [patientId, setPatientId] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("mindset_ner_token");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [caregiverResponse, patientResponse] = await Promise.all([
        fetch(`${API_URL}/api/auth/caregivers`, {
          headers,
        }),
        fetch(`${API_URL}/api/patients`, {
          headers,
        }),
      ]);

      const caregiverData = await caregiverResponse.json();
      const patientData = await patientResponse.json();

      if (!caregiverResponse.ok) {
        throw new Error(
          caregiverData.message || t("failedToLoadCaregivers"),
        );
      }

      if (!patientResponse.ok) {
        throw new Error(
          patientData.message || t("failedToLoadPatients"),
        );
      }

      setCaregivers(caregiverData.caregivers || []);
      setPatients(patientData.patients || []);
    } catch (err) {
      console.error("Failed to load admin data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const linkPatient = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!caregiverId || !patientId) {
      setError(t("selectCaregiverAndPatient"));
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/auth/link-patient`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            caregiverId,
            patientId,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || t("failedToLinkPatient"),
        );
      }

      setMessage(t("patientLinkedSuccessfully"));

      setCaregivers((current) =>
        current.map((caregiver) =>
          caregiver._id === caregiverId
            ? { ...caregiver, patientId }
            : caregiver,
        ),
      );
    } catch (err) {
      console.error("Failed to link patient:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="welcome-card">
          <h1>{t("loadingManagementPanel")}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="welcome-card">
        <p className="eyebrow">{t("adminManagement")}</p>

        <h1>{t("caregiverPatientLinking")}</h1>

        <p className="welcome-text">
          {t("assignPatientToCaregiver")}
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        <form onSubmit={linkPatient}>
          <div className="form-group">
            <label htmlFor="caregiver">
              {t("selectCaregiver")}
            </label>

            <select
              id="caregiver"
              value={caregiverId}
              onChange={(event) =>
                setCaregiverId(event.target.value)
              }
            >
              <option value="">
                {t("chooseCaregiver")}
              </option>

              {caregivers.map((caregiver) => (
                <option
                  key={caregiver._id}
                  value={caregiver._id}
                >
                  {caregiver.name} ({caregiver.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="patient">
              {t("selectPatient")}
            </label>

            <select
              id="patient"
              value={patientId}
              onChange={(event) =>
                setPatientId(event.target.value)
              }
            >
              <option value="">
                {t("choosePatient")}
              </option>

              {patients.map((patient) => (
                <option
                  key={patient._id}
                  value={patient._id}
                >
                  {patient.name} — {t("age")} {patient.age}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="start-button"
            disabled={saving}
          >
            {saving ? t("linking") : t("linkPatient")}
          </button>
        </form>

        <button
          className="secondary-button"
          onClick={onBack}
        >
          {t("back")}
        </button>
      </div>
    </div>
  );
}

export default AdminPatientLink;
