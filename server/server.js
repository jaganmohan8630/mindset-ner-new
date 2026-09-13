require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const { setupSocketServer } = require("./sockets/socketServer");

const app = express();

const PORT = process.env.PORT || 5000;

// Routes
const patientRoutes = require("./routes/patientRoutes");
const gameRoutes = require("./routes/gameRoutes");
const authRoutes = require("./routes/authRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const moodRoutes = require("./routes/moodRoutes");
const connectionRoutes = require("./routes/connectionRoutes");
const wanderingRoutes = require("./routes/wanderingRoutes");
const familiarPeopleRoutes = require("./routes/familiarPeopleRoutes");
const cognitiveAnalyticsRoutes = require("./routes/cognitiveAnalyticsRoutes");
const healthcareWorkerRoutes = require("./routes/healthcareWorkerRoutes");
const caregiverActionPlanRoutes = require("./routes/caregiverActionPlanRoutes");
const dailyCarePlanRoutes = require("./routes/dailyCarePlanRoutes");
const elderConnectionRoutes = require("./routes/elderConnectionRoutes");
const elderMessageRoutes = require("./routes/elderMessageRoutes");

const {
  startReminderScheduler,
} = require("./services/reminderScheduler");

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.originalUrl);
  next();
});
// Routes
app.use("/api/patients", patientRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/wandering", wanderingRoutes);
app.use("/api/familiar-people", familiarPeopleRoutes);
app.use("/api/analytics", cognitiveAnalyticsRoutes);
app.use("/api/healthcare-worker", healthcareWorkerRoutes);
app.use("/api/caregiver-action-plan", caregiverActionPlanRoutes);
app.use("/api/daily-care-plan", dailyCarePlanRoutes);
app.use("/api/elder-connections", elderConnectionRoutes);
app.use("/api/elder-messages", elderMessageRoutes);
app.use("/api", (req, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

app.get("/", (req, res) => {
  res.json({
    message: "MINDSET NER backend is running",
  });
});

// Create HTTP server
const server = http.createServer(app);

const socketOrigins = new Set(
  [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://localhost",
    "capacitor://localhost",
  ].filter(Boolean),
);

const isAllowedSocketOrigin = (origin) => {
  if (!origin || socketOrigins.has(origin)) return true;

  // Permit the LAN Vite address used when testing the PWA on a phone.
  return /^https?:\/\/(?:192\.168|10\.\d+|172\.(?:1[6-9]|2\d|3[0-1]))(?:\.\d{1,3}){2}:\d+$/.test(
    origin,
  );
};

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin(origin, callback) {
      callback(isAllowedSocketOrigin(origin) ? null : new Error("Socket origin not allowed"), isAllowedSocketOrigin(origin));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// IMPORTANT: io must exist BEFORE this line
setupSocketServer(io);

// Database
connectDB().then(() => {
  startReminderScheduler(io);
});

// Start server
server.listen(PORT, () => {
  console.log(
    `MINDSET NER server running on http://localhost:${PORT}`,
  );
  console.log("Socket.IO server is ready");
});

app.set("io", io);
