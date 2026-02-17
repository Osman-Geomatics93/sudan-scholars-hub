import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { checkRateLimit, RATE_LIMITS, rateLimitedResponse } from '@/lib/rate-limit';
import { getDoclingServiceUrl, getDoclingApiKey } from '@/lib/env';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 20 * 1024 * 1024;

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

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File exceeds 20MB limit' }, { status: 400 });
    }

    const serviceUrl = getDoclingServiceUrl();
    const apiKey = getDoclingApiKey();

    const proxyForm = new FormData();
    proxyForm.append('file', file);

    const response = await fetch(`${serviceUrl}/api/v1/tables`, {
      method: 'POST',
      headers: { 'X-API-Key': apiKey },
      body: proxyForm,
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Docling tables error:', response.status, errBody);
      return NextResponse.json(
        { error: 'Table extraction failed', detail: errBody },
        { status: 502 },
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (err) {
    console.error('Docling tables error:', err);
    return NextResponse.json(
      { error: 'Failed to extract tables' },
      { status: 500 },
    );
  }
}
