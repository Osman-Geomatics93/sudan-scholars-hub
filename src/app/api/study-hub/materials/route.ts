import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { studyMaterialSchema } from '@/lib/validations/study-material';

export const dynamic = 'force-dynamic';

// GET - List approved materials (public, no auth)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const countryId = searchParams.get('countryId');
    const universityId = searchParams.get('universityId');
    const degreeId = searchParams.get('degreeId');
    const semester = searchParams.get('semester');

    const where: Record<string, unknown> = { status: 'APPROVED' };
    if (countryId) where.countryId = countryId;
    if (universityId) where.universityId = universityId;
    if (degreeId) where.degreeId = degreeId;
    if (semester) where.semester = semester;

    const materials = await prisma.studyMaterial.findMany({
      where,
      orderBy: { uploadedAt: 'desc' },
    });

    return NextResponse.json({ materials });
  } catch (error) {
    console.error('Error fetching study materials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch study materials' },
      { status: 500 }
    );
  }
}

// POST - Submit a new material (public, no auth, creates as PENDING)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = studyMaterialSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const material = await prisma.studyMaterial.create({
      data: {
        ...result.data,
        description: result.data.description || null,
        facultyId: result.data.facultyId || null,
        specialtyId: result.data.specialtyId || null,
        status: 'PENDING',
      },
    });

    return NextResponse.json(
      { material, message: 'Material submitted for review' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating study material:', error);
    return NextResponse.json(
      { error: 'Failed to submit study material' },
      { status: 500 }
    );
  }
}
