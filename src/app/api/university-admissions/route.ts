import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Enable caching for public endpoint
export const revalidate = 300; // 5 minutes

// GET - List all active university admissions (public)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    const certificate = searchParams.get('certificate');
    const hideEnded = searchParams.get('hideEnded') === 'true';
    const freeOnly = searchParams.get('freeOnly') === 'true';
    const calendarType = searchParams.get('calendarType');

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (city) {
      where.city = city;
    }

    if (certificate) {
      where.acceptedCertificates = {
        has: certificate,
      };
    }

    if (hideEnded) {
      where.registrationEnd = {
        gte: new Date(),
      };
    }

    if (freeOnly) {
      where.isFreeApplication = true;
    }

    // Filter by calendar type (bachelor, masters-phd, summer)
    if (calendarType && ['bachelor', 'masters-phd', 'summer'].includes(calendarType)) {
      where.calendarType = calendarType;
    }

    const admissions = await prisma.universityAdmission.findMany({
      where,
      orderBy: { registrationStart: 'asc' },
    });

    // Transform to match the interface expected by the frontend
    const transformedAdmissions = admissions.map((admission) => ({
      id: admission.id,
      universityNameEn: admission.universityNameEn,
      universityNameTr: admission.universityNameTr,
      universityNameAr: admission.universityNameAr,
      city: admission.city,
      cityAr: admission.cityAr,
      degree: admission.degree,
      registrationStart: admission.registrationStart.toISOString().split('T')[0],
      registrationEnd: admission.registrationEnd.toISOString().split('T')[0],
      resultsDate: admission.resultsDate.toISOString().split('T')[0],
      acceptedCertificates: admission.acceptedCertificates,
      detailsUrl: admission.detailsUrl,
      applicationType: admission.applicationType,
      localRanking: admission.localRanking,
      specialization: admission.specialization,
      applicationFee: admission.applicationFee,
      applicationFeeCurrency: admission.applicationFeeCurrency,
      isFreeApplication: admission.isFreeApplication,
      // New fields
      calendarType: admission.calendarType,
      programDuration: admission.programDuration,
      languageOfInstruction: admission.languageOfInstruction,
    }));

    return NextResponse.json({ admissions: transformedAdmissions });
  } catch (error) {
    console.error('Error fetching university admissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch university admissions' },
      { status: 500 }
    );
  }
}
