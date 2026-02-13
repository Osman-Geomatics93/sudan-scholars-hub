import { prisma } from '@/lib/prisma';

export const POINT_VALUES = {
  UPLOAD_APPROVED: 10,
  REVIEW_POSTED: 3,
  HIGH_RATING_RECEIVED: 5,
  REQUEST_FULFILLED: 15,
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
