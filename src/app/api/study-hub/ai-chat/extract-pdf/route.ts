import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { extractPdfSchema } from '@/lib/validations/study-assistant';
import { extractTextFromPdfUrl } from '@/lib/study-assistant/pdf-extractor';

export const dynamic = 'force-dynamic';

// POST - Extract text from a PDF URL
export async function POST(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const result = extractPdfSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const text = await extractTextFromPdfUrl(result.data.url);
    return NextResponse.json({ text, length: text.length });
  } catch (err) {
    console.error('PDF extraction error:', err);
    return NextResponse.json(
      { error: 'Failed to extract text from PDF' },
      { status: 500 },
    );
  }
}
