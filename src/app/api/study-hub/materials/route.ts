import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { studyMaterialSchema } from '@/lib/validations/study-material';
import { requireAuth } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

// GET - List materials (public for approved, or user's own materials of any status)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const countryId = searchParams.get('countryId');
    const universityId = searchParams.get('universityId');
    const degreeId = searchParams.get('degreeId');
    const semester = searchParams.get('semester');
    const userId = searchParams.get('userId');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    // Advanced search params
    const orderBy = searchParams.get('orderBy'); // newest, downloads, rating
    const minRating = searchParams.get('minRating');
    const facultyId = searchParams.get('facultyId');
    const uploaderRole = searchParams.get('uploaderRole');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    const where: Record<string, unknown> = {};

    if (userId) {
      // When fetching user's own materials, show all statuses
      where.userId = userId;
    } else {
      // Public listing: only approved materials
      where.status = 'APPROVED';
    }

    if (countryId) where.countryId = countryId;
    if (universityId) where.universityId = universityId;
    if (degreeId) where.degreeId = degreeId;
    if (semester) where.semester = semester;
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (facultyId) where.facultyId = facultyId;
    if (uploaderRole) where.uploaderRole = uploaderRole;
    if (minRating) where.averageRating = { gte: parseFloat(minRating) };
    if (dateFrom || dateTo) {
      where.uploadedAt = {
        ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
        ...(dateTo ? { lte: new Date(dateTo) } : {}),
      };
    }

    // Lightweight mode: return only categorization fields for client-side counting
    const fieldsOnly = searchParams.get('fieldsOnly');
    if (fieldsOnly === 'true') {
      const items = await prisma.studyMaterial.findMany({
        where,
        select: { id: true, countryId: true, universityId: true, degreeId: true, semester: true },
      });
      return NextResponse.json({ materials: items, total: items.length });
    }

    // Determine sort order
    let sortOrder: Record<string, string> = { uploadedAt: 'desc' };
    if (orderBy === 'downloads') sortOrder = { downloadCount: 'desc' };
    else if (orderBy === 'rating') sortOrder = { averageRating: 'desc' };
    else if (orderBy === 'newest') sortOrder = { uploadedAt: 'desc' };

    const [materials, total] = await Promise.all([
      prisma.studyMaterial.findMany({
        where,
        orderBy: sortOrder,
        ...(limit ? { take: parseInt(limit, 10) } : {}),
        ...(offset ? { skip: parseInt(offset, 10) } : {}),
      }),
      prisma.studyMaterial.count({ where }),
    ]);

    return NextResponse.json({ materials, total });
  } catch (error) {
    console.error('Error fetching study materials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch study materials' },
      { status: 500 }
    );
  }
}

// POST - Submit a new material (requires auth, creates as PENDING)
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const result = studyMaterialSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const user = session!.user as { id: string; email?: string | null; name?: string | null };

    const material = await prisma.studyMaterial.create({
      data: {
        ...result.data,
        description: result.data.description || null,
        facultyId: result.data.facultyId || null,
        specialtyId: result.data.specialtyId || null,
        status: 'PENDING',
        userId: user.id,
        userEmail: user.email || null,
        userName: user.name || null,
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
