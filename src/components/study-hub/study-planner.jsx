"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316"];

const DURATION_PRESETS = [15, 25, 45, 60, 90, 120];

const DAY_NAMES = {
  en: { Sun: "Sun", Mon: "Mon", Tue: "Tue", Wed: "Wed", Thu: "Thu", Fri: "Fri", Sat: "Sat" },
  ar: { Sun: "أحد", Mon: "إثن", Tue: "ثلا", Wed: "أرب", Thu: "خمي", Fri: "جمع", Sat: "سبت" },
};

const T = {
  en: {
    title: "Study Planner",
    subtitle: "Track your study habits and reach your goals",
    dashboard: "Dashboard",
    logSession: "Log Session",
    goals: "Goals",
    exams: "Exams",
    today: "Today",
    thisWeek: "This Week",
    thisMonth: "This Month",
    allTime: "All Time",
    minutes: "min",
    hours: "hrs",
    streak: "Day Streak",
    longestStreak: "Longest",
    subject: "Subject",
    duration: "Duration (min)",
    notes: "Notes (optional)",
    log: "Log Study Session",
    logging: "Logging...",
    logged: "Study session logged!",
    weeklyActivity: "Weekly Activity",
    subjectBreakdown: "Subject Breakdown",
    studyHeatmap: "Study Heatmap",
    lessMore: "Less — More",
    setGoal: "Set Goal",
    dailyGoal: "Daily Goal",
    weeklyGoal: "Weekly Goal",
    targetMinutes: "Target (minutes)",
    save: "Save",
    saving: "Saving...",
    progress: "Progress",
    goalMet: "Goal met!",
    addExam: "Add Exam",
    examTitle: "Exam Title",
    examSubject: "Subject",
    examDate: "Date",
    examNotes: "Notes (optional)",
    examColor: "Color",
    add: "Add",
    adding: "Adding...",
    delete: "Delete",
    daysLeft: "days left",
    daysAgo: "days ago",
    todayLabel: "Today!",
    tomorrowLabel: "Tomorrow",
    noExams: "No upcoming exams. Add one to start the countdown!",
    loginRequired: "Please sign in to use the Study Planner",
    recentSessions: "Recent Sessions",
    noSessions: "No study sessions yet. Log your first one!",
    source_manual: "Manual",
    source_pomodoro: "Pomodoro",
    loading: "Loading study planner...",
    error: "Failed to load study planner",
    retry: "Retry",
    quickDuration: "Quick select",
    goalSaved: "Goal saved!",
    examAdded: "Exam added!",
    confirmDeleteSession: "Delete this study session?",
    confirmDeleteExam: "Delete this exam?",
    removeGoal: "Remove",
    confirmRemoveGoal: "Remove this goal?",
    goalRemoved: "Goal removed",
    noGoals: "No goals set. Create one to track your progress!",
    sessionError: "Failed to log session",
    goalError: "Failed to save goal",
    examError: "Failed to add exam",
    replacesExisting: "Replaces current",
  },
  ar: {
    title: "مخطط الدراسة",
    subtitle: "تتبع عادات دراستك وحقق أهدافك",
    dashboard: "لوحة التحكم",
    logSession: "تسجيل جلسة",
    goals: "الأهداف",
    exams: "الامتحانات",
    today: "اليوم",
    thisWeek: "هذا الأسبوع",
    thisMonth: "هذا الشهر",
    allTime: "الإجمالي",
    minutes: "دقيقة",
    hours: "ساعات",
    streak: "أيام متتالية",
    longestStreak: "الأطول",
    subject: "المادة",
    duration: "المدة (دقائق)",
    notes: "ملاحظات (اختياري)",
    log: "تسجيل جلسة دراسة",
    logging: "جاري التسجيل...",
    logged: "تم تسجيل الجلسة!",
    weeklyActivity: "النشاط الأسبوعي",
    subjectBreakdown: "توزيع المواد",
    studyHeatmap: "خريطة الدراسة الحرارية",
    lessMore: "أقل — أكثر",
    setGoal: "تعيين هدف",
    dailyGoal: "هدف يومي",
    weeklyGoal: "هدف أسبوعي",
    targetMinutes: "الهدف (دقائق)",
    save: "حفظ",
    saving: "جاري الحفظ...",
    progress: "التقدم",
    goalMet: "تم تحقيق الهدف!",
    addExam: "إضافة امتحان",
    examTitle: "عنوان الامتحان",
    examSubject: "المادة",
    examDate: "التاريخ",
    examNotes: "ملاحظات (اختياري)",
    examColor: "اللون",
    add: "إضافة",
    adding: "جاري الإضافة...",
    delete: "حذف",
    daysLeft: "يوم متبقي",
    daysAgo: "يوم مضى",
    todayLabel: "اليوم!",
    tomorrowLabel: "غداً",
    noExams: "لا توجد امتحانات قادمة. أضف واحداً لبدء العد التنازلي!",
    loginRequired: "يرجى تسجيل الدخول لاستخدام مخطط الدراسة",
    recentSessions: "الجلسات الأخيرة",
    noSessions: "لا توجد جلسات دراسة بعد. سجّل أول جلسة!",
    source_manual: "يدوي",
    source_pomodoro: "بومودورو",
    loading: "جاري تحميل مخطط الدراسة...",
    error: "فشل تحميل مخطط الدراسة",
    retry: "إعادة المحاولة",
    quickDuration: "اختيار سريع",
    goalSaved: "تم حفظ الهدف!",
    examAdded: "تم إضافة الامتحان!",
    confirmDeleteSession: "حذف هذه الجلسة الدراسية؟",
    confirmDeleteExam: "حذف هذا الامتحان؟",
    removeGoal: "إزالة",
    confirmRemoveGoal: "إزالة هذا الهدف؟",
    goalRemoved: "تم إزالة الهدف",
    noGoals: "لا توجد أهداف. أنشئ واحداً لتتبع تقدمك!",
    sessionError: "فشل تسجيل الجلسة",
    goalError: "فشل حفظ الهدف",
    examError: "فشل إضافة الامتحان",
    replacesExisting: "يحل محل الحالي",
  },
};

const formatDuration = (mins, t) => {
  if (mins < 60) return `${mins} ${t.minutes}`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h} ${t.hours} ${m} ${t.minutes}` : `${h} ${t.hours}`;
};

/* ── keyframes ── */
const spKf = `
@keyframes sp-fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes sp-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
@keyframes sp-spin { to { transform: rotate(360deg); } }
@keyframes sp-toast { 0% { opacity: 0; transform: translateY(12px); } 10% { opacity: 1; transform: translateY(0); } 85% { opacity: 1; } 100% { opacity: 0; transform: translateY(-8px); } }
`;

export default function StudyPlanner({ locale = "en", userId }) {
  const t = T[locale] || T.en;
  const isRTL = locale === "ar";
  const dayNames = DAY_NAMES[locale] || DAY_NAMES.en;

  const [tab, setTab] = useState("dashboard");
  const [analytics, setAnalytics] = useState(null);
  const [streak, setStreak] = useState(null);
  const [goals, setGoals] = useState([]);
  const [exams, setExams] = useState([]);
  const [sessions, setSessions] = useState([]);

  // Loading & error
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // "session" | "goal" | "exam" | null

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Forms
  const [sessionForm, setSessionForm] = useState({ subject: "", duration: 25, notes: "" });
  const [goalForm, setGoalForm] = useState({ type: "daily", targetMinutes: 60 });
  const [examForm, setExamForm] = useState({ title: "", subject: "", date: "", notes: "", color: "#3B82F6" });
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showExamForm, setShowExamForm] = useState(false);

  const fetchAll = useCallback(async (isInitial = false) => {
    if (isInitial) { setInitialLoading(true); setFetchError(null); }
    try {
      const [analyticsRes, streakRes, goalsRes, examsRes, sessionsRes] = await Promise.all([
        fetch("/api/study-hub/study-planner/analytics"),
        fetch("/api/study-hub/study-planner/streak"),
        fetch("/api/study-hub/study-planner/goals"),
        fetch("/api/study-hub/study-planner/exams"),
        fetch("/api/study-hub/study-planner/sessions?limit=20"),
      ]);

      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
      if (streakRes.ok) { const d = await streakRes.json(); setStreak(d.streak); }
      if (goalsRes.ok) { const d = await goalsRes.json(); setGoals(d.goals || []); }
      if (examsRes.ok) { const d = await examsRes.json(); setExams(d.exams || []); }
      if (sessionsRes.ok) { const d = await sessionsRes.json(); setSessions(d.sessions || []); }
      setFetchError(null);
    } catch (e) {
      console.error(e);
      if (isInitial) setFetchError(e.message || "Unknown error");
    } finally {
      if (isInitial) setInitialLoading(false);
    }
  }, []);

  useEffect(() => { if (userId) fetchAll(true); }, [userId, fetchAll]);

  const logSession = async () => {
    if (!sessionForm.subject.trim() || sessionForm.duration < 1) return;
    setActionLoading("session");
    try {
      const res = await fetch("/api/study-hub/study-planner/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionForm),
      });
      if (res.ok) {
        await fetch("/api/study-hub/study-planner/streak", { method: "POST" });
        const subjectKept = sessionForm.subject;
        setSessionForm({ subject: subjectKept, duration: 25, notes: "" });
        showToast(t.logged);
        fetchAll();
      } else {
        const d = await res.json().catch(() => null);
        showToast(d?.error || t.sessionError, "error");
      }
    } catch (e) {
      console.error(e);
      showToast(t.sessionError, "error");
    }
    setActionLoading(null);
  };

  const saveGoal = async () => {
    if (goalForm.targetMinutes < 1) return;
    setActionLoading("goal");
    try {
      const res = await fetch("/api/study-hub/study-planner/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goalForm),
      });
      if (res.ok) {
        setShowGoalForm(false);
        showToast(t.goalSaved);
        fetchAll();
      } else {
        const d = await res.json().catch(() => null);
        showToast(d?.error || t.goalError, "error");
      }
    } catch (e) {
      console.error(e);
      showToast(t.goalError, "error");
    }
    setActionLoading(null);
  };

  const removeGoal = async (goalId) => {
    if (!confirm(t.confirmRemoveGoal)) return;
    try {
      const res = await fetch(`/api/study-hub/study-planner/goals?id=${goalId}`, { method: "DELETE" });
      if (res.ok) {
        showToast(t.goalRemoved);
        fetchAll();
      }
    } catch (e) { console.error(e); }
  };

  const addExam = async () => {
    if (!examForm.title.trim() || !examForm.subject.trim() || !examForm.date) return;
    setActionLoading("exam");
    try {
      const res = await fetch("/api/study-hub/study-planner/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(examForm),
      });
      if (res.ok) {
        setShowExamForm(false);
        setExamForm({ title: "", subject: "", date: "", notes: "", color: "#3B82F6" });
        showToast(t.examAdded);
        fetchAll();
      } else {
        const d = await res.json().catch(() => null);
        showToast(d?.error || t.examError, "error");
      }
    } catch (e) {
      console.error(e);
      showToast(t.examError, "error");
    }
    setActionLoading(null);
  };

  const deleteExam = async (id) => {
    if (!confirm(t.confirmDeleteExam)) return;
    try {
      await fetch(`/api/study-hub/study-planner/exams/${id}`, { method: "DELETE" });
      fetchAll();
    } catch (e) { console.error(e); }
  };

  const deleteSession = async (id) => {
    if (!confirm(t.confirmDeleteSession)) return;
    try {
      await fetch(`/api/study-hub/study-planner/sessions/${id}`, { method: "DELETE" });
      fetchAll();
    } catch (e) { console.error(e); }
  };

  const getExamCountdown = (date) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const examDate = new Date(date);
    examDate.setHours(0, 0, 0, 0);
    const diff = Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return { text: t.todayLabel, color: "#EF4444", urgent: true };
    if (diff === 1) return { text: t.tomorrowLabel, color: "#F97316", urgent: true };
    if (diff > 0) return { text: `${diff} ${t.daysLeft}`, color: diff <= 7 ? "#F97316" : "#3B82F6", urgent: diff <= 3 };
    return { text: `${Math.abs(diff)} ${t.daysAgo}`, color: "#9CA3AF", urgent: false };
  };

  // Translate weekly chart day names
  const translatedWeeklyStats = useMemo(() => {
    if (!analytics?.weeklyStats) return null;
    return analytics.weeklyStats.map((d) => ({
      ...d,
      name: dayNames[d.name] || d.name,
    }));
  }, [analytics?.weeklyStats, dayNames]);

  const dailyGoal = goals.find((g) => g.type === "daily");
  const weeklyGoal = goals.find((g) => g.type === "weekly");
  const todayMins = analytics?.totals?.today || 0;
  const weekMins = analytics?.totals?.week || 0;

  // Login gate
  if (!userId) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
        <h3 style={{ marginBottom: 8, color: "var(--text-primary, #1a1a2e)" }}>{t.title}</h3>
        <p style={{ color: "var(--text-secondary, #666)" }}>{t.loginRequired}</p>
      </div>
    );
  }

  // Initial loading
  if (initialLoading) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <style>{spKf}</style>
        <div style={{ width: 36, height: 36, border: "3px solid #e5e7eb", borderTopColor: "#3B82F6", borderRadius: "50%", animation: "sp-spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "var(--text-secondary, #888)", fontSize: 14 }}>{t.loading}</p>
      </div>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h3 style={{ marginBottom: 8, color: "var(--text-primary, #1a1a2e)" }}>{t.error}</h3>
        <button onClick={() => fetchAll(true)} style={{
          padding: "10px 24px", borderRadius: 10, border: "none", fontFamily: "inherit",
          background: "linear-gradient(135deg, #3B82F6, #2563EB)", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14,
        }}>{t.retry}</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 0", direction: isRTL ? "rtl" : "ltr" }}>
      <style>{spKf}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 9999,
          padding: "10px 20px", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 600,
          background: toast.type === "error" ? "#EF4444" : "#10B981",
          animation: "sp-toast 3s ease forwards", boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}>{toast.msg}</div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, color: "var(--text-primary, #1a1a2e)" }}>📊 {t.title}</h2>
        <p style={{ margin: "4px 0 0", fontSize: 14, color: "var(--text-secondary, #888)" }}>{t.subtitle}</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "var(--bg-secondary, #f0f0f0)", borderRadius: 10, padding: 3, overflowX: "auto" }}>
        {[
          { key: "dashboard", label: t.dashboard },
          { key: "log", label: t.logSession },
          { key: "goals", label: t.goals },
          { key: "exams", label: t.exams },
        ].map((tb) => (
          <button key={tb.key} onClick={() => setTab(tb.key)} style={{
            flex: 1, padding: "8px 14px", borderRadius: 8, border: "none", whiteSpace: "nowrap", fontFamily: "inherit",
            background: tab === tb.key ? "var(--bg-primary, #fff)" : "transparent",
            color: tab === tb.key ? "var(--text-primary, #333)" : "var(--text-secondary, #888)",
            fontWeight: tab === tb.key ? 600 : 400, cursor: "pointer", fontSize: 13, transition: "all 0.2s",
            boxShadow: tab === tb.key ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          }}>{tb.label}</button>
        ))}
      </div>

      {/* ── Dashboard Tab ── */}
      {tab === "dashboard" && (
        <div style={{ animation: "sp-fadeIn 0.3s ease" }}>
          {/* Stats Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 20 }}>
            {[
              { label: t.today, value: todayMins, icon: "📅", color: "#3B82F6" },
              { label: t.thisWeek, value: weekMins, icon: "📆", color: "#10B981" },
              { label: t.thisMonth, value: analytics?.totals?.month || 0, icon: "📊", color: "#F59E0B" },
              { label: t.streak, value: streak?.currentStreak || 0, icon: "🔥", color: "#EF4444", isStreak: true },
            ].map((s, i) => (
              <div key={i} style={{
                padding: 16, borderRadius: 14, background: `${s.color}10`, border: `1px solid ${s.color}30`, textAlign: "center",
                animation: `sp-fadeIn 0.3s ease ${i * 0.05}s both`,
              }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>
                  {s.isStreak ? s.value : formatDuration(s.value, t)}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary, #888)", marginTop: 2 }}>{s.label}</div>
                {s.isStreak && streak?.longestStreak > 0 && (
                  <div style={{ fontSize: 11, color: "var(--text-secondary, #aaa)", marginTop: 2 }}>
                    {t.longestStreak}: {streak.longestStreak}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Goal Progress */}
          {(dailyGoal || weeklyGoal) && (
            <div style={{ marginBottom: 20 }}>
              {dailyGoal && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4, color: "var(--text-primary, #333)" }}>
                    <span>{t.dailyGoal}: {formatDuration(dailyGoal.targetMinutes, t)}</span>
                    <span style={todayMins >= dailyGoal.targetMinutes ? { color: "#10B981", fontWeight: 600 } : {}}>
                      {todayMins >= dailyGoal.targetMinutes ? t.goalMet : `${formatDuration(todayMins, t)} / ${formatDuration(dailyGoal.targetMinutes, t)}`}
                    </span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: "var(--bg-secondary, #e5e7eb)", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: `${Math.min(100, (todayMins / dailyGoal.targetMinutes) * 100)}%`,
                      background: todayMins >= dailyGoal.targetMinutes ? "#10B981" : "#3B82F6", borderRadius: 4, transition: "width 0.5s",
                    }} />
                  </div>
                </div>
              )}
              {weeklyGoal && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4, color: "var(--text-primary, #333)" }}>
                    <span>{t.weeklyGoal}: {formatDuration(weeklyGoal.targetMinutes, t)}</span>
                    <span style={weekMins >= weeklyGoal.targetMinutes ? { color: "#10B981", fontWeight: 600 } : {}}>
                      {weekMins >= weeklyGoal.targetMinutes ? t.goalMet : `${formatDuration(weekMins, t)} / ${formatDuration(weeklyGoal.targetMinutes, t)}`}
                    </span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: "var(--bg-secondary, #e5e7eb)", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: `${Math.min(100, (weekMins / weeklyGoal.targetMinutes) * 100)}%`,
                      background: weekMins >= weeklyGoal.targetMinutes ? "#10B981" : "#8B5CF6", borderRadius: 4, transition: "width 0.5s",
                    }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Weekly Bar Chart */}
          {translatedWeeklyStats && (
            <div style={{ marginBottom: 20, padding: 16, borderRadius: 14, border: "1px solid var(--border, #e5e7eb)", background: "var(--bg-primary, #fff)" }}>
              <h3 style={{ margin: "0 0 12px", fontSize: 16, color: "var(--text-primary, #1a1a2e)" }}>{t.weeklyActivity}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={translatedWeeklyStats}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--text-secondary, #888)" }} />
                  <YAxis tick={{ fontSize: 12, fill: "var(--text-secondary, #888)" }} />
                  <Tooltip formatter={(v) => [`${v} ${t.minutes}`, t.duration]} />
                  <Bar dataKey="minutes" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Subject Pie Chart */}
          {analytics?.subjectBreakdown?.length > 0 && (
            <div style={{ marginBottom: 20, padding: 16, borderRadius: 14, border: "1px solid var(--border, #e5e7eb)", background: "var(--bg-primary, #fff)" }}>
              <h3 style={{ margin: "0 0 12px", fontSize: 16, color: "var(--text-primary, #1a1a2e)" }}>{t.subjectBreakdown}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
                <div style={{ width: "100%", maxWidth: 220 }}>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={analytics.subjectBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={false}>
                        {analytics.subjectBreakdown.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => [`${v} ${t.minutes}`]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {analytics.subjectBreakdown.slice(0, 8).map((s, i) => (
                    <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                      <span style={{ color: "var(--text-primary, #333)" }}>{s.name}</span>
                      <span style={{ color: "var(--text-secondary, #888)" }}>({formatDuration(s.value, t)})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Heatmap */}
          {analytics?.heatmap && (
            <div style={{ marginBottom: 20, padding: 16, borderRadius: 14, border: "1px solid var(--border, #e5e7eb)", background: "var(--bg-primary, #fff)", overflowX: "auto" }}>
              <h3 style={{ margin: "0 0 12px", fontSize: 16, color: "var(--text-primary, #1a1a2e)" }}>{t.studyHeatmap}</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 2, maxWidth: 750 }}>
                {analytics.heatmap.slice(-180).map((day) => (
                  <div key={day.date} title={`${day.date}: ${day.minutes} ${t.minutes}`} style={{
                    width: 12, height: 12, borderRadius: 2,
                    background: ["var(--bg-secondary, #ebedf0)", "#9be9a8", "#40c463", "#30a14e", "#216e39"][day.level],
                  }} />
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, fontSize: 11, color: "var(--text-secondary, #888)" }}>
                <span>{t.lessMore.split("—")[0]}</span>
                {[0, 1, 2, 3, 4].map((l) => (
                  <div key={l} style={{ width: 10, height: 10, borderRadius: 2, background: ["var(--bg-secondary, #ebedf0)", "#9be9a8", "#40c463", "#30a14e", "#216e39"][l] }} />
                ))}
                <span>{t.lessMore.split("—")[1]}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Log Session Tab ── */}
      {tab === "log" && (
        <div style={{ animation: "sp-fadeIn 0.3s ease" }}>
          <div style={{ background: "var(--bg-secondary, #f8f9fa)", borderRadius: 14, padding: 20, marginBottom: 20, border: "1px solid var(--border, #e5e7eb)" }}>
            {/* Subject */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary, #666)", display: "block", marginBottom: 4 }}>{t.subject}</label>
              <input value={sessionForm.subject} onChange={(e) => setSessionForm({ ...sessionForm, subject: e.target.value })} placeholder={t.subject}
                style={{
                  width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border, #ddd)",
                  background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", fontSize: 14,
                  direction: isRTL ? "rtl" : "ltr", boxSizing: "border-box", fontFamily: "inherit",
                }} />
            </div>

            {/* Duration + quick presets */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary, #666)", display: "block", marginBottom: 4 }}>{t.duration}</label>
              <input type="number" min={1} max={1440} value={sessionForm.duration}
                onChange={(e) => setSessionForm({ ...sessionForm, duration: parseInt(e.target.value) || 0 })}
                style={{
                  width: 120, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border, #ddd)",
                  background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", fontSize: 14, fontFamily: "inherit",
                }} />
              <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                {DURATION_PRESETS.map((m) => (
                  <button key={m} type="button" onClick={() => setSessionForm({ ...sessionForm, duration: m })} style={{
                    padding: "4px 10px", borderRadius: 6, fontSize: 12, fontFamily: "inherit", cursor: "pointer",
                    border: sessionForm.duration === m ? "1px solid #3B82F6" : "1px solid var(--border, #ddd)",
                    background: sessionForm.duration === m ? "rgba(59,130,246,0.1)" : "var(--bg-primary, #fff)",
                    color: sessionForm.duration === m ? "#3B82F6" : "var(--text-secondary, #888)",
                    fontWeight: sessionForm.duration === m ? 600 : 400,
                  }}>
                    {m} {t.minutes}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary, #666)", display: "block", marginBottom: 4 }}>{t.notes}</label>
              <textarea value={sessionForm.notes} onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })} rows={2}
                style={{
                  width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border, #ddd)",
                  background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", fontSize: 14,
                  resize: "vertical", direction: isRTL ? "rtl" : "ltr", boxSizing: "border-box", fontFamily: "inherit",
                }} />
            </div>

            <button type="button" onClick={logSession} disabled={actionLoading === "session" || !sessionForm.subject.trim()} style={{
              padding: "10px 24px", borderRadius: 10, border: "none", fontFamily: "inherit",
              background: "linear-gradient(135deg, #3B82F6, #2563EB)",
              color: "#fff", fontWeight: 600, cursor: actionLoading === "session" ? "not-allowed" : "pointer",
              fontSize: 14, opacity: actionLoading === "session" ? 0.7 : 1,
            }}>
              {actionLoading === "session" ? t.logging : t.log}
            </button>
          </div>

          {/* Recent Sessions */}
          <h3 style={{ fontSize: 16, marginBottom: 12, color: "var(--text-primary, #1a1a2e)" }}>{t.recentSessions}</h3>
          {sessions.length === 0 ? (
            <div style={{ textAlign: "center", padding: 30, color: "var(--text-secondary, #888)" }}>
              <p>{t.noSessions}</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sessions.map((s, i) => (
                <div key={s.id} style={{
                  padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border, #e5e7eb)",
                  background: "var(--bg-primary, #fff)", display: "flex", alignItems: "center", justifyContent: "space-between",
                  animation: `sp-fadeIn 0.3s ease ${i * 0.03}s both`,
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary, #1a1a2e)" }}>{s.subject}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary, #888)" }}>
                      {formatDuration(s.duration, t)} · {new Date(s.date).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}
                      {s.source === "pomodoro" && (
                        <span style={{ marginInlineStart: 6, padding: "1px 6px", borderRadius: 4, background: "rgba(234,88,12,0.1)", color: "#EA580C", fontSize: 11 }}>
                          {t.source_pomodoro}
                        </span>
                      )}
                    </div>
                  </div>
                  <button type="button" onClick={() => deleteSession(s.id)} style={{
                    padding: "2px 8px", borderRadius: 4, border: "1px solid rgba(239,68,68,0.2)",
                    background: "transparent", color: "#EF4444", fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                  }}>
                    {t.delete}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Goals Tab ── */}
      {tab === "goals" && (
        <div style={{ animation: "sp-fadeIn 0.3s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, color: "var(--text-primary, #1a1a2e)" }}>{t.goals}</h3>
            <button type="button" onClick={() => setShowGoalForm(!showGoalForm)} style={{
              padding: "6px 14px", borderRadius: 8, border: "none", background: "#3B82F6",
              color: "#fff", cursor: "pointer", fontSize: 13, fontFamily: "inherit",
            }}>
              + {t.setGoal}
            </button>
          </div>

          {showGoalForm && (
            <div style={{ background: "var(--bg-secondary, #f8f9fa)", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid var(--border, #e5e7eb)" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {["daily", "weekly"].map((type) => {
                  const existingGoal = goals.find((g) => g.type === type);
                  return (
                    <button key={type} type="button" onClick={() => setGoalForm({ ...goalForm, type })} style={{
                      padding: "6px 14px", borderRadius: 8, fontFamily: "inherit", cursor: "pointer", fontSize: 13,
                      border: `1px solid ${goalForm.type === type ? "#3B82F6" : "var(--border, #ddd)"}`,
                      background: goalForm.type === type ? "rgba(59,130,246,0.1)" : "var(--bg-primary, #fff)",
                      color: "var(--text-primary, #333)",
                    }}>
                      {type === "daily" ? t.dailyGoal : t.weeklyGoal}
                      {existingGoal && <span style={{ fontSize: 11, color: "var(--text-secondary, #aaa)", display: "block" }}>({t.replacesExisting})</span>}
                    </button>
                  );
                })}
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, color: "var(--text-secondary, #666)", display: "block", marginBottom: 4 }}>{t.targetMinutes}</label>
                <input type="number" min={1} value={goalForm.targetMinutes} onChange={(e) => setGoalForm({ ...goalForm, targetMinutes: parseInt(e.target.value) || 0 })}
                  style={{
                    width: 120, padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border, #ddd)",
                    background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", fontFamily: "inherit",
                  }} />
              </div>
              <button type="button" onClick={saveGoal} disabled={actionLoading === "goal"} style={{
                padding: "6px 16px", borderRadius: 8, border: "none", background: "#3B82F6",
                color: "#fff", cursor: actionLoading === "goal" ? "not-allowed" : "pointer",
                fontSize: 13, fontFamily: "inherit", opacity: actionLoading === "goal" ? 0.7 : 1,
              }}>
                {actionLoading === "goal" ? t.saving : t.save}
              </button>
            </div>
          )}

          {/* Current goals */}
          {goals.length === 0 ? (
            <div style={{ textAlign: "center", padding: 30, color: "var(--text-secondary, #888)" }}>
              <p>{t.noGoals}</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {goals.map((goal) => {
                const current = goal.type === "daily" ? todayMins : weekMins;
                const pct = Math.min(100, (current / goal.targetMinutes) * 100);
                const met = current >= goal.targetMinutes;
                return (
                  <div key={goal.id} style={{
                    padding: 16, borderRadius: 12,
                    border: `1px solid ${met ? "rgba(16,185,129,0.3)" : "var(--border, #e5e7eb)"}`,
                    background: met ? "rgba(16,185,129,0.05)" : "var(--bg-primary, #fff)",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, color: "var(--text-primary, #333)" }}>
                      <span style={{ fontWeight: 600 }}>
                        {goal.type === "daily" ? t.dailyGoal : t.weeklyGoal}
                        {met && <span style={{ marginInlineStart: 6, fontSize: 16 }}>✅</span>}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span>{met ? t.goalMet : `${Math.round(pct)}%`}</span>
                        <button type="button" onClick={() => removeGoal(goal.id)} style={{
                          padding: "1px 6px", borderRadius: 4, border: "1px solid rgba(239,68,68,0.2)",
                          background: "transparent", color: "#EF4444", fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                        }}>
                          {t.removeGoal}
                        </button>
                      </div>
                    </div>
                    <div style={{ height: 10, borderRadius: 5, background: "var(--bg-secondary, #e5e7eb)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: met ? "#10B981" : "#3B82F6", borderRadius: 5, transition: "width 0.5s" }} />
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary, #888)", marginTop: 4 }}>
                      {formatDuration(current, t)} / {formatDuration(goal.targetMinutes, t)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Streak */}
          {streak && (
            <div style={{
              marginTop: 20, padding: 20, borderRadius: 14, textAlign: "center",
              background: "linear-gradient(135deg, rgba(239,68,68,0.05), rgba(249,115,22,0.05))",
              border: "1px solid rgba(239,68,68,0.15)",
            }}>
              <div style={{ fontSize: 40 }}>🔥</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#EF4444" }}>{streak.currentStreak}</div>
              <div style={{ fontSize: 14, color: "var(--text-primary, #333)" }}>{t.streak}</div>
              {streak.longestStreak > 0 && (
                <div style={{ fontSize: 12, color: "var(--text-secondary, #888)", marginTop: 4 }}>{t.longestStreak}: {streak.longestStreak}</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Exams Tab ── */}
      {tab === "exams" && (
        <div style={{ animation: "sp-fadeIn 0.3s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, color: "var(--text-primary, #1a1a2e)" }}>{t.exams}</h3>
            <button type="button" onClick={() => setShowExamForm(!showExamForm)} style={{
              padding: "6px 14px", borderRadius: 8, border: "none", background: "#EF4444",
              color: "#fff", cursor: "pointer", fontSize: 13, fontFamily: "inherit",
            }}>
              + {t.addExam}
            </button>
          </div>

          {showExamForm && (
            <div style={{ background: "var(--bg-secondary, #f8f9fa)", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid var(--border, #e5e7eb)" }}>
              <input value={examForm.title} onChange={(e) => setExamForm({ ...examForm, title: e.target.value })} placeholder={t.examTitle}
                style={{
                  width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border, #ddd)",
                  marginBottom: 8, background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)",
                  fontSize: 14, direction: isRTL ? "rtl" : "ltr", boxSizing: "border-box", fontFamily: "inherit",
                }} />
              <input value={examForm.subject} onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })} placeholder={t.examSubject}
                style={{
                  width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border, #ddd)",
                  marginBottom: 8, background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)",
                  fontSize: 14, direction: isRTL ? "rtl" : "ltr", boxSizing: "border-box", fontFamily: "inherit",
                }} />
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input type="date" value={examForm.date} onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
                  style={{
                    flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border, #ddd)",
                    background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", fontSize: 14, fontFamily: "inherit",
                  }} />
                <input type="color" value={examForm.color} onChange={(e) => setExamForm({ ...examForm, color: e.target.value })}
                  style={{ width: 40, height: 38, borderRadius: 8, border: "1px solid var(--border, #ddd)", cursor: "pointer", padding: 2 }} />
              </div>
              <button type="button" onClick={addExam} disabled={actionLoading === "exam"} style={{
                padding: "6px 16px", borderRadius: 8, border: "none", background: "#EF4444",
                color: "#fff", cursor: actionLoading === "exam" ? "not-allowed" : "pointer",
                fontSize: 13, fontFamily: "inherit", opacity: actionLoading === "exam" ? 0.7 : 1,
              }}>
                {actionLoading === "exam" ? t.adding : t.add}
              </button>
            </div>
          )}

          {exams.length === 0 ? (
            <div style={{ textAlign: "center", padding: 30, color: "var(--text-secondary, #888)" }}>
              <p>{t.noExams}</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {exams.map((exam, i) => {
                const countdown = getExamCountdown(exam.date);
                return (
                  <div key={exam.id} style={{
                    padding: 16, borderRadius: 12, border: `1px solid ${exam.color}30`,
                    background: "var(--bg-primary, #fff)",
                    borderInlineStart: `4px solid ${exam.color}`,
                    animation: `sp-fadeIn 0.3s ease ${i * 0.05}s both`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 16, color: "var(--text-primary, #1a1a2e)" }}>{exam.title}</div>
                        <div style={{ fontSize: 13, color: "var(--text-secondary, #888)", marginTop: 2 }}>
                          {exam.subject} · {new Date(exam.date).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}
                        </div>
                        {exam.notes && <div style={{ fontSize: 12, color: "var(--text-secondary, #aaa)", marginTop: 4 }}>{exam.notes}</div>}
                      </div>
                      <div style={{ textAlign: isRTL ? "left" : "right", flexShrink: 0, marginInlineStart: 12 }}>
                        <div style={{
                          fontSize: 16, fontWeight: 700, color: countdown.color,
                          animation: countdown.urgent ? "sp-pulse 2s ease infinite" : "none",
                        }}>
                          {countdown.text}
                        </div>
                        <button type="button" onClick={() => deleteExam(exam.id)} style={{
                          padding: "2px 8px", borderRadius: 4, border: "1px solid rgba(239,68,68,0.2)",
                          background: "transparent", color: "#EF4444", fontSize: 11, cursor: "pointer", marginTop: 4, fontFamily: "inherit",
                        }}>
                          {t.delete}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
