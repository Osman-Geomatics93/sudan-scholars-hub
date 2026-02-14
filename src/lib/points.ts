import { prisma } from '@/lib/prisma';

export const POINT_VALUES = {
  UPLOAD_APPROVED: 10,
  REVIEW_POSTED: 3,
  HIGH_RATING_RECEIVED: 5,
  REQUEST_FULFILLED: 15,
  AI_CHAT_SESSION: 2,
  FLASHCARD_DECK_CREATED: 5,
  FLASHCARD_REVIEW_10: 3,
  FLASHCARD_DECK_SHARED: 5,
  STUDY_STREAK_7: 10,
  STUDY_STREAK_30: 25,
  DAILY_GOAL_MET: 2,
  STUDY_PATH_GENERATED: 5,
  STUDY_PATH_DAY_COMPLETED: 2,
  STUDY_PATH_COMPLETED: 15,
  ISLAND_LEVEL_UP: 3,
  BATTLE_WON: 5,
  BATTLE_PARTICIPATED: 2,
  QUESTION_BANK_10: 3,
} as const;

export const BADGE_THRESHOLDS = [
  { min: 0, key: 'newcomer', icon: '🌱', labelEn: 'Newcomer', labelAr: 'مبتدئ' },
  { min: 20, key: 'contributor', icon: '📝', labelEn: 'Contributor', labelAr: 'مساهم' },
  { min: 50, key: 'scholar', icon: '🎓', labelEn: 'Scholar', labelAr: 'باحث' },
  { min: 100, key: 'expert', icon: '⭐', labelEn: 'Expert', labelAr: 'خبير' },
  { min: 200, key: 'legend', icon: '🏆', labelEn: 'Legend', labelAr: 'أسطورة' },
] as const;

export function getBadgeForPoints(points: number) {
  let badge: (typeof BADGE_THRESHOLDS)[number] = BADGE_THRESHOLDS[0];
  for (const threshold of BADGE_THRESHOLDS) {
    if (points >= threshold.min) badge = threshold;
  }
  return badge;
}

export async function awardPoints(userId: string, amount: number) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { points: { increment: amount } },
    select: { points: true },
  });

  const badge = getBadgeForPoints(user.points);
  await prisma.user.update({
    where: { id: userId },
    data: { badge: badge.key },
  });

  return { newPoints: user.points, badge };
}

export async function recalculateAllPoints() {
  // Get all users
  const users = await prisma.user.findMany({ select: { id: true, points: true } });

  const results: { id: string; oldPoints: number; newPoints: number; badge: string }[] = [];

  for (const user of users) {
    // Count approved materials
    const approvedCount = await prisma.studyMaterial.count({
      where: { userId: user.id, status: 'APPROVED' },
    });

    // Count reviews posted
    const reviewCount = await prisma.materialReview.count({
      where: { userId: user.id },
    });

    // Count high ratings received on user's materials (from other users)
    const highRatingCount = await prisma.materialReview.count({
      where: {
        rating: { gte: 4 },
        material: { userId: user.id },
        NOT: { userId: user.id },
      },
    });

    // Count fulfilled requests
    const fulfilledCount = await prisma.materialRequest.count({
      where: { fulfilledBy: user.id, status: 'FULFILLED' },
    });

    const newPoints =
      approvedCount * POINT_VALUES.UPLOAD_APPROVED +
      reviewCount * POINT_VALUES.REVIEW_POSTED +
      highRatingCount * POINT_VALUES.HIGH_RATING_RECEIVED +
      fulfilledCount * POINT_VALUES.REQUEST_FULFILLED;

    if (newPoints !== user.points) {
      const badge = getBadgeForPoints(newPoints);
      await prisma.user.update({
        where: { id: user.id },
        data: { points: newPoints, badge: badge.key },
      });
      results.push({ id: user.id, oldPoints: user.points, newPoints, badge: badge.key });
    }
  }

  return results;
}

export async function deductPoints(userId: string, amount: number) {
  const current = await prisma.user.findUnique({
    where: { id: userId },
    select: { points: true },
  });
  const newPoints = Math.max(0, (current?.points || 0) - amount);

  const badge = getBadgeForPoints(newPoints);
  await prisma.user.update({
    where: { id: userId },
    data: { points: newPoints, badge: badge.key },
  });

  return { newPoints, badge };
}
