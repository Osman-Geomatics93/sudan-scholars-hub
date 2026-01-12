import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1',
});

export interface SuggestionContext {
  sectionName: string;
  fieldName: string;
  currentText: string;
  fieldOfStudy?: string;
  universityName?: string;
  programName?: string;
  language: 'en' | 'tr' | 'ar';
}

const SYSTEM_PROMPT_EN = `You are an expert advisor helping students write compelling Letters of Intent for the Turkiye Scholarships program. Your suggestions should:

1. Be SPECIFIC - include concrete details, numbers, names, dates
2. Avoid cliches like "since childhood", "my dream", "passionate about"
3. Focus on RESULTS and IMPACT, not just activities
4. Use professional but engaging language
5. Be concise - one to two sentences maximum

When suggesting improvements:
- If the text is too generic, suggest adding specific metrics or examples
- If the text contains cliches, offer a more authentic alternative
- If the text lacks impact, suggest focusing on measurable outcomes
- Always maintain the student's voice - don't rewrite completely

Respond with ONLY the suggested improvement or example text. No explanations, no "Here's a suggestion:" prefix.`;

const SYSTEM_PROMPT_TR = `Turkiye Burslari programi icin ikna edici Niyet Mektubu yazmada ogrencilere yardimci olan uzman bir danismansiniz. Onerileriniz:

1. SPESIFIK olmali - somut detaylar, sayilar, isimler, tarihler icermeli
2. "Cocuklugumdan beri", "hayalim" gibi kliselerden kacinmali
3. Sadece aktivitelere degil, SONUCLARA ve ETKIYE odaklanmali
4. Profesyonel ama ilgi cekici bir dil kullanmali
5. Kisa olmali - en fazla bir iki cumle

SADECE onerilen iyilestirme veya ornek metinle yanitlayin. Aciklama yok, "Iste bir oneri:" gibi on ekler yok.`;

const SYSTEM_PROMPT_AR = `أنت مستشار خبير تساعد الطلاب في كتابة خطابات نوايا مقنعة لبرنامج المنح التركية. يجب أن تكون اقتراحاتك:

1. محددة - تتضمن تفاصيل ملموسة وأرقام وأسماء وتواريخ
2. تتجنب العبارات المبتذلة مثل "منذ الطفولة"، "حلمي"، "شغفي"
3. تركز على النتائج والأثر، وليس فقط الأنشطة
4. تستخدم لغة مهنية وجذابة
5. موجزة - جملة أو جملتان كحد أقصى

عند اقتراح التحسينات:
- إذا كان النص عامًا جدًا، اقترح إضافة مقاييس أو أمثلة محددة
- إذا كان النص يحتوي على عبارات مبتذلة، قدم بديلاً أكثر أصالة
- إذا كان النص يفتقر إلى التأثير، اقترح التركيز على نتائج قابلة للقياس
- حافظ دائمًا على صوت الطالب - لا تعيد الكتابة بالكامل

أجب فقط بالتحسين المقترح أو النص النموذجي. بدون شرح، بدون بادئة "إليك اقتراح:".`;

// Section-specific prompts
const SECTION_PROMPTS: Record<string, { en: string; tr: string; ar: string }> = {
  hook: {
    en: 'This is the opening statement that should grab attention and clearly state direction. Make it specific and memorable.',
    tr: 'Bu, dikkat cekmeli ve yonu acikca belirtmeli olan acilis ifadesidir. Spesifik ve akilda kalici yapin.',
    ar: 'هذه العبارة الافتتاحية يجب أن تجذب الانتباه وتحدد الاتجاه بوضوح. اجعلها محددة ولا تُنسى.',
  },
  academic: {
    en: 'This section should demonstrate academic readiness with specific courses, GPA, projects, and measurable achievements.',
    tr: 'Bu bolum, belirli dersler, not ortalamasi, projeler ve olculebilir basarilarla akademik hazirlik gostermeli.',
    ar: 'يجب أن يُظهر هذا القسم الاستعداد الأكاديمي مع دورات محددة ومعدل تراكمي ومشاريع وإنجازات قابلة للقياس.',
  },
  whyScholarship: {
    en: 'This section should explain specific reasons for choosing Turkiye Scholarships, not generic praise.',
    tr: 'Bu bolum, genel ovgu degil, Turkiye Burslarini secmenin spesifik nedenlerini aciklamali.',
    ar: 'يجب أن يوضح هذا القسم أسبابًا محددة لاختيار المنح التركية، وليس مديحًا عامًا.',
  },
  whyTurkey: {
    en: 'This section should mention specific universities, programs, professors, or research that attracted the applicant.',
    tr: 'Bu bolum, basvuru sahibini ceken belirli universiteleri, programlari, profesorleri veya arastirmalari belirtmeli.',
    ar: 'يجب أن يذكر هذا القسم جامعات أو برامج أو أساتذة أو أبحاث محددة جذبت المتقدم.',
  },
  leadership: {
    en: 'This STAR-format story should include specific numbers, outcomes, and lessons learned from a leadership experience.',
    tr: 'Bu STAR formatindaki hikaye, bir liderlik deneyiminden ogrenilen belirli sayilari, sonuclari ve dersleri icermeli.',
    ar: 'يجب أن تتضمن هذه القصة بصيغة STAR أرقامًا ونتائج ودروسًا مستفادة من تجربة قيادية.',
  },
  future: {
    en: 'Future goals should be measurable with specific timelines, numbers, and concrete plans for community impact.',
    tr: 'Gelecek hedefleri, belirli zaman cizgileri, sayilar ve topluluk etkisi icin somut planlarla olculebilir olmali.',
    ar: 'يجب أن تكون الأهداف المستقبلية قابلة للقياس مع جداول زمنية وأرقام وخطط ملموسة للتأثير المجتمعي.',
  },
  closing: {
    en: 'The closing should express genuine commitment and gratitude without being generic.',
    tr: 'Kapanis, genel olmadan gercek baglilik ve minnettarlik ifade etmeli.',
    ar: 'يجب أن يعبر الختام عن التزام حقيقي وامتنان دون أن يكون عامًا.',
  },
};

// Field-specific improvement suggestions
const FIELD_HINTS: Record<string, { en: string; tr: string; ar: string }> = {
  openingStatement: {
    en: 'Start with your unique angle - what makes your story different? Mention your specific field and a concrete goal.',
    tr: 'Benzersiz acinizla baslayin - hikayenizi farkli kilan ne? Spesifik alaninizi ve somut bir hedefinizi belirtin.',
    ar: 'ابدأ بزاويتك الفريدة - ما الذي يجعل قصتك مختلفة؟ اذكر مجالك المحدد وهدفًا ملموسًا.',
  },
  result: {
    en: 'Add NUMBERS: How many people impacted? What percentage improvement? What was the measurable outcome?',
    tr: 'SAYILAR ekleyin: Kac kisi etkilendi? Yuzde kac iyilesme? Olculebilir sonuc ne oldu?',
    ar: 'أضف أرقامًا: كم عدد الأشخاص المتأثرين؟ ما نسبة التحسن؟ ما هي النتيجة القابلة للقياس؟',
  },
  measurableOutcomes: {
    en: 'Be specific: "Train 500 teachers" not "help education". Include timelines and metrics.',
    tr: 'Spesifik olun: "Egitime yardim" degil "500 ogretmen yetistir". Zaman cizgileri ve metrikler ekleyin.',
    ar: 'كن محددًا: "تدريب 500 معلم" وليس "مساعدة التعليم". أضف جداول زمنية ومقاييس.',
  },
  whyThisProgram: {
    en: 'Mention a specific professor, research lab, course, or unique program feature that attracted you.',
    tr: 'Sizi ceken belirli bir profesor, arastirma laboratuvari, ders veya benzersiz program ozelligi belirtin.',
    ar: 'اذكر أستاذًا أو مختبر أبحاث أو مقررًا أو ميزة برنامج فريدة جذبتك.',
  },
  academicAchievements: {
    en: 'Include rankings, percentages, award names, and competition results with specific numbers.',
    tr: 'Spesifik sayilarla siralamalar, yuzdeler, odul adlari ve yarisma sonuclari ekleyin.',
    ar: 'أضف التصنيفات والنسب المئوية وأسماء الجوائز ونتائج المسابقات بأرقام محددة.',
  },
};

export async function generateLOISuggestion(context: SuggestionContext): Promise<string> {
  const { sectionName, fieldName, currentText, fieldOfStudy, universityName, programName, language } = context;

  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('Groq API key not configured');
    }

    const systemPrompt = language === 'ar'
      ? SYSTEM_PROMPT_AR
      : language === 'tr'
        ? SYSTEM_PROMPT_TR
        : SYSTEM_PROMPT_EN;
    const sectionInfo = SECTION_PROMPTS[sectionName]?.[language] || SECTION_PROMPTS[sectionName]?.en || '';
    const fieldHint = FIELD_HINTS[fieldName]?.[language] || FIELD_HINTS[fieldName]?.en || '';

    const userPrompt = language === 'ar'
      ? `معلومات الطالب:
${fieldOfStudy ? `مجال الدراسة: ${fieldOfStudy}` : ''}
${universityName ? `الجامعة المستهدفة: ${universityName}` : ''}
${programName ? `البرنامج المستهدف: ${programName}` : ''}

القسم: ${sectionName}
الحقل: ${fieldName}
${sectionInfo}
${fieldHint ? `تلميح: ${fieldHint}` : ''}

النص الحالي:
"${currentText || '(فارغ)'}"

${currentText
  ? 'قدم اقتراحًا ملموسًا واحدًا أو جملة بديلة لجعل هذا النص أكثر تحديدًا وتأثيرًا.'
  : 'قدم جملة نموذجية واحدة بتفاصيل محددة لهذا الحقل.'}`
      : language === 'tr'
        ? `Ogrenci Bilgileri:
${fieldOfStudy ? `Calisma Alani: ${fieldOfStudy}` : ''}
${universityName ? `Hedef Universite: ${universityName}` : ''}
${programName ? `Hedef Program: ${programName}` : ''}

Bolum: ${sectionName}
Alan: ${fieldName}
${sectionInfo}
${fieldHint ? `Ipucu: ${fieldHint}` : ''}

Mevcut metin:
"${currentText || '(bos)'}"

${currentText
  ? 'Bu metni daha spesifik ve etkili hale getirmek icin BIR somut oneri veya alternatif cumle saglayin.'
  : 'Bu alan icin spesifik detaylar iceren BIR ornek cumle saglayin.'}`
        : `Student Information:
${fieldOfStudy ? `Field of Study: ${fieldOfStudy}` : ''}
${universityName ? `Target University: ${universityName}` : ''}
${programName ? `Target Program: ${programName}` : ''}

Section: ${sectionName}
Field: ${fieldName}
${sectionInfo}
${fieldHint ? `Hint: ${fieldHint}` : ''}

Current text:
"${currentText || '(empty)'}"

${currentText
  ? 'Provide ONE concrete suggestion or alternative sentence to make this text more specific and impactful.'
  : 'Provide ONE example sentence with specific details for this field.'}`;

    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content;

    if (!text) {
      throw new Error('No response from AI');
    }

    // Clean up the response
    return text.trim().replace(/^["']|["']$/g, '');

  } catch (error) {
    console.error('AI suggestion generation error:', error);

    // Return a fallback suggestion
    const fallback = FIELD_HINTS[fieldName] || SECTION_PROMPTS[sectionName];
    if (fallback) {
      return fallback[language] || fallback.en;
    }

    return language === 'ar'
      ? 'تعذر إنشاء الاقتراح. يرجى المحاولة مرة أخرى أو استخدام الأسئلة الإرشادية أعلاه.'
      : language === 'tr'
        ? 'Oneri olusturulamadi. Lutfen tekrar deneyin veya yukardaki yol gosterici sorulari kullanin.'
        : 'Unable to generate suggestion. Please try again or use the guiding questions above.';
  }
}

// Quick quality check with AI
export async function getQuickQualityFeedback(
  fullText: string,
  language: 'en' | 'tr' | 'ar' = 'en'
): Promise<string> {
  try {
    if (!process.env.GROQ_API_KEY || fullText.length < 100) {
      return '';
    }

    const prompt = language === 'ar'
      ? `قدم جملة أو جملتين من التعليقات السريعة على نص خطاب النوايا هذا. ما هي أكبر نقطة ضعف أو مجال للتحسين؟

"${fullText.substring(0, 1500)}"

تعليقات موجزة ومحددة:`
      : language === 'tr'
        ? `Bu Niyet Mektubu metni icin 1-2 cumlelik hizli geri bildirim saglayin. En buyuk zayiflik veya iyilestirme alani nedir?

"${fullText.substring(0, 1500)}"

Kisa ve somut geri bildirim:`
        : `Provide 1-2 sentences of quick feedback for this Letter of Intent text. What is the biggest weakness or area for improvement?

"${fullText.substring(0, 1500)}"

Brief and specific feedback:`;

    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
      temperature: 0.5,
    });

    return completion.choices[0]?.message?.content?.trim() || '';

  } catch (error) {
    console.error('Quick feedback error:', error);
    return '';
  }
}
