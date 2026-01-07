import { NextRequest, NextResponse } from 'next/server';
import { findMatchingFAQ } from '@/lib/data/faq-data';
import { generateChatResponse } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { message, locale = 'en' } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Step 1: Check FAQ database first (free, instant)
    const faqMatch = findMatchingFAQ(message, locale);

    if (faqMatch) {
      return NextResponse.json({
        response: faqMatch.answer[locale as 'en' | 'ar'],
        source: 'faq'
      });
    }

    // Step 2: Fall back to Gemini AI
    const aiResponse = await generateChatResponse(message, locale);

    return NextResponse.json({
      response: aiResponse,
      source: 'ai'
    });

  } catch (error) {
    console.error('Chat API error:', error);

    return NextResponse.json(
      {
        response: 'Sorry, an error occurred. Please try again.',
        source: 'error'
      },
      { status: 500 }
    );
  }
}
