"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const T = {
  en: {
    title: "AI Study Assistant",
    subtitle: "Chat with your study materials",
    newChat: "New Chat",
    sessions: "Chat Sessions",
    noSessions: "No chat sessions yet. Start a new conversation!",
    deleteSession: "Delete",
    contextType: "Study Context",
    ctxNone: "General Chat",
    ctxMaterial: "Study Material",
    ctxExam: "Past Exam",
    ctxPaste: "Paste Text",
    ctxPasteHint: "Paste your study material text here...",
    materialId: "Material ID",
    examId: "Exam ID",
    sessionTitle: "Chat Title",
    sessionTitleHint: "e.g., Biology Chapter 3 Review",
    startChat: "Start Chat",
    typeMessage: "Ask a question about your material...",
    send: "Send",
    thinking: "Thinking...",
    extractPdf: "Extract PDF Text",
    extracting: "Extracting text from PDF...",
    pdfUrl: "PDF URL",
    extract: "Extract",
    extracted: "Text extracted! Characters:",
    loginRequired: "Please sign in to use the AI Study Assistant",
    back: "Back to Sessions",
    noMessages: "Start the conversation! Ask questions about your study material.",
    errorMsg: "Something went wrong. Please try again.",
    suggestedQuestions: "Try asking:",
    sq1: "Summarize the main concepts",
    sq2: "Explain this in simple terms",
    sq3: "Create practice questions",
    sq4: "What are the key takeaways?",
  },
  ar: {
    title: "مساعد الدراسة الذكي",
    subtitle: "تحدث مع موادك الدراسية",
    newChat: "محادثة جديدة",
    sessions: "المحادثات",
    noSessions: "لا توجد محادثات بعد. ابدأ محادثة جديدة!",
    deleteSession: "حذف",
    contextType: "سياق الدراسة",
    ctxNone: "محادثة عامة",
    ctxMaterial: "مادة دراسية",
    ctxExam: "امتحان سابق",
    ctxPaste: "لصق نص",
    ctxPasteHint: "الصق نص المادة الدراسية هنا...",
    materialId: "معرف المادة",
    examId: "معرف الامتحان",
    sessionTitle: "عنوان المحادثة",
    sessionTitleHint: "مثل: مراجعة الفصل الثالث - الأحياء",
    startChat: "ابدأ المحادثة",
    typeMessage: "اسأل سؤالاً عن مادتك الدراسية...",
    send: "إرسال",
    thinking: "جاري التفكير...",
    extractPdf: "استخراج نص PDF",
    extracting: "جاري استخراج النص...",
    pdfUrl: "رابط PDF",
    extract: "استخراج",
    extracted: "تم استخراج النص! عدد الأحرف:",
    loginRequired: "يرجى تسجيل الدخول لاستخدام مساعد الدراسة الذكي",
    back: "العودة للمحادثات",
    noMessages: "ابدأ المحادثة! اسأل عن مادتك الدراسية.",
    errorMsg: "حدث خطأ. يرجى المحاولة مرة أخرى.",
    suggestedQuestions: "جرب أن تسأل:",
    sq1: "لخص المفاهيم الرئيسية",
    sq2: "اشرح هذا بطريقة بسيطة",
    sq3: "أنشئ أسئلة تدريبية",
    sq4: "ما هي النقاط الرئيسية؟",
  },
};

export default function AIStudyAssistant({ locale = "en", userId }) {
  const t = T[locale] || T.en;
  const isRTL = locale === "ar";

  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newForm, setNewForm] = useState({ title: "", contextType: "none", contextId: "", contextText: "" });
  const [pdfUrl, setPdfUrl] = useState("");
  const [extracting, setExtracting] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/study-hub/ai-chat/sessions");
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { if (userId) fetchSessions(); }, [userId, fetchSessions]);

  const openSession = async (id) => {
    try {
      const res = await fetch(`/api/study-hub/ai-chat/sessions/${id}`);
      if (res.ok) {
        const data = await res.json();
        setActiveSession(data.session);
        setMessages(data.session.messages || []);
        setShowNewForm(false);
      }
    } catch (e) { console.error(e); }
  };

  const createSession = async () => {
    if (!newForm.title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/study-hub/ai-chat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newForm.title,
          contextType: newForm.contextType,
          contextId: newForm.contextId || null,
          contextText: newForm.contextText || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setActiveSession(data.session);
        setMessages([]);
        setShowNewForm(false);
        setNewForm({ title: "", contextType: "none", contextId: "", contextText: "" });
        fetchSessions();
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const deleteSession = async (id) => {
    try {
      await fetch(`/api/study-hub/ai-chat/sessions/${id}`, { method: "DELETE" });
      if (activeSession?.id === id) {
        setActiveSession(null);
        setMessages([]);
      }
      fetchSessions();
    } catch (e) { console.error(e); }
  };

  const sendMessage = async (text) => {
    const content = text || input.trim();
    if (!content || !activeSession || streaming) return;
    setInput("");
    setStreaming(true);

    const userMsg = { id: Date.now().toString(), role: "user", content, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);

    const assistantMsg = { id: (Date.now() + 1).toString(), role: "assistant", content: "", createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      const res = await fetch(`/api/study-hub/ai-chat/sessions/${activeSession.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullText += parsed.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { ...updated[updated.length - 1], content: fullText };
                  return updated;
                });
              }
            } catch {}
          }
        }
      }
    } catch (e) {
      console.error(e);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], content: t.errorMsg };
        return updated;
      });
    }
    setStreaming(false);
  };

  const extractPdf = async () => {
    if (!pdfUrl.trim()) return;
    setExtracting(true);
    try {
      const res = await fetch("/api/study-hub/ai-chat/extract-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: pdfUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        setNewForm((prev) => ({ ...prev, contextText: data.text, contextType: "paste" }));
        setPdfUrl("");
      }
    } catch (e) { console.error(e); }
    setExtracting(false);
  };

  if (!userId) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
        <h3 style={{ marginBottom: 8, color: "var(--text-primary, #1a1a2e)" }}>{t.title}</h3>
        <p style={{ color: "var(--text-secondary, #666)" }}>{t.loginRequired}</p>
      </div>
    );
  }

  // Chat view
  if (activeSession) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 300px)", minHeight: 500 }}>
        {/* Header */}
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border, #e5e7eb)", display: "flex", alignItems: "center", gap: 12, background: "var(--bg-secondary, #f8f9fa)" }}>
          <button onClick={() => { setActiveSession(null); setMessages([]); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: "4px 8px", borderRadius: 6, color: "var(--text-primary, #333)" }}>
            {isRTL ? "→" : "←"} {t.back}
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: "var(--text-primary, #1a1a2e)" }}>{activeSession.title}</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary, #888)" }}>
              {activeSession.contextType !== "none" ? `📎 ${t[`ctx${activeSession.contextType.charAt(0).toUpperCase() + activeSession.contextType.slice(1)}`]}` : t.ctxNone}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "var(--text-secondary, #888)" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
              <p>{t.noMessages}</p>
              <p style={{ fontSize: 14, marginTop: 16, fontWeight: 600 }}>{t.suggestedQuestions}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 8 }}>
                {[t.sq1, t.sq2, t.sq3, t.sq4].map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q)} style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid var(--border, #ddd)", background: "var(--bg-primary, #fff)", cursor: "pointer", fontSize: 13, color: "var(--text-primary, #333)", transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent, #3B82F6)"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-primary, #fff)"; e.currentTarget.style.color = "var(--text-primary, #333)"; }}
                  >{q}</button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "80%",
                padding: "10px 14px",
                borderRadius: 16,
                background: msg.role === "user" ? "linear-gradient(135deg, #3B82F6, #2563EB)" : "var(--bg-secondary, #f0f0f0)",
                color: msg.role === "user" ? "#fff" : "var(--text-primary, #333)",
                fontSize: 14,
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                borderBottomRightRadius: msg.role === "user" ? 4 : 16,
                borderBottomLeftRadius: msg.role === "user" ? 16 : 4,
              }}>
                {msg.content || (streaming ? "..." : "")}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border, #e5e7eb)", display: "flex", gap: 8, background: "var(--bg-secondary, #f8f9fa)" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={t.typeMessage}
            disabled={streaming}
            style={{ flex: 1, padding: "10px 14px", borderRadius: 12, border: "1px solid var(--border, #ddd)", background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", fontSize: 14, outline: "none", direction: isRTL ? "rtl" : "ltr" }}
          />
          <button onClick={() => sendMessage()} disabled={streaming || !input.trim()} style={{
            padding: "10px 20px", borderRadius: 12, border: "none", background: streaming ? "#94a3b8" : "linear-gradient(135deg, #3B82F6, #2563EB)",
            color: "#fff", fontWeight: 600, cursor: streaming ? "not-allowed" : "pointer", fontSize: 14, transition: "all 0.2s",
          }}>
            {streaming ? t.thinking : t.send}
          </button>
        </div>
      </div>
    );
  }

  // Session list + new form
  return (
    <div style={{ padding: "20px 0" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, color: "var(--text-primary, #1a1a2e)" }}>🤖 {t.title}</h2>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "var(--text-secondary, #888)" }}>{t.subtitle}</p>
        </div>
        <button onClick={() => setShowNewForm(!showNewForm)} style={{
          padding: "8px 18px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #3B82F6, #2563EB)",
          color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14,
        }}>
          + {t.newChat}
        </button>
      </div>

      {/* New Chat Form */}
      {showNewForm && (
        <div style={{ background: "var(--bg-secondary, #f8f9fa)", borderRadius: 16, padding: 20, marginBottom: 20, border: "1px solid var(--border, #e5e7eb)" }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary, #666)", display: "block", marginBottom: 4 }}>{t.sessionTitle}</label>
            <input value={newForm.title} onChange={(e) => setNewForm({ ...newForm, title: e.target.value })} placeholder={t.sessionTitleHint}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border, #ddd)", background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", fontSize: 14, direction: isRTL ? "rtl" : "ltr", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary, #666)", display: "block", marginBottom: 4 }}>{t.contextType}</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { key: "none", label: t.ctxNone, icon: "💬" },
                { key: "paste", label: t.ctxPaste, icon: "📋" },
                { key: "material", label: t.ctxMaterial, icon: "📚" },
                { key: "exam", label: t.ctxExam, icon: "📝" },
              ].map((opt) => (
                <button key={opt.key} onClick={() => setNewForm({ ...newForm, contextType: opt.key })} style={{
                  padding: "6px 14px", borderRadius: 8, border: `1px solid ${newForm.contextType === opt.key ? "#3B82F6" : "var(--border, #ddd)"}`,
                  background: newForm.contextType === opt.key ? "rgba(59,130,246,0.1)" : "var(--bg-primary, #fff)",
                  color: "var(--text-primary, #333)", cursor: "pointer", fontSize: 13,
                }}>
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          </div>

          {newForm.contextType === "material" && (
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary, #666)", display: "block", marginBottom: 4 }}>{t.materialId}</label>
              <input value={newForm.contextId} onChange={(e) => setNewForm({ ...newForm, contextId: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border, #ddd)", background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", fontSize: 14, boxSizing: "border-box" }} />
            </div>
          )}

          {newForm.contextType === "exam" && (
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary, #666)", display: "block", marginBottom: 4 }}>{t.examId}</label>
              <input value={newForm.contextId} onChange={(e) => setNewForm({ ...newForm, contextId: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border, #ddd)", background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", fontSize: 14, boxSizing: "border-box" }} />
            </div>
          )}

          {newForm.contextType === "paste" && (
            <>
              {/* PDF Extractor */}
              <div style={{ marginBottom: 12, padding: 12, background: "rgba(59,130,246,0.05)", borderRadius: 8, border: "1px solid rgba(59,130,246,0.15)" }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#3B82F6", display: "block", marginBottom: 4 }}>📄 {t.extractPdf}</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} placeholder={t.pdfUrl}
                    style={{ flex: 1, padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border, #ddd)", fontSize: 13, background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)" }} />
                  <button onClick={extractPdf} disabled={extracting || !pdfUrl.trim()} style={{
                    padding: "6px 14px", borderRadius: 6, border: "none", background: "#3B82F6", color: "#fff", fontSize: 13, cursor: extracting ? "not-allowed" : "pointer",
                  }}>
                    {extracting ? "..." : t.extract}
                  </button>
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <textarea value={newForm.contextText} onChange={(e) => setNewForm({ ...newForm, contextText: e.target.value })} placeholder={t.ctxPasteHint} rows={6}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border, #ddd)", background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", fontSize: 14, resize: "vertical", direction: isRTL ? "rtl" : "ltr", boxSizing: "border-box", fontFamily: "inherit" }} />
                {newForm.contextText && (
                  <div style={{ fontSize: 12, color: "var(--text-secondary, #888)", marginTop: 4 }}>
                    {t.extracted} {newForm.contextText.length.toLocaleString()}
                  </div>
                )}
              </div>
            </>
          )}

          <button onClick={createSession} disabled={loading || !newForm.title.trim()} style={{
            padding: "10px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #3B82F6, #2563EB)",
            color: "#fff", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontSize: 14, width: "100%",
          }}>
            {loading ? "..." : t.startChat}
          </button>
        </div>
      )}

      {/* Session List */}
      <div>
        <h3 style={{ fontSize: 16, marginBottom: 12, color: "var(--text-primary, #1a1a2e)" }}>{t.sessions}</h3>
        {sessions.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--text-secondary, #888)" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>💬</div>
            <p>{t.noSessions}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sessions.map((s) => (
              <div key={s.id} onClick={() => openSession(s.id)} style={{
                padding: "12px 16px", borderRadius: 12, border: "1px solid var(--border, #e5e7eb)",
                background: "var(--bg-primary, #fff)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
                transition: "all 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3B82F6"; e.currentTarget.style.background = "rgba(59,130,246,0.03)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border, #e5e7eb)"; e.currentTarget.style.background = "var(--bg-primary, #fff)"; }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text-primary, #1a1a2e)", fontSize: 14 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary, #888)", marginTop: 2 }}>
                    {s._count?.messages || 0} messages · {new Date(s.updatedAt).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }} style={{
                  padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.05)",
                  color: "#EF4444", fontSize: 12, cursor: "pointer",
                }}>
                  {t.deleteSession}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
