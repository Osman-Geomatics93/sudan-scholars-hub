import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Check if a scholarship is saved by the current user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || (session.user as any).isAdmin) {
      return NextResponse.json({ isSaved: false, savedScholarship: null });
    }

    const userId = (session.user as any).id;
    const scholarshipId = request.nextUrl.searchParams.get('scholarshipId');

    if (!scholarshipId) {
      return NextResponse.json(
        { error: 'Scholarship ID is required' },
        { status: 400 }
      );
    }

    const savedScholarship = await prisma.savedScholarship.findUnique({
      where: {
        userId_scholarshipId: {
          userId,
          scholarshipId,
        },
      },
    });

    return NextResponse.json({
      isSaved: !!savedScholarship,
      savedScholarship,
    });
  } catch (error) {
    console.error('Error checking saved scholarship:', error);
    return NextResponse.json(
      { error: 'Failed to check saved scholarship' },
      { status: 500 }
    );
  }
}
