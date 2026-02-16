import { NextRequest, NextResponse } from 'next/server';
import { requireBotAuth } from '@/lib/bot-auth';

export const dynamic = 'force-dynamic';

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

export async function GET(request: NextRequest) {
  const authError = requireBotAuth(request);
  if (authError) return authError;

  const params = request.nextUrl.searchParams;
  const lang = params.get('lang') || 'en';

  const tips = lang === 'ar' ? TIPS_AR : TIPS_EN;

  // Rotate by day of year
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const tipIndex = dayOfYear % tips.length;
  const tip = tips[tipIndex];

  const header = lang === 'ar' ? '💡 *نصيحة اليوم*' : "💡 *Today's Study Tip*";
  const text = `${header}\n\n${tip}`;

  return NextResponse.json({ text, count: 1 });
}
