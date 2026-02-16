import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireBotAuth } from '@/lib/bot-auth';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = requireBotAuth(request);
  if (authError) return authError;

  try {
    const params = request.nextUrl.searchParams;
    const search = params.get('search');
    const level = params.get('level');
    const funding = params.get('funding');
    const field = params.get('field');
    const lang = params.get('lang') || 'en';
    const upcoming = params.get('upcoming');
    const limit = Math.min(parseInt(params.get('limit') || '5'), 10);

    const where: Prisma.ScholarshipWhereInput = {
      isPublished: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { titleAr: { contains: search, mode: 'insensitive' } },
        { university: { contains: search, mode: 'insensitive' } },
        { universityAr: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } },
        { countryAr: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (level) {
      where.levels = { hasSome: level.split(',') as any };
    }

    if (funding) {
      where.fundingType = { in: funding.split(',') as any };
    }

    if (field) {
      where.field = { in: field.split(',') as any };
    }

    if (upcoming === 'true') {
      where.deadline = { gte: new Date() };
    }

    const scholarships = await prisma.scholarship.findMany({
      where,
      orderBy: { deadline: 'asc' },
      take: limit,
    });

    const isAr = lang === 'ar';
    const lines = scholarships.map((s, i) => {
      const title = isAr ? s.titleAr : s.title;
      const uni = isAr ? s.universityAr : s.university;
      const country = isAr ? s.countryAr : s.country;
      const deadline = s.deadline.toISOString().split('T')[0];
      const fundLabel = s.fundingType === 'FULLY_FUNDED'
        ? (isAr ? 'ممولة بالكامل' : 'Fully Funded')
        : (isAr ? 'ممولة جزئياً' : 'Partially Funded');
      return `${i + 1}. *${title}*\n   ${uni} - ${country}\n   ${isAr ? 'الموعد النهائي' : 'Deadline'}: ${deadline} | ${fundLabel}\n   ${s.applicationUrl}`;
    });

    const header = isAr
      ? `📚 *المنح الدراسية* (${scholarships.length} ${scholarships.length === 1 ? 'نتيجة' : 'نتائج'})`
      : `📚 *Scholarships* (${scholarships.length} result${scholarships.length !== 1 ? 's' : ''})`;

    const text = scholarships.length > 0
      ? `${header}\n\n${lines.join('\n\n')}`
      : isAr ? '❌ لم يتم العثور على منح تطابق بحثك.' : '❌ No scholarships found matching your search.';

    return NextResponse.json({ text, count: scholarships.length });
  } catch (error) {
    console.error('Bot scholarships error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scholarships' },
      { status: 500 }
    );
  }
}
