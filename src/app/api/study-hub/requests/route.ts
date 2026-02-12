import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

// GET - List material requests (filterable)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const countryId = searchParams.get('countryId');
    const universityId = searchParams.get('universityId');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (countryId) where.countryId = countryId;
    if (universityId) where.universityId = universityId;

    const requests = await prisma.materialRequest.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, image: true, badge: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}

// POST - Create a material request
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const { title, description, countryId, universityId, degreeId, semester, subject } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const userId = (session!.user as { id: string }).id;

    const materialRequest = await prisma.materialRequest.create({
      data: {
        userId,
        title,
        description: description || null,
        countryId: countryId || null,
        universityId: universityId || null,
        degreeId: degreeId || null,
        semester: semester || null,
        subject: subject || null,
      },
    });

    return NextResponse.json({ request: materialRequest }, { status: 201 });
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
  }
}
