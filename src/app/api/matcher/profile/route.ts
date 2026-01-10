import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { matcherProfileSchema } from '@/lib/validations/matcher';
import type { MatcherProfile } from '@/lib/matcher/types';

/**
 * GET /api/matcher/profile
 * Get the authenticated user's matcher profile
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user as { id?: string; isAdmin?: boolean } | undefined;

    if (!session || !user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admins use a different system
    if (user.isAdmin) {
      return NextResponse.json({ error: 'Admin users cannot use the matcher' }, { status: 403 });
    }

    const userId = user.id;

    const profile = await prisma.matcherProfile.findUnique({
      where: { userId },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error fetching matcher profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matcher profile' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/matcher/profile
 * Create a new matcher profile for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user as { id?: string; isAdmin?: boolean } | undefined;

    if (!session || !user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.isAdmin) {
      return NextResponse.json({ error: 'Admin users cannot use the matcher' }, { status: 403 });
    }

    const userId = user.id;
    const body = await request.json();

    // Validate input
    const validatedData = matcherProfileSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validatedData.error.flatten() },
        { status: 400 }
      );
    }

    // Check if profile already exists
    const existingProfile = await prisma.matcherProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Profile already exists. Use PATCH to update.' },
        { status: 409 }
      );
    }

    // Create new profile
    const profile = await prisma.matcherProfile.create({
      data: {
        userId,
        gpaValue: validatedData.data.gpaValue,
        gpaSystem: validatedData.data.gpaSystem,
        currentLevel: validatedData.data.currentLevel,
        targetLevel: validatedData.data.targetLevel,
        fieldsOfStudy: validatedData.data.fieldsOfStudy,
        countryOfOrigin: validatedData.data.countryOfOrigin,
        languages: validatedData.data.languages,
        age: validatedData.data.age,
        fundingPreference: validatedData.data.fundingPreference,
        specialCircumstances: validatedData.data.specialCircumstances,
      },
    });

    return NextResponse.json(
      { profile, message: 'Matcher profile created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating matcher profile:', error);
    return NextResponse.json(
      { error: 'Failed to create matcher profile' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/matcher/profile
 * Update the authenticated user's matcher profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user as { id?: string; isAdmin?: boolean } | undefined;

    if (!session || !user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.isAdmin) {
      return NextResponse.json({ error: 'Admin users cannot use the matcher' }, { status: 403 });
    }

    const userId = user.id;
    const body = await request.json();

    // Validate input
    const validatedData = matcherProfileSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validatedData.error.flatten() },
        { status: 400 }
      );
    }

    // Check if profile exists
    const existingProfile = await prisma.matcherProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      // Create if doesn't exist
      const profile = await prisma.matcherProfile.create({
        data: {
          userId,
          gpaValue: validatedData.data.gpaValue,
          gpaSystem: validatedData.data.gpaSystem,
          currentLevel: validatedData.data.currentLevel,
          targetLevel: validatedData.data.targetLevel,
          fieldsOfStudy: validatedData.data.fieldsOfStudy,
          countryOfOrigin: validatedData.data.countryOfOrigin,
          languages: validatedData.data.languages,
          age: validatedData.data.age,
          fundingPreference: validatedData.data.fundingPreference,
          specialCircumstances: validatedData.data.specialCircumstances,
        },
      });

      return NextResponse.json(
        { profile, message: 'Matcher profile created successfully' },
        { status: 201 }
      );
    }

    // Update existing profile
    const profile = await prisma.matcherProfile.update({
      where: { userId },
      data: {
        gpaValue: validatedData.data.gpaValue,
        gpaSystem: validatedData.data.gpaSystem,
        currentLevel: validatedData.data.currentLevel,
        targetLevel: validatedData.data.targetLevel,
        fieldsOfStudy: validatedData.data.fieldsOfStudy,
        countryOfOrigin: validatedData.data.countryOfOrigin,
        languages: validatedData.data.languages,
        age: validatedData.data.age,
        fundingPreference: validatedData.data.fundingPreference,
        specialCircumstances: validatedData.data.specialCircumstances,
      },
    });

    return NextResponse.json({
      profile,
      message: 'Matcher profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating matcher profile:', error);
    return NextResponse.json(
      { error: 'Failed to update matcher profile' },
      { status: 500 }
    );
  }
}
