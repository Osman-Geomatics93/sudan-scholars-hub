import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// File category mapping
const FILE_CATEGORIES: Record<string, string> = {
  'turkiye-burslari-guide.pdf': 'guide',
  'application-tips.pdf': 'guide',
  'document-checklist.pdf': 'guide',
  'transcript-form.pdf': 'form',
  'transcript-form.docx': 'form',
  'english-certificate.pdf': 'form',
  'english-certificate.docx': 'form',
  'recommendation-letter-bsc.pdf': 'letter',
  'recommendation-letter-msc.pdf': 'letter',
  'recommendation-letter-phd.pdf': 'letter',
  'validation-letter-msc.pdf': 'letter',
  'validation-letter-phd.pdf': 'letter',
};

// POST - Record a download event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, filePath, referrerPage } = body;

    // Validate required fields
    if (!sessionId || !filePath) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Extract file info from path
    const fileName = filePath.split('/').pop() || '';
    const fileType = fileName.split('.').pop() || '';
    const category = FILE_CATEGORIES[fileName] || 'other';

    await prisma.downloadEvent.create({
      data: {
        sessionId,
        fileName,
        filePath,
        fileType,
        category,
        referrerPage: referrerPage || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording download:', error);
    return NextResponse.json(
      { error: 'Failed to record download' },
      { status: 500 }
    );
  }
}
