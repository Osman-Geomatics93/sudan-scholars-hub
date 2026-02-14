import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { createStudySessionSchema } from '@/lib/validations/study-planner';

export const dynamic = 'force-dynamic';

// GET - List user's study sessions
export async function GET(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '365');
    const limit = parseInt(searchParams.get('limit') || '100');

    const since = new Date();
    since.setDate(since.getDate() - days);

    const sessions = await prisma.studySession.findMany({
      where: { userId, date: { gte: since } },
      orderBy: { date: 'desc' },
      take: Math.min(limit, 1000),
    });

    return NextResponse.json({ sessions });
  } catch (err) {
    console.error('Error fetching study sessions:', err);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

// POST - Log a study session
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;
    const body = await request.json();
    const result = createStudySessionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const studySession = await prisma.studySession.create({
      data: {
        userId,
        subject: result.data.subject,
        duration: result.data.duration,
        date: result.data.date ? new Date(result.data.date) : new Date(),
        notes: result.data.notes || null,
        source: result.data.source || 'manual',
      },
    });

    return NextResponse.json({ session: studySession }, { status: 201 });
  } catch (err) {
    console.error('Error creating study session:', err);
    return NextResponse.json({ error: 'Failed to log session' }, { status: 500 });
  }
}
