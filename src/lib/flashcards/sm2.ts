/**
 * SM-2 Spaced Repetition Algorithm
 * Quality ratings: 0-5
 * 0 - Complete blackout
 * 1 - Incorrect, but upon seeing the answer, remembered
 * 2 - Incorrect, but the answer seemed easy to recall
 * 3 - Correct with serious difficulty
 * 4 - Correct with some hesitation
 * 5 - Perfect response
 */

export interface SM2Result {
  easeFactor: number;
  interval: number; // days
  repetitions: number;
  nextReview: Date;
}

export function calculateSM2(
  quality: number,
  previousEaseFactor: number,
  previousInterval: number,
  previousRepetitions: number,
): SM2Result {
  // Clamp quality to 0-5
  const q = Math.max(0, Math.min(5, Math.round(quality)));

  let easeFactor = previousEaseFactor;
  let interval: number;
  let repetitions: number;

  if (q < 3) {
    // Failed: reset repetitions and interval
    repetitions = 0;
    interval = 1;
  } else {
    // Passed
    repetitions = previousRepetitions + 1;

    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(previousInterval * easeFactor);
    }
  }

  // Update ease factor: EF' = EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));

  // EF must be at least 1.3
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    easeFactor: Math.round(easeFactor * 100) / 100,
    interval,
    repetitions,
    nextReview,
  };
}
