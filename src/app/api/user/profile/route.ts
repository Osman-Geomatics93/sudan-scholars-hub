import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { profileSchema } from '@/lib/validations/profile';

// Get user profile
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || (session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        savedScholarships: {
          include: {
            scholarship: true,
          },
          orderBy: { savedAt: 'desc' },
        },
        _count: {
          select: {
            savedScholarships: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate stats
    const stats = {
      total: user._count.savedScholarships,
      saved: user.savedScholarships.filter((s) => s.status === 'SAVED').length,
      applying: user.savedScholarships.filter((s) => s.status === 'APPLYING').length,
      applied: user.savedScholarships.filter((s) => s.status === 'APPLIED').length,
      accepted: user.savedScholarships.filter((s) => s.status === 'ACCEPTED').length,
      rejected: user.savedScholarships.filter((s) => s.status === 'REJECTED').length,
    };

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.profileImage || user.image, // Prefer custom profile image
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        educationLevel: user.educationLevel,
        fieldOfStudy: user.fieldOfStudy,
        socialLinks: user.socialLinks,
        profileImage: user.profileImage,
        googleImage: user.image, // Keep original Google image separately
        createdAt: user.createdAt,
      },
      stats,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || (session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();

    // Validate input
    const validatedData = profileSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validatedData.error.flatten() },
        { status: 400 }
      );
    }

    const {
      name,
      phone,
      location,
      bio,
      educationLevel,
      fieldOfStudy,
      socialLinks,
      profileImage,
    } = validatedData.data;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name: name || null }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(location !== undefined && { location: location || null }),
        ...(bio !== undefined && { bio: bio || null }),
        ...(educationLevel !== undefined && { educationLevel: educationLevel || null }),
        ...(fieldOfStudy !== undefined && { fieldOfStudy: fieldOfStudy || null }),
        ...(socialLinks !== undefined && { socialLinks: socialLinks || null }),
        ...(profileImage !== undefined && { profileImage: profileImage || null }),
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.profileImage || user.image,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        educationLevel: user.educationLevel,
        fieldOfStudy: user.fieldOfStudy,
        socialLinks: user.socialLinks,
        profileImage: user.profileImage,
        googleImage: user.image,
      },
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}
