"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const T = {
  en: {
    title: "Academic Translator",
    subtitle: "Translate academic materials between languages",
    textTab: "Text Translation",
    imageTab: "Image Translation",
    sourceLang: "Source Language",
    targetLang: "Target Language",
    detectAuto: "Auto Detect",
    swap: "Swap",
    enterText: "Enter or paste text to translate...",
    translatedText: "Translation will appear here...",
    translate: "Translate",
    translating: "Translating...",
    copy: "Copy",
    copied: "Copied!",
    speak: "Listen",
    clear: "Clear",
    chars: "characters",
    academicMode: "Academic Mode",
    academicModeDesc: "Use formal academic language",
    history: "History",
    clearHistory: "Clear All",
    noHistory: "No translation history yet",
    dropImage: "Drag & drop an image here, or click to upload",
    dropImageHint: "Supports JPG, PNG, GIF, BMP, WebP",
    extracting: "Extracting text from image...",
    extractedText: "Extracted Text",
    editExtracted: "You can edit the extracted text before translating",
    translateExtracted: "Translate Extracted Text",
    ocrProgress: "OCR Progress",
    noText: "No text detected in the image",
    errorTranslate: "Translation failed. Please try again.",
    errorOcr: "Failed to extract text. Try a clearer image.",
    browseFiles: "Browse Files",
    removeImage: "Remove",
    loginRequired: "Please sign in to save translation history",
    charLimit: "Character limit: 5000",
    poweredBy: "Powered by MyMemory & Lingva",
    translateInImage: "Translate in Image",
    translatingImage: "Translating image...",
    downloadImage: "Download Image",
    translatedPreview: "Translated Image",
    linesProgress: "lines translated",
    original: "Original",
    translated: "Translated",
  },
  ar: {
    title: "المترجم الأكاديمي",
    subtitle: "ترجمة المواد الأكاديمية بين اللغات",
    textTab: "ترجمة النص",
    imageTab: "ترجمة الصور",
    sourceLang: "اللغة المصدر",
    targetLang: "اللغة الهدف",
    detectAuto: "اكتشاف تلقائي",
    swap: "تبديل",
    enterText: "أدخل أو الصق النص للترجمة...",
    translatedText: "ستظهر الترجمة هنا...",
    translate: "ترجمة",
    translating: "جاري الترجمة...",
    copy: "نسخ",
    copied: "تم النسخ!",
    speak: "استمع",
    clear: "مسح",
    chars: "حرف",
    academicMode: "الوضع الأكاديمي",
    academicModeDesc: "استخدام لغة أكاديمية رسمية",
    history: "السجل",
    clearHistory: "مسح الكل",
    noHistory: "لا يوجد سجل ترجمة بعد",
    dropImage: "اسحب وأسقط صورة هنا، أو انقر للرفع",
    dropImageHint: "يدعم JPG, PNG, GIF, BMP, WebP",
    extracting: "جاري استخراج النص من الصورة...",
    extractedText: "النص المستخرج",
    editExtracted: "يمكنك تعديل النص المستخرج قبل الترجمة",
    translateExtracted: "ترجمة النص المستخرج",
    ocrProgress: "تقدم الاستخراج",
    noText: "لم يتم اكتشاف نص في الصورة",
    errorTranslate: "فشلت الترجمة. يرجى المحاولة مرة أخرى.",
    errorOcr: "فشل استخراج النص. جرب صورة أوضح.",
    browseFiles: "تصفح الملفات",
    removeImage: "إزالة",
    loginRequired: "يرجى تسجيل الدخول لحفظ سجل الترجمة",
    charLimit: "الحد الأقصى: 5000 حرف",
    poweredBy: "مدعوم بواسطة MyMemory و Lingva",
    translateInImage: "ترجمة في الصورة",
    translatingImage: "جاري ترجمة الصورة...",
    downloadImage: "تحميل الصورة",
    translatedPreview: "الصورة المترجمة",
    linesProgress: "سطور مترجمة",
    original: "الأصلية",
    translated: "المترجمة",
  },
};

const LANGUAGES = [
  { code: "en", name: "English", nameAr: "الإنجليزية", flag: "🇬🇧" },
  { code: "ar", name: "Arabic", nameAr: "العربية", flag: "🇸🇦" },
  { code: "fr", name: "French", nameAr: "الفرنسية", flag: "🇫🇷" },
  { code: "es", name: "Spanish", nameAr: "الإسبانية", flag: "🇪🇸" },
  { code: "de", name: "German", nameAr: "الألمانية", flag: "🇩🇪" },
  { code: "zh", name: "Chinese", nameAr: "الصينية", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nameAr: "اليابانية", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nameAr: "الكورية", flag: "🇰🇷" },
  { code: "ru", name: "Russian", nameAr: "الروسية", flag: "🇷🇺" },
  { code: "tr", name: "Turkish", nameAr: "التركية", flag: "🇹🇷" },
  { code: "hi", name: "Hindi", nameAr: "الهندية", flag: "🇮🇳" },
  { code: "ur", name: "Urdu", nameAr: "الأردية", flag: "🇵🇰" },
  { code: "fa", name: "Persian", nameAr: "الفارسية", flag: "🇮🇷" },
  { code: "pt", name: "Portuguese", nameAr: "البرتغالية", flag: "🇧🇷" },
  { code: "it", name: "Italian", nameAr: "الإيطالية", flag: "🇮🇹" },
  { code: "nl", name: "Dutch", nameAr: "الهولندية", flag: "🇳🇱" },
  { code: "pl", name: "Polish", nameAr: "البولندية", flag: "🇵🇱" },
  { code: "sv", name: "Swedish", nameAr: "السويدية", flag: "🇸🇪" },
  { code: "da", name: "Danish", nameAr: "الدنماركية", flag: "🇩🇰" },
  { code: "no", name: "Norwegian", nameAr: "النرويجية", flag: "🇳🇴" },
  { code: "fi", name: "Finnish", nameAr: "الفنلندية", flag: "🇫🇮" },
  { code: "el", name: "Greek", nameAr: "اليونانية", flag: "🇬🇷" },
  { code: "cs", name: "Czech", nameAr: "التشيكية", flag: "🇨🇿" },
  { code: "ro", name: "Romanian", nameAr: "الرومانية", flag: "🇷🇴" },
  { code: "hu", name: "Hungarian", nameAr: "المجرية", flag: "🇭🇺" },
  { code: "th", name: "Thai", nameAr: "التايلاندية", flag: "🇹🇭" },
  { code: "vi", name: "Vietnamese", nameAr: "الفيتنامية", flag: "🇻🇳" },
  { code: "id", name: "Indonesian", nameAr: "الإندونيسية", flag: "🇮🇩" },
  { code: "ms", name: "Malay", nameAr: "الملايو", flag: "🇲🇾" },
  { code: "sw", name: "Swahili", nameAr: "السواحيلية", flag: "🇰🇪" },
  { code: "am", name: "Amharic", nameAr: "الأمهرية", flag: "🇪🇹" },
  { code: "ha", name: "Hausa", nameAr: "الهوسا", flag: "🇳🇬" },
  { code: "uk", name: "Ukrainian", nameAr: "الأوكرانية", flag: "🇺🇦" },
];

const RTL_LANGS = ["ar", "fa", "ur", "he"];
const MAX_CHARS = 5000;
const HISTORY_KEY = "academic_translator_history";
const MAX_HISTORY = 10;

async function translateMyMemory(text, source, target) {
  const langPair = `${source}|${target}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langPair)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("MyMemory API error");
  const data = await res.json();
  if (data.responseStatus === 200 && data.responseData?.translatedText) {
    const translated = data.responseData.translatedText;
    if (translated.toUpperCase() === translated && text.toUpperCase() !== text) {
      throw new Error("Low quality translation");
    }
    return translated;
  }
  throw new Error(data.responseDetails || "Translation failed");
}

async function translateLingva(text, source, target) {
  const url = `https://lingva.ml/api/v1/${source}/${target}/${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const alt = `https://lingva.thedaviddelta.com/api/v1/${source}/${target}/${encodeURIComponent(text)}`;
    const res2 = await fetch(alt);
    if (!res2.ok) throw new Error("Lingva API error");
    const data2 = await res2.json();
    return data2.translation;
  }
  const data = await res.json();
  return data.translation;
}

async function translateText(text, source, target) {
  try {
    return await translateMyMemory(text, source, target);
  } catch {
    try {
      return await translateLingva(text, source, target);
    } catch {
      throw new Error("All translation services failed");
    }
  }
}

function speakText(text, langCode) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = langCode;
  utter.rate = 0.9;
  window.speechSynthesis.speak(utter);
}

// --- Canvas utility functions for in-image translation ---

function sampleBgColor(ctx, bbox, w, h) {
  const { x0, y0, x1, y1 } = bbox;
  const points = [
    [x0, y0], [x1, y0], [x0, y1], [x1, y1],
    [(x0 + x1) / 2, y0], [(x0 + x1) / 2, y1],
    [x0, (y0 + y1) / 2], [x1, (y0 + y1) / 2],
  ];
  let r = 0, g = 0, b = 0, count = 0;
  for (const [px, py] of points) {
    const cx = Math.max(0, Math.min(w - 1, Math.round(px)));
    const cy = Math.max(0, Math.min(h - 1, Math.round(py)));
    const pixel = ctx.getImageData(cx, cy, 1, 1).data;
    r += pixel[0]; g += pixel[1]; b += pixel[2];
    count++;
  }
  return { r: Math.round(r / count), g: Math.round(g / count), b: Math.round(b / count) };
}

function fitText(ctx, text, maxW, maxH, fontFamily) {
  let size = Math.min(maxH, 72);
  while (size >= 8) {
    ctx.font = `${size}px ${fontFamily}`;
    const m = ctx.measureText(text);
    const textH = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    if (m.width <= maxW && textH <= maxH) return size;
    size--;
  }
  return 8;
}

function renderTranslatedImage(imgSrc, lines, translations, targetLang) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const isRTL = RTL_LANGS.includes(targetLang);
      const fontFamily = "Arial, sans-serif";
      const pad = 3;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const translated = translations[i];
        if (!translated || !line.bbox) continue;

        const { x0, y0, x1, y1 } = line.bbox;
        const bg = sampleBgColor(ctx, line.bbox, img.width, img.height);

        // Erase original text area with sampled background + padding
        ctx.fillStyle = `rgb(${bg.r},${bg.g},${bg.b})`;
        ctx.fillRect(
          Math.max(0, x0 - pad),
          Math.max(0, y0 - pad),
          Math.min(img.width, x1 + pad) - Math.max(0, x0 - pad),
          Math.min(img.height, y1 + pad) - Math.max(0, y0 - pad)
        );

        // Fit and render translated text
        const boxW = x1 - x0;
        const boxH = y1 - y0;
        const fontSize = fitText(ctx, translated, boxW, boxH, fontFamily);
        ctx.font = `${fontSize}px ${fontFamily}`;

        // Determine text color (contrast with background)
        const lum = (bg.r * 299 + bg.g * 587 + bg.b * 114) / 1000;
        ctx.fillStyle = lum > 128 ? "#000000" : "#FFFFFF";

        if (isRTL) {
          ctx.direction = "rtl";
          ctx.textAlign = "right";
          ctx.textBaseline = "middle";
          ctx.fillText(translated, x1, y0 + boxH / 2);
        } else {
          ctx.direction = "ltr";
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillText(translated, x0, y0 + boxH / 2);
        }
      }

      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imgSrc;
  });
}

export default function AcademicTranslator({ locale = "en", userId }) {
  const t = T[locale] || T.en;
  const isRTL = locale === "ar";

  const [activeTab, setActiveTab] = useState("text");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("ar");
  const [sourceText, setSourceText] = useState("");
  const [translatedResult, setTranslatedResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [academicMode, setAcademicMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Image / OCR state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrRunning, setOcrRunning] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [dragOver, setDragOver] = useState(false);

  // In-image translation state
  const [ocrLines, setOcrLines] = useState([]);
  const [translatedImage, setTranslatedImage] = useState(null);
  const [imageTranslating, setImageTranslating] = useState(false);
  const [imageTranslateProgress, setImageTranslateProgress] = useState({ done: 0, total: 0 });

  const fileInputRef = useRef(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const key = userId ? `${HISTORY_KEY}_${userId}` : HISTORY_KEY;
      const stored = localStorage.getItem(key);
      if (stored) setHistory(JSON.parse(stored));
    } catch {}
  }, [userId]);

  const saveHistory = useCallback(
    (entry) => {
      setHistory((prev) => {
        const next = [entry, ...prev].slice(0, MAX_HISTORY);
        try {
          const key = userId ? `${HISTORY_KEY}_${userId}` : HISTORY_KEY;
          localStorage.setItem(key, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [userId]
  );

  const clearHistory = () => {
    setHistory([]);
    try {
      const key = userId ? `${HISTORY_KEY}_${userId}` : HISTORY_KEY;
      localStorage.removeItem(key);
    } catch {}
  };

  const handleSwapLangs = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    if (translatedResult) {
      setSourceText(translatedResult);
      setTranslatedResult(sourceText);
    }
  };

  const handleTranslate = async () => {
    const text = sourceText.trim();
    if (!text || loading) return;
    setLoading(true);
    setError("");
    setTranslatedResult("");

    let textToTranslate = text;
    if (academicMode) {
      const prefix =
        targetLang === "ar"
          ? "ترجم بأسلوب أكاديمي رسمي: "
          : "Translate in formal academic style: ";
      textToTranslate = prefix + text;
    }

    try {
      const result = await translateText(textToTranslate, sourceLang, targetLang);
      // Strip the academic prefix from the result if it leaked through
      let clean = result;
      if (academicMode) {
        clean = clean
          .replace(/^Translate in formal academic style:\s*/i, "")
          .replace(/^ترجم بأسلوب أكاديمي رسمي:\s*/, "");
      }
      setTranslatedResult(clean);
      const srcLangObj = LANGUAGES.find((l) => l.code === sourceLang);
      const tgtLangObj = LANGUAGES.find((l) => l.code === targetLang);
      saveHistory({
        id: Date.now(),
        sourceText: text.slice(0, 80),
        translatedText: clean.slice(0, 80),
        sourceLang: srcLangObj ? `${srcLangObj.flag} ${srcLangObj.code.toUpperCase()}` : sourceLang,
        targetLang: tgtLangObj ? `${tgtLangObj.flag} ${tgtLangObj.code.toUpperCase()}` : targetLang,
        timestamp: new Date().toLocaleString(),
      });
    } catch {
      setError(t.errorTranslate);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {}
  };

  // Image handling
  const handleImageSelect = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    setExtractedText("");
    setTranslatedResult("");
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleImageSelect(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setExtractedText("");
    setOcrProgress(0);
    setOcrLines([]);
    setTranslatedImage(null);
    setImageTranslateProgress({ done: 0, total: 0 });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const runOCR = async () => {
    if (!imageFile || ocrRunning) return;
    setOcrRunning(true);
    setOcrProgress(0);
    setExtractedText("");
    setError("");

    try {
      const Tesseract = await import("tesseract.js");
      const { createWorker } = Tesseract;
      const ocrLang =
        sourceLang === "zh"
          ? "chi_sim"
          : sourceLang === "ja"
            ? "jpn"
            : sourceLang === "ko"
              ? "kor"
              : sourceLang === "ar"
                ? "ara"
                : sourceLang === "hi"
                  ? "hin"
                  : sourceLang === "ru"
                    ? "rus"
                    : sourceLang === "fa"
                      ? "fas"
                      : sourceLang === "ur"
                        ? "urd"
                        : sourceLang === "tr"
                          ? "tur"
                          : sourceLang === "fr"
                            ? "fra"
                            : sourceLang === "de"
                              ? "deu"
                              : sourceLang === "es"
                                ? "spa"
                                : sourceLang === "pt"
                                  ? "por"
                                  : sourceLang === "it"
                                    ? "ita"
                                    : "eng";

      const worker = await createWorker(ocrLang, 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setOcrProgress(Math.round(m.progress * 100));
          }
        },
      });

      const { data } = await worker.recognize(imageFile, {}, { blocks: true, text: true });
      await worker.terminate();

      if (data.text.trim()) {
        setExtractedText(data.text.trim());
        // Extract line-level bounding boxes from blocks→paragraphs→lines (Tesseract v7 structure)
        const lines = [];
        if (data.blocks) {
          for (const block of data.blocks) {
            if (block.paragraphs) {
              for (const para of block.paragraphs) {
                if (para.lines) {
                  for (const ln of para.lines) {
                    if (ln.text && ln.text.trim() && ln.bbox) {
                      lines.push({
                        text: ln.text.trim(),
                        bbox: ln.bbox,
                        confidence: ln.confidence,
                      });
                    }
                  }
                }
              }
            }
          }
        }
        if (lines.length > 0) {
          setOcrLines(lines);
        }
      } else {
        setError(t.noText);
      }
    } catch {
      setError(t.errorOcr);
    } finally {
      setOcrRunning(false);
    }
  };

  const handleTranslateInImage = async () => {
    if (!ocrLines.length || imageTranslating) return;
    setImageTranslating(true);
    setTranslatedImage(null);
    setImageTranslateProgress({ done: 0, total: ocrLines.length });

    try {
      const translations = [];
      for (let i = 0; i < ocrLines.length; i++) {
        const lineText = ocrLines[i].text.trim();
        if (!lineText) {
          translations.push("");
          setImageTranslateProgress({ done: i + 1, total: ocrLines.length });
          continue;
        }

        let textToTranslate = lineText;
        if (academicMode) {
          const prefix = targetLang === "ar"
            ? "ترجم بأسلوب أكاديمي رسمي: "
            : "Translate in formal academic style: ";
          textToTranslate = prefix + lineText;
        }

        try {
          let result = await translateText(textToTranslate, sourceLang, targetLang);
          if (academicMode) {
            result = result
              .replace(/^Translate in formal academic style:\s*/i, "")
              .replace(/^ترجم بأسلوب أكاديمي رسمي:\s*/, "");
          }
          translations.push(result);
        } catch {
          translations.push(lineText); // fallback to original on error
        }
        setImageTranslateProgress({ done: i + 1, total: ocrLines.length });
      }

      const dataUrl = await renderTranslatedImage(imagePreview, ocrLines, translations, targetLang);
      setTranslatedImage(dataUrl);
    } catch {
      setError(t.errorTranslate);
    } finally {
      setImageTranslating(false);
    }
  };

  const handleDownloadImage = () => {
    if (!translatedImage) return;
    const a = document.createElement("a");
    a.href = translatedImage;
    a.download = `translated_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleTranslateExtracted = () => {
    if (!extractedText.trim()) return;
    setSourceText(extractedText);
    setActiveTab("text");
    setTimeout(() => handleTranslate(), 100);
  };

  // Trigger OCR when an image is loaded
  useEffect(() => {
    if (imageFile) runOCR();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFile]);

  const langName = (code) => {
    const l = LANGUAGES.find((x) => x.code === code);
    if (!l) return code;
    return isRTL ? `${l.flag} ${l.nameAr}` : `${l.flag} ${l.name}`;
  };

  const isTargetRTL = RTL_LANGS.includes(targetLang);
  const isSourceRTL = RTL_LANGS.includes(sourceLang);

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        minHeight: "70vh",
        padding: "0 4px",
        maxWidth: 960,
        margin: "0 auto",
        fontFamily: isRTL ? "'Segoe UI', Tahoma, sans-serif" : "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        className="dark:from-teal-900/40 dark:to-cyan-900/30"
        style={{
          background: "linear-gradient(135deg, rgba(20,184,166,0.12), rgba(6,182,212,0.10))",
          borderRadius: 20,
          padding: "28px 24px 22px",
          marginBottom: 20,
          border: "1px solid rgba(20,184,166,0.18)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 32 }}>🌐</span>
          <h2
            className="dark:text-teal-300"
            style={{ margin: 0, fontSize: "clamp(22px, 4vw, 28px)", fontWeight: 800, color: "#0D9488", letterSpacing: "-0.5px" }}
          >
            {t.title}
          </h2>
          {/* Academic Mode Toggle */}
          <button
            onClick={() => setAcademicMode(!academicMode)}
            className={
              academicMode
                ? "dark:bg-teal-500/30 dark:text-teal-200 dark:border-teal-400/50"
                : "dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600"
            }
            style={{
              marginLeft: isRTL ? 0 : "auto",
              marginRight: isRTL ? "auto" : 0,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              border: academicMode ? "1.5px solid rgba(20,184,166,0.5)" : "1.5px solid rgba(156,163,175,0.4)",
              background: academicMode ? "rgba(20,184,166,0.12)" : "rgba(243,244,246,0.8)",
              color: academicMode ? "#0D9488" : "#6B7280",
            }}
          >
            🎓 {t.academicMode}
            <span
              style={{
                width: 36,
                height: 20,
                borderRadius: 10,
                background: academicMode ? "#14B8A6" : "#D1D5DB",
                position: "relative",
                display: "inline-block",
                transition: "background 0.2s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 2,
                  left: academicMode ? 18 : 2,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              />
            </span>
          </button>
        </div>
        <p className="dark:text-gray-400" style={{ margin: 0, fontSize: 14, color: "#6B7280" }}>
          {t.subtitle}
        </p>
      </div>

      {/* Tab Bar */}
      <div
        className="dark:bg-gray-800/60 dark:border-gray-700"
        style={{
          display: "flex",
          gap: 4,
          background: "rgba(243,244,246,0.8)",
          borderRadius: 14,
          padding: 4,
          marginBottom: 18,
          border: "1px solid rgba(229,231,235,0.6)",
        }}
      >
        {[
          { key: "text", label: t.textTab, icon: "📝" },
          { key: "image", label: t.imageTab, icon: "🖼️" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setError(""); }}
            className={
              activeTab === tab.key
                ? "dark:bg-teal-500/20 dark:text-teal-300 dark:shadow-none"
                : "dark:text-gray-400 dark:hover:bg-gray-700/50"
            }
            style={{
              flex: 1,
              padding: "10px 16px",
              borderRadius: 11,
              fontSize: 14,
              fontWeight: 650,
              cursor: "pointer",
              border: "none",
              transition: "all 0.2s",
              background: activeTab === tab.key ? "#fff" : "transparent",
              color: activeTab === tab.key ? "#0D9488" : "#6B7280",
              boxShadow: activeTab === tab.key ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* TEXT TRANSLATION TAB */}
      {activeTab === "text" && (
        <div>
          {/* Language Selectors */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: 140 }}>
              <label className="dark:text-gray-400" style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 4, display: "block" }}>
                {t.sourceLang}
              </label>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1.5px solid rgba(209,213,219,0.6)",
                  fontSize: 14,
                  fontWeight: 500,
                  background: "#fff",
                  cursor: "pointer",
                  outline: "none",
                  appearance: "auto",
                }}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {isRTL ? l.nameAr : l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <button
              onClick={handleSwapLangs}
              title={t.swap}
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-teal-400 dark:hover:bg-teal-900/30"
              style={{
                marginTop: 18,
                width: 42,
                height: 42,
                borderRadius: "50%",
                border: "1.5px solid rgba(20,184,166,0.3)",
                background: "rgba(20,184,166,0.08)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                transition: "all 0.2s",
                color: "#0D9488",
                flexShrink: 0,
              }}
            >
              ⇄
            </button>

            <div style={{ flex: 1, minWidth: 140 }}>
              <label className="dark:text-gray-400" style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 4, display: "block" }}>
                {t.targetLang}
              </label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1.5px solid rgba(209,213,219,0.6)",
                  fontSize: 14,
                  fontWeight: 500,
                  background: "#fff",
                  cursor: "pointer",
                  outline: "none",
                  appearance: "auto",
                }}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {isRTL ? l.nameAr : l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Source + Result text areas side by side on desktop */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {/* Source */}
            <div
              className="dark:bg-gray-800/70 dark:border-gray-700"
              style={{
                borderRadius: 14,
                border: "1.5px solid rgba(209,213,219,0.5)",
                overflow: "hidden",
                background: "#fff",
                gridColumn: "span 1",
              }}
            >
              <textarea
                dir={isSourceRTL ? "rtl" : "ltr"}
                value={sourceText}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CHARS) setSourceText(e.target.value);
                }}
                placeholder={t.enterText}
                className="dark:bg-gray-800/70 dark:text-gray-100 dark:placeholder-gray-500"
                style={{
                  width: "100%",
                  minHeight: 180,
                  padding: "14px 16px",
                  border: "none",
                  outline: "none",
                  fontSize: 15,
                  lineHeight: 1.7,
                  resize: "vertical",
                  fontFamily: "inherit",
                  background: "transparent",
                }}
              />
              <div
                className="dark:border-gray-700 dark:bg-gray-800"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 14px",
                  borderTop: "1px solid rgba(229,231,235,0.5)",
                  background: "rgba(249,250,251,0.6)",
                  flexWrap: "wrap",
                  gap: 6,
                }}
              >
                <span className="dark:text-gray-500" style={{ fontSize: 12, color: "#9CA3AF" }}>
                  {sourceText.length}/{MAX_CHARS} {t.chars}
                </span>
                <div style={{ display: "flex", gap: 4 }}>
                  {sourceText && (
                    <button
                      onClick={() => speakText(sourceText, sourceLang)}
                      className="dark:text-gray-400 dark:hover:bg-gray-700"
                      style={{
                        padding: "4px 10px",
                        borderRadius: 8,
                        border: "none",
                        background: "rgba(20,184,166,0.08)",
                        color: "#0D9488",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      🔊 {t.speak}
                    </button>
                  )}
                  {sourceText && (
                    <button
                      onClick={() => { setSourceText(""); setTranslatedResult(""); setError(""); }}
                      className="dark:text-gray-400 dark:hover:bg-gray-700"
                      style={{
                        padding: "4px 10px",
                        borderRadius: 8,
                        border: "none",
                        background: "rgba(239,68,68,0.08)",
                        color: "#EF4444",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      ✕ {t.clear}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Result */}
            <div
              className="dark:bg-gray-800/70 dark:border-gray-700"
              style={{
                borderRadius: 14,
                border: "1.5px solid rgba(20,184,166,0.25)",
                overflow: "hidden",
                background: "rgba(20,184,166,0.02)",
                gridColumn: "span 1",
              }}
            >
              <div
                dir={isTargetRTL ? "rtl" : "ltr"}
                className="dark:text-gray-200"
                style={{
                  width: "100%",
                  minHeight: 180,
                  padding: "14px 16px",
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: translatedResult ? "#1F2937" : "#9CA3AF",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 8, color: "#14B8A6" }}>
                    <span className="animate-spin" style={{ display: "inline-block", width: 16, height: 16, border: "2px solid #14B8A6", borderTopColor: "transparent", borderRadius: "50%" }} />
                    {t.translating}
                  </span>
                ) : (
                  translatedResult || t.translatedText
                )}
              </div>
              <div
                className="dark:border-gray-700 dark:bg-gray-800"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  padding: "8px 14px",
                  borderTop: "1px solid rgba(20,184,166,0.15)",
                  background: "rgba(20,184,166,0.03)",
                  gap: 4,
                }}
              >
                {translatedResult && (
                  <>
                    <button
                      onClick={() => speakText(translatedResult, targetLang)}
                      className="dark:text-teal-400 dark:hover:bg-teal-900/30"
                      style={{
                        padding: "4px 10px",
                        borderRadius: 8,
                        border: "none",
                        background: "rgba(20,184,166,0.1)",
                        color: "#0D9488",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      🔊 {t.speak}
                    </button>
                    <button
                      onClick={() => handleCopy(translatedResult)}
                      className="dark:text-teal-400 dark:hover:bg-teal-900/30"
                      style={{
                        padding: "4px 10px",
                        borderRadius: 8,
                        border: "none",
                        background: "rgba(20,184,166,0.1)",
                        color: "#0D9488",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {copySuccess ? `✓ ${t.copied}` : `📋 ${t.copy}`}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Responsive: stack on mobile */}
          <style>{`
            @media (max-width: 640px) {
              div[style*="gridTemplateColumns: \"1fr 1fr\""],
              div[style*="grid-template-columns"] {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>

          {/* Translate Button */}
          <button
            onClick={handleTranslate}
            disabled={!sourceText.trim() || loading}
            className="dark:from-teal-600 dark:to-cyan-600"
            style={{
              width: "100%",
              marginTop: 16,
              padding: "13px 24px",
              borderRadius: 12,
              border: "none",
              background: !sourceText.trim() || loading ? "#D1D5DB" : "linear-gradient(135deg, #14B8A6, #06B6D4)",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: !sourceText.trim() || loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              letterSpacing: "0.3px",
              boxShadow: sourceText.trim() && !loading ? "0 4px 14px rgba(20,184,166,0.3)" : "none",
            }}
          >
            {loading ? t.translating : `🌐 ${t.translate}`}
          </button>

          {error && (
            <div
              className="dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
              style={{
                marginTop: 12,
                padding: "10px 14px",
                borderRadius: 10,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#DC2626",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}

          {/* History */}
          <div style={{ marginTop: 24 }}>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="dark:text-gray-300 dark:hover:bg-gray-800"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 650,
                color: "#374151",
                padding: "6px 0",
              }}
            >
              📜 {t.history}
              <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>
                ({history.length})
              </span>
              <span style={{ fontSize: 12, transition: "transform 0.2s", transform: showHistory ? "rotate(180deg)" : "rotate(0)" }}>
                ▼
              </span>
            </button>
            {showHistory && (
              <div
                className="dark:bg-gray-800/60 dark:border-gray-700"
                style={{
                  marginTop: 8,
                  borderRadius: 12,
                  border: "1px solid rgba(229,231,235,0.6)",
                  background: "rgba(249,250,251,0.8)",
                  overflow: "hidden",
                }}
              >
                {history.length === 0 ? (
                  <div className="dark:text-gray-500" style={{ padding: 20, textAlign: "center", fontSize: 13, color: "#9CA3AF" }}>
                    {t.noHistory}
                  </div>
                ) : (
                  <>
                    <div
                      className="dark:border-gray-700"
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        padding: "6px 12px",
                        borderBottom: "1px solid rgba(229,231,235,0.5)",
                      }}
                    >
                      <button
                        onClick={clearHistory}
                        className="dark:text-red-400 dark:hover:bg-red-900/20"
                        style={{
                          background: "none",
                          border: "none",
                          color: "#EF4444",
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          padding: "4px 8px",
                          borderRadius: 6,
                        }}
                      >
                        🗑️ {t.clearHistory}
                      </button>
                    </div>
                    {history.map((h) => (
                      <div
                        key={h.id}
                        onClick={() => {
                          const srcCode = LANGUAGES.find((l) => h.sourceLang?.includes(l.code.toUpperCase()))?.code;
                          const tgtCode = LANGUAGES.find((l) => h.targetLang?.includes(l.code.toUpperCase()))?.code;
                          if (srcCode) setSourceLang(srcCode);
                          if (tgtCode) setTargetLang(tgtCode);
                          setSourceText(h.sourceText);
                          setTranslatedResult(h.translatedText);
                        }}
                        className="dark:hover:bg-gray-700/50 dark:border-gray-700"
                        style={{
                          padding: "10px 14px",
                          borderBottom: "1px solid rgba(229,231,235,0.3)",
                          cursor: "pointer",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(20,184,166,0.04)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                          <span className="dark:text-gray-400" style={{ fontSize: 11, color: "#9CA3AF" }}>
                            {h.sourceLang} → {h.targetLang}
                          </span>
                          <span className="dark:text-gray-500" style={{ fontSize: 10, color: "#D1D5DB" }}>
                            {h.timestamp}
                          </span>
                        </div>
                        <div className="dark:text-gray-300" style={{ fontSize: 13, color: "#374151", lineHeight: 1.4 }}>
                          {h.sourceText}
                          {h.sourceText.length >= 80 && "..."}
                        </div>
                        <div className="dark:text-teal-400" style={{ fontSize: 13, color: "#0D9488", lineHeight: 1.4, marginTop: 2 }}>
                          → {h.translatedText}
                          {h.translatedText.length >= 80 && "..."}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* IMAGE TRANSLATION TAB */}
      {activeTab === "image" && (
        <div>
          {/* Language selectors (same as text tab) */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label className="dark:text-gray-400" style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 4, display: "block" }}>
                {t.sourceLang}
              </label>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1.5px solid rgba(209,213,219,0.6)",
                  fontSize: 14,
                  fontWeight: 500,
                  background: "#fff",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {isRTL ? l.nameAr : l.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSwapLangs}
              title={t.swap}
              className="dark:bg-gray-800 dark:border-gray-600 dark:text-teal-400"
              style={{
                marginTop: 18,
                width: 42,
                height: 42,
                borderRadius: "50%",
                border: "1.5px solid rgba(20,184,166,0.3)",
                background: "rgba(20,184,166,0.08)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                transition: "all 0.2s",
                color: "#0D9488",
                flexShrink: 0,
              }}
            >
              ⇄
            </button>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label className="dark:text-gray-400" style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 4, display: "block" }}>
                {t.targetLang}
              </label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1.5px solid rgba(209,213,219,0.6)",
                  fontSize: 14,
                  fontWeight: 500,
                  background: "#fff",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {isRTL ? l.nameAr : l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Drop Zone */}
          {!imagePreview ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={
                dragOver
                  ? "dark:bg-teal-900/30 dark:border-teal-400"
                  : "dark:bg-gray-800/60 dark:border-gray-600 dark:hover:border-teal-500"
              }
              style={{
                border: `2px dashed ${dragOver ? "#14B8A6" : "rgba(209,213,219,0.6)"}`,
                borderRadius: 16,
                padding: "48px 24px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                background: dragOver ? "rgba(20,184,166,0.06)" : "rgba(249,250,251,0.5)",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageSelect(e.target.files?.[0])}
                style={{ display: "none" }}
              />
              <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.7 }}>📸</div>
              <p className="dark:text-gray-300" style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 600, color: "#374151" }}>
                {t.dropImage}
              </p>
              <p className="dark:text-gray-500" style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>
                {t.dropImageHint}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="dark:bg-teal-500/20 dark:text-teal-300"
                style={{
                  marginTop: 16,
                  padding: "8px 20px",
                  borderRadius: 10,
                  border: "1.5px solid rgba(20,184,166,0.3)",
                  background: "rgba(20,184,166,0.1)",
                  color: "#0D9488",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                📂 {t.browseFiles}
              </button>
            </div>
          ) : (
            <div>
              {/* Image Preview */}
              <div
                className="dark:bg-gray-800/70 dark:border-gray-700"
                style={{
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "1.5px solid rgba(20,184,166,0.2)",
                  marginBottom: 14,
                  background: "#fff",
                }}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={imagePreview}
                    alt="Upload"
                    style={{
                      width: "100%",
                      maxHeight: 320,
                      objectFit: "contain",
                      display: "block",
                      background: "rgba(0,0,0,0.02)",
                    }}
                  />
                  <button
                    onClick={removeImage}
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      padding: "6px 12px",
                      borderRadius: 8,
                      border: "none",
                      background: "rgba(239,68,68,0.9)",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    ✕ {t.removeImage}
                  </button>
                </div>

                {/* OCR Progress Bar */}
                {ocrRunning && (
                  <div style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span className="dark:text-teal-400" style={{ fontSize: 13, fontWeight: 600, color: "#0D9488" }}>
                        {t.extracting}
                      </span>
                      <span className="dark:text-teal-300" style={{ fontSize: 13, fontWeight: 700, color: "#14B8A6" }}>
                        {ocrProgress}%
                      </span>
                    </div>
                    <div
                      className="dark:bg-gray-700"
                      style={{
                        height: 8,
                        borderRadius: 4,
                        background: "rgba(229,231,235,0.5)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${ocrProgress}%`,
                          borderRadius: 4,
                          background: "linear-gradient(90deg, #14B8A6, #06B6D4)",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Translate in Image Button — shown right after OCR completes */}
              {ocrLines.length > 0 && !ocrRunning && (
                <button
                  onClick={handleTranslateInImage}
                  disabled={imageTranslating}
                  className="dark:from-teal-600 dark:to-cyan-600"
                  style={{
                    width: "100%",
                    marginBottom: 14,
                    padding: "14px 24px",
                    borderRadius: 12,
                    border: "none",
                    background: imageTranslating
                      ? "linear-gradient(135deg, rgba(20,184,166,0.5), rgba(6,182,212,0.5))"
                      : "linear-gradient(135deg, #0D9488, #0891B2)",
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: imageTranslating ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                    letterSpacing: "0.3px",
                    boxShadow: imageTranslating ? "none" : "0 4px 16px rgba(20,184,166,0.35)",
                  }}
                >
                  {imageTranslating ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <span
                        className="animate-spin"
                        style={{
                          display: "inline-block",
                          width: 16,
                          height: 16,
                          border: "2px solid #fff",
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                        }}
                      />
                      {t.translatingImage} {imageTranslateProgress.done}/{imageTranslateProgress.total} {t.linesProgress}
                    </span>
                  ) : (
                    `🖼️ ${t.translateInImage}`
                  )}
                </button>
              )}

              {/* Translated Image Preview */}
              {translatedImage && (
                <div
                  className="dark:bg-gray-800/70 dark:border-gray-700"
                  style={{
                    borderRadius: 14,
                    border: "1.5px solid rgba(20,184,166,0.25)",
                    overflow: "hidden",
                    background: "rgba(20,184,166,0.02)",
                    marginBottom: 14,
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div
                    className="dark:border-gray-700 dark:bg-teal-900/20"
                    style={{
                      padding: "10px 16px",
                      borderBottom: "1px solid rgba(20,184,166,0.15)",
                      background: "rgba(20,184,166,0.04)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span className="dark:text-teal-300" style={{ fontSize: 13, fontWeight: 650, color: "#0D9488" }}>
                      🖼️ {t.translatedPreview}
                    </span>
                    <span className="dark:text-gray-500" style={{ fontSize: 11, color: "#9CA3AF" }}>
                      {t.translated}
                    </span>
                  </div>
                  <div style={{ padding: 8 }}>
                    <img
                      src={translatedImage}
                      alt={t.translatedPreview}
                      style={{
                        width: "100%",
                        maxHeight: 500,
                        objectFit: "contain",
                        borderRadius: 10,
                        display: "block",
                      }}
                    />
                  </div>
                  <div
                    className="dark:border-gray-700 dark:bg-gray-800"
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 8,
                      padding: "8px 14px",
                      borderTop: "1px solid rgba(20,184,166,0.15)",
                      background: "rgba(20,184,166,0.03)",
                    }}
                  >
                    <button
                      onClick={() => handleCopy(translatedImage)}
                      className="dark:text-teal-400 dark:hover:bg-teal-900/30"
                      style={{
                        padding: "6px 14px",
                        borderRadius: 8,
                        border: "none",
                        background: "rgba(20,184,166,0.08)",
                        color: "#0D9488",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {copySuccess ? `✓ ${t.copied}` : `📋 ${t.copy}`}
                    </button>
                    <button
                      onClick={handleDownloadImage}
                      className="dark:from-teal-600 dark:to-cyan-600"
                      style={{
                        padding: "6px 18px",
                        borderRadius: 8,
                        border: "none",
                        background: "linear-gradient(135deg, #14B8A6, #06B6D4)",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(20,184,166,0.25)",
                      }}
                    >
                      ⬇️ {t.downloadImage}
                    </button>
                  </div>
                </div>
              )}

              {/* Extracted Text */}
              {extractedText && (
                <div
                  className="dark:bg-gray-800/70 dark:border-gray-700"
                  style={{
                    borderRadius: 14,
                    border: "1.5px solid rgba(20,184,166,0.2)",
                    overflow: "hidden",
                    background: "#fff",
                    marginBottom: 14,
                  }}
                >
                  <div
                    className="dark:border-gray-700 dark:bg-teal-900/20"
                    style={{
                      padding: "10px 16px",
                      borderBottom: "1px solid rgba(20,184,166,0.15)",
                      background: "rgba(20,184,166,0.04)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span className="dark:text-teal-300" style={{ fontSize: 13, fontWeight: 650, color: "#0D9488" }}>
                      📄 {t.extractedText}
                    </span>
                    <span className="dark:text-gray-500" style={{ fontSize: 11, color: "#9CA3AF" }}>
                      {t.editExtracted}
                    </span>
                  </div>
                  <textarea
                    dir={isSourceRTL ? "rtl" : "ltr"}
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    className="dark:bg-gray-800/70 dark:text-gray-100"
                    style={{
                      width: "100%",
                      minHeight: 120,
                      padding: "14px 16px",
                      border: "none",
                      outline: "none",
                      fontSize: 14,
                      lineHeight: 1.7,
                      resize: "vertical",
                      fontFamily: "inherit",
                      background: "transparent",
                    }}
                  />
                  <div style={{ padding: "8px 14px", display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button
                      onClick={() => handleCopy(extractedText)}
                      className="dark:text-gray-400 dark:hover:bg-gray-700"
                      style={{
                        padding: "6px 14px",
                        borderRadius: 8,
                        border: "none",
                        background: "rgba(20,184,166,0.08)",
                        color: "#0D9488",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      📋 {t.copy}
                    </button>
                    <button
                      onClick={handleTranslateExtracted}
                      className="dark:from-teal-600 dark:to-cyan-600"
                      style={{
                        padding: "6px 18px",
                        borderRadius: 8,
                        border: "none",
                        background: "linear-gradient(135deg, #14B8A6, #06B6D4)",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(20,184,166,0.25)",
                      }}
                    >
                      🌐 {t.translateExtracted}
                    </button>
                  </div>
                </div>
              )}

              {/* Translated result for image tab */}
              {translatedResult && activeTab === "image" && (
                <div
                  className="dark:bg-gray-800/70 dark:border-gray-700"
                  style={{
                    borderRadius: 14,
                    border: "1.5px solid rgba(20,184,166,0.25)",
                    overflow: "hidden",
                    background: "rgba(20,184,166,0.02)",
                  }}
                >
                  <div
                    dir={isTargetRTL ? "rtl" : "ltr"}
                    className="dark:text-gray-200"
                    style={{
                      padding: "14px 16px",
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: "#1F2937",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      minHeight: 80,
                    }}
                  >
                    {translatedResult}
                  </div>
                  <div
                    className="dark:border-gray-700 dark:bg-gray-800"
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 4,
                      padding: "8px 14px",
                      borderTop: "1px solid rgba(20,184,166,0.15)",
                      background: "rgba(20,184,166,0.03)",
                    }}
                  >
                    <button
                      onClick={() => speakText(translatedResult, targetLang)}
                      className="dark:text-teal-400"
                      style={{
                        padding: "4px 10px",
                        borderRadius: 8,
                        border: "none",
                        background: "rgba(20,184,166,0.1)",
                        color: "#0D9488",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      🔊 {t.speak}
                    </button>
                    <button
                      onClick={() => handleCopy(translatedResult)}
                      className="dark:text-teal-400"
                      style={{
                        padding: "4px 10px",
                        borderRadius: 8,
                        border: "none",
                        background: "rgba(20,184,166,0.1)",
                        color: "#0D9488",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {copySuccess ? `✓ ${t.copied}` : `📋 ${t.copy}`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div
              className="dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
              style={{
                marginTop: 12,
                padding: "10px 14px",
                borderRadius: 10,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#DC2626",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="dark:text-gray-600" style={{ textAlign: "center", marginTop: 24, paddingBottom: 16, fontSize: 11, color: "#D1D5DB" }}>
        {t.poweredBy}
      </div>
    </div>
  );
}
