// IELTS band score mapping: [minCorrect, band]
const IELTS_READING_ACADEMIC: [number, number][] = [
  [39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7],
  [27, 6.5], [23, 6], [19, 5.5], [15, 5], [13, 4.5],
  [10, 4], [8, 3.5], [6, 3], [4, 2.5], [3, 2], [0, 1],
];

const IELTS_READING_GENERAL: [number, number][] = [
  [40, 9], [39, 8.5], [37, 8], [36, 7.5], [34, 7],
  [32, 6.5], [30, 6], [27, 5.5], [23, 5], [19, 4.5],
  [15, 4], [12, 3.5], [9, 3], [6, 2.5], [4, 2], [0, 1],
];

const IELTS_LISTENING: [number, number][] = [
  [39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7],
  [26, 6.5], [23, 6], [18, 5.5], [16, 5], [13, 4.5],
  [11, 4], [8, 3.5], [6, 3], [4, 2.5], [3, 2], [0, 1],
];

export function calculateReadingScore(
  correct: number,
  total: number,
  examType: 'ielts' | 'toefl',
  isGeneral: boolean = false
): { score: number; maxScore: number; band?: number } {
  if (examType === 'toefl') {
    const scaled = Math.round((correct / total) * 30);
    return { score: scaled, maxScore: 30 };
  }

  const table = isGeneral ? IELTS_READING_GENERAL : IELTS_READING_ACADEMIC;
  const normalized = Math.round((correct / total) * 40);
  let band = 1;
  for (const [min, b] of table) {
    if (normalized >= min) { band = b; break; }
  }
  return { score: correct, maxScore: total, band };
}

export function calculateListeningScore(
  correct: number,
  total: number,
  examType: 'ielts' | 'toefl'
): { score: number; maxScore: number; band?: number } {
  if (examType === 'toefl') {
    const scaled = Math.round((correct / total) * 30);
    return { score: scaled, maxScore: 30 };
  }

  const normalized = Math.round((correct / total) * 40);
  let band = 1;
  for (const [min, b] of IELTS_LISTENING) {
    if (normalized >= min) { band = b; break; }
  }
  return { score: correct, maxScore: total, band };
}

export function calculateOverallBand(scores: number[]): number {
  if (scores.length === 0) return 0;
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return Math.round(avg * 2) / 2; // round to nearest 0.5
}

export function getBandDescription(band: number): { level: string; levelAr: string } {
  if (band >= 9) return { level: 'Expert User', levelAr: 'مستخدم خبير' };
  if (band >= 8) return { level: 'Very Good User', levelAr: 'مستخدم جيد جداً' };
  if (band >= 7) return { level: 'Good User', levelAr: 'مستخدم جيد' };
  if (band >= 6) return { level: 'Competent User', levelAr: 'مستخدم كفء' };
  if (band >= 5) return { level: 'Modest User', levelAr: 'مستخدم متواضع' };
  if (band >= 4) return { level: 'Limited User', levelAr: 'مستخدم محدود' };
  if (band >= 3) return { level: 'Extremely Limited User', levelAr: 'مستخدم محدود للغاية' };
  return { level: 'Beginner', levelAr: 'مبتدئ' };
}

export function getToeflDescription(score: number): { level: string; levelAr: string } {
  if (score >= 110) return { level: 'Advanced (C1-C2)', levelAr: 'متقدم' };
  if (score >= 87) return { level: 'Upper Intermediate (B2)', levelAr: 'فوق المتوسط' };
  if (score >= 57) return { level: 'Intermediate (B1)', levelAr: 'متوسط' };
  if (score >= 30) return { level: 'Basic (A2)', levelAr: 'أساسي' };
  return { level: 'Beginner (A1)', levelAr: 'مبتدئ' };
}

// SM-2 spaced repetition algorithm (same as flashcards)
export function sm2(
  quality: number,
  repetitions: number,
  easeFactor: number,
  interval: number
): { repetitions: number; easeFactor: number; interval: number } {
  let newEF = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEF < 1.3) newEF = 1.3;

  if (quality < 3) {
    return { repetitions: 0, easeFactor: newEF, interval: 1 };
  }

  let newInterval: number;
  if (repetitions === 0) {
    newInterval = 1;
  } else if (repetitions === 1) {
    newInterval = 6;
  } else {
    newInterval = Math.round(interval * newEF);
  }

  return { repetitions: repetitions + 1, easeFactor: newEF, interval: newInterval };
}
