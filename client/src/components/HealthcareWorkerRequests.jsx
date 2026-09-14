import { useCallback, useEffect, useState } from "react";
import { API_URL } from "../api";
import socket from "../socket";
import { getUIText } from "../uiTranslations";

const readJson = async (response, t) => {
  if (!(response.headers.get("content-type") || "").includes("application/json")) {
    throw new Error(t("healthcareRequestsUnavailable"));
  }
  return response.json();
};

export default function HealthcareWorkerRequests({ language = "en-IN" }) {
  const t = (key) => getUIText(language, key);
  const [requests, setRequests] = useState([]);
  const [processingId, setProcessingId] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("mindset_ner_token");
  const loadRequests = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/api/healthcare-worker/assignment-requests/patient`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await readJson(response, t);
      if (!response.ok) throw new Error(data.message || t("unableToLoadHealthcareRequests"));
      setRequests(data.requests || []);
      setError("");
    } catch (err) { setError(err.message); }
  }, [token]);

  useEffect(() => { loadRequests(); window.addEventListener("focus", loadRequests); return () => window.removeEventListener("focus", loadRequests); }, [loadRequests]);
  useEffect(() => { socket.on("healthcareWorkerRequest:created", loadRequests); socket.on("connect", loadRequests); return () => { socket.off("healthcareWorkerRequest:created", loadRequests); socket.off("connect", loadRequests); }; }, [loadRequests]);
  const respond = async (id, action) => {
    try {
      setProcessingId(id); setError("");
      const response = await fetch(`${API_URL}/api/healthcare-worker/assignment-requests/${id}/${action}`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
      const data = await readJson(response, t);
      if (!response.ok) throw new Error(data.message || t("couldNotUpdateRequest"));
      setRequests((current) => current.filter((request) => request._id !== id));
    } catch (err) { setError(err.message); } finally { setProcessingId(""); }
  };
  if (!requests.length && !error) return null;
  return <div className="caregiver-request-overlay" role="dialog" aria-modal="true" aria-label={t("healthcareWorkerAccessRequests")}><section className="caregiver-request-modal"><div className="caregiver-request-modal-heading"><div className="caregiver-request-bell" aria-hidden="true">⚕</div><div><p>{requests.length > 1 ? t("healthcareWorkerRequests") : t("healthcareWorkerRequest")}</p><h2>{t("approveProgressAccess")}</h2></div><span className="caregiver-request-count">{requests.length}</span></div>{error && <p className="caregiver-request-message error" role="alert">{error}</p>}<div className="caregiver-request-list">{requests.map((request) => <article key={request._id} className="caregiver-request-item"><div className="caregiver-request-avatar" aria-hidden="true">⚕</div><div className="caregiver-request-copy"><strong>{request.healthcareWorkerId?.name || t("healthcareWorker")}</strong><small>{request.healthcareWorkerId?.email || t("verifiedHealthcareWorker")}</small><p>{t("readOnlyProgressAccess")}</p></div><div className="caregiver-request-actions"><button className="caregiver-reject-button" onClick={() => respond(request._id, "reject")} disabled={Boolean(processingId)}>{processingId === request._id ? t("pleaseWait") : t("decline")}</button><button className="caregiver-accept-button" onClick={() => respond(request._id, "accept")} disabled={Boolean(processingId)}>{processingId === request._id ? t("pleaseWait") : t("approveAccess")}</button></div></article>)}</div><p className="caregiver-request-privacy">{t("healthcareAccessPrivacy")}</p></section></div>;
}
