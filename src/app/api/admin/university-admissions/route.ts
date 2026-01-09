import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession, unauthorizedResponse } from '@/lib/auth-utils';
import { universityAdmissionSchema } from '@/lib/validations/university-admission';

// Disable caching
export const dynamic = 'force-dynamic';

// GET - List all university admissions
export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return unauthorizedResponse();

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('isActive');
    const isFree = searchParams.get('isFree');

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { universityNameEn: { contains: search, mode: 'insensitive' } },
        { universityNameAr: { contains: search, mode: 'insensitive' } },
        { universityNameTr: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    if (isFree !== null && isFree !== undefined) {
      where.isFreeApplication = isFree === 'true';
    }

    const [admissions, total] = await Promise.all([
      prisma.universityAdmission.findMany({
        where,
        orderBy: { registrationStart: 'asc' },
        skip,
        take: limit,
      }),
      prisma.universityAdmission.count({ where }),
    ]);

    return NextResponse.json({
      admissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching university admissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch university admissions' },
      { status: 500 }
    );
  }
}

// POST - Create new university admission
export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return unauthorizedResponse();

  try {
    const body = await request.json();

    const result = universityAdmissionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    const admission = await prisma.universityAdmission.create({
      data: {
        universityNameEn: data.universityNameEn,
        universityNameTr: data.universityNameTr,
        universityNameAr: data.universityNameAr,
        city: data.city,
        cityAr: data.cityAr,
        degree: data.degree,
        specialization: data.specialization || null,
        registrationStart: new Date(data.registrationStart),
        registrationEnd: new Date(data.registrationEnd),
        resultsDate: new Date(data.resultsDate),
        acceptedCertificates: data.acceptedCertificates,
        detailsUrl: data.detailsUrl,
        applicationType: data.applicationType,
        localRanking: data.localRanking,
        applicationFee: data.applicationFee || null,
        applicationFeeCurrency: data.applicationFeeCurrency || null,
        isFreeApplication: data.isFreeApplication,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json({ admission }, { status: 201 });
  } catch (error) {
    console.error('Error creating university admission:', error);
    return NextResponse.json(
      { error: 'Failed to create university admission' },
      { status: 500 }
    );
  }
}
