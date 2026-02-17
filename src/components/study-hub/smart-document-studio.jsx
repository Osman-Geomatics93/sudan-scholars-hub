"use client";
import { useState, useRef, useCallback } from "react";

const T = {
  en: {
    title: "Smart Document Studio",
    subtitle: "Upload any document and get structured text, tables, and AI-powered insights",
    loginRequired: "Please sign in to use Smart Document Studio",
    // Upload zone
    dropHere: "Drop your document here",
    orClick: "or click to browse files",
    supportedFormats: "PDF, DOCX, PPTX, XLSX, Images (PNG, JPG)",
    maxSize: "Max file size: 20MB",
    ocrMode: "OCR Mode",
    ocrModeDesc: "Extract text from scanned images",
    recentDocs: "Recent Documents",
    noRecentDocs: "No recent documents yet",
    // Processing
    processing: "Processing your document...",
    processingDesc: "This may take a moment depending on the file size",
    cancel: "Cancel",
    // Results
    structuredText: "Structured Text",
    tables: "Tables",
    actions: "Actions",
    copyText: "Copy Text",
    downloadMd: "Download Markdown",
    copied: "Copied!",
    noTables: "No tables found in this document",
    tableOf: "Table",
    rows: "rows",
    cols: "columns",
    copyCSV: "Copy as CSV",
    copyMdTable: "Copy as Markdown",
    // Actions
    chatWithDoc: "Chat with this Document",
    chatWithDocDesc: "Ask AI questions about the document content",
    generateFlashcards: "Generate Flashcards",
    generateFlashcardsDesc: "Auto-create study flashcards from document",
    extractTables: "Extract Tables",
    extractTablesDesc: "View and export all tables from document",
    // Flashcard generation
    generatingCards: "Generating flashcards...",
    flashcardsGenerated: "flashcards generated!",
    saveToDeck: "Save to Deck",
    deckTitle: "Deck Title",
    save: "Save",
    saving: "Saving...",
    savedSuccess: "Flashcards saved to deck!",
    front: "Q",
    back: "A",
    // Error
    errorTitle: "Something went wrong",
    retry: "Try Again",
    tryBasic: "Try Basic Extraction (PDF only)",
    tryingBasic: "Trying basic extraction...",
    // Fallback notice
    fallbackNotice: "Processed with basic extraction. Tables and advanced formatting may not be available.",
    // General
    uploadAnother: "Upload Another",
    fileInfo: "File Info",
    processedIn: "Processed in",
    ms: "ms",
    pages: "Pages",
    tablesFound: "Tables found",
  },
  ar: {
    title: "استوديو المستندات الذكي",
    subtitle: "ارفع أي مستند واحصل على نص منظم وجداول ورؤى مدعومة بالذكاء الاصطناعي",
    loginRequired: "يرجى تسجيل الدخول لاستخدام استوديو المستندات الذكي",
    dropHere: "اسحب المستند هنا",
    orClick: "أو انقر لاختيار ملف",
    supportedFormats: "PDF, DOCX, PPTX, XLSX, صور (PNG, JPG)",
    maxSize: "الحد الأقصى: 20 ميجابايت",
    ocrMode: "وضع OCR",
    ocrModeDesc: "استخراج النص من الصور الممسوحة",
    recentDocs: "المستندات الأخيرة",
    noRecentDocs: "لا توجد مستندات حديثة",
    processing: "جاري معالجة المستند...",
    processingDesc: "قد يستغرق ذلك لحظة حسب حجم الملف",
    cancel: "إلغاء",
    structuredText: "النص المنظم",
    tables: "الجداول",
    actions: "إجراءات",
    copyText: "نسخ النص",
    downloadMd: "تحميل Markdown",
    copied: "تم النسخ!",
    noTables: "لم يتم العثور على جداول في هذا المستند",
    tableOf: "جدول",
    rows: "صفوف",
    cols: "أعمدة",
    copyCSV: "نسخ CSV",
    copyMdTable: "نسخ Markdown",
    chatWithDoc: "تحدث مع هذا المستند",
    chatWithDocDesc: "اسأل الذكاء الاصطناعي عن محتوى المستند",
    generateFlashcards: "إنشاء بطاقات تعليمية",
    generateFlashcardsDesc: "إنشاء بطاقات دراسية تلقائياً من المستند",
    extractTables: "استخراج الجداول",
    extractTablesDesc: "عرض وتصدير جميع الجداول من المستند",
    generatingCards: "جاري إنشاء البطاقات...",
    flashcardsGenerated: "بطاقات تم إنشاؤها!",
    saveToDeck: "حفظ في مجموعة",
    deckTitle: "عنوان المجموعة",
    save: "حفظ",
    saving: "جاري الحفظ...",
    savedSuccess: "تم حفظ البطاقات في المجموعة!",
    front: "س",
    back: "ج",
    errorTitle: "حدث خطأ",
    retry: "حاول مرة أخرى",
    tryBasic: "جرب الاستخراج الأساسي (PDF فقط)",
    tryingBasic: "جاري الاستخراج الأساسي...",
    fallbackNotice: "تمت المعالجة بالاستخراج الأساسي. قد لا تتوفر الجداول والتنسيق المتقدم.",
    uploadAnother: "رفع مستند آخر",
    fileInfo: "معلومات الملف",
    processedIn: "تمت المعالجة في",
    ms: "مللي ثانية",
    pages: "الصفحات",
    tablesFound: "الجداول",
  },
};

const FILE_TYPE_ICONS = {
  "application/pdf": { icon: "📄", label: "PDF", color: "#E74C3C" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { icon: "📝", label: "DOCX", color: "#2E86C1" },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": { icon: "📊", label: "PPTX", color: "#E67E22" },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { icon: "📗", label: "XLSX", color: "#27AE60" },
  "image/png": { icon: "🖼️", label: "PNG", color: "#8E44AD" },
  "image/jpeg": { icon: "🖼️", label: "JPG", color: "#8E44AD" },
};

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

export default function SmartDocumentStudio({ locale = "en", userId, onNavigateToChat, onNavigateToFlashcards }) {
  const t = T[locale] || T.en;
  const isRTL = locale === "ar";

  // States
  const [state, setState] = useState("upload"); // upload, processing, results, error
  const [ocrMode, setOcrMode] = useState(false);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("text"); // text, tables, actions
  const [copiedId, setCopiedId] = useState(null);
  const [recentDocs, setRecentDocs] = useState([]);
  // Flashcard states
  const [generatingCards, setGeneratingCards] = useState(false);
  const [generatedCards, setGeneratedCards] = useState(null);
  const [deckTitle, setDeckTitle] = useState("");
  const [savingDeck, setSavingDeck] = useState(false);
  const [deckSaved, setDeckSaved] = useState(false);

  const fileInputRef = useRef(null);
  const abortRef = useRef(null);

  const copyToClipboard = useCallback(async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch { /* ignore */ }
  }, []);

  const processFile = useCallback(async (selectedFile, { fallback = false } = {}) => {
    setFile(selectedFile);
    setState("processing");
    setErrorMsg("");
    setResult(null);
    setGeneratedCards(null);
    setDeckSaved(false);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      let endpoint = ocrMode ? "/api/study-hub/docling/ocr" : "/api/study-hub/docling/convert";
      if (fallback) endpoint += "?fallback=true";

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${res.status}`);
      }

      const data = await res.json();

      if (ocrMode) {
        setResult({
          markdown: data.text || "",
          metadata: {},
          tables: [],
          processingTimeMs: data.processingTimeMs || 0,
          source: "ocr",
        });
      } else {
        setResult(data);
      }

      setState("results");
      setActiveTab("text");
    } catch (err) {
      if (err.name === "AbortError") {
        setState("upload");
        return;
      }
      setErrorMsg(err.message || "Unknown error");
      setState("error");
    }
  }, [ocrMode]);

  const handleBasicExtraction = useCallback(() => {
    if (file) processFile(file, { fallback: true });
  }, [file, processFile]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) processFile(droppedFile);
  }, [processFile]);

  const handleFileSelect = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) processFile(selectedFile);
  }, [processFile]);

  const handleCancel = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setState("upload");
    setFile(null);
  }, []);

  const resetToUpload = useCallback(() => {
    setState("upload");
    setFile(null);
    setResult(null);
    setErrorMsg("");
    setGeneratedCards(null);
    setDeckSaved(false);
    setActiveTab("text");
  }, []);

  const downloadMarkdown = useCallback(() => {
    if (!result?.markdown) return;
    const blob = new Blob([result.markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (file?.name?.replace(/\.[^.]+$/, "") || "document") + ".md";
    a.click();
    URL.revokeObjectURL(url);
  }, [result, file]);

  const tableToCSV = useCallback((html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const rows = doc.querySelectorAll("tr");
    return Array.from(rows).map(row => {
      const cells = row.querySelectorAll("td, th");
      return Array.from(cells).map(c => `"${c.textContent.replace(/"/g, '""')}"`).join(",");
    }).join("\n");
  }, []);

  // Chat with document
  const handleChatWithDoc = useCallback(async () => {
    if (!result?.markdown) return;
    try {
      const res = await fetch("/api/study-hub/ai-chat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Document: ${file?.name || "Uploaded Document"}`,
          contextType: "paste",
          contextText: result.markdown.slice(0, 50000),
        }),
      });
      if (res.ok && onNavigateToChat) {
        onNavigateToChat();
      }
    } catch (e) { console.error(e); }
  }, [result, file, onNavigateToChat]);

  // Generate flashcards
  const handleGenerateFlashcards = useCallback(async () => {
    if (!result?.markdown) return;
    setGeneratingCards(true);
    try {
      const res = await fetch("/api/study-hub/flashcards/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: result.markdown.slice(0, 15000),
          count: 10,
          language: locale,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedCards(data.cards || []);
        setDeckTitle(file?.name?.replace(/\.[^.]+$/, "") || "Document Flashcards");
      }
    } catch (e) { console.error(e); }
    setGeneratingCards(false);
  }, [result, file, locale]);

  // Save flashcards to deck: create deck, then add cards one by one
  const handleSaveDeck = useCallback(async () => {
    if (!generatedCards?.length || !deckTitle.trim()) return;
    setSavingDeck(true);
    try {
      // Step 1: Create deck
      const deckRes = await fetch("/api/study-hub/flashcards/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: deckTitle,
          description: `Generated from: ${file?.name || "document"}`,
        }),
      });
      if (!deckRes.ok) throw new Error("Failed to create deck");
      const { deck } = await deckRes.json();

      // Step 2: Add cards to deck
      for (const card of generatedCards) {
        await fetch(`/api/study-hub/flashcards/decks/${deck.id}/cards`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ front: card.front, back: card.back }),
        });
      }

      setDeckSaved(true);
    } catch (e) { console.error(e); }
    setSavingDeck(false);
  }, [generatedCards, deckTitle, file]);

  if (!userId) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
        <h3 style={{ marginBottom: 8, color: "var(--text-primary, #1a1a2e)" }}>{t.title}</h3>
        <p style={{ color: "var(--text-secondary, #666)" }}>{t.loginRequired}</p>
      </div>
    );
  }

  // === UPLOAD STATE ===
  if (state === "upload") {
    return (
      <div style={{ padding: "20px 0", direction: isRTL ? "rtl" : "ltr" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 22, color: "var(--text-primary, #1a1a2e)" }}>📄 {t.title}</h2>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "var(--text-secondary, #888)" }}>{t.subtitle}</p>
        </div>

        {/* OCR Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, padding: "12px 16px", borderRadius: 12, background: ocrMode ? "rgba(139,92,246,0.08)" : "var(--bg-secondary, #f8f9fa)", border: `1px solid ${ocrMode ? "rgba(139,92,246,0.3)" : "var(--border, #e5e7eb)"}`, cursor: "pointer" }}
          onClick={() => setOcrMode(!ocrMode)}>
          <div style={{ width: 44, height: 24, borderRadius: 12, background: ocrMode ? "#8B5CF6" : "#CBD5E1", position: "relative", transition: "background 0.2s" }}>
            <div style={{ width: 20, height: 20, borderRadius: 10, background: "#fff", position: "absolute", top: 2, transition: "left 0.2s", left: ocrMode ? 22 : 2, boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary, #333)" }}>🔍 {t.ocrMode}</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary, #888)" }}>{t.ocrModeDesc}</div>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? "#3B82F6" : "var(--border, #d1d5db)"}`,
            borderRadius: 16,
            padding: "48px 24px",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            background: dragOver ? "rgba(59,130,246,0.05)" : "var(--bg-primary, #fff)",
          }}
        >
          <input ref={fileInputRef} type="file" accept=".pdf,.docx,.pptx,.xlsx,.png,.jpg,.jpeg,.webp,.tiff" onChange={handleFileSelect} style={{ display: "none" }} />
          <div style={{ fontSize: 48, marginBottom: 12 }}>{ocrMode ? "🔍" : "📁"}</div>
          <h3 style={{ margin: "0 0 8px", fontSize: 18, color: "var(--text-primary, #1a1a2e)" }}>{t.dropHere}</h3>
          <p style={{ margin: "0 0 16px", fontSize: 14, color: "var(--text-secondary, #888)" }}>{t.orClick}</p>
          {/* File type badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 12 }}>
            {(ocrMode
              ? [{ icon: "🖼️", label: "PNG" }, { icon: "🖼️", label: "JPG" }, { icon: "🖼️", label: "TIFF" }]
              : [{ icon: "📄", label: "PDF" }, { icon: "📝", label: "DOCX" }, { icon: "📊", label: "PPTX" }, { icon: "📗", label: "XLSX" }, { icon: "🖼️", label: "Image" }]
            ).map((ft) => (
              <span key={ft.label} style={{ padding: "4px 12px", borderRadius: 8, background: "var(--bg-secondary, #f0f0f0)", fontSize: 12, color: "var(--text-secondary, #666)" }}>
                {ft.icon} {ft.label}
              </span>
            ))}
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary, #aaa)" }}>{t.maxSize}</p>
        </div>
      </div>
    );
  }

  // === PROCESSING STATE ===
  if (state === "processing") {
    const fileTypeInfo = FILE_TYPE_ICONS[file?.type] || { icon: "📄", label: "File", color: "#666" };
    return (
      <div style={{ padding: "60px 20px", textAlign: "center", direction: isRTL ? "rtl" : "ltr" }}>
        {/* Spinner */}
        <div style={{ display: "inline-block", width: 64, height: 64, border: "4px solid var(--border, #e5e7eb)", borderTopColor: "#3B82F6", borderRadius: "50%", animation: "docStudioSpin 1s linear infinite", marginBottom: 24 }} />
        <style>{`@keyframes docStudioSpin { to { transform: rotate(360deg); } }`}</style>
        <h3 style={{ margin: "0 0 8px", fontSize: 18, color: "var(--text-primary, #1a1a2e)" }}>{t.processing}</h3>
        <p style={{ margin: "0 0 20px", fontSize: 14, color: "var(--text-secondary, #888)" }}>{t.processingDesc}</p>
        {/* File info */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 10, background: "var(--bg-secondary, #f8f9fa)", border: "1px solid var(--border, #e5e7eb)" }}>
          <span style={{ fontSize: 20 }}>{fileTypeInfo.icon}</span>
          <span style={{ fontSize: 14, color: "var(--text-primary, #333)", fontWeight: 500 }}>{file?.name}</span>
          <span style={{ fontSize: 12, color: "var(--text-secondary, #888)" }}>({formatBytes(file?.size || 0)})</span>
        </div>
        <div style={{ marginTop: 20 }}>
          <button onClick={handleCancel} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid var(--border, #ddd)", background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", cursor: "pointer", fontSize: 14 }}>
            {t.cancel}
          </button>
        </div>
      </div>
    );
  }

  // === ERROR STATE ===
  if (state === "error") {
    const canFallback = file && (file.type === "application/pdf" || file.name?.toLowerCase().endsWith(".pdf"));
    return (
      <div style={{ padding: "60px 20px", textAlign: "center", direction: isRTL ? "rtl" : "ltr" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h3 style={{ margin: "0 0 8px", fontSize: 18, color: "#EF4444" }}>{t.errorTitle}</h3>
        <p style={{ margin: "0 0 20px", fontSize: 14, color: "var(--text-secondary, #888)", maxWidth: 400, marginInline: "auto" }}>{errorMsg}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => file && processFile(file)} style={{
            padding: "10px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #3B82F6, #2563EB)",
            color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14,
          }}>
            {t.retry}
          </button>
          {canFallback && (
            <button onClick={handleBasicExtraction} style={{
              padding: "10px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
              color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14,
            }}>
              {t.tryBasic}
            </button>
          )}
          <button onClick={resetToUpload} style={{
            padding: "10px 24px", borderRadius: 10, border: "1px solid var(--border, #ddd)",
            background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", cursor: "pointer", fontSize: 14,
          }}>
            {t.uploadAnother}
          </button>
        </div>
      </div>
    );
  }

  // === RESULTS STATE ===
  const fileTypeInfo = FILE_TYPE_ICONS[file?.type] || { icon: "📄", label: "File", color: "#666" };
  const tablesArr = result?.tables || [];

  return (
    <div style={{ padding: "20px 0", direction: isRTL ? "rtl" : "ltr" }}>
      {/* Header with file info */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>{fileTypeInfo.icon}</span>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, color: "var(--text-primary, #1a1a2e)" }}>{file?.name}</h2>
            <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--text-secondary, #888)", marginTop: 2, flexWrap: "wrap" }}>
              <span>{formatBytes(file?.size || 0)}</span>
              {result?.metadata?.pages && <span>{t.pages}: {result.metadata.pages}</span>}
              <span>{t.tablesFound}: {tablesArr.length}</span>
              <span>{t.processedIn} {result?.processingTimeMs || 0}{t.ms}</span>
            </div>
          </div>
        </div>
        <button onClick={resetToUpload} style={{
          padding: "8px 18px", borderRadius: 10, border: "1px solid var(--border, #ddd)",
          background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", cursor: "pointer", fontSize: 14,
        }}>
          {t.uploadAnother}
        </button>
      </div>

      {/* Fallback notice */}
      {result?.source === "pdf-parse" && (
        <div style={{ padding: "10px 16px", borderRadius: 10, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", color: "#B45309", fontSize: 13, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <span>⚠️</span> {t.fallbackNotice}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "var(--bg-secondary, #f0f0f0)", borderRadius: 12, padding: 4 }}>
        {[
          { key: "text", label: t.structuredText, icon: "📝" },
          { key: "tables", label: `${t.tables} (${tablesArr.length})`, icon: "📊" },
          { key: "actions", label: t.actions, icon: "⚡" },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            flex: 1, padding: "10px 12px", borderRadius: 10, border: "none",
            background: activeTab === tab.key ? "var(--bg-primary, #fff)" : "transparent",
            color: activeTab === tab.key ? "var(--text-primary, #333)" : "var(--text-secondary, #888)",
            fontWeight: activeTab === tab.key ? 600 : 400,
            cursor: "pointer", fontSize: 13, transition: "all 0.2s",
            boxShadow: activeTab === tab.key ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
          }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "text" && (
        <div>
          {/* Action bar */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button onClick={() => copyToClipboard(result?.markdown || "", "main")} style={{
              padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border, #ddd)",
              background: copiedId === "main" ? "#10B981" : "var(--bg-primary, #fff)",
              color: copiedId === "main" ? "#fff" : "var(--text-primary, #333)",
              cursor: "pointer", fontSize: 13, transition: "all 0.2s",
            }}>
              {copiedId === "main" ? `✓ ${t.copied}` : `📋 ${t.copyText}`}
            </button>
            <button onClick={downloadMarkdown} style={{
              padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border, #ddd)",
              background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", cursor: "pointer", fontSize: 13,
            }}>
              💾 {t.downloadMd}
            </button>
          </div>
          {/* Markdown content */}
          <div style={{
            background: "var(--bg-primary, #fff)", border: "1px solid var(--border, #e5e7eb)",
            borderRadius: 12, padding: 20, maxHeight: 500, overflowY: "auto",
            fontSize: 14, lineHeight: 1.8, color: "var(--text-primary, #333)",
            whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "inherit",
          }}>
            {result?.markdown || ""}
          </div>
        </div>
      )}

      {activeTab === "tables" && (
        <div>
          {tablesArr.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--text-secondary, #888)" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📊</div>
              <p>{t.noTables}</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {tablesArr.map((table, idx) => (
                <div key={idx} style={{ background: "var(--bg-primary, #fff)", border: "1px solid var(--border, #e5e7eb)", borderRadius: 12, overflow: "hidden" }}>
                  {/* Table header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: "var(--bg-secondary, #f8f9fa)", borderBottom: "1px solid var(--border, #e5e7eb)" }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary, #333)" }}>
                      {t.tableOf} {idx + 1} — {table.rows} {t.rows}, {table.cols} {t.cols}
                    </span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => copyToClipboard(tableToCSV(table.html), `csv-${idx}`)} style={{
                        padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border, #ddd)",
                        background: copiedId === `csv-${idx}` ? "#10B981" : "var(--bg-primary, #fff)",
                        color: copiedId === `csv-${idx}` ? "#fff" : "var(--text-secondary, #666)",
                        cursor: "pointer", fontSize: 12,
                      }}>
                        {copiedId === `csv-${idx}` ? "✓" : t.copyCSV}
                      </button>
                      <button onClick={() => copyToClipboard(table.markdown, `md-${idx}`)} style={{
                        padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border, #ddd)",
                        background: copiedId === `md-${idx}` ? "#10B981" : "var(--bg-primary, #fff)",
                        color: copiedId === `md-${idx}` ? "#fff" : "var(--text-secondary, #666)",
                        cursor: "pointer", fontSize: 12,
                      }}>
                        {copiedId === `md-${idx}` ? "✓" : t.copyMdTable}
                      </button>
                    </div>
                  </div>
                  {/* Table content */}
                  <div style={{ padding: 16, overflowX: "auto" }}
                    dangerouslySetInnerHTML={{ __html: table.html }}
                  />
                  <style>{`
                    .smart-doc-table table { width: 100%; border-collapse: collapse; font-size: 13px; }
                    .smart-doc-table th, .smart-doc-table td { padding: 8px 12px; border: 1px solid var(--border, #e5e7eb); text-align: ${isRTL ? "right" : "left"}; }
                    .smart-doc-table th { background: var(--bg-secondary, #f8f9fa); font-weight: 600; }
                  `}</style>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "actions" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Chat with Document */}
          <div onClick={handleChatWithDoc} style={{
            padding: 20, borderRadius: 14, border: "1px solid var(--border, #e5e7eb)",
            background: "var(--bg-primary, #fff)", cursor: "pointer", transition: "all 0.2s",
            display: "flex", alignItems: "center", gap: 16,
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3B82F6"; e.currentTarget.style.background = "rgba(59,130,246,0.03)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border, #e5e7eb)"; e.currentTarget.style.background = "var(--bg-primary, #fff)"; }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>🤖</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text-primary, #1a1a2e)", marginBottom: 4 }}>{t.chatWithDoc}</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary, #888)" }}>{t.chatWithDocDesc}</div>
            </div>
            <span style={{ marginInlineStart: "auto", fontSize: 18, color: "var(--text-secondary, #ccc)" }}>{isRTL ? "‹" : "›"}</span>
          </div>

          {/* Generate Flashcards */}
          <div style={{
            padding: 20, borderRadius: 14, border: "1px solid var(--border, #e5e7eb)",
            background: "var(--bg-primary, #fff)",
          }}>
            <div onClick={generatingCards ? undefined : handleGenerateFlashcards} style={{
              display: "flex", alignItems: "center", gap: 16, cursor: generatingCards ? "default" : "pointer",
            }}
              onMouseEnter={(e) => { if (!generatingCards) e.currentTarget.parentElement.style.borderColor = "#8B5CF6"; }}
              onMouseLeave={(e) => { e.currentTarget.parentElement.style.borderColor = "var(--border, #e5e7eb)"; }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(139,92,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>🧠</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text-primary, #1a1a2e)", marginBottom: 4 }}>{t.generateFlashcards}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary, #888)" }}>
                  {generatingCards ? t.generatingCards : t.generateFlashcardsDesc}
                </div>
              </div>
              {generatingCards && (
                <div style={{ marginInlineStart: "auto", width: 24, height: 24, border: "3px solid #e5e7eb", borderTopColor: "#8B5CF6", borderRadius: "50%", animation: "docStudioSpin 1s linear infinite" }} />
              )}
            </div>

            {/* Generated cards inline */}
            {generatedCards && generatedCards.length > 0 && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border, #e5e7eb)" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#8B5CF6", marginBottom: 12 }}>
                  ✨ {generatedCards.length} {t.flashcardsGenerated}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflowY: "auto", marginBottom: 16 }}>
                  {generatedCards.map((card, i) => (
                    <div key={i} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border, #e5e7eb)", background: "var(--bg-secondary, #f8f9fa)", fontSize: 13 }}>
                      <div style={{ color: "#3B82F6", fontWeight: 600, marginBottom: 4 }}>{t.front}: {card.front}</div>
                      <div style={{ color: "var(--text-primary, #333)" }}>{t.back}: {card.back}</div>
                    </div>
                  ))}
                </div>
                {!deckSaved ? (
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input value={deckTitle} onChange={(e) => setDeckTitle(e.target.value)} placeholder={t.deckTitle}
                      style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border, #ddd)", background: "var(--bg-primary, #fff)", color: "var(--text-primary, #333)", fontSize: 14, direction: isRTL ? "rtl" : "ltr" }} />
                    <button onClick={handleSaveDeck} disabled={savingDeck || !deckTitle.trim()} style={{
                      padding: "8px 18px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                      color: "#fff", fontWeight: 600, cursor: savingDeck ? "not-allowed" : "pointer", fontSize: 14,
                    }}>
                      {savingDeck ? t.saving : t.saveToDeck}
                    </button>
                  </div>
                ) : (
                  <div style={{ padding: "8px 14px", borderRadius: 8, background: "rgba(16,185,129,0.1)", color: "#10B981", fontWeight: 600, fontSize: 14, textAlign: "center" }}>
                    ✓ {t.savedSuccess}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Extract Tables */}
          {tablesArr.length > 0 && (
            <div onClick={() => setActiveTab("tables")} style={{
              padding: 20, borderRadius: 14, border: "1px solid var(--border, #e5e7eb)",
              background: "var(--bg-primary, #fff)", cursor: "pointer", transition: "all 0.2s",
              display: "flex", alignItems: "center", gap: 16,
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#10B981"; e.currentTarget.style.background = "rgba(16,185,129,0.03)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border, #e5e7eb)"; e.currentTarget.style.background = "var(--bg-primary, #fff)"; }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>📊</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text-primary, #1a1a2e)", marginBottom: 4 }}>{t.extractTables}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary, #888)" }}>{tablesArr.length} {t.tablesFound} — {t.extractTablesDesc}</div>
              </div>
              <span style={{ marginInlineStart: "auto", fontSize: 18, color: "var(--text-secondary, #ccc)" }}>{isRTL ? "‹" : "›"}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
