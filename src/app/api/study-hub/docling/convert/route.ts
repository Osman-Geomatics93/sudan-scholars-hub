import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { checkRateLimit, RATE_LIMITS, rateLimitedResponse } from '@/lib/rate-limit';
import { getDoclingServiceUrl, getDoclingApiKey } from '@/lib/env';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/tiff',
]);

export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const userId = (session!.user as { id: string }).id;

  // Rate limit
  const rl = checkRateLimit(`docling:${userId}`, RATE_LIMITS.docling.limit, RATE_LIMITS.docling.windowMs);
  if (!rl.success) return rateLimitedResponse(rl.resetTime);

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate type
    if (file.type && !ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File exceeds 20MB limit' }, { status: 400 });
    }

    // Forward to Docling service
    const serviceUrl = getDoclingServiceUrl();
    const apiKey = getDoclingApiKey();

    const proxyForm = new FormData();
    proxyForm.append('file', file);

    const response = await fetch(`${serviceUrl}/api/v1/convert`, {
      method: 'POST',
      headers: { 'X-API-Key': apiKey },
      body: proxyForm,
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Docling service error:', response.status, errBody);
      return NextResponse.json(
        { error: 'Document conversion failed', detail: errBody },
        { status: 502 },
      );
    }

    const result = await response.json();

    // Save to database
    await prisma.processedDocument.create({
      data: {
        userId,
        fileName: file.name,
        fileType: file.type || 'unknown',
        fileSizeBytes: file.size,
        markdown: result.markdown || '',
        metadata: result.metadata || {},
        tableCount: result.tables?.length || 0,
        tables: result.tables || [],
        processingTimeMs: result.processingTimeMs || 0,
        processingStatus: 'completed',
      },
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error('Docling convert error:', err);
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 },
    );
  }
}
