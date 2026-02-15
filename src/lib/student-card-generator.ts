import QRCode from 'qrcode';

// ─── Interface (privacy-first) ──────────────────────────────────

export interface StudentCardData {
  name: string;
  studentNumber: string;
  educationLevel: string | null;
  fieldOfStudy: string | null;
  image: string | null;
  createdAt: string;
  badge: string | null;
  points: number;
  verifyUrl: string;    // Signed verification URL for QR
  locale: string;       // 'en' | 'ar' for RTL support
  // REMOVED: email, location — privacy sensitive
}

// ─── Constants ──────────────────────────────────────────────────

const CARD_WIDTH = 1012;
const CARD_HEIGHT = 638;

// Design tokens — "Modern Digital Credential"
const PRIMARY_DARK = '#0A4D68';
const PRIMARY_MID = '#088395';
const PRIMARY_LIGHT = '#05BFDB';
const ACCENT_GOLD = '#D4A017';
const ACCENT_CYAN = '#7DD3FC';
const STATUS_ACTIVE = '#22C55E';
const STATUS_EXPIRED = '#EF4444';
const GLASS_FILL = 'rgba(255,255,255,0.08)';
const GLASS_BORDER = 'rgba(255,255,255,0.18)';

// ─── Label maps ─────────────────────────────────────────────────

const EDUCATION_LABELS: Record<string, { en: string; ar: string }> = {
  HIGH_SCHOOL: { en: 'High School', ar: 'ثانوية' },
  BACHELOR: { en: "Bachelor's", ar: 'بكالوريوس' },
  MASTER: { en: "Master's", ar: 'ماجستير' },
  PHD: { en: 'PhD', ar: 'دكتوراه' },
};

const FIELD_LABELS: Record<string, { en: string; ar: string }> = {
  ENGINEERING: { en: 'Engineering', ar: 'هندسة' },
  MEDICINE: { en: 'Medicine', ar: 'طب' },
  BUSINESS: { en: 'Business', ar: 'أعمال' },
  ARTS: { en: 'Arts', ar: 'فنون' },
  SCIENCE: { en: 'Science', ar: 'علوم' },
  LAW: { en: 'Law', ar: 'قانون' },
  EDUCATION: { en: 'Education', ar: 'تربية' },
  TECHNOLOGY: { en: 'Technology', ar: 'تكنولوجيا' },
};

const BADGE_INFO: Record<string, { icon: string; label: { en: string; ar: string } }> = {
  newcomer: { icon: '🌱', label: { en: 'Newcomer', ar: 'مبتدئ' } },
  contributor: { icon: '📝', label: { en: 'Contributor', ar: 'مساهم' } },
  scholar: { icon: '🎓', label: { en: 'Scholar', ar: 'دارس' } },
  expert: { icon: '⭐', label: { en: 'Expert', ar: 'خبير' } },
  legend: { icon: '🏆', label: { en: 'Legend', ar: 'أسطورة' } },
};

const TIER_MAP: Record<string, { en: string; ar: string }> = {
  newcomer: { en: 'Student', ar: 'طالب' },
  contributor: { en: 'Contributor', ar: 'مساهم' },
  scholar: { en: 'Verified', ar: 'موثق' },
  expert: { en: 'Verified', ar: 'موثق' },
  legend: { en: 'Alumni', ar: 'خريج' },
};

// ─── Utility helpers ────────────────────────────────────────────

/** Mask student number: "SSH-2025-00042" → "SSH-****-0042" */
function maskStudentNumber(sn: string): string {
  // Format: SSH-YYYY-NNNNN → SSH-****-last4
  const parts = sn.split('-');
  if (parts.length === 3) {
    const lastDigits = parts[2].slice(-4);
    return `${parts[0]}-****-${lastDigits}`;
  }
  // Fallback: mask all but last 4
  if (sn.length > 4) {
    return '****' + sn.slice(-4);
  }
  return sn;
}

/** Get membership tier from badge key */
function getMembershipTier(badge: string | null): { en: string; ar: string } {
  return TIER_MAP[badge || 'newcomer'] || TIER_MAP.newcomer;
}

/** Compute membership status from creation date (1 year validity) */
function getMembershipStatus(createdAt: string): 'ACTIVE' | 'EXPIRED' {
  const expiry = new Date(createdAt);
  expiry.setFullYear(expiry.getFullYear() + 1);
  return expiry > new Date() ? 'ACTIVE' : 'EXPIRED';
}

/** Truncate text with ellipsis to fit within maxWidth */
function truncateText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 0 && ctx.measureText(truncated + '...').width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + '...';
}

// ─── Canvas drawing helpers ─────────────────────────────────────

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawGraduationCap(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(x, y - size * 0.3);
  ctx.lineTo(x + size * 0.5, y);
  ctx.lineTo(x, y + size * 0.15);
  ctx.lineTo(x - size * 0.5, y);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(x - size * 0.35, y + size * 0.05);
  ctx.lineTo(x - size * 0.35, y + size * 0.35);
  ctx.quadraticCurveTo(x, y + size * 0.55, x + size * 0.35, y + size * 0.35);
  ctx.lineTo(x + size * 0.35, y + size * 0.05);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + size * 0.5, y);
  ctx.lineTo(x + size * 0.5, y + size * 0.45);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + size * 0.5, y + size * 0.48, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawDefaultAvatar(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#e2e8f0';
  ctx.fill();

  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.arc(cx, cy - radius * 0.15, radius * 0.32, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(cx, cy + radius * 0.55, radius * 0.5, radius * 0.38, 0, Math.PI, 0, true);
  ctx.fill();
  ctx.restore();
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

function drawCardShadow(ctx: CanvasRenderingContext2D) {
  ctx.save();
  drawRoundedRect(ctx, 4, 4, CARD_WIDTH, CARD_HEIGHT, 26);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fill();
  ctx.restore();
}

function drawGlassPanel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  ctx.save();
  drawRoundedRect(ctx, x, y, w, h, radius);
  ctx.fillStyle = GLASS_FILL;
  ctx.fill();
  ctx.strokeStyle = GLASS_BORDER;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

function drawHolographicOverlay(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number
) {
  ctx.save();
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  grad.addColorStop(0, 'rgba(255, 0, 0, 0.06)');
  grad.addColorStop(0.2, 'rgba(255, 165, 0, 0.05)');
  grad.addColorStop(0.4, 'rgba(255, 255, 0, 0.04)');
  grad.addColorStop(0.6, 'rgba(0, 255, 0, 0.05)');
  grad.addColorStop(0.8, 'rgba(0, 100, 255, 0.06)');
  grad.addColorStop(1, 'rgba(128, 0, 255, 0.04)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBarcode(
  ctx: CanvasRenderingContext2D,
  studentNumber: string,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.save();
  const chars = studentNumber.replace(/[^a-zA-Z0-9]/g, '') || 'DEFAULT';
  let posX = x;
  let charIdx = 0;
  while (posX < x + w) {
    const code = chars.charCodeAt(charIdx % chars.length);
    const barW = 1 + (code % 4);
    const gap = 1 + (code % 3);
    const alpha = 0.12 + (code % 40) / 200;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillRect(posX, y, barW, h);
    posX += barW + gap;
    charIdx++;
  }
  ctx.restore();
}

/** Draw shield / trust-mark icon (canvas path) */
function drawShieldIcon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  ctx.save();
  ctx.translate(x, y);
  const s = size / 24; // normalize to 24-unit grid

  ctx.beginPath();
  ctx.moveTo(12 * s, 1 * s);
  ctx.lineTo(3 * s, 5 * s);
  ctx.lineTo(3 * s, 12 * s);
  ctx.quadraticCurveTo(3 * s, 19 * s, 12 * s, 23 * s);
  ctx.quadraticCurveTo(21 * s, 19 * s, 21 * s, 12 * s);
  ctx.lineTo(21 * s, 5 * s);
  ctx.closePath();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Checkmark inside shield
  ctx.beginPath();
  ctx.moveTo(8 * s, 12 * s);
  ctx.lineTo(11 * s, 15 * s);
  ctx.lineTo(16 * s, 9 * s);
  ctx.strokeStyle = ACCENT_CYAN;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.restore();
}

/** Draw status badge pill (ACTIVE / EXPIRED) */
function drawStatusBadge(
  ctx: CanvasRenderingContext2D,
  status: 'ACTIVE' | 'EXPIRED',
  cx: number,
  cy: number,
  locale: string
) {
  const isActive = status === 'ACTIVE';
  const label = isActive
    ? (locale === 'ar' ? 'نشط' : 'ACTIVE')
    : (locale === 'ar' ? 'منتهي' : 'EXPIRED');
  const bgColor = isActive ? STATUS_ACTIVE : STATUS_EXPIRED;

  ctx.save();
  ctx.font = 'bold 11px "Inter", "Segoe UI", Arial, sans-serif';
  const textWidth = ctx.measureText(label).width;
  const pillW = textWidth + 20;
  const pillH = 22;
  const pillX = cx - pillW / 2;
  const pillY = cy - pillH / 2;

  // Pill background
  drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 11);
  ctx.fillStyle = bgColor;
  ctx.globalAlpha = 0.9;
  ctx.fill();
  ctx.globalAlpha = 1;

  // Pill text
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, cx, cy);
  ctx.restore();
}

/** Draw tier chip next to name */
function drawTierChip(
  ctx: CanvasRenderingContext2D,
  tier: string,
  x: number,
  y: number
) {
  ctx.save();
  ctx.font = '12px "Inter", "Segoe UI", Arial, sans-serif';
  const textWidth = ctx.measureText(tier).width;
  const chipW = textWidth + 16;
  const chipH = 20;

  drawRoundedRect(ctx, x, y - chipH / 2 - 2, chipW, chipH, 10);
  ctx.fillStyle = GLASS_FILL;
  ctx.fill();
  ctx.strokeStyle = GLASS_BORDER;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = ACCENT_CYAN;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(tier, x + 8, y - 2);
  ctx.restore();
}

// ─── Main generation function ───────────────────────────────────

export async function generateStudentCardBlob(data: StudentCardData): Promise<Blob> {
  // Wait for custom fonts to be ready (Cairo for Arabic)
  if (typeof document !== 'undefined' && document.fonts) {
    await document.fonts.ready;
  }

  const isRTL = data.locale === 'ar';
  const lang = isRTL ? 'ar' : 'en';

  // Font families — Cairo for Arabic, Inter for English, monospace always LTR
  const fontFamily = isRTL
    ? '"Cairo", "Segoe UI", Arial, sans-serif'
    : '"Inter", "Segoe UI", Arial, sans-serif';
  const monoFont = '"Consolas", "Courier New", monospace';

  const canvas = document.createElement('canvas');
  canvas.width = CARD_WIDTH + 8;
  canvas.height = CARD_HEIGHT + 8;
  const ctx = canvas.getContext('2d')!;

  // === Outer card shadow ===
  drawCardShadow(ctx);
  ctx.translate(2, 2);

  // === Background gradient (new palette) ===
  const bgGrad = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
  bgGrad.addColorStop(0, PRIMARY_DARK);
  bgGrad.addColorStop(0.5, PRIMARY_MID);
  bgGrad.addColorStop(1, PRIMARY_LIGHT);
  drawRoundedRect(ctx, 0, 0, CARD_WIDTH, CARD_HEIGHT, 24);
  ctx.fillStyle = bgGrad;
  ctx.fill();

  // Subtle diagonal pattern overlay
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  for (let i = -CARD_HEIGHT; i < CARD_WIDTH + CARD_HEIGHT; i += 20) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + CARD_HEIGHT, CARD_HEIGHT);
    ctx.stroke();
  }
  ctx.restore();

  // === Holographic security foil ===
  drawHolographicOverlay(ctx, CARD_WIDTH - 140, 140, 200);

  // === Top banner ===
  ctx.save();
  drawRoundedRect(ctx, 0, 0, CARD_WIDTH, 90, 24);
  ctx.rect(0, 45, CARD_WIDTH, 45);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fill();
  ctx.restore();

  // Banner depth shadow
  ctx.save();
  const bannerShadow = ctx.createLinearGradient(0, 80, 0, 90);
  bannerShadow.addColorStop(0, 'rgba(0, 0, 0, 0.12)');
  bannerShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = bannerShadow;
  ctx.fillRect(0, 80, CARD_WIDTH, 10);
  ctx.restore();

  // Gold accent line below banner
  ctx.save();
  ctx.fillStyle = ACCENT_GOLD;
  ctx.fillRect(0, 90, CARD_WIDTH, 2);
  ctx.restore();

  // Graduation cap icon (left side of banner)
  drawGraduationCap(ctx, 55, 38, 32);

  // Title text
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold 26px ${fontFamily}`;
  ctx.textAlign = 'left';
  ctx.fillText('SUDANESE STUDY HUB', 90, 45);

  // Subtitle
  ctx.font = `14px ${fontFamily}`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillText(
    isRTL ? 'بطاقة هوية الطالب' : 'STUDENT IDENTITY CARD',
    90,
    70
  );

  // Shield icon in top-right of banner
  drawShieldIcon(ctx, CARD_WIDTH - 60, 20, 40);

  // === Glassmorphism info panel ===
  drawGlassPanel(ctx, 185, 104, 640, 424, 16);

  // === User photo (left side) — enhanced double-ring frame ===
  const photoX = 100;
  const photoY = 220;
  const photoRadius = 65;

  // Drop shadow
  ctx.save();
  ctx.beginPath();
  ctx.arc(photoX + 2, photoY + 3, photoRadius + 6, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fill();
  ctx.restore();

  // Outer gradient ring
  ctx.save();
  const ringGrad = ctx.createLinearGradient(
    photoX - photoRadius,
    photoY - photoRadius,
    photoX + photoRadius,
    photoY + photoRadius
  );
  ringGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  ringGrad.addColorStop(1, `${PRIMARY_LIGHT}E6`);
  ctx.beginPath();
  ctx.arc(photoX, photoY, photoRadius + 6, 0, Math.PI * 2);
  ctx.fillStyle = ringGrad;
  ctx.fill();
  ctx.restore();

  // Inner white border
  ctx.save();
  ctx.beginPath();
  ctx.arc(photoX, photoY, photoRadius + 2, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.restore();

  // Draw photo or default avatar
  ctx.save();
  ctx.beginPath();
  ctx.arc(photoX, photoY, photoRadius, 0, Math.PI * 2);
  ctx.clip();
  if (data.image) {
    try {
      const img = await loadImage(data.image);
      ctx.drawImage(
        img,
        photoX - photoRadius,
        photoY - photoRadius,
        photoRadius * 2,
        photoRadius * 2
      );
    } catch {
      drawDefaultAvatar(ctx, photoX, photoY, photoRadius);
    }
  } else {
    drawDefaultAvatar(ctx, photoX, photoY, photoRadius);
  }
  ctx.restore();

  // === Badge + Status below photo ===
  const badgeKey = data.badge || 'newcomer';
  const badgeData = BADGE_INFO[badgeKey] || BADGE_INFO.newcomer;
  const status = getMembershipStatus(data.createdAt);

  // Badge icon
  ctx.textAlign = 'center';
  ctx.font = '28px Arial';
  ctx.fillText(badgeData.icon, photoX, 310);

  // Badge label
  ctx.font = `bold 12px ${fontFamily}`;
  ctx.fillStyle = ACCENT_CYAN;
  ctx.fillText(badgeData.label[lang], photoX, 328);

  // Points
  ctx.font = `11px ${fontFamily}`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText(`${data.points} pts`, photoX, 344);

  // Status badge
  drawStatusBadge(ctx, status, photoX, 370, data.locale);

  // === Right-side info ===
  const infoX = 205;
  let infoY = 138;

  // Name (bold, most prominent)
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold 28px ${fontFamily}`;
  ctx.textAlign = 'left';
  const displayName = truncateText(ctx, data.name || (isRTL ? 'طالب' : 'Student'), 380);
  ctx.fillText(displayName, infoX, infoY);

  // Tier chip next to name
  const nameWidth = ctx.measureText(displayName).width;
  const tier = getMembershipTier(data.badge);
  drawTierChip(ctx, tier[lang], infoX + nameWidth + 12, infoY);

  infoY += 32;

  // Masked student number with highlight background
  const maskedSN = maskStudentNumber(data.studentNumber);
  ctx.font = `600 20px ${monoFont}`;
  const snMetrics = ctx.measureText(maskedSN);
  drawRoundedRect(ctx, infoX - 10, infoY - 18, snMetrics.width + 20, 28, 6);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fill();
  ctx.fillStyle = ACCENT_CYAN;
  ctx.fillText(maskedSN, infoX, infoY);
  infoY += 36;

  // Education (level + field combined)
  const eduLabel = data.educationLevel
    ? (EDUCATION_LABELS[data.educationLevel]?.[lang] || data.educationLevel)
    : (isRTL ? 'غير محدد' : 'Not specified');
  const fieldLabel = data.fieldOfStudy
    ? (FIELD_LABELS[data.fieldOfStudy]?.[lang] || data.fieldOfStudy)
    : null;
  const educationDisplay = fieldLabel ? `${eduLabel} - ${fieldLabel}` : eduLabel;

  ctx.font = `13px ${fontFamily}`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText(isRTL ? 'التعليم' : 'EDUCATION', infoX, infoY);
  infoY += 20;
  ctx.fillStyle = '#ffffff';
  ctx.font = `17px ${fontFamily}`;
  ctx.fillText(truncateText(ctx, educationDisplay, 400), infoX, infoY);
  infoY += 34;

  // Member since
  const memberSince = new Date(data.createdAt).toLocaleDateString(
    isRTL ? 'ar-SA' : 'en-US',
    { month: 'long', year: 'numeric' }
  );
  ctx.font = `13px ${fontFamily}`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText(isRTL ? 'عضو منذ' : 'MEMBER SINCE', infoX, infoY);
  infoY += 20;
  ctx.fillStyle = '#ffffff';
  ctx.font = `17px ${fontFamily}`;
  ctx.fillText(memberSince, infoX, infoY);

  // === Validity dates row (bottom of glass panel) ===
  const issuedDate = new Date(data.createdAt);
  const validUntil = new Date(issuedDate);
  validUntil.setFullYear(validUntil.getFullYear() + 1);
  const fmtShort = (d: Date) =>
    d.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', { month: 'short', year: 'numeric' });

  ctx.font = `12px ${fontFamily}`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  const validityY = 510;
  ctx.textAlign = 'left';
  ctx.fillText(
    `${isRTL ? 'الإصدار:' : 'Issued:'} ${fmtShort(issuedDate)}`,
    205,
    validityY
  );
  ctx.fillText(
    `${isRTL ? 'صالحة حتى:' : 'Expires:'} ${fmtShort(validUntil)}`,
    400,
    validityY
  );

  // === QR Code (right side — encodes verifyUrl) ===
  try {
    const qrDataUrl = await QRCode.toDataURL(data.verifyUrl, {
      width: 120,
      margin: 1,
      color: { dark: PRIMARY_DARK, light: '#ffffff' },
    });
    const qrImg = await loadImage(qrDataUrl);
    const qrSize = 120;
    const qrX = 870;
    const qrY = 140;

    // QR white background
    drawRoundedRect(ctx, qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 10);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

    // "Scan to verify" label below QR
    ctx.textAlign = 'center';
    ctx.font = `10px ${fontFamily}`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(
      isRTL ? 'امسح للتحقق' : 'Scan to verify',
      qrX + qrSize / 2,
      qrY + qrSize + 22
    );
  } catch {
    // QR generation failed — skip silently
  }

  // === Bottom decorative barcode strip ===
  ctx.save();
  const barcodeY = CARD_HEIGHT - 80;
  const stripeBg = ctx.createLinearGradient(0, barcodeY, CARD_WIDTH, barcodeY);
  stripeBg.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
  stripeBg.addColorStop(0.5, 'rgba(255, 255, 255, 0.08)');
  stripeBg.addColorStop(1, 'rgba(255, 255, 255, 0.04)');
  ctx.fillStyle = stripeBg;
  drawRoundedRect(ctx, 0, barcodeY, CARD_WIDTH, 80, 24);
  ctx.rect(0, barcodeY, CARD_WIDTH, 40);
  ctx.fill();
  ctx.restore();

  drawBarcode(ctx, data.studentNumber, 30, barcodeY + 8, CARD_WIDTH * 0.55, 30);

  // Website in bottom center
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = `12px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.fillText('sudanscholarhub.com', CARD_WIDTH / 2, CARD_HEIGHT - 18);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to generate card image'));
      },
      'image/png',
      1.0
    );
  });
}

export async function downloadStudentCard(data: StudentCardData): Promise<void> {
  const blob = await generateStudentCardBlob(data);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  // Use only last 4 digits in filename — no full ID
  a.download = `ssh-card-${data.studentNumber.slice(-4)}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
