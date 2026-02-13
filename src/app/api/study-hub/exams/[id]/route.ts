import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { deductPoints, POINT_VALUES } from '@/lib/points';

export const dynamic = 'force-dynamic';

// PATCH - Update a past exam (owner only, resets status to PENDING for re-review)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const userId = (session!.user as { id: string }).id;

    const exam = await prisma.pastExam.findUnique({ where: { id } });

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    if (exam.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden - You can only edit your own exams' }, { status: 403 });
    }

    const body = await request.json();
    const { title, type, url, description, subject, facultyId, specialtyId, uploaderRole, examType, year, professorName } = body;

    const updated = await prisma.pastExam.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(type !== undefined && { type }),
        ...(url !== undefined && { url }),
        ...(description !== undefined && { description: description || null }),
        ...(subject !== undefined && { subject }),
        ...(facultyId !== undefined && { facultyId: facultyId || null }),
        ...(specialtyId !== undefined && { specialtyId: specialtyId || null }),
        ...(uploaderRole !== undefined && { uploaderRole }),
        ...(examType !== undefined && { examType }),
        ...(year !== undefined && { year }),
        ...(professorName !== undefined && { professorName: professorName || null }),
        status: 'PENDING',
        editedAt: new Date(),
        rejectionNote: null,
        reviewedAt: null,
      },
    });

    return NextResponse.json({ exam: updated, message: 'Exam updated and resubmitted for review' });
  } catch (error) {
    console.error('Error updating past exam:', error);
    return NextResponse.json({ error: 'Failed to update past exam' }, { status: 500 });
  }
}

// DELETE - Delete a past exam (owner only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const userId = (session!.user as { id: string }).id;

    const exam = await prisma.pastExam.findUnique({ where: { id } });

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    if (exam.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden - You can only delete your own exams' }, { status: 403 });
    }

    const wasApproved = exam.status === 'APPROVED';

    await prisma.pastExam.delete({ where: { id } });

    if (wasApproved) {
      await deductPoints(userId, POINT_VALUES.UPLOAD_APPROVED);
    }

    return NextResponse.json({ success: true, message: 'Past exam deleted' });
  } catch (error) {
    console.error('Error deleting past exam:', error);
    return NextResponse.json({ error: 'Failed to delete past exam' }, { status: 500 });
  }
}
