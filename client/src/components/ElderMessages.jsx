import { useCallback, useEffect, useRef, useState } from "react";
import { Capacitor, registerPlugin } from "@capacitor/core";
import { API_URL } from "../api";
import { socket } from "../socket";
import "./ElderMessages.css";

const MicrophonePermission = registerPlugin("MicrophonePermission");
const NativeAudioRecorder = registerPlugin("NativeAudioRecorder");

const base64ToBlob = (base64, mimeType) => {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new Blob([bytes], { type: mimeType });
};

export default function ElderMessages({ onBack }) {
  const token = localStorage.getItem("mindset_ner_token");
  const headers = { Authorization: `Bearer ${token}` };
  const [connections, setConnections] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [notice, setNotice] = useState("");
  const [recording, setRecording] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const recorder = useRef(null);
  const chunks = useRef([]);
  const recordingStream = useRef(null);
  const nativeRecording = useRef(false);

  const loadConnections = useCallback(async () => {
    const response = await fetch(`${API_URL}/api/elder-messages/connections`, { headers });
    const data = await response.json();
    if (response.ok) {
      setConnections(data.connections || []);
      setSelected((current) => current || data.connections?.[0] || null);
    } else setNotice(data.message);
  }, []);

  const loadMessages = useCallback(async (person) => {
    if (!person) return;
    const response = await fetch(`${API_URL}/api/elder-messages/with/${person.id}`, { headers });
    const data = await response.json();
    if (response.ok) setMessages(data.messages || []);
    else setNotice(data.message);
  }, []);

  useEffect(() => { loadConnections(); }, [loadConnections]);
  useEffect(() => { loadMessages(selected); }, [selected, loadMessages]);
  useEffect(() => {
    const refresh = ({ fromPatientId }) => {
      if (selected && String(fromPatientId) === String(selected.id)) loadMessages(selected);
    };
    socket.on("elder-message:new", refresh);
    return () => socket.off("elder-message:new", refresh);
  }, [selected, loadMessages]);

  const releaseRecordingStream = useCallback(() => {
    recordingStream.current?.getTracks().forEach((track) => track.stop());
    recordingStream.current = null;
  }, []);

  useEffect(() => () => {
    if (nativeRecording.current) NativeAudioRecorder.cancel().catch(() => {});
    else if (recorder.current?.state === "recording") recorder.current.stop();
    releaseRecordingStream();
  }, [releaseRecordingStream]);

  const uploadAudio = async (blob, fileName) => {
    if (!selected) return;
    const form = new FormData();
    form.append("audio", blob, fileName);
    const response = await fetch(`${API_URL}/api/elder-messages/audio/${selected.id}`, { method: "POST", headers, body: form });
    const data = await response.json();
    if (response.ok) setMessages((current) => [...current, data.message]);
    else setNotice(data.message);
  };

  const sendText = async (event) => {
    event.preventDefault();
    if (!selected || !text.trim()) return;
    const response = await fetch(`${API_URL}/api/elder-messages/text/${selected.id}`, { method: "POST", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
    const data = await response.json();
    if (response.ok) { setText(""); setMessages((current) => [...current, data.message]); }
    else setNotice(data.message);
  };

  const startRecording = async () => {
    try {
      setNotice("");
      if (recording || finalizing) return;
      releaseRecordingStream();
      window.dispatchEvent(new Event("mindset-ner:release-microphone"));
      await new Promise((resolve) => window.setTimeout(resolve, 350));
      if (Capacitor.isNativePlatform()) {
        const permission = await MicrophonePermission.request();
        if (permission.microphone !== "granted") throw new Error("Allow Microphone in Android Settings, then try again.");
        await NativeAudioRecorder.start();
        nativeRecording.current = true;
        setRecording(true);
        return;
      }
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) throw new Error("Recording is not available in this browser.");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      recordingStream.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      recorder.current = mediaRecorder;
      chunks.current = [];
      mediaRecorder.ondataavailable = (event) => { if (event.data.size) chunks.current.push(event.data); };
      mediaRecorder.onstop = async () => {
        releaseRecordingStream();
        recorder.current = null;
        try { await uploadAudio(new Blob(chunks.current, { type: mediaRecorder.mimeType || "audio/webm" }), "voice-message.webm"); }
        finally { setFinalizing(false); }
      };
      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      nativeRecording.current = false;
      releaseRecordingStream();
      setNotice(error?.message || "Unable to start voice recording.");
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    setRecording(false);
    setFinalizing(true);
    try {
      if (nativeRecording.current) {
        const result = await NativeAudioRecorder.stop();
        nativeRecording.current = false;
        await uploadAudio(base64ToBlob(result.base64, result.mimeType), result.fileName || "voice-message.m4a");
        setFinalizing(false);
      } else if (recorder.current?.state === "recording") recorder.current.stop();
    } catch (error) {
      nativeRecording.current = false;
      setFinalizing(false);
      setNotice(error?.message || "Unable to save voice recording. Please record for at least one second.");
    }
  };

  const playAudio = async (message) => {
    try {
      const response = await fetch(`${API_URL}${message.audioUrl}`, { headers });
      if (!response.ok) throw new Error();
      const url = URL.createObjectURL(await response.blob());
      const audio = new Audio(url);
      audio.onended = () => URL.revokeObjectURL(url);
      await audio.play();
    } catch { setNotice("Unable to play this voice message."); }
  };

  return <main className="elder-messages-page">
    <button className="elder-back" onClick={onBack}>← Back</button>
    <h1>💬 Elder Messages</h1>
    {notice && <p className="message-notice">{notice}</p>}
    <div className="elder-messages-layout"><aside><h2>Connected Elders</h2>
      {connections.length ? connections.map((person) => <button key={person.id} className={selected?.id === person.id ? "selected" : ""} onClick={() => setSelected(person)}><strong>{person.name}</strong><small>Age {person.age} · {person.language}</small></button>) : <p>No elder connections yet.</p>}
    </aside><section>{selected ? <>
      <header><h2>{selected.name}</h2><span>Connected</span></header>
      <div className="message-list">{messages.length ? messages.map((message) => <article className={message.mine ? "mine" : "theirs"} key={message.id}>{message.type === "text" ? <p>{message.text}</p> : <button onClick={() => playAudio(message)}>▶ Play voice message</button>}<small>{new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small></article>) : <p className="empty-message">Start a friendly conversation.</p>}</div>
      <form onSubmit={sendText}><input value={text} onChange={(event) => setText(event.target.value)} maxLength="1000" placeholder="Write a message" aria-label="Write a message" /><button type="submit">Send</button></form>
      <button disabled={finalizing} className={recording ? "recording" : "voice-message-button"} onClick={recording ? stopRecording : startRecording}>{recording ? "■ Stop and send voice message" : finalizing ? "Sending voice message…" : "🎙 Record voice message"}</button>
    </> : <p>Select an elder to start messaging.</p>}</section></div>
  </main>;
}
