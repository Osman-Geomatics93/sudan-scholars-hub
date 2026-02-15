"use client";
import { useState, useEffect, useCallback, useRef } from "react";

// ── Translations ──
const T = {
  en: {
    title: "IELTS/TOEFL Practice",
    subtitle: "Prepare for your English proficiency exams",
    dashboard: "Dashboard",
    practiceTests: "Practice Tests",
    vocabulary: "Vocabulary",
    progress: "Progress",
    uploadTest: "Upload Test",
    ielts: "IELTS",
    toefl: "TOEFL",
    reading: "Reading",
    writing: "Writing",
    listening: "Listening",
    speaking: "Speaking",
    allSections: "All Sections",
    startTest: "Start Test",
    continueTest: "Continue",
    viewResults: "View Results",
    submit: "Submit",
    submitting: "Submitting...",
    grading: "Grading with AI...",
    next: "Next",
    previous: "Previous",
    finish: "Finish",
    timeRemaining: "Time Remaining",
    minutes: "min",
    seconds: "sec",
    question: "Question",
    of: "of",
    passage: "Passage",
    wordCount: "Word Count",
    minWords: "Min words",
    maxWords: "Max words",
    wordsWritten: "words written",
    band: "Band",
    score: "Score",
    overallBand: "Overall Band",
    taskAchievement: "Task Achievement",
    coherence: "Coherence & Cohesion",
    lexicalResource: "Lexical Resource",
    grammar: "Grammar",
    fluency: "Fluency",
    pronunciation: "Pronunciation",
    feedback: "Feedback",
    suggestions: "Suggestions",
    development: "Development",
    organization: "Organization",
    languageUse: "Language Use",
    noTests: "No tests found",
    noAttempts: "No attempts yet. Start practicing!",
    difficulty: "Difficulty",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    time: "Time",
    attempts: "Attempts",
    official: "Official",
    community: "Community",
    recentScores: "Recent Scores",
    quickStart: "Quick Start",
    testsCompleted: "Tests Completed",
    avgScore: "Average Score",
    vocabLearned: "Vocab Learned",
    studyStreak: "Study Streak",
    days: "days",
    // Vocab
    vocabBank: "Vocabulary Bank",
    searchWords: "Search words...",
    definition: "Definition",
    example: "Example",
    arabic: "Arabic",
    flipCard: "Flip Card",
    review: "Review",
    reviewVocab: "Review Vocabulary",
    showAnswer: "Show Answer",
    iKnewIt: "I Knew It",
    almostGotIt: "Almost Got It",
    didntKnow: "Didn't Know",
    noWordsToReview: "No words due for review!",
    dueForReview: "Due for Review",
    allWords: "All Words",
    ieltsAcademic: "IELTS Academic",
    toeflAcademic: "TOEFL Academic",
    general: "General",
    // Upload
    testTitle: "Test Title",
    testDescription: "Description",
    examType: "Exam Type",
    section: "Section",
    timeLimit: "Time Limit (minutes)",
    testContent: "Test Content (JSON)",
    uploadTestBtn: "Upload Test",
    uploading: "Uploading...",
    uploadSuccess: "Test uploaded successfully!",
    uploadError: "Failed to upload test",
    // Progress
    scoreHistory: "Score History",
    sectionBreakdown: "Section Breakdown",
    bandPrediction: "Band Prediction",
    noProgressYet: "Complete some tests to see your progress!",
    // Listening
    playTranscript: "Play Transcript",
    pauseTranscript: "Pause",
    transcript: "Transcript",
    hideTranscript: "Hide Transcript",
    showTranscript: "Show Transcript",
    // Speaking
    startRecording: "Start Recording",
    stopRecording: "Stop Recording",
    recording: "Recording...",
    prepTime: "Preparation Time",
    responseTime: "Response Time",
    transcription: "Your Transcription",
    submitForGrading: "Submit for AI Grading",
    speakNow: "Speak now...",
    noSpeechSupport: "Speech recognition not supported in this browser",
    // General
    loading: "Loading...",
    error: "Something went wrong",
    retry: "Retry",
    back: "Back",
    filter: "Filter",
    results: "Results",
    completed: "Completed",
    graded: "Graded",
    inProgress: "In Progress",
    part: "Part",
    task: "Task",
    total: "Total",
    correct: "Correct",
    incorrect: "Incorrect",
    yourAnswer: "Your Answer",
    correctAnswer: "Correct Answer",
    autoSubmit: "Time's up! Auto-submitting...",
    confirmSubmit: "Are you sure you want to submit?",
    // Materials
    materials: "Materials",
    shareMaterial: "Share Material",
    materialType: "Material Type",
    allTypes: "All Types",
    all: "All",
    both: "Both",
    pdf: "PDF",
    video: "Video",
    audio: "Audio",
    document: "Document",
    link: "Link",
    folder: "Folder",
    tags: "Tags",
    tagsPlaceholder: "Comma-separated tags (e.g. cambridge, ielts-15)",
    language: "Language",
    english: "English",
    arabic: "Arabic",
    pendingReview: "Your material will be reviewed before publishing",
    materialShared: "Material submitted for review! +10 points",
    materialShareError: "Failed to share material",
    openLink: "Open Link",
    downloads: "Downloads",
    views: "Views",
    uploadedBy: "Uploaded by",
    noMaterials: "No materials found. Be the first to share!",
    advancedTestUpload: "Advanced: Create a practice test (JSON)",
    searchMaterials: "Search materials...",
    urlPlaceholder: "Paste URL (Google Drive, YouTube, direct link...)",
    urlPlaceholderVideo: "YouTube or video URL",
    urlPlaceholderAudio: "Audio file URL (MP3, etc.)",
    urlPlaceholderPdf: "Google Drive or PDF URL",
    urlPlaceholderDoc: "Document URL",
    urlPlaceholderLink: "Any web link",
    urlPlaceholderFolder: "Google Drive folder URL",
    materialTitle: "Title",
    materialDescription: "Description (optional)",
    selectExamType: "Select exam type",
    selectSection: "Select section",
    selectMaterialType: "Select material type",
    deleteMaterial: "Delete",
    confirmDelete: "Are you sure you want to delete this material?",
    materialDeleted: "Material deleted",
  },
  ar: {
    title: "تدريب IELTS/TOEFL",
    subtitle: "استعد لامتحانات إتقان اللغة الإنجليزية",
    dashboard: "لوحة التحكم",
    practiceTests: "اختبارات تدريبية",
    vocabulary: "المفردات",
    progress: "التقدم",
    uploadTest: "رفع اختبار",
    ielts: "IELTS",
    toefl: "TOEFL",
    reading: "القراءة",
    writing: "الكتابة",
    listening: "الاستماع",
    speaking: "المحادثة",
    allSections: "جميع الأقسام",
    startTest: "ابدأ الاختبار",
    continueTest: "متابعة",
    viewResults: "عرض النتائج",
    submit: "إرسال",
    submitting: "جاري الإرسال...",
    grading: "جاري التقييم بالذكاء الاصطناعي...",
    next: "التالي",
    previous: "السابق",
    finish: "إنهاء",
    timeRemaining: "الوقت المتبقي",
    minutes: "دقيقة",
    seconds: "ثانية",
    question: "سؤال",
    of: "من",
    passage: "النص",
    wordCount: "عدد الكلمات",
    minWords: "الحد الأدنى",
    maxWords: "الحد الأقصى",
    wordsWritten: "كلمة مكتوبة",
    band: "الفئة",
    score: "الدرجة",
    overallBand: "الفئة الإجمالية",
    taskAchievement: "تحقيق المهمة",
    coherence: "الترابط والتماسك",
    lexicalResource: "الثروة اللغوية",
    grammar: "القواعد",
    fluency: "الطلاقة",
    pronunciation: "النطق",
    feedback: "التعليقات",
    suggestions: "اقتراحات",
    development: "التطوير",
    organization: "التنظيم",
    languageUse: "استخدام اللغة",
    noTests: "لا توجد اختبارات",
    noAttempts: "لا توجد محاولات بعد. ابدأ التدريب!",
    difficulty: "الصعوبة",
    easy: "سهل",
    medium: "متوسط",
    hard: "صعب",
    time: "الوقت",
    attempts: "المحاولات",
    official: "رسمي",
    community: "مجتمعي",
    recentScores: "الدرجات الأخيرة",
    quickStart: "بداية سريعة",
    testsCompleted: "اختبارات مكتملة",
    avgScore: "متوسط الدرجات",
    vocabLearned: "مفردات تم تعلمها",
    studyStreak: "سلسلة الدراسة",
    days: "أيام",
    vocabBank: "بنك المفردات",
    searchWords: "ابحث عن كلمات...",
    definition: "التعريف",
    example: "مثال",
    arabic: "عربي",
    flipCard: "اقلب البطاقة",
    review: "مراجعة",
    reviewVocab: "مراجعة المفردات",
    showAnswer: "إظهار الإجابة",
    iKnewIt: "كنت أعرفها",
    almostGotIt: "كدت أعرفها",
    didntKnow: "لم أكن أعرفها",
    noWordsToReview: "لا توجد كلمات للمراجعة!",
    dueForReview: "مستحقة للمراجعة",
    allWords: "جميع الكلمات",
    ieltsAcademic: "IELTS أكاديمي",
    toeflAcademic: "TOEFL أكاديمي",
    general: "عام",
    testTitle: "عنوان الاختبار",
    testDescription: "الوصف",
    examType: "نوع الامتحان",
    section: "القسم",
    timeLimit: "الوقت المحدد (دقائق)",
    testContent: "محتوى الاختبار (JSON)",
    uploadTestBtn: "رفع الاختبار",
    uploading: "جاري الرفع...",
    uploadSuccess: "تم رفع الاختبار بنجاح!",
    uploadError: "فشل رفع الاختبار",
    scoreHistory: "سجل الدرجات",
    sectionBreakdown: "تفصيل الأقسام",
    bandPrediction: "توقع الفئة",
    noProgressYet: "أكمل بعض الاختبارات لمشاهدة تقدمك!",
    playTranscript: "تشغيل النص",
    pauseTranscript: "إيقاف",
    transcript: "النص المكتوب",
    hideTranscript: "إخفاء النص",
    showTranscript: "إظهار النص",
    startRecording: "بدء التسجيل",
    stopRecording: "إيقاف التسجيل",
    recording: "جاري التسجيل...",
    prepTime: "وقت التحضير",
    responseTime: "وقت الإجابة",
    transcription: "النص المنطوق",
    submitForGrading: "إرسال للتقييم بالذكاء الاصطناعي",
    speakNow: "تحدث الآن...",
    noSpeechSupport: "التعرف على الكلام غير مدعوم في هذا المتصفح",
    loading: "جاري التحميل...",
    error: "حدث خطأ",
    retry: "إعادة المحاولة",
    back: "رجوع",
    filter: "تصفية",
    results: "النتائج",
    completed: "مكتمل",
    graded: "تم التقييم",
    inProgress: "قيد التنفيذ",
    part: "الجزء",
    task: "المهمة",
    total: "المجموع",
    correct: "صحيح",
    incorrect: "خاطئ",
    yourAnswer: "إجابتك",
    correctAnswer: "الإجابة الصحيحة",
    autoSubmit: "انتهى الوقت! جاري الإرسال تلقائياً...",
    confirmSubmit: "هل أنت متأكد من إرسال الإجابات؟",
    // Materials
    materials: "المواد",
    shareMaterial: "مشاركة مادة",
    materialType: "نوع المادة",
    allTypes: "جميع الأنواع",
    all: "الكل",
    both: "كلاهما",
    pdf: "PDF",
    video: "فيديو",
    audio: "صوت",
    document: "مستند",
    link: "رابط",
    folder: "مجلد",
    tags: "الوسوم",
    tagsPlaceholder: "وسوم مفصولة بفواصل (مثل: cambridge, ielts-15)",
    language: "اللغة",
    english: "الإنجليزية",
    arabic: "العربية",
    pendingReview: "سيتم مراجعة المادة قبل النشر",
    materialShared: "تم إرسال المادة للمراجعة! +10 نقاط",
    materialShareError: "فشل مشاركة المادة",
    openLink: "فتح الرابط",
    downloads: "التحميلات",
    views: "المشاهدات",
    uploadedBy: "رُفع بواسطة",
    noMaterials: "لا توجد مواد. كن أول من يشارك!",
    advancedTestUpload: "متقدم: إنشاء اختبار تدريبي (JSON)",
    searchMaterials: "البحث في المواد...",
    urlPlaceholder: "الصق الرابط (Google Drive، يوتيوب، رابط مباشر...)",
    urlPlaceholderVideo: "رابط يوتيوب أو فيديو",
    urlPlaceholderAudio: "رابط ملف صوتي (MP3، إلخ)",
    urlPlaceholderPdf: "رابط Google Drive أو PDF",
    urlPlaceholderDoc: "رابط مستند",
    urlPlaceholderLink: "أي رابط ويب",
    urlPlaceholderFolder: "رابط مجلد Google Drive",
    materialTitle: "العنوان",
    materialDescription: "الوصف (اختياري)",
    selectExamType: "اختر نوع الامتحان",
    selectSection: "اختر القسم",
    selectMaterialType: "اختر نوع المادة",
    deleteMaterial: "حذف",
    confirmDelete: "هل أنت متأكد من حذف هذه المادة؟",
    materialDeleted: "تم حذف المادة",
  },
};

// ── Styles ──
const S = {
  container: { maxWidth: 1100, margin: "0 auto", padding: "0 16px" },
  header: { textAlign: "center", marginBottom: 24 },
  title: { fontSize: 26, fontWeight: 800, margin: 0, background: "linear-gradient(135deg, #2563EB, #7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  subtitle: { fontSize: 14, color: "#888", marginTop: 4 },
  tabs: { display: "flex", gap: 6, overflowX: "auto", padding: "4px 0", marginBottom: 16, borderBottom: "2px solid #E5E7EB" },
  tab: (active) => ({
    padding: "8px 16px", fontSize: 13, fontWeight: active ? 700 : 500, border: "none", borderBottom: active ? "3px solid #2563EB" : "3px solid transparent",
    background: "none", cursor: "pointer", color: active ? "#2563EB" : "#666", transition: "all 0.2s", whiteSpace: "nowrap",
  }),
  examToggle: { display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 },
  examBtn: (active) => ({
    padding: "8px 24px", fontSize: 14, fontWeight: 700, border: "2px solid", borderColor: active ? "#2563EB" : "#D1D5DB",
    borderRadius: 24, background: active ? "#2563EB" : "transparent", color: active ? "#fff" : "#666", cursor: "pointer", transition: "all 0.2s",
  }),
  sectionTabs: { display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 20 },
  sectionTab: (active) => ({
    padding: "6px 14px", fontSize: 12, fontWeight: active ? 700 : 500, border: "1px solid", borderColor: active ? "#7C3AED" : "#E5E7EB",
    borderRadius: 16, background: active ? "#7C3AED" : "transparent", color: active ? "#fff" : "#666", cursor: "pointer", transition: "all 0.2s",
  }),
  card: { background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: 20, marginBottom: 16, border: "1px solid #F3F4F6" },
  cardTitle: { fontSize: 16, fontWeight: 700, margin: "0 0 8px 0" },
  badge: (color) => ({
    display: "inline-block", padding: "2px 10px", fontSize: 11, fontWeight: 700, borderRadius: 12,
    background: color === "blue" ? "#EFF6FF" : color === "green" ? "#F0FDF4" : color === "purple" ? "#F5F3FF" : color === "red" ? "#FEF2F2" : "#F9FAFB",
    color: color === "blue" ? "#2563EB" : color === "green" ? "#16A34A" : color === "purple" ? "#7C3AED" : color === "red" ? "#DC2626" : "#666",
  }),
  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 },
  grid4: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 },
  statCard: { background: "linear-gradient(135deg, #EFF6FF, #F5F3FF)", borderRadius: 14, padding: 16, textAlign: "center", border: "1px solid #E0E7FF" },
  statNum: { fontSize: 28, fontWeight: 800, color: "#2563EB", margin: 0 },
  statLabel: { fontSize: 12, color: "#666", marginTop: 4 },
  btn: (variant) => ({
    padding: "10px 20px", fontSize: 14, fontWeight: 700, border: "none", borderRadius: 12, cursor: "pointer", transition: "all 0.2s",
    background: variant === "primary" ? "linear-gradient(135deg, #2563EB, #7C3AED)" : variant === "success" ? "#16A34A" : variant === "danger" ? "#DC2626" : "#F3F4F6",
    color: variant === "primary" || variant === "success" || variant === "danger" ? "#fff" : "#333",
  }),
  btnSm: (variant) => ({
    padding: "6px 14px", fontSize: 12, fontWeight: 600, border: "none", borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
    background: variant === "primary" ? "#2563EB" : variant === "success" ? "#16A34A" : variant === "ghost" ? "transparent" : "#F3F4F6",
    color: variant === "primary" || variant === "success" ? "#fff" : "#666",
  }),
  input: { width: "100%", padding: "10px 14px", fontSize: 14, border: "1px solid #D1D5DB", borderRadius: 10, outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "10px 14px", fontSize: 14, border: "1px solid #D1D5DB", borderRadius: 10, outline: "none", boxSizing: "border-box", minHeight: 120, resize: "vertical", fontFamily: "inherit" },
  select: { padding: "10px 14px", fontSize: 14, border: "1px solid #D1D5DB", borderRadius: 10, outline: "none", background: "#fff", cursor: "pointer" },
  label: { fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4, display: "block" },
  timer: { display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "#FEF2F2", borderRadius: 12, fontSize: 16, fontWeight: 700, color: "#DC2626" },
  timerSafe: { display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "#F0FDF4", borderRadius: 12, fontSize: 16, fontWeight: 700, color: "#16A34A" },
  progressBar: (pct) => ({ height: 6, borderRadius: 3, background: "#E5E7EB", overflow: "hidden", position: "relative" }),
  progressFill: (pct, color) => ({ height: "100%", width: `${Math.min(pct, 100)}%`, background: color || "#2563EB", borderRadius: 3, transition: "width 0.3s" }),
  scoreDisplay: { textAlign: "center", padding: 24, background: "linear-gradient(135deg, #EFF6FF, #F5F3FF)", borderRadius: 16, marginBottom: 16 },
  scoreBig: { fontSize: 56, fontWeight: 900, background: "linear-gradient(135deg, #2563EB, #7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 },
  vocabCard: { background: "#fff", borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", padding: 32, textAlign: "center", minHeight: 200, display: "flex", flexDirection: "column", justifyContent: "center", cursor: "pointer", transition: "transform 0.3s", border: "2px solid #E0E7FF" },
  vocabWord: { fontSize: 28, fontWeight: 800, color: "#2563EB", marginBottom: 8 },
  vocabDef: { fontSize: 16, color: "#374151", marginBottom: 12 },
  vocabExample: { fontSize: 14, color: "#666", fontStyle: "italic" },
  vocabArabic: { fontSize: 18, color: "#7C3AED", fontWeight: 600, marginTop: 8 },
  flexCenter: { display: "flex", alignItems: "center", justifyContent: "center", gap: 12 },
  flexBetween: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
  passageText: { fontSize: 15, lineHeight: 1.8, color: "#1F2937", whiteSpace: "pre-wrap", background: "#FAFAFA", padding: 20, borderRadius: 12, border: "1px solid #E5E7EB", maxHeight: 400, overflowY: "auto" },
  optionBtn: (selected, isCorrect, showResult) => ({
    display: "block", width: "100%", padding: "12px 16px", fontSize: 14, textAlign: "left", border: "2px solid",
    borderColor: showResult ? (isCorrect ? "#16A34A" : selected ? "#DC2626" : "#E5E7EB") : selected ? "#2563EB" : "#E5E7EB",
    borderRadius: 12, background: showResult ? (isCorrect ? "#F0FDF4" : selected ? "#FEF2F2" : "#fff") : selected ? "#EFF6FF" : "#fff",
    cursor: showResult ? "default" : "pointer", marginBottom: 8, fontWeight: selected ? 600 : 400, transition: "all 0.2s",
  }),
  criteriaRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #F3F4F6" },
  criteriaLabel: { fontSize: 14, color: "#374151" },
  criteriaScore: { fontSize: 16, fontWeight: 700, color: "#2563EB" },
  empty: { textAlign: "center", padding: 40, color: "#999", fontSize: 15 },
};

export default function IeltsToeflPractice({ locale = "en", userId }) {
  const t = T[locale] || T.en;
  const isRTL = locale === "ar";

  // ── State ──
  const [view, setView] = useState("dashboard"); // dashboard | tests | test-taking | results | vocab | vocab-review | progress | materials | share
  const [examType, setExamType] = useState("ielts");
  const [sectionFilter, setSectionFilter] = useState("");
  const [tests, setTests] = useState([]);
  const [testsTotal, setTestsTotal] = useState(0);
  const [testsLoading, setTestsLoading] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [currentAttempt, setCurrentAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [currentPassage, setCurrentPassage] = useState(0);
  const [currentTask, setCurrentTask] = useState(0);
  const [currentPart, setCurrentPart] = useState(0);
  const [writingText, setWritingText] = useState("");
  const [speakingText, setSpeakingText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [gradeResult, setGradeResult] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [attemptsLoading, setAttemptsLoading] = useState(false);
  const [vocab, setVocab] = useState([]);
  const [vocabTotal, setVocabTotal] = useState(0);
  const [vocabLoading, setVocabLoading] = useState(false);
  const [vocabSearch, setVocabSearch] = useState("");
  const [vocabCategory, setVocabCategory] = useState("");
  const [vocabFlipped, setVocabFlipped] = useState({});
  const [reviewCards, setReviewCards] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewFlipped, setReviewFlipped] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [uploadForm, setUploadForm] = useState({ examType: "ielts", section: "reading", title: "", description: "", difficulty: "medium", timeMinutes: 60, content: "" });
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Materials state
  const [materials, setMaterials] = useState([]);
  const [materialsTotal, setMaterialsTotal] = useState(0);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [materialsPage, setMaterialsPage] = useState(1);
  const [matExamFilter, setMatExamFilter] = useState("all");
  const [matSectionFilter, setMatSectionFilter] = useState("");
  const [matTypeFilter, setMatTypeFilter] = useState("");
  const [matSearch, setMatSearch] = useState("");
  const [matPreview, setMatPreview] = useState(null);
  const [shareForm, setShareForm] = useState({ examType: "", section: "", materialType: "", title: "", description: "", url: "", difficulty: "medium", language: "en", tags: "" });
  const [shareLoading, setShareLoading] = useState(false);
  const [shareMsg, setShareMsg] = useState("");
  const [showJsonUpload, setShowJsonUpload] = useState(false);

  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const ttsRef = useRef(null);

  // ── Timer ──
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timerRef.current);
    }
    if (timerActive && timeLeft === 0 && currentTest) {
      handleSubmitTest();
    }
  }, [timerActive, timeLeft]);

  // ── Fetch tests ──
  const fetchTests = useCallback(async () => {
    setTestsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("examType", examType);
      if (sectionFilter) params.set("section", sectionFilter);
      params.set("limit", "50");
      const res = await fetch(`/api/study-hub/ielts-toefl/tests?${params}`);
      const data = await res.json();
      setTests(data.tests || []);
      setTestsTotal(data.total || 0);
    } catch { setTests([]); }
    setTestsLoading(false);
  }, [examType, sectionFilter]);

  useEffect(() => { if (view === "tests" || view === "dashboard") fetchTests(); }, [fetchTests, view]);

  // ── Fetch attempts ──
  const fetchAttempts = useCallback(async () => {
    if (!userId) return;
    setAttemptsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("examType", examType);
      params.set("limit", "20");
      const res = await fetch(`/api/study-hub/ielts-toefl/attempts?${params}`);
      const data = await res.json();
      setAttempts(data.attempts || []);
    } catch { setAttempts([]); }
    setAttemptsLoading(false);
  }, [examType, userId]);

  useEffect(() => { if (view === "dashboard" || view === "progress") fetchAttempts(); }, [fetchAttempts, view]);

  // ── Fetch vocab ──
  const fetchVocab = useCallback(async () => {
    setVocabLoading(true);
    try {
      const params = new URLSearchParams();
      if (vocabCategory) params.set("category", vocabCategory);
      if (vocabSearch) params.set("search", vocabSearch);
      params.set("limit", "200");
      const res = await fetch(`/api/study-hub/ielts-toefl/vocab?${params}`);
      const data = await res.json();
      setVocab(data.vocab || []);
      setVocabTotal(data.total || 0);
    } catch { setVocab([]); }
    setVocabLoading(false);
  }, [vocabCategory, vocabSearch]);

  useEffect(() => { if (view === "vocab" || view === "vocab-review") fetchVocab(); }, [fetchVocab, view]);

  // ── Start a test ──
  const startTest = async (test) => {
    try {
      const res = await fetch(`/api/study-hub/ielts-toefl/tests/${test.id}`);
      const data = await res.json();
      setCurrentTest(data.test);
      setAnswers({});
      setCurrentQ(0);
      setCurrentPassage(0);
      setCurrentTask(0);
      setCurrentPart(0);
      setWritingText("");
      setSpeakingText("");
      setGradeResult(null);
      setShowResults(false);
      setTimeLeft(data.test.timeMinutes * 60);
      setTimerActive(true);
      setView("test-taking");
    } catch {
      console.error("Failed to start test");
    }
  };

  // ── Submit test ──
  const handleSubmitTest = async () => {
    if (submitting) return;
    setTimerActive(false);
    setSubmitting(true);

    try {
      const section = currentTest.section;
      let submitAnswers = answers;

      if (section === "writing") {
        submitAnswers = { text: writingText, taskIndex: currentTask };
      } else if (section === "speaking") {
        submitAnswers = { transcription: speakingText, partIndex: currentPart };
      }

      const res = await fetch("/api/study-hub/ielts-toefl/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId: currentTest.id,
          answers: submitAnswers,
          timeSpentSec: currentTest.timeMinutes * 60 - timeLeft,
        }),
      });
      const data = await res.json();
      setCurrentAttempt(data.attempt);

      // For writing/speaking, trigger AI grading
      if (section === "writing" || section === "speaking") {
        const gradePayload = section === "writing"
          ? { type: "writing", testId: currentTest.id, attemptId: data.attempt.id, taskResponse: writingText }
          : { type: "speaking", testId: currentTest.id, attemptId: data.attempt.id, transcription: speakingText };

        const gradeRes = await fetch("/api/study-hub/ielts-toefl/grade", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(gradePayload),
        });
        const gradeData = await gradeRes.json();
        setGradeResult(gradeData.grading);
        setCurrentAttempt((prev) => ({ ...prev, score: gradeData.score, aiGrading: gradeData.grading, status: "graded" }));
      }

      setShowResults(true);
      setView("results");
    } catch (err) {
      console.error("Submit error:", err);
    }
    setSubmitting(false);
  };

  // ── Speech Recognition ──
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setSpeakingText(transcript);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // ── Browser TTS for listening ──
  const playTTS = (text) => {
    if (ttsPlaying) {
      window.speechSynthesis.cancel();
      setTtsPlaying(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.onend = () => setTtsPlaying(false);
    ttsRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setTtsPlaying(true);
  };

  // ── Review vocab (SM-2) ──
  const handleVocabReview = async (quality) => {
    const card = reviewCards[reviewIndex];
    if (!card) return;
    try {
      await fetch("/api/study-hub/ielts-toefl/vocab/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vocabId: card.id, quality }),
      });
    } catch {}
    setReviewFlipped(false);
    if (reviewIndex < reviewCards.length - 1) {
      setReviewIndex((i) => i + 1);
    } else {
      setView("vocab");
    }
  };

  // ── Upload test ──
  const handleUpload = async () => {
    setUploadLoading(true);
    setUploadMsg("");
    try {
      let content;
      try { content = JSON.parse(uploadForm.content); } catch {
        setUploadMsg(t.uploadError + " — Invalid JSON");
        setUploadLoading(false);
        return;
      }
      const res = await fetch("/api/study-hub/ielts-toefl/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...uploadForm, timeMinutes: Number(uploadForm.timeMinutes), content }),
      });
      if (res.ok) {
        setUploadMsg(t.uploadSuccess);
        setUploadForm({ examType: "ielts", section: "reading", title: "", description: "", difficulty: "medium", timeMinutes: 60, content: "" });
      } else {
        const data = await res.json();
        setUploadMsg(data.error || t.uploadError);
      }
    } catch { setUploadMsg(t.uploadError); }
    setUploadLoading(false);
  };

  // ── Fetch materials ──
  const fetchMaterials = useCallback(async () => {
    setMaterialsLoading(true);
    try {
      const params = new URLSearchParams();
      if (matExamFilter && matExamFilter !== "all") params.set("examType", matExamFilter);
      if (matSectionFilter) params.set("section", matSectionFilter);
      if (matTypeFilter) params.set("materialType", matTypeFilter);
      if (matSearch) params.set("search", matSearch);
      params.set("page", String(materialsPage));
      params.set("limit", "20");
      const res = await fetch(`/api/study-hub/ielts-toefl/materials?${params}`);
      const data = await res.json();
      setMaterials(data.materials || []);
      setMaterialsTotal(data.total || 0);
    } catch { setMaterials([]); }
    setMaterialsLoading(false);
  }, [matExamFilter, matSectionFilter, matTypeFilter, matSearch, materialsPage]);

  useEffect(() => { if (view === "materials") fetchMaterials(); }, [fetchMaterials, view]);

  // ── Share material ──
  const handleShareMaterial = async () => {
    setShareLoading(true);
    setShareMsg("");
    try {
      const tagsArr = shareForm.tags ? shareForm.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
      const res = await fetch("/api/study-hub/ielts-toefl/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examType: shareForm.examType,
          section: shareForm.section,
          materialType: shareForm.materialType,
          title: shareForm.title,
          description: shareForm.description || null,
          url: shareForm.url,
          difficulty: shareForm.difficulty,
          language: shareForm.language,
          tags: tagsArr,
        }),
      });
      if (res.ok) {
        setShareMsg(t.materialShared);
        setShareForm({ examType: "", section: "", materialType: "", title: "", description: "", url: "", difficulty: "medium", language: "en", tags: "" });
      } else {
        const data = await res.json();
        setShareMsg(data.error || t.materialShareError);
      }
    } catch { setShareMsg(t.materialShareError); }
    setShareLoading(false);
  };

  // ── Delete material ──
  const handleDeleteMaterial = async (id) => {
    if (!confirm(t.confirmDelete)) return;
    try {
      const res = await fetch(`/api/study-hub/ielts-toefl/materials/${id}`, { method: "DELETE" });
      if (res.ok) fetchMaterials();
    } catch {}
  };

  // ── Track material action ──
  const trackMaterial = async (id, action) => {
    try {
      await fetch(`/api/study-hub/ielts-toefl/materials/${id}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
    } catch {}
  };

  // ── Preview URL helpers ──
  const getYouTubeId = (url) => {
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?#]+)/);
    return m ? m[1] : null;
  };
  const getGDriveId = (url) => {
    const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return m ? m[1] : null;
  };
  const getPreviewUrl = (url, type) => {
    const ytId = getYouTubeId(url);
    if (ytId) return { type: "youtube", embedUrl: `https://www.youtube.com/embed/${ytId}` };
    const gdId = getGDriveId(url);
    if (gdId) return { type: "gdrive", embedUrl: `https://drive.google.com/file/d/${gdId}/preview` };
    if (type === "audio") return { type: "audio", embedUrl: url };
    return { type: "link", embedUrl: url };
  };

  // ── Material type config ──
  const MATERIAL_TYPES = [
    { id: "pdf", label: t.pdf, icon: "\uD83D\uDCC4", color: "#E74C3C" },
    { id: "video", label: t.video, icon: "\uD83C\uDFAC", color: "#8E44AD" },
    { id: "audio", label: t.audio, icon: "\uD83C\uDFA7", color: "#2E86C1" },
    { id: "document", label: t.document, icon: "\uD83D\uDCDD", color: "#E67E22" },
    { id: "link", label: t.link, icon: "\uD83D\uDD17", color: "#27AE60" },
    { id: "folder", label: t.folder, icon: "\uD83D\uDCC1", color: "#16A34A" },
  ];

  const getMaterialIcon = (type) => {
    const found = MATERIAL_TYPES.find((mt) => mt.id === type);
    return found ? found.icon : "\uD83D\uDCC4";
  };

  const getMaterialColor = (type) => {
    const found = MATERIAL_TYPES.find((mt) => mt.id === type);
    return found ? found.color : "#666";
  };

  const getUrlPlaceholder = (type) => {
    const map = { video: t.urlPlaceholderVideo, audio: t.urlPlaceholderAudio, pdf: t.urlPlaceholderPdf, document: t.urlPlaceholderDoc, link: t.urlPlaceholderLink, folder: t.urlPlaceholderFolder };
    return map[type] || t.urlPlaceholder;
  };

  // ── Helpers ──
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const getAllQuestions = () => {
    if (!currentTest?.content) return [];
    const c = currentTest.content;
    if (c.passages) return c.passages.flatMap((p) => p.questions);
    if (c.questions) return c.questions;
    return [];
  };

  const getWordCount = (text) => text.trim().split(/\s+/).filter(Boolean).length;

  const diffColor = (d) => d === "easy" ? "green" : d === "hard" ? "red" : "blue";

  // ── Stats ──
  const completedAttempts = attempts.filter((a) => a.status === "graded" || a.status === "completed");
  const avgScore = completedAttempts.length > 0
    ? (completedAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / completedAttempts.length).toFixed(1)
    : "—";
  const vocabReviewed = vocab.filter((v) => v.progress && v.progress.length > 0 && v.progress[0].repetitions > 0).length;

  // ==========================
  //  RENDER
  // ==========================

  const renderTimer = () => {
    if (!timerActive) return null;
    const isLow = timeLeft < 120;
    return (
      <div style={isLow ? S.timer : S.timerSafe}>
        <span>{isLow ? "⏰" : "🕐"}</span>
        <span>{t.timeRemaining}: {formatTime(timeLeft)}</span>
      </div>
    );
  };

  // ── Dashboard ──
  const renderDashboard = () => (
    <div>
      {/* Stats */}
      <div style={S.grid4}>
        <div style={S.statCard}>
          <div style={S.statNum}>{completedAttempts.length}</div>
          <div style={S.statLabel}>{t.testsCompleted}</div>
        </div>
        <div style={S.statCard}>
          <div style={S.statNum}>{avgScore}</div>
          <div style={S.statLabel}>{t.avgScore}</div>
        </div>
        <div style={S.statCard}>
          <div style={S.statNum}>{vocabReviewed}</div>
          <div style={S.statLabel}>{t.vocabLearned}</div>
        </div>
        <div style={S.statCard}>
          <div style={S.statNum}>{attempts.length > 0 ? "1+" : "0"}</div>
          <div style={S.statLabel}>{t.studyStreak} ({t.days})</div>
        </div>
      </div>

      {/* Quick Start */}
      <div style={{ ...S.card, marginTop: 20 }}>
        <h3 style={S.cardTitle}>{t.quickStart}</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
          {["reading", "writing", "listening", "speaking"].map((sec) => (
            <button key={sec} style={S.btn("primary")} onClick={() => { setSectionFilter(sec); setView("tests"); }}>
              {sec === "reading" ? "📖" : sec === "writing" ? "✍️" : sec === "listening" ? "🎧" : "🎤"}{" "}
              {t[sec]}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Scores */}
      <div style={{ ...S.card, marginTop: 16 }}>
        <h3 style={S.cardTitle}>{t.recentScores}</h3>
        {completedAttempts.length === 0 ? (
          <p style={S.empty}>{t.noAttempts}</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            {completedAttempts.slice(0, 5).map((a) => (
              <div key={a.id} style={{ ...S.flexBetween, padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{a.test?.title || "Test"}</span>
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <span style={S.badge("blue")}>{a.examType?.toUpperCase()}</span>
                    <span style={S.badge("purple")}>{t[a.section] || a.section}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#2563EB" }}>{a.score ?? "—"}</div>
                  <div style={{ fontSize: 11, color: "#999" }}>{new Date(a.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ── Test List ──
  const renderTestList = () => (
    <div>
      <div style={S.sectionTabs}>
        <button style={S.sectionTab(!sectionFilter)} onClick={() => setSectionFilter("")}>{t.allSections}</button>
        {["reading", "writing", "listening", "speaking"].map((sec) => (
          <button key={sec} style={S.sectionTab(sectionFilter === sec)} onClick={() => setSectionFilter(sec)}>
            {sec === "reading" ? "📖" : sec === "writing" ? "✍️" : sec === "listening" ? "🎧" : "🎤"} {t[sec]}
          </button>
        ))}
      </div>

      {testsLoading ? (
        <p style={S.empty}>{t.loading}</p>
      ) : tests.length === 0 ? (
        <p style={S.empty}>{t.noTests}</p>
      ) : (
        <div style={S.grid2}>
          {tests.map((test) => (
            <div key={test.id} style={S.card}>
              <div style={S.flexBetween}>
                <span style={S.badge(test.examType === "ielts" ? "blue" : "purple")}>{test.examType?.toUpperCase()}</span>
                <span style={S.badge(diffColor(test.difficulty))}>{t[test.difficulty] || test.difficulty}</span>
              </div>
              <h4 style={{ ...S.cardTitle, marginTop: 10 }}>{test.title}</h4>
              {test.description && <p style={{ fontSize: 13, color: "#666", margin: "4px 0 12px" }}>{test.description}</p>}
              <div style={{ ...S.flexBetween, marginTop: 8 }}>
                <span style={{ fontSize: 12, color: "#888" }}>
                  {test.section === "reading" ? "📖" : test.section === "writing" ? "✍️" : test.section === "listening" ? "🎧" : "🎤"}{" "}
                  {t[test.section]} • {test.timeMinutes} {t.minutes}
                </span>
                <button style={S.btnSm("primary")} onClick={() => startTest(test)}>
                  {t.startTest}
                </button>
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                {test.isOfficial && <span style={S.badge("green")}>{t.official}</span>}
                <span style={{ fontSize: 11, color: "#999" }}>{test.usageCount} {t.attempts}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── Reading Test ──
  const renderReadingTest = () => {
    const content = currentTest.content;
    const passages = content.passages || [];
    const passage = passages[currentPassage];
    if (!passage) return <p style={S.empty}>{t.error}</p>;

    const questions = passage.questions || [];
    const q = questions[currentQ];
    const qGlobalIndex = passages.slice(0, currentPassage).reduce((sum, p) => sum + p.questions.length, 0) + currentQ;
    const totalQ = passages.reduce((sum, p) => sum + p.questions.length, 0);

    return (
      <div>
        {renderTimer()}
        <div style={{ ...S.flexBetween, margin: "12px 0" }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{t.passage} {currentPassage + 1} {t.of} {passages.length}</span>
          <span style={{ fontSize: 13, color: "#888" }}>{t.question} {qGlobalIndex + 1} {t.of} {totalQ}</span>
        </div>

        {/* Passage text */}
        <div style={S.passageText}>{passage.text}</div>

        {/* Question */}
        {q && (
          <div style={{ ...S.card, marginTop: 16 }}>
            <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>
              {qGlobalIndex + 1}. {q.question}
            </p>
            {(q.options || []).map((opt, i) => {
              const letter = String.fromCharCode(65 + i);
              const selected = answers[String(qGlobalIndex)] === letter;
              return (
                <button
                  key={i}
                  style={S.optionBtn(selected, false, false)}
                  onClick={() => setAnswers((prev) => ({ ...prev, [String(qGlobalIndex)]: letter }))}
                >
                  <strong>{letter}.</strong> {opt}
                </button>
              );
            })}

            <div style={{ ...S.flexBetween, marginTop: 16 }}>
              <button
                style={S.btnSm("ghost")}
                disabled={qGlobalIndex === 0}
                onClick={() => {
                  if (currentQ > 0) setCurrentQ((q) => q - 1);
                  else if (currentPassage > 0) {
                    setCurrentPassage((p) => p - 1);
                    setCurrentQ(passages[currentPassage - 1].questions.length - 1);
                  }
                }}
              >
                {t.previous}
              </button>
              {qGlobalIndex < totalQ - 1 ? (
                <button
                  style={S.btnSm("primary")}
                  onClick={() => {
                    if (currentQ < questions.length - 1) setCurrentQ((q) => q + 1);
                    else if (currentPassage < passages.length - 1) {
                      setCurrentPassage((p) => p + 1);
                      setCurrentQ(0);
                    }
                  }}
                >
                  {t.next}
                </button>
              ) : (
                <button style={S.btn("success")} onClick={handleSubmitTest} disabled={submitting}>
                  {submitting ? t.submitting : t.submit}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div style={{ ...S.progressBar(0), marginTop: 12 }}>
          <div style={S.progressFill(((qGlobalIndex + 1) / totalQ) * 100)} />
        </div>
      </div>
    );
  };

  // ── Writing Test ──
  const renderWritingTest = () => {
    const content = currentTest.content;
    const tasks = content.tasks || [];
    const task = tasks[currentTask];
    if (!task) return <p style={S.empty}>{t.error}</p>;

    const wc = getWordCount(writingText);

    return (
      <div>
        {renderTimer()}
        <div style={{ ...S.flexBetween, margin: "12px 0" }}>
          <span style={{ fontWeight: 600 }}>{t.task} {currentTask + 1} {t.of} {tasks.length}</span>
          <span style={S.badge("blue")}>{task.type}</span>
        </div>

        <div style={S.card}>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#1F2937" }}>{task.prompt}</p>
        </div>

        <div style={{ marginTop: 12 }}>
          <textarea
            style={S.textarea}
            rows={14}
            value={writingText}
            onChange={(e) => setWritingText(e.target.value)}
            placeholder={`${t.minWords}: ${task.minWords} | ${t.maxWords}: ${task.maxWords}`}
            dir={isRTL ? "rtl" : "ltr"}
          />
          <div style={{ ...S.flexBetween, marginTop: 8 }}>
            <span style={{ fontSize: 13, color: wc < (task.minWords || 0) ? "#DC2626" : wc > (task.maxWords || 999) ? "#F59E0B" : "#16A34A", fontWeight: 600 }}>
              {wc} {t.wordsWritten} ({t.minWords}: {task.minWords})
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              {currentTask < tasks.length - 1 ? (
                <button style={S.btn("primary")} onClick={() => { setCurrentTask((t) => t + 1); setWritingText(""); }}>
                  {t.next} {t.task}
                </button>
              ) : (
                <button style={S.btn("success")} onClick={handleSubmitTest} disabled={submitting}>
                  {submitting ? t.grading : t.submitForGrading}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── Listening Test ──
  const renderListeningTest = () => {
    const content = currentTest.content;
    const questions = content.questions || [];
    const q = questions[currentQ];
    const totalQ = questions.length;

    return (
      <div>
        {renderTimer()}

        {/* Transcript controls */}
        <div style={{ ...S.card, marginBottom: 12 }}>
          <div style={{ ...S.flexBetween }}>
            <button style={S.btn(ttsPlaying ? "danger" : "primary")} onClick={() => playTTS(content.transcript || "")}>
              {ttsPlaying ? `⏸ ${t.pauseTranscript}` : `▶️ ${t.playTranscript}`}
            </button>
            <button style={S.btnSm("ghost")} onClick={() => setShowTranscript(!showTranscript)}>
              {showTranscript ? t.hideTranscript : t.showTranscript}
            </button>
          </div>
          {showTranscript && (
            <div style={{ ...S.passageText, marginTop: 12, maxHeight: 300 }}>
              {content.transcript}
            </div>
          )}
        </div>

        {/* Question */}
        {q && (
          <div style={S.card}>
            <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>
              {currentQ + 1}. {q.question}
            </p>
            {(q.options || []).map((opt, i) => {
              const letter = String.fromCharCode(65 + i);
              const selected = answers[String(currentQ)] === letter;
              return (
                <button
                  key={i}
                  style={S.optionBtn(selected, false, false)}
                  onClick={() => setAnswers((prev) => ({ ...prev, [String(currentQ)]: letter }))}
                >
                  <strong>{letter}.</strong> {opt}
                </button>
              );
            })}

            <div style={{ ...S.flexBetween, marginTop: 16 }}>
              <button style={S.btnSm("ghost")} disabled={currentQ === 0} onClick={() => setCurrentQ((q) => q - 1)}>
                {t.previous}
              </button>
              {currentQ < totalQ - 1 ? (
                <button style={S.btnSm("primary")} onClick={() => setCurrentQ((q) => q + 1)}>
                  {t.next}
                </button>
              ) : (
                <button style={S.btn("success")} onClick={handleSubmitTest} disabled={submitting}>
                  {submitting ? t.submitting : t.submit}
                </button>
              )}
            </div>
          </div>
        )}

        <div style={{ ...S.progressBar(0), marginTop: 12 }}>
          <div style={S.progressFill(((currentQ + 1) / totalQ) * 100)} />
        </div>
      </div>
    );
  };

  // ── Speaking Test ──
  const renderSpeakingTest = () => {
    const content = currentTest.content;
    const parts = content.parts || [];
    const part = parts[currentPart];
    if (!part) return <p style={S.empty}>{t.error}</p>;

    const hasSpeechAPI = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

    return (
      <div>
        {renderTimer()}
        <div style={{ ...S.flexBetween, margin: "12px 0" }}>
          <span style={{ fontWeight: 600 }}>{t.part} {part.partNumber}</span>
          <span style={S.badge("purple")}>{currentPart + 1} {t.of} {parts.length}</span>
        </div>

        <div style={S.card}>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "#1F2937" }}>{part.prompt}</p>
          <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 13, color: "#888" }}>
            {part.prepTimeSec > 0 && <span>{t.prepTime}: {part.prepTimeSec}s</span>}
            <span>{t.responseTime}: {part.responseTimeSec}s</span>
          </div>
        </div>

        {/* Recording area */}
        <div style={{ ...S.card, marginTop: 12, textAlign: "center" }}>
          {hasSpeechAPI ? (
            <>
              <button
                style={S.btn(isRecording ? "danger" : "primary")}
                onClick={isRecording ? stopSpeechRecognition : startSpeechRecognition}
              >
                {isRecording ? `🔴 ${t.stopRecording}` : `🎤 ${t.startRecording}`}
              </button>
              {isRecording && (
                <p style={{ marginTop: 8, color: "#DC2626", fontWeight: 600, animation: "pulse 1.5s infinite" }}>
                  {t.recording}
                </p>
              )}
            </>
          ) : (
            <p style={{ color: "#999" }}>{t.noSpeechSupport}</p>
          )}

          {/* Manual input fallback */}
          <div style={{ marginTop: 16 }}>
            <label style={S.label}>{t.transcription}</label>
            <textarea
              style={S.textarea}
              rows={6}
              value={speakingText}
              onChange={(e) => setSpeakingText(e.target.value)}
              placeholder={t.speakNow}
            />
          </div>
        </div>

        <div style={{ ...S.flexBetween, marginTop: 12 }}>
          <button style={S.btnSm("ghost")} disabled={currentPart === 0} onClick={() => setCurrentPart((p) => p - 1)}>
            {t.previous}
          </button>
          {currentPart < parts.length - 1 ? (
            <button style={S.btnSm("primary")} onClick={() => { setCurrentPart((p) => p + 1); setSpeakingText(""); }}>
              {t.next} {t.part}
            </button>
          ) : (
            <button style={S.btn("success")} onClick={handleSubmitTest} disabled={submitting || !speakingText.trim()}>
              {submitting ? t.grading : t.submitForGrading}
            </button>
          )}
        </div>
      </div>
    );
  };

  // ── Test Taking Router ──
  const renderTestTaking = () => {
    if (!currentTest) return <p style={S.empty}>{t.error}</p>;

    return (
      <div>
        <div style={{ ...S.flexBetween, marginBottom: 12 }}>
          <button style={S.btnSm("ghost")} onClick={() => { setTimerActive(false); setView("tests"); }}>
            ← {t.back}
          </button>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{currentTest.title}</h3>
        </div>

        {currentTest.section === "reading" && renderReadingTest()}
        {currentTest.section === "writing" && renderWritingTest()}
        {currentTest.section === "listening" && renderListeningTest()}
        {currentTest.section === "speaking" && renderSpeakingTest()}
      </div>
    );
  };

  // ── Results ──
  const renderResults = () => {
    if (!currentAttempt) return <p style={S.empty}>{t.noAttempts}</p>;

    const section = currentAttempt.section;
    const isAI = section === "writing" || section === "speaking";
    const grading = gradeResult || currentAttempt.aiGrading;
    const isIelts = currentAttempt.examType === "ielts";

    return (
      <div>
        <button style={S.btnSm("ghost")} onClick={() => { setView("dashboard"); setCurrentTest(null); setCurrentAttempt(null); setGradeResult(null); }}>
          ← {t.back}
        </button>

        {/* Score display */}
        <div style={S.scoreDisplay}>
          <div style={S.scoreBig}>
            {currentAttempt.score != null ? currentAttempt.score : "—"}
          </div>
          <div style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
            {isIelts ? t.band : t.score}
            {currentAttempt.maxScore ? ` / ${currentAttempt.maxScore}` : ""}
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
            <span style={S.badge("blue")}>{currentAttempt.examType?.toUpperCase()}</span>
            <span style={S.badge("purple")}>{t[currentAttempt.section]}</span>
            <span style={S.badge("green")}>{t.completed}</span>
          </div>
        </div>

        {/* AI Grading Feedback */}
        {isAI && grading && (
          <div style={S.card}>
            <h4 style={S.cardTitle}>{t.feedback}</h4>

            {/* Criteria breakdown */}
            {grading.criteria && (
              <div style={{ marginBottom: 16 }}>
                {Object.entries(grading.criteria).map(([key, value]) => {
                  const labelMap = {
                    taskAchievement: t.taskAchievement,
                    coherence: t.coherence,
                    lexicalResource: t.lexicalResource,
                    grammar: t.grammar,
                    fluency: t.fluency,
                    lexical: t.lexicalResource,
                    pronunciation: t.pronunciation,
                    development: t.development,
                    organization: t.organization,
                    languageUse: t.languageUse,
                  };
                  return (
                    <div key={key} style={S.criteriaRow}>
                      <span style={S.criteriaLabel}>{labelMap[key] || key}</span>
                      <span style={S.criteriaScore}>{value}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {grading.feedback && (
              <div style={{ background: "#F9FAFB", borderRadius: 12, padding: 16, marginBottom: 12 }}>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#374151", margin: 0 }}>{grading.feedback}</p>
              </div>
            )}

            {grading.suggestions && grading.suggestions.length > 0 && (
              <div>
                <h5 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{t.suggestions}</h5>
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                  {grading.suggestions.map((s, i) => (
                    <li key={i} style={{ fontSize: 14, color: "#374151", marginBottom: 4, lineHeight: 1.6 }}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Reading/Listening answer breakdown */}
        {!isAI && currentTest && (
          <div style={S.card}>
            <h4 style={S.cardTitle}>{t.results}</h4>
            {getAllQuestions().map((q, i) => {
              const userAns = (currentAttempt.answers || {})[String(i)];
              const isCorrect = userAns === q.correct;
              return (
                <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{i + 1}. {q.question}</p>
                  <div style={{ display: "flex", gap: 12, fontSize: 13 }}>
                    <span style={{ color: isCorrect ? "#16A34A" : "#DC2626" }}>
                      {t.yourAnswer}: {userAns || "—"} {isCorrect ? "✓" : "✗"}
                    </span>
                    {!isCorrect && (
                      <span style={{ color: "#16A34A" }}>{t.correctAnswer}: {q.correct}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ── Vocabulary List ──
  const renderVocab = () => (
    <div>
      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <input
          style={{ ...S.input, maxWidth: 250 }}
          placeholder={t.searchWords}
          value={vocabSearch}
          onChange={(e) => setVocabSearch(e.target.value)}
        />
        <select style={S.select} value={vocabCategory} onChange={(e) => setVocabCategory(e.target.value)}>
          <option value="">{t.allWords}</option>
          <option value="ielts_academic">{t.ieltsAcademic}</option>
          <option value="toefl_academic">{t.toeflAcademic}</option>
          <option value="general">{t.general}</option>
        </select>
        <button style={S.btn("primary")} onClick={() => {
          const due = vocab.filter((v) => {
            if (!v.progress || v.progress.length === 0) return true;
            return new Date(v.progress[0].nextReview) <= new Date();
          });
          setReviewCards(due.length > 0 ? due.slice(0, 20) : vocab.slice(0, 20));
          setReviewIndex(0);
          setReviewFlipped(false);
          setView("vocab-review");
        }}>
          {t.reviewVocab}
        </button>
      </div>

      <p style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>
        {vocabTotal} {t.allWords}
        {vocab.filter((v) => !v.progress || v.progress.length === 0 || new Date(v.progress[0]?.nextReview) <= new Date()).length > 0 &&
          ` • ${vocab.filter((v) => !v.progress || v.progress.length === 0 || new Date(v.progress[0]?.nextReview) <= new Date()).length} ${t.dueForReview}`}
      </p>

      {vocabLoading ? (
        <p style={S.empty}>{t.loading}</p>
      ) : (
        <div style={S.grid2}>
          {vocab.map((v) => (
            <div
              key={v.id}
              style={{ ...S.card, cursor: "pointer", transition: "all 0.3s" }}
              onClick={() => setVocabFlipped((prev) => ({ ...prev, [v.id]: !prev[v.id] }))}
            >
              {!vocabFlipped[v.id] ? (
                <>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#2563EB" }}>{v.word}</div>
                  <span style={{ ...S.badge(v.category === "ielts_academic" ? "blue" : v.category === "toefl_academic" ? "purple" : "green"), marginTop: 8 }}>
                    {v.category === "ielts_academic" ? "IELTS" : v.category === "toefl_academic" ? "TOEFL" : t.general}
                  </span>
                  <p style={{ fontSize: 12, color: "#999", marginTop: 6 }}>{t.flipCard}</p>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#374151", marginBottom: 6 }}>{v.word}</div>
                  <p style={{ fontSize: 14, color: "#374151", margin: "4px 0" }}><strong>{t.definition}:</strong> {v.definition}</p>
                  {v.example && <p style={{ fontSize: 13, color: "#666", fontStyle: "italic", margin: "4px 0" }}>{v.example}</p>}
                  {v.arabicMeaning && <p style={{ fontSize: 16, color: "#7C3AED", fontWeight: 600, margin: "6px 0 0" }}>{v.arabicMeaning}</p>}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── Vocabulary Review (SM-2 Flashcards) ──
  const renderVocabReview = () => {
    const card = reviewCards[reviewIndex];
    if (!card) return (
      <div style={S.empty}>
        <p style={{ fontSize: 18, marginBottom: 12 }}>{t.noWordsToReview}</p>
        <button style={S.btn("primary")} onClick={() => setView("vocab")}>{t.back}</button>
      </div>
    );

    return (
      <div>
        <div style={{ ...S.flexBetween, marginBottom: 16 }}>
          <button style={S.btnSm("ghost")} onClick={() => setView("vocab")}>← {t.back}</button>
          <span style={{ fontSize: 13, color: "#888" }}>{reviewIndex + 1} {t.of} {reviewCards.length}</span>
        </div>

        <div style={S.vocabCard} onClick={() => setReviewFlipped(true)}>
          {!reviewFlipped ? (
            <>
              <div style={S.vocabWord}>{card.word}</div>
              <p style={{ fontSize: 14, color: "#999", marginTop: 12 }}>{t.showAnswer}</p>
            </>
          ) : (
            <>
              <div style={{ ...S.vocabWord, fontSize: 22 }}>{card.word}</div>
              <div style={S.vocabDef}>{card.definition}</div>
              {card.example && <div style={S.vocabExample}>"{card.example}"</div>}
              {card.arabicMeaning && <div style={S.vocabArabic}>{card.arabicMeaning}</div>}
            </>
          )}
        </div>

        {reviewFlipped && (
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16 }}>
            <button style={{ ...S.btn("danger"), minWidth: 100 }} onClick={() => handleVocabReview(1)}>
              😟 {t.didntKnow}
            </button>
            <button style={{ ...S.btn(), minWidth: 100, background: "#F59E0B", color: "#fff" }} onClick={() => handleVocabReview(3)}>
              🤔 {t.almostGotIt}
            </button>
            <button style={{ ...S.btn("success"), minWidth: 100 }} onClick={() => handleVocabReview(5)}>
              😊 {t.iKnewIt}
            </button>
          </div>
        )}

        {/* Progress */}
        <div style={{ ...S.progressBar(0), marginTop: 20 }}>
          <div style={S.progressFill(((reviewIndex + 1) / reviewCards.length) * 100, "#7C3AED")} />
        </div>
      </div>
    );
  };

  // ── Materials Browser ──
  const renderMaterials = () => (
    <div>
      {/* Filter bar */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {/* Exam type toggle */}
        {["all", "ielts", "toefl", "both"].map((et) => (
          <button key={et} style={S.examBtn(matExamFilter === et)} onClick={() => { setMatExamFilter(et); setMaterialsPage(1); }}>
            {et === "all" ? t.all : et === "both" ? t.both : et.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Section pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        <button style={S.sectionTab(!matSectionFilter)} onClick={() => { setMatSectionFilter(""); setMaterialsPage(1); }}>{t.allSections}</button>
        {["reading", "writing", "listening", "speaking", "general"].map((sec) => (
          <button key={sec} style={S.sectionTab(matSectionFilter === sec)} onClick={() => { setMatSectionFilter(sec); setMaterialsPage(1); }}>
            {sec === "reading" ? "\uD83D\uDCD6" : sec === "writing" ? "\u270D\uFE0F" : sec === "listening" ? "\uD83C\uDFA7" : sec === "speaking" ? "\uD83C\uDF99\uFE0F" : "\uD83D\uDCCB"} {t[sec] || sec}
          </button>
        ))}
      </div>

      {/* Material type pills + search */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16, alignItems: "center" }}>
        <button style={{ ...S.sectionTab(!matTypeFilter), borderColor: !matTypeFilter ? "#E67E22" : "#E5E7EB", background: !matTypeFilter ? "#E67E22" : "transparent", color: !matTypeFilter ? "#fff" : "#666" }} onClick={() => { setMatTypeFilter(""); setMaterialsPage(1); }}>{t.allTypes}</button>
        {MATERIAL_TYPES.map((mt) => (
          <button key={mt.id} style={{ ...S.sectionTab(matTypeFilter === mt.id), borderColor: matTypeFilter === mt.id ? mt.color : "#E5E7EB", background: matTypeFilter === mt.id ? mt.color : "transparent", color: matTypeFilter === mt.id ? "#fff" : "#666" }} onClick={() => { setMatTypeFilter(mt.id); setMaterialsPage(1); }}>
            {mt.icon} {mt.label}
          </button>
        ))}
        <input
          style={{ ...S.input, maxWidth: 220, marginLeft: "auto" }}
          placeholder={t.searchMaterials}
          value={matSearch}
          onChange={(e) => { setMatSearch(e.target.value); setMaterialsPage(1); }}
        />
      </div>

      {/* Material cards */}
      {materialsLoading ? (
        <p style={S.empty}>{t.loading}</p>
      ) : materials.length === 0 ? (
        <p style={S.empty}>{t.noMaterials}</p>
      ) : (
        <>
          <div style={S.grid2}>
            {materials.map((mat) => {
              const preview = getPreviewUrl(mat.url, mat.materialType);
              return (
                <div key={mat.id} style={S.card}>
                  {/* Header: icon + badges */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 24, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, background: `${getMaterialColor(mat.materialType)}15` }}>{getMaterialIcon(mat.materialType)}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        <span style={S.badge(mat.examType === "ielts" ? "blue" : mat.examType === "toefl" ? "purple" : "green")}>{mat.examType === "both" ? "IELTS/TOEFL" : mat.examType?.toUpperCase()}</span>
                        <span style={S.badge("purple")}>{t[mat.section] || mat.section}</span>
                        <span style={S.badge(diffColor(mat.difficulty))}>{t[mat.difficulty] || mat.difficulty}</span>
                      </div>
                    </div>
                  </div>

                  <h4 style={{ ...S.cardTitle, fontSize: 15 }}>{mat.title}</h4>
                  {mat.description && <p style={{ fontSize: 13, color: "#666", margin: "4px 0 10px", lineHeight: 1.5 }}>{mat.description.length > 120 ? mat.description.slice(0, 120) + "..." : mat.description}</p>}

                  {/* Tags */}
                  {mat.tags && Array.isArray(mat.tags) && mat.tags.length > 0 && (
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                      {mat.tags.slice(0, 5).map((tag, i) => (
                        <span key={i} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 8, background: "#F3F4F6", color: "#666" }}>#{tag}</span>
                      ))}
                    </div>
                  )}

                  {/* Preview area */}
                  {matPreview === mat.id && (
                    <div style={{ marginBottom: 10, borderRadius: 10, overflow: "hidden", border: "1px solid #E5E7EB" }}>
                      {preview.type === "youtube" && (
                        <iframe src={preview.embedUrl} width="100%" height="200" style={{ border: "none" }} allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                      )}
                      {preview.type === "gdrive" && (
                        <iframe src={preview.embedUrl} width="100%" height="250" style={{ border: "none" }} />
                      )}
                      {preview.type === "audio" && (
                        <div style={{ padding: 16, textAlign: "center" }}>
                          <audio controls src={mat.url} style={{ width: "100%" }} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div style={{ ...S.flexBetween, marginTop: 8, paddingTop: 8, borderTop: "1px solid #F3F4F6" }}>
                    <div style={{ fontSize: 11, color: "#999" }}>
                      {mat.userName && <span>{t.uploadedBy} {mat.userName} {"\u2022"} </span>}
                      {new Date(mat.createdAt).toLocaleDateString()}
                    </div>
                    <div style={{ display: "flex", gap: 8, fontSize: 11, color: "#888" }}>
                      <span>{"\uD83D\uDC41"} {mat.viewCount}</span>
                      <span>{"\u2B07"} {mat.downloadCount}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    {(preview.type === "youtube" || preview.type === "gdrive" || preview.type === "audio") && (
                      <button style={S.btnSm(matPreview === mat.id ? "ghost" : "primary")} onClick={() => setMatPreview(matPreview === mat.id ? null : mat.id)}>
                        {matPreview === mat.id ? "\u2716 Close" : "\u25B6 Preview"}
                      </button>
                    )}
                    <a href={mat.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }} onClick={() => trackMaterial(mat.id, "download")}>
                      <button style={S.btnSm("success")}>{t.openLink} {"\u2197"}</button>
                    </a>
                    {userId && mat.userId === userId && (
                      <button style={S.btnSm("ghost")} onClick={() => handleDeleteMaterial(mat.id)}>
                        <span style={{ color: "#DC2626" }}>{t.deleteMaterial}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {materialsTotal > 20 && (
            <div style={{ ...S.flexCenter, marginTop: 20, gap: 8 }}>
              <button style={S.btnSm(materialsPage > 1 ? "primary" : "ghost")} disabled={materialsPage <= 1} onClick={() => setMaterialsPage((p) => p - 1)}>{t.previous}</button>
              <span style={{ fontSize: 13, color: "#888" }}>{materialsPage} / {Math.ceil(materialsTotal / 20)}</span>
              <button style={S.btnSm(materialsPage < Math.ceil(materialsTotal / 20) ? "primary" : "ghost")} disabled={materialsPage >= Math.ceil(materialsTotal / 20)} onClick={() => setMaterialsPage((p) => p + 1)}>{t.next}</button>
            </div>
          )}
        </>
      )}
    </div>
  );

  // ── Share Material (replaces old Upload Test) ──
  const renderShareMaterial = () => (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={S.card}>
        <h3 style={S.cardTitle}>{"\uD83D\uDCE4"} {t.shareMaterial}</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 14 }}>
          {/* Exam Type */}
          <div>
            <label style={S.label}>{t.examType} *</label>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              {["ielts", "toefl", "both"].map((et) => (
                <button key={et} style={S.examBtn(shareForm.examType === et)} onClick={() => setShareForm({ ...shareForm, examType: et })}>
                  {et === "both" ? t.both : et.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Section */}
          <div>
            <label style={S.label}>{t.section} *</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
              {["reading", "writing", "listening", "speaking", "general"].map((sec) => (
                <button key={sec} style={S.sectionTab(shareForm.section === sec)} onClick={() => setShareForm({ ...shareForm, section: sec })}>
                  {sec === "reading" ? "\uD83D\uDCD6" : sec === "writing" ? "\u270D\uFE0F" : sec === "listening" ? "\uD83C\uDFA7" : sec === "speaking" ? "\uD83C\uDF99\uFE0F" : "\uD83D\uDCCB"} {t[sec] || sec}
                </button>
              ))}
            </div>
          </div>

          {/* Material Type */}
          <div>
            <label style={S.label}>{t.materialType} *</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 6 }}>
              {MATERIAL_TYPES.map((mt) => (
                <button
                  key={mt.id}
                  onClick={() => setShareForm({ ...shareForm, materialType: mt.id })}
                  style={{
                    padding: "12px 8px", borderRadius: 12, border: "2px solid", cursor: "pointer", transition: "all 0.2s", textAlign: "center",
                    borderColor: shareForm.materialType === mt.id ? mt.color : "#E5E7EB",
                    background: shareForm.materialType === mt.id ? `${mt.color}12` : "#fff",
                  }}
                >
                  <div style={{ fontSize: 24 }}>{mt.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: shareForm.materialType === mt.id ? mt.color : "#666", marginTop: 4 }}>{mt.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={S.label}>{t.materialTitle} *</label>
            <input style={S.input} value={shareForm.title} onChange={(e) => setShareForm({ ...shareForm, title: e.target.value })} placeholder={t.materialTitle} />
          </div>

          {/* URL */}
          <div>
            <label style={S.label}>URL *</label>
            <input style={S.input} value={shareForm.url} onChange={(e) => setShareForm({ ...shareForm, url: e.target.value })} placeholder={getUrlPlaceholder(shareForm.materialType)} />
          </div>

          {/* Description */}
          <div>
            <label style={S.label}>{t.materialDescription}</label>
            <textarea style={{ ...S.textarea, minHeight: 70 }} value={shareForm.description} onChange={(e) => setShareForm({ ...shareForm, description: e.target.value })} />
          </div>

          {/* Difficulty + Language */}
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={S.label}>{t.difficulty}</label>
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                {["easy", "medium", "hard"].map((d) => (
                  <button key={d} style={{ ...S.sectionTab(shareForm.difficulty === d), borderColor: shareForm.difficulty === d ? (d === "easy" ? "#16A34A" : d === "hard" ? "#DC2626" : "#2563EB") : "#E5E7EB", background: shareForm.difficulty === d ? (d === "easy" ? "#16A34A" : d === "hard" ? "#DC2626" : "#2563EB") : "transparent", color: shareForm.difficulty === d ? "#fff" : "#666" }} onClick={() => setShareForm({ ...shareForm, difficulty: d })}>
                    {t[d]}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>{t.language}</label>
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                {[{ id: "en", label: t.english }, { id: "ar", label: t.arabic }, { id: "both", label: t.both }].map((l) => (
                  <button key={l.id} style={S.sectionTab(shareForm.language === l.id)} onClick={() => setShareForm({ ...shareForm, language: l.id })}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label style={S.label}>{t.tags}</label>
            <input style={S.input} value={shareForm.tags} onChange={(e) => setShareForm({ ...shareForm, tags: e.target.value })} placeholder={t.tagsPlaceholder} />
          </div>

          {/* Status note */}
          <div style={{ padding: 10, borderRadius: 10, background: "#FFFBEB", border: "1px solid #FDE68A", fontSize: 13, color: "#92400E" }}>
            {"\u2139\uFE0F"} {t.pendingReview}
          </div>

          {/* Messages */}
          {shareMsg && (
            <div style={{ padding: 12, borderRadius: 10, background: shareMsg.includes("+10") || shareMsg.includes("نقاط") ? "#F0FDF4" : "#FEF2F2", color: shareMsg.includes("+10") || shareMsg.includes("نقاط") ? "#16A34A" : "#DC2626", fontSize: 14, fontWeight: 600 }}>
              {shareMsg}
            </div>
          )}

          {/* Submit */}
          <button
            style={S.btn("primary")}
            onClick={handleShareMaterial}
            disabled={shareLoading || !shareForm.examType || !shareForm.section || !shareForm.materialType || !shareForm.title || !shareForm.url}
          >
            {shareLoading ? t.uploading : t.shareMaterial}
          </button>
        </div>
      </div>

      {/* Advanced: JSON test upload collapsible */}
      <div style={{ marginTop: 20 }}>
        <button
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#888", textDecoration: "underline" }}
          onClick={() => setShowJsonUpload(!showJsonUpload)}
        >
          {showJsonUpload ? "\u25BC" : "\u25B6"} {t.advancedTestUpload}
        </button>

        {showJsonUpload && (
          <div style={{ ...S.card, marginTop: 10 }}>
            <h4 style={{ ...S.cardTitle, fontSize: 14 }}>{t.uploadTest}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 12 }}>
              <div>
                <label style={S.label}>{t.examType}</label>
                <select style={S.select} value={uploadForm.examType} onChange={(e) => setUploadForm({ ...uploadForm, examType: e.target.value })}>
                  <option value="ielts">IELTS</option>
                  <option value="toefl">TOEFL</option>
                </select>
              </div>
              <div>
                <label style={S.label}>{t.section}</label>
                <select style={S.select} value={uploadForm.section} onChange={(e) => setUploadForm({ ...uploadForm, section: e.target.value })}>
                  <option value="reading">{t.reading}</option>
                  <option value="writing">{t.writing}</option>
                  <option value="listening">{t.listening}</option>
                  <option value="speaking">{t.speaking}</option>
                </select>
              </div>
              <div>
                <label style={S.label}>{t.testTitle} *</label>
                <input style={S.input} value={uploadForm.title} onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })} />
              </div>
              <div>
                <label style={S.label}>{t.testDescription}</label>
                <textarea style={{ ...S.textarea, minHeight: 60 }} value={uploadForm.description} onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={S.label}>{t.difficulty}</label>
                  <select style={S.select} value={uploadForm.difficulty} onChange={(e) => setUploadForm({ ...uploadForm, difficulty: e.target.value })}>
                    <option value="easy">{t.easy}</option>
                    <option value="medium">{t.medium}</option>
                    <option value="hard">{t.hard}</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={S.label}>{t.timeLimit}</label>
                  <input style={S.input} type="number" value={uploadForm.timeMinutes} onChange={(e) => setUploadForm({ ...uploadForm, timeMinutes: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={S.label}>{t.testContent} *</label>
                <textarea
                  style={{ ...S.textarea, minHeight: 180, fontFamily: "monospace", fontSize: 12 }}
                  value={uploadForm.content}
                  onChange={(e) => setUploadForm({ ...uploadForm, content: e.target.value })}
                  placeholder='{ "passages": [{ "text": "...", "questions": [...] }] }'
                />
              </div>
              {uploadMsg && (
                <div style={{ padding: 12, borderRadius: 10, background: uploadMsg.includes("success") || uploadMsg.includes("\u0646\u062C\u0627\u062D") ? "#F0FDF4" : "#FEF2F2", color: uploadMsg.includes("success") || uploadMsg.includes("\u0646\u062C\u0627\u062D") ? "#16A34A" : "#DC2626", fontSize: 14, fontWeight: 600 }}>
                  {uploadMsg}
                </div>
              )}
              <button
                style={S.btn("primary")}
                onClick={handleUpload}
                disabled={uploadLoading || !uploadForm.title || !uploadForm.content}
              >
                {uploadLoading ? t.uploading : t.uploadTestBtn}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ── Progress View ──
  const renderProgress = () => {
    if (completedAttempts.length === 0) {
      return <p style={S.empty}>{t.noProgressYet}</p>;
    }

    // Group by section
    const bySection = {};
    for (const a of completedAttempts) {
      const sec = a.section;
      if (!bySection[sec]) bySection[sec] = [];
      bySection[sec].push(a);
    }

    return (
      <div>
        {/* Overall stats */}
        <div style={S.scoreDisplay}>
          <div style={S.scoreBig}>{avgScore}</div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>{t.avgScore}</div>
        </div>

        {/* Section breakdown */}
        <div style={S.card}>
          <h4 style={S.cardTitle}>{t.sectionBreakdown}</h4>
          {["reading", "writing", "listening", "speaking"].map((sec) => {
            const sectionAttempts = bySection[sec] || [];
            const secAvg = sectionAttempts.length > 0
              ? (sectionAttempts.reduce((s, a) => s + (a.score || 0), 0) / sectionAttempts.length).toFixed(1)
              : "—";
            const maxPossible = examType === "ielts" ? 9 : 30;
            const pct = secAvg !== "—" ? (parseFloat(secAvg) / maxPossible) * 100 : 0;

            return (
              <div key={sec} style={{ marginBottom: 16 }}>
                <div style={S.flexBetween}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>
                    {sec === "reading" ? "📖" : sec === "writing" ? "✍️" : sec === "listening" ? "🎧" : "🎤"}{" "}
                    {t[sec]}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#2563EB" }}>
                    {secAvg} <span style={{ fontSize: 12, color: "#999" }}>({sectionAttempts.length} {t.attempts})</span>
                  </span>
                </div>
                <div style={{ ...S.progressBar(0), marginTop: 6 }}>
                  <div style={S.progressFill(pct, sec === "reading" ? "#2563EB" : sec === "writing" ? "#16A34A" : sec === "listening" ? "#F59E0B" : "#7C3AED")} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Score history */}
        <div style={S.card}>
          <h4 style={S.cardTitle}>{t.scoreHistory}</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {completedAttempts.slice(0, 15).map((a) => (
              <div key={a.id} style={{ ...S.flexBetween, padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{a.test?.title || "Test"}</span>
                  <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
                    <span style={S.badge("blue")}>{t[a.section]}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "#2563EB" }}>{a.score ?? "—"}</span>
                  <div style={{ fontSize: 11, color: "#999" }}>{new Date(a.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── Main Render ──
  const mainTabs = [
    { key: "dashboard", label: t.dashboard, icon: "\uD83D\uDCCA" },
    { key: "tests", label: t.practiceTests, icon: "\uD83D\uDCDD" },
    { key: "materials", label: t.materials, icon: "\uD83D\uDCDA" },
    { key: "vocab", label: t.vocabulary, icon: "\uD83D\uDCD6" },
    { key: "progress", label: t.progress, icon: "\uD83D\uDCC8" },
    { key: "share", label: t.shareMaterial, icon: "\uD83D\uDCE4" },
  ];

  return (
    <div style={S.container} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div style={S.header}>
        <h2 style={S.title}>{t.title}</h2>
        <p style={S.subtitle}>{t.subtitle}</p>
      </div>

      {/* Exam type toggle */}
      {(view === "dashboard" || view === "tests" || view === "progress") && (
        <div style={S.examToggle}>
          <button style={S.examBtn(examType === "ielts")} onClick={() => setExamType("ielts")}>{t.ielts}</button>
          <button style={S.examBtn(examType === "toefl")} onClick={() => setExamType("toefl")}>{t.toefl}</button>
        </div>
      )}

      {/* Main tabs */}
      {view !== "test-taking" && view !== "results" && view !== "vocab-review" && (
        <div style={S.tabs}>
          {mainTabs.map((tab) => (
            <button key={tab.key} style={S.tab(view === tab.key)} onClick={() => setView(tab.key)}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* View router */}
      {view === "dashboard" && renderDashboard()}
      {view === "tests" && renderTestList()}
      {view === "test-taking" && renderTestTaking()}
      {view === "results" && renderResults()}
      {view === "vocab" && renderVocab()}
      {view === "vocab-review" && renderVocabReview()}
      {view === "materials" && renderMaterials()}
      {view === "share" && renderShareMaterial()}
      {view === "progress" && renderProgress()}
    </div>
  );
}
