import { useEffect, useState } from "react";
import { API_URL } from "../api";
import { socket } from "../socket";
import CaregiverEmergencyAlerts from "./CaregiverEmergencyAlerts";
import FamiliarPeopleManager from "./FamiliarPeopleManager";
import { caregiverStatus, caregiverText } from "../caregiverTranslations";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function CaregiverDashboard({ onBack, language = "en-IN", onLanguageChange = () => {} }) {
  const ct = (key) => caregiverText(language, key);
  const activityLabel = (value) => ct(({ Memory: "memory", Attention: "attention", "Routine Recall": "routineRecall", "Pattern Recognition": "patternRecognition", "Object Recognition": "objectRecognition", "Family Familiarity": "familyFamiliarity", memory: "memory", attention: "attention", routineRecall: "routineRecall", pattern: "patternRecognition", objectRecognition: "objectRecognition", familyFamiliarity: "familyFamiliarity" })[value] || value);
  const [patient, setPatient] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [memoryAlert, setMemoryAlert] = useState(null);
  const [attentionAlert, setAttentionAlert] = useState(null);
  const [activityRecommendation, setActivityRecommendation] = useState(null);
  const [adherence, setAdherence] = useState(null);
  const [cognitiveRisk, setCognitiveRisk] = useState(null);
  const [actionPlan, setActionPlan] = useState(null);
  const [actionPlanUpdating, setActionPlanUpdating] = useState("");
  const [loading, setLoading] = useState(true);
  const [activityFilter, setActivityFilter] = useState("all");
  const [progressRange, setProgressRange] = useState("10");
  const [showAllReminderHistory, setShowAllReminderHistory] = useState(false);
  const [moodEntries, setMoodEntries] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("mindset_ner_mood_entries") || "[]",
      );
    } catch {
      return [];
    }
  });
  // The moods endpoint is sorted newest-first, so the first entry is the latest.
  const latestMood = moodEntries.length > 0 ? moodEntries[0] : null;
  // PASTE HERE
  const getCognitiveInsight = () => {
    if (!analytics) {
      return {
        status: "Stable",
        message: "Not enough data to determine cognitive performance yet.",
      };
    }

    const activities = [
      {
        name: "Memory",
        performance: memoryAverage,
      },
      {
        name: "Attention",
        performance: attentionAverage,
      },
      {
        name: "Routine Recall",
        performance: routineRecallAverage,
      },
      {
        name: "Pattern Recognition",
        performance: patternAverage,
      },
      {
        name: "Object Recognition",
        performance: objectRecognitionAverage,
      },
    ].filter((activity) => activity.performance > 0);

    if (activities.length === 0) {
      return {
        status: "Stable",
        message:
          "Not enough completed activities to determine cognitive performance yet.",
      };
    }

    const strongActivities = activities.filter(
      (activity) => activity.performance >= 85,
    );

    const weakActivities = activities.filter(
      (activity) => activity.performance < 80,
    );

    const weakestActivity = [...activities].sort(
      (a, b) => a.performance - b.performance,
    )[0];

    if (weakActivities.length === 0) {
      return {
        status: "Strong Performance",
        message:
          "Performance is strong across the completed cognitive activities. Continue regular practice to maintain progress.",
      };
    }

    if (weakestActivity.performance < 60) {
      return {
        status: "Needs Support",
        message: `${weakestActivity.name} performance is currently ${weakestActivity.performance}%. Additional practice and caregiver support may be helpful.`,
      };
    }

    if (strongActivities.length >= 2 && weakActivities.length === 1) {
      return {
        status: `${weakestActivity.name} Needs Focus`,
        message: `${weakestActivity.name} is currently the main area needing additional practice, while other completed activities are performing well.`,
      };
    }

    return {
      status: "Needs Attention",
      message: `Some cognitive activities are below the expected range. ${weakestActivity.name} is currently the lowest-performing area and should receive additional practice.`,
    };
  };

  const memorySessions =
    analytics?.recentSessions?.filter(
      (session) => session.gameType === "memory",
    ) || [];

  const attentionSessions =
    analytics?.recentSessions?.filter(
      (session) => session.gameType === "attention",
    ) || [];
  const routineRecallSessions =
    analytics?.recentSessions?.filter(
      (session) => session.gameType === "routineRecall",
    ) || [];

  const patternSessions =
    analytics?.recentSessions?.filter(
      (session) => session.gameType === "pattern",
    ) || [];

  const objectRecognitionSessions =
    analytics?.recentSessions?.filter(
      (session) => session.gameType === "objectRecognition",
    ) || [];
  const memoryAverage = analytics?.memoryAverage ?? 0;

  const attentionAverage = analytics?.attentionAverage ?? 0;

  const routineRecallAverage = analytics?.routineRecallAverage ?? 0;

  const patternAverage = analytics?.patternAverage ?? 0;

  const objectRecognitionAverage = analytics?.objectRecognitionAverage ?? 0;

  const cognitiveInsight = getCognitiveInsight();

  const getOverallPatientStatus = () => {
    const activities = [
      { name: "Memory", value: memoryAverage },
      { name: "Attention", value: attentionAverage },
      { name: "Routine Recall", value: routineRecallAverage },
      { name: "Pattern Recognition", value: patternAverage },
      { name: "Object Recognition", value: objectRecognitionAverage },
    ];

    const performedActivities = activities.filter(
      (activity) => activity.value > 0,
    );

    const concerns = [];

    performedActivities.forEach((activity) => {
      if (activity.value < 80) {
        concerns.push(`${activity.name} performance needs attention.`);
      }
    });

    const adherenceRate = adherence?.adherenceRate ?? 0;
    const missed = adherence?.missed ?? 0;

    if (adherence && adherenceRate < 80) {
      concerns.push(`${missed} reminder${missed === 1 ? "" : "s"} missed.`);
    }

    if (concerns.length === 0) {
      return {
        status: "Stable",
        icon: "🟢",
        message:
          "Recent cognitive performance and daily routine adherence are stable.",
        action: "Continue regular cognitive activities and daily routines.",
        level: "stable",
      };
    }

    const criticalActivities = performedActivities.filter(
      (activity) => activity.value < 60,
    );

    if (criticalActivities.length > 0 || (adherence && adherenceRate < 50)) {
      return {
        status: "Needs Attention",
        icon: "🔴",
        message:
          "Recent activity or routine adherence shows areas that need caregiver attention.",
        action:
          "Review lower-performing activities and encourage the recommended cognitive activity.",
        level: "critical",
      };
    }

    return {
      status: "Monitor",
      icon: "🟡",
      message:
        "Some recent areas show room for improvement and should be monitored.",
      action:
        "Encourage regular cognitive activities and follow up on missed reminders.",
      level: "warning",
    };
  };
  const getTrend = (gameType, sessions) => {
    const backendTrend = analytics?.cognitiveTrends?.[gameType];

    // Use backend trend when enough data exists
    if (backendTrend) {
      if (sessions.length < 4) {
        return {
          status: "Stable",
          icon: "➡️",
          message: "Continue activities to establish a clearer trend.",
          level: "stable",
        };
      }

      if (backendTrend.trend === "improving") {
        return {
          status: "Improving",
          icon: "📈",
          message:
            "Recent accuracy is improving compared with earlier sessions.",
          level: "improving",
        };
      }

      if (backendTrend.trend === "declining") {
        return {
          status: "Declining",
          icon: "📉",
          message:
            "Recent accuracy has declined compared with earlier sessions.",
          level: "declining",
        };
      }

      return {
        status: "Stable",
        icon: "➡️",
        message: "Recent accuracy is relatively stable.",
        level: "stable",
      };
    }

    return {
      status: "Stable",
      icon: "➡️",
      message: "Not enough recent data to determine a trend.",
      level: "stable",
    };
  };

  const memoryTrend = getTrend("memory", memorySessions);
  const attentionTrend = getTrend("attention", attentionSessions);
  const routineRecallTrend = getTrend("routineRecall", routineRecallSessions);
  const patternTrend = getTrend("pattern", patternSessions);
  const objectRecognitionTrend = getTrend(
    "objectRecognition",
    objectRecognitionSessions,
  );

  const getOverallTrend = () => {
    const trends = [
      memoryTrend,
      attentionTrend,
      routineRecallTrend,
      patternTrend,
      objectRecognitionTrend,
    ];

    const activeTrends = trends.filter(
      (trend) => trend.level !== "stable" || trend.status !== "Stable",
    );

    const decliningCount = trends.filter(
      (trend) => trend.level === "declining",
    ).length;

    const improvingCount = trends.filter(
      (trend) => trend.level === "improving",
    ).length;

    if (decliningCount >= 2) {
      return {
        status: "Declining",
        icon: "📉",
        message:
          "Multiple cognitive activities show a recent decline and should be monitored closely.",
      };
    }

    if (decliningCount === 1) {
      const decliningActivity = [
        {
          name: "Memory",
          trend: memoryTrend,
        },
        {
          name: "Attention",
          trend: attentionTrend,
        },
        {
          name: "Routine Recall",
          trend: routineRecallTrend,
        },
        {
          name: "Pattern Recognition",
          trend: patternTrend,
        },
        {
          name: "Object Recognition",
          trend: objectRecognitionTrend,
        },
      ].find((item) => item.trend.level === "declining");

      return {
        status: "Needs Monitoring",
        icon: "⚠️",
        message: `${decliningActivity.name} shows a recent decline and should be monitored.`,
      };
    }

    if (improvingCount >= 3) {
      return {
        status: "Improving",
        icon: "📈",
        message:
          "Recent cognitive performance is improving across multiple activities.",
      };
    }

    if (improvingCount > 0) {
      return {
        status: "Generally Improving",
        icon: "📈",
        message:
          "Recent performance is improving in some cognitive activities while other areas remain stable.",
      };
    }

    return {
      status: "Generally Stable",
      icon: "➡️",
      message:
        "Recent cognitive performance is generally stable across the available activities.",
    };
  };

  const overallTrend = getOverallTrend();
  const overallStatus = getOverallPatientStatus();
  const getSmartAlerts = () => {
    const alerts = [];

    const activities = [
      {
        name: "Routine Recall",
        value: routineRecallAverage,
        action: "Encourage regular routine recall practice.",
      },
      {
        name: "Pattern Recognition",
        value: patternAverage,
        action: "Encourage additional pattern recognition practice.",
      },
      {
        name: "Object Recognition",
        value: objectRecognitionAverage,
        action: "Encourage additional object recognition practice.",
      },
    ];

    const adherenceRate = adherence?.adherenceRate ?? 0;
    const missed = adherence?.missed ?? 0;

    // Alerts for the newly added cognitive activities
    activities.forEach((activity) => {
      if (activity.value > 0 && activity.value < 60) {
        alerts.push({
          level: "critical",
          icon:
            activity.name === "Routine Recall"
              ? "🔄"
              : activity.name === "Pattern Recognition"
                ? "🔷"
                : "👁️",
          title: `${activity.name} Performance Alert`,
          message: `${activity.name} performance is currently ${activity.value}%. Additional support may be needed.`,
          action: activity.action,
        });
      } else if (activity.value > 0 && activity.value < 80) {
        alerts.push({
          level: "warning",
          icon:
            activity.name === "Routine Recall"
              ? "🔄"
              : activity.name === "Pattern Recognition"
                ? "🔷"
                : "👁️",
          title: `${activity.name} Needs Monitoring`,
          message: `${activity.name} performance is currently ${activity.value}%.`,
          action: activity.action,
        });
      }
    });

    // Reminder adherence alert
    if (adherence && adherenceRate < 50) {
      alerts.push({
        level: "critical",
        icon: "📋",
        title: "Low Reminder Adherence",
        message: `The patient has missed ${missed} reminder${missed === 1 ? "" : "s"}.`,
        action:
          "Check whether the patient needs help following the daily routine.",
      });
    } else if (adherence && adherenceRate < 80) {
      alerts.push({
        level: "warning",
        icon: "📋",
        title: "Reminder Adherence Dropping",
        message: `Reminder adherence is currently ${adherenceRate}%.`,
        action: "Follow up with the patient about missed reminders.",
      });
    }

    // Existing backend memory alert
    if (memoryAlert?.alert) {
      alerts.push({
        level: memoryAlert.severity || "warning",
        icon: "🧠",
        title: memoryAlert.title || "Memory Alert",
        message: memoryAlert.message,
        action: "Review recent memory activity and encourage regular practice.",
      });
    }

    // Existing backend attention alert
    if (attentionAlert?.alert) {
      alerts.push({
        level: attentionAlert.severity || "warning",
        icon: "🎯",
        title: attentionAlert.title || "Attention Alert",
        message: attentionAlert.message,
        action:
          "Review recent attention activity and encourage regular practice.",
      });
    }

    return alerts;
  };

  const smartAlerts = getSmartAlerts();

  const [error, setError] = useState("");

  const filteredSessions =
    analytics?.recentSessions?.filter((session) => {
      if (activityFilter === "all") {
        return true;
      }

      return session.gameType === activityFilter;
    }) || [];
  const loadDashboard = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("mindset_ner_token");

      if (!token) {
        throw new Error("Authentication required.");
      }

      // Get only patients connected to this caregiver
      // Get only patients connected to this caregiver
      const connectionsResponse = await fetch(
          `${API_URL}/api/connections/my-patients`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const connectionsData = await connectionsResponse.json();

      if (!connectionsResponse.ok) {
        throw new Error(
          connectionsData.message || "Failed to load connected patients",
        );
      }

      if (!connectionsData.patients || connectionsData.patients.length === 0) {
        throw new Error(
          "No accepted patients are connected to this caregiver.",
        );
      }

      // Use the connected patient
      const currentPatient = connectionsData.patients[0].patient;

      const patientId = currentPatient._id;

      const moodResponse = await fetch(
          `${API_URL}/api/moods/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (moodResponse.ok) {
        const moodData = await moodResponse.json();
        setMoodEntries(moodData.moods || []);
      }

      const [
        analyticsResponse,
        memoryAlertResponse,
        attentionAlertResponse,
        recommendationResponse,
        adherenceResponse,
        cognitiveRiskResponse,
        actionPlanResponse,
      ] = await Promise.all([
          fetch(`${API_URL}/api/games/analytics/${patientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        fetch(
          `${API_URL}/api/games/alerts/${patientId}?gameType=memory`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),

        fetch(
          `${API_URL}/api/games/alerts/${patientId}?gameType=attention`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),

        fetch(`${API_URL}/api/games/recommendation/${patientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        fetch(`${API_URL}/api/reminders/${patientId}/adherence`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_URL}/api/analytics/cognitive-risk/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/caregiver-action-plan/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!analyticsResponse.ok) {
        throw new Error("Failed to load dashboard analytics");
      }

      const analyticsData = await analyticsResponse.json();

      const memoryAlertData = await memoryAlertResponse.json();
      const attentionAlertData = await attentionAlertResponse.json();
      const recommendationData = await recommendationResponse.json();
      const adherenceData = await adherenceResponse.json();
      const cognitiveRiskData = await cognitiveRiskResponse.json();
      // An older deployed backend (or a frontend fallback route) can return
      // HTML for this new endpoint. Do not let that optional panel prevent the
      // established caregiver dashboard from loading.
      const actionPlanData =
        actionPlanResponse.ok &&
        actionPlanResponse.headers
          .get("content-type")
          ?.includes("application/json")
          ? await actionPlanResponse.json()
          : null;

      console.log("CONNECTED PATIENT:", currentPatient);
      console.log("ANALYTICS:", analyticsData.analytics);
      console.log("RECOMMENDATION:", recommendationData.recommendation);

      setPatient(currentPatient);
      setAnalytics(analyticsData.analytics);
      setMemoryAlert(memoryAlertData.alert);
      setAttentionAlert(attentionAlertData.alert);
      setActivityRecommendation(recommendationData.recommendation);
      setAdherence(adherenceData.adherence);
      setCognitiveRisk(cognitiveRiskData.success ? cognitiveRiskData : null);
      setActionPlan(actionPlanData?.success ? {
        ...actionPlanData,
        pendingActions: actionPlanData.pendingActions || actionPlanData.actions?.filter((action) => action.status === "pending") || [],
        historyActions: actionPlanData.historyActions || actionPlanData.history?.filter((action) => action.status === "completed" || action.status === "dismissed") || [],
      } : null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load patient information.");
    } finally {
      setLoading(false);
    }
  };

  const updateActionPlanStatus = async (action, status) => {
    if (!patient?._id) return;
    try {
      setActionPlanUpdating(action.actionKey);
      const token = localStorage.getItem("mindset_ner_token");
      const response = await fetch(
        `${API_URL}/api/caregiver-action-plan/${patient._id}/actions/${encodeURIComponent(action.actionKey)}`,
        { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ status, action: { actionType: action.actionType, recommendation: action.recommendation, reason: action.reason, priority: action.priority } }) },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to update action");
      if (data.action?.status !== status) {
        throw new Error("The action was not saved with the requested status.");
      }
      setActionPlan((current) => {
        if (!current) return current;
        const pendingActions = current.pendingActions.filter(
          (pendingAction) => pendingAction.actionKey !== action.actionKey,
        );
        return {
          ...current,
          pendingActions,
          historyActions: [data.action, ...current.historyActions.filter((historyAction) => historyAction.actionKey !== action.actionKey)]
            .sort((a, b) => new Date(b.completedAt || b.dismissedAt || b.updatedAt) - new Date(a.completedAt || a.dismissedAt || a.updatedAt)),
          status: pendingActions.length === 0 ? "Monitor" : current.status,
          summary: pendingActions.length === 0
            ? "All recommended actions have been handled. Continue regular monitoring."
            : current.summary,
        };
      });
    } catch (err) {
      setError(err.message || "Unable to update action.");
    } finally {
      setActionPlanUpdating("");
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);
  useEffect(() => {
    const handleRequestAccepted = () => loadDashboard();

    socket.on("caregiverRequest:accepted", handleRequestAccepted);
    return () => socket.off("caregiverRequest:accepted", handleRequestAccepted);
  }, []);
  useEffect(() => {
    if (!patient?._id) return;

    const handleMoodUpdate = (mood) => {
      if (String(mood.patientId) !== String(patient._id)) {
        return;
      }

      console.log("REAL-TIME MOOD UPDATE:", mood);

      loadDashboard();
    };

    socket.on("mood:updated", handleMoodUpdate);

    return () => {
      socket.off("mood:updated", handleMoodUpdate);
    };
  }, [patient?._id]);
  useEffect(() => {
    if (!patient?._id) return;

    const handleActivityUpdate = (activity) => {
      if (String(activity.patientId) !== String(patient._id)) {
        return;
      }

      console.log("REAL-TIME ACTIVITY UPDATE:", activity);

      loadDashboard();
    };

    socket.on("activity:updated", handleActivityUpdate);

    return () => {
      socket.off("activity:updated", handleActivityUpdate);
    };
  }, [patient?._id]);
  useEffect(() => {
    if (!patient?._id) return;

    const handleReminderUpdate = (event) => {
      if (String(event.patientId) === String(patient._id)) {
        loadDashboard();
      }
    };

    socket.on("reminder:updated", handleReminderUpdate);
    return () => socket.off("reminder:updated", handleReminderUpdate);
  }, [patient?._id]);
  useEffect(() => {
    if (!patient?._id) return undefined;

    let cancelled = false;

    const refreshMoods = async () => {
      try {
        const token = localStorage.getItem("mindset_ner_token");
        if (!token) return;

        const response = await fetch(
          `${API_URL}/api/moods/${patient._id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (!response.ok) return;

        const data = await response.json();
        if (!cancelled) setMoodEntries(data.moods || []);
      } catch (error) {
        console.error("Failed to refresh patient mood:", error);
      }
    };

    refreshMoods();
    const refreshTimer = window.setInterval(refreshMoods, 10000);
    window.addEventListener("focus", refreshMoods);

    return () => {
      cancelled = true;
      window.clearInterval(refreshTimer);
      window.removeEventListener("focus", refreshMoods);
    };
  }, [patient?._id]);

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">{ct("loading")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>

        <div className="dashboard-error">{error}</div>
      </div>
    );
  }

  const activityMeta = {
    memory: { name: ct("memoryActivity"), short: ct("memory"), icon: "🧠" },
    attention: { name: ct("attentionActivity"), short: ct("attention"), icon: "🎯" },
    routineRecall: {
      name: ct("routineRecall"),
      short: ct("routine"),
      icon: "🔄",
    },
    pattern: { name: ct("patternRecognition"), short: ct("pattern"), icon: "🔷" },
    objectRecognition: {
      name: ct("objectRecognition"),
      short: ct("objects"),
      icon: "👁️",
    },
    familyFamiliarity: { name: "Family Familiarity", short: "Family", icon: "👨‍👩‍👧" },
  };

  const formatDateTime = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const performanceTrend = analytics?.performanceTrend || [];
  const overallProgress =
    progressRange === "all"
      ? performanceTrend
      : performanceTrend.slice(-Number(progressRange));
  const reminderLogs = adherence?.logs || [];
  const visibleReminderLogs = showAllReminderHistory
    ? reminderLogs
    : reminderLogs.slice(0, 5);

  const exportPatientAnalysisPdf = () => {
    if (!patient) return;
    const escapeHtml = (value) => String(value ?? "—").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    const activityRows = [
      ["Memory", memoryAverage, memoryTrend.status], ["Attention", attentionAverage, attentionTrend.status], ["Routine Recall", routineRecallAverage, routineRecallTrend.status], ["Pattern Recognition", patternAverage, patternTrend.status], ["Object Recognition", objectRecognitionAverage, objectRecognitionTrend.status],
    ].map(([name, score, trend]) => `<tr><td>${escapeHtml(name)}</td><td>${score > 0 ? `${escapeHtml(score)}%` : "No completed sessions"}</td><td>${escapeHtml(trend)}</td></tr>`).join("");
    const alerts = smartAlerts.length ? smartAlerts.map((alert) => `<li><strong>${escapeHtml(alert.title)}</strong><br>${escapeHtml(alert.message)}</li>`).join("") : "<li>No active cognitive or reminder alerts.</li>";
    const actions = actionPlan?.pendingActions?.length ? actionPlan.pendingActions.map((action) => `<li><strong>${escapeHtml(action.recommendation)}</strong> (${escapeHtml(action.priority)} priority)<br>${escapeHtml(action.reason)}</li>`).join("") : "<li>No pending caregiver actions.</li>";
    const progressGraph = overallProgress.length ? (() => {
      const width = 680; const height = 230; const left = 42; const right = 16; const top = 16; const bottom = 35;
      const chartWidth = width - left - right; const chartHeight = height - top - bottom;
      const points = overallProgress.map((item, index) => {
        const x = left + (overallProgress.length === 1 ? chartWidth / 2 : (index * chartWidth) / (overallProgress.length - 1));
        const accuracy = Math.max(0, Math.min(100, Number(item.accuracy) || 0));
        return { x, y: top + ((100 - accuracy) * chartHeight) / 100, accuracy, label: item.game || `Session ${index + 1}` };
      });
      const polyline = points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
      const grids = [0, 25, 50, 75, 100].map((value) => { const y = top + ((100 - value) * chartHeight) / 100; return `<line x1="${left}" y1="${y}" x2="${width - right}" y2="${y}" stroke="#dfe9df"/><text x="4" y="${y + 4}" fill="#607366" font-size="10">${value}%</text>`; }).join("");
      const dots = points.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="3.5" fill="#fff" stroke="#2f8b46" stroke-width="2"><title>${escapeHtml(point.label)}: ${point.accuracy}%</title></circle>`).join("");
      return `<h2>Overall Progress Graph</h2><p class="muted">Accuracy across the selected ${escapeHtml(progressRange === "all" ? "available sessions" : `${progressRange} recent sessions`)}.</p><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Overall cognitive performance graph" style="width:100%;height:auto;border:1px solid #dfe9df;border-radius:8px;background:#fbfefb">${grids}<polyline points="${polyline}" fill="none" stroke="#2f8b46" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>${dots}<text x="${left}" y="${height - 10}" fill="#607366" font-size="10">${escapeHtml(points[0].label)}</text><text x="${width - right}" y="${height - 10}" fill="#607366" font-size="10" text-anchor="end">${escapeHtml(points[points.length - 1].label)}</text></svg>`;
    })() : "<h2>Overall Progress Graph</h2><p>No completed sessions are available for the progress graph.</p>";
    const reportWindow = window.open("", "_blank");
    if (!reportWindow) { window.alert("Please allow pop-ups to export the patient analysis as a PDF."); return; }
    reportWindow.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(patient.name)} - MINDSET-NER Analysis</title><style>@page{size:A4;margin:16mm}*{box-sizing:border-box}body{color:#183a25;font:14px/1.5 Arial,sans-serif}h1{margin:0;font-size:26px}h2{margin:24px 0 8px;color:#28663d;font-size:17px;border-bottom:1px solid #d5e5d6;padding-bottom:5px}p{margin:5px 0}.muted{color:#647568}.status{display:inline-block;margin-top:12px;padding:6px 10px;border-radius:12px;background:#fff0ed;color:#b74535;font-weight:bold}.summary{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:15px}.box{padding:11px;border:1px solid #d7e6d8;border-radius:8px;background:#f8fcf7}table{width:100%;border-collapse:collapse}th,td{padding:8px;border-bottom:1px solid #dfe9df;text-align:left}th{background:#edf7ec}ul{margin:8px 0;padding-left:20px}li{margin:8px 0}footer{margin-top:28px;color:#6b7c6e;font-size:11px}@media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}}</style></head><body><h1>MINDSET-NER Patient Analysis</h1><p class="muted">Generated ${escapeHtml(new Date().toLocaleString())}</p><div class="summary"><div class="box"><strong>Patient</strong><br>${escapeHtml(patient.name)}<br><span class="muted">Code: ${escapeHtml(patient.patientCode)}</span></div><div class="box"><strong>Overall Status</strong><br><span class="status">${escapeHtml(overallStatus.status)}</span></div></div><h2>Cognitive Overview</h2><p><strong>Overall trend:</strong> ${escapeHtml(overallTrend.status)}</p><p>${escapeHtml(overallTrend.message)}</p><p><strong>Insight:</strong> ${escapeHtml(cognitiveInsight.message)}</p><table><thead><tr><th>Activity</th><th>Performance</th><th>Recent trend</th></tr></thead><tbody>${activityRows}</tbody></table>${progressGraph}<h2>Predictive Cognitive Analysis</h2><p><strong>Risk level:</strong> ${escapeHtml(cognitiveRisk?.riskLevel || "Not available")} &nbsp; <strong>Confidence:</strong> ${escapeHtml(cognitiveRisk?.confidence ?? "—")}${cognitiveRisk?.confidence != null ? "%" : ""}</p><p>${escapeHtml(cognitiveRisk?.explanation || "Insufficient data for predictive analysis.")}</p><h2>Daily Wellbeing</h2><p><strong>Latest mood:</strong> ${escapeHtml(latestMood?.mood || "No mood check recorded")}${latestMood?.createdAt ? ` (${escapeHtml(formatDateTime(latestMood.createdAt))})` : ""}</p><p><strong>Reminder adherence:</strong> ${adherence ? `${escapeHtml(adherence.adherenceRate)}% (${escapeHtml(adherence.completed)} completed, ${escapeHtml(adherence.missed)} missed)` : "No reminder data available"}</p><h2>Active Alerts</h2><ul>${alerts}</ul><h2>Caregiver Action Plan</h2><ul>${actions}</ul><footer>This report is generated from the patient's current MINDSET-NER dashboard data. It is for caregiver support and monitoring, not a medical diagnosis.</footer><script>window.onload=()=>window.print();</script></body></html>`);
    reportWindow.document.close();
  };

  return (
    <div className="dashboard-page caregiver-redesign">
      <div className="caregiver-shell">
        <button className="caregiver-back" onClick={onBack}>
          ← <span>{ct("back")}</span>
        </button>

        <div className="caregiver-heading-row">
          <div>
            <p className="eyebrow">{ct("dashboard").toUpperCase()}</p>
            <h1>{ct("overview")}</h1>
            <p>{ct("overviewIntro")}</p>
          </div>
          <div className="caregiver-heading-actions">
            <button className="export-analysis-button" type="button" onClick={exportPatientAnalysisPdf}>Export Analysis PDF</button>
          <label className="activity-range-button">
            <span aria-hidden="true">◷</span>
            <span className="activity-range-label">{ct("progressRange")}</span>
            <select
              value={progressRange}
              onChange={(event) => setProgressRange(event.target.value)}
              aria-label="Progress chart range"
            >
              <option value="10">{ct("recentActivity")}</option>
              <option value="20">20 {ct("recentSessions")}</option>
              <option value="all">{ct("totalSessions")}</option>
            </select>
          </label>
          </div>
        </div>

        {patient && (
          <section className="patient-overview-card">
            <div className="patient-identity">
              <div className="patient-initial">
                {(patient.name || "P").charAt(0).toUpperCase()}
              </div>
              <div>
                <h2>{patient.name}</h2>
                <p>{ct("patientCode")}: {patient.patientCode || "—"}</p>
                <span className="active-badge">● {ct("active")}</span>
              </div>
            </div>
            <div className={`patient-status-pill ${overallStatus.level}`}>
              <span>●</span>
              <div>
                <strong>{caregiverStatus(language, overallStatus.status)}</strong>
                <small>{ct("overallStatus")}</small>
              </div>
            </div>
          </section>
        )}

        {patient && <CaregiverEmergencyAlerts patient={patient} language={language} />}
        {patient && <FamiliarPeopleManager patientId={patient._id} language={language} />}
        {patient && actionPlan && (
          <section className="caregiver-card caregiver-action-plan">
            <div className="caregiver-section-heading">
              <p className="eyebrow">{ct("carePlan").toUpperCase()}</p>
              <h2>🧑‍⚕️ {ct("carePlan")}</h2>
              <p>{actionPlan.summary}</p>
            </div>
            <div className={`action-plan-status ${actionPlan.status.toLowerCase().replace(/\s+/g, "-")}`}>
              <span>{ct("currentStatus")}</span><strong>{caregiverStatus(language, actionPlan.status)}</strong>
            </div>
            <h3 className="action-plan-subheading">{ct("pending")}</h3>
            {actionPlan.pendingActions.length ? (
              <div className="action-plan-list">
                {actionPlan.pendingActions.map((action) => (
                  <article className={`action-plan-item ${action.priority} ${action.status}`} key={action.actionKey}>
                    <div className="action-plan-priority"><span>{caregiverStatus(language, action.priority)}</span><b>{caregiverStatus(language, action.status)}</b></div>
                    <div className="action-plan-copy"><h3>{action.recommendation}</h3><p><strong>{ct("reason")}: </strong>{action.reason}</p></div>
                    <div className="action-plan-controls">
                      <button type="button" disabled={actionPlanUpdating === action.actionKey} onClick={() => updateActionPlanStatus(action, "completed")}>{ct("markCompleted")}</button>
                      <button type="button" className="dismiss" disabled={actionPlanUpdating === action.actionKey} onClick={() => updateActionPlanStatus(action, "dismissed")}>{ct("dismiss")}</button>
                    </div>
                  </article>
                ))}
              </div>
            ) : <div className="caregiver-empty-state compact">{actionPlan.summary}</div>}
            {actionPlan.historyActions.length > 0 && (
              <div className="action-plan-history">
                <h3>{ct("history")}</h3>
                {actionPlan.historyActions.map((item) => (
                  <div key={item._id} className={item.status}>
                    <strong>{item.status === "completed" ? "✓" : "✕"} {item.recommendation}</strong>
                    <span>{caregiverStatus(language, item.status)} • {caregiverStatus(language, item.priority)} {ct("priority")}</span>
                    <small>{caregiverStatus(language, item.status)}: {formatDateTime(item.completedAt || item.dismissedAt)}</small>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
        {cognitiveRisk && (
          <section className="caregiver-card cognitive-risk-card">
            <div className="caregiver-section-heading">
              <p className="eyebrow">{ct("predictive").toUpperCase()}</p>
              <h2>🧠 {ct("trend")}</h2>
              <p>{ct("analyticsNote")}</p>
            </div>
            {!cognitiveRisk.sufficientData ? (
              <p className="cognitive-risk-insufficient">Insufficient data — {cognitiveRisk.explanation} ({cognitiveRisk.dataPoints} completed sessions available.)</p>
            ) : (
              <>
                <div className="cognitive-risk-summary"><div><small>{ct("overallTrend")}</small><strong className={cognitiveRisk.overallStatus.toLowerCase()}>{caregiverStatus(language, cognitiveRisk.overallStatus)}</strong></div><div><small>{ct("riskLevel")}</small><strong className={cognitiveRisk.riskLevel.toLowerCase()}>{caregiverStatus(language, cognitiveRisk.riskLevel)}</strong></div><div><small>{ct("confidence")}</small><strong>{cognitiveRisk.confidence}%</strong></div><div><small>{ct("dataAvailable")}</small><strong>{cognitiveRisk.dataPoints} {ct("recentSessions")}</strong></div></div>
                <p className="cognitive-risk-explanation">{cognitiveRisk.explanation}</p>
                <div className="cognitive-risk-trends">{cognitiveRisk.activityTrends.map((trend) => <div key={trend.gameType}><strong>{trend.name}</strong><span className={trend.status.toLowerCase().replace(" ", "-")}>{trend.status}</span>{trend.accuracyChange != null && <small>{trend.previousAccuracy}% → {trend.recentAccuracy}% ({trend.accuracyChange > 0 ? "+" : ""}{trend.accuracyChange}%)</small>}</div>)}</div>
              </>
            )}
          </section>
        )}

        {analytics && (
          <>
            <section className="caregiver-kpi-grid">
              <div className="caregiver-kpi-card">
                <span>🎮</span>
                <p>{ct("gamesCompleted")}</p>
                <strong>{analytics.totalGames}</strong>
                <small>{ct("totalSessions")}</small>
              </div>
              <div className="caregiver-kpi-card">
                <span>⭐</span>
                <p>{ct("averageScore")}</p>
                <strong>{analytics.averageScore}%</strong>
                <small>{ct("acrossActivities")}</small>
              </div>
              <div className="caregiver-kpi-card">
                <span>🎯</span>
                <p>{ct("averageAccuracy")}</p>
                <strong>{analytics.averageAccuracy}%</strong>
                <small>{ct("averageAccuracy")}</small>
              </div>
              <div className="caregiver-kpi-card">
                <span>📋</span>
                <p>{ct("adherence")}</p>
                <strong>
                  {adherence ? `${adherence.adherenceRate}%` : "—"}
                </strong>
                <small>{ct("reminderCompletion")}</small>
              </div>
            </section>

            <section className="caregiver-card performance-overview-card">
              <div className="caregiver-section-heading">
                <p className="eyebrow">{ct("performance").toUpperCase()}</p>
                <h2>{ct("performanceOverview")}</h2>
                <p>{ct("currentPerformance")}</p>
              </div>
              <div className="performance-overview-grid">
                {[
                  ["memory", memoryAverage],
                  ["attention", attentionAverage],
                  ["routineRecall", routineRecallAverage],
                  ["pattern", patternAverage],
                  ["objectRecognition", objectRecognitionAverage],
                ].map(([type, value]) => (
                  <div className="performance-mini-card" key={type}>
                    <span className="performance-mini-icon">
                      {activityMeta[type].icon}
                    </span>
                    <div>
                      <strong>{value > 0 ? `${value}%` : "—"}</strong>
                      <span>{activityMeta[type].short}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="caregiver-card overall-progress-card">
              <div className="caregiver-section-heading">
                <p className="eyebrow">{ct("cognitiveTrend").toUpperCase()}</p>
                <h2>{ct("progress")}</h2>
                <p>{ct("recentAccuracy")}</p>
              </div>
              <div
                className={`trend-status-bar ${overallTrend.status.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {overallTrend.status} <span>{overallTrend.icon}</span>
              </div>
              <div className="overall-chart-wrap">
                {overallProgress.length > 0 ? (
                  <ResponsiveContainer width="100%" height={270}>
                    <LineChart
                      data={overallProgress}
                      margin={{ top: 12, right: 16, left: 0, bottom: 8 }}
                    >
                      <CartesianGrid stroke="#e2e9e2" strokeDasharray="3 3" />
                      <XAxis dataKey="game" />
                      <YAxis
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Accuracy"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        name="Accuracy"
                        stroke="#2f8b46"
                        strokeWidth={3}
                        dot={{
                          r: 3.5,
                          fill: "#ffffff",
                          stroke: "#2f8b46",
                          strokeWidth: 2,
                        }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="caregiver-empty-state">
                    {ct("noProgress")}
                  </div>
                )}
              </div>
            </section>

            <div className="caregiver-two-column">
              {activityRecommendation && (
                <section className="caregiver-card recommendation-card-new">
                  <div className="card-title-icon">💡</div>
                  <div>
                    <p className="eyebrow">{ct("recommendation").toUpperCase()}</p>
                    <h2>{ct("try")} {activityLabel(activityRecommendation.activity)}</h2>
                    <p>{activityRecommendation.reason}</p>
                    <strong className="recommended-level">{ct("recommendedLevel")} {activityRecommendation.difficulty}</strong>
                  </div>
                </section>
              )}

              <section className="caregiver-card mood-card-new">
                <div className="caregiver-section-heading">
                  <p className="eyebrow">{ct("wellbeing").toUpperCase()}</p>
                  <h2>{ct("mood")}</h2>
                </div>
                {latestMood ? (
                  <div className="latest-mood-box">
                    <span>
                      {latestMood.mood === "happy"
                        ? "😊"
                        : latestMood.mood === "okay"
                          ? "🙂"
                          : latestMood.mood === "neutral"
                            ? "😐"
                            : latestMood.mood === "worried"
                              ? "😟"
                              : "😢"}
                    </span>
                    <div>
                      <strong>{latestMood.label}</strong>
                      <small>{formatDateTime(latestMood.createdAt)}</small>
                    </div>
                  </div>
                ) : (
                  <div className="caregiver-empty-state compact">
                    {ct("noMood")}
                  </div>
                )}
              </section>
            </div>

            {smartAlerts.length > 0 && (
              <section className="caregiver-card smart-alerts-new">
                <div className="caregiver-section-heading">
                  <p className="eyebrow">{ct("insights").toUpperCase()}</p>
                  <h2>{ct("smartAlerts")}</h2>
                  <p>{ct("alertsHelp")}</p>
                </div>
                <div className="smart-alert-count-new">
                  {smartAlerts.length}
                </div>
                <div className="smart-alert-list-new">
                  {smartAlerts.map((alert, index) => (
                    <div
                      className={`smart-alert-row-new ${alert.level}`}
                      key={`${alert.title}-${index}`}
                    >
                      <span className="smart-alert-row-icon">{alert.icon}</span>
                      <div>
                        <strong>{alert.title}</strong>
                        <p>{alert.message}</p>
                        <small>💡 {alert.action}</small>
                      </div>
                      <span className="smart-alert-arrow">›</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {adherence && (
              <div className="caregiver-two-column reminder-section-grid">
                <section className="caregiver-card adherence-card-new">
                  <div className="adherence-heading-new">
                    <div>
                      <p className="eyebrow">{ct("reminderAdherence").toUpperCase()}</p>
                      <h2>{ct("reminders")}</h2>
                      <p>
                        {ct("routineHelp")}
                      </p>
                    </div>
                    <div
                      className="adherence-circle-new"
                      style={{
                        "--adherence-progress": `${adherence.adherenceRate * 3.6}deg`,
                      }}
                    >
                      <strong>{adherence.adherenceRate}%</strong>
                      <span>{ct("adherence")}</span>
                    </div>
                  </div>
                  <div className="adherence-stats-new">
                    <div>
                      <span>✅</span>
                      <strong>{adherence.completed}</strong>
                      <small>{ct("completed")}</small>
                    </div>
                    <div>
                      <span>❌</span>
                      <strong>{adherence.missed}</strong>
                      <small>{ct("missed")}</small>
                    </div>
                    <div>
                      <span>📋</span>
                      <strong>{adherence.total}</strong>
                      <small>{ct("total")}</small>
                    </div>
                  </div>
                </section>

                <section className="caregiver-card reminder-history-card-new">
                  <div className="caregiver-section-heading inline-heading">
                    <div>
                      <p className="eyebrow">{ct("reminderHistory").toUpperCase()}</p>
                      <h2>{ct("recentReminders")}</h2>
                      <p>{ct("reminderListHelp")}</p>
                    </div>
                  </div>
                  {reminderLogs.length > 0 ? (
                    <>
                      <div className="reminder-history-list-new">
                        {visibleReminderLogs.map((log) => (
                          <div
                            className="reminder-history-row-new"
                            key={log._id}
                          >
                            <span className="reminder-history-icon">
                              {log.status === "completed" ? "✓" : "!"}
                            </span>
                            <div>
                              <strong>
                                {log.reminderTitle ||
                                  log.reminderId?.title ||
                                  ct("reminder")}
                              </strong>
                              <small>
                                {formatDateTime(
                                  log.scheduledFor || log.createdAt,
                                )}
                              </small>
                            </div>
                            <span
                              className={`reminder-history-status ${log.status}`}
                            >
                              {log.status === "completed"
                                ? ct("completed")
                                : ct("missed")}
                            </span>
                          </div>
                        ))}
                      </div>
                      {reminderLogs.length > 5 && (
                        <button
                          type="button"
                          className="show-all-reminders-button"
                          onClick={() =>
                            setShowAllReminderHistory(
                              (isShowingAll) => !isShowingAll,
                            )
                          }
                          aria-expanded={showAllReminderHistory}
                        >
                          {showAllReminderHistory ? ct("showLess") : ct("showAll")}
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="caregiver-empty-state compact">
                      {ct("noReminderHistory")}
                    </div>
                  )}
                </section>
              </div>
            )}

            <section className="caregiver-card sessions-card-new">
              <div className="caregiver-section-heading">
                <p className="eyebrow">{ct("activityHistory").toUpperCase()}</p>
                <h2>{ct("recentSessions")}</h2>
                <p>
                  {ct("activityHelp")}
                </p>
              </div>
              <div className="activity-filters-new">
                {[
                  ["all", ct("all")],
                  ["memory", ct("memory")],
                  ["attention", ct("attention")],
                  ["routineRecall", ct("routine")],
                  ["pattern", ct("pattern")],
                  ["objectRecognition", ct("objects")],
                  ["familyFamiliarity", ct("family")],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={activityFilter === value ? "active" : ""}
                    onClick={() => setActivityFilter(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="sessions-list-new">
                {filteredSessions.slice(0, 8).map((session) => {
                  const meta = activityMeta[session.gameType] || {
                    name: "Cognitive Activity",
                    icon: "🧩",
                  };
                  return (
                    <div className="session-row-new" key={session.id}>
                      <span className="session-icon-new">{meta.icon}</span>
                      <div className="session-info-new">
                        <strong>{meta.name}</strong>
                        <small>
                          {ct("level")} {session.difficulty} •{" "}
                          {formatDateTime(session.createdAt)}
                        </small>
                      </div>
                      <div className="session-score-new">
                        <strong>{session.score}%</strong>
                        <small>{ct("score")}</small>
                      </div>
                    </div>
                  );
                })}
                {filteredSessions.length === 0 && (
                  <div className="caregiver-empty-state">
                    {ct("noHistory")}
                  </div>
                )}
              </div>
              {filteredSessions.length > 8 && (
                <button className="view-history-button" type="button">
                  {ct("viewAllSessions")} →
                </button>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default CaregiverDashboard;
