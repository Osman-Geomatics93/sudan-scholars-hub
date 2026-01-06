import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Get user's saved scholarships
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || (session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const savedScholarships = await prisma.savedScholarship.findMany({
      where: { userId },
      include: {
        scholarship: true,
      },
      orderBy: { savedAt: 'desc' },
    });

    return NextResponse.json({ savedScholarships });
  } catch (error) {
    console.error('Error fetching saved scholarships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved scholarships' },
      { status: 500 }
    );
  }
}

// Save a scholarship
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || (session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { scholarshipId } = body;

    if (!scholarshipId) {
      return NextResponse.json(
        { error: 'Scholarship ID is required' },
        { status: 400 }
      );
    }

    // Check if scholarship exists
    const scholarship = await prisma.scholarship.findUnique({
      where: { id: scholarshipId },
    });

    if (!scholarship) {
      return NextResponse.json(
        { error: 'Scholarship not found' },
        { status: 404 }
      );
    }

    // Check if already saved
    const existing = await prisma.savedScholarship.findUnique({
      where: {
        userId_scholarshipId: {
          userId,
          scholarshipId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Scholarship already saved' },
        { status: 400 }
      );
    }

    // Save the scholarship
    const savedScholarship = await prisma.savedScholarship.create({
      data: {
        userId,
        scholarshipId,
      },
      include: {
        scholarship: true,
      },
    });

    return NextResponse.json(
      { savedScholarship, message: 'Scholarship saved successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving scholarship:', error);
    return NextResponse.json(
      { error: 'Failed to save scholarship' },
      { status: 500 }
    );
  }
}
