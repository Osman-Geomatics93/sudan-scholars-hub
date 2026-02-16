import { NextRequest, NextResponse } from 'next/server';
import { getGroqApiKey } from '@/lib/env';
import { checkRateLimit, getClientIP, rateLimitedResponse, RATE_LIMITS } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';
import { getBadgeForPoints } from '@/lib/points';

export const dynamic = 'force-dynamic';

const VALID_ENDPOINTS = ['scholarships', 'flashcards', 'quiz', 'materials', 'leaderboard', 'study-tips', 'stats'] as const;
type Endpoint = typeof VALID_ENDPOINTS[number];

const GREETING_RESPONSES: Record<string, string> = {
  en: "Hello! I'm the Sudan Scholars Bot. I can help you find scholarships, study with flashcards, take quizzes, browse materials, check the leaderboard, or get study tips. What would you like to do?",
  ar: "مرحباً! أنا بوت السودان للدراسة. يمكنني مساعدتك في العثور على المنح الدراسية، الدراسة بالبطاقات التعليمية، إجراء اختبارات، تصفح المواد، التحقق من لوحة المتصدرين، أو الحصول على نصائح دراسية. ماذا تريد أن تفعل؟",
};

const UNKNOWN_RESPONSES: Record<string, string> = {
  en: "I'm not sure I understand. Try asking about scholarships, flashcards, quizzes, study materials, the leaderboard, or study tips!",
  ar: "لست متأكداً أنني أفهم. جرب أن تسأل عن المنح الدراسية، البطاقات التعليمية، الاختبارات، المواد الدراسية، لوحة المتصدرين، أو نصائح الدراسة!",
};

const TIPS_EN = [
  "🎯 Use the Pomodoro technique: study for 25 minutes, break for 5. Repeat 4 times, then take a 15-minute break.",
  "📝 Active recall beats re-reading. Close your notes and try to write down what you remember.",
  "🗓️ Space your study sessions. Reviewing material over days is more effective than cramming in one night.",
  "💤 Sleep is essential for memory. Aim for 7-8 hours, especially before exams.",
  "🎵 Try studying with lo-fi music or white noise to improve focus in noisy environments.",
  "📖 Teach what you learn to someone else. If you can explain it simply, you understand it deeply.",
  "🏃 Exercise before studying. A 20-minute walk boosts brain performance and memory retention.",
  "📱 Put your phone in another room while studying. Even its presence reduces cognitive capacity.",
  "✍️ Handwrite your notes. Writing by hand improves retention compared to typing.",
  "🧠 Use flashcards with spaced repetition. Our Study Hub has a built-in SR system!",
];

const TIPS_AR = [
  "🎯 استخدم تقنية بومودورو: ادرس 25 دقيقة، استرح 5 دقائق. كرر 4 مرات ثم خذ استراحة 15 دقيقة.",
  "📝 الاسترجاع النشط أفضل من إعادة القراءة. أغلق ملاحظاتك وحاول كتابة ما تتذكره.",
  "🗓️ وزّع جلسات الدراسة. المراجعة على مدار أيام أكثر فعالية من الحشو في ليلة واحدة.",
  "💤 النوم ضروري للذاكرة. احرص على 7-8 ساعات نوم، خاصة قبل الامتحانات.",
  "🎵 جرب الدراسة مع موسيقى lo-fi أو ضوضاء بيضاء لتحسين التركيز.",
  "📖 علّم ما تتعلمه لشخص آخر. إذا استطعت شرحه ببساطة، فأنت تفهمه بعمق.",
  "🏃 مارس الرياضة قبل الدراسة. المشي 20 دقيقة يعزز أداء الدماغ والذاكرة.",
  "📱 ضع هاتفك في غرفة أخرى أثناء الدراسة. حتى وجوده يقلل القدرة الذهنية.",
  "✍️ اكتب ملاحظاتك بخط اليد. الكتابة اليدوية تحسن الاحتفاظ بالمعلومات مقارنة بالطباعة.",
  "🧠 استخدم البطاقات التعليمية مع التكرار المتباعد. مركز الدراسة لدينا يحتوي على نظام SR!",
];

// ── Intent detection via Groq ──
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

// ── Direct data handlers (no HTTP self-fetch) ──

async function handleScholarships(params: Record<string, string>, lang: string): Promise<{ text: string; count: number }> {
  const where: Record<string, any> = { isPublished: true };
  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: 'insensitive' } },
      { titleAr: { contains: params.search, mode: 'insensitive' } },
      { university: { contains: params.search, mode: 'insensitive' } },
      { country: { contains: params.search, mode: 'insensitive' } },
    ];
  }
  if (params.level) where.levels = { hasSome: params.level.split(',') };
  if (params.funding) where.fundingType = { in: params.funding.split(',') };
  if (params.field) where.field = { in: params.field.split(',') };
  if (params.upcoming === 'true') where.deadline = { gte: new Date() };

  const limit = Math.min(parseInt(params.limit || '5'), 10);
  const scholarships = await prisma.scholarship.findMany({ where, orderBy: { deadline: 'asc' }, take: limit });

  const isAr = lang === 'ar';
  const lines = scholarships.map((s: any, i: number) => {
    const title = isAr ? s.titleAr : s.title;
    const uni = isAr ? s.universityAr : s.university;
    const country = isAr ? s.countryAr : s.country;
    const deadline = s.deadline.toISOString().split('T')[0];
    const fundLabel = s.fundingType === 'FULLY_FUNDED' ? (isAr ? 'ممولة بالكامل' : 'Fully Funded') : (isAr ? 'ممولة جزئياً' : 'Partially Funded');
    return `${i + 1}. *${title}*\n   ${uni} - ${country}\n   ${isAr ? 'الموعد النهائي' : 'Deadline'}: ${deadline} | ${fundLabel}\n   ${s.applicationUrl}`;
  });

  const header = isAr
    ? `📚 *المنح الدراسية* (${scholarships.length} ${scholarships.length === 1 ? 'نتيجة' : 'نتائج'})`
    : `📚 *Scholarships* (${scholarships.length} result${scholarships.length !== 1 ? 's' : ''})`;
  const text = scholarships.length > 0 ? `${header}\n\n${lines.join('\n\n')}` : isAr ? '❌ لم يتم العثور على منح تطابق بحثك.' : '❌ No scholarships found matching your search.';
  return { text, count: scholarships.length };
}

async function handleFlashcards(params: Record<string, string>): Promise<{ text: string; count: number }> {
  const action = params.action || 'random';
  const count = Math.min(parseInt(params.count || '3'), 10);

  if (action === 'decks') {
    const where: Record<string, any> = { isPublic: true };
    if (params.subject) {
      where.OR = [
        { title: { contains: params.subject, mode: 'insensitive' } },
        { subject: { contains: params.subject, mode: 'insensitive' } },
      ];
    }
    const decks = await prisma.flashcardDeck.findMany({ where, take: count, orderBy: { createdAt: 'desc' }, include: { _count: { select: { cards: true } } } });
    const lines = decks.map((d: any, i: number) => `${i + 1}. *${d.title}*${d.subject ? ` (${d.subject})` : ''}\n   ${d._count.cards} cards | ID: \`${d.id}\``);
    const text = decks.length > 0 ? `📂 *Flashcard Decks* (${decks.length})\n\n${lines.join('\n\n')}` : '❌ No public decks found.';
    return { text, count: decks.length };
  }

  if (action === 'due' && params.deckId) {
    const cards = await prisma.flashcard.findMany({ where: { deckId: params.deckId, nextReview: { lte: new Date() } }, take: count, orderBy: { nextReview: 'asc' } });
    const lines = cards.map((c: any, i: number) => `${i + 1}. *Q:* ${c.front}\n   *A:* ||${c.back}||`);
    const text = cards.length > 0 ? `🔔 *Due Cards* (${cards.length})\n\n${lines.join('\n\n')}` : '✅ No cards due for review!';
    return { text, count: cards.length };
  }

  // Default: random cards
  const where: Record<string, any> = { deck: { isPublic: true } };
  if (params.subject) {
    where.deck = { isPublic: true, OR: [{ subject: { contains: params.subject, mode: 'insensitive' } }, { title: { contains: params.subject, mode: 'insensitive' } }] };
  }
  if (params.deckId) where.deckId = params.deckId;

  const total = await prisma.flashcard.count({ where });
  const skip = total > count ? Math.floor(Math.random() * (total - count)) : 0;
  const cards = await prisma.flashcard.findMany({ where, skip, take: count, include: { deck: { select: { title: true } } } });

  const lines = cards.map((c: any, i: number) => `${i + 1}. 📖 *${c.deck.title}*\n   *Q:* ${c.front}\n   *A:* ||${c.back}||`);
  const text = cards.length > 0 ? `🃏 *Random Flashcards* (${cards.length})\n\n${lines.join('\n\n')}\n\n_Tap the spoiler to reveal the answer!_` : '❌ No flashcards found.';
  return { text, count: cards.length };
}

async function handleQuiz(params: Record<string, string>): Promise<{ text: string; count: number }> {
  const count = Math.min(parseInt(params.count || '5'), 10);
  const where: Record<string, any> = {};
  if (params.subject) where.subject = { contains: params.subject, mode: 'insensitive' };

  const total = await prisma.battleQuestion.count({ where });
  const skip = total > count ? Math.floor(Math.random() * (total - count)) : 0;
  const questions = await prisma.battleQuestion.findMany({ where, skip, take: count });

  const lines = questions.map((q: any, i: number) => {
    const options = `  A) ${q.optionA}\n  B) ${q.optionB}\n  C) ${q.optionC}\n  D) ${q.optionD}`;
    return `*${i + 1}. ${q.question}*\n${options}\n✅ Answer: ||${q.correctOption}||`;
  });

  const text = questions.length > 0
    ? `🧠 *Quick Quiz* (${questions.length} question${questions.length !== 1 ? 's' : ''})\n${params.subject ? `Subject: ${params.subject}\n` : ''}\n${lines.join('\n\n')}\n\n_Tap the spoiler to reveal the answer!_`
    : '❌ No quiz questions found for this subject.';
  return { text, count: questions.length };
}

async function handleMaterials(params: Record<string, string>): Promise<{ text: string; count: number }> {
  const limit = Math.min(parseInt(params.limit || '5'), 10);
  const where: Record<string, any> = { status: 'APPROVED' };
  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: 'insensitive' } },
      { subject: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
    ];
  }
  if (params.type) where.type = params.type;

  const materials = await prisma.studyMaterial.findMany({ where, orderBy: { downloadCount: 'desc' }, take: limit });
  const lines = materials.map((m: any, i: number) => {
    const typeIcon = m.type === 'pdf' ? '📄' : m.type === 'video' ? '🎬' : '📁';
    return `${i + 1}. ${typeIcon} *${m.title}*\n   ${m.subject} | ${m.universityName}\n   ⬇️ ${m.downloadCount} downloads | ⭐ ${m.averageRating.toFixed(1)}`;
  });

  const text = materials.length > 0
    ? `📚 *Study Materials* (${materials.length} result${materials.length !== 1 ? 's' : ''})\n\n${lines.join('\n\n')}`
    : '❌ No approved materials found matching your search.';
  return { text, count: materials.length };
}

async function handleLeaderboard(params: Record<string, string>): Promise<{ text: string; count: number }> {
  const limit = Math.min(parseInt(params.limit || '10'), 20);
  const users = await prisma.user.findMany({ where: { points: { gt: 0 } }, orderBy: { points: 'desc' }, take: limit, select: { name: true, points: true, badge: true } });

  const medals = ['🥇', '🥈', '🥉'];
  const lines = users.map((u: any, i: number) => {
    const badge = getBadgeForPoints(u.points);
    const medal = i < 3 ? medals[i] : `${i + 1}.`;
    return `${medal} ${badge.icon} *${u.name || 'Anonymous'}* — ${u.points} pts (${badge.labelEn})`;
  });

  const text = users.length > 0 ? `🏆 *Leaderboard* (Top ${users.length})\n\n${lines.join('\n')}` : '📊 No users on the leaderboard yet.';
  return { text, count: users.length };
}

function handleStudyTips(lang: string): { text: string; count: number } {
  const tips = lang === 'ar' ? TIPS_AR : TIPS_EN;
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const tip = tips[dayOfYear % tips.length];
  const header = lang === 'ar' ? '💡 *نصيحة اليوم*' : "💡 *Today's Study Tip*";
  return { text: `${header}\n\n${tip}`, count: 1 };
}

async function handleStats(): Promise<{ text: string; count: number }> {
  const [users, scholarships, materials, decks, questions] = await Promise.all([
    prisma.user.count(),
    prisma.scholarship.count({ where: { isPublished: true } }),
    prisma.studyMaterial.count({ where: { status: 'APPROVED' } }),
    prisma.flashcardDeck.count({ where: { isPublic: true } }),
    prisma.battleQuestion.count(),
  ]);
  const text = `📊 *Sudan Scholars Hub Stats*\n\n👥 Users: ${users}\n🎓 Scholarships: ${scholarships}\n📚 Study Materials: ${materials}\n🃏 Flashcard Decks: ${decks}\n🧠 Quiz Questions: ${questions}`;
  return { text, count: users + scholarships + materials + decks + questions };
}

// ── Endpoint dispatcher ──
const HANDLERS: Record<Endpoint, (params: Record<string, string>, lang: string) => Promise<{ text: string; count: number }> | { text: string; count: number }> = {
  'scholarships': (p, l) => handleScholarships(p, l),
  'flashcards': (p) => handleFlashcards(p),
  'quiz': (p) => handleQuiz(p),
  'materials': (p) => handleMaterials(p),
  'leaderboard': (p) => handleLeaderboard(p),
  'study-tips': (_p, l) => handleStudyTips(l),
  'stats': () => handleStats(),
};

// ── POST handler ──
export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const { success, resetTime } = checkRateLimit(`bot-chat:${ip}`, RATE_LIMITS.bot.limit, RATE_LIMITS.bot.windowMs);
  if (!success) return rateLimitedResponse(resetTime) as unknown as NextResponse;

  try {
    const body = await request.json();
    const { message, lang } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const intent = await detectIntent(message.trim());
    const detectedLang = lang || intent.lang || 'en';

    if (intent.endpoint === 'greeting') {
      return NextResponse.json({ response: GREETING_RESPONSES[detectedLang] || GREETING_RESPONSES.en, intent: 'greeting', count: 0 });
    }

    if (intent.endpoint === 'unknown' || !VALID_ENDPOINTS.includes(intent.endpoint as any)) {
      return NextResponse.json({ response: UNKNOWN_RESPONSES[detectedLang] || UNKNOWN_RESPONSES.en, intent: 'unknown', count: 0 });
    }

    const handler = HANDLERS[intent.endpoint as Endpoint];
    const params = intent.params || {};
    if (detectedLang) params.lang = detectedLang;

    const data = await handler(params, detectedLang);

    return NextResponse.json({ response: data.text, intent: intent.endpoint, count: data.count });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
