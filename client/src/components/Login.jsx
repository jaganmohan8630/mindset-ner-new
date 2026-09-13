import { useState } from "react";
import { CapacitorHttp } from "@capacitor/core";
import loginLandscape from "../assets/login-landscape.png";
import { API_URL } from "../api";
const Icon = ({ name, size = 22 }) => {
  const paths = {
    user: (
      <>
        <circle cx="12" cy="7" r="4" />
        <path d="M4 21c0-4.1 3.6-7 8-7s8 2.9 8 7" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 20 6v5c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V6l8-3Z" />
        <path d="m8.5 12 2.2 2.2 4.8-4.8" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3 20c0-3.8 2.7-6 6-6s6 2.2 6 6M15 15c3.2-.2 5 1.8 5 5" />
      </>
    ),
    heart: (
      <path d="M20.8 5.8a5.4 5.4 0 0 0-7.6 0L12 7l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 22l8.8-8.6a5.4 5.4 0 0 0 0-7.6Z" />
    ),
  };
  return (
    <svg
      className="login-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
};

const Field = ({ label, icon, children }) => (
  <label className="login-field">
    <span className="login-field-label">
      <Icon name={icon} size={20} />
      {label}
    </span>
    {children}
  </label>
);

function Login({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("female");
  const [language, setLanguage] = useState("English");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setAge("");
    setGender("female");
    setLanguage("English");
    setRole("patient");
    setError("");
    setMessage("");
  };
  const switchMode = (registering) => {
    setIsRegistering(registering);
    setShowPassword(false);
    resetForm();
  };
  const handleLogin = async (event) => {
    event.preventDefault();
    if (!email || !password)
      return setError("Please enter your email and password.");
    try {
      setLoading(true);
      setError("");
      const response = await CapacitorHttp.post({
        url: `${API_URL}/api/auth/login`,
        connectTimeout: 5000,
        readTimeout: 5000,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email,
          password,
        },
      });

      const data = response.data;

      if (response.status < 200 || response.status >= 300) {
        throw new Error(data?.message || "Login failed.");
      }
      localStorage.setItem("mindset_ner_token", data.token);
      localStorage.setItem("mindset_ner_user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!name || !email || !password)
      return setError("Please fill in all required fields.");
    if (password.length < 6)
      return setError("Password must be at least 6 characters.");
    if (role === "patient" && (!age || !gender))
      return setError("Please enter the patient's age and gender.");
    try {
      setLoading(true);
      let patientId = null;
      if (role === "patient") {
        const r = await fetch(`${API_URL}/api/patients`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, age: Number(age), gender, language }),
        });
        const d = await r.json();
        if (!r.ok)
          throw new Error(d.message || "Failed to create patient profile.");
        patientId = d.patient._id;
      }
      const r = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, patientId }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "Registration failed.");
      localStorage.setItem("mindset_ner_token", d.token);
      localStorage.setItem("mindset_ner_user", JSON.stringify(d.user));
      setMessage("Account created successfully.");
      onLogin(d.user);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const input = (type, placeholder, value, setter) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(event) => setter(event.target.value)}
      required
      className="login-input"
    />
  );
  return (
    <div className="app login-page">
      <main className="login-shell">
        <aside
          className="login-story"
          style={{ backgroundImage: `url(${loginLandscape})` }}
        >
          <div className="login-story-copy">
            <p>Welcome to</p>
            <h2>MINDSET NER</h2>
            <span className="story-divider">
              <i></i>
              <Icon name="heart" size={23} />
              <i></i>
            </span>
            <p className="story-description">
              Your cognitive companion designed to help you stay engaged, active
              &amp; connected every day.
            </p>
          </div>
          <div className="story-benefits">
            <div>
              <span>
                <Icon name="shield" />
              </span>
              Secure
              <br />
              &amp; Private
            </div>
            <div>
              <span>
                <Icon name="users" />
              </span>
              Caregiver
              <br />
              Connected
            </div>
            <div>
              <span>
                <Icon name="heart" />
              </span>
              Designed
              <br />
              for You
            </div>
          </div>
        </aside>
        <section className="login-form-pane">
          <div className="login-brand-mark">🧠</div>
          <p className="eyebrow">MINDSET NER</p>
          <h1>{isRegistering ? "Create your account" : "Welcome back!"}</h1>
          <p className="welcome-text">
            {isRegistering
              ? "Join MINDSET NER and begin your wellness journey."
              : "Sign in to continue to your MINDSET NER account."}
          </p>
          <form
            className="login-form"
            onSubmit={isRegistering ? handleRegister : handleLogin}
          >
            {isRegistering && (
              <Field label="Full name" icon="user">
                {input("text", "Enter your full name", name, setName)}
              </Field>
            )}
            <Field label="Email address" icon="user">
              <span className="input-with-icon">
                {input("email", "Enter your email address", email, setEmail)}
                <Icon name="mail" />
              </span>
            </Field>
            <Field label="Password" icon="lock">
              <span className="input-with-icon">
                {input(
                  showPassword ? "text" : "password",
                  "Enter your password",
                  password,
                  setPassword,
                )}
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Show or hide password"
                >
                  <Icon name="eye" />
                </button>
              </span>
            </Field>
            {isRegistering && (
              <div className="registration-grid">
                <Field label="Account type" icon="users">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="login-input"
                  >
                    <option value="patient">Patient</option>
                    <option value="caregiver">Caregiver</option>
                    <option value="healthcare_worker">Healthcare worker</option>
                  </select>
                </Field>
                {role === "patient" && (
                  <>
                    <Field label="Age" icon="user">
                      {input("number", "Age", age, setAge)}
                    </Field>
                    <Field label="Gender" icon="user">
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="login-input"
                      >
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Other</option>
                      </select>
                    </Field>
                    <Field label="Language" icon="user">
                      {input("text", "Language", language, setLanguage)}
                    </Field>
                  </>
                )}
              </div>
            )}
            {!isRegistering && (
              <button type="button" className="forgot-password">
                Forgot Password?
              </button>
            )}
            {error && <div className="auth-error">{error}</div>}
            {message && <div className="auth-success">{message}</div>}
            <button
              type="submit"
              className="start-button login-submit"
              disabled={loading}
            >
              <Icon name="lock" />
              {loading
                ? isRegistering
                  ? "Creating account..."
                  : "Signing in..."
                : isRegistering
                  ? "Create Account"
                  : "Sign In"}
            </button>
          </form>
          <div className="login-or">
            <span></span>or<span></span>
          </div>
          <button
            type="button"
            className="secondary-button create-account"
            onClick={() => switchMode(!isRegistering)}
          >
            <Icon name={isRegistering ? "lock" : "user"} />
            {isRegistering
              ? "Already have an account? Sign In"
              : "Create New Account"}
          </button>
          <div className="security-note">
            <Icon name="shield" size={34} />
            <p>
              <strong>Your data is safe with us.</strong>
              <span>We use advanced security to protect your information.</span>
            </p>
          </div>
        </section>
      </main>
      <p className="login-footer">
        <Icon name="heart" size={21} /> Simple <b>•</b> Friendly <b>•</b>{" "}
        Designed for you
      </p>
    </div>
  );
}
export default Login;
