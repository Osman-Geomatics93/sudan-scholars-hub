import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { checkRateLimit, RATE_LIMITS, rateLimitedResponse } from '@/lib/rate-limit';
import { getDoclingServiceUrl, getDoclingApiKey } from '@/lib/env';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/tiff']);

export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const userId = (session!.user as { id: string }).id;

  const rl = checkRateLimit(`docling:${userId}`, RATE_LIMITS.docling.limit, RATE_LIMITS.docling.windowMs);
  if (!rl.success) return rateLimitedResponse(rl.resetTime);

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.type && !IMAGE_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Only image files are supported for OCR' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File exceeds 20MB limit' }, { status: 400 });
    }

    const serviceUrl = getDoclingServiceUrl();
    const apiKey = getDoclingApiKey();

    const proxyForm = new FormData();
    proxyForm.append('file', file);

    const response = await fetch(`${serviceUrl}/api/v1/ocr`, {
      method: 'POST',
      headers: { 'X-API-Key': apiKey },
      body: proxyForm,
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Docling OCR error:', response.status, errBody);
      return NextResponse.json(
        { error: 'OCR processing failed', detail: errBody },
        { status: 502 },
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (err) {
    console.error('Docling OCR error:', err);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 },
    );
  }
}
