import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { createTestSchema, listTestsSchema } from '@/lib/validations/ielts-toefl';
import { awardPoints, POINT_VALUES } from '@/lib/points';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const parsed = listTestsSchema.safeParse({
      examType: searchParams.get('examType') || undefined,
      section: searchParams.get('section') || undefined,
      difficulty: searchParams.get('difficulty') || undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
    });

    const { examType, section, difficulty, page, limit } = parsed.success
      ? parsed.data
      : { examType: undefined, section: undefined, difficulty: undefined, page: 1, limit: 20 };

    const where: Record<string, unknown> = { isPublic: true };
    if (examType) where.examType = examType;
    if (section) where.section = section;
    if (difficulty) where.difficulty = difficulty;

    const [tests, total] = await Promise.all([
      prisma.ieltsToeflTest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          examType: true,
          section: true,
          title: true,
          description: true,
          difficulty: true,
          timeMinutes: true,
          isOfficial: true,
          usageCount: true,
          createdAt: true,
        },
      }),
      prisma.ieltsToeflTest.count({ where }),
    ]);

    return NextResponse.json({ tests, total, page, limit });
  } catch (err) {
    console.error('Error fetching tests:', err);
    return NextResponse.json({ error: 'Failed to fetch tests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const result = createTestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const userId = (session!.user as { id: string }).id;

    const { content, ...rest } = result.data;
    const test = await prisma.ieltsToeflTest.create({
      data: {
        ...rest,
        content: content as Prisma.InputJsonValue,
        userId,
        isOfficial: false,
        isPublic: true,
      },
    });

    await awardPoints(userId, POINT_VALUES.IELTS_TEST_UPLOADED);

    return NextResponse.json({ test }, { status: 201 });
  } catch (err) {
    console.error('Error creating test:', err);
    return NextResponse.json({ error: 'Failed to create test' }, { status: 500 });
  }
}
