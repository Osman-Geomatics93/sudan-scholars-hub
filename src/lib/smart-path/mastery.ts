import { prisma } from '@/lib/prisma';

interface MasterySignal {
  weight: number;
  value: number; // 0-100
  hasData: boolean;
}

function computeWeightedMastery(signals: MasterySignal[]): number {
  const withData = signals.filter((s) => s.hasData);
  if (withData.length === 0) return 0;

  const totalWeight = withData.reduce((sum, s) => sum + s.weight, 0);
  const weighted = withData.reduce((sum, s) => sum + (s.weight / totalWeight) * s.value, 0);
  return Math.round(Math.min(100, Math.max(0, weighted)) * 10) / 10;
}

export async function recalculateMastery(userId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // 1. Study sessions aggregated by subject (last 30 days)
  const sessions = await prisma.studySession.findMany({
    where: { userId, date: { gte: thirtyDaysAgo } },
    select: { subject: true, duration: true },
  });

  const studyBySubject: Record<string, number> = {};
  for (const s of sessions) {
    studyBySubject[s.subject] = (studyBySubject[s.subject] || 0) + s.duration;
  }

  // 2. Flashcard performance by deck subject
  const decks = await prisma.flashcardDeck.findMany({
    where: { userId },
    select: {
      subject: true,
      cards: {
        select: {
          reviews: {
            where: { userId },
            select: { quality: true },
            orderBy: { createdAt: 'desc' },
            take: 50,
          },
        },
      },
    },
  });

  const flashcardBySubject: Record<string, { total: number; count: number }> = {};
  for (const deck of decks) {
    const subject = deck.subject || 'General';
    if (!flashcardBySubject[subject]) {
      flashcardBySubject[subject] = { total: 0, count: 0 };
    }
    for (const card of deck.cards) {
      for (const review of card.reviews) {
        flashcardBySubject[subject].total += review.quality;
        flashcardBySubject[subject].count += 1;
      }
    }
  }

  // 3. Path completion by subject
  const activePaths = await prisma.smartStudyPath.findMany({
    where: { userId },
    select: {
      days: {
        select: { subject: true, status: true },
      },
    },
  });

  const pathBySubject: Record<string, { completed: number; total: number }> = {};
  for (const path of activePaths) {
    for (const day of path.days) {
      if (!pathBySubject[day.subject]) {
        pathBySubject[day.subject] = { completed: 0, total: 0 };
      }
      pathBySubject[day.subject].total += 1;
      if (day.status === 'completed') {
        pathBySubject[day.subject].completed += 1;
      }
    }
  }

  // Collect all subjects
  const allSubjects = new Set<string>([
    ...Object.keys(studyBySubject),
    ...Object.keys(flashcardBySubject),
    ...Object.keys(pathBySubject),
  ]);

  const results = [];

  for (const subject of allSubjects) {
    const studyMin = studyBySubject[subject] || 0;
    const flashcard = flashcardBySubject[subject];
    const pathData = pathBySubject[subject];

    const studyTimeSignal: MasterySignal = {
      weight: 30,
      value: Math.min(1, studyMin / 300) * 100,
      hasData: studyMin > 0,
    };

    const flashcardSignal: MasterySignal = {
      weight: 40,
      value: flashcard ? (flashcard.total / flashcard.count / 5) * 100 : 0,
      hasData: !!flashcard && flashcard.count > 0,
    };

    const pathSignal: MasterySignal = {
      weight: 30,
      value: pathData ? (pathData.completed / pathData.total) * 100 : 0,
      hasData: !!pathData && pathData.total > 0,
    };

    const masteryPct = computeWeightedMastery([studyTimeSignal, flashcardSignal, pathSignal]);

    const record = await prisma.topicMastery.upsert({
      where: {
        userId_subject_topic: { userId, subject, topic: subject },
      },
      create: {
        userId,
        subject,
        topic: subject,
        masteryPct,
        totalStudyMin: studyMin,
        sessionCount: sessions.filter((s) => s.subject === subject).length,
        avgFlashcardQ: flashcard && flashcard.count > 0 ? flashcard.total / flashcard.count : 0,
      },
      update: {
        masteryPct,
        totalStudyMin: studyMin,
        sessionCount: sessions.filter((s) => s.subject === subject).length,
        avgFlashcardQ: flashcard && flashcard.count > 0 ? flashcard.total / flashcard.count : 0,
      },
    });

    results.push(record);
  }

  return results;
}
