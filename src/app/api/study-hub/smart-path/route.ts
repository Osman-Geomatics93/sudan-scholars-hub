import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { generatePathSchema } from '@/lib/validations/smart-path';
import { generateStudyPath, UserStudyData } from '@/lib/smart-path/ai-generator';
import { recalculateMastery } from '@/lib/smart-path/mastery';
import { awardPoints, POINT_VALUES } from '@/lib/points';

export const dynamic = 'force-dynamic';

// GET - Fetch active study path with all days
export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;

    const path = await prisma.smartStudyPath.findFirst({
      where: { userId, status: 'active' },
      include: {
        days: { orderBy: { dayNumber: 'asc' } },
      },
    });

    return NextResponse.json({ path });
  } catch (err) {
    console.error('Error fetching smart path:', err);
    return NextResponse.json({ error: 'Failed to fetch study path' }, { status: 500 });
  }
}

// POST - Generate a new study path
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;
    const body = await request.json();
    const result = generatePathSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { durationDays, focusSubjects, language } = result.data;

    // Archive any existing active path
    await prisma.smartStudyPath.updateMany({
      where: { userId, status: 'active' },
      data: { status: 'archived' },
    });

    // Gather user data
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const [sessions, decks, exams, streak, goals, masteryRecords] = await Promise.all([
      prisma.studySession.findMany({
        where: { userId, date: { gte: ninetyDaysAgo } },
        select: { subject: true, duration: true },
      }),
      prisma.flashcardDeck.findMany({
        where: { userId },
        select: {
          subject: true,
          cards: {
            select: {
              reviews: {
                where: { userId },
                select: { quality: true },
                orderBy: { createdAt: 'desc' },
                take: 20,
              },
            },
          },
        },
      }),
      prisma.studyExam.findMany({
        where: { userId, date: { gte: new Date() } },
        select: { title: true, subject: true, date: true },
        orderBy: { date: 'asc' },
        take: 10,
      }),
      prisma.studyStreak.findUnique({
        where: { userId },
        select: { currentStreak: true },
      }),
      prisma.studyGoal.findMany({
        where: { userId, isActive: true },
        select: { type: true, targetMinutes: true },
      }),
      prisma.topicMastery.findMany({
        where: { userId },
        select: { subject: true, masteryPct: true },
      }),
    ]);

    // Aggregate sessions by subject
    const sessionsBySubject: Record<string, { totalMinutes: number; sessionCount: number }> = {};
    for (const s of sessions) {
      if (!sessionsBySubject[s.subject]) {
        sessionsBySubject[s.subject] = { totalMinutes: 0, sessionCount: 0 };
      }
      sessionsBySubject[s.subject].totalMinutes += s.duration;
      sessionsBySubject[s.subject].sessionCount += 1;
    }

    // Aggregate flashcard performance by subject
    const flashcardBySubject: Record<string, { totalQ: number; count: number; cards: number }> = {};
    for (const deck of decks) {
      const subject = deck.subject || 'General';
      if (!flashcardBySubject[subject]) {
        flashcardBySubject[subject] = { totalQ: 0, count: 0, cards: 0 };
      }
      for (const card of deck.cards) {
        flashcardBySubject[subject].cards += 1;
        for (const review of card.reviews) {
          flashcardBySubject[subject].totalQ += review.quality;
          flashcardBySubject[subject].count += 1;
        }
      }
    }

    const userData: UserStudyData = {
      sessions: Object.entries(sessionsBySubject).map(([subject, data]) => ({
        subject,
        totalMinutes: data.totalMinutes,
        sessionCount: data.sessionCount,
      })),
      flashcardPerformance: Object.entries(flashcardBySubject).map(([subject, data]) => ({
        subject,
        avgQuality: data.count > 0 ? data.totalQ / data.count : 0,
        cardCount: data.cards,
      })),
      upcomingExams: exams.map((e) => ({
        title: e.title,
        subject: e.subject,
        daysUntil: Math.ceil((e.date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      })),
      streak: streak?.currentStreak || 0,
      goals: goals.map((g) => ({ type: g.type, targetMinutes: g.targetMinutes })),
      masteryData: masteryRecords.map((m) => ({ subject: m.subject, masteryPct: m.masteryPct })),
    };

    // Generate AI study path
    const generated = await generateStudyPath(userData, durationDays, focusSubjects || [], language);

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays - 1);

    // Collect unique subjects
    const subjects = [...new Set(generated.days.map((d) => d.subject))];

    // Save to DB
    const newPath = await prisma.smartStudyPath.create({
      data: {
        userId,
        title: generated.title,
        status: 'active',
        totalDays: durationDays,
        startDate,
        endDate,
        subjects,
        aiModel: 'llama-3.3-70b-versatile',
        promptSnapshot: { durationDays, focusSubjects, language, userData } as object,
        days: {
          create: generated.days.map((day) => {
            const dayDate = new Date(startDate);
            dayDate.setDate(dayDate.getDate() + day.dayNumber - 1);
            return {
              dayNumber: day.dayNumber,
              date: dayDate,
              subject: day.subject,
              topic: day.topic,
              description: day.description,
              durationMin: day.durationMin,
              taskType: day.taskType,
              priority: day.priority,
              status: 'pending',
            };
          }),
        },
      },
      include: {
        days: { orderBy: { dayNumber: 'asc' } },
      },
    });

    // Award points
    await awardPoints(userId, POINT_VALUES.STUDY_PATH_GENERATED);

    // Recalculate mastery
    await recalculateMastery(userId).catch(() => {});

    return NextResponse.json({ path: newPath }, { status: 201 });
  } catch (err) {
    console.error('Error generating smart path:', err);
    const message = err instanceof Error ? err.message : 'Failed to generate study path';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
