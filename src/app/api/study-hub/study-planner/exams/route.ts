import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { createExamSchema } from '@/lib/validations/study-planner';

export const dynamic = 'force-dynamic';

// GET - List user's upcoming exams
export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;

    const exams = await prisma.studyExam.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json({ exams });
  } catch (err) {
    console.error('Error fetching exams:', err);
    return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 });
  }
}

// POST - Create an exam
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;
    const body = await request.json();
    const result = createExamSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const exam = await prisma.studyExam.create({
      data: {
        userId,
        title: result.data.title,
        subject: result.data.subject,
        date: new Date(result.data.date),
        notes: result.data.notes || null,
        color: result.data.color || '#3B82F6',
      },
    });

    return NextResponse.json({ exam }, { status: 201 });
  } catch (err) {
    console.error('Error creating exam:', err);
    return NextResponse.json({ error: 'Failed to create exam' }, { status: 500 });
  }
}
