import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireBotAuth } from '@/lib/bot-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = requireBotAuth(request);
  if (authError) return authError;

  try {
    const params = request.nextUrl.searchParams;
    const search = params.get('search');
    const type = params.get('type');
    const limit = Math.min(parseInt(params.get('limit') || '5'), 10);

    const where: Record<string, unknown> = {
      status: 'APPROVED',
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type) {
      where.type = type;
    }

    const materials = await prisma.studyMaterial.findMany({
      where,
      orderBy: { downloadCount: 'desc' },
      take: limit,
    });

    const lines = materials.map((m, i) => {
      const typeIcon = m.type === 'pdf' ? '📄' : m.type === 'video' ? '🎬' : '📁';
      return `${i + 1}. ${typeIcon} *${m.title}*\n   ${m.subject} | ${m.universityName}\n   ⬇️ ${m.downloadCount} downloads | ⭐ ${m.averageRating.toFixed(1)}`;
    });

    const text = materials.length > 0
      ? `📚 *Study Materials* (${materials.length} result${materials.length !== 1 ? 's' : ''})\n\n${lines.join('\n\n')}`
      : '❌ No approved materials found matching your search.';

    return NextResponse.json({ text, count: materials.length });
  } catch (error) {
    console.error('Bot materials error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch materials' },
      { status: 500 }
    );
  }
}
