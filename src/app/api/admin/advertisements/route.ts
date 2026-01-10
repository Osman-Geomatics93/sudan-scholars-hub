import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-utils';

// Disable caching
export const dynamic = 'force-dynamic';

// GET - List all advertisements (including inactive)
export async function GET(request: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const advertisements = await prisma.advertisement.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ advertisements });
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch advertisements' },
      { status: 500 }
    );
  }
}

// POST - Create new advertisement
export async function POST(request: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.titleAr || !body.imageUrl) {
      return NextResponse.json(
        { error: 'Title, Arabic title, and image URL are required' },
        { status: 400 }
      );
    }

    // Get the highest order number and add 1
    const lastAd = await prisma.advertisement.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const nextOrder = (lastAd?.order ?? -1) + 1;

    const advertisement = await prisma.advertisement.create({
      data: {
        title: body.title,
        titleAr: body.titleAr,
        imageUrl: body.imageUrl,
        linkUrl: body.linkUrl || null,
        isActive: body.isActive ?? true,
        order: body.order ?? nextOrder,
      },
    });

    return NextResponse.json({ advertisement }, { status: 201 });
  } catch (error) {
    console.error('Error creating advertisement:', error);
    return NextResponse.json(
      { error: 'Failed to create advertisement' },
      { status: 500 }
    );
  }
}
