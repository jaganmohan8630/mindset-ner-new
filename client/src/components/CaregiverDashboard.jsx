import { useEffect, useState } from "react";
import { API_URL } from "../api";
import { socket } from "../socket";
import CaregiverEmergencyAlerts from "./CaregiverEmergencyAlerts";
import FamiliarPeopleManager from "./FamiliarPeopleManager";
import { getUIText } from "../uiTranslations";
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

function CaregiverDashboard({ onBack, language = "en-IN" }) {
  const t = (key) => getUIText(language, key);
  const formatText = (key, values) => Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, value),
    t(key),
  );
  const activityLabel = (value) => {
    switch (value) {
      case "Memory": case "Memory Activity": case "memory": return t("memory");
      case "Attention": case "Attention Activity": case "attention": return t("attention");
      case "Routine Recall": case "Daily Routine Recall": case "Daily Routine Recall Activity": case "routineRecall": return t("routineRecall");
      case "Pattern Recognition": case "pattern": return t("patternRecognition");
      case "Object Recognition": case "objectRecognition": return t("objectRecognition");
      case "Family Familiarity": case "familyFamiliarity": return t("familyFamiliarity");
      default: return value;
    }
  };
  const statusLabel = (value) => {
    switch (String(value)) {
      case "Needs Attention": return t("needsAttention");
      case "Monitor": return t("monitor");
      case "Stable": return t("stable");
      case "Improving": return t("improving");
      case "Declining": return t("declining");
      case "High": case "high": return t("high");
      case "Medium": case "medium": return t("medium");
      case "Moderate": case "moderate": return t("moderate");
      case "Low": case "low": return t("low");
      case "Insufficient data": return t("insufficientData");
      case "completed": return t("completed");
      case "dismissed": return t("dismissed");
      case "pending": return t("pending");
      case "Strong Performance": return t("strongPerformance");
      case "Needs Support": return t("needsSupport");
      case "Needs Monitoring": return t("needsMonitoring");
      case "Generally Improving": return t("generallyImproving");
      case "Generally Stable": return t("generallyStable");
      default: return value;
    }
  };
  const moodLabel = (mood, fallback) => ({ happy: t("moodHappy"), okay: t("moodOkay"), neutral: t("moodNotSure"), worried: t("moodWorried"), sad: t("moodSad") }[mood] || fallback || mood);
  const localizedParams = (params = {}) => Object.fromEntries(Object.entries(params).map(([key, value]) => [key, key === "activityCode" ? activityLabel(value) : key === "moodCode" ? moodLabel(value) : key === "status" ? statusLabel(value) : value]));
  const localizedValue = (item, field) => {
    const code = item?.[`${field}Code`];
    const text = code ? getUIText(language, code, localizedParams(item?.[`${field}Params`])) : item?.[field];
    return field === "reason" && item?.reasonSuffixCode ? `${text} ${getUIText(language, item.reasonSuffixCode, localizedParams(item.reasonSuffixParams))}` : text;
  };
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
        message: t("insightNotEnoughData"),
      };
    }

    const activities = [
      {
        name: t("memory"),
        performance: memoryAverage,
      },
      {
        name: t("attention"),
        performance: attentionAverage,
      },
      {
        type: "routineRecall",
        name: t("routineRecall"),
        performance: routineRecallAverage,
      },
      {
        type: "pattern",
        name: t("patternRecognition"),
        performance: patternAverage,
      },
      {
        type: "objectRecognition",
        name: t("objectRecognition"),
        performance: objectRecognitionAverage,
      },
    ].filter((activity) => activity.performance > 0);

    if (activities.length === 0) {
      return {
        status: "Stable",
        message: t("insightNoCompletedActivities"),
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
        message: t("insightStrongMessage"),
      };
    }

    if (weakestActivity.performance < 60) {
      return {
        status: "Needs Support",
        message: formatText("insightNeedsSupportMessage", { activity: weakestActivity.name, score: weakestActivity.performance }),
      };
    }

    if (strongActivities.length >= 2 && weakActivities.length === 1) {
      return {
        status: "Needs Focus",
        message: formatText("insightNeedsFocusMessage", { activity: weakestActivity.name }),
      };
    }

    return {
      status: "Needs Attention",
      message: formatText("insightNeedsAttentionMessage", { activity: weakestActivity.name }),
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
      { name: t("memory"), value: memoryAverage },
      { name: t("attention"), value: attentionAverage },
      { name: t("routineRecall"), value: routineRecallAverage },
      { name: t("patternRecognition"), value: patternAverage },
      { name: t("objectRecognition"), value: objectRecognitionAverage },
    ];

    const performedActivities = activities.filter(
      (activity) => activity.value > 0,
    );

    const concerns = [];

    performedActivities.forEach((activity) => {
      if (activity.value < 80) {
        concerns.push(formatText("activityPerformanceNeedsAttention", { activity: activity.name }));
      }
    });

    const adherenceRate = adherence?.adherenceRate ?? 0;
    const missed = adherence?.missed ?? 0;

    if (adherence && adherenceRate < 80) {
      concerns.push(formatText("remindersMissed", { count: missed }));
    }

    if (concerns.length === 0) {
      return {
        status: "Stable",
        icon: "🟢",
        message: t("overallStableMessage"),
        action: t("overallStableAction"),
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
        message: t("overallNeedsAttentionMessage"),
        action: t("overallNeedsAttentionAction"),
        level: "critical",
      };
    }

    return {
      status: "Monitor",
      icon: "🟡",
        message: t("overallMonitorMessage"),
        action: t("overallMonitorAction"),
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
          message: t("trendContinueMessage"),
          level: "stable",
        };
      }

      if (backendTrend.trend === "improving") {
        return {
          status: "Improving",
          icon: "📈",
        message: t("trendImprovingMessage"),
          level: "improving",
        };
      }

      if (backendTrend.trend === "declining") {
        return {
          status: "Declining",
          icon: "📉",
        message: t("trendDecliningMessage"),
          level: "declining",
        };
      }

      return {
        status: "Stable",
        icon: "➡️",
        message: t("trendStableMessage"),
        level: "stable",
      };
    }

    return {
      status: "Stable",
      icon: "➡️",
      message: t("trendNotEnoughData"),
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
        message: t("trendMultipleDecline"),
      };
    }

    if (decliningCount === 1) {
      const decliningActivity = [
        {
          name: t("memory"),
          trend: memoryTrend,
        },
        {
          name: t("attention"),
          trend: attentionTrend,
        },
        {
          name: t("routineRecall"),
          trend: routineRecallTrend,
        },
        {
          name: t("patternRecognition"),
          trend: patternTrend,
        },
        {
          name: t("objectRecognition"),
          trend: objectRecognitionTrend,
        },
      ].find((item) => item.trend.level === "declining");

      return {
        status: "Needs Monitoring",
        icon: "⚠️",
        message: formatText("trendDecliningActivity", { activity: decliningActivity.name }),
      };
    }

    if (improvingCount >= 3) {
      return {
        status: "Improving",
        icon: "📈",
        message: t("trendImprovingMultiple"),
      };
    }

    if (improvingCount > 0) {
      return {
        status: "Generally Improving",
        icon: "📈",
        message: t("trendImprovingSome"),
      };
    }

    return {
      status: "Generally Stable",
      icon: "➡️",
      message: t("trendStableAvailable"),
    };
  };

  const overallTrend = getOverallTrend();
  const overallStatus = getOverallPatientStatus();
  const getSmartAlerts = () => {
    const alerts = [];

    const activities = [
      {
        name: t("routineRecall"),
        value: routineRecallAverage,
        action: t("encourageRoutineRecall"),
      },
      {
        name: t("patternRecognition"),
        value: patternAverage,
        action: t("encouragePatternRecognition"),
      },
      {
        name: t("objectRecognition"),
        value: objectRecognitionAverage,
        action: t("encourageObjectRecognition"),
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
            activity.type === "routineRecall"
              ? "🔄"
              : activity.type === "pattern"
                ? "🔷"
                : "👁️",
          title: formatText("performanceAlertTitle", { activity: activity.name }),
          message: formatText("performanceSupportMessage", { activity: activity.name, score: activity.value }),
          action: activity.action,
        });
      } else if (activity.value > 0 && activity.value < 80) {
        alerts.push({
          level: "warning",
          icon:
            activity.type === "routineRecall"
              ? "🔄"
              : activity.type === "pattern"
                ? "🔷"
                : "👁️",
          title: formatText("monitoringAlertTitle", { activity: activity.name }),
          message: formatText("performanceCurrentMessage", { activity: activity.name, score: activity.value }),
          action: activity.action,
        });
      }
    });

    // Reminder adherence alert
    if (adherence && adherenceRate < 50) {
      alerts.push({
        level: "critical",
        icon: "📋",
        title: t("lowReminderAdherence"),
        message: formatText("lowReminderMessage", { count: missed }),
        action: t("checkDailyRoutineAction"),
      });
    } else if (adherence && adherenceRate < 80) {
      alerts.push({
        level: "warning",
        icon: "📋",
        title: t("droppingReminderAdherence"),
        message: formatText("reminderAdherenceCurrent", { rate: adherenceRate }),
        action: t("followUpMissedReminders"),
      });
    }

    // Existing backend memory alert
    if (memoryAlert?.alert) {
      alerts.push({
        level: memoryAlert.severity || "warning",
        icon: "🧠",
        title: localizedValue(memoryAlert, "title") || t("memoryAlert"),
        message: localizedValue(memoryAlert, "message"),
        action: t("reviewMemoryAction"),
      });
    }

    // Existing backend attention alert
    if (attentionAlert?.alert) {
      alerts.push({
        level: attentionAlert.severity || "warning",
        icon: "🎯",
        title: localizedValue(attentionAlert, "title") || t("attentionAlert"),
        message: localizedValue(attentionAlert, "message"),
        action: t("reviewAttentionAction"),
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
        throw new Error(t("authenticationRequired"));
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
          connectionsData.message || t("failedToLoadConnectedPatients"),
        );
      }

      if (!connectionsData.patients || connectionsData.patients.length === 0) {
        throw new Error(
          t("noAcceptedConnectedPatients"),
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
        throw new Error(t("failedToLoadDashboardAnalytics"));
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
      setError(err.message || t("unableToLoadPatientInformation"));
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
        { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ status, action: { actionType: action.actionType, recommendation: action.recommendation, reason: action.reason, recommendationCode: action.recommendationCode, recommendationParams: action.recommendationParams, reasonCode: action.reasonCode, reasonParams: action.reasonParams, reasonSuffixCode: action.reasonSuffixCode, priority: action.priority } }) },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || t("unableToUpdateAction"));
      if (data.action?.status !== status) {
        throw new Error(t("actionNotSaved"));
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
            ? t("allRecommendedActionsHandled")
            : current.summary,
        };
      });
    } catch (err) {
      setError(err.message || t("unableToUpdateAction"));
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
        <div className="dashboard-loading">{t("loading")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <button className="back-button" onClick={onBack}>
          ← {t("back")}
        </button>

        <div className="dashboard-error">{error}</div>
      </div>
    );
  }

  const activityMeta = {
    memory: { name: t("memoryActivity"), short: t("memory"), icon: "🧠" },
    attention: { name: t("attentionActivity"), short: t("attention"), icon: "🎯" },
    routineRecall: {
      name: t("routineRecall"),
      short: t("routine"),
      icon: "🔄",
    },
    pattern: { name: t("patternRecognition"), short: t("pattern"), icon: "🔷" },
    objectRecognition: {
      name: t("objectRecognition"),
      short: t("objects"),
      icon: "👁️",
    },
    familyFamiliarity: { name: t("familyFamiliarity"), short: t("family"), icon: "👨‍👩‍👧" },
  };

  const formatDateTime = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    const locale = { "en-IN": "en-IN", "hi-IN": "hi-IN", "te-IN": "te-IN", "as-IN": "as-IN", "bn-IN": "bn-IN", "nag-IN": "en-IN" }[language] || "en-IN";
    return `${date.toLocaleDateString(locale)} • ${date.toLocaleTimeString(locale, {
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
      [t("memory"), memoryAverage, memoryTrend.status], [t("attention"), attentionAverage, attentionTrend.status], [t("routineRecall"), routineRecallAverage, routineRecallTrend.status], [t("patternRecognition"), patternAverage, patternTrend.status], [t("objectRecognition"), objectRecognitionAverage, objectRecognitionTrend.status],
    ].map(([name, score, trend]) => `<tr><td>${escapeHtml(name)}</td><td>${score > 0 ? `${escapeHtml(score)}%` : t("noCompletedSessions")}</td><td>${escapeHtml(statusLabel(trend))}</td></tr>`).join("");
    const alerts = smartAlerts.length ? smartAlerts.map((alert) => `<li><strong>${escapeHtml(alert.title)}</strong><br>${escapeHtml(alert.message)}</li>`).join("") : `<li>${t("noActiveCognitiveOrReminderAlerts")}</li>`;
    const actions = actionPlan?.pendingActions?.length ? actionPlan.pendingActions.map((action) => `<li><strong>${escapeHtml(localizedValue(action, "recommendation"))}</strong> (${escapeHtml(statusLabel(action.priority))} ${t("prioritySuffix")})<br>${escapeHtml(localizedValue(action, "reason"))}</li>`).join("") : `<li>${t("noPendingCaregiverActions")}</li>`;
    const progressGraph = overallProgress.length ? (() => {
      const width = 680; const height = 230; const left = 42; const right = 16; const top = 16; const bottom = 35;
      const chartWidth = width - left - right; const chartHeight = height - top - bottom;
      const points = overallProgress.map((item, index) => {
        const x = left + (overallProgress.length === 1 ? chartWidth / 2 : (index * chartWidth) / (overallProgress.length - 1));
        const accuracy = Math.max(0, Math.min(100, Number(item.accuracy) || 0));
        return { x, y: top + ((100 - accuracy) * chartHeight) / 100, accuracy, label: item.game || formatText("sessionNumber", { number: index + 1 }) };
      });
      const polyline = points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
      const grids = [0, 25, 50, 75, 100].map((value) => { const y = top + ((100 - value) * chartHeight) / 100; return `<line x1="${left}" y1="${y}" x2="${width - right}" y2="${y}" stroke="#dfe9df"/><text x="4" y="${y + 4}" fill="#607366" font-size="10">${value}%</text>`; }).join("");
      const dots = points.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="3.5" fill="#fff" stroke="#2f8b46" stroke-width="2"><title>${escapeHtml(point.label)}: ${point.accuracy}%</title></circle>`).join("");
      return `<h2>${t("overallProgressGraph")}</h2><p class="muted">${t("graphAccuracyDescription")} ${escapeHtml(progressRange === "all" ? t("availableSessions") : `${progressRange} ${t("recentSessions")}`)}.</p><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${t("overallCognitivePerformanceGraph")}" style="width:100%;height:auto;border:1px solid #dfe9df;border-radius:8px;background:#fbfefb">${grids}<polyline points="${polyline}" fill="none" stroke="#2f8b46" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>${dots}<text x="${left}" y="${height - 10}" fill="#607366" font-size="10">${escapeHtml(points[0].label)}</text><text x="${width - right}" y="${height - 10}" fill="#607366" font-size="10" text-anchor="end">${escapeHtml(points[points.length - 1].label)}</text></svg>`;
    })() : `<h2>${t("overallProgressGraph")}</h2><p>${t("noCompletedSessionsForGraph")}</p>`;
    const reportWindow = window.open("", "_blank");
    if (!reportWindow) { window.alert(t("allowPopupsToExportPdf")); return; }
    reportWindow.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(patient.name)} - ${t("patientAnalysis")}</title><style>@page{size:A4;margin:16mm}*{box-sizing:border-box}body{color:#183a25;font:14px/1.5 Arial,sans-serif}h1{margin:0;font-size:26px}h2{margin:24px 0 8px;color:#28663d;font-size:17px;border-bottom:1px solid #d5e5d6;padding-bottom:5px}p{margin:5px 0}.muted{color:#647568}.status{display:inline-block;margin-top:12px;padding:6px 10px;border-radius:12px;background:#fff0ed;color:#b74535;font-weight:bold}.summary{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:15px}.box{padding:11px;border:1px solid #d7e6d8;border-radius:8px;background:#f8fcf7}table{width:100%;border-collapse:collapse}th,td{padding:8px;border-bottom:1px solid #dfe9df;text-align:left}th{background:#edf7ec}ul{margin:8px 0;padding-left:20px}li{margin:8px 0}footer{margin-top:28px;color:#6b7c6e;font-size:11px}@media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}}</style></head><body><h1>${t("patientAnalysis")}</h1><p class="muted">${t("generated")} ${escapeHtml(new Date().toLocaleString())}</p><div class="summary"><div class="box"><strong>${t("patient")}</strong><br>${escapeHtml(patient.name)}<br><span class="muted">${t("code")}: ${escapeHtml(patient.patientCode)}</span></div><div class="box"><strong>${t("overallStatus")}</strong><br><span class="status">${escapeHtml(statusLabel(overallStatus.status))}</span></div></div><h2>${t("cognitiveOverview")}</h2><p><strong>${t("overallTrend")}:</strong> ${escapeHtml(statusLabel(overallTrend.status))}</p><p>${escapeHtml(overallTrend.message)}</p><p><strong>${t("insight")}:</strong> ${escapeHtml(cognitiveInsight.message)}</p><table><thead><tr><th>${t("activity")}</th><th>${t("performance")}</th><th>${t("recentTrend")}</th></tr></thead><tbody>${activityRows}</tbody></table>${progressGraph}<h2>${t("predictiveCognitiveAnalytics")}</h2><p><strong>${t("riskLevel")}:</strong> ${escapeHtml(statusLabel(cognitiveRisk?.riskLevel || t("notAvailable")))} &nbsp; <strong>${t("confidence")}:</strong> ${escapeHtml(cognitiveRisk?.confidence ?? "—")}${cognitiveRisk?.confidence != null ? "%" : ""}</p><p>${escapeHtml(cognitiveRisk?.explanation || t("insufficientData"))}</p><h2>${t("dailyWellbeing")}</h2><p><strong>${t("latestMood")}:</strong> ${escapeHtml(latestMood?.mood || t("noMoodCheckRecorded"))}${latestMood?.createdAt ? ` (${escapeHtml(formatDateTime(latestMood.createdAt))})` : ""}</p><p><strong>${t("reminderAdherence")}:</strong> ${adherence ? `${escapeHtml(adherence.adherenceRate)}% (${escapeHtml(adherence.completed)} ${t("completed")}, ${escapeHtml(adherence.missed)} ${t("missed")})` : t("noReminderDataAvailable")}</p><h2>${t("activeAlerts")}</h2><ul>${alerts}</ul><h2>${t("caregiverActionPlan")}</h2><ul>${actions}</ul><footer>${t("reportDisclaimer")}</footer><script>window.onload=()=>window.print();</script></body></html>`);
    reportWindow.document.close();
  };

  return (
    <div className="dashboard-page caregiver-redesign">
      <div className="caregiver-shell">
        <button className="caregiver-back" onClick={onBack}>
          ← <span>{t("back")}</span>
        </button>

        <div className="caregiver-heading-row">
          <div>
            <p className="eyebrow">{t("dashboard").toUpperCase()}</p>
            <h1>{t("overview")}</h1>
            <p>{t("overviewIntro")}</p>
          </div>
          <div className="caregiver-heading-actions">
            <button className="export-analysis-button" type="button" onClick={exportPatientAnalysisPdf}>{t("exportAnalysisPdf")}</button>
          <label className="activity-range-button">
            <span aria-hidden="true">◷</span>
            <span className="activity-range-label">{t("progressRange")}</span>
            <select
              value={progressRange}
              onChange={(event) => setProgressRange(event.target.value)}
              aria-label={t("progressChartRange")}
            >
              <option value="10">{t("recentActivity")}</option>
              <option value="20">20 {t("recentSessions")}</option>
              <option value="all">{t("totalSessions")}</option>
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
                <p>{t("patientCode")}: {patient.patientCode || "—"}</p>
                <span className="active-badge">● {t("active")}</span>
              </div>
            </div>
            <div className={`patient-status-pill ${overallStatus.level}`}>
              <span>●</span>
              <div>
                <strong>{statusLabel(overallStatus.status)}</strong>
                <small>{t("overallStatus")}</small>
              </div>
            </div>
          </section>
        )}

        {patient && <CaregiverEmergencyAlerts patient={patient} language={language} />}
        {patient && <FamiliarPeopleManager patientId={patient._id} language={language} />}
        {patient && actionPlan && (
          <section className="caregiver-card caregiver-action-plan">
            <div className="caregiver-section-heading">
              <p className="eyebrow">{t("carePlan").toUpperCase()}</p>
              <h2>🧑‍⚕️ {t("carePlan")}</h2>
              <p>{localizedValue(actionPlan, "summary")}</p>
            </div>
            <div className={`action-plan-status ${actionPlan.status.toLowerCase().replace(/\s+/g, "-")}`}>
              <span>{t("currentStatus")}</span><strong>{statusLabel(actionPlan.status)}</strong>
            </div>
            <h3 className="action-plan-subheading">{t("pending")}</h3>
            {actionPlan.pendingActions.length ? (
              <div className="action-plan-list">
                {actionPlan.pendingActions.map((action) => (
                  <article className={`action-plan-item ${action.priority} ${action.status}`} key={action.actionKey}>
                    <div className="action-plan-priority"><span>{statusLabel(action.priority)}</span><b>{statusLabel(action.status)}</b></div>
                    <div className="action-plan-copy"><h3>{localizedValue(action, "recommendation")}</h3><p><strong>{t("reason")}: </strong>{localizedValue(action, "reason")}</p></div>
                    <div className="action-plan-controls">
                      <button type="button" disabled={actionPlanUpdating === action.actionKey} onClick={() => updateActionPlanStatus(action, "completed")}>{t("markCompleted")}</button>
                      <button type="button" className="dismiss" disabled={actionPlanUpdating === action.actionKey} onClick={() => updateActionPlanStatus(action, "dismissed")}>{t("dismiss")}</button>
                    </div>
                  </article>
                ))}
              </div>
            ) : <div className="caregiver-empty-state compact">{localizedValue(actionPlan, "summary")}</div>}
            {actionPlan.historyActions.length > 0 && (
              <div className="action-plan-history">
                <h3>{t("history")}</h3>
                {actionPlan.historyActions.map((item) => (
                  <div key={item._id} className={item.status}>
                    <strong>{item.status === "completed" ? "✓" : "✕"} {localizedValue(item, "recommendation")}</strong>
                    <span>{statusLabel(item.status)} • {statusLabel(item.priority)} {t("priority")}</span>
                    <small>{statusLabel(item.status)}: {formatDateTime(item.completedAt || item.dismissedAt)}</small>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
        {cognitiveRisk && (
          <section className="caregiver-card cognitive-risk-card">
            <div className="caregiver-section-heading">
              <p className="eyebrow">{t("predictive").toUpperCase()}</p>
              <h2>🧠 {t("trend")}</h2>
              <p>{t("analyticsNote")}</p>
            </div>
            {!cognitiveRisk.sufficientData ? (
              <p className="cognitive-risk-insufficient">{t("insufficientData")} — {localizedValue(cognitiveRisk, "explanation")} ({cognitiveRisk.dataPoints} {t("completedSessionsAvailable")})</p>
            ) : (
              <>
                <div className="cognitive-risk-summary"><div><small>{t("overallTrend")}</small><strong className={cognitiveRisk.overallStatus.toLowerCase()}>{statusLabel(cognitiveRisk.overallStatus)}</strong></div><div><small>{t("riskLevel")}</small><strong className={cognitiveRisk.riskLevel.toLowerCase()}>{statusLabel(cognitiveRisk.riskLevel)}</strong></div><div><small>{t("confidence")}</small><strong>{cognitiveRisk.confidence}%</strong></div><div><small>{t("dataAvailable")}</small><strong>{cognitiveRisk.dataPoints} {t("recentSessions")}</strong></div></div>
                <p className="cognitive-risk-explanation">{localizedValue(cognitiveRisk, "explanation")}</p>
                <div className="cognitive-risk-trends">{cognitiveRisk.activityTrends.map((trend) => <div key={trend.gameType}><strong>{activityLabel(trend.activityCode || trend.name)}</strong><span className={trend.status.toLowerCase().replace(" ", "-")}>{statusLabel(trend.status)}</span>{trend.accuracyChange != null && <small>{trend.previousAccuracy}% → {trend.recentAccuracy}% ({trend.accuracyChange > 0 ? "+" : ""}{trend.accuracyChange}%)</small>}</div>)}</div>
              </>
            )}
          </section>
        )}

        {analytics && (
          <>
            <section className="caregiver-kpi-grid">
              <div className="caregiver-kpi-card">
                <span>🎮</span>
                <p>{t("gamesCompleted")}</p>
                <strong>{analytics.totalGames}</strong>
                <small>{t("totalSessions")}</small>
              </div>
              <div className="caregiver-kpi-card">
                <span>⭐</span>
                <p>{t("averageScore")}</p>
                <strong>{analytics.averageScore}%</strong>
                <small>{t("acrossActivities")}</small>
              </div>
              <div className="caregiver-kpi-card">
                <span>🎯</span>
                <p>{t("averageAccuracy")}</p>
                <strong>{analytics.averageAccuracy}%</strong>
                <small>{t("averageAccuracy")}</small>
              </div>
              <div className="caregiver-kpi-card">
                <span>📋</span>
                <p>{t("adherence")}</p>
                <strong>
                  {adherence ? `${adherence.adherenceRate}%` : "—"}
                </strong>
                <small>{t("reminderCompletion")}</small>
              </div>
            </section>

            <section className="caregiver-card performance-overview-card">
              <div className="caregiver-section-heading">
                <p className="eyebrow">{t("performance").toUpperCase()}</p>
                <h2>{t("performanceOverview")}</h2>
                <p>{t("currentPerformance")}</p>
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
                <p className="eyebrow">{t("cognitiveTrend").toUpperCase()}</p>
                <h2>{t("progress")}</h2>
                <p>{t("recentAccuracy")}</p>
              </div>
              <div
                className={`trend-status-bar ${overallTrend.status.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {statusLabel(overallTrend.status)} <span>{overallTrend.icon}</span>
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
                        formatter={(value) => [`${value}%`, t("accuracy")]}
                      />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        name={t("accuracy")}
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
                    {t("noProgress")}
                  </div>
                )}
              </div>
            </section>

            <div className="caregiver-two-column">
              {activityRecommendation && (
                <section className="caregiver-card recommendation-card-new">
                  <div className="card-title-icon">💡</div>
                  <div>
                    <p className="eyebrow">{t("recommendation").toUpperCase()}</p>
                    <h2>{t("try")} {activityLabel(activityRecommendation.activity)}</h2>
                    <p>{localizedValue(activityRecommendation, "reason")}</p>
                    <strong className="recommended-level">{t("recommendedLevel")} {activityRecommendation.difficulty}</strong>
                  </div>
                </section>
              )}

              <section className="caregiver-card mood-card-new">
                <div className="caregiver-section-heading">
                  <p className="eyebrow">{t("wellbeing").toUpperCase()}</p>
                  <h2>{t("mood")}</h2>
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
                      <strong>{moodLabel(latestMood.mood, latestMood.label)}</strong>
                      <small>{formatDateTime(latestMood.createdAt)}</small>
                    </div>
                  </div>
                ) : (
                  <div className="caregiver-empty-state compact">
                    {t("noMood")}
                  </div>
                )}
              </section>
            </div>

            {smartAlerts.length > 0 && (
              <section className="caregiver-card smart-alerts-new">
                <div className="caregiver-section-heading">
                  <p className="eyebrow">{t("insights").toUpperCase()}</p>
                  <h2>{t("smartAlerts")}</h2>
                  <p>{t("alertsHelp")}</p>
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
                      <p className="eyebrow">{t("reminderAdherence").toUpperCase()}</p>
                      <h2>{t("reminders")}</h2>
                      <p>
                        {t("routineHelp")}
                      </p>
                    </div>
                    <div
                      className="adherence-circle-new"
                      style={{
                        "--adherence-progress": `${adherence.adherenceRate * 3.6}deg`,
                      }}
                    >
                      <strong>{adherence.adherenceRate}%</strong>
                      <span>{t("adherence")}</span>
                    </div>
                  </div>
                  <div className="adherence-stats-new">
                    <div>
                      <span>✅</span>
                      <strong>{adherence.completed}</strong>
                      <small>{t("completed")}</small>
                    </div>
                    <div>
                      <span>❌</span>
                      <strong>{adherence.missed}</strong>
                      <small>{t("missed")}</small>
                    </div>
                    <div>
                      <span>📋</span>
                      <strong>{adherence.total}</strong>
                      <small>{t("total")}</small>
                    </div>
                  </div>
                </section>

                <section className="caregiver-card reminder-history-card-new">
                  <div className="caregiver-section-heading inline-heading">
                    <div>
                      <p className="eyebrow">{t("reminderHistory").toUpperCase()}</p>
                      <h2>{t("recentReminders")}</h2>
                      <p>{t("reminderListHelp")}</p>
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
                                  t("reminder")}
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
                                ? t("completed")
                                : t("missed")}
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
                          {showAllReminderHistory ? t("showLess") : t("showAll")}
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="caregiver-empty-state compact">
                      {t("noReminderHistory")}
                    </div>
                  )}
                </section>
              </div>
            )}

            <section className="caregiver-card sessions-card-new">
              <div className="caregiver-section-heading">
                <p className="eyebrow">{t("activityHistory").toUpperCase()}</p>
                <h2>{t("recentSessions")}</h2>
                <p>
                  {t("activityHelp")}
                </p>
              </div>
              <div className="activity-filters-new">
                {[
                  ["all", t("all")],
                  ["memory", t("memory")],
                  ["attention", t("attention")],
                  ["routineRecall", t("routine")],
                  ["pattern", t("pattern")],
                  ["objectRecognition", t("objects")],
                  ["familyFamiliarity", t("family")],
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
                    name: t("cognitiveActivity"),
                    icon: "🧩",
                  };
                  return (
                    <div className="session-row-new" key={session.id}>
                      <span className="session-icon-new">{meta.icon}</span>
                      <div className="session-info-new">
                        <strong>{meta.name}</strong>
                        <small>
                          {t("level")} {session.difficulty} •{" "}
                          {formatDateTime(session.createdAt)}
                        </small>
                      </div>
                      <div className="session-score-new">
                        <strong>{session.score}%</strong>
                        <small>{t("score")}</small>
                      </div>
                    </div>
                  );
                })}
                {filteredSessions.length === 0 && (
                  <div className="caregiver-empty-state">
                    {t("noHistory")}
                  </div>
                )}
              </div>
              {filteredSessions.length > 8 && (
                <button className="view-history-button" type="button">
                  {t("viewAllSessions")} →
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
