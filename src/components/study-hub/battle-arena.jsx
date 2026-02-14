"use client";
import { useState, useEffect, useCallback, useRef } from "react";

const T = {
  en: {
    title: "Battle Arena",
    subtitle: "Challenge friends in quiz duels",
    lobby: "Lobby",
    myQuestions: "My Questions",
    activeBattles: "Active Battles",
    rankings: "Rankings",
    createChallenge: "Create Challenge",
    incoming: "Incoming Challenges",
    outgoing: "Outgoing Challenges",
    accept: "Accept",
    decline: "Decline",
    play: "Play",
    noIncoming: "No incoming challenges",
    noOutgoing: "No outgoing challenges",
    noBattles: "No active battles yet",
    addQuestion: "Add Question",
    subject: "Subject",
    question: "Question",
    optionA: "Option A",
    optionB: "Option B",
    optionC: "Option C",
    optionD: "Option D",
    correctAnswer: "Correct Answer",
    difficulty: "Difficulty",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    totalQuestions: "Total Questions",
    bySubject: "By Subject",
    minQuestions: "You need at least 5 questions to start battling",
    selectOpponent: "Select Opponent",
    selectSubject: "Select Subject",
    searchOpponent: "Search by name...",
    noOpponents: "No opponents found",
    challengeSent: "Challenge Sent!",
    vs: "vs",
    score: "Score",
    winner: "Winner",
    you: "You",
    waiting: "Waiting for opponent...",
    battleComplete: "Battle Complete!",
    yourScore: "Your Score",
    theirScore: "Their Score",
    pointsEarned: "Points Earned",
    questionNum: "Question",
    of: "of",
    timeLeft: "Time Left",
    seconds: "s",
    correct: "Correct!",
    wrong: "Wrong!",
    combo: "Combo",
    results: "Results",
    weekly: "Weekly",
    monthly: "Monthly",
    allTime: "All Time",
    rank: "Rank",
    wins: "Wins",
    losses: "Losses",
    winRate: "Win Rate",
    battles: "Battles",
    noRankings: "No rankings yet. Start battling!",
    loading: "Loading...",
    pending: "Pending",
    inProgress: "In Progress",
    completed: "Completed",
    declined: "Declined",
    questionsCount: "questions",
    challengeFrom: "Challenge from",
    challengeTo: "Challenge to",
    submitAnswers: "Submit Answers",
    back: "Back",
    next: "Next",
  },
  ar: {
    title: "ساحة المعركة",
    subtitle: "تحدّى أصدقاءك في مبارزات الأسئلة",
    lobby: "الردهة",
    myQuestions: "أسئلتي",
    activeBattles: "المعارك النشطة",
    rankings: "التصنيفات",
    createChallenge: "إنشاء تحدي",
    incoming: "التحديات الواردة",
    outgoing: "التحديات الصادرة",
    accept: "قبول",
    decline: "رفض",
    play: "العب",
    noIncoming: "لا توجد تحديات واردة",
    noOutgoing: "لا توجد تحديات صادرة",
    noBattles: "لا توجد معارك نشطة بعد",
    addQuestion: "إضافة سؤال",
    subject: "المادة",
    question: "السؤال",
    optionA: "الخيار أ",
    optionB: "الخيار ب",
    optionC: "الخيار ج",
    optionD: "الخيار د",
    correctAnswer: "الإجابة الصحيحة",
    difficulty: "الصعوبة",
    easy: "سهل",
    medium: "متوسط",
    hard: "صعب",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    totalQuestions: "إجمالي الأسئلة",
    bySubject: "حسب المادة",
    minQuestions: "تحتاج 5 أسئلة على الأقل لبدء المبارزة",
    selectOpponent: "اختر الخصم",
    selectSubject: "اختر المادة",
    searchOpponent: "ابحث بالاسم...",
    noOpponents: "لم يتم العثور على خصوم",
    challengeSent: "تم إرسال التحدي!",
    vs: "ضد",
    score: "النتيجة",
    winner: "الفائز",
    you: "أنت",
    waiting: "في انتظار الخصم...",
    battleComplete: "اكتملت المعركة!",
    yourScore: "نتيجتك",
    theirScore: "نتيجتهم",
    pointsEarned: "النقاط المكتسبة",
    questionNum: "السؤال",
    of: "من",
    timeLeft: "الوقت المتبقي",
    seconds: "ث",
    correct: "صحيح!",
    wrong: "خطأ!",
    combo: "كومبو",
    results: "النتائج",
    weekly: "أسبوعي",
    monthly: "شهري",
    allTime: "الكل",
    rank: "الترتيب",
    wins: "الفوز",
    losses: "الخسارة",
    winRate: "نسبة الفوز",
    battles: "المعارك",
    noRankings: "لا توجد تصنيفات بعد. ابدأ المبارزة!",
    loading: "جاري التحميل...",
    pending: "معلق",
    inProgress: "جاري",
    completed: "مكتمل",
    declined: "مرفوض",
    questionsCount: "أسئلة",
    challengeFrom: "تحدي من",
    challengeTo: "تحدي إلى",
    submitAnswers: "تسليم الإجابات",
    back: "رجوع",
    next: "التالي",
  },
};

const TABS = ["lobby", "myQuestions", "activeBattles", "rankings"];
const TAB_ICONS = { lobby: "🏟️", myQuestions: "📝", activeBattles: "⚔️", rankings: "🏆" };

export default function BattleArena({ locale = "en", userId }) {
  const t = T[locale] || T.en;
  const isRTL = locale === "ar";

  const [tab, setTab] = useState("lobby");
  const [loading, setLoading] = useState(false);

  // Battles
  const [battles, setBattles] = useState({ pending: [], active: [], completed: [] });

  // Questions
  const [questions, setQuestions] = useState([]);
  const [questionsTotal, setQuestionsTotal] = useState(0);
  const [subjectBreakdown, setSubjectBreakdown] = useState([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    subject: "", question: "", optionA: "", optionB: "", optionC: "", optionD: "",
    correctOption: "A", difficulty: "medium",
  });

  // Challenge modal
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [opponentSearch, setOpponentSearch] = useState("");
  const [opponentResults, setOpponentResults] = useState([]);
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [challengeSubject, setChallengeSubject] = useState("");

  // Quiz mode
  const [quizBattle, setQuizBattle] = useState(null);
  const [quizQuestionIdx, setQuizQuestionIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizTimeLeft, setQuizTimeLeft] = useState(30);
  const [quizSelectedAnswer, setQuizSelectedAnswer] = useState(null);
  const [quizShowResult, setQuizShowResult] = useState(false);
  const [quizCombo, setQuizCombo] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const timerRef = useRef(null);
  const questionStartRef = useRef(null);

  // Rankings
  const [rankings, setRankings] = useState([]);
  const [rankPeriod, setRankPeriod] = useState("all-time");

  // === DATA FETCHING ===
  const fetchBattles = useCallback(async () => {
    try {
      const res = await fetch("/api/study-hub/battle");
      if (res.ok) {
        const data = await res.json();
        setBattles({ pending: data.pending || [], active: data.active || [], completed: data.completed || [] });
      }
    } catch (err) { console.error(err); }
  }, []);

  const fetchQuestions = useCallback(async () => {
    try {
      const res = await fetch("/api/study-hub/battle/questions");
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions || []);
        setQuestionsTotal(data.total || 0);
        setSubjectBreakdown(data.subjects || []);
      }
    } catch (err) { console.error(err); }
  }, []);

  const fetchRankings = useCallback(async () => {
    try {
      const res = await fetch(`/api/study-hub/battle/leaderboard?period=${rankPeriod}`);
      if (res.ok) {
        const data = await res.json();
        setRankings(data.rankings || []);
      }
    } catch (err) { console.error(err); }
  }, [rankPeriod]);

  useEffect(() => {
    fetchBattles();
    fetchQuestions();
  }, [fetchBattles, fetchQuestions]);

  useEffect(() => {
    if (tab === "rankings") fetchRankings();
  }, [tab, fetchRankings]);

  // === QUESTION MANAGEMENT ===
  const addQuestion = async () => {
    if (!questionForm.subject || !questionForm.question || !questionForm.optionA || !questionForm.optionB || !questionForm.optionC || !questionForm.optionD) return;
    setLoading(true);
    try {
      const res = await fetch("/api/study-hub/battle/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionForm),
      });
      if (res.ok) {
        setQuestionForm({ subject: "", question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctOption: "A", difficulty: "medium" });
        setShowQuestionForm(false);
        fetchQuestions();
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const deleteQuestion = async (id) => {
    try {
      const res = await fetch(`/api/study-hub/battle/questions?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchQuestions();
    } catch (err) { console.error(err); }
  };

  // === CHALLENGE ===
  const searchOpponents = async (query) => {
    setOpponentSearch(query);
    if (query.length < 2) { setOpponentResults([]); return; }
    try {
      const res = await fetch(`/api/study-hub/battle/leaderboard?period=all-time`);
      if (res.ok) {
        const data = await res.json();
        const filtered = (data.rankings || [])
          .filter(r => r.user.id !== userId && r.user.name?.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 10);
        setOpponentResults(filtered.map(r => r.user));
      }
    } catch (err) { console.error(err); }
  };

  const createChallenge = async () => {
    if (!selectedOpponent || !challengeSubject) return;
    setLoading(true);
    try {
      const res = await fetch("/api/study-hub/battle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opponentId: selectedOpponent.id, subject: challengeSubject }),
      });
      if (res.ok) {
        setShowChallengeModal(false);
        setSelectedOpponent(null);
        setChallengeSubject("");
        setOpponentSearch("");
        fetchBattles();
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const acceptBattle = async (battleId) => {
    try {
      const res = await fetch(`/api/study-hub/battle/${battleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "accept" }),
      });
      if (res.ok) fetchBattles();
    } catch (err) { console.error(err); }
  };

  const declineBattle = async (battleId) => {
    try {
      const res = await fetch(`/api/study-hub/battle/${battleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "decline" }),
      });
      if (res.ok) fetchBattles();
    } catch (err) { console.error(err); }
  };

  // === QUIZ MODE ===
  const startQuiz = async (battleId) => {
    try {
      const res = await fetch(`/api/study-hub/battle/${battleId}`);
      if (!res.ok) return;
      const data = await res.json();
      setQuizBattle(data.battle);
      setQuizQuestionIdx(0);
      setQuizAnswers([]);
      setQuizScore(0);
      setQuizCombo(0);
      setQuizFinished(false);
      setQuizSelectedAnswer(null);
      setQuizShowResult(false);
      setQuizTimeLeft(30);
      questionStartRef.current = Date.now();
      startTimer();
    } catch (err) { console.error(err); }
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setQuizTimeLeft(30);
    timerRef.current = setInterval(() => {
      setQuizTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimerExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimerExpired = () => {
    // Auto-submit wrong answer on timeout
    const timeMs = 30000;
    setQuizAnswers(prev => [...prev, { questionIdx: quizQuestionIdx, answer: "X", timeMs }]);
    setQuizCombo(0);
    setQuizShowResult(true);
    setQuizSelectedAnswer("X");
    setTimeout(() => advanceQuestion(), 1500);
  };

  const selectAnswer = (answer) => {
    if (quizSelectedAnswer !== null) return;
    clearInterval(timerRef.current);
    const timeMs = Date.now() - (questionStartRef.current || Date.now());
    setQuizSelectedAnswer(answer);

    const questions = quizBattle?.questions || [];
    const q = questions[quizQuestionIdx];
    const isCorrect = q && answer === q.correctOption;

    if (isCorrect) {
      const speedBonus = Math.max(0, Math.floor((30000 - timeMs) / 300));
      const pts = 100 + speedBonus;
      setQuizScore(prev => prev + pts);
      setQuizCombo(prev => prev + 1);
    } else {
      setQuizCombo(0);
    }

    setQuizAnswers(prev => [...prev, { questionIdx: quizQuestionIdx, answer, timeMs }]);
    setQuizShowResult(true);

    setTimeout(() => advanceQuestion(), 1500);
  };

  const advanceQuestion = () => {
    const questions = quizBattle?.questions || [];
    if (quizQuestionIdx + 1 >= questions.length) {
      setQuizFinished(true);
      clearInterval(timerRef.current);
    } else {
      setQuizQuestionIdx(prev => prev + 1);
      setQuizSelectedAnswer(null);
      setQuizShowResult(false);
      setQuizTimeLeft(30);
      questionStartRef.current = Date.now();
      startTimer();
    }
  };

  const submitQuizAnswers = async () => {
    if (!quizBattle || quizSubmitting) return;
    setQuizSubmitting(true);
    try {
      const res = await fetch(`/api/study-hub/battle/${quizBattle.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "submit", answers: quizAnswers.filter(a => a.answer !== "X") }),
      });
      if (res.ok) {
        const data = await res.json();
        setQuizBattle(data.battle);
        fetchBattles();
      }
    } catch (err) { console.error(err); }
    setQuizSubmitting(false);
  };

  useEffect(() => {
    if (quizFinished && !quizSubmitting) submitQuizAnswers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizFinished]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const exitQuiz = () => {
    clearInterval(timerRef.current);
    setQuizBattle(null);
    setQuizFinished(false);
    fetchBattles();
  };

  // === STYLE HELPERS ===
  const card = {
    background: "var(--card-bg, #fff)", borderRadius: 14, padding: 16,
    border: "1px solid var(--border, #e5e7eb)", marginBottom: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  };
  const btn = (color) => ({
    background: color, color: "#fff", border: "none", borderRadius: 10,
    padding: "8px 16px", fontWeight: 600, cursor: "pointer", fontSize: 13,
    transition: "opacity 0.2s",
  });
  const input = {
    width: "100%", padding: "10px 12px", borderRadius: 10, fontSize: 14,
    border: "1px solid var(--border, #e5e7eb)", marginBottom: 10,
    background: "var(--input-bg, #fff)",
  };

  // === QUIZ MODE OVERLAY ===
  if (quizBattle && !quizFinished) {
    const questions = quizBattle.questions || [];
    const q = questions[quizQuestionIdx];
    const isCorrect = quizSelectedAnswer && q && quizSelectedAnswer === q.correctOption;
    const comboMultiplier = quizCombo >= 5 ? 2 : quizCombo >= 3 ? 1.5 : quizCombo >= 2 ? 1.2 : 1;

    return (
      <div style={{ direction: isRTL ? "rtl" : "ltr", position: "fixed", inset: 0, zIndex: 9999, background: "linear-gradient(135deg, #1e1b4b, #312e81)", display: "flex", flexDirection: "column", color: "#fff" }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            {t.questionNum} {quizQuestionIdx + 1} {t.of} {questions.length}
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {quizCombo >= 2 && (
              <div style={{ background: "rgba(245,158,11,0.3)", padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
                🔥 {t.combo} x{quizCombo} ({comboMultiplier}x)
              </div>
            )}
            <div style={{ fontSize: 18, fontWeight: 700 }}>🏆 {quizScore}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: "rgba(255,255,255,0.2)", margin: "0 20px" }}>
          <div style={{ height: "100%", width: `${((quizQuestionIdx + 1) / questions.length) * 100}%`, background: "#22c55e", borderRadius: 2, transition: "width 0.3s" }} />
        </div>

        {/* Timer */}
        <div style={{ textAlign: "center", margin: "20px 0 12px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 64, height: 64, borderRadius: "50%",
            border: `3px solid ${quizTimeLeft <= 5 ? "#ef4444" : quizTimeLeft <= 10 ? "#f59e0b" : "#22c55e"}`,
            fontSize: 22, fontWeight: 700,
            transition: "border-color 0.3s",
          }}>
            {quizTimeLeft}{t.seconds}
          </div>
        </div>

        {/* Question */}
        <div style={{ flex: 1, padding: "0 20px", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 600, margin: "0 auto", width: "100%" }}>
          <div style={{ fontSize: 20, fontWeight: 700, textAlign: "center", marginBottom: 28, lineHeight: 1.4 }}>
            {q?.question}
          </div>

          {/* Options */}
          <div style={{ display: "grid", gap: 12 }}>
            {["A", "B", "C", "D"].map(opt => {
              const optText = q?.[`option${opt}`];
              const isSelected = quizSelectedAnswer === opt;
              const isCorrectOpt = q?.correctOption === opt;
              let bg = "rgba(255,255,255,0.1)";
              let border = "1px solid rgba(255,255,255,0.2)";
              if (quizShowResult) {
                if (isCorrectOpt) { bg = "rgba(34,197,94,0.3)"; border = "2px solid #22c55e"; }
                else if (isSelected && !isCorrectOpt) { bg = "rgba(239,68,68,0.3)"; border = "2px solid #ef4444"; }
              } else if (isSelected) {
                bg = "rgba(99,102,241,0.3)"; border = "2px solid #6366f1";
              }

              return (
                <button
                  key={opt}
                  onClick={() => selectAnswer(opt)}
                  disabled={quizSelectedAnswer !== null}
                  style={{
                    background: bg, border, borderRadius: 14, padding: "14px 18px",
                    color: "#fff", fontSize: 15, fontWeight: 500, cursor: quizSelectedAnswer ? "default" : "pointer",
                    textAlign: isRTL ? "right" : "left", transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: 12,
                  }}
                >
                  <span style={{ background: "rgba(255,255,255,0.15)", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                    {opt}
                  </span>
                  {optText}
                </button>
              );
            })}
          </div>

          {/* Result flash */}
          {quizShowResult && (
            <div style={{ textAlign: "center", marginTop: 20, fontSize: 20, fontWeight: 700, animation: "popIn 0.3s ease-out" }}>
              {quizSelectedAnswer === "X" ? `⏰ ${t.timeLeft}!` : isCorrect ? `✅ ${t.correct}` : `❌ ${t.wrong}`}
            </div>
          )}
        </div>

        <style>{`@keyframes popIn { 0% { transform:scale(0.5); opacity:0; } 100% { transform:scale(1); opacity:1; } }`}</style>
      </div>
    );
  }

  // === QUIZ RESULTS ===
  if (quizBattle && quizFinished) {
    const isChallenger = quizBattle.challengerId === userId;
    const myScore = isChallenger ? quizBattle.challengerScore : quizBattle.opponentScore;
    const theirScore = isChallenger ? quizBattle.opponentScore : quizBattle.challengerScore;
    const opponent = isChallenger ? quizBattle.opponent : quizBattle.challenger;
    const isComplete = quizBattle.status === "completed";
    const won = isComplete && quizBattle.winnerId === userId;

    return (
      <div style={{ direction: isRTL ? "rtl" : "ltr" }}>
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>{isComplete ? (won ? "🎉" : "😢") : "⏳"}</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }} className="text-gray-800 dark:text-gray-100">
            {isComplete ? t.battleComplete : t.waiting}
          </h2>

          <div style={{ ...card, maxWidth: 400, margin: "24px auto" }} className="dark:bg-gray-800 dark:border-gray-700">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32 }}>{isChallenger ? "👤" : (quizBattle.challenger?.image ? "👤" : "👤")}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }} className="text-gray-700 dark:text-gray-300">{t.you}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#3b82f6" }}>{myScore ?? quizScore}</div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#9ca3af" }}>{t.vs}</div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32 }}>👤</div>
                <div style={{ fontSize: 13, fontWeight: 600 }} className="text-gray-700 dark:text-gray-300">{opponent?.name || "Opponent"}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#ef4444" }}>{theirScore ?? "?"}</div>
              </div>
            </div>

            {isComplete && (
              <div style={{
                textAlign: "center", padding: "10px 16px", borderRadius: 10,
                background: won ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                color: won ? "#22c55e" : "#ef4444", fontWeight: 700,
              }}>
                {won ? "🏆 " : ""}{t.winner}: {won ? t.you : opponent?.name}
              </div>
            )}
          </div>

          <button onClick={exitQuiz} style={{ ...btn("#6366f1"), padding: "12px 32px", fontSize: 15 }}>
            {t.back}
          </button>
        </div>
      </div>
    );
  }

  // === MAIN TABS UI ===
  return (
    <div style={{ direction: isRTL ? "rtl" : "ltr" }}>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "var(--card-bg, #f3f4f6)", borderRadius: 14, padding: 4, overflowX: "auto" }} className="dark:bg-gray-800">
        {TABS.map(t2 => (
          <button key={t2} onClick={() => setTab(t2)} style={{
            flex: 1, padding: "10px 12px", borderRadius: 10, fontSize: 13, fontWeight: 600,
            border: "none", cursor: "pointer", whiteSpace: "nowrap",
            background: tab === t2 ? "#6366f1" : "transparent",
            color: tab === t2 ? "#fff" : "var(--text, #6b7280)",
            transition: "all 0.2s",
          }}>
            {TAB_ICONS[t2]} {t[t2]}
          </button>
        ))}
      </div>

      {/* === LOBBY TAB === */}
      {tab === "lobby" && (
        <div>
          <button onClick={() => setShowChallengeModal(true)} style={{ ...btn("#6366f1"), width: "100%", padding: "14px", fontSize: 15, marginBottom: 20 }}>
            ⚔️ {t.createChallenge}
          </button>

          {/* Incoming challenges */}
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }} className="text-gray-800 dark:text-gray-100">
            📥 {t.incoming}
          </h3>
          {battles.pending.filter(b => b.opponentId === userId).length === 0 ? (
            <div style={{ ...card, textAlign: "center", color: "#9ca3af" }} className="dark:bg-gray-800 dark:border-gray-700">{t.noIncoming}</div>
          ) : (
            battles.pending.filter(b => b.opponentId === userId).map(b => (
              <div key={b.id} style={{ ...card, display: "flex", justifyContent: "space-between", alignItems: "center" }} className="dark:bg-gray-800 dark:border-gray-700">
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }} className="text-gray-700 dark:text-gray-300">
                    {t.challengeFrom} {b.challenger?.name || "?"}
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>📚 {b.subject}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => acceptBattle(b.id)} style={btn("#22c55e")}>{t.accept}</button>
                  <button onClick={() => declineBattle(b.id)} style={btn("#ef4444")}>{t.decline}</button>
                </div>
              </div>
            ))
          )}

          {/* Outgoing challenges */}
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, marginTop: 20 }} className="text-gray-800 dark:text-gray-100">
            📤 {t.outgoing}
          </h3>
          {battles.pending.filter(b => b.challengerId === userId).length === 0 ? (
            <div style={{ ...card, textAlign: "center", color: "#9ca3af" }} className="dark:bg-gray-800 dark:border-gray-700">{t.noOutgoing}</div>
          ) : (
            battles.pending.filter(b => b.challengerId === userId).map(b => (
              <div key={b.id} style={{ ...card, display: "flex", justifyContent: "space-between", alignItems: "center" }} className="dark:bg-gray-800 dark:border-gray-700">
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }} className="text-gray-700 dark:text-gray-300">
                    {t.challengeTo} {b.opponent?.name || "?"}
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>📚 {b.subject}</div>
                </div>
                <span style={{ fontSize: 12, color: "#f59e0b", fontWeight: 600 }}>⏳ {t.pending}</span>
              </div>
            ))
          )}

          {/* Active battles */}
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, marginTop: 20 }} className="text-gray-800 dark:text-gray-100">
            ⚔️ {t.activeBattles}
          </h3>
          {battles.active.length === 0 ? (
            <div style={{ ...card, textAlign: "center", color: "#9ca3af" }} className="dark:bg-gray-800 dark:border-gray-700">{t.noBattles}</div>
          ) : (
            battles.active.map(b => {
              const isChallenger = b.challengerId === userId;
              const opponent = isChallenger ? b.opponent : b.challenger;
              const hasSubmitted = isChallenger ? !!b.challengerAnswers : !!b.opponentAnswers;
              return (
                <div key={b.id} style={{ ...card, display: "flex", justifyContent: "space-between", alignItems: "center" }} className="dark:bg-gray-800 dark:border-gray-700">
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }} className="text-gray-700 dark:text-gray-300">
                      {t.vs} {opponent?.name || "?"}
                    </div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>📚 {b.subject}</div>
                  </div>
                  {hasSubmitted ? (
                    <span style={{ fontSize: 12, color: "#f59e0b", fontWeight: 600 }}>⏳ {t.waiting}</span>
                  ) : (
                    <button onClick={() => startQuiz(b.id)} style={btn("#6366f1")}>🎮 {t.play}</button>
                  )}
                </div>
              );
            })
          )}

          {/* Completed battles (recent) */}
          {battles.completed.length > 0 && (
            <>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, marginTop: 20 }} className="text-gray-800 dark:text-gray-100">
                ✅ {t.completed}
              </h3>
              {battles.completed.slice(0, 5).map(b => {
                const isChallenger = b.challengerId === userId;
                const opponent = isChallenger ? b.opponent : b.challenger;
                const myScore = isChallenger ? b.challengerScore : b.opponentScore;
                const theirScore = isChallenger ? b.opponentScore : b.challengerScore;
                const won = b.winnerId === userId;
                return (
                  <div key={b.id} style={{ ...card, display: "flex", justifyContent: "space-between", alignItems: "center" }} className="dark:bg-gray-800 dark:border-gray-700">
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }} className="text-gray-700 dark:text-gray-300">
                        {t.vs} {opponent?.name || "?"}
                      </div>
                      <div style={{ fontSize: 12, color: "#9ca3af" }}>
                        {myScore} - {theirScore} • 📚 {b.subject}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 8,
                      background: won ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                      color: won ? "#22c55e" : "#ef4444",
                    }}>
                      {won ? "🏆 Won" : "Lost"}
                    </span>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}

      {/* === MY QUESTIONS TAB === */}
      {tab === "myQuestions" && (
        <div>
          {/* Stats */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ ...card, flex: "1 1 140px", textAlign: "center" }} className="dark:bg-gray-800 dark:border-gray-700">
              <div style={{ fontSize: 24, fontWeight: 800, color: "#6366f1" }}>{questionsTotal}</div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>{t.totalQuestions}</div>
            </div>
            {subjectBreakdown.slice(0, 3).map(s => (
              <div key={s.subject} style={{ ...card, flex: "1 1 140px", textAlign: "center" }} className="dark:bg-gray-800 dark:border-gray-700">
                <div style={{ fontSize: 18, fontWeight: 700, color: "#3b82f6" }}>{s.count}</div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>{s.subject}</div>
              </div>
            ))}
          </div>

          {questionsTotal < 5 && (
            <div style={{ ...card, background: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.3)", textAlign: "center", color: "#92400e" }} className="dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200">
              ⚠️ {t.minQuestions}
            </div>
          )}

          <button onClick={() => setShowQuestionForm(!showQuestionForm)} style={{ ...btn("#6366f1"), width: "100%", marginBottom: 16, padding: "12px" }}>
            ➕ {t.addQuestion}
          </button>

          {/* Add Question Form */}
          {showQuestionForm && (
            <div style={{ ...card, border: "2px solid #6366f1" }} className="dark:bg-gray-800">
              <input value={questionForm.subject} onChange={e => setQuestionForm({ ...questionForm, subject: e.target.value })}
                placeholder={t.subject} style={input} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              <textarea value={questionForm.question} onChange={e => setQuestionForm({ ...questionForm, question: e.target.value })}
                placeholder={t.question} style={{ ...input, minHeight: 70, resize: "vertical" }} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              {["A", "B", "C", "D"].map(opt => (
                <input key={opt} value={questionForm[`option${opt}`]}
                  onChange={e => setQuestionForm({ ...questionForm, [`option${opt}`]: e.target.value })}
                  placeholder={t[`option${opt}`]} style={input} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              ))}
              <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <select value={questionForm.correctOption} onChange={e => setQuestionForm({ ...questionForm, correctOption: e.target.value })}
                  style={{ ...input, flex: 1, marginBottom: 0 }} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="A">A</option><option value="B">B</option>
                  <option value="C">C</option><option value="D">D</option>
                </select>
                <select value={questionForm.difficulty} onChange={e => setQuestionForm({ ...questionForm, difficulty: e.target.value })}
                  style={{ ...input, flex: 1, marginBottom: 0 }} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="easy">{t.easy}</option>
                  <option value="medium">{t.medium}</option>
                  <option value="hard">{t.hard}</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={addQuestion} disabled={loading} style={{ ...btn("#22c55e"), flex: 1 }}>{t.save}</button>
                <button onClick={() => setShowQuestionForm(false)} style={{ ...btn("#6b7280"), flex: 1 }}>{t.cancel}</button>
              </div>
            </div>
          )}

          {/* Question list */}
          {questions.map(q => (
            <div key={q.id} style={card} className="dark:bg-gray-800 dark:border-gray-700">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }} className="text-gray-800 dark:text-gray-200">{q.question}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af", display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span>📚 {q.subject}</span>
                    <span>✅ {q.correctOption}</span>
                    <span style={{
                      padding: "1px 6px", borderRadius: 4, fontSize: 11,
                      background: q.difficulty === "easy" ? "#dcfce7" : q.difficulty === "hard" ? "#fecaca" : "#fef3c7",
                      color: q.difficulty === "easy" ? "#166534" : q.difficulty === "hard" ? "#991b1b" : "#92400e",
                    }}>{t[q.difficulty]}</span>
                  </div>
                </div>
                <button onClick={() => deleteQuestion(q.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 16, padding: 4 }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === ACTIVE BATTLES TAB === */}
      {tab === "activeBattles" && (
        <div>
          {[...battles.active, ...battles.completed.slice(0, 10)].length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⚔️</div>
              <p style={{ color: "#9ca3af" }}>{t.noBattles}</p>
            </div>
          ) : (
            [...battles.active, ...battles.completed.slice(0, 10)].map(b => {
              const isChallenger = b.challengerId === userId;
              const opponent = isChallenger ? b.opponent : b.challenger;
              const myScore = isChallenger ? b.challengerScore : b.opponentScore;
              const theirScore = isChallenger ? b.opponentScore : b.challengerScore;
              const hasSubmitted = isChallenger ? !!b.challengerAnswers : !!b.opponentAnswers;
              const isComplete = b.status === "completed";
              const won = isComplete && b.winnerId === userId;
              const statusColor = isComplete ? (won ? "#22c55e" : "#ef4444") : "#f59e0b";

              return (
                <div key={b.id} style={card} className="dark:bg-gray-800 dark:border-gray-700">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        👤
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }} className="text-gray-700 dark:text-gray-300">{t.vs} {opponent?.name || "?"}</div>
                        <div style={{ fontSize: 12, color: "#9ca3af" }}>📚 {b.subject}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 8, background: `${statusColor}15`, color: statusColor }}>
                      {isComplete ? (won ? "🏆 Won" : "Lost") : hasSubmitted ? t.waiting : t.inProgress}
                    </span>
                  </div>

                  {isComplete && (
                    <div style={{ display: "flex", justifyContent: "center", gap: 24, padding: "8px 0", fontSize: 14, fontWeight: 600 }} className="text-gray-600 dark:text-gray-400">
                      <span>{t.you}: {myScore}</span>
                      <span>-</span>
                      <span>{opponent?.name}: {theirScore}</span>
                    </div>
                  )}

                  {!isComplete && !hasSubmitted && (
                    <button onClick={() => startQuiz(b.id)} style={{ ...btn("#6366f1"), width: "100%", marginTop: 8 }}>
                      🎮 {t.play}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* === RANKINGS TAB === */}
      {tab === "rankings" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[{ key: "weekly", label: t.weekly }, { key: "monthly", label: t.monthly }, { key: "all-time", label: t.allTime }].map(p => (
              <button key={p.key} onClick={() => setRankPeriod(p.key)} style={{
                flex: 1, padding: "8px 12px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                border: "none", cursor: "pointer",
                background: rankPeriod === p.key ? "#6366f1" : "var(--card-bg, #f3f4f6)",
                color: rankPeriod === p.key ? "#fff" : "var(--text, #6b7280)",
              }} className={rankPeriod !== p.key ? "dark:bg-gray-800" : ""}>
                {p.label}
              </button>
            ))}
          </div>

          {rankings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
              <p style={{ color: "#9ca3af" }}>{t.noRankings}</p>
            </div>
          ) : (
            rankings.map((r) => {
              const isMe = r.user.id === userId;
              return (
                <div key={r.rank} style={{
                  ...card,
                  border: isMe ? "2px solid #6366f1" : card.border,
                  background: isMe ? "rgba(99,102,241,0.05)" : card.background,
                }} className="dark:bg-gray-800 dark:border-gray-700">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: r.rank <= 3 ? ["#fbbf24", "#c0c0c0", "#cd7f32"][r.rank - 1] : "#e5e7eb",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, fontSize: 14, color: r.rank <= 3 ? "#fff" : "#6b7280",
                    }}>
                      {r.rank <= 3 ? ["🥇", "🥈", "🥉"][r.rank - 1] : r.rank}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }} className="text-gray-800 dark:text-gray-200">
                        {r.user.name || "Anonymous"} {isMe ? `(${t.you})` : ""}
                      </div>
                      <div style={{ fontSize: 12, color: "#9ca3af" }}>
                        {t.wins}: {r.wins} · {t.losses}: {r.losses} · {t.winRate}: {r.winRate}%
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#6366f1" }}>{r.wins}</div>
                      <div style={{ fontSize: 10, color: "#9ca3af" }}>{t.wins}</div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* === CHALLENGE MODAL === */}
      {showChallengeModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={() => setShowChallengeModal(false)}>
          <div style={{ background: "var(--card-bg, #fff)", borderRadius: 20, padding: 24, maxWidth: 420, width: "100%", maxHeight: "80vh", overflow: "auto" }}
            className="dark:bg-gray-800" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }} className="text-gray-800 dark:text-gray-100">
              ⚔️ {t.createChallenge}
            </h3>

            {/* Opponent search */}
            <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, display: "block" }} className="text-gray-700 dark:text-gray-300">
              {t.selectOpponent}
            </label>
            <input
              value={opponentSearch}
              onChange={e => searchOpponents(e.target.value)}
              placeholder={t.searchOpponent}
              style={input}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {selectedOpponent && (
              <div style={{ padding: "8px 12px", borderRadius: 10, background: "rgba(99,102,241,0.1)", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600, fontSize: 14 }} className="text-gray-700 dark:text-gray-300">
                  ✓ {selectedOpponent.name}
                </span>
                <button onClick={() => setSelectedOpponent(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}>✕</button>
              </div>
            )}
            {opponentResults.length > 0 && !selectedOpponent && (
              <div style={{ marginBottom: 12, maxHeight: 160, overflow: "auto", border: "1px solid var(--border, #e5e7eb)", borderRadius: 10 }} className="dark:border-gray-700">
                {opponentResults.map(u => (
                  <button key={u.id} onClick={() => { setSelectedOpponent(u); setOpponentResults([]); }}
                    style={{ width: "100%", padding: "10px 12px", border: "none", borderBottom: "1px solid var(--border, #e5e7eb)", background: "transparent", textAlign: isRTL ? "right" : "left", cursor: "pointer", fontSize: 14 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white dark:border-gray-700">
                    {u.name || "Anonymous"}
                  </button>
                ))}
              </div>
            )}

            {/* Subject */}
            <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, display: "block" }} className="text-gray-700 dark:text-gray-300">
              {t.selectSubject}
            </label>
            <input
              value={challengeSubject}
              onChange={e => setChallengeSubject(e.target.value)}
              placeholder={t.subject}
              style={input}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button onClick={createChallenge} disabled={!selectedOpponent || !challengeSubject || loading}
                style={{ ...btn("#6366f1"), flex: 1, opacity: (!selectedOpponent || !challengeSubject) ? 0.5 : 1 }}>
                ⚔️ {t.createChallenge}
              </button>
              <button onClick={() => setShowChallengeModal(false)} style={{ ...btn("#6b7280"), flex: 1 }}>
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
