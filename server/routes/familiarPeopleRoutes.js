const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");
const FamiliarPerson = require("../models/FamiliarPerson");
const { protect, authorizePatient } = require("../middleware/authMiddleware");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    callback(null, ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype));
  },
});
const uploadDirectory = path.join(__dirname, "..", "uploads", "familiar-people");

const ensurePatientOnly = (req, res, next) => {
  if (req.user.role !== "patient") {
    return res.status(403).json({ success: false, message: "Only patients can start familiarity training" });
  }
  next();
};

const savePhoto = (file) => {
  fs.mkdirSync(uploadDirectory, { recursive: true });
  const extension = file.mimetype === "image/png" ? ".png" : file.mimetype === "image/webp" ? ".webp" : ".jpg";
  const filename = `${crypto.randomUUID()}${extension}`;
  fs.writeFileSync(path.join(uploadDirectory, filename), file.buffer);
  return filename;
};

const authorizedPerson = async (req, res, next) => {
  const person = await FamiliarPerson.findById(req.params.personId);
  if (!person) return res.status(404).json({ success: false, message: "Familiar person not found" });
  req.params.patientId = String(person.patientId);
  req.familiarPerson = person;
  return authorizePatient(req, res, next);
};

router.get("/:patientId", protect, authorizePatient, async (req, res) => {
  const people = await FamiliarPerson.find({ patientId: req.params.patientId, isActive: true })
    .select("name photo createdAt")
    .sort({ name: 1 });
  res.json({ success: true, people });
});

router.post("/", protect, upload.single("photo"), authorizePatient, async (req, res) => {
  try {
    const name = req.body.name?.trim();
    if (!name || !req.file) {
      return res.status(400).json({ success: false, message: "A name and photo are required" });
    }
    if (req.user.role !== "caregiver") {
      return res.status(403).json({ success: false, message: "Only connected caregivers can add familiar people" });
    }

    const filename = savePhoto(req.file);
    const person = await FamiliarPerson.create({
      patientId: req.body.patientId,
      createdBy: req.user.userId,
      name,
      photo: { filename, mimeType: req.file.mimetype },
    });
    const { emitPatientEvent } = require("../sockets/socketServer");
    emitPatientEvent(req.app.get("io"), person.patientId, "familiarity:updated", { action: "created" });
    return res.status(201).json({ success: true, person });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Could not save familiar person", error: error.message });
  }
});

router.put("/:personId", protect, upload.single("photo"), authorizedPerson, async (req, res) => {
  try {
    if (req.user.role !== "caregiver") {
      return res.status(403).json({ success: false, message: "Only connected caregivers can edit familiar people" });
    }

    const name = req.body.name?.trim();
    if (!name && !req.file) {
      return res.status(400).json({ success: false, message: "Provide a name or a replacement photo" });
    }

    const previousFilename = req.familiarPerson.photo?.filename;
    if (name) req.familiarPerson.name = name;
    if (req.file) {
      const filename = savePhoto(req.file);
      req.familiarPerson.photo = { filename, mimeType: req.file.mimetype };
    }
    await req.familiarPerson.save();

    if (req.file && previousFilename && previousFilename !== req.familiarPerson.photo.filename) {
      fs.unlink(path.join(uploadDirectory, previousFilename), () => {});
    }

    const { emitPatientEvent } = require("../sockets/socketServer");
    emitPatientEvent(req.app.get("io"), req.familiarPerson.patientId, "familiarity:updated", { action: "updated" });
    return res.json({ success: true, person: req.familiarPerson });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Could not update familiar person", error: error.message });
  }
});

router.delete("/:personId", protect, authorizedPerson, async (req, res) => {
  if (req.user.role !== "caregiver") {
    return res.status(403).json({ success: false, message: "Only caregivers can remove familiar people" });
  }
  req.familiarPerson.isActive = false;
  await req.familiarPerson.save();
  const { emitPatientEvent } = require("../sockets/socketServer");
  emitPatientEvent(req.app.get("io"), req.familiarPerson.patientId, "familiarity:updated", { action: "removed" });
  return res.json({ success: true });
});

// Images are never public URLs. The browser fetches this endpoint with its
// bearer token and displays the returned Blob locally.
router.get("/photo/:personId", protect, authorizedPerson, (req, res) => {
  const filePath = path.join(uploadDirectory, req.familiarPerson.photo.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, message: "Photo not found" });
  res.type(req.familiarPerson.photo.mimeType);
  return res.sendFile(filePath);
});

router.get("/training/:patientId", protect, authorizePatient, ensurePatientOnly, async (req, res) => {
  const people = await FamiliarPerson.find({ patientId: req.params.patientId, isActive: true })
    .select("name photo")
    .lean();
  if (people.length < 2) {
    return res.status(400).json({ success: false, message: "At least two familiar people are needed before training can begin" });
  }
  const excludedIds = new Set(
    String(req.query.exclude || "")
      .split(",")
      .filter(Boolean),
  );
  const availablePeople = people.filter(
    (person) => !excludedIds.has(String(person._id)),
  );
  if (availablePeople.length === 0) {
    return res.status(400).json({ success: false, message: "All familiar people have already been shown in this session" });
  }
  const subject = availablePeople[Math.floor(Math.random() * availablePeople.length)];
  const options = [...people]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(4, people.length));
  if (!options.some((person) => String(person._id) === String(subject._id))) {
    options[options.length - 1] = subject;
  }
  options.sort(() => Math.random() - 0.5);
  return res.json({
    success: true,
    question: {
      photoPersonId: subject._id,
      options: options.map((person) => ({ id: person._id, name: person.name })),
      correctPersonId: subject._id,
    },
    totalQuestions: Math.min(5, people.length),
  });
});

module.exports = router;
