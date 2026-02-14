"use client";
import { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316"];

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
    progress: "Progress",
    goalMet: "Goal met!",
    addExam: "Add Exam",
    examTitle: "Exam Title",
    examSubject: "Subject",
    examDate: "Date",
    examNotes: "Notes (optional)",
    examColor: "Color",
    add: "Add",
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
    progress: "التقدم",
    goalMet: "تم تحقيق الهدف!",
    addExam: "إضافة امتحان",
    examTitle: "عنوان الامتحان",
    examSubject: "المادة",
    examDate: "التاريخ",
    examNotes: "ملاحظات (اختياري)",
    examColor: "اللون",
    add: "إضافة",
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
  },
};

const formatDuration = (mins, t) => {
  if (mins < 60) return `${mins} ${t.minutes}`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h} ${t.hours} ${m} ${t.minutes}` : `${h} ${t.hours}`;
};

export default function StudyPlanner({ locale = "en", userId }) {
  const t = T[locale] || T.en;
  const isRTL = locale === "ar";

  const [tab, setTab] = useState("dashboard");
  const [analytics, setAnalytics] = useState(null);
  const [streak, setStreak] = useState(null);
  const [goals, setGoals] = useState([]);
  const [exams, setExams] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Forms
  const [sessionForm, setSessionForm] = useState({ subject: "", duration: 25, notes: "" });
  const [goalForm, setGoalForm] = useState({ type: "daily", targetMinutes: 60 });
  const [examForm, setExamForm] = useState({ title: "", subject: "", date: "", notes: "", color: "#3B82F6" });
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showExamForm, setShowExamForm] = useState(false);

  const fetchAll = useCallback(async () => {
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
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { if (userId) fetchAll(); }, [userId, fetchAll]);

  const logSession = async () => {
    if (!sessionForm.subject.trim() || sessionForm.duration < 1) return;
    setLoading(true);
    try {
      const res = await fetch("/api/study-hub/study-planner/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionForm),
      });
      if (res.ok) {
        // Update streak
        await fetch("/api/study-hub/study-planner/streak", { method: "POST" });
        setSessionForm({ subject: "", duration: 25, notes: "" });
        fetchAll();
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const saveGoal = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/study-hub/study-planner/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goalForm),
      });
      if (res.ok) { setShowGoalForm(false); fetchAll(); }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const addExam = async () => {
    if (!examForm.title.trim() || !examForm.subject.trim() || !examForm.date) return;
    setLoading(true);
    try {
      const res = await fetch("/api/study-hub/study-planner/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(examForm),
      });
      if (res.ok) { setShowExamForm(false); setExamForm({ title: "", subject: "", date: "", notes: "", color: "#3B82F6" }); fetchAll(); }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const deleteExam = async (id) => {
    try {
      await fetch(`/api/study-hub/study-planner/exams/${id}`, { method: "DELETE" });
      fetchAll();
    } catch (e) { console.error(e); }
  };

  const deleteSession = async (id) => {
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

  if (!userId) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
        <h3 style={{ marginBottom: 8, color: "var(--text-primary, #1a1a2e)" }}>{t.title}</h3>
        <p style={{ color: "var(--text-secondary, #666)" }}>{t.loginRequired}</p>
      </div>
    );
  }

  const dailyGoal = goals.find((g) => g.type === "daily");
  const weeklyGoal = goals.find((g) => g.type === "weekly");
  const todayMins = analytics?.totals?.today || 0;
  const weekMins = analytics?.totals?.week || 0;

  return (
    <div style={{ padding: "20px 0" }}>
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
            flex: 1, padding: "8px 14px", borderRadius: 8, border: "none", whiteSpace: "nowrap",
            background: tab === tb.key ? "var(--bg-primary, #fff)" : "transparent",
            color: tab === tb.key ? "var(--text-primary, #333)" : "var(--text-secondary, #888)",
            fontWeight: tab === tb.key ? 600 : 400, cursor: "pointer", fontSize: 13, transition: "all 0.2s",
            boxShadow: tab === tb.key ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          }}>{tb.label}</button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {tab === "dashboard" && (
        <div>
          {/* Stats Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 20 }}>
            {[
              { label: t.today, value: todayMins, icon: "📅", color: "#3B82F6" },
              { label: t.thisWeek, value: weekMins, icon: "📆", color: "#10B981" },
              { label: t.thisMonth, value: analytics?.totals?.month || 0, icon: "📊", color: "#F59E0B" },
              { label: t.streak, value: streak?.currentStreak || 0, icon: "🔥", color: "#EF4444", suffix: "" },
            ].map((s, i) => (
              <div key={i} style={{ padding: 16, borderRadius: 14, background: `${s.color}10`, border: `1px solid ${s.color}30`, textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>
                  {s.suffix !== undefined ? s.value : formatDuration(s.value, t)}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary, #888)", marginTop: 2 }}>{s.label}</div>
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
                    <span>{todayMins >= dailyGoal.targetMinutes ? t.goalMet : `${formatDuration(todayMins, t)} / ${formatDuration(dailyGoal.targetMinutes, t)}`}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: "var(--bg-secondary, #e5e7eb)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min(100, (todayMins / dailyGoal.targetMinutes) * 100)}%`, background: todayMins >= dailyGoal.targetMinutes ? "#10B981" : "#3B82F6", borderRadius: 4, transition: "width 0.5s" }} />
                  </div>
                </div>
              )}
              {weeklyGoal && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4, color: "var(--text-primary, #333)" }}>
                    <span>{t.weeklyGoal}: {formatDuration(weeklyGoal.targetMinutes, t)}</span>
                    <span>{weekMins >= weeklyGoal.targetMinutes ? t.goalMet : `${formatDuration(weekMins, t)} / ${formatDuration(weeklyGoal.targetMinutes, t)}`}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: "var(--bg-secondary, #e5e7eb)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min(100, (weekMins / weeklyGoal.targetMinutes) * 100)}%`, background: weekMins >= weeklyGoal.targetMinutes ? "#10B981" : "#8B5CF6", borderRadius: 4, transition: "width 0.5s" }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Weekly Bar Chart */}
          {analytics?.weeklyStats && (
            <div style={{ marginBottom: 20, padding: 16, borderRadius: 14, border: "1px solid var(--border, #e5e7eb)", background: "var(--bg-primary, #fff)" }}>
              <h3 style={{ margin: "0 0 12px", fontSize: 16, color: "var(--text-primary, #1a1a2e)" }}>{t.weeklyActivity}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analytics.weeklyStats}>
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
              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie data={analytics.subjectBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={false}>
                      {analytics.subjectBreakdown.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v} ${t.minutes}`]} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {analytics.subjectBreakdown.slice(0, 8).map((s, i) => (
                    <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS[i % COLORS.length] }} />
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

      {/* Log Session Tab */}
      {tab === "log" && (
        <div>
          <div style={{ background: "var(--bg-secondary, #f8f9fa)", borderRadius: 14, padding: 20, marginBottom: 20, border: "1px solid var(--border, #e5e7eb)" }}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary, #666)", display: "block", marginBottom: 4 }}>{t.subject}</label>
              <input value={sessionForm.subject} onChange={(e) => setSessionForm({ ...sessionForm, subject: e.target.value })} placeholder={t.subject}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border, #ddd)", background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", fontSize: 14, direction: isRTL ? "rtl" : "ltr", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary, #666)", display: "block", marginBottom: 4 }}>{t.duration}</label>
              <input type="number" min={1} max={1440} value={sessionForm.duration} onChange={(e) => setSessionForm({ ...sessionForm, duration: parseInt(e.target.value) || 0 })}
                style={{ width: 120, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border, #ddd)", background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", fontSize: 14 }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary, #666)", display: "block", marginBottom: 4 }}>{t.notes}</label>
              <textarea value={sessionForm.notes} onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })} rows={2}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border, #ddd)", background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", fontSize: 14, resize: "vertical", direction: isRTL ? "rtl" : "ltr", boxSizing: "border-box", fontFamily: "inherit" }} />
            </div>
            <button onClick={logSession} disabled={loading || !sessionForm.subject.trim()} style={{
              padding: "10px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #3B82F6, #2563EB)",
              color: "#fff", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontSize: 14,
            }}>
              {loading ? t.logging : t.log}
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
              {sessions.map((s) => (
                <div key={s.id} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border, #e5e7eb)", background: "var(--bg-primary, #fff)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary, #1a1a2e)" }}>{s.subject}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary, #888)" }}>
                      {formatDuration(s.duration, t)} · {new Date(s.date).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}
                      {s.source === "pomodoro" && <span style={{ marginLeft: 6, padding: "1px 6px", borderRadius: 4, background: "rgba(234,88,12,0.1)", color: "#EA580C", fontSize: 11 }}>{t.source_pomodoro}</span>}
                    </div>
                  </div>
                  <button onClick={() => deleteSession(s.id)} style={{ padding: "2px 8px", borderRadius: 4, border: "1px solid rgba(239,68,68,0.2)", background: "transparent", color: "#EF4444", fontSize: 11, cursor: "pointer" }}>
                    {t.delete}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Goals Tab */}
      {tab === "goals" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, color: "var(--text-primary, #1a1a2e)" }}>{t.goals}</h3>
            <button onClick={() => setShowGoalForm(!showGoalForm)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "#3B82F6", color: "#fff", cursor: "pointer", fontSize: 13 }}>
              + {t.setGoal}
            </button>
          </div>

          {showGoalForm && (
            <div style={{ background: "var(--bg-secondary, #f8f9fa)", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid var(--border, #e5e7eb)" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {["daily", "weekly"].map((type) => (
                  <button key={type} onClick={() => setGoalForm({ ...goalForm, type })} style={{
                    padding: "6px 14px", borderRadius: 8, border: `1px solid ${goalForm.type === type ? "#3B82F6" : "var(--border, #ddd)"}`,
                    background: goalForm.type === type ? "rgba(59,130,246,0.1)" : "var(--bg-primary, #fff)",
                    color: "var(--text-primary, #333)", cursor: "pointer", fontSize: 13,
                  }}>
                    {type === "daily" ? t.dailyGoal : t.weeklyGoal}
                  </button>
                ))}
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, color: "var(--text-secondary, #666)", display: "block", marginBottom: 4 }}>{t.targetMinutes}</label>
                <input type="number" min={1} value={goalForm.targetMinutes} onChange={(e) => setGoalForm({ ...goalForm, targetMinutes: parseInt(e.target.value) || 0 })}
                  style={{ width: 120, padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border, #ddd)", background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)" }} />
              </div>
              <button onClick={saveGoal} disabled={loading} style={{ padding: "6px 16px", borderRadius: 8, border: "none", background: "#3B82F6", color: "#fff", cursor: "pointer", fontSize: 13 }}>{t.save}</button>
            </div>
          )}

          {/* Current goals */}
          {goals.length === 0 ? (
            <div style={{ textAlign: "center", padding: 30, color: "var(--text-secondary, #888)" }}>
              <p>{t.setGoal}</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {goals.map((goal) => {
                const current = goal.type === "daily" ? todayMins : weekMins;
                const pct = Math.min(100, (current / goal.targetMinutes) * 100);
                const met = current >= goal.targetMinutes;
                return (
                  <div key={goal.id} style={{ padding: 16, borderRadius: 12, border: `1px solid ${met ? "rgba(16,185,129,0.3)" : "var(--border, #e5e7eb)"}`, background: met ? "rgba(16,185,129,0.05)" : "var(--bg-primary, #fff)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, color: "var(--text-primary, #333)" }}>
                      <span style={{ fontWeight: 600 }}>{goal.type === "daily" ? t.dailyGoal : t.weeklyGoal}</span>
                      <span>{met ? t.goalMet : `${Math.round(pct)}%`}</span>
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
            <div style={{ marginTop: 20, padding: 20, borderRadius: 14, background: "linear-gradient(135deg, rgba(239,68,68,0.05), rgba(249,115,22,0.05))", border: "1px solid rgba(239,68,68,0.15)", textAlign: "center" }}>
              <div style={{ fontSize: 40 }}>🔥</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#EF4444" }}>{streak.currentStreak}</div>
              <div style={{ fontSize: 14, color: "var(--text-primary, #333)" }}>{t.streak}</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary, #888)", marginTop: 4 }}>{t.longestStreak}: {streak.longestStreak}</div>
            </div>
          )}
        </div>
      )}

      {/* Exams Tab */}
      {tab === "exams" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, color: "var(--text-primary, #1a1a2e)" }}>{t.exams}</h3>
            <button onClick={() => setShowExamForm(!showExamForm)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "#EF4444", color: "#fff", cursor: "pointer", fontSize: 13 }}>
              + {t.addExam}
            </button>
          </div>

          {showExamForm && (
            <div style={{ background: "var(--bg-secondary, #f8f9fa)", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid var(--border, #e5e7eb)" }}>
              <input value={examForm.title} onChange={(e) => setExamForm({ ...examForm, title: e.target.value })} placeholder={t.examTitle}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border, #ddd)", marginBottom: 8, background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", fontSize: 14, direction: isRTL ? "rtl" : "ltr", boxSizing: "border-box" }} />
              <input value={examForm.subject} onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })} placeholder={t.examSubject}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border, #ddd)", marginBottom: 8, background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", fontSize: 14, direction: isRTL ? "rtl" : "ltr", boxSizing: "border-box" }} />
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input type="date" value={examForm.date} onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
                  style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border, #ddd)", background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", fontSize: 14 }} />
                <input type="color" value={examForm.color} onChange={(e) => setExamForm({ ...examForm, color: e.target.value })}
                  style={{ width: 40, height: 38, borderRadius: 8, border: "1px solid var(--border, #ddd)", cursor: "pointer", padding: 2 }} />
              </div>
              <button onClick={addExam} disabled={loading} style={{ padding: "6px 16px", borderRadius: 8, border: "none", background: "#EF4444", color: "#fff", cursor: "pointer", fontSize: 13 }}>{t.add}</button>
            </div>
          )}

          {exams.length === 0 ? (
            <div style={{ textAlign: "center", padding: 30, color: "var(--text-secondary, #888)" }}>
              <p>{t.noExams}</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {exams.map((exam) => {
                const countdown = getExamCountdown(exam.date);
                return (
                  <div key={exam.id} style={{
                    padding: 16, borderRadius: 12, border: `1px solid ${exam.color}30`, background: "var(--bg-primary, #fff)",
                    borderLeft: `4px solid ${exam.color}`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 16, color: "var(--text-primary, #1a1a2e)" }}>{exam.title}</div>
                        <div style={{ fontSize: 13, color: "var(--text-secondary, #888)", marginTop: 2 }}>
                          {exam.subject} · {new Date(exam.date).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}
                        </div>
                        {exam.notes && <div style={{ fontSize: 12, color: "var(--text-secondary, #aaa)", marginTop: 4 }}>{exam.notes}</div>}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: countdown.color }}>{countdown.text}</div>
                        <button onClick={() => deleteExam(exam.id)} style={{ padding: "2px 8px", borderRadius: 4, border: "1px solid rgba(239,68,68,0.2)", background: "transparent", color: "#EF4444", fontSize: 11, cursor: "pointer", marginTop: 4 }}>
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
