import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createMaterialSchema } from '@/lib/validations/ielts-toefl';
import { requireAuth } from '@/lib/auth-utils';
import { awardPoints, POINT_VALUES } from '@/lib/points';

export const dynamic = 'force-dynamic';

// GET - List approved IELTS/TOEFL materials with filters
export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const examType = sp.get('examType');
    const section = sp.get('section');
    const materialType = sp.get('materialType');
    const search = sp.get('search');
    const difficulty = sp.get('difficulty');
    const language = sp.get('language');
    const page = Math.max(1, parseInt(sp.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(sp.get('limit') || '20', 10)));

    const where: Record<string, unknown> = { status: 'approved' };

    if (examType && examType !== 'all') where.examType = examType;
    if (section) where.section = section;
    if (materialType) where.materialType = materialType;
    if (difficulty) where.difficulty = difficulty;
    if (language) where.language = language;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [materials, total] = await Promise.all([
      prisma.ieltsToeflMaterial.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.ieltsToeflMaterial.count({ where }),
    ]);

    return NextResponse.json({ materials, total, page, limit });
  } catch (error) {
    console.error('Error fetching IELTS/TOEFL materials:', error);
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 });
  }
}

// POST - Submit a new material (requires auth, creates as pending)
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const result = createMaterialSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const user = session!.user as { id: string; email?: string | null; name?: string | null };

    const material = await prisma.ieltsToeflMaterial.create({
      data: {
        ...result.data,
        description: result.data.description || null,
        tags: result.data.tags || [],
        status: 'pending',
        userId: user.id,
        userEmail: user.email || null,
        userName: user.name || null,
      },
    });

    // Award points for sharing material
    await awardPoints(user.id, POINT_VALUES.IELTS_TEST_UPLOADED);

    return NextResponse.json(
      { material, message: 'Material submitted for review' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating IELTS/TOEFL material:', error);
    return NextResponse.json({ error: 'Failed to submit material' }, { status: 500 });
  }
}
