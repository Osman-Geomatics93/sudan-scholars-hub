"use client";
import { useState, useEffect, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316"];

const T = {
  en: {
    title: "AI Study Path",
    subtitle: "Personalized day-by-day study plan powered by AI",
    dashboard: "Dashboard",
    timeline: "Timeline",
    mastery: "Mastery",
    generating: "Generating your study path...",
    generateBtn: "Generate Study Path",
    regenerateBtn: "Regenerate Path",
    getStarted: "Get Started",
    emptyTitle: "No Active Study Path",
    emptyDesc: "Generate a personalized AI-powered study plan based on your study sessions, flashcards, exams, and goals.",
    duration: "Duration (days)",
    focusSubjects: "Focus Subjects (optional)",
    focusPlaceholder: "e.g. Mathematics, Physics",
    generate: "Generate",
    cancel: "Cancel",
    day: "Day",
    today: "Today",
    todaysPlan: "Today's Plan",
    subject: "Subject",
    topic: "Topic",
    description: "Description",
    durationMin: "min",
    complete: "Complete",
    struggled: "Struggled",
    skip: "Skip",
    completed: "Completed",
    skipped: "Skipped",
    struggled_status: "Struggled",
    pending: "Pending",
    progress: "Progress",
    weekOverview: "Week Overview",
    overallProgress: "Overall Progress",
    pathCompleted: "Path Completed!",
    pathCompletedDesc: "Congratulations! You finished your study path.",
    masteryOverview: "Mastery Overview",
    masteryBySubject: "Mastery by Subject",
    studyMinutes: "Study Minutes",
    flashcardAvg: "Flashcard Avg",
    pathCompletion: "Path Completion",
    noMasteryData: "No mastery data yet. Complete some study activities first.",
    suggestion: "Suggestion",
    suggestionStruggling: "You seem to be struggling with some topics. Consider reviewing the basics or trying different study methods.",
    suggestionSkipping: "You've skipped more than 30% of your days. Consider regenerating a lighter plan that better fits your schedule.",
    suggestionOnTrack: "Great progress! Keep up the momentum.",
    dates: "Dates",
    to: "to",
    daysCompleted: "days completed",
    totalDays: "total days",
    high: "High",
    normal: "Normal",
    low: "Low",
    study: "Study",
    review: "Review",
    practice: "Practice",
    "exam-prep": "Exam Prep",
    loginRequired: "Please sign in to use AI Study Path",
    errorGenerating: "Failed to generate study path. Please try again.",
    updating: "Updating...",
    overdue: "Overdue",
    radarTitle: "Subject Mastery Radar",
  },
  ar: {
    title: "مسار الدراسة الذكي",
    subtitle: "خطة دراسية يومية مخصصة بالذكاء الاصطناعي",
    dashboard: "لوحة التحكم",
    timeline: "الجدول الزمني",
    mastery: "الإتقان",
    generating: "جاري إنشاء مسار الدراسة...",
    generateBtn: "إنشاء مسار دراسي",
    regenerateBtn: "إعادة إنشاء المسار",
    getStarted: "ابدأ الآن",
    emptyTitle: "لا يوجد مسار دراسي نشط",
    emptyDesc: "أنشئ خطة دراسية مخصصة بالذكاء الاصطناعي بناءً على جلسات دراستك وبطاقاتك الذكية وامتحاناتك وأهدافك.",
    duration: "المدة (أيام)",
    focusSubjects: "المواد المركّزة (اختياري)",
    focusPlaceholder: "مثال: الرياضيات، الفيزياء",
    generate: "إنشاء",
    cancel: "إلغاء",
    day: "يوم",
    today: "اليوم",
    todaysPlan: "خطة اليوم",
    subject: "المادة",
    topic: "الموضوع",
    description: "الوصف",
    durationMin: "دقيقة",
    complete: "إكمال",
    struggled: "واجهت صعوبة",
    skip: "تخطي",
    completed: "مكتمل",
    skipped: "تم التخطي",
    struggled_status: "صعب",
    pending: "قيد الانتظار",
    progress: "التقدم",
    weekOverview: "نظرة الأسبوع",
    overallProgress: "التقدم العام",
    pathCompleted: "اكتمل المسار!",
    pathCompletedDesc: "تهانينا! أنهيت مسار الدراسة.",
    masteryOverview: "نظرة عامة على الإتقان",
    masteryBySubject: "الإتقان حسب المادة",
    studyMinutes: "دقائق الدراسة",
    flashcardAvg: "متوسط البطاقات",
    pathCompletion: "إكمال المسار",
    noMasteryData: "لا توجد بيانات إتقان بعد. أكمل بعض أنشطة الدراسة أولاً.",
    suggestion: "اقتراح",
    suggestionStruggling: "يبدو أنك تواجه صعوبة في بعض المواضيع. فكر في مراجعة الأساسيات أو تجربة طرق دراسة مختلفة.",
    suggestionSkipping: "لقد تخطيت أكثر من ٣٠٪ من أيامك. فكر في إعادة إنشاء خطة أخف تناسب جدولك.",
    suggestionOnTrack: "تقدم رائع! واصل الزخم.",
    dates: "التواريخ",
    to: "إلى",
    daysCompleted: "أيام مكتملة",
    totalDays: "إجمالي الأيام",
    high: "عالي",
    normal: "عادي",
    low: "منخفض",
    study: "دراسة",
    review: "مراجعة",
    practice: "تطبيق",
    "exam-prep": "تحضير امتحان",
    loginRequired: "يرجى تسجيل الدخول لاستخدام مسار الدراسة الذكي",
    errorGenerating: "فشل في إنشاء مسار الدراسة. حاول مرة أخرى.",
    updating: "جاري التحديث...",
    overdue: "متأخر",
    radarTitle: "رادار إتقان المواد",
  },
};

const STATUS_COLORS = {
  completed: { bg: "#DCFCE7", text: "#16A34A", border: "#86EFAC" },
  struggled: { bg: "#FEF3C7", text: "#D97706", border: "#FCD34D" },
  skipped: { bg: "#FEE2E2", text: "#DC2626", border: "#FCA5A5" },
  pending: { bg: "#F3F4F6", text: "#6B7280", border: "#D1D5DB" },
};

const PRIORITY_COLORS = { high: "#EF4444", normal: "#3B82F6", low: "#6B7280" };

const TASK_TYPE_ICONS = { study: "📖", review: "🔄", practice: "✏️", "exam-prep": "📝" };

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function isToday(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

function isPast(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return d < now;
}

export default function SmartStudyPath({ locale = "en", userId }) {
  const isRTL = locale === "ar";
  const t = T[locale] || T.en;

  const [tab, setTab] = useState("dashboard");
  const [path, setPath] = useState(null);
  const [mastery, setMastery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [updatingDay, setUpdatingDay] = useState(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [formDuration, setFormDuration] = useState(14);
  const [formFocus, setFormFocus] = useState("");
  const [error, setError] = useState("");

  const fetchPath = useCallback(async () => {
    try {
      const res = await fetch("/api/study-hub/smart-path");
      const data = await res.json();
      setPath(data.path || null);
    } catch {
      setPath(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMastery = useCallback(async () => {
    try {
      const res = await fetch("/api/study-hub/smart-path/mastery");
      const data = await res.json();
      setMastery(data.mastery || []);
    } catch {
      setMastery([]);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchPath();
      fetchMastery();
    } else {
      setLoading(false);
    }
  }, [userId, fetchPath, fetchMastery]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    try {
      const focusSubjects = formFocus.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await fetch("/api/study-hub/smart-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          durationDays: formDuration,
          focusSubjects: focusSubjects.length > 0 ? focusSubjects : undefined,
          language: locale,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setPath(data.path);
      setShowGenerateModal(false);
      setFormFocus("");
      fetchMastery();
    } catch (err) {
      setError(err.message || t.errorGenerating);
    } finally {
      setGenerating(false);
    }
  };

  const handleUpdateDay = async (dayId, status) => {
    setUpdatingDay(dayId);
    try {
      const res = await fetch(`/api/study-hub/smart-path/day/${dayId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      // Update local state
      setPath((prev) => {
        if (!prev) return prev;
        const updatedDays = prev.days.map((d) =>
          d.id === dayId ? { ...d, status, completedAt: status === "completed" ? new Date().toISOString() : null } : d
        );
        const allDone = updatedDays.every((d) => d.status !== "pending");
        return { ...prev, days: updatedDays, status: allDone ? "completed" : prev.status };
      });
      fetchMastery();
    } catch {
      // silently fail
    } finally {
      setUpdatingDay(null);
    }
  };

  if (!userId) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: "#888" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <p style={{ fontSize: 16, fontWeight: 600 }}>{t.loginRequired}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "48px 20px" }}>
        <div style={{ width: 44, height: 44, border: "4px solid #e8ddd0", borderTopColor: "#F59E0B", borderRadius: "50%", animation: "sp-spin 0.8s linear infinite" }} />
        <style>{`@keyframes sp-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Computed stats
  const days = path?.days || [];
  const completedDays = days.filter((d) => d.status === "completed").length;
  const struggledDays = days.filter((d) => d.status === "struggled").length;
  const skippedDays = days.filter((d) => d.status === "skipped").length;
  const totalDays = days.length;
  const progressPct = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
  const skippedPct = totalDays > 0 ? skippedDays / totalDays : 0;
  const struggledPct = totalDays > 0 ? struggledDays / totalDays : 0;

  const todayDay = days.find((d) => isToday(d.date)) || days.find((d) => d.status === "pending");

  // Week overview (next 7 days from today or first pending)
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const weekDays = days.filter((d) => {
    const dd = new Date(d.date);
    dd.setHours(0, 0, 0, 0);
    const diff = (dd - todayDate) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff < 7;
  });

  // Adaptive suggestion
  let suggestion = "";
  let suggestionType = "info";
  if (path && path.status !== "completed") {
    if (struggledPct > 0.2) {
      suggestion = t.suggestionStruggling;
      suggestionType = "warning";
    } else if (skippedPct > 0.3) {
      suggestion = t.suggestionSkipping;
      suggestionType = "danger";
    } else if (completedDays > 0) {
      suggestion = t.suggestionOnTrack;
      suggestionType = "success";
    }
  }

  // Subject mastery for radar chart
  const radarData = mastery.map((m) => ({
    subject: m.subject.length > 12 ? m.subject.slice(0, 12) + "…" : m.subject,
    mastery: m.masteryPct,
    fullMark: 100,
  }));

  // Mastery color
  const getMasteryColor = (pct) => {
    if (pct < 30) return "#EF4444";
    if (pct < 60) return "#F97316";
    if (pct < 80) return "#EAB308";
    return "#16A34A";
  };

  const S = {
    container: { direction: isRTL ? "rtl" : "ltr", maxWidth: 900, margin: "0 auto", padding: "0 16px 40px" },
    header: { textAlign: "center", marginBottom: 24, padding: "24px 0 0" },
    headerTitle: { fontSize: "clamp(20px, 4vw, 26px)", fontWeight: 800, margin: "0 0 6px", background: "linear-gradient(135deg, #F59E0B, #D97706)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
    headerSub: { fontSize: 14, color: "#888", margin: 0 },
    tabs: { display: "flex", gap: 4, justifyContent: "center", marginBottom: 24, flexWrap: "wrap" },
    tab: (active) => ({
      padding: "8px 18px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13,
      background: active ? "linear-gradient(135deg, #F59E0B, #D97706)" : "rgba(200,149,108,0.12)",
      color: active ? "#fff" : "#888", transition: "all 0.2s",
    }),
    card: { background: "rgba(200,149,108,0.06)", border: "1px solid rgba(200,149,108,0.15)", borderRadius: 16, padding: 20, marginBottom: 16 },
    cardTitle: { fontSize: 16, fontWeight: 700, margin: "0 0 12px", color: "var(--foreground, #222)" },
    progressBar: { width: "100%", height: 10, borderRadius: 8, background: "rgba(200,149,108,0.12)", overflow: "hidden" },
    progressFill: (pct, color = "#F59E0B") => ({ width: `${pct}%`, height: "100%", borderRadius: 8, background: `linear-gradient(90deg, ${color}, ${color}dd)`, transition: "width 0.5s ease" }),
    badge: (color) => ({
      display: "inline-block", padding: "2px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700,
      background: color.bg, color: color.text, border: `1px solid ${color.border}`,
    }),
    priorityDot: (color) => ({ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block", marginRight: isRTL ? 0 : 4, marginLeft: isRTL ? 4 : 0 }),
    btn: (bg) => ({
      padding: "8px 16px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13,
      background: bg, color: "#fff", transition: "all 0.2s",
    }),
    btnOutline: { padding: "8px 16px", borderRadius: 10, border: "1px solid rgba(200,149,108,0.3)", cursor: "pointer", fontWeight: 600, fontSize: 13, background: "transparent", color: "#888", transition: "all 0.2s" },
    emptyState: { textAlign: "center", padding: "60px 20px" },
    emptyIcon: { fontSize: 64, marginBottom: 16 },
    emptyTitle: { fontSize: 20, fontWeight: 700, color: "var(--foreground, #222)", margin: "0 0 8px" },
    emptyDesc: { fontSize: 14, color: "#888", margin: "0 0 24px", maxWidth: 400, marginInline: "auto" },
    modal: { position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", padding: 20 },
    modalCard: { background: "var(--background, #fff)", borderRadius: 20, padding: 24, width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" },
    input: { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(200,149,108,0.3)", fontSize: 14, outline: "none", background: "transparent", color: "var(--foreground, #222)", boxSizing: "border-box" },
    label: { display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, marginTop: 14, color: "#888" },
    dayCard: (isCurrentDay, status) => ({
      background: isCurrentDay ? "rgba(245,158,11,0.08)" : status !== "pending" ? STATUS_COLORS[status]?.bg + "22" : "rgba(200,149,108,0.04)",
      border: `1px solid ${isCurrentDay ? "rgba(245,158,11,0.3)" : status !== "pending" ? STATUS_COLORS[status]?.border : "rgba(200,149,108,0.12)"}`,
      borderRadius: 14, padding: 16, marginBottom: 10, transition: "all 0.2s",
    }),
    suggestion: (type) => ({
      background: type === "success" ? "rgba(16,163,127,0.08)" : type === "warning" ? "rgba(245,158,11,0.08)" : type === "danger" ? "rgba(239,68,68,0.08)" : "rgba(59,130,246,0.08)",
      border: `1px solid ${type === "success" ? "rgba(16,163,127,0.2)" : type === "warning" ? "rgba(245,158,11,0.2)" : type === "danger" ? "rgba(239,68,68,0.2)" : "rgba(59,130,246,0.2)"}`,
      borderRadius: 12, padding: "12px 16px", marginBottom: 16,
    }),
    weekCard: (status) => ({
      flex: "1 1 0", minWidth: 70, padding: "10px 6px", borderRadius: 12, textAlign: "center",
      background: STATUS_COLORS[status]?.bg || "rgba(200,149,108,0.06)",
      border: `1px solid ${STATUS_COLORS[status]?.border || "rgba(200,149,108,0.12)"}`,
    }),
    masteryCard: (color) => ({
      background: "rgba(200,149,108,0.04)", border: `1px solid rgba(200,149,108,0.12)`,
      borderRadius: 14, padding: 16, marginBottom: 10,
      borderLeft: isRTL ? "none" : `4px solid ${color}`,
      borderRight: isRTL ? `4px solid ${color}` : "none",
    }),
  };

  // === EMPTY STATE ===
  if (!path) {
    return (
      <div style={S.container}>
        <div style={S.header}>
          <h2 style={S.headerTitle}>{t.title}</h2>
          <p style={S.headerSub}>{t.subtitle}</p>
        </div>
        <div style={S.emptyState}>
          <div style={S.emptyIcon}>🎯</div>
          <h3 style={S.emptyTitle}>{t.emptyTitle}</h3>
          <p style={S.emptyDesc}>{t.emptyDesc}</p>
          <button style={S.btn("#F59E0B")} onClick={() => setShowGenerateModal(true)}>
            {t.getStarted}
          </button>
        </div>
        {showGenerateModal && renderGenerateModal()}
      </div>
    );
  }

  function renderGenerateModal() {
    return (
      <div style={S.modal} onClick={() => !generating && setShowGenerateModal(false)}>
        <div style={S.modalCard} onClick={(e) => e.stopPropagation()}>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px", color: "var(--foreground, #222)" }}>
            {t.generateBtn}
          </h3>
          <p style={{ fontSize: 13, color: "#888", margin: "0 0 16px" }}>{t.subtitle}</p>

          <label style={{ ...S.label, marginTop: 0 }}>{t.duration}</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input
              type="range" min={3} max={90} value={formDuration}
              onChange={(e) => setFormDuration(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: 14, fontWeight: 700, minWidth: 40, textAlign: "center", color: "var(--foreground, #222)" }}>
              {formDuration}
            </span>
          </div>

          <label style={S.label}>{t.focusSubjects}</label>
          <input
            type="text" value={formFocus}
            onChange={(e) => setFormFocus(e.target.value)}
            placeholder={t.focusPlaceholder}
            style={S.input}
          />

          {error && (
            <p style={{ color: "#EF4444", fontSize: 13, marginTop: 10 }}>{error}</p>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button
              style={{ ...S.btn("#F59E0B"), flex: 1, opacity: generating ? 0.7 : 1 }}
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? t.generating : t.generate}
            </button>
            <button style={{ ...S.btnOutline, flex: 0 }} onClick={() => setShowGenerateModal(false)} disabled={generating}>
              {t.cancel}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === DASHBOARD TAB ===
  function renderDashboard() {
    return (
      <>
        {/* Path header card */}
        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px", color: "var(--foreground, #222)" }}>{path.title}</h3>
              <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
                {t.dates}: {formatDate(path.startDate)} {t.to} {formatDate(path.endDate)}
              </p>
            </div>
            {path.status === "completed" ? (
              <span style={S.badge(STATUS_COLORS.completed)}>{t.pathCompleted}</span>
            ) : (
              <button style={S.btn("#D97706")} onClick={() => setShowGenerateModal(true)}>
                {t.regenerateBtn}
              </button>
            )}
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#888" }}>{t.overallProgress}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#F59E0B" }}>{progressPct}%</span>
            </div>
            <div style={S.progressBar}>
              <div style={S.progressFill(progressPct)} />
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: "#16A34A" }}>✓ {completedDays} {t.completed}</span>
              <span style={{ fontSize: 12, color: "#D97706" }}>⚠ {struggledDays} {t.struggled_status}</span>
              <span style={{ fontSize: 12, color: "#DC2626" }}>✕ {skippedDays} {t.skipped}</span>
              <span style={{ fontSize: 12, color: "#6B7280" }}>○ {totalDays - completedDays - struggledDays - skippedDays} {t.pending}</span>
            </div>
          </div>
        </div>

        {/* Path completed message */}
        {path.status === "completed" && (
          <div style={{ ...S.card, textAlign: "center", background: "rgba(16,163,127,0.06)", borderColor: "rgba(16,163,127,0.2)" }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px", color: "#16A34A" }}>{t.pathCompleted}</h3>
            <p style={{ fontSize: 14, color: "#888", margin: "0 0 16px" }}>{t.pathCompletedDesc}</p>
            <button style={S.btn("#F59E0B")} onClick={() => setShowGenerateModal(true)}>
              {t.generateBtn}
            </button>
          </div>
        )}

        {/* Today's plan */}
        {todayDay && path.status !== "completed" && (
          <div style={{ ...S.card, background: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>{TASK_TYPE_ICONS[todayDay.taskType] || "📖"}</span>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "var(--foreground, #222)" }}>
                {t.todaysPlan} — {t.day} {todayDay.dayNumber}
              </h3>
              <span style={S.priorityDot(PRIORITY_COLORS[todayDay.priority])} title={t[todayDay.priority]} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#D97706" }}>{todayDay.subject}</span>
              <span style={{ fontSize: 13, color: "#888", marginInline: 8 }}>·</span>
              <span style={{ fontSize: 13, color: "#888" }}>{todayDay.topic}</span>
            </div>
            <p style={{ fontSize: 14, color: "#666", margin: "0 0 12px", lineHeight: 1.5 }}>{todayDay.description}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: "#888" }}>⏱ {todayDay.durationMin} {t.durationMin}</span>
              <span style={S.badge({ bg: "rgba(245,158,11,0.1)", text: "#D97706", border: "rgba(245,158,11,0.3)" })}>
                {t[todayDay.taskType] || todayDay.taskType}
              </span>
            </div>
            {todayDay.status === "pending" && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  style={{ ...S.btn("#16A34A"), opacity: updatingDay === todayDay.id ? 0.7 : 1 }}
                  onClick={() => handleUpdateDay(todayDay.id, "completed")}
                  disabled={!!updatingDay}
                >
                  ✓ {t.complete}
                </button>
                <button
                  style={{ ...S.btn("#D97706"), opacity: updatingDay === todayDay.id ? 0.7 : 1 }}
                  onClick={() => handleUpdateDay(todayDay.id, "struggled")}
                  disabled={!!updatingDay}
                >
                  ⚠ {t.struggled}
                </button>
                <button
                  style={{ ...S.btnOutline, opacity: updatingDay === todayDay.id ? 0.7 : 1 }}
                  onClick={() => handleUpdateDay(todayDay.id, "skipped")}
                  disabled={!!updatingDay}
                >
                  ✕ {t.skip}
                </button>
              </div>
            )}
            {todayDay.status !== "pending" && (
              <span style={S.badge(STATUS_COLORS[todayDay.status])}>
                {t[todayDay.status] || todayDay.status}
              </span>
            )}
          </div>
        )}

        {/* Adaptive suggestion */}
        {suggestion && (
          <div style={S.suggestion(suggestionType)}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground, #222)" }}>💡 {t.suggestion}</span>
            <p style={{ fontSize: 13, color: "#666", margin: "4px 0 0" }}>{suggestion}</p>
            {suggestionType === "danger" && (
              <button style={{ ...S.btn("#D97706"), marginTop: 8, fontSize: 12 }} onClick={() => setShowGenerateModal(true)}>
                {t.regenerateBtn}
              </button>
            )}
          </div>
        )}

        {/* Mastery Radar Chart */}
        {radarData.length >= 3 && (
          <div style={S.card}>
            <h4 style={S.cardTitle}>{t.radarTitle}</h4>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(200,149,108,0.2)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#888" }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: "#888" }} />
                <Radar dataKey="mastery" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Week overview */}
        {weekDays.length > 0 && (
          <div style={S.card}>
            <h4 style={S.cardTitle}>{t.weekOverview}</h4>
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
              {weekDays.map((d) => (
                <div key={d.id} style={S.weekCard(d.status)}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: STATUS_COLORS[d.status]?.text || "#888" }}>
                    {t.day} {d.dayNumber}
                  </div>
                  <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>{formatDate(d.date)}</div>
                  <div style={{ fontSize: 16, marginTop: 4 }}>{TASK_TYPE_ICONS[d.taskType] || "📖"}</div>
                  <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>{d.subject.slice(0, 10)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  // === TIMELINE TAB ===
  function renderTimeline() {
    return (
      <>
        {days.map((d) => {
          const current = isToday(d.date);
          const overdue = d.status === "pending" && isPast(d.date) && !current;
          return (
            <div key={d.id} style={S.dayCard(current, d.status)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: current ? "#F59E0B" : "var(--foreground, #222)" }}>
                    {t.day} {d.dayNumber}
                  </span>
                  <span style={{ fontSize: 12, color: "#888" }}>{formatDate(d.date)}</span>
                  {current && <span style={S.badge({ bg: "rgba(245,158,11,0.15)", text: "#D97706", border: "rgba(245,158,11,0.3)" })}>{t.today}</span>}
                  {overdue && <span style={S.badge({ bg: "rgba(239,68,68,0.1)", text: "#DC2626", border: "rgba(239,68,68,0.3)" })}>{t.overdue}</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={S.priorityDot(PRIORITY_COLORS[d.priority])} title={t[d.priority]} />
                  <span style={S.badge(STATUS_COLORS[d.status])}>{t[d.status] || d.status}</span>
                </div>
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 16 }}>{TASK_TYPE_ICONS[d.taskType] || "📖"}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground, #222)" }}>{d.subject}</span>
                  <span style={S.badge({ bg: "rgba(200,149,108,0.1)", text: "#888", border: "rgba(200,149,108,0.2)" })}>
                    {t[d.taskType] || d.taskType}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "#666", margin: "2px 0", fontWeight: 500 }}>{d.topic}</p>
                <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0", lineHeight: 1.4 }}>{d.description}</p>
                <span style={{ fontSize: 12, color: "#888", marginTop: 6, display: "inline-block" }}>⏱ {d.durationMin} {t.durationMin}</span>
              </div>
              {d.status === "pending" && (
                <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                  <button
                    style={{ ...S.btn("#16A34A"), fontSize: 12, padding: "6px 12px", opacity: updatingDay === d.id ? 0.7 : 1 }}
                    onClick={() => handleUpdateDay(d.id, "completed")}
                    disabled={!!updatingDay}
                  >
                    ✓ {t.complete}
                  </button>
                  <button
                    style={{ ...S.btn("#D97706"), fontSize: 12, padding: "6px 12px", opacity: updatingDay === d.id ? 0.7 : 1 }}
                    onClick={() => handleUpdateDay(d.id, "struggled")}
                    disabled={!!updatingDay}
                  >
                    ⚠ {t.struggled}
                  </button>
                  <button
                    style={{ ...S.btnOutline, fontSize: 12, padding: "6px 12px", opacity: updatingDay === d.id ? 0.7 : 1 }}
                    onClick={() => handleUpdateDay(d.id, "skipped")}
                    disabled={!!updatingDay}
                  >
                    ✕ {t.skip}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </>
    );
  }

  // === MASTERY TAB ===
  function renderMastery() {
    if (mastery.length === 0) {
      return (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
          <p style={{ fontSize: 14, color: "#888" }}>{t.noMasteryData}</p>
        </div>
      );
    }

    const barData = mastery.map((m) => ({
      subject: m.subject.length > 15 ? m.subject.slice(0, 15) + "…" : m.subject,
      mastery: Math.round(m.masteryPct),
    }));

    return (
      <>
        {/* Bar Chart */}
        <div style={S.card}>
          <h4 style={S.cardTitle}>{t.masteryBySubject}</h4>
          <ResponsiveContainer width="100%" height={Math.max(200, mastery.length * 40)}>
            <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#888" }} />
              <YAxis type="category" dataKey="subject" width={100} tick={{ fontSize: 11, fill: "#888" }} />
              <Tooltip formatter={(v) => [`${v}%`, t.mastery]} />
              <Bar dataKey="mastery" radius={[0, 6, 6, 0]}>
                {barData.map((entry, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Subject cards */}
        {mastery.map((m, idx) => {
          const color = getMasteryColor(m.masteryPct);
          return (
            <div key={m.id || idx} style={S.masteryCard(color)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground, #222)" }}>{m.subject}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color }}>{Math.round(m.masteryPct)}%</span>
              </div>
              <div style={S.progressBar}>
                <div style={S.progressFill(m.masteryPct, color)} />
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
                <div style={{ fontSize: 12, color: "#888" }}>
                  <span style={{ fontWeight: 600 }}>{t.studyMinutes}:</span> {m.totalStudyMin || 0}
                </div>
                <div style={{ fontSize: 12, color: "#888" }}>
                  <span style={{ fontWeight: 600 }}>{t.flashcardAvg}:</span> {(m.avgFlashcardQ || 0).toFixed(1)}/5
                </div>
                <div style={{ fontSize: 12, color: "#888" }}>
                  <span style={{ fontWeight: 600 }}>{t.pathCompletion}:</span> {Math.round(m.masteryPct)}%
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  }

  return (
    <div style={S.container}>
      <div style={S.header}>
        <h2 style={S.headerTitle}>{t.title}</h2>
        <p style={S.headerSub}>{t.subtitle}</p>
      </div>

      {/* Tabs */}
      <div style={S.tabs}>
        {["dashboard", "timeline", "mastery"].map((tabId) => (
          <button key={tabId} style={S.tab(tab === tabId)} onClick={() => setTab(tabId)}>
            {tabId === "dashboard" ? "📊" : tabId === "timeline" ? "📅" : "🎯"} {t[tabId]}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "dashboard" && renderDashboard()}
      {tab === "timeline" && renderTimeline()}
      {tab === "mastery" && renderMastery()}

      {/* Generate Modal */}
      {showGenerateModal && renderGenerateModal()}
    </div>
  );
}
