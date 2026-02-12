import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

// GET - List study groups (filterable)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const countryId = searchParams.get('countryId');
    const universityId = searchParams.get('universityId');

    const where: Record<string, unknown> = { isActive: true };
    if (countryId) where.countryId = countryId;
    if (universityId) where.universityId = universityId;

    const groups = await prisma.studyGroup.findMany({
      where,
      include: {
        creator: { select: { id: true, name: true, image: true, badge: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ groups });
  } catch (error) {
    console.error('Error fetching study groups:', error);
    return NextResponse.json({ error: 'Failed to fetch study groups' }, { status: 500 });
  }
}

// POST - Create a study group
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const { name, description, countryId, universityId, degreeId, semester, chatLink, platform } = body;

    if (!name || !chatLink || !platform) {
      return NextResponse.json(
        { error: 'Name, chatLink, and platform are required' },
        { status: 400 }
      );
    }

    if (!['whatsapp', 'telegram', 'discord'].includes(platform)) {
      return NextResponse.json(
        { error: 'Platform must be whatsapp, telegram, or discord' },
        { status: 400 }
      );
    }

    const userId = (session!.user as { id: string }).id;

    const group = await prisma.studyGroup.create({
      data: {
        name,
        description: description || null,
        countryId: countryId || null,
        universityId: universityId || null,
        degreeId: degreeId || null,
        semester: semester || null,
        chatLink,
        platform,
        createdBy: userId,
      },
    });

    return NextResponse.json({ group }, { status: 201 });
  } catch (error) {
    console.error('Error creating study group:', error);
    return NextResponse.json({ error: 'Failed to create study group' }, { status: 500 });
  }
}
