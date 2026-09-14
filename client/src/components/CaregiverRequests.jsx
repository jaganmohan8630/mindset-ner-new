import { useCallback, useEffect, useState } from "react";
import { API_URL } from "../api";
import { socket } from "../socket";
import { getUIText } from "../uiTranslations";

function CaregiverRequests({ language = "en-IN" }) {
  const t = (key) => getUIText(language, key);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState("");

  const token = localStorage.getItem("mindset_ner_token");

  const loadRequests = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/connections/patient-requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || t("failedToLoadConnectionRequests"),
        );
      }

      setRequests(data.requests || []);
      setError("");
    } catch (err) {
      console.error("Failed to load requests:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadRequests();

    window.addEventListener("focus", loadRequests);

    return () => {
      window.removeEventListener("focus", loadRequests);
    };
  }, [loadRequests]);

  useEffect(() => {
    const handleRequestCreated = () => loadRequests();
    const handleSocketConnect = () => loadRequests();

    socket.on("caregiverRequest:created", handleRequestCreated);
    socket.on("connect", handleSocketConnect);

    return () => {
      socket.off("caregiverRequest:created", handleRequestCreated);
      socket.off("connect", handleSocketConnect);
    };
  }, [loadRequests]);

  const handleRequest = async (connectionId, action) => {
    if (processingId) return;

    try {
      setProcessingId(connectionId);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/api/connections/${connectionId}/${action}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || t("failedToProcessConnectionRequest"),
        );
      }

      setRequests((current) =>
        current.filter((request) => request._id !== connectionId),
      );
    } catch (err) {
      console.error("Connection request error:", err);
      setError(err.message);
    } finally {
      setProcessingId("");
    }
  };

  if (loading || (requests.length === 0 && !error && !message)) return null;

  return (
    <div className="caregiver-request-overlay" role="dialog" aria-modal="true" aria-label={t("connectionRequests")}>
      <section className="caregiver-request-modal">
        <div className="caregiver-request-modal-heading">
          <div className="caregiver-request-bell" aria-hidden="true">♧</div>
          <div>
            <p>{t("connectionRequestCount").replace("{count}", String(requests.length))}</p>
            <h2>{t("supportYou")}</h2>
          </div>
          <span className="caregiver-request-count">{requests.length}</span>
        </div>

        {error && <p className="caregiver-request-message error" role="alert">{error}</p>}
        {message && <p className="caregiver-request-message success" role="status">{message}</p>}

        <div className="caregiver-request-list">
          {requests.map((request) => {
            const caregiver = request.caregiverId;
            return (
              <article key={request._id} className="caregiver-request-item">
                <div className="caregiver-request-avatar" aria-hidden="true">♧</div>
                <div className="caregiver-request-copy">
                  <strong>{caregiver?.name || t("caregiver")}</strong>
                  <small>{caregiver?.email || t("verifiedCaregiver")}</small>
                  <p>{t("caregiverRequest")}</p>
                </div>
                <div className="caregiver-request-actions">
                  <button className="caregiver-reject-button" onClick={() => handleRequest(request._id, "reject")} disabled={Boolean(processingId)}>
                    {processingId === request._id ? t("pleaseWait") : t("notNow")}
                  </button>
                  <button className="caregiver-accept-button" onClick={() => handleRequest(request._id, "accept")} disabled={Boolean(processingId)}>
                    {processingId === request._id ? t("pleaseWait") : t("acceptRequest")}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <p className="caregiver-request-privacy"><span aria-hidden="true">♢</span> {t("connectionPrivacy")}</p>
      </section>
    </div>
  );
}

export default CaregiverRequests;
