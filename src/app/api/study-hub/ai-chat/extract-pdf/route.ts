import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { extractPdfSchema } from '@/lib/validations/study-assistant';
import { extractTextFromPdfUrl } from '@/lib/study-assistant/pdf-extractor';

export const dynamic = 'force-dynamic';

/**
 * Try Docling service first for structured extraction, fallback to pdf-parse.
 */
async function extractViaDocling(pdfUrl: string): Promise<string | null> {
  try {
    const serviceUrl = process.env.DOCLING_SERVICE_URL;
    const apiKey = process.env.DOCLING_API_KEY;
    if (!serviceUrl || !apiKey) return null;

    // Fetch the PDF file
    const pdfRes = await fetch(pdfUrl);
    if (!pdfRes.ok) return null;

    const pdfBlob = await pdfRes.blob();
    const formData = new FormData();
    formData.append('file', pdfBlob, 'document.pdf');

    const res = await fetch(`${serviceUrl}/api/v1/convert`, {
      method: 'POST',
      headers: { 'X-API-Key': apiKey },
      body: formData,
    });

    if (!res.ok) return null;

    const data = await res.json();
    const text = data.markdown?.trim();
    return text && text.length > 0 ? text : null;
  } catch {
    return null;
  }
}

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

    // Try Docling first for structured output
    const doclingText = await extractViaDocling(result.data.url);
    if (doclingText) {
      const maxChars = 50000;
      const text = doclingText.length > maxChars
        ? doclingText.slice(0, maxChars) + '\n\n[Text truncated...]'
        : doclingText;
      return NextResponse.json({ text, length: text.length, source: 'docling' });
    }

    // Fallback to pdf-parse
    const text = await extractTextFromPdfUrl(result.data.url);
    return NextResponse.json({ text, length: text.length, source: 'pdf-parse' });
  } catch (err) {
    console.error('PDF extraction error:', err);
    return NextResponse.json(
      { error: 'Failed to extract text from PDF' },
      { status: 500 },
    );
  }
}
