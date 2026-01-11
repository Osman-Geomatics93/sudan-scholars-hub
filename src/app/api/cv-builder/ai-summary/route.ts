import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { aiSummaryRequestSchema } from '@/lib/validations/cv-builder';
import { generateCVSummary } from '@/lib/cv-builder/ai-summary';

/**
 * POST /api/cv-builder/ai-summary
 * Generate an AI-powered professional summary
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user as { id?: string; isAdmin?: boolean } | undefined;

    if (!session || !user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.isAdmin) {
      return NextResponse.json({ error: 'Admin users cannot use CV Builder' }, { status: 403 });
    }

    const body = await request.json();
    const validationResult = aiSummaryRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { education, experience, skills, targetRole, language } = validationResult.data;

    // Check if there's enough data to generate a summary
    if ((!education || education.length === 0) && (!experience || experience.length === 0)) {
      return NextResponse.json(
        { error: 'Please add education or experience to generate a summary' },
        { status: 400 }
      );
    }

    const summary = await generateCVSummary({
      education: education || [],
      experience: experience || [],
      skills: skills || [],
      targetRole,
      language,
    });

    return NextResponse.json({
      summary,
      language,
    });
  } catch (error) {
    console.error('Error generating AI summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
