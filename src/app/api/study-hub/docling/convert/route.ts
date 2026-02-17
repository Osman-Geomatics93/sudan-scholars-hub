import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { checkRateLimit, RATE_LIMITS, rateLimitedResponse } from '@/lib/rate-limit';
import { getDoclingServiceUrl, getDoclingApiKey } from '@/lib/env';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

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

/**
 * Fallback: extract text from PDF bytes using pdf-parse (no tables/structure).
 */
async function extractPdfFallback(fileBytes: ArrayBuffer, fileName: string): Promise<{
  markdown: string;
  metadata: Record<string, unknown>;
  tables: unknown[];
  processingTimeMs: number;
  source: string;
}> {
  const start = Date.now();
  const data = new Uint8Array(fileBytes);
  const { PDFParse } = await import('pdf-parse');
  const parser = new PDFParse({ data });
  const result = await parser.getText();
  await parser.destroy();

  const text = result.text?.trim() || '';
  const maxChars = 50000;
  const markdown = text.length > maxChars
    ? text.slice(0, maxChars) + '\n\n[Text truncated...]'
    : text;

  return {
    markdown,
    metadata: { filename: fileName, pages: null },
    tables: [],
    processingTimeMs: Date.now() - start,
    source: 'pdf-parse',
  };
}

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

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const useFallback = request.nextUrl.searchParams.get('fallback') === 'true';

    // If explicitly requesting fallback and file is PDF, skip Docling
    if (useFallback && isPdf) {
      const fileBytes = await file.arrayBuffer();
      const result = await extractPdfFallback(fileBytes, file.name);

      await prisma.processedDocument.create({
        data: {
          userId,
          fileName: file.name,
          fileType: file.type || 'unknown',
          fileSizeBytes: file.size,
          markdown: result.markdown,
          metadata: result.metadata as Prisma.InputJsonValue,
          tableCount: 0,
          tables: [],
          processingTimeMs: result.processingTimeMs,
          processingStatus: 'completed',
        },
      });

      return NextResponse.json(result);
    }

    if (useFallback && !isPdf) {
      return NextResponse.json(
        { error: 'Basic extraction is only available for PDF files' },
        { status: 400 },
      );
    }

    // Read file bytes once (needed for both Docling attempt and potential fallback)
    const fileBytes = await file.arrayBuffer();

    // Try Docling service
    let doclingResult: Record<string, unknown> | null = null;
    let doclingError: string | null = null;

    try {
      const serviceUrl = getDoclingServiceUrl();
      const apiKey = getDoclingApiKey();

      const proxyForm = new FormData();
      proxyForm.append('file', new Blob([fileBytes], { type: file.type }), file.name);

      const response = await fetch(`${serviceUrl}/api/v1/convert`, {
        method: 'POST',
        headers: { 'X-API-Key': apiKey },
        body: proxyForm,
        signal: AbortSignal.timeout(120000), // 2 min timeout
      });

      if (response.ok) {
        doclingResult = await response.json();
      } else {
        doclingError = `Docling service returned ${response.status}`;
        console.error('Docling service error:', response.status, await response.text().catch(() => ''));
      }
    } catch (e) {
      doclingError = e instanceof Error ? e.message : 'Docling service unavailable';
      console.error('Docling service unreachable:', doclingError);
    }

    // If Docling succeeded, return its result
    if (doclingResult) {
      await prisma.processedDocument.create({
        data: {
          userId,
          fileName: file.name,
          fileType: file.type || 'unknown',
          fileSizeBytes: file.size,
          markdown: (doclingResult.markdown as string) || '',
          metadata: (doclingResult.metadata || {}) as Prisma.InputJsonValue,
          tableCount: (doclingResult.tables as unknown[])?.length || 0,
          tables: (doclingResult.tables || []) as Prisma.InputJsonValue,
          processingTimeMs: (doclingResult.processingTimeMs as number) || 0,
          processingStatus: 'completed',
        },
      });

      return NextResponse.json({ ...doclingResult, source: 'docling' });
    }

    // Docling failed — try pdf-parse fallback for PDFs
    if (isPdf) {
      console.log('Docling failed, falling back to pdf-parse for:', file.name);
      const fallbackResult = await extractPdfFallback(fileBytes, file.name);

      await prisma.processedDocument.create({
        data: {
          userId,
          fileName: file.name,
          fileType: file.type || 'unknown',
          fileSizeBytes: file.size,
          markdown: fallbackResult.markdown,
          metadata: fallbackResult.metadata as Prisma.InputJsonValue,
          tableCount: 0,
          tables: [],
          processingTimeMs: fallbackResult.processingTimeMs,
          processingStatus: 'completed',
        },
      });

      return NextResponse.json(fallbackResult);
    }

    // Non-PDF and Docling failed — no fallback available
    return NextResponse.json(
      {
        error: 'Document processing service is temporarily unavailable. PDF files can still be processed using basic extraction.',
        canRetry: true,
        hasFallback: false,
      },
      { status: 502 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Docling convert error:', message, err);
    return NextResponse.json(
      { error: 'Failed to process document', detail: message },
      { status: 500 },
    );
  }
}
