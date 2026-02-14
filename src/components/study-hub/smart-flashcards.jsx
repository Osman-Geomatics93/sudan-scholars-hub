"use client";
import { useState, useEffect, useCallback } from "react";

const T = {
  en: {
    title: "Smart Flashcards",
    subtitle: "Spaced repetition for better memorization",
    myDecks: "My Decks",
    publicDecks: "Public Decks",
    newDeck: "New Deck",
    noDecks: "No flashcard decks yet. Create your first one!",
    noPublicDecks: "No public decks available.",
    deckTitle: "Deck Title",
    deckTitleHint: "e.g., Biology Chapter 3",
    deckDescription: "Description (optional)",
    deckSubject: "Subject (optional)",
    makePublic: "Make Public",
    create: "Create Deck",
    cards: "cards",
    dueCards: "due for review",
    cloned: "times cloned",
    study: "Study",
    addCard: "Add Card",
    front: "Front (Question)",
    back: "Back (Answer)",
    add: "Add",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    clone: "Clone Deck",
    cloning: "Cloning...",
    cloned_success: "Deck cloned! Check your decks.",
    share: "Share",
    unshare: "Unshare",
    aiGenerate: "AI Generate",
    aiGenerateTitle: "Generate Flashcards with AI",
    pasteText: "Paste your study material text",
    cardCount: "Number of cards",
    language: "Language",
    generate: "Generate",
    generating: "Generating cards...",
    generatedCards: "Generated Cards",
    addToDeck: "Add All to Deck",
    reviewTitle: "Review Session",
    showAnswer: "Show Answer",
    rateTitle: "How well did you know this?",
    again: "Again",
    hard: "Hard",
    good: "Good",
    easy: "Easy",
    perfect: "Perfect",
    reviewComplete: "Review complete! All cards reviewed.",
    backToDecks: "Back to Decks",
    backToDeck: "Back to Deck",
    loginRequired: "Please sign in to use Smart Flashcards",
    nextReview: "Next review",
    today: "Today",
    tomorrow: "Tomorrow",
    days: "days",
    searchPublic: "Search public decks...",
    by: "by",
  },
  ar: {
    title: "البطاقات الذكية",
    subtitle: "التكرار المتباعد لحفظ أفضل",
    myDecks: "مجموعاتي",
    publicDecks: "مجموعات عامة",
    newDeck: "مجموعة جديدة",
    noDecks: "لا توجد مجموعات بعد. أنشئ أول مجموعة!",
    noPublicDecks: "لا توجد مجموعات عامة متاحة.",
    deckTitle: "عنوان المجموعة",
    deckTitleHint: "مثل: الفصل الثالث - الأحياء",
    deckDescription: "الوصف (اختياري)",
    deckSubject: "المادة (اختياري)",
    makePublic: "مجموعة عامة",
    create: "إنشاء",
    cards: "بطاقات",
    dueCards: "للمراجعة",
    cloned: "مرات نسخ",
    study: "دراسة",
    addCard: "إضافة بطاقة",
    front: "الأمام (السؤال)",
    back: "الخلف (الجواب)",
    add: "إضافة",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تعديل",
    clone: "نسخ المجموعة",
    cloning: "جاري النسخ...",
    cloned_success: "تم نسخ المجموعة! تحقق من مجموعاتك.",
    share: "مشاركة",
    unshare: "إلغاء المشاركة",
    aiGenerate: "توليد بالذكاء الاصطناعي",
    aiGenerateTitle: "توليد بطاقات بالذكاء الاصطناعي",
    pasteText: "الصق نص المادة الدراسية",
    cardCount: "عدد البطاقات",
    language: "اللغة",
    generate: "توليد",
    generating: "جاري التوليد...",
    generatedCards: "البطاقات المولدة",
    addToDeck: "إضافة الكل للمجموعة",
    reviewTitle: "جلسة المراجعة",
    showAnswer: "اظهر الجواب",
    rateTitle: "كم عرفت هذه البطاقة؟",
    again: "مرة أخرى",
    hard: "صعب",
    good: "جيد",
    easy: "سهل",
    perfect: "ممتاز",
    reviewComplete: "انتهت المراجعة! تم مراجعة جميع البطاقات.",
    backToDecks: "العودة للمجموعات",
    backToDeck: "العودة للمجموعة",
    loginRequired: "يرجى تسجيل الدخول لاستخدام البطاقات الذكية",
    nextReview: "المراجعة القادمة",
    today: "اليوم",
    tomorrow: "غداً",
    days: "أيام",
    searchPublic: "ابحث في المجموعات العامة...",
    by: "بواسطة",
  },
};

export default function SmartFlashcards({ locale = "en", userId }) {
  const t = T[locale] || T.en;
  const isRTL = locale === "ar";

  const [tab, setTab] = useState("my"); // "my" or "public"
  const [decks, setDecks] = useState([]);
  const [publicDecks, setPublicDecks] = useState([]);
  const [activeDeck, setActiveDeck] = useState(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewCards, setReviewCards] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showNewDeck, setShowNewDeck] = useState(false);
  const [deckForm, setDeckForm] = useState({ title: "", description: "", subject: "", isPublic: false });
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardForm, setCardForm] = useState({ front: "", back: "" });
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiForm, setAiForm] = useState({ text: "", count: 10, language: locale });
  const [aiGenerating, setAiGenerating] = useState(false);
  const [generatedCards, setGeneratedCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [publicSearch, setPublicSearch] = useState("");

  const fetchDecks = useCallback(async () => {
    try {
      const res = await fetch("/api/study-hub/flashcards/decks");
      if (res.ok) { const data = await res.json(); setDecks(data.decks || []); }
    } catch (e) { console.error(e); }
  }, []);

  const fetchPublicDecks = useCallback(async (search = "") => {
    try {
      const url = `/api/study-hub/flashcards/decks?browse=public${search ? `&search=${encodeURIComponent(search)}` : ""}`;
      const res = await fetch(url);
      if (res.ok) { const data = await res.json(); setPublicDecks(data.decks || []); }
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { if (userId) { fetchDecks(); fetchPublicDecks(); } }, [userId, fetchDecks, fetchPublicDecks]);

  const openDeck = async (id) => {
    try {
      const res = await fetch(`/api/study-hub/flashcards/decks/${id}`);
      if (res.ok) {
        const data = await res.json();
        setActiveDeck(data.deck);
        setReviewMode(false);
      }
    } catch (e) { console.error(e); }
  };

  const createDeck = async () => {
    if (!deckForm.title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/study-hub/flashcards/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deckForm),
      });
      if (res.ok) {
        setShowNewDeck(false);
        setDeckForm({ title: "", description: "", subject: "", isPublic: false });
        fetchDecks();
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const deleteDeck = async (id) => {
    try {
      await fetch(`/api/study-hub/flashcards/decks/${id}`, { method: "DELETE" });
      setActiveDeck(null);
      fetchDecks();
    } catch (e) { console.error(e); }
  };

  const togglePublic = async (deck) => {
    try {
      await fetch(`/api/study-hub/flashcards/decks/${deck.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !deck.isPublic }),
      });
      openDeck(deck.id);
      fetchDecks();
    } catch (e) { console.error(e); }
  };

  const addCard = async () => {
    if (!cardForm.front.trim() || !cardForm.back.trim() || !activeDeck) return;
    try {
      const res = await fetch(`/api/study-hub/flashcards/decks/${activeDeck.id}/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cardForm),
      });
      if (res.ok) {
        setCardForm({ front: "", back: "" });
        setShowAddCard(false);
        openDeck(activeDeck.id);
      }
    } catch (e) { console.error(e); }
  };

  const deleteCard = async (cardId) => {
    try {
      await fetch(`/api/study-hub/flashcards/cards/${cardId}`, { method: "DELETE" });
      openDeck(activeDeck.id);
    } catch (e) { console.error(e); }
  };

  const cloneDeck = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/study-hub/flashcards/decks/${id}/clone`, { method: "POST" });
      if (res.ok) { fetchDecks(); setTab("my"); }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const startReview = () => {
    if (!activeDeck) return;
    const due = activeDeck.cards.filter((c) => new Date(c.nextReview) <= new Date());
    if (due.length === 0) return;
    setReviewCards(due);
    setReviewIndex(0);
    setFlipped(false);
    setReviewMode(true);
  };

  const reviewCard = async (quality) => {
    const card = reviewCards[reviewIndex];
    try {
      await fetch(`/api/study-hub/flashcards/cards/${card.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quality }),
      });
    } catch (e) { console.error(e); }

    if (reviewIndex + 1 < reviewCards.length) {
      setReviewIndex(reviewIndex + 1);
      setFlipped(false);
    } else {
      setReviewMode(false);
      openDeck(activeDeck.id);
    }
  };

  const generateCards = async () => {
    if (aiForm.text.length < 50) return;
    setAiGenerating(true);
    try {
      const res = await fetch("/api/study-hub/flashcards/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aiForm),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedCards(data.cards || []);
      }
    } catch (e) { console.error(e); }
    setAiGenerating(false);
  };

  const addGeneratedToDeck = async () => {
    if (!activeDeck || generatedCards.length === 0) return;
    setLoading(true);
    for (const card of generatedCards) {
      try {
        await fetch(`/api/study-hub/flashcards/decks/${activeDeck.id}/cards`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(card),
        });
      } catch (e) { console.error(e); }
    }
    setGeneratedCards([]);
    setShowAiModal(false);
    setAiForm({ text: "", count: 10, language: locale });
    openDeck(activeDeck.id);
    setLoading(false);
  };

  const getNextReviewLabel = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return t.today;
    if (diffDays === 1) return t.tomorrow;
    return `${diffDays} ${t.days}`;
  };

  if (!userId) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🧠</div>
        <h3 style={{ marginBottom: 8, color: "var(--text-primary, #1a1a2e)" }}>{t.title}</h3>
        <p style={{ color: "var(--text-secondary, #666)" }}>{t.loginRequired}</p>
      </div>
    );
  }

  // Review mode
  if (reviewMode && reviewCards.length > 0) {
    const card = reviewCards[reviewIndex];
    return (
      <div style={{ padding: "20px 0", maxWidth: 600, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <button onClick={() => setReviewMode(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "var(--text-primary, #333)" }}>
            {isRTL ? "→" : "←"} {t.backToDeck}
          </button>
          <span style={{ fontSize: 14, color: "var(--text-secondary, #888)" }}>{reviewIndex + 1}/{reviewCards.length}</span>
        </div>

        {/* Card */}
        <div
          onClick={() => !flipped && setFlipped(true)}
          style={{
            perspective: 1000,
            cursor: flipped ? "default" : "pointer",
            marginBottom: 20,
          }}
        >
          <div style={{
            position: "relative",
            width: "100%",
            minHeight: 250,
            transition: "transform 0.6s",
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}>
            {/* Front */}
            <div style={{
              position: "absolute", width: "100%", minHeight: 250, backfaceVisibility: "hidden",
              background: "linear-gradient(135deg, #3B82F6, #2563EB)", borderRadius: 20, padding: 30,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 18, lineHeight: 1.6, textAlign: "center", boxSizing: "border-box",
            }}>
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 12 }}>{t.front}</div>
              <div style={{ whiteSpace: "pre-wrap" }}>{card.front}</div>
              {!flipped && <div style={{ fontSize: 13, opacity: 0.6, marginTop: 16 }}>{t.showAnswer}</div>}
            </div>
            {/* Back */}
            <div style={{
              position: "absolute", width: "100%", minHeight: 250, backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: "linear-gradient(135deg, #10B981, #059669)", borderRadius: 20, padding: 30,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 18, lineHeight: 1.6, textAlign: "center", boxSizing: "border-box",
            }}>
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 12 }}>{t.back}</div>
              <div style={{ whiteSpace: "pre-wrap" }}>{card.back}</div>
            </div>
          </div>
        </div>

        {/* Rating buttons */}
        {flipped && (
          <div>
            <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-secondary, #888)", marginBottom: 12 }}>{t.rateTitle}</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              {[
                { q: 1, label: t.again, color: "#EF4444" },
                { q: 2, label: t.hard, color: "#F97316" },
                { q: 3, label: t.good, color: "#EAB308" },
                { q: 4, label: t.easy, color: "#22C55E" },
                { q: 5, label: t.perfect, color: "#3B82F6" },
              ].map((r) => (
                <button key={r.q} onClick={() => reviewCard(r.q)} style={{
                  padding: "10px 20px", borderRadius: 10, border: `2px solid ${r.color}`,
                  background: `${r.color}15`, color: r.color, fontWeight: 600, cursor: "pointer",
                  fontSize: 14, transition: "all 0.2s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = r.color; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = `${r.color}15`; e.currentTarget.style.color = r.color; }}
                >{r.label}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Deck detail view
  if (activeDeck) {
    const dueCount = activeDeck.cards ? activeDeck.cards.filter((c) => new Date(c.nextReview) <= new Date()).length : 0;
    const isOwner = activeDeck.userId === userId;

    return (
      <div style={{ padding: "20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={() => setActiveDeck(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "var(--text-primary, #333)" }}>
            {isRTL ? "→" : "←"} {t.backToDecks}
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, color: "var(--text-primary, #1a1a2e)" }}>{activeDeck.title}</h2>
            {activeDeck.description && <p style={{ margin: "4px 0", fontSize: 14, color: "var(--text-secondary, #888)" }}>{activeDeck.description}</p>}
            <div style={{ fontSize: 13, color: "var(--text-secondary, #888)", marginTop: 4 }}>
              {activeDeck.cards?.length || 0} {t.cards} · {dueCount} {t.dueCards}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {dueCount > 0 && (
              <button onClick={startReview} style={{ padding: "8px 18px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #10B981, #059669)", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
                {t.study} ({dueCount})
              </button>
            )}
            {isOwner && (
              <>
                <button onClick={() => setShowAddCard(true)} style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid var(--border, #ddd)", background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", cursor: "pointer", fontSize: 13 }}>
                  + {t.addCard}
                </button>
                <button onClick={() => setShowAiModal(true)} style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(139,92,246,0.3)", background: "rgba(139,92,246,0.05)", color: "#8B5CF6", cursor: "pointer", fontSize: 13 }}>
                  {t.aiGenerate}
                </button>
                <button onClick={() => togglePublic(activeDeck)} style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid var(--border, #ddd)", background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", cursor: "pointer", fontSize: 13 }}>
                  {activeDeck.isPublic ? t.unshare : t.share}
                </button>
                <button onClick={() => deleteDeck(activeDeck.id)} style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.05)", color: "#EF4444", cursor: "pointer", fontSize: 13 }}>
                  {t.delete}
                </button>
              </>
            )}
            {!isOwner && (
              <button onClick={() => cloneDeck(activeDeck.id)} disabled={loading} style={{ padding: "8px 18px", borderRadius: 10, border: "none", background: "#3B82F6", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
                {loading ? t.cloning : t.clone}
              </button>
            )}
          </div>
        </div>

        {/* Add Card Form */}
        {showAddCard && (
          <div style={{ background: "var(--bg-secondary, #f8f9fa)", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid var(--border, #e5e7eb)" }}>
            <input value={cardForm.front} onChange={(e) => setCardForm({ ...cardForm, front: e.target.value })} placeholder={t.front}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border, #ddd)", marginBottom: 8, background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", fontSize: 14, direction: isRTL ? "rtl" : "ltr", boxSizing: "border-box" }} />
            <textarea value={cardForm.back} onChange={(e) => setCardForm({ ...cardForm, back: e.target.value })} placeholder={t.back} rows={3}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border, #ddd)", marginBottom: 8, background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", fontSize: 14, resize: "vertical", direction: isRTL ? "rtl" : "ltr", boxSizing: "border-box", fontFamily: "inherit" }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={addCard} style={{ padding: "6px 16px", borderRadius: 8, border: "none", background: "#3B82F6", color: "#fff", cursor: "pointer", fontSize: 13 }}>{t.add}</button>
              <button onClick={() => setShowAddCard(false)} style={{ padding: "6px 16px", borderRadius: 8, border: "1px solid var(--border, #ddd)", background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", cursor: "pointer", fontSize: 13 }}>{t.cancel}</button>
            </div>
          </div>
        )}

        {/* Cards list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {(activeDeck.cards || []).map((card) => (
            <div key={card.id} style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid var(--border, #e5e7eb)", background: "var(--bg-primary, #fff)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary, #1a1a2e)", marginBottom: 4 }}>{card.front}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary, #888)" }}>{card.back}</div>
                <div style={{ fontSize: 11, color: "var(--text-secondary, #aaa)", marginTop: 4 }}>
                  {t.nextReview}: {getNextReviewLabel(card.nextReview)}
                </div>
              </div>
              {isOwner && (
                <button onClick={() => deleteCard(card.id)} style={{ padding: "2px 8px", borderRadius: 4, border: "1px solid rgba(239,68,68,0.2)", background: "transparent", color: "#EF4444", fontSize: 11, cursor: "pointer" }}>
                  {t.delete}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* AI Generate Modal */}
        {showAiModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
            <div style={{ background: "var(--bg-primary, #fff)", borderRadius: 20, padding: 24, maxWidth: 560, width: "100%", maxHeight: "80vh", overflow: "auto" }}>
              <h3 style={{ margin: "0 0 16px", color: "var(--text-primary, #1a1a2e)" }}>{t.aiGenerateTitle}</h3>
              <textarea value={aiForm.text} onChange={(e) => setAiForm({ ...aiForm, text: e.target.value })} placeholder={t.pasteText} rows={6}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border, #ddd)", marginBottom: 12, background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", fontSize: 14, resize: "vertical", direction: isRTL ? "rtl" : "ltr", boxSizing: "border-box", fontFamily: "inherit" }} />
              <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-secondary, #888)" }}>{t.cardCount}</label>
                  <input type="number" min={1} max={30} value={aiForm.count} onChange={(e) => setAiForm({ ...aiForm, count: parseInt(e.target.value) || 10 })}
                    style={{ display: "block", width: 80, padding: "6px 8px", borderRadius: 6, border: "1px solid var(--border, #ddd)", marginTop: 4, background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text-secondary, #888)" }}>{t.language}</label>
                  <select value={aiForm.language} onChange={(e) => setAiForm({ ...aiForm, language: e.target.value })}
                    style={{ display: "block", padding: "6px 8px", borderRadius: 6, border: "1px solid var(--border, #ddd)", marginTop: 4, background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)" }}>
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>
              </div>
              <button onClick={generateCards} disabled={aiGenerating || aiForm.text.length < 50} style={{
                padding: "8px 20px", borderRadius: 8, border: "none", background: "#8B5CF6", color: "#fff", fontWeight: 600, cursor: aiGenerating ? "not-allowed" : "pointer", fontSize: 14, marginBottom: 12,
              }}>
                {aiGenerating ? t.generating : t.generate}
              </button>

              {/* Generated cards preview */}
              {generatedCards.length > 0 && (
                <div>
                  <h4 style={{ margin: "12px 0 8px", color: "var(--text-primary, #1a1a2e)" }}>{t.generatedCards} ({generatedCards.length})</h4>
                  <div style={{ maxHeight: 200, overflow: "auto", marginBottom: 12 }}>
                    {generatedCards.map((c, i) => (
                      <div key={i} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border, #e5e7eb)", marginBottom: 6, fontSize: 13 }}>
                        <div style={{ fontWeight: 600, color: "var(--text-primary, #333)" }}>{c.front}</div>
                        <div style={{ color: "var(--text-secondary, #888)", marginTop: 2 }}>{c.back}</div>
                      </div>
                    ))}
                  </div>
                  <button onClick={addGeneratedToDeck} disabled={loading} style={{
                    padding: "8px 20px", borderRadius: 8, border: "none", background: "#10B981", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14,
                  }}>
                    {t.addToDeck}
                  </button>
                </div>
              )}

              <div style={{ marginTop: 12, textAlign: "right" }}>
                <button onClick={() => { setShowAiModal(false); setGeneratedCards([]); }} style={{ padding: "6px 16px", borderRadius: 8, border: "1px solid var(--border, #ddd)", background: "transparent", color: "var(--text-primary, #333)", cursor: "pointer", fontSize: 13 }}>
                  {t.cancel}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Deck list view
  return (
    <div style={{ padding: "20px 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, color: "var(--text-primary, #1a1a2e)" }}>🧠 {t.title}</h2>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "var(--text-secondary, #888)" }}>{t.subtitle}</p>
        </div>
        <button onClick={() => setShowNewDeck(!showNewDeck)} style={{
          padding: "8px 18px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
          color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14,
        }}>
          + {t.newDeck}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "var(--bg-secondary, #f0f0f0)", borderRadius: 10, padding: 3 }}>
        {[{ key: "my", label: t.myDecks }, { key: "public", label: t.publicDecks }].map((tb) => (
          <button key={tb.key} onClick={() => { setTab(tb.key); if (tb.key === "public") fetchPublicDecks(publicSearch); }}
            style={{ flex: 1, padding: "8px 16px", borderRadius: 8, border: "none", background: tab === tb.key ? "var(--bg-primary, #fff)" : "transparent",
              color: tab === tb.key ? "var(--text-primary, #333)" : "var(--text-secondary, #888)", fontWeight: tab === tb.key ? 600 : 400, cursor: "pointer", fontSize: 14, transition: "all 0.2s",
              boxShadow: tab === tb.key ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          }}>{tb.label}</button>
        ))}
      </div>

      {/* New Deck Form */}
      {showNewDeck && (
        <div style={{ background: "var(--bg-secondary, #f8f9fa)", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid var(--border, #e5e7eb)" }}>
          <input value={deckForm.title} onChange={(e) => setDeckForm({ ...deckForm, title: e.target.value })} placeholder={t.deckTitleHint}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border, #ddd)", marginBottom: 8, background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", fontSize: 14, direction: isRTL ? "rtl" : "ltr", boxSizing: "border-box" }} />
          <input value={deckForm.description} onChange={(e) => setDeckForm({ ...deckForm, description: e.target.value })} placeholder={t.deckDescription}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border, #ddd)", marginBottom: 8, background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", fontSize: 14, direction: isRTL ? "rtl" : "ltr", boxSizing: "border-box" }} />
          <input value={deckForm.subject} onChange={(e) => setDeckForm({ ...deckForm, subject: e.target.value })} placeholder={t.deckSubject}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border, #ddd)", marginBottom: 8, background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", fontSize: 14, direction: isRTL ? "rtl" : "ltr", boxSizing: "border-box" }} />
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--text-primary, #333)", marginBottom: 12, cursor: "pointer" }}>
            <input type="checkbox" checked={deckForm.isPublic} onChange={(e) => setDeckForm({ ...deckForm, isPublic: e.target.checked })} />
            {t.makePublic}
          </label>
          <button onClick={createDeck} disabled={loading} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#8B5CF6", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
            {t.create}
          </button>
        </div>
      )}

      {/* Public search */}
      {tab === "public" && (
        <div style={{ marginBottom: 12 }}>
          <input value={publicSearch} onChange={(e) => { setPublicSearch(e.target.value); fetchPublicDecks(e.target.value); }} placeholder={t.searchPublic}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border, #ddd)", background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", fontSize: 14, direction: isRTL ? "rtl" : "ltr", boxSizing: "border-box" }} />
        </div>
      )}

      {/* Deck grid */}
      {tab === "my" && (
        decks.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--text-secondary, #888)" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🧠</div>
            <p>{t.noDecks}</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {decks.map((deck) => (
              <div key={deck.id} onClick={() => openDeck(deck.id)} style={{
                padding: 16, borderRadius: 14, border: "1px solid var(--border, #e5e7eb)", background: "var(--bg-primary, #fff)",
                cursor: "pointer", transition: "all 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#8B5CF6"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border, #e5e7eb)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ fontWeight: 600, fontSize: 16, color: "var(--text-primary, #1a1a2e)", marginBottom: 4 }}>{deck.title}</div>
                {deck.subject && <div style={{ fontSize: 12, color: "#8B5CF6", marginBottom: 4 }}>{deck.subject}</div>}
                <div style={{ fontSize: 13, color: "var(--text-secondary, #888)" }}>
                  {deck._count?.cards || 0} {t.cards}
                  {deck.isPublic && <span> · {deck.cloneCount} {t.cloned}</span>}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === "public" && (
        publicDecks.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--text-secondary, #888)" }}>
            <p>{t.noPublicDecks}</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {publicDecks.map((deck) => (
              <div key={deck.id} onClick={() => openDeck(deck.id)} style={{
                padding: 16, borderRadius: 14, border: "1px solid var(--border, #e5e7eb)", background: "var(--bg-primary, #fff)",
                cursor: "pointer", transition: "all 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3B82F6"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border, #e5e7eb)"; }}
              >
                <div style={{ fontWeight: 600, fontSize: 16, color: "var(--text-primary, #1a1a2e)", marginBottom: 4 }}>{deck.title}</div>
                {deck.subject && <div style={{ fontSize: 12, color: "#3B82F6", marginBottom: 4 }}>{deck.subject}</div>}
                <div style={{ fontSize: 13, color: "var(--text-secondary, #888)" }}>
                  {deck._count?.cards || 0} {t.cards} · {deck.cloneCount} {t.cloned}
                </div>
                {deck.user && <div style={{ fontSize: 12, color: "var(--text-secondary, #aaa)", marginTop: 4 }}>{t.by} {deck.user.name}</div>}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
