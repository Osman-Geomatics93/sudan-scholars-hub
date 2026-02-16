import { NextRequest, NextResponse } from 'next/server';
import { getGroqApiKey, getBotApiKey } from '@/lib/env';
import { checkRateLimit, getClientIP, rateLimitedResponse, RATE_LIMITS } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const VALID_ENDPOINTS = ['scholarships', 'flashcards', 'quiz', 'materials', 'leaderboard', 'study-tips', 'stats'] as const;

const GREETING_RESPONSES: Record<string, string> = {
  en: "Hello! I'm the Sudan Scholars Bot. I can help you find scholarships, study with flashcards, take quizzes, browse materials, check the leaderboard, or get study tips. What would you like to do?",
  ar: "مرحباً! أنا بوت السودان للدراسة. يمكنني مساعدتك في العثور على المنح الدراسية، الدراسة بالبطاقات التعليمية، إجراء اختبارات، تصفح المواد، التحقق من لوحة المتصدرين، أو الحصول على نصائح دراسية. ماذا تريد أن تفعل؟",
};

const UNKNOWN_RESPONSES: Record<string, string> = {
  en: "I'm not sure I understand. Try asking about scholarships, flashcards, quizzes, study materials, the leaderboard, or study tips!",
  ar: "لست متأكداً أنني أفهم. جرب أن تسأل عن المنح الدراسية، البطاقات التعليمية، الاختبارات، المواد الدراسية، لوحة المتصدرين، أو نصائح الدراسة!",
};

async function detectIntent(userMessage: string): Promise<{ endpoint: string; params: Record<string, string>; lang: string }> {
  const systemPrompt = `You are an intent classifier for a scholarship bot. Given a user message, return a JSON object with:
- "endpoint": one of "scholarships", "flashcards", "quiz", "materials", "leaderboard", "study-tips", "stats", "greeting", "unknown"
- "params": an object of query parameters to pass to the API
- "lang": "en" or "ar" based on the user's language

Parameter rules:
- scholarships: search (string), level (BACHELOR,MASTER,PHD), funding (FULLY_FUNDED,PARTIALLY_FUNDED), field (ENGINEERING,MEDICINE,BUSINESS,ARTS,SCIENCE,LAW,EDUCATION,TECHNOLOGY), upcoming ("true"), limit (1-10)
- flashcards: action ("random","decks","due"), subject (string), count (1-10), deckId (string)
- quiz: subject (string), count (1-10)
- materials: search (string), type ("pdf","docx","pptx","video"), limit (1-10)
- leaderboard: limit (1-20)
- study-tips: lang ("en" or "ar")
- stats: no params

Only return valid JSON. No explanation.`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getGroqApiKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.1,
        max_tokens: 256,
        response_format: { type: 'json_object' },
      }),
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    return JSON.parse(content);
  } catch (err) {
    console.error('Groq intent detection error:', err);
    return { endpoint: 'unknown', params: {}, lang: 'en' };
  }
}

export async function POST(request: NextRequest) {
  // Rate limit by IP
  const ip = getClientIP(request);
  const { success, resetTime } = checkRateLimit(
    `bot-chat:${ip}`,
    RATE_LIMITS.bot.limit,
    RATE_LIMITS.bot.windowMs
  );
  if (!success) {
    return rateLimitedResponse(resetTime) as unknown as NextResponse;
  }

  try {
    const body = await request.json();
    const { message, lang } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Detect intent via Groq
    const intent = await detectIntent(message.trim());
    const detectedLang = lang || intent.lang || 'en';

    // Handle greeting
    if (intent.endpoint === 'greeting') {
      return NextResponse.json({
        response: GREETING_RESPONSES[detectedLang] || GREETING_RESPONSES.en,
        intent: 'greeting',
        count: 0,
      });
    }

    // Handle unknown
    if (intent.endpoint === 'unknown' || !VALID_ENDPOINTS.includes(intent.endpoint as any)) {
      return NextResponse.json({
        response: UNKNOWN_RESPONSES[detectedLang] || UNKNOWN_RESPONSES.en,
        intent: 'unknown',
        count: 0,
      });
    }

    // Call the appropriate bot API endpoint server-side
    const baseUrl = process.env.NEXTAUTH_URL
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
      || 'http://localhost:3000';

    const url = new URL(`${baseUrl}/api/bot/${intent.endpoint}`);

    // Add detected params
    const params = intent.params || {};
    if (detectedLang) params.lang = detectedLang;
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        url.searchParams.set(k, String(v));
      }
    });

    const apiResponse = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-Bot-API-Key': getBotApiKey(),
        'Content-Type': 'application/json',
      },
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error(`Bot API error (${intent.endpoint}):`, apiResponse.status, errorText);
      return NextResponse.json({
        response: detectedLang === 'ar'
          ? 'عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.'
          : 'Sorry, an error occurred while processing your request. Please try again.',
        intent: intent.endpoint,
        count: 0,
      });
    }

    const data = await apiResponse.json();

    return NextResponse.json({
      response: data.text || data.message || JSON.stringify(data),
      intent: intent.endpoint,
      count: data.count ?? 0,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
