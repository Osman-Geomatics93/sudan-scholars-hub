import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: 'https://api.deepseek.com',
});

const SYSTEM_PROMPT = `You are a helpful scholarship assistant for Sudan Scholars Hub - a website that helps Sudanese students find and apply for international scholarships.

Your role:
- Help students find suitable scholarships
- Answer questions about application processes
- Provide guidance on documents, deadlines, and eligibility
- Be encouraging and supportive

Key information you should know:
- Türkiye Burslari (Turkish Government Scholarship) is one of the most popular fully-funded scholarships
  - Benefits: Full tuition, monthly stipend (5,000-9,000 TL), free dormitory, health insurance, flight tickets, 1-year Turkish course
  - Age limits: Under 21 (Bachelor), Under 30 (Master), Under 35 (PhD)
  - GPA requirements: 70% for Bachelor, 75% for Master/PhD
  - Application period: Usually January-February

- Other popular scholarships: DAAD (Germany), Fulbright (USA), Chevening (UK), MEXT (Japan)

- The website offers:
  - Scholarship listings with filters
  - Downloadable document templates (recommendation letters, transcript forms)
  - Application guides and tips
  - Scholarship calendar for deadlines
  - Telegram community channel

Guidelines:
- Keep responses concise (2-4 sentences when possible)
- Be friendly and encouraging
- If you don't know something specific, suggest contacting the website team or checking the specific scholarship page
- Respond in the same language as the user's question (English or Arabic)
- Use bullet points for lists
- Always be accurate - don't make up information

Remember: You're helping students achieve their dreams of studying abroad!`;

export async function generateChatResponse(message: string, locale: string = 'en'): Promise<string> {
  try {
    if (!process.env.DEEPSEEK_API_KEY) {
      throw new Error('DeepSeek API key not configured');
    }

    const languageInstruction = locale === 'ar'
      ? 'The user is writing in Arabic. Please respond in Arabic.'
      : 'The user is writing in English. Please respond in English.';

    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: `${SYSTEM_PROMPT}\n\n${languageInstruction}` },
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content;

    return text || (locale === 'ar'
      ? 'عذراً، لم أتمكن من معالجة طلبك. يرجى المحاولة مرة أخرى.'
      : 'Sorry, I couldn\'t process your request. Please try again.');

  } catch (error) {
    console.error('DeepSeek API error:', error);

    return locale === 'ar'
      ? 'عذراً، أواجه مشكلة تقنية حالياً. يمكنك زيارة صفحة اتصل بنا للتواصل مع فريقنا مباشرة، أو الانضمام لقناتنا على تيليجرام للمساعدة.'
      : 'Sorry, I\'m experiencing technical difficulties. You can visit our Contact page to reach our team directly, or join our Telegram channel for help.';
  }
}
