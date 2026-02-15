"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";

// ── Translations ──
const T = {
  en: {
    title: "Focus Island",
    subtitle: "Your study world grows with you",
    level: "Level",
    growthPoints: "Growth Points",
    totalStudy: "Total Study Time",
    buildings: "Buildings",
    streak: "Streak",
    weather: "Weather",
    themes: "Island Themes",
    buildingGallery: "Building Gallery",
    unlocked: "Unlocked",
    locked: "Locked",
    requiresLevel: "Requires Level",
    currentTheme: "Current",
    minutes: "min",
    hours: "hrs",
    nextLevel: "to next level",
    levelUp: "Level Up!",
    forest: "Forest",
    ocean: "Ocean",
    desert: "Desert",
    space: "Space",
    sunny: "Sunny",
    "partly-sunny": "Partly Sunny",
    cloudy: "Cloudy",
    rainy: "Rainy",
    stormy: "Stormy",
    free: "Free",
    loading: "Loading island...",
    error: "Failed to load island",
    retry: "Retry",
    loginRequired: "Please sign in to use Focus Island",
    logStudy: "Log Study Time",
    logStudyDesc: "Record your study minutes to grow your island",
    studyMinutes: "Study Minutes",
    logBtn: "Log & Grow",
    logging: "Growing...",
    growthEarned: "Growth earned",
    pointsAwarded: "Points awarded",
    xp: "XP",
    congrats: "Congratulations!",
    reachedLevel: "You reached level",
    close: "Close",
    resetIsland: "Reset Island",
    resetConfirm: "Are you sure? This will reset your island to Level 1 and erase all progress. This cannot be undone.",
    resetBtn: "Reset Everything",
    resetting: "Resetting...",
    resetSuccess: "Island has been reset!",
    cancel: "Cancel",
    buildingNames: {
      "Small Tree": "Small Tree",
      "Flower Patch": "Flower Patch",
      "Cottage": "Cottage",
      "Pond": "Pond",
      "Library": "Library",
      "Lighthouse": "Lighthouse",
      "Garden Maze": "Garden Maze",
      "Observatory": "Observatory",
      "Castle": "Castle",
      "Dragon Nest": "Dragon Nest",
      "Legendary Statue": "Legendary Statue",
    },
  },
  ar: {
    title: "جزيرة التركيز",
    subtitle: "عالمك الدراسي ينمو معك",
    level: "المستوى",
    growthPoints: "نقاط النمو",
    totalStudy: "إجمالي وقت الدراسة",
    buildings: "المباني",
    streak: "السلسلة",
    weather: "الطقس",
    themes: "سمات الجزيرة",
    buildingGallery: "معرض المباني",
    unlocked: "مفتوح",
    locked: "مقفل",
    requiresLevel: "يتطلب المستوى",
    currentTheme: "الحالي",
    minutes: "د",
    hours: "س",
    nextLevel: "للمستوى التالي",
    levelUp: "ارتقاء!",
    forest: "غابة",
    ocean: "محيط",
    desert: "صحراء",
    space: "فضاء",
    sunny: "مشمس",
    "partly-sunny": "غائم جزئياً",
    cloudy: "غائم",
    rainy: "ممطر",
    stormy: "عاصف",
    free: "مجاني",
    loading: "جاري تحميل الجزيرة...",
    error: "فشل تحميل الجزيرة",
    retry: "إعادة المحاولة",
    loginRequired: "يرجى تسجيل الدخول لاستخدام جزيرة التركيز",
    logStudy: "تسجيل وقت الدراسة",
    logStudyDesc: "سجّل دقائق دراستك لتنمية جزيرتك",
    studyMinutes: "دقائق الدراسة",
    logBtn: "سجّل وانمُ",
    logging: "جاري النمو...",
    growthEarned: "نقاط النمو المكتسبة",
    pointsAwarded: "النقاط الممنوحة",
    xp: "خبرة",
    congrats: "تهانينا!",
    reachedLevel: "وصلت للمستوى",
    close: "إغلاق",
    resetIsland: "إعادة تعيين الجزيرة",
    resetConfirm: "هل أنت متأكد؟ سيتم إعادة جزيرتك إلى المستوى 1 ومسح كل التقدم. لا يمكن التراجع عن هذا.",
    resetBtn: "إعادة تعيين الكل",
    resetting: "جاري إعادة التعيين...",
    resetSuccess: "تمت إعادة تعيين الجزيرة!",
    cancel: "إلغاء",
    buildingNames: {
      "Small Tree": "شجرة صغيرة",
      "Flower Patch": "حديقة زهور",
      "Cottage": "كوخ",
      "Pond": "بركة",
      "Library": "مكتبة",
      "Lighthouse": "منارة",
      "Garden Maze": "متاهة حديقة",
      "Observatory": "مرصد",
      "Castle": "قلعة",
      "Dragon Nest": "عش التنين",
      "Legendary Statue": "تمثال أسطوري",
    },
  },
};

// ── Theme palette ──
const THEME_COLORS = {
  forest: {
    ground: "#22c55e", groundDark: "#16a34a", label: "🌲",
    bg: "linear-gradient(135deg, #065f46 0%, #059669 40%, #34d399 100%)",
    sky: "linear-gradient(180deg, #bef264 0%, #86efac 50%, #22c55e 100%)",
  },
  ocean: {
    ground: "#38bdf8", groundDark: "#0284c7", label: "🌊",
    bg: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 40%, #38bdf8 100%)",
    sky: "linear-gradient(180deg, #e0f2fe 0%, #7dd3fc 50%, #0ea5e9 100%)",
  },
  desert: {
    ground: "#fbbf24", groundDark: "#d97706", label: "🏜️",
    bg: "linear-gradient(135deg, #78350f 0%, #b45309 40%, #fbbf24 100%)",
    sky: "linear-gradient(180deg, #fef3c7 0%, #fde68a 50%, #f59e0b 100%)",
  },
  space: {
    ground: "#7c3aed", groundDark: "#5b21b6", label: "🚀",
    bg: "linear-gradient(135deg, #0f0a1e 0%, #1e1b4b 40%, #4c1d95 100%)",
    sky: "linear-gradient(180deg, #0f0a1e 0%, #1e1b4b 50%, #312e81 100%)",
  },
};

// ── Pre-computed rain positions (avoids Math.random in render) ──
const RAIN_DROPS = Array.from({ length: 24 }, (_, i) => ({
  left: `${(i * 4.17 + 2.1) % 100}%`,
  duration: `${0.5 + (i % 5) * 0.1}s`,
  delay: `${(i * 0.07) % 1}s`,
}));

// ── Building schedule ──
const BUILDINGS = [
  { level: 1,  type: "Small Tree",       emoji: "🌳" },
  { level: 2,  type: "Flower Patch",     emoji: "🌸" },
  { level: 3,  type: "Cottage",          emoji: "🏠" },
  { level: 5,  type: "Pond",             emoji: "🏊" },
  { level: 7,  type: "Library",          emoji: "📚" },
  { level: 10, type: "Lighthouse",       emoji: "🗼" },
  { level: 13, type: "Garden Maze",      emoji: "🌿" },
  { level: 15, type: "Observatory",      emoji: "🔭" },
  { level: 20, type: "Castle",           emoji: "🏰" },
  { level: 25, type: "Dragon Nest",      emoji: "🐉" },
  { level: 30, type: "Legendary Statue", emoji: "🗿" },
];

// ── Component ──
export default function FocusIsland({ locale = "en", userId }) {
  const t = T[locale] || T.en;
  const isRTL = locale === "ar";

  const [island, setIsland] = useState(null);
  const [weather, setWeather] = useState(null);
  const [streak, setStreak] = useState(0);
  const [unlockedBuildings, setUnlockedBuildings] = useState([]);
  const [availableThemes, setAvailableThemes] = useState([]);
  const [nextLevelPoints, setNextLevelPoints] = useState(100);
  const [currentLevelPoints, setCurrentLevelPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Study logging state
  const [logMinutes, setLogMinutes] = useState("");
  const [logging, setLogging] = useState(false);
  const [logResult, setLogResult] = useState(null);

  // Level-up celebration
  const [levelUpInfo, setLevelUpInfo] = useState(null);

  // Reset state
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  const logResultTimer = useRef(null);

  // ── Fetch island data ──
  const fetchIsland = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/study-hub/focus-island");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to fetch");
      }
      const data = await res.json();
      setIsland(data.island);
      setWeather(data.weather);
      setStreak(data.streak || 0);
      setUnlockedBuildings(data.unlockedBuildings || []);
      setAvailableThemes(data.availableThemes || []);
      setNextLevelPoints(data.nextLevelPoints || 100);
      setCurrentLevelPoints(data.currentLevelPoints || 0);
    } catch (err) {
      console.error("Focus Island fetch error:", err);
      setError(err.message || t.error);
    } finally {
      setLoading(false);
    }
  }, [t.error]);

  useEffect(() => {
    if (userId) fetchIsland();
    else setLoading(false);
  }, [userId, fetchIsland]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => { if (logResultTimer.current) clearTimeout(logResultTimer.current); };
  }, []);

  // ── Log study time (triggers growth) ──
  const handleLogStudy = async () => {
    const mins = parseInt(logMinutes, 10);
    if (!mins || mins < 1 || mins > 600) return;
    try {
      setLogging(true);
      setLogResult(null);
      const res = await fetch("/api/study-hub/focus-island", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studyMinutes: mins, source: "manual" }),
      });
      if (!res.ok) throw new Error("Failed to log");
      const data = await res.json();

      // Update local state
      setIsland(data.island);
      setWeather(data.weather);

      // Show result toast
      setLogResult({ growth: data.growthEarned, points: data.pointsAwarded || 0 });
      if (logResultTimer.current) clearTimeout(logResultTimer.current);
      logResultTimer.current = setTimeout(() => setLogResult(null), 4000);

      // Level-up celebration
      if (data.leveledUp) {
        setLevelUpInfo({ oldLevel: data.oldLevel, newLevel: data.newLevel });
      }

      // Re-fetch full state to sync buildings/themes
      await fetchIsland();
      setLogMinutes("");
    } catch (err) {
      console.error("Log study error:", err);
    } finally {
      setLogging(false);
    }
  };

  // ── Change theme ──
  const changeTheme = async (theme) => {
    try {
      const res = await fetch("/api/study-hub/focus-island", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsland(data.island);
      }
    } catch (err) {
      console.error("Theme change error:", err);
    }
  };

  // ── Reset island ──
  const handleResetIsland = async () => {
    try {
      setResetting(true);
      const res = await fetch("/api/study-hub/focus-island", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to reset");
      await fetchIsland();
      setShowResetConfirm(false);
    } catch (err) {
      console.error("Reset error:", err);
    } finally {
      setResetting(false);
    }
  };

  // ── Computed values ──
  const progressPct = useMemo(() => {
    if (!island) return 0;
    const range = nextLevelPoints - currentLevelPoints;
    if (range <= 0) return 100;
    return Math.min(100, Math.max(0, Math.round(((island.growthPoints - currentLevelPoints) / range) * 100)));
  }, [island, nextLevelPoints, currentLevelPoints]);

  const xpInLevel = island ? island.growthPoints - currentLevelPoints : 0;
  const xpNeeded = nextLevelPoints - currentLevelPoints;
  const xpRemaining = island ? nextLevelPoints - island.growthPoints : 0;
  const totalHours = island ? Math.floor(island.totalStudyMin / 60) : 0;
  const totalMins = island ? island.totalStudyMin % 60 : 0;

  // ── Login gate ──
  if (!userId) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: "#888" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <p style={{ fontSize: 16, fontWeight: 600 }}>{t.loginRequired}</p>
      </div>
    );
  }

  // ── Loading state ──
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: 48, marginBottom: 16, animation: "fiPulse 2s ease-in-out infinite" }}>🏝️</div>
        <p style={{ color: "#6b7280", fontWeight: 500 }}>{t.loading}</p>
        <style>{`@keyframes fiPulse { 0%,100% { transform:scale(1); opacity:1; } 50% { transform:scale(1.1); opacity:0.6; } }`}</style>
      </div>
    );
  }

  // ── Error state ──
  if (error || !island) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😞</div>
        <p style={{ color: "#ef4444", marginBottom: 12 }}>{error || t.error}</p>
        <button
          onClick={fetchIsland}
          style={{
            padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff",
            fontWeight: 600, fontSize: 14, fontFamily: "inherit",
          }}
        >{t.retry}</button>
      </div>
    );
  }

  const themeColors = THEME_COLORS[island.theme] || THEME_COLORS.forest;
  const weatherKey = weather?.weather || "sunny";

  return (
    <div style={{ direction: isRTL ? "rtl" : "ltr" }}>
      <style>{`
        @keyframes fiFloat { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
        @keyframes fiPopIn { 0% { transform:scale(0) rotate(-10deg); opacity:0; } 100% { transform:scale(1) rotate(0); opacity:1; } }
        @keyframes fiRainDrop { 0% { transform:translateY(-10px); opacity:0; } 30% { opacity:0.7; } 100% { transform:translateY(120px); opacity:0; } }
        @keyframes fiCloudDrift { 0% { transform:translateX(-30px); } 100% { transform:translateX(30px); } }
        @keyframes fiLightning { 0%,88%,100% { opacity:0; } 92% { opacity:0.7; } }
        @keyframes fiGlow { 0%,100% { box-shadow:0 0 0 0 rgba(34,197,94,0.4); } 50% { box-shadow:0 0 20px 4px rgba(34,197,94,0.2); } }
        @keyframes fiCelebrate { 0% { transform:scale(0.5) rotate(-5deg); opacity:0; } 50% { transform:scale(1.05) rotate(2deg); opacity:1; } 100% { transform:scale(1) rotate(0); opacity:1; } }
        @keyframes fiShine { 0% { background-position:200% center; } 100% { background-position:-200% center; } }
        .fi-building { animation: fiPopIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; cursor:default; transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .fi-building:hover { transform:scale(1.35) !important; z-index:10; }
        .fi-card { background:var(--card-bg, #fff); border-radius:16px; padding:16px; border:1px solid var(--border, #e5e7eb); box-shadow:0 2px 12px rgba(0,0,0,0.04); }
      `}</style>

      {/* ═══ LEVEL-UP CELEBRATION MODAL ═══ */}
      {levelUpInfo && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => setLevelUpInfo(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "linear-gradient(135deg, #065f46, #059669)", borderRadius: 24,
              padding: "40px 48px", textAlign: "center", color: "#fff", maxWidth: 380,
              animation: "fiCelebrate 0.5s ease-out",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ fontSize: 64, marginBottom: 8 }}>🎉</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{t.levelUp}</h2>
            <p style={{ fontSize: 16, opacity: 0.9, marginBottom: 4 }}>{t.congrats}</p>
            <p style={{ fontSize: 20, fontWeight: 700 }}>
              {t.reachedLevel} {levelUpInfo.newLevel}!
            </p>
            <div style={{ fontSize: 40, margin: "16px 0 20px" }}>
              ⭐ {levelUpInfo.oldLevel} → {levelUpInfo.newLevel} ⭐
            </div>
            <button
              onClick={() => setLevelUpInfo(null)}
              style={{
                padding: "10px 32px", borderRadius: 12, border: "2px solid rgba(255,255,255,0.4)",
                background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 15,
                fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              }}
            >{t.close}</button>
          </div>
        </div>
      )}

      {/* ═══ ISLAND VISUALIZATION ═══ */}
      <div style={{
        position: "relative", borderRadius: 20, overflow: "hidden",
        background: themeColors.sky, minHeight: 340, marginBottom: 20,
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
      }}>
        {/* Weather overlay */}
        {weatherKey === "cloudy" && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(156,163,175,0.15)", pointerEvents: "none", zIndex: 2 }} />
        )}
        {weatherKey === "rainy" && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(107,114,128,0.2)", pointerEvents: "none", zIndex: 2 }} />
        )}
        {weatherKey === "stormy" && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(75,85,99,0.3)", pointerEvents: "none", zIndex: 2 }} />
        )}

        {/* Rain drops (pre-computed positions) */}
        {(weatherKey === "rainy" || weatherKey === "stormy") && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3, overflow: "hidden" }}>
            {RAIN_DROPS.map((drop, i) => (
              <div key={i} style={{
                position: "absolute", left: drop.left, top: -10,
                width: 2, height: weatherKey === "stormy" ? 16 : 10,
                background: "rgba(255,255,255,0.35)", borderRadius: 2,
                animation: `fiRainDrop ${drop.duration} linear infinite`,
                animationDelay: drop.delay,
              }} />
            ))}
          </div>
        )}

        {/* Storm lightning flash */}
        {weatherKey === "stormy" && (
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3,
            background: "rgba(255,255,200,0.12)", animation: "fiLightning 4s infinite",
          }} />
        )}

        {/* Clouds */}
        {(weatherKey === "cloudy" || weatherKey === "partly-sunny" || weatherKey === "rainy") && (
          <>
            <div style={{ position: "absolute", top: 18, left: "15%", fontSize: 36, animation: "fiCloudDrift 5s ease-in-out infinite alternate", pointerEvents: "none", zIndex: 2, opacity: 0.6 }}>☁️</div>
            <div style={{ position: "absolute", top: 30, left: "55%", fontSize: 28, animation: "fiCloudDrift 6s ease-in-out infinite alternate-reverse", pointerEvents: "none", zIndex: 2, opacity: 0.4 }}>☁️</div>
          </>
        )}

        {/* Sun */}
        {(weatherKey === "sunny" || weatherKey === "partly-sunny") && (
          <div style={{
            position: "absolute", top: 14, right: isRTL ? "auto" : 20, left: isRTL ? 20 : "auto",
            fontSize: 44, animation: "fiFloat 4s ease-in-out infinite", pointerEvents: "none", zIndex: 2,
          }}>☀️</div>
        )}

        {/* HUD badges */}
        <div style={{
          position: "absolute", top: 12,
          left: isRTL ? "auto" : 12, right: isRTL ? 12 : "auto",
          zIndex: 5, display: "flex", gap: 8, flexDirection: "column",
        }}>
          <div style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(10px)", borderRadius: 12, padding: "6px 14px", color: "#fff", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            {weather?.emoji} {t[weatherKey] || weather?.label}
          </div>
          <div style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(10px)", borderRadius: 12, padding: "6px 14px", color: "#fff", fontSize: 13, fontWeight: 600 }}>
            ⭐ {t.level} {island.level}
          </div>
          {streak > 0 && (
            <div style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(10px)", borderRadius: 12, padding: "6px 14px", color: "#fff", fontSize: 13, fontWeight: 600 }}>
              🔥 {streak} {t.streak}
            </div>
          )}
        </div>

        {/* Island ground + buildings grid (8×6) */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gridTemplateRows: "repeat(6, 1fr)",
          gap: 3, padding: "52px 12px 12px", minHeight: 310, position: "relative", zIndex: 4,
        }}>
          {Array.from({ length: 48 }).map((_, idx) => {
            const row = Math.floor(idx / 8);
            const col = idx % 8;
            const building = unlockedBuildings.find(b => b.position?.row === row && b.position?.col === col);
            return (
              <div key={idx} style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                minHeight: 44, borderRadius: 10,
                background: building ? `${themeColors.ground}30` : "transparent",
                transition: "background 0.3s",
              }}>
                {building && (
                  <div
                    className="fi-building"
                    title={t.buildingNames?.[building.type] || building.type}
                    style={{ fontSize: 30, animationDelay: `${idx * 0.06}s` }}
                  >
                    {building.emoji}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ LOG STUDY TIME ═══ */}
      <div className="fi-card dark:bg-gray-800 dark:border-gray-700" style={{ marginBottom: 20, animation: "fiGlow 3s ease-in-out infinite" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }} className="text-gray-800 dark:text-gray-100">
          📝 {t.logStudy}
        </h3>
        <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 12 }}>{t.logStudyDesc}</p>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="number"
            min="1"
            max="600"
            value={logMinutes}
            onChange={(e) => setLogMinutes(e.target.value)}
            placeholder={t.studyMinutes}
            onKeyDown={(e) => e.key === "Enter" && handleLogStudy()}
            style={{
              flex: "1 1 120px", minWidth: 120, padding: "10px 14px", borderRadius: 12,
              border: "1px solid var(--border, #e5e7eb)", background: "var(--card-bg, #fff)",
              fontSize: 14, fontWeight: 500, fontFamily: "inherit", outline: "none",
              direction: "ltr",
            }}
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            onClick={handleLogStudy}
            disabled={logging || !logMinutes || parseInt(logMinutes, 10) < 1}
            style={{
              padding: "10px 24px", borderRadius: 12, border: "none", cursor: "pointer",
              background: logging ? "#9ca3af" : "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "inherit",
              transition: "all 0.2s", opacity: (!logMinutes || parseInt(logMinutes, 10) < 1) ? 0.5 : 1,
              boxShadow: logging ? "none" : "0 4px 12px rgba(34,197,94,0.3)",
            }}
          >
            {logging ? t.logging : `🌱 ${t.logBtn}`}
          </button>
          {/* Quick presets */}
          {[15, 25, 45, 60].map((m) => (
            <button
              key={m}
              onClick={() => setLogMinutes(String(m))}
              style={{
                padding: "8px 14px", borderRadius: 10, border: "1px solid var(--border, #e5e7eb)",
                background: logMinutes === String(m) ? "rgba(34,197,94,0.1)" : "transparent",
                fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.2s",
              }}
              className="text-gray-600 dark:text-gray-300 dark:border-gray-600"
            >
              {m}{t.minutes}
            </button>
          ))}
        </div>
        {/* Growth result toast */}
        {logResult && (
          <div style={{
            marginTop: 12, padding: "10px 16px", borderRadius: 12,
            background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
            display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap",
            animation: "fiCelebrate 0.3s ease-out",
          }}>
            <span style={{ fontWeight: 700, color: "#16a34a", fontSize: 14 }}>
              🌱 +{logResult.growth} {t.growthEarned}
            </span>
            {logResult.points > 0 && (
              <span style={{ fontWeight: 600, color: "#f59e0b", fontSize: 14 }}>
                ⭐ +{logResult.points} {t.pointsAwarded}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ═══ STATS GRID ═══ */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 20,
      }}>
        {[
          { label: t.level, value: island.level, icon: "⭐", color: "#f59e0b" },
          { label: t.growthPoints, value: island.growthPoints.toLocaleString(), icon: "🌱", color: "#22c55e" },
          { label: t.totalStudy, value: totalHours > 0 ? `${totalHours}${t.hours} ${totalMins}${t.minutes}` : `${totalMins}${t.minutes}`, icon: "⏱️", color: "#3b82f6" },
          { label: t.buildings, value: `${unlockedBuildings.length}/${BUILDINGS.length}`, icon: "🏗️", color: "#8b5cf6" },
          { label: t.streak, value: streak, icon: "🔥", color: "#ef4444" },
          { label: t.weather, value: `${weather?.emoji || ""} ${t[weatherKey] || ""}`, icon: "", color: "#6366f1" },
        ].map((stat, i) => (
          <div key={i} className="fi-card dark:bg-gray-800 dark:border-gray-700">
            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4, fontWeight: 500 }}>{stat.icon} {stat.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* ═══ XP PROGRESS BAR ═══ */}
      <div className="fi-card dark:bg-gray-800 dark:border-gray-700" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, fontWeight: 600 }}>
          <span className="text-gray-700 dark:text-gray-300">{t.level} {island.level}</span>
          <span style={{ color: "#9ca3af" }}>{xpInLevel} / {xpNeeded} {t.xp}</span>
          <span className="text-gray-700 dark:text-gray-300">{t.level} {island.level + 1}</span>
        </div>
        <div style={{ height: 14, background: "#e5e7eb", borderRadius: 7, overflow: "hidden", position: "relative" }} className="dark:bg-gray-700">
          <div style={{
            height: "100%", width: `${progressPct}%`, borderRadius: 7,
            background: "linear-gradient(90deg, #22c55e, #16a34a)",
            transition: "width 0.6s cubic-bezier(0.34,1.56,0.64,1)",
            backgroundSize: "200% 100%",
          }} />
        </div>
        <div style={{ textAlign: "center", marginTop: 6, fontSize: 12, color: "#9ca3af" }}>
          {xpRemaining > 0 ? `${xpRemaining} ${t.xp} ${t.nextLevel}` : `${t.levelUp}`}
        </div>
      </div>

      {/* ═══ THEME SELECTOR ═══ */}
      <div className="fi-card dark:bg-gray-800 dark:border-gray-700" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }} className="text-gray-800 dark:text-gray-100">
          🎨 {t.themes}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
          {availableThemes.map(({ theme, unlocked, requiredLevel }) => {
            const tc = THEME_COLORS[theme] || THEME_COLORS.forest;
            const isCurrent = island.theme === theme;
            return (
              <button
                key={theme}
                onClick={() => unlocked && !isCurrent && changeTheme(theme)}
                disabled={!unlocked}
                style={{
                  padding: "16px 12px", borderRadius: 16,
                  border: isCurrent ? `2px solid ${tc.groundDark}` : "1px solid var(--border, #e5e7eb)",
                  background: unlocked ? tc.bg : "#f3f4f6",
                  opacity: unlocked ? 1 : 0.45,
                  cursor: unlocked && !isCurrent ? "pointer" : "default",
                  transition: "all 0.25s",
                  textAlign: "center",
                  transform: isCurrent ? "scale(1.02)" : "scale(1)",
                  fontFamily: "inherit",
                }}
                className={!unlocked ? "dark:bg-gray-700" : ""}
              >
                <div style={{ fontSize: 30, marginBottom: 4 }}>{tc.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: unlocked ? "#fff" : "#9ca3af" }}>
                  {t[theme]}
                </div>
                <div style={{ fontSize: 11, marginTop: 4, color: unlocked ? "rgba(255,255,255,0.75)" : "#9ca3af" }}>
                  {isCurrent ? `✓ ${t.currentTheme}` : unlocked ? t.free : `🔒 ${t.requiresLevel} ${requiredLevel}`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ BUILDING GALLERY ═══ */}
      <div className="fi-card dark:bg-gray-800 dark:border-gray-700">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }} className="text-gray-800 dark:text-gray-100">
          🏗️ {t.buildingGallery}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
          {BUILDINGS.map((b) => {
            const isUnlocked = island.level >= b.level;
            const name = t.buildingNames?.[b.type] || b.type;
            return (
              <div key={b.type} style={{
                padding: "14px 8px", borderRadius: 14, textAlign: "center",
                border: isUnlocked ? "1px solid rgba(34,197,94,0.3)" : "1px solid var(--border, #e5e7eb)",
                background: isUnlocked ? "rgba(34,197,94,0.06)" : "transparent",
                opacity: isUnlocked ? 1 : 0.5,
                transition: "all 0.3s",
              }} className={isUnlocked ? "" : "dark:border-gray-700"}>
                <div style={{ fontSize: 34, marginBottom: 6, filter: isUnlocked ? "none" : "grayscale(1)", transition: "filter 0.3s" }}>
                  {b.emoji}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3 }} className="text-gray-700 dark:text-gray-300">
                  {name}
                </div>
                <div style={{ fontSize: 10, marginTop: 4, color: isUnlocked ? "#22c55e" : "#9ca3af", fontWeight: 600 }}>
                  {isUnlocked ? `✓ ${t.unlocked}` : `🔒 ${t.level} ${b.level}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ RESET ISLAND ═══ */}
      <div className="fi-card dark:bg-gray-800 dark:border-gray-700" style={{ borderColor: "rgba(239,68,68,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: "#ef4444" }}>
              {t.resetIsland}
            </h3>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "4px 0 0", lineHeight: 1.4 }}>
              {isRTL ? "ابدأ من جديد من المستوى 1" : "Start fresh from Level 1"}
            </p>
          </div>
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              style={{
                padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                border: "1.5px solid rgba(239,68,68,0.3)", background: "transparent",
                color: "#ef4444", cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#fef2f2"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              {t.resetIsland}
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 320, width: "100%" }}>
              <p style={{ fontSize: 13, color: "#ef4444", fontWeight: 500, margin: 0, lineHeight: 1.5 }}>
                {t.resetConfirm}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleResetIsland}
                  disabled={resetting}
                  style={{
                    flex: 1, padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                    border: "none", background: "#ef4444", color: "white", cursor: resetting ? "wait" : "pointer",
                    opacity: resetting ? 0.7 : 1, transition: "all 0.2s",
                  }}
                >
                  {resetting ? t.resetting : t.resetBtn}
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  disabled={resetting}
                  style={{
                    flex: 1, padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                    border: "1.5px solid #e5e7eb", background: "transparent",
                    color: "#6b7280", cursor: "pointer", transition: "all 0.2s",
                  }}
                  className="dark:border-gray-600 dark:text-gray-400"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
