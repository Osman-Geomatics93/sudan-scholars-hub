export interface FAQItem {
  id: string;
  keywords: string[];
  question: {
    en: string;
    ar: string;
  };
  answer: {
    en: string;
    ar: string;
  };
  category: 'general' | 'turkey' | 'application' | 'documents' | 'navigation';
}

export const faqData: FAQItem[] = [
  // General Scholarships
  {
    id: 'what-scholarships',
    keywords: ['scholarships available', 'what scholarships', 'list scholarships', 'منح متاحة', 'ما المنح'],
    question: {
      en: 'What scholarships are available?',
      ar: 'ما هي المنح الدراسية المتاحة؟'
    },
    answer: {
      en: 'We feature scholarships from many countries including Turkey (Türkiye Burslari), Germany (DAAD), USA (Fulbright), UK (Chevening), and more. Visit our Scholarships page to browse all available opportunities and filter by country, study level, and field.',
      ar: 'نقدم منحًا من دول عديدة منها تركيا (تركيا بورسلاري)، ألمانيا (DAAD)، أمريكا (فولبرايت)، بريطانيا (تشيفنينج) وغيرها. زر صفحة المنح لتصفح جميع الفرص المتاحة والتصفية حسب الدولة ومستوى الدراسة والتخصص.'
    },
    category: 'general'
  },
  {
    id: 'how-to-apply',
    keywords: ['apply', 'application', 'applying', 'تقديم', 'أقدم'],
    question: {
      en: 'How do I apply for a scholarship?',
      ar: 'كيف أقدم على منحة دراسية؟'
    },
    answer: {
      en: '1. Browse our scholarships page and find one that matches your profile. 2. Check the eligibility requirements and deadline. 3. Prepare required documents (transcripts, recommendation letters, motivation letter). 4. Click "Apply Now" to go to the official application portal. 5. Submit before the deadline!',
      ar: '1. تصفح صفحة المنح واختر منحة تناسب ملفك. 2. تحقق من شروط الأهلية والموعد النهائي. 3. جهز المستندات المطلوبة (كشف الدرجات، خطابات التوصية، خطاب الدافع). 4. اضغط "قدم الآن" للذهاب لبوابة التقديم الرسمية. 5. قدم قبل الموعد النهائي!'
    },
    category: 'general'
  },
  {
    id: 'eligibility',
    keywords: ['eligible', 'eligibility', 'qualify', 'requirements', 'مؤهل', 'أهلية', 'شروط', 'متطلبات'],
    question: {
      en: 'Am I eligible for scholarships?',
      ar: 'هل أنا مؤهل للمنح الدراسية؟'
    },
    answer: {
      en: 'Eligibility varies by scholarship. Common requirements include: minimum GPA (usually 70-80%), age limits, nationality restrictions, and language proficiency. Each scholarship page lists specific requirements. Most scholarships welcome Sudanese students!',
      ar: 'تختلف الأهلية حسب المنحة. المتطلبات الشائعة تشمل: الحد الأدنى للمعدل (عادة 70-80%)، حدود العمر، قيود الجنسية، وإتقان اللغة. كل صفحة منحة تذكر المتطلبات المحددة. معظم المنح ترحب بالطلاب السودانيين!'
    },
    category: 'general'
  },
  {
    id: 'deadlines',
    keywords: ['deadline', 'deadlines', 'due date', 'موعد', 'مواعيد', 'الموعد النهائي'],
    question: {
      en: 'What are the scholarship deadlines?',
      ar: 'ما هي مواعيد المنح الدراسية؟'
    },
    answer: {
      en: 'Deadlines vary by scholarship. Türkiye Burslari usually opens in January-February. Check our Calendar page to see all upcoming deadlines. We recommend applying at least 2 weeks before the deadline to avoid last-minute issues.',
      ar: 'تختلف المواعيد حسب المنحة. تركيا بورسلاري عادة تفتح في يناير-فبراير. تحقق من صفحة التقويم لمعرفة جميع المواعيد القادمة. ننصح بالتقديم قبل أسبوعين على الأقل من الموعد النهائي لتجنب مشاكل اللحظة الأخيرة.'
    },
    category: 'general'
  },

  // Turkey Scholarships
  {
    id: 'turkey-burslari',
    keywords: ['turkey', 'türkiye', 'burslari', 'turkish', 'تركيا', 'بورسلاري', 'التركية'],
    question: {
      en: 'What is Türkiye Burslari?',
      ar: 'ما هي منحة تركيا بورسلاري؟'
    },
    answer: {
      en: 'Türkiye Burslari is the Turkish Government Scholarship - one of the most prestigious fully-funded scholarships for international students. It covers Bachelor\'s, Master\'s, and PhD programs at top Turkish universities. It\'s highly competitive but very rewarding!',
      ar: 'تركيا بورسلاري هي منحة الحكومة التركية - واحدة من أرقى المنح الممولة بالكامل للطلاب الدوليين. تغطي برامج البكالوريوس والماجستير والدكتوراه في أفضل الجامعات التركية. تنافسية للغاية لكنها مجزية جداً!'
    },
    category: 'turkey'
  },
  {
    id: 'turkey-benefits',
    keywords: ['benefits', 'stipend', 'salary', 'coverage', 'مزايا', 'راتب', 'تغطية'],
    question: {
      en: 'What are the benefits of Türkiye Burslari?',
      ar: 'ما هي مزايا منحة تركيا بورسلاري؟'
    },
    answer: {
      en: 'Türkiye Burslari offers: ✅ Full tuition coverage ✅ Monthly stipend (Bachelor: 5,000 TL, Master: 7,000 TL, PhD: 9,000 TL) ✅ Free university dormitory ✅ Health insurance ✅ Round-trip flight tickets ✅ One-year Turkish language course',
      ar: 'تقدم تركيا بورسلاري: ✅ تغطية كاملة للرسوم الدراسية ✅ راتب شهري (بكالوريوس: 5,000 ليرة، ماجستير: 7,000 ليرة، دكتوراه: 9,000 ليرة) ✅ سكن جامعي مجاني ✅ تأمين صحي ✅ تذاكر طيران ذهاب وإياب ✅ دورة لغة تركية لمدة سنة'
    },
    category: 'turkey'
  },
  {
    id: 'turkey-age',
    keywords: ['age', 'limit', 'old', 'years', 'عمر', 'سن', 'حد'],
    question: {
      en: 'What is the age limit for Türkiye Burslari?',
      ar: 'ما هو حد العمر لمنحة تركيا بورسلاري؟'
    },
    answer: {
      en: 'Age limits for Türkiye Burslari: Bachelor\'s: under 21 years old, Master\'s: under 30 years old, PhD: under 35 years old. Age is calculated based on January 1st of the application year.',
      ar: 'حدود العمر لتركيا بورسلاري: بكالوريوس: أقل من 21 سنة، ماجستير: أقل من 30 سنة، دكتوراه: أقل من 35 سنة. يحسب العمر بناءً على 1 يناير من سنة التقديم.'
    },
    category: 'turkey'
  },
  {
    id: 'turkey-documents',
    keywords: ['documents', 'papers', 'required documents', 'مستندات', 'أوراق', 'الأوراق المطلوبة'],
    question: {
      en: 'What documents do I need for Türkiye Burslari?',
      ar: 'ما المستندات المطلوبة لمنحة تركيا بورسلاري؟'
    },
    answer: {
      en: 'Required documents: 📄 Passport or ID 📄 Photo 📄 High school/university transcripts 📄 Graduation certificate (or expected graduation letter) 📄 Language proficiency certificate (if available) 📄 Recommendation letters 📄 Motivation letter. Visit our Turkey page to download helpful templates!',
      ar: 'المستندات المطلوبة: 📄 جواز سفر أو هوية 📄 صورة شخصية 📄 كشف درجات الثانوية/الجامعة 📄 شهادة التخرج (أو خطاب التخرج المتوقع) 📄 شهادة إتقان اللغة (إن وجدت) 📄 خطابات التوصية 📄 خطاب الدافع. زر صفحة تركيا لتحميل النماذج المفيدة!'
    },
    category: 'turkey'
  },
  {
    id: 'turkey-gpa',
    keywords: ['gpa', 'grade', 'percentage', 'marks', 'معدل', 'درجات', 'نسبة'],
    question: {
      en: 'What GPA do I need for Türkiye Burslari?',
      ar: 'ما المعدل المطلوب لمنحة تركيا بورسلاري؟'
    },
    answer: {
      en: 'Minimum GPA requirements: Bachelor\'s: 70% (or equivalent), Master\'s and PhD: 75% (or equivalent). However, competitive applicants usually have 80%+ GPA. Strong motivation letter and recommendation letters can compensate for slightly lower grades.',
      ar: 'الحد الأدنى للمعدل: بكالوريوس: 70% (أو ما يعادلها)، ماجستير ودكتوراه: 75% (أو ما يعادلها). لكن المتقدمين المنافسين عادة لديهم معدل 80%+. خطاب الدافع القوي وخطابات التوصية يمكن أن تعوض الدرجات المنخفضة قليلاً.'
    },
    category: 'turkey'
  },

  // Application Help
  {
    id: 'motivation-letter',
    keywords: ['motivation letter', 'personal statement', 'statement of purpose', 'خطاب الدافع', 'بيان الغرض'],
    question: {
      en: 'How do I write a motivation letter?',
      ar: 'كيف أكتب خطاب الدافع؟'
    },
    answer: {
      en: 'Tips for a strong motivation letter: 1. Start with a hook - why this scholarship? 2. Share your academic journey and achievements 3. Explain your future goals and how this scholarship helps 4. Show knowledge about the country/university 5. Be specific and personal - avoid generic statements 6. Proofread carefully! Keep it 500-1000 words.',
      ar: 'نصائح لخطاب دافع قوي: 1. ابدأ بمقدمة جذابة - لماذا هذه المنحة؟ 2. شارك رحلتك الأكاديمية وإنجازاتك 3. اشرح أهدافك المستقبلية وكيف تساعدك المنحة 4. أظهر معرفتك بالدولة/الجامعة 5. كن محدداً وشخصياً - تجنب العبارات العامة 6. راجع بعناية! اجعله 500-1000 كلمة.'
    },
    category: 'application'
  },
  {
    id: 'recommendation-letter',
    keywords: ['recommendation', 'reference', 'professor', 'teacher', 'توصية', 'تزكية', 'أستاذ', 'معلم'],
    question: {
      en: 'How do I get recommendation letters?',
      ar: 'كيف أحصل على خطابات التوصية؟'
    },
    answer: {
      en: 'Tips for recommendation letters: 1. Ask professors/teachers who know you well 2. Give them at least 2-3 weeks notice 3. Provide them with your CV and the scholarship details 4. Choose people who can speak to your academic abilities and character 5. Follow up politely. Visit our Turkey page for sample templates!',
      ar: 'نصائح لخطابات التوصية: 1. اطلب من أساتذة/معلمين يعرفونك جيداً 2. أعطهم مهلة 2-3 أسابيع على الأقل 3. زودهم بسيرتك الذاتية وتفاصيل المنحة 4. اختر أشخاصاً يمكنهم التحدث عن قدراتك الأكاديمية وشخصيتك 5. تابع بأدب. زر صفحة تركيا لنماذج جاهزة!'
    },
    category: 'application'
  },
  {
    id: 'multiple-applications',
    keywords: ['multiple', 'many', 'several', 'more than one', 'متعددة', 'عديدة', 'أكثر من'],
    question: {
      en: 'Can I apply to multiple scholarships?',
      ar: 'هل يمكنني التقديم على أكثر من منحة؟'
    },
    answer: {
      en: 'Yes! We encourage applying to multiple scholarships to increase your chances. Just make sure to: 1. Meet eligibility for each 2. Customize your application for each scholarship 3. Track all deadlines carefully 4. Don\'t copy-paste the same motivation letter. Quality over quantity!',
      ar: 'نعم! نشجع على التقديم لمنح متعددة لزيادة فرصك. فقط تأكد من: 1. استيفاء الأهلية لكل منحة 2. تخصيص طلبك لكل منحة 3. تتبع جميع المواعيد بعناية 4. لا تنسخ نفس خطاب الدافع. الجودة أهم من الكمية!'
    },
    category: 'application'
  },

  // Website Navigation
  {
    id: 'find-scholarships',
    keywords: ['find scholarships', 'search scholarships', 'browse scholarships', 'scholarship page', 'أجد المنح', 'بحث المنح', 'صفحة المنح'],
    question: {
      en: 'Where can I find scholarships on this website?',
      ar: 'أين أجد المنح على هذا الموقع؟'
    },
    answer: {
      en: 'You can find scholarships in several ways: 1. Click "Scholarships" in the navigation menu 2. Use the search bar on the home page 3. Visit the Calendar page for upcoming deadlines 4. Check the Turkey page for Turkish scholarship resources. Use filters to narrow down by country, level, and field!',
      ar: 'يمكنك إيجاد المنح بعدة طرق: 1. اضغط "المنح" في قائمة التنقل 2. استخدم شريط البحث في الصفحة الرئيسية 3. زر صفحة التقويم للمواعيد القادمة 4. تحقق من صفحة تركيا لموارد المنح التركية. استخدم الفلاتر للتصفية حسب الدولة والمستوى والتخصص!'
    },
    category: 'navigation'
  },
  {
    id: 'download-documents',
    keywords: ['download', 'template', 'form', 'pdf', 'تحميل', 'نموذج', 'ملف'],
    question: {
      en: 'How do I download document templates?',
      ar: 'كيف أحمل نماذج المستندات؟'
    },
    answer: {
      en: 'Visit our Turkey page to download helpful templates including: recommendation letter samples, transcript forms, English certificate templates, and our comprehensive application guide. All documents are available in PDF and DOCX formats.',
      ar: 'زر صفحة تركيا لتحميل نماذج مفيدة تشمل: نماذج خطابات التوصية، نماذج كشف الدرجات، نماذج شهادة اللغة الإنجليزية، ودليلنا الشامل للتقديم. جميع المستندات متاحة بصيغة PDF و DOCX.'
    },
    category: 'navigation'
  },
  {
    id: 'contact-us',
    keywords: ['contact us', 'contact team', 'reach you', 'get support', 'تواصل معكم', 'اتصل بنا'],
    question: {
      en: 'How can I contact you for more help?',
      ar: 'كيف أتواصل معكم للمزيد من المساعدة؟'
    },
    answer: {
      en: 'You can reach us through: 1. Contact page - fill out the form 2. Telegram channel - join for updates and community support 3. Email: 424236@ogr.ktu.edu.tr. We typically respond within 24-48 hours!',
      ar: 'يمكنك التواصل معنا عبر: 1. صفحة اتصل بنا - املأ النموذج 2. قناة تيليجرام - انضم للتحديثات ودعم المجتمع 3. البريد: 424236@ogr.ktu.edu.tr. نرد عادة خلال 24-48 ساعة!'
    },
    category: 'navigation'
  },
  {
    id: 'telegram',
    keywords: ['telegram', 'channel', 'group', 'join', 'تيليجرام', 'قناة', 'مجموعة', 'انضم'],
    question: {
      en: 'How do I join the Telegram channel?',
      ar: 'كيف أنضم لقناة تيليجرام؟'
    },
    answer: {
      en: 'Join our Telegram channel for the latest scholarship updates, tips, and community support! Click the Telegram link on our Contact page or go directly to: https://t.me/+uNRCkz0PUfQzOGZk',
      ar: 'انضم لقناتنا على تيليجرام لآخر تحديثات المنح والنصائح ودعم المجتمع! اضغط على رابط تيليجرام في صفحة اتصل بنا أو اذهب مباشرة إلى: https://t.me/+uNRCkz0PUfQzOGZk'
    },
    category: 'navigation'
  }
];

// Function to find matching FAQ
export function findMatchingFAQ(message: string, locale: string = 'en'): FAQItem | null {
  const normalizedMessage = message.toLowerCase().trim();

  // Score each FAQ based on keyword matches
  let bestMatch: FAQItem | null = null;
  let bestScore = 0;

  for (const faq of faqData) {
    let score = 0;

    for (const keyword of faq.keywords) {
      const keywordLower = keyword.toLowerCase();

      // Check if the keyword phrase exists in the message
      if (normalizedMessage.includes(keywordLower)) {
        // Longer keywords (phrases) get higher scores
        const wordCount = keywordLower.split(/\s+/).length;
        score += wordCount * 2;
      }
    }

    // Require minimum score of 3 (at least one 2-word phrase or multiple single words)
    if (score > bestScore && score >= 3) {
      bestScore = score;
      bestMatch = faq;
    }
  }

  return bestMatch;
}
