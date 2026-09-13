import { useEffect, useState } from "react";
import { API_URL } from "../api";

function AdminPatientLink({ onBack }) {
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
          caregiverData.message || "Failed to load caregivers",
        );
      }

      if (!patientResponse.ok) {
        throw new Error(
          patientData.message || "Failed to load patients",
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
      setError("Please select both a caregiver and a patient.");
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
          data.message || "Failed to link patient",
        );
      }

      setMessage("Patient linked to caregiver successfully.");

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
          <h1>Loading management panel...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="welcome-card">
        <p className="eyebrow">ADMIN MANAGEMENT</p>

        <h1>Caregiver & Patient Linking</h1>

        <p className="welcome-text">
          Assign a patient to the caregiver responsible for their care.
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
              Select Caregiver
            </label>

            <select
              id="caregiver"
              value={caregiverId}
              onChange={(event) =>
                setCaregiverId(event.target.value)
              }
            >
              <option value="">
                Choose caregiver
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
              Select Patient
            </label>

            <select
              id="patient"
              value={patientId}
              onChange={(event) =>
                setPatientId(event.target.value)
              }
            >
              <option value="">
                Choose patient
              </option>

              {patients.map((patient) => (
                <option
                  key={patient._id}
                  value={patient._id}
                >
                  {patient.name} — Age {patient.age}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="start-button"
            disabled={saving}
          >
            {saving ? "Linking..." : "Link Patient"}
          </button>
        </form>

        <button
          className="secondary-button"
          onClick={onBack}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default AdminPatientLink;
