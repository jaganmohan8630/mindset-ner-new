import { useCallback, useEffect, useState } from "react";
import { API_URL } from "../api";
import socket from "../socket";

const readJson = async (response) => {
  if (!(response.headers.get("content-type") || "").includes("application/json")) {
    throw new Error("Healthcare requests are unavailable because the backend has not been restarted with the latest routes.");
  }
  return response.json();
};

export default function HealthcareWorkerRequests() {
  const [requests, setRequests] = useState([]);
  const [processingId, setProcessingId] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("mindset_ner_token");
  const loadRequests = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/api/healthcare-worker/assignment-requests/patient`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.message || "Unable to load healthcare worker requests");
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
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.message || "Could not update request");
      setRequests((current) => current.filter((request) => request._id !== id));
    } catch (err) { setError(err.message); } finally { setProcessingId(""); }
  };
  if (!requests.length && !error) return null;
  return <div className="caregiver-request-overlay" role="dialog" aria-modal="true" aria-label="Healthcare worker access requests"><section className="caregiver-request-modal"><div className="caregiver-request-modal-heading"><div className="caregiver-request-bell" aria-hidden="true">⚕</div><div><p>HEALTHCARE WORKER REQUEST{requests.length > 1 ? "S" : ""}</p><h2>Approve access to your progress?</h2></div><span className="caregiver-request-count">{requests.length}</span></div>{error && <p className="caregiver-request-message error" role="alert">{error}</p>}<div className="caregiver-request-list">{requests.map((request) => <article key={request._id} className="caregiver-request-item"><div className="caregiver-request-avatar" aria-hidden="true">⚕</div><div className="caregiver-request-copy"><strong>{request.healthcareWorkerId?.name || "Healthcare worker"}</strong><small>{request.healthcareWorkerId?.email || "Verified healthcare worker"}</small><p>would like read-only access to your cognitive progress and activity data.</p></div><div className="caregiver-request-actions"><button className="caregiver-reject-button" onClick={() => respond(request._id, "reject")} disabled={Boolean(processingId)}>{processingId === request._id ? "Please wait..." : "Decline"}</button><button className="caregiver-accept-button" onClick={() => respond(request._id, "accept")} disabled={Boolean(processingId)}>{processingId === request._id ? "Please wait..." : "Approve access"}</button></div></article>)}</div><p className="caregiver-request-privacy">You control healthcare-worker access. Approval grants read-only progress monitoring.</p></section></div>;
}
