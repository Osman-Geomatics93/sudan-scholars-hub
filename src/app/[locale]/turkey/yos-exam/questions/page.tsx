'use client';

import { usePathname } from 'next/navigation';
import { Container } from '@/components/layout/container';
import {
  FileQuestion,
  Brain,
  Calculator,
  Shapes,
  BookOpen,
  Clock,
  Target,
  Lightbulb,
  Download,
  ExternalLink,
  CheckCircle
} from 'lucide-react';

export default function YosQuestionsPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const isRTL = locale === 'ar';

  const examSections = [
    {
      icon: Brain,
      titleEn: "IQ (Intelligence Questions)",
      titleAr: "أسئلة الذكاء (IQ)",
      descEn: "Tests logical thinking, pattern recognition, and problem-solving abilities",
      descAr: "تختبر التفكير المنطقي والتعرف على الأنماط وقدرات حل المشكلات",
      questionsEn: "40-80 questions",
      questionsAr: "40-80 سؤال",
      topics: [
        { en: "Number sequences", ar: "المتتاليات العددية" },
        { en: "Pattern recognition", ar: "التعرف على الأنماط" },
        { en: "Logical reasoning", ar: "التفكير المنطقي" },
        { en: "Spatial visualization", ar: "التصور المكاني" },
        { en: "Verbal analogies", ar: "التشابهات اللفظية" },
      ]
    },
    {
      icon: Calculator,
      titleEn: "Mathematics",
      titleAr: "الرياضيات",
      descEn: "Covers high school mathematics including algebra, geometry, and calculus basics",
      descAr: "تغطي رياضيات المرحلة الثانوية بما في ذلك الجبر والهندسة وأساسيات التفاضل",
      questionsEn: "30-45 questions",
      questionsAr: "30-45 سؤال",
      topics: [
        { en: "Algebra & equations", ar: "الجبر والمعادلات" },
        { en: "Geometry", ar: "الهندسة" },
        { en: "Trigonometry", ar: "حساب المثلثات" },
        { en: "Probability & statistics", ar: "الاحتمالات والإحصاء" },
        { en: "Functions & graphs", ar: "الدوال والرسوم البيانية" },
      ]
    },
    {
      icon: Shapes,
      titleEn: "Geometry (Some exams)",
      titleAr: "الهندسة (بعض الامتحانات)",
      descEn: "Separate geometry section in some university exams",
      descAr: "قسم هندسة منفصل في بعض امتحانات الجامعات",
      questionsEn: "15-25 questions",
      questionsAr: "15-25 سؤال",
      topics: [
        { en: "2D shapes & areas", ar: "الأشكال ثنائية الأبعاد والمساحات" },
        { en: "3D shapes & volumes", ar: "الأشكال ثلاثية الأبعاد والحجوم" },
        { en: "Coordinate geometry", ar: "الهندسة الإحداثية" },
        { en: "Transformations", ar: "التحويلات الهندسية" },
      ]
    },
  ];

  const sampleQuestions = [
    {
      typeEn: "Number Sequence",
      typeAr: "متتالية عددية",
      questionEn: "2, 6, 12, 20, 30, ?",
      questionAr: "2, 6, 12, 20, 30, ?",
      answerEn: "42 (differences: 4, 6, 8, 10, 12)",
      answerAr: "42 (الفروق: 4، 6، 8، 10، 12)"
    },
    {
      typeEn: "Pattern Recognition",
      typeAr: "التعرف على النمط",
      questionEn: "Find the next shape in the sequence based on rotation pattern",
      questionAr: "أوجد الشكل التالي في التسلسل بناءً على نمط الدوران",
      answerEn: "Shapes typically rotate 45° or 90° each step",
      answerAr: "الأشكال تدور عادة 45° أو 90° في كل خطوة"
    },
    {
      typeEn: "Mathematics",
      typeAr: "رياضيات",
      questionEn: "If 3x + 7 = 22, what is the value of 2x + 5?",
      questionAr: "إذا كان 3س + 7 = 22، فما قيمة 2س + 5؟",
      answerEn: "15 (x = 5, so 2(5) + 5 = 15)",
      answerAr: "15 (س = 5، إذن 2(5) + 5 = 15)"
    },
  ];

  const tips = [
    { en: "Practice with past papers from multiple universities", ar: "تدرب على أوراق سابقة من جامعات متعددة" },
    { en: "Focus on speed - time management is crucial", ar: "ركز على السرعة - إدارة الوقت أمر حاسم" },
    { en: "Master number sequences and pattern recognition first", ar: "أتقن المتتاليات العددية والتعرف على الأنماط أولاً" },
    { en: "Learn Turkish math terminology if taking Turkish exam", ar: "تعلم مصطلحات الرياضيات التركية إذا كنت ستخوض الامتحان بالتركية" },
    { en: "Use elimination strategy for difficult questions", ar: "استخدم استراتيجية الاستبعاد للأسئلة الصعبة" },
    { en: "Review basic formulas regularly", ar: "راجع الصيغ الأساسية بانتظام" },
  ];

  const resources = [
    { nameEn: "Official University Websites", nameAr: "المواقع الرسمية للجامعات", descEn: "Download past papers directly", descAr: "تحميل الأوراق السابقة مباشرة" },
    { nameEn: "YÖS Preparation Books", nameAr: "كتب التحضير لليوس", descEn: "Metropol, Puza, Tasarı publications", descAr: "منشورات متروبول، بوزا، تصاري" },
    { nameEn: "Online Practice Tests", nameAr: "اختبارات تجريبية أونلاين", descEn: "Free and paid platforms available", descAr: "منصات مجانية ومدفوعة متاحة" },
    { nameEn: "YouTube Tutorials", nameAr: "دروس يوتيوب", descEn: "Video explanations in multiple languages", descAr: "شروحات فيديو بلغات متعددة" },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 to-red-700 text-white py-16 md:py-24">
        <Container>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <FileQuestion className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {isRTL ? 'أسئلة امتحان اليوس' : 'YÖS Exam Questions'}
            </h1>
            <p className="text-lg md:text-xl text-red-100 max-w-2xl mx-auto">
              {isRTL
                ? 'دليلك الشامل لفهم أنواع الأسئلة والتحضير للامتحان'
                : 'Your comprehensive guide to understanding question types and exam preparation'}
            </p>
          </div>
        </Container>
      </section>

      {/* Exam Overview */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg shrink-0">
                  <BookOpen className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                    {isRTL ? 'نظرة عامة على الامتحان' : 'Exam Overview'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {isRTL
                      ? 'امتحان اليوس (YÖS) هو امتحان القبول للطلاب الأجانب في الجامعات التركية. يختلف عدد الأسئلة ومدة الامتحان من جامعة لأخرى، لكن المحتوى العام متشابه.'
                      : 'The YÖS (Yabancı Öğrenci Sınavı) is the admission exam for foreign students at Turkish universities. The number of questions and exam duration varies by university, but the general content is similar.'}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                  <Clock className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-1">
                    {isRTL ? 'المدة' : 'Duration'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isRTL ? '90-120 دقيقة' : '90-120 minutes'}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                  <FileQuestion className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-1">
                    {isRTL ? 'عدد الأسئلة' : 'Questions'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isRTL ? '80-100 سؤال' : '80-100 questions'}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                  <Target className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-1">
                    {isRTL ? 'نوع الأسئلة' : 'Question Type'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isRTL ? 'اختيار من متعدد' : 'Multiple choice'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Exam Sections */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-800">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 text-center mb-8">
              {isRTL ? 'أقسام الامتحان' : 'Exam Sections'}
            </h2>
            <div className="space-y-6">
              {examSections.map((section, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg shrink-0">
                      <section.icon className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                          {isRTL ? section.titleAr : section.titleEn}
                        </h3>
                        <span className="text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-1 rounded-full">
                          {isRTL ? section.questionsAr : section.questionsEn}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {isRTL ? section.descAr : section.descEn}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {section.topics.map((topic, i) => (
                          <span
                            key={i}
                            className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                          >
                            {isRTL ? topic.ar : topic.en}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Sample Questions */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 text-center mb-8">
              {isRTL ? 'نماذج أسئلة' : 'Sample Questions'}
            </h2>
            <div className="space-y-4">
              {sampleQuestions.map((q, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                      {isRTL ? q.typeAr : q.typeEn}
                    </span>
                  </div>
                  <p className="text-gray-900 dark:text-gray-50 font-medium mb-3">
                    {isRTL ? q.questionAr : q.questionEn}
                  </p>
                  <div className="flex items-start gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{isRTL ? q.answerAr : q.answerEn}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Tips Section */}
      <section className="py-12 md:py-16 bg-green-50 dark:bg-green-900/20">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Lightbulb className="h-8 w-8 text-green-600 dark:text-green-400" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50">
                {isRTL ? 'نصائح للتحضير' : 'Preparation Tips'}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-green-200 dark:border-green-800 flex items-start gap-3"
                >
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                  <p className="text-gray-700 dark:text-gray-300">
                    {isRTL ? tip.ar : tip.en}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Resources Section */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-800">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 text-center mb-8">
              {isRTL ? 'مصادر للتحضير' : 'Study Resources'}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {resources.map((resource, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Download className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                      {isRTL ? resource.nameAr : resource.nameEn}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isRTL ? resource.descAr : resource.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-4">
              {isRTL ? 'ابدأ التحضير الآن' : 'Start Preparing Now'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {isRTL
                ? 'تابع تقويم المفاضلات لمعرفة مواعيد امتحانات اليوس في الجامعات التركية'
                : 'Follow our admissions calendar to know YÖS exam dates at Turkish universities'}
            </p>
            <a
              href={`/${locale}/turkey/calendars/admissions`}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <ExternalLink className="h-5 w-5" />
              {isRTL ? 'تقويم المفاضلات' : 'Admissions Calendar'}
            </a>
          </div>
        </Container>
      </section>
    </div>
  );
}
