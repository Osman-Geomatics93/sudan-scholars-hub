"use client";
import { useState, useEffect, useCallback } from "react";

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
    changeTheme: "Change Theme",
    minutes: "min",
    hours: "hrs",
    nextLevel: "Next Level",
    islandEmpty: "Your island is just beginning! Study to make it grow.",
    levelUp: "Level Up!",
    noStreak: "Start a study streak to improve the weather!",
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
    placed: "On Island",
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
    changeTheme: "تغيير السمة",
    minutes: "د",
    hours: "س",
    nextLevel: "المستوى التالي",
    islandEmpty: "جزيرتك في البداية! ادرس لتنميتها.",
    levelUp: "ارتقاء!",
    noStreak: "ابدأ سلسلة دراسية لتحسين الطقس!",
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
    placed: "على الجزيرة",
  },
};

const THEME_COLORS = {
  forest: { ground: "#22c55e", groundDark: "#16a34a", bg: "linear-gradient(180deg, #86efac 0%, #22c55e 100%)", label: "🌲" },
  ocean:  { ground: "#38bdf8", groundDark: "#0284c7", bg: "linear-gradient(180deg, #7dd3fc 0%, #0ea5e9 100%)", label: "🌊" },
  desert: { ground: "#fbbf24", groundDark: "#d97706", bg: "linear-gradient(180deg, #fde68a 0%, #f59e0b 100%)", label: "🏜️" },
  space:  { ground: "#7c3aed", groundDark: "#5b21b6", bg: "linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)", label: "🚀" },
};

const WEATHER_ANIMATIONS = {
  sunny: { overlay: "", animation: "" },
  "partly-sunny": { overlay: "rgba(255,255,255,0.1)", animation: "" },
  cloudy: { overlay: "rgba(156,163,175,0.2)", animation: "" },
  rainy: { overlay: "rgba(107,114,128,0.3)", animation: "rain" },
  stormy: { overlay: "rgba(75,85,99,0.4)", animation: "storm" },
};

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

  const fetchIsland = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/study-hub/focus-island");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setIsland(data.island);
      setWeather(data.weather);
      setStreak(data.streak || 0);
      setUnlockedBuildings(data.unlockedBuildings || []);
      setAvailableThemes(data.availableThemes || []);
      setNextLevelPoints(data.nextLevelPoints || 100);
      setCurrentLevelPoints(data.currentLevelPoints || 0);
    } catch (err) {
      console.error(err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  }, [t.error]);

  useEffect(() => { fetchIsland(); }, [fetchIsland]);

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
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: 48, marginBottom: 16, animation: "pulse 2s infinite" }}>🏝️</div>
        <p style={{ color: "#6b7280" }}>{t.loading}</p>
      </div>
    );
  }

  if (error || !island) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😞</div>
        <p style={{ color: "#ef4444" }}>{error || t.error}</p>
      </div>
    );
  }

  const themeColors = THEME_COLORS[island.theme] || THEME_COLORS.forest;
  const weatherAnim = WEATHER_ANIMATIONS[weather?.weather] || WEATHER_ANIMATIONS.sunny;
  const progressPct = nextLevelPoints > currentLevelPoints
    ? Math.min(100, Math.round(((island.growthPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100))
    : 100;
  const totalHours = Math.floor(island.totalStudyMin / 60);
  const totalMins = island.totalStudyMin % 60;

  return (
    <div style={{ direction: isRTL ? "rtl" : "ltr" }}>
      <style>{`
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
        @keyframes popIn { 0% { transform:scale(0); opacity:0; } 100% { transform:scale(1); opacity:1; } }
        @keyframes rainDrop { 0% { transform:translateY(-10px); opacity:0; } 50% { opacity:1; } 100% { transform:translateY(100px); opacity:0; } }
        @keyframes cloudMove { 0% { transform:translateX(-20px); } 100% { transform:translateX(20px); } }
        @keyframes lightning { 0%,90%,100% { opacity:0; } 95% { opacity:0.8; } }
        .island-building { animation: popIn 0.5s ease-out forwards; cursor: pointer; transition: transform 0.2s; }
        .island-building:hover { transform: scale(1.3) !important; z-index: 10; }
      `}</style>

      {/* === ISLAND VISUALIZATION === */}
      <div style={{
        position: "relative", borderRadius: 20, overflow: "hidden",
        background: themeColors.bg, minHeight: 320, marginBottom: 24,
        border: "1px solid rgba(0,0,0,0.1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      }}>
        {/* Weather overlay */}
        {weatherAnim.overlay && (
          <div style={{ position: "absolute", inset: 0, background: weatherAnim.overlay, pointerEvents: "none", zIndex: 2 }} />
        )}

        {/* Rain effect */}
        {(weather?.weather === "rainy" || weather?.weather === "stormy") && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3, overflow: "hidden" }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} style={{
                position: "absolute", left: `${Math.random() * 100}%`, top: -10,
                width: 2, height: 12, background: "rgba(255,255,255,0.4)", borderRadius: 2,
                animation: `rainDrop ${0.6 + Math.random() * 0.4}s linear infinite`,
                animationDelay: `${Math.random() * 1}s`,
              }} />
            ))}
          </div>
        )}

        {/* Storm lightning */}
        {weather?.weather === "stormy" && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,200,0.15)", animation: "lightning 3s infinite", pointerEvents: "none", zIndex: 3 }} />
        )}

        {/* Cloud effects */}
        {(weather?.weather === "cloudy" || weather?.weather === "partly-sunny") && (
          <div style={{ position: "absolute", top: 20, left: "20%", fontSize: 40, animation: "cloudMove 4s ease-in-out infinite alternate", pointerEvents: "none", zIndex: 2, opacity: 0.7 }}>
            ☁️
          </div>
        )}

        {/* Sun for sunny weather */}
        {weather?.weather === "sunny" && (
          <div style={{ position: "absolute", top: 12, right: isRTL ? "auto" : 24, left: isRTL ? 24 : "auto", fontSize: 48, animation: "float 3s ease-in-out infinite", pointerEvents: "none", zIndex: 2 }}>
            ☀️
          </div>
        )}

        {/* Weather + Level badges */}
        <div style={{ position: "absolute", top: 12, left: isRTL ? "auto" : 12, right: isRTL ? 12 : "auto", zIndex: 5, display: "flex", gap: 8, flexDirection: "column" }}>
          <div style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", borderRadius: 12, padding: "6px 12px", color: "#fff", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            {weather?.emoji} {t[weather?.weather] || weather?.label}
          </div>
          <div style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", borderRadius: 12, padding: "6px 12px", color: "#fff", fontSize: 13, fontWeight: 600 }}>
            ⭐ {t.level} {island.level}
          </div>
        </div>

        {/* Island grid (8x6) */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gridTemplateRows: "repeat(6, 1fr)",
          gap: 4, padding: "50px 16px 16px", minHeight: 300, position: "relative", zIndex: 4,
        }}>
          {Array.from({ length: 48 }).map((_, idx) => {
            const row = Math.floor(idx / 8);
            const col = idx % 8;
            const building = unlockedBuildings.find(b => b.position.row === row && b.position.col === col);
            return (
              <div key={idx} style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                minHeight: 44, borderRadius: 8,
                background: building ? `${themeColors.ground}33` : "transparent",
              }}>
                {building && (
                  <div
                    className="island-building"
                    title={building.type}
                    style={{ fontSize: 28, animationDelay: `${idx * 0.05}s` }}
                  >
                    {building.emoji}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* === STATS BAR === */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24,
      }}>
        {[
          { label: t.level, value: island.level, icon: "⭐", color: "#f59e0b" },
          { label: t.growthPoints, value: island.growthPoints, icon: "🌱", color: "#22c55e" },
          { label: t.totalStudy, value: totalHours > 0 ? `${totalHours}${t.hours} ${totalMins}${t.minutes}` : `${totalMins}${t.minutes}`, icon: "⏱️", color: "#3b82f6" },
          { label: t.buildings, value: unlockedBuildings.length, icon: "🏗️", color: "#8b5cf6" },
          { label: t.streak, value: `${streak} 🔥`, icon: "📅", color: "#ef4444" },
          { label: t.weather, value: `${weather?.emoji || ""} ${t[weather?.weather] || ""}`, icon: "", color: "#6366f1" },
        ].map((stat, i) => (
          <div key={i} style={{
            background: "var(--card-bg, #fff)", borderRadius: 14, padding: "14px 16px",
            border: "1px solid var(--border, #e5e7eb)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }} className="dark:bg-gray-800 dark:border-gray-700">
            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4, fontWeight: 500 }}>{stat.icon} {stat.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* === XP PROGRESS BAR === */}
      <div style={{
        background: "var(--card-bg, #fff)", borderRadius: 14, padding: 16, marginBottom: 24,
        border: "1px solid var(--border, #e5e7eb)",
      }} className="dark:bg-gray-800 dark:border-gray-700">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, fontWeight: 600 }}>
          <span className="text-gray-700 dark:text-gray-300">{t.level} {island.level}</span>
          <span style={{ color: "#9ca3af" }}>{island.growthPoints} / {nextLevelPoints} XP</span>
          <span className="text-gray-700 dark:text-gray-300">{t.level} {island.level + 1}</span>
        </div>
        <div style={{ height: 12, background: "#e5e7eb", borderRadius: 6, overflow: "hidden" }} className="dark:bg-gray-700">
          <div style={{
            height: "100%", width: `${progressPct}%`, borderRadius: 6,
            background: "linear-gradient(90deg, #22c55e, #16a34a)",
            transition: "width 0.5s ease",
          }} />
        </div>
        <div style={{ textAlign: "center", marginTop: 6, fontSize: 12, color: "#9ca3af" }}>
          {nextLevelPoints - island.growthPoints} XP {t.nextLevel.toLowerCase()}
        </div>
      </div>

      {/* === THEME SELECTOR === */}
      <div style={{
        background: "var(--card-bg, #fff)", borderRadius: 14, padding: 16, marginBottom: 24,
        border: "1px solid var(--border, #e5e7eb)",
      }} className="dark:bg-gray-800 dark:border-gray-700">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }} className="text-gray-800 dark:text-gray-100">
          🎨 {t.themes}
        </h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {availableThemes.map(({ theme, unlocked, requiredLevel }) => {
            const tc = THEME_COLORS[theme] || THEME_COLORS.forest;
            const isCurrent = island.theme === theme;
            return (
              <button
                key={theme}
                onClick={() => unlocked && !isCurrent && changeTheme(theme)}
                disabled={!unlocked}
                style={{
                  flex: "1 1 120px", minWidth: 120, padding: "14px 12px", borderRadius: 14,
                  border: isCurrent ? `2px solid ${tc.groundDark}` : "1px solid var(--border, #e5e7eb)",
                  background: unlocked ? tc.bg : "#f3f4f6",
                  opacity: unlocked ? 1 : 0.5,
                  cursor: unlocked && !isCurrent ? "pointer" : "default",
                  transition: "all 0.2s",
                  textAlign: "center",
                }}
                className={!unlocked ? "dark:bg-gray-700" : ""}
              >
                <div style={{ fontSize: 28, marginBottom: 4 }}>{tc.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: unlocked ? "#fff" : "#9ca3af" }}>
                  {t[theme]}
                </div>
                <div style={{ fontSize: 11, marginTop: 2, color: unlocked ? "rgba(255,255,255,0.7)" : "#9ca3af" }}>
                  {isCurrent ? `✓ ${t.currentTheme}` : unlocked ? t.free : `🔒 ${t.requiresLevel} ${requiredLevel}`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* === BUILDING GALLERY === */}
      <div style={{
        background: "var(--card-bg, #fff)", borderRadius: 14, padding: 16,
        border: "1px solid var(--border, #e5e7eb)",
      }} className="dark:bg-gray-800 dark:border-gray-700">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }} className="text-gray-800 dark:text-gray-100">
          🏗️ {t.buildingGallery}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
          {[
            { level: 1,  type: "Small Tree",      emoji: "🌳" },
            { level: 2,  type: "Flower Patch",    emoji: "🌸" },
            { level: 3,  type: "Cottage",         emoji: "🏠" },
            { level: 5,  type: "Pond",            emoji: "🏊" },
            { level: 7,  type: "Library",         emoji: "📚" },
            { level: 10, type: "Lighthouse",      emoji: "🗼" },
            { level: 13, type: "Garden Maze",     emoji: "🌿" },
            { level: 15, type: "Observatory",     emoji: "🔭" },
            { level: 20, type: "Castle",          emoji: "🏰" },
            { level: 25, type: "Dragon Nest",     emoji: "🐉" },
            { level: 30, type: "Legendary Statue", emoji: "🗿" },
          ].map((b) => {
            const isUnlocked = island.level >= b.level;
            return (
              <div key={b.type} style={{
                padding: "12px 8px", borderRadius: 12, textAlign: "center",
                border: isUnlocked ? "1px solid #22c55e40" : "1px solid var(--border, #e5e7eb)",
                background: isUnlocked ? "rgba(34,197,94,0.05)" : "transparent",
                opacity: isUnlocked ? 1 : 0.5,
              }} className={isUnlocked ? "" : "dark:border-gray-700"}>
                <div style={{ fontSize: 32, marginBottom: 4, filter: isUnlocked ? "none" : "grayscale(1)" }}>
                  {b.emoji}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600 }} className="text-gray-700 dark:text-gray-300">
                  {b.type}
                </div>
                <div style={{ fontSize: 10, marginTop: 2, color: isUnlocked ? "#22c55e" : "#9ca3af" }}>
                  {isUnlocked ? `✓ ${t.unlocked}` : `🔒 Lv. ${b.level}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
