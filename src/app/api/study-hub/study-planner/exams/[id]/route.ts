import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { updateExamSchema } from '@/lib/validations/study-planner';

export const dynamic = 'force-dynamic';

// PATCH - Update an exam
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const userId = (session!.user as { id: string }).id;

    const existing = await prisma.studyExam.findFirst({ where: { id, userId } });
    if (!existing) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    const body = await request.json();
    const result = updateExamSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    const data: Record<string, unknown> = { ...result.data };
    if (data.date) data.date = new Date(data.date as string);

    const exam = await prisma.studyExam.update({ where: { id }, data });
    return NextResponse.json({ exam });
  } catch (err) {
    console.error('Error updating exam:', err);
    return NextResponse.json({ error: 'Failed to update exam' }, { status: 500 });
  }
}

// DELETE - Delete an exam
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const userId = (session!.user as { id: string }).id;

    const existing = await prisma.studyExam.findFirst({ where: { id, userId } });
    if (!existing) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    await prisma.studyExam.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting exam:', err);
    return NextResponse.json({ error: 'Failed to delete exam' }, { status: 500 });
  }
}
