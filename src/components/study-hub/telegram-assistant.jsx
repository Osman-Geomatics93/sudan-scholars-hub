"use client";
import { useState, useRef, useEffect } from "react";

// ── Translations ──
const T = {
  en: {
    title: "Bot Assistant",
    subtitle: "Chat with our AI assistant for scholarships, study tools & more",
    telegramBanner: "Also available on Telegram",
    placeholder: "Type your message...",
    send: "Send",
    quickActions: "Quick Actions",
    scholarships: "Scholarships",
    flashcards: "Flashcards",
    quiz: "Quiz",
    materials: "Materials",
    leaderboard: "Leaderboard",
    studyTip: "Study Tip",
    typing: "Bot is thinking...",
    welcome: "Hi! I'm the Sudan Scholars Bot. Ask me about scholarships, study materials, flashcards, quizzes, leaderboard rankings, or study tips. You can also use the quick action buttons below!",
    errorMsg: "Sorry, something went wrong. Please try again.",
    poweredBy: "Powered by Sudan Scholars Hub",
  },
  ar: {
    title: "مساعد البوت",
    subtitle: "تحدث مع مساعدنا الذكي للمنح الدراسية وأدوات الدراسة والمزيد",
    telegramBanner: "متوفر أيضاً على تيليجرام",
    placeholder: "اكتب رسالتك...",
    send: "إرسال",
    quickActions: "إجراءات سريعة",
    scholarships: "المنح الدراسية",
    flashcards: "البطاقات التعليمية",
    quiz: "اختبار",
    materials: "المواد",
    leaderboard: "المتصدرين",
    studyTip: "نصيحة دراسية",
    typing: "البوت يفكر...",
    welcome: "مرحباً! أنا بوت السودان للدراسة. اسألني عن المنح الدراسية، المواد الدراسية، البطاقات التعليمية، الاختبارات، لوحة المتصدرين، أو نصائح الدراسة. يمكنك أيضاً استخدام أزرار الإجراءات السريعة أدناه!",
    errorMsg: "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.",
    poweredBy: "بدعم من منصة السودان للدراسة",
  },
};

const QUICK_ACTIONS = [
  { key: "scholarships", icon: "🎓", msgEn: "List all scholarships", msgAr: "اعرض جميع المنح الدراسية" },
  { key: "flashcards", icon: "🗂️", msgEn: "Give me random flashcards", msgAr: "أعطني بطاقات تعليمية عشوائية" },
  { key: "quiz", icon: "📝", msgEn: "Start a quiz", msgAr: "ابدأ اختباراً" },
  { key: "materials", icon: "📚", msgEn: "Find study materials", msgAr: "ابحث عن مواد دراسية" },
  { key: "leaderboard", icon: "🏆", msgEn: "Show the leaderboard", msgAr: "أرني لوحة المتصدرين" },
  { key: "studyTip", icon: "💡", msgEn: "Give me a study tip", msgAr: "أعطني نصيحة دراسية" },
];

// ── Simple Markdown Formatter ──
function formatBotText(text) {
  if (!text) return "";
  // Escape HTML
  let html = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // Bold: *text* (but not **)
  html = html.replace(/\*([^*]+)\*/g, "<strong>$1</strong>");
  // Spoiler: ||text|| → click-to-reveal
  html = html.replace(/\|\|([^|]+)\|\|/g, '<span class="bot-spoiler" onclick="this.classList.toggle(\'revealed\')" style="background:#1B3A4B;color:#1B3A4B;cursor:pointer;padding:0 4px;border-radius:3px;transition:color 0.2s">$1</span>');
  // Newlines
  html = html.replace(/\n/g, "<br/>");
  return html;
}

// ── Styles ──
const C = { navy: "#1B3A4B", tan: "#C8956C", cream: "#FAF6F1", white: "#FFFFFF" };

const S = {
  wrapper: {
    maxWidth: 800,
    margin: "0 auto",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  header: {
    background: `linear-gradient(135deg, ${C.navy}, #2C5364)`,
    borderRadius: "16px 16px 0 0",
    padding: "24px 28px 20px",
    color: C.white,
  },
  headerTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: C.white,
  },
  headerSub: {
    margin: "6px 0 0",
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    fontWeight: 400,
  },
  telegramBanner: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    background: "rgba(255,255,255,0.12)",
    borderRadius: 10,
    padding: "10px 14px",
    textDecoration: "none",
    color: C.white,
    fontSize: 13,
    fontWeight: 500,
    transition: "background 0.2s",
  },
  chatArea: {
    background: C.cream,
    minHeight: 360,
    maxHeight: 480,
    overflowY: "auto",
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  quickBar: {
    background: C.white,
    borderTop: `1px solid #eee`,
    padding: "12px 20px",
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  quickLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  quickBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "6px 12px",
    borderRadius: 20,
    border: `1.5px solid ${C.tan}`,
    background: C.white,
    color: C.navy,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  inputArea: {
    display: "flex",
    gap: 8,
    padding: "14px 20px",
    background: C.white,
    borderTop: `1px solid #eee`,
    borderRadius: "0 0 16px 16px",
  },
  input: {
    flex: 1,
    padding: "10px 16px",
    borderRadius: 24,
    border: "1.5px solid #ddd",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  },
  sendBtn: {
    padding: "10px 20px",
    borderRadius: 24,
    border: "none",
    background: `linear-gradient(135deg, ${C.navy}, #2C5364)`,
    color: C.white,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.2s",
    whiteSpace: "nowrap",
  },
  userBubble: {
    alignSelf: "flex-end",
    maxWidth: "75%",
    background: `linear-gradient(135deg, ${C.navy}, #2C5364)`,
    color: C.white,
    padding: "10px 16px",
    borderRadius: "16px 16px 4px 16px",
    fontSize: 14,
    lineHeight: 1.5,
    wordBreak: "break-word",
  },
  botBubble: {
    alignSelf: "flex-start",
    maxWidth: "80%",
    background: C.white,
    border: `1.5px solid ${C.tan}`,
    color: C.navy,
    padding: "10px 16px",
    borderRadius: "16px 16px 16px 4px",
    fontSize: 14,
    lineHeight: 1.6,
    wordBreak: "break-word",
  },
  typingDots: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "10px 16px",
    background: C.white,
    border: `1.5px solid #eee`,
    borderRadius: "16px 16px 16px 4px",
    alignSelf: "flex-start",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: C.tan,
    animation: "botDotBounce 1.2s infinite ease-in-out",
  },
  footer: {
    textAlign: "center",
    padding: "10px 0",
    fontSize: 11,
    color: "#aaa",
  },
};

// ── Component ──
export default function TelegramAssistant({ locale = "en", userId }) {
  const isRTL = locale === "ar";
  const t = T[locale] || T.en;
  const [messages, setMessages] = useState([
    { role: "bot", text: t.welcome },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = text.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/bot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, lang: locale }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.response || data.error || t.errorMsg },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: t.errorMsg }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleQuickAction = (action) => {
    const msg = locale === "ar" ? action.msgAr : action.msgEn;
    sendMessage(msg);
  };

  return (
    <div style={{ ...S.wrapper, direction: isRTL ? "rtl" : "ltr" }}>
      {/* Keyframes for typing animation */}
      <style>{`
        @keyframes botDotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        .bot-spoiler.revealed { color: inherit !important; background: rgba(27,58,75,0.1) !important; }
        .bot-quick-btn:hover { background: ${C.cream} !important; border-color: ${C.navy} !important; }
        .bot-send-btn:hover { opacity: 0.9; }
        .bot-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .bot-input:focus { border-color: ${C.tan} !important; }
        .bot-tg-link:hover { background: rgba(255,255,255,0.2) !important; }
      `}</style>

      {/* Header */}
      <div style={S.header}>
        <h2 style={{ ...S.headerTitle, textAlign: isRTL ? "right" : "left" }}>
          💬 {t.title}
        </h2>
        <p style={{ ...S.headerSub, textAlign: isRTL ? "right" : "left" }}>
          {t.subtitle}
        </p>
        <a
          href="https://t.me/SudanScholarsBot"
          target="_blank"
          rel="noopener noreferrer"
          className="bot-tg-link"
          style={{ ...S.telegramBanner, flexDirection: isRTL ? "row-reverse" : "row" }}
        >
          <span style={{ fontSize: 18 }}>✈️</span>
          <span>{t.telegramBanner}</span>
          <span style={{ fontSize: 11, opacity: 0.7, marginLeft: isRTL ? 0 : "auto", marginRight: isRTL ? "auto" : 0 }}>
            @SudanScholarsBot
          </span>
        </a>
      </div>

      {/* Messages Area */}
      <div style={S.chatArea}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={msg.role === "user"
              ? { ...S.userBubble, borderRadius: isRTL ? "16px 16px 16px 4px" : "16px 16px 4px 16px", textAlign: isRTL ? "right" : "left" }
              : { ...S.botBubble, borderRadius: isRTL ? "16px 16px 4px 16px" : "16px 16px 16px 4px", textAlign: isRTL ? "right" : "left" }
            }
          >
            {msg.role === "bot" ? (
              <span dangerouslySetInnerHTML={{ __html: formatBotText(msg.text) }} />
            ) : (
              msg.text
            )}
          </div>
        ))}
        {loading && (
          <div style={S.typingDots}>
            <div style={{ ...S.dot, animationDelay: "0s" }} />
            <div style={{ ...S.dot, animationDelay: "0.2s" }} />
            <div style={{ ...S.dot, animationDelay: "0.4s" }} />
            <span style={{ fontSize: 12, color: "#999", marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }}>
              {t.typing}
            </span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Actions Bar */}
      <div style={{ ...S.quickBar, flexDirection: isRTL ? "row-reverse" : "row" }}>
        <span style={S.quickLabel}>{t.quickActions}:</span>
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.key}
            className="bot-quick-btn"
            style={S.quickBtn}
            onClick={() => handleQuickAction(action)}
            disabled={loading}
          >
            <span>{action.icon}</span>
            <span>{t[action.key]}</span>
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div style={{ ...S.inputArea, flexDirection: isRTL ? "row-reverse" : "row" }}>
        <input
          ref={inputRef}
          className="bot-input"
          style={{ ...S.input, textAlign: isRTL ? "right" : "left" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.placeholder}
          disabled={loading}
          dir={isRTL ? "rtl" : "ltr"}
        />
        <button
          className="bot-send-btn"
          style={S.sendBtn}
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
        >
          {t.send}
        </button>
      </div>

      {/* Footer */}
      <div style={S.footer}>{t.poweredBy}</div>
    </div>
  );
}
