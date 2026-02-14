import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { createSessionSchema } from '@/lib/validations/study-assistant';
import { awardPoints, POINT_VALUES } from '@/lib/points';

export const dynamic = 'force-dynamic';

// GET - List user's chat sessions
export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const userId = (session!.user as { id: string }).id;
    const sessions = await prisma.aIChatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        contextType: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { messages: true } },
      },
    });

    return NextResponse.json({ sessions });
  } catch (err) {
    console.error('Error fetching chat sessions:', err);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

// POST - Create a new chat session
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const result = createSessionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const userId = (session!.user as { id: string }).id;
    const { title, contextType, contextId, contextText } = result.data;

    // If contextType is material/exam, fetch the document text
    let resolvedContextText = contextText || null;
    if (contextType === 'material' && contextId) {
      const material = await prisma.studyMaterial.findUnique({
        where: { id: contextId },
        select: { title: true, subject: true, description: true },
      });
      if (material) {
        resolvedContextText = `Title: ${material.title}\nSubject: ${material.subject}\n${material.description || ''}`;
      }
    } else if (contextType === 'exam' && contextId) {
      const exam = await prisma.pastExam.findUnique({
        where: { id: contextId },
        select: { title: true, subject: true, description: true, examType: true, year: true },
      });
      if (exam) {
        resolvedContextText = `Exam: ${exam.title}\nSubject: ${exam.subject}\nType: ${exam.examType}\nYear: ${exam.year}\n${exam.description || ''}`;
      }
    }

    const chatSession = await prisma.aIChatSession.create({
      data: {
        userId,
        title,
        contextType,
        contextId: contextId || null,
        contextText: resolvedContextText,
      },
    });

    await awardPoints(userId, POINT_VALUES.AI_CHAT_SESSION);

    return NextResponse.json({ session: chatSession }, { status: 201 });
  } catch (err) {
    console.error('Error creating chat session:', err);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
