import { useEffect, useState } from "react";
import { API_URL } from "../api";
function PatientProfile({ onBack }) {
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
          data.message || "Failed to load patient profile",
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
      setError("Patient account information is missing.");
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
          data.message || "Failed to update profile",
        );
      }

      setPatient(data.patient);
      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        Loading profile...
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="dashboard-container">
        <p className="error-message">
          {error || "Patient profile not found."}
        </p>

        <button
          className="reminder-back-button"
          onClick={onBack}
        >
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">PATIENT ACCOUNT</p>

          <h1>My Profile</h1>

          <p>
            View and manage your personal information.
          </p>
        </div>

        <button
          className="reminder-back-button"
          onClick={onBack}
        >
          ← Back
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
              <p className="eyebrow">PATIENT</p>

              <h2>{patient.name}</h2>

              <p>
                {patient.age} years old •{" "}
                {patient.gender}
              </p>
            </div>
          </div>

          <div className="profile-grid">
            <div className="profile-info-card">
              <span>🎂</span>
              <p className="eyebrow">AGE</p>
              <h3>{patient.age} years</h3>
            </div>

            <div className="profile-info-card">
              <span>⚧</span>
              <p className="eyebrow">GENDER</p>
              <h3>{patient.gender}</h3>
            </div>

            <div className="profile-info-card">
              <span>🌐</span>
              <p className="eyebrow">LANGUAGE</p>
              <h3>{patient.language}</h3>
            </div>

            <div className="profile-info-card">
              <span>🧠</span>
              <p className="eyebrow">
                COGNITIVE LEVEL
              </p>
              <h3>
                Level {patient.difficultyLevel}
              </h3>
            </div>
          </div>

          <div className="profile-caregiver-card">
            <p className="eyebrow">
              CAREGIVER INFORMATION
            </p>

            <h2>{patient.caregiverName || "Not provided"}</h2>

            <p>
              📞{" "}
              {patient.caregiverPhone ||
                "Phone number not provided"}
            </p>
          </div>

          <div className="profile-status-card">
            <div>
              <p className="eyebrow">ACCOUNT STATUS</p>

              <h2>
                {patient.isActive
                  ? "🟢 Active"
                  : "🔴 Inactive"}
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
              Edit Profile
            </button>
          </div>
        </>
      ) : (
        <div className="profile-edit-card">
          <p className="eyebrow">EDIT PROFILE</p>

          <h2>Update Patient Information</h2>

          <form onSubmit={updateProfile}>
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Age
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
              Gender
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label>
              Language
              <input
                name="language"
                value={form.language}
                onChange={handleChange}
              />
            </label>

            <label>
              Caregiver Name
              <input
                name="caregiverName"
                value={form.caregiverName}
                onChange={handleChange}
              />
            </label>

            <label>
              Caregiver Phone
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
                Save Changes
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default PatientProfile;