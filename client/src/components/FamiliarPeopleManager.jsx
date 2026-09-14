import { useEffect, useState } from "react";
import { API_URL } from "../api";
import { getUIText } from "../uiTranslations";

function FamiliarPeopleManager({ patientId, language = "en-IN" }) {
  const t = (key) => getUIText(language, key);
  const formatText = (key, values) => Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, value),
    t(key),
  );
  const [people, setPeople] = useState([]);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [showAllPeople, setShowAllPeople] = useState(false);
  const [photoPreviews, setPhotoPreviews] = useState({});
  const [editingId, setEditingId] = useState("");
  const [editName, setEditName] = useState("");
  const [editPhoto, setEditPhoto] = useState(null);
  const token = localStorage.getItem("mindset_ner_token");

  const loadPeople = async () => {
    const response = await fetch(`${API_URL}/api/familiar-people/${patientId}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || t("couldNotLoadFamiliarPeople"));
    setPeople(data.people || []);
  };

  useEffect(() => { loadPeople().catch((error) => setMessage(error.message)); }, [patientId]);

  useEffect(() => {
    let cancelled = false;
    const objectUrls = [];
    const loadPreviews = async () => {
      const previews = {};
      await Promise.all((showAllPeople ? people : people.slice(0, 5)).map(async (person) => {
        try {
          const response = await fetch(`${API_URL}/api/familiar-people/photo/${person._id}`, { headers: { Authorization: `Bearer ${token}` }, cache: "force-cache" });
          if (!response.ok) return;
          const url = URL.createObjectURL(await response.blob());
          objectUrls.push(url);
          previews[person._id] = url;
        } catch { /* Keep the name row usable if an old photo is unavailable. */ }
      }));
      if (!cancelled) setPhotoPreviews(previews);
    };
    loadPreviews();
    return () => { cancelled = true; objectUrls.forEach((url) => URL.revokeObjectURL(url)); };
  }, [people, showAllPeople, token]);

  const addPerson = async (event) => {
    event.preventDefault();
    if (!name.trim() || !photo) return;
    setSaving(true); setMessage("");
    try {
      const formData = new FormData();
      formData.append("patientId", patientId); formData.append("name", name.trim()); formData.append("photo", photo);
      const response = await fetch(`${API_URL}/api/familiar-people`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || t("couldNotAddFamiliarPerson"));
      setName(""); setPhoto(null); event.target.reset(); await loadPeople();
      setMessage(t("familiarPersonAdded"));
    } catch (error) { setMessage(error.message); } finally { setSaving(false); }
  };

  const beginEdit = (person) => {
    setEditingId(person._id); setEditName(person.name); setEditPhoto(null); setMessage("");
  };

  const saveEdit = async (event, personId) => {
    event.preventDefault();
    if (!editName.trim() && !editPhoto) return;
    setSaving(true); setMessage("");
    try {
      const formData = new FormData();
      if (editName.trim()) formData.append("name", editName.trim());
      if (editPhoto) formData.append("photo", editPhoto);
      const response = await fetch(`${API_URL}/api/familiar-people/${personId}`, { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || t("couldNotUpdateFamiliarPerson"));
      setEditingId(""); setEditName(""); setEditPhoto(null); await loadPeople();
      setMessage(t("familiarPersonUpdated"));
    } catch (error) { setMessage(error.message); } finally { setSaving(false); }
  };

  const removePerson = async (personId) => {
    if (!window.confirm(t("confirmRemoveFamiliarPerson"))) return;
    try {
      const response = await fetch(`${API_URL}/api/familiar-people/${personId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || t("couldNotRemoveFamiliarPerson"));
      await loadPeople();
    } catch (error) { setMessage(error.message); }
  };

  const visiblePeople = showAllPeople ? people : people.slice(0, 5);
  return <section className="caregiver-card familiar-people-card"><div className="caregiver-section-heading"><p className="eyebrow">{t("familyFamiliarity").toUpperCase()}</p><h2>{t("familiarPeopleTraining")}</h2><p>{t("familiarPeopleDescription")}</p></div><form className="familiar-person-form" onSubmit={addPerson}><input value={name} onChange={(event) => setName(event.target.value)} maxLength="100" placeholder={t("personName")} aria-label={t("personName")} required /><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setPhoto(event.target.files?.[0] || null)} aria-label={t("personPhoto")} required /><button type="submit" disabled={saving}>{saving ? t("adding") : t("addPerson")}</button></form><p className="familiar-people-help">{t("familiarPeopleImageHelp")}</p>{message && <p className="familiar-people-message">{message}</p>}<div className="familiar-people-list">{visiblePeople.map((person) => editingId === person._id ? <form className="familiar-person-edit" key={person._id} onSubmit={(event) => saveEdit(event, person._id)}><img className="familiar-person-thumbnail" src={photoPreviews[person._id]} alt={formatText("photoOfPerson", { name: person.name })} /><input value={editName} onChange={(event) => setEditName(event.target.value)} maxLength="100" aria-label={formatText("nameForPerson", { name: person.name })} /><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setEditPhoto(event.target.files?.[0] || null)} aria-label={formatText("replacementPhotoForPerson", { name: person.name })} /><button type="submit" disabled={saving}>{t("save")}</button><button type="button" onClick={() => setEditingId("")}>{t("cancel")}</button></form> : <div key={person._id} className="familiar-person-row">{photoPreviews[person._id] ? <img className="familiar-person-thumbnail" src={photoPreviews[person._id]} alt={formatText("photoOfPerson", { name: person.name })} /> : <span className="familiar-person-placeholder" aria-hidden="true">{t("person")}</span>}<strong>{person.name}</strong><button type="button" className="edit-familiar-person" onClick={() => beginEdit(person)}>{t("edit")}</button><button type="button" onClick={() => removePerson(person._id)}>{t("remove")}</button></div>)}{people.length === 0 && <p className="caregiver-empty-state compact">{t("noFamiliarPeopleAdded")}</p>}</div>{people.length > 5 && <button type="button" className="show-all-familiar-people" onClick={() => setShowAllPeople((showing) => !showing)} aria-expanded={showAllPeople}>{showAllPeople ? t("showLess") : formatText("showAllPeople", { count: people.length })}</button>}</section>;
}

export default FamiliarPeopleManager;
