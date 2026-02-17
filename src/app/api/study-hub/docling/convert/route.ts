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

const IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/tiff']);

const IMAGE_EXTRACT_PROMPT = `Extract ALL text content from this image. If there are tables, format them as markdown tables with proper alignment. If there is regular text, preserve its structure. Output ONLY the extracted content as markdown, no explanations. Support both English and Arabic text.`;

/**
 * Fallback: extract text/tables from image.
 * Tries Groq Vision (free, fast), then Gemini Vision, then Tesseract OCR.
 */
async function extractImageFallback(fileBytes: ArrayBuffer, fileName: string, mimeType: string): Promise<{
  markdown: string;
  metadata: Record<string, unknown>;
  tables: unknown[];
  processingTimeMs: number;
  source: string;
}> {
  const start = Date.now();
  const base64Data = Buffer.from(fileBytes).toString('base64');
  const dataUrl = `data:${mimeType || 'image/png'};base64,${base64Data}`;

  // Try Groq Vision first (free, fast, good for tables)
  try {
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [{
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: dataUrl } },
              { type: 'text', text: IMAGE_EXTRACT_PROMPT },
            ],
          }],
          max_tokens: 4096,
          temperature: 0,
        }),
        signal: AbortSignal.timeout(30000),
      });

      if (response.ok) {
        const data = await response.json();
        const markdown = data.choices?.[0]?.message?.content?.trim() || '';
        if (markdown) {
          return {
            markdown,
            metadata: { filename: fileName },
            tables: [],
            processingTimeMs: Date.now() - start,
            source: 'groq-vision',
          };
        }
      } else {
        console.error('Groq Vision failed:', response.status, await response.text().catch(() => ''));
      }
    }
  } catch (e) {
    console.error('Groq Vision error:', e instanceof Error ? e.message : e);
  }

  // Try Gemini Vision
  try {
    const geminiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (geminiKey) {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const result = await model.generateContent([
        { inlineData: { mimeType: mimeType || 'image/png', data: base64Data } },
        { text: IMAGE_EXTRACT_PROMPT },
      ]);

      const markdown = result.response.text()?.trim() || '';
      if (markdown) {
        return {
          markdown,
          metadata: { filename: fileName },
          tables: [],
          processingTimeMs: Date.now() - start,
          source: 'gemini-vision',
        };
      }
    }
  } catch (e) {
    console.error('Gemini Vision failed:', e instanceof Error ? e.message : e);
  }

  // Last resort: Tesseract OCR (plain text only, no table structure)
  try {
    const { createWorker } = await import('tesseract.js');
    const worker = await createWorker('eng+ara');
    const { data } = await worker.recognize(Buffer.from(fileBytes));
    await worker.terminate();

    const text = data.text?.trim() || '';
    const maxChars = 50000;
    const markdown = text.length > maxChars
      ? text.slice(0, maxChars) + '\n\n[Text truncated...]'
      : text;

    return {
      markdown,
      metadata: { filename: fileName, confidence: data.confidence },
      tables: [],
      processingTimeMs: Date.now() - start,
      source: 'tesseract-ocr',
    };
  } catch (e) {
    console.error('Tesseract OCR failed:', e instanceof Error ? e.message : e);
  }

  return {
    markdown: '',
    metadata: { filename: fileName, error: 'All image extraction methods failed' },
    tables: [],
    processingTimeMs: Date.now() - start,
    source: 'none',
  };
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const user = session!.user as { id: string; isAdmin?: boolean };
  const userId = user.id;
  const isAdmin = !!user.isAdmin;

  // Check if user exists in User table (admins are in Admin table, not User)
  let canSaveDocument = false;
  if (!isAdmin) {
    const dbUser = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    canSaveDocument = !!dbUser;
  }

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
    const isImage = IMAGE_TYPES.has(file.type);
    const useFallback = request.nextUrl.searchParams.get('fallback') === 'true';

    // If explicitly requesting fallback and file is PDF, skip Docling
    if (useFallback && isPdf) {
      const fileBytes = await file.arrayBuffer();
      const result = await extractPdfFallback(fileBytes, file.name);

      if (canSaveDocument) {
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
      }

      return NextResponse.json(result);
    }

    if (useFallback && isImage) {
      const fileBytes = await file.arrayBuffer();
      const result = await extractImageFallback(fileBytes, file.name, file.type);

      if (canSaveDocument) {
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
      }

      return NextResponse.json(result);
    }

    if (useFallback && !isPdf && !isImage) {
      return NextResponse.json(
        { error: 'Basic extraction is only available for PDF and image files' },
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
      if (canSaveDocument) {
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
      }

      return NextResponse.json({ ...doclingResult, source: 'docling' });
    }

    // Docling failed — try pdf-parse fallback for PDFs
    if (isPdf) {
      console.log('Docling failed, falling back to pdf-parse for:', file.name);
      const fallbackResult = await extractPdfFallback(fileBytes, file.name);

      if (canSaveDocument) {
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
      }

      return NextResponse.json(fallbackResult);
    }

    // Docling failed for image — try Tesseract OCR fallback
    if (isImage) {
      console.log('Docling failed, falling back to Tesseract OCR for:', file.name);
      const ocrResult = await extractImageFallback(fileBytes, file.name, file.type);

      if (canSaveDocument) {
        await prisma.processedDocument.create({
          data: {
            userId,
            fileName: file.name,
            fileType: file.type || 'unknown',
            fileSizeBytes: file.size,
            markdown: ocrResult.markdown,
            metadata: ocrResult.metadata as Prisma.InputJsonValue,
            tableCount: 0,
            tables: [],
            processingTimeMs: ocrResult.processingTimeMs,
            processingStatus: 'completed',
          },
        });
      }

      return NextResponse.json(ocrResult);
    }

    // Non-PDF/non-image and Docling failed — no fallback available
    return NextResponse.json(
      {
        error: 'Document processing service is temporarily unavailable. PDF and image files can still be processed using basic extraction.',
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
