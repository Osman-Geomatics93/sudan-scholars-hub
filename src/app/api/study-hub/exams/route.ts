import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { pastExamSchema } from '@/lib/validations/past-exam';
import { requireAuth } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

// GET - List past exams (public for approved, or user's own exams of any status)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const countryId = searchParams.get('countryId');
    const universityId = searchParams.get('universityId');
    const degreeId = searchParams.get('degreeId');
    const semester = searchParams.get('semester');
    const examType = searchParams.get('examType');
    const year = searchParams.get('year');
    const userId = searchParams.get('userId');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const orderBy = searchParams.get('orderBy'); // newest, downloads

    const where: Record<string, unknown> = {};

    if (userId) {
      where.userId = userId;
    } else {
      where.status = 'APPROVED';
    }

    if (countryId) where.countryId = countryId;
    if (universityId) where.universityId = universityId;
    if (degreeId) where.degreeId = degreeId;
    if (semester) where.semester = semester;
    if (examType) where.examType = examType;
    if (year) where.year = year;
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { professorName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Determine sort order
    let sortOrder: Record<string, string> = { uploadedAt: 'desc' };
    if (orderBy === 'downloads') sortOrder = { downloadCount: 'desc' };
    else if (orderBy === 'newest') sortOrder = { uploadedAt: 'desc' };

    const [exams, total] = await Promise.all([
      prisma.pastExam.findMany({
        where,
        orderBy: sortOrder,
        ...(limit ? { take: parseInt(limit, 10) } : {}),
        ...(offset ? { skip: parseInt(offset, 10) } : {}),
      }),
      prisma.pastExam.count({ where }),
    ]);

    return NextResponse.json({ exams, total });
  } catch (error) {
    console.error('Error fetching past exams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch past exams' },
      { status: 500 }
    );
  }
}

// POST - Submit a new past exam (requires auth, creates as PENDING)
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const result = pastExamSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const user = session!.user as { id: string; email?: string | null; name?: string | null };

    const exam = await prisma.pastExam.create({
      data: {
        ...result.data,
        description: result.data.description || null,
        facultyId: result.data.facultyId || null,
        specialtyId: result.data.specialtyId || null,
        professorName: result.data.professorName || null,
        status: 'PENDING',
        userId: user.id,
        userEmail: user.email || null,
        userName: user.name || null,
      },
    });

    return NextResponse.json(
      { exam, message: 'Past exam submitted for review' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating past exam:', error);
    return NextResponse.json(
      { error: 'Failed to submit past exam' },
      { status: 500 }
    );
  }
}
