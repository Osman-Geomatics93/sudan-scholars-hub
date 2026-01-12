import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateLOISuggestion, type SuggestionContext } from '@/lib/loi-builder/ai-suggestions';
import { z } from 'zod';

// Request validation schema
const requestSchema = z.object({
  sectionName: z.string().min(1),
  fieldName: z.string().min(1),
  currentText: z.string().max(2000),
  fieldOfStudy: z.string().optional(),
  universityName: z.string().optional(),
  programName: z.string().optional(),
  language: z.enum(['en', 'tr', 'ar']).default('en'),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    // Block admin users
    if ((session.user as { isAdmin?: boolean }).isAdmin) {
      return NextResponse.json(
        { error: 'Admin users cannot use this feature' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = requestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { sectionName, fieldName, currentText, fieldOfStudy, universityName, programName, language } = validationResult.data;

    // Build context for AI
    const context: SuggestionContext = {
      sectionName,
      fieldName,
      currentText,
      fieldOfStudy,
      universityName,
      programName,
      language,
    };

    // Generate suggestion
    const suggestion = await generateLOISuggestion(context);

    return NextResponse.json({
      suggestion,
      sectionName,
      fieldName,
    });

  } catch (error) {
    console.error('LOI AI suggestion error:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestion' },
      { status: 500 }
    );
  }
}
