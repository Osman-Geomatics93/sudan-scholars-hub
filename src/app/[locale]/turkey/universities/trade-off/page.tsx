'use client';

import { usePathname } from 'next/navigation';
import { Container } from '@/components/layout/container';
import {
  HelpCircle,
  FileCheck,
  GraduationCap,
  Calendar,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  BookOpen,
  Users,
  Award
} from 'lucide-react';

export default function TradeOffPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const isRTL = locale === 'ar';

  const steps = [
    {
      number: 1,
      titleEn: "Prepare Required Documents",
      titleAr: "تحضير المستندات المطلوبة",
      descEn: "Gather your high school diploma, transcript, passport, photos, and exam results (YÖS, SAT, etc.)",
      descAr: "اجمع شهادة الثانوية، كشف الدرجات، جواز السفر، الصور الشخصية، ونتائج الامتحانات (اليوس، السات، إلخ)",
      icon: FileCheck
    },
    {
      number: 2,
      titleEn: "Research Universities",
      titleAr: "البحث عن الجامعات",
      descEn: "Explore universities, their programs, requirements, and deadlines using our calendar",
      descAr: "استكشف الجامعات وبرامجها ومتطلباتها ومواعيدها باستخدام تقويمنا",
      icon: BookOpen
    },
    {
      number: 3,
      titleEn: "Apply Online",
      titleAr: "التقديم عبر الإنترنت",
      descEn: "Submit your application through each university's official portal during the registration period",
      descAr: "قدم طلبك عبر البوابة الرسمية لكل جامعة خلال فترة التسجيل",
      icon: ClipboardList
    },
    {
      number: 4,
      titleEn: "Wait for Results",
      titleAr: "انتظار النتائج",
      descEn: "Universities announce results in stages - check regularly for updates",
      descAr: "تعلن الجامعات النتائج على مراحل - تابع بانتظام للحصول على التحديثات",
      icon: Calendar
    },
    {
      number: 5,
      titleEn: "Confirm Your Spot",
      titleAr: "تأكيد مقعدك",
      descEn: "If accepted, complete the registration by paying fees and submitting original documents",
      descAr: "إذا تم قبولك، أكمل التسجيل بدفع الرسوم وتقديم المستندات الأصلية",
      icon: CheckCircle2
    }
  ];

  const acceptedExams = [
    { nameEn: "YÖS (Yabancı Öğrenci Sınavı)", nameAr: "اليوس (امتحان الطلاب الأجانب)", descEn: "Most commonly accepted exam by Turkish public universities", descAr: "الامتحان الأكثر قبولاً في الجامعات الحكومية التركية" },
    { nameEn: "SAT (Scholastic Assessment Test)", nameAr: "السات (اختبار التقييم المدرسي)", descEn: "Accepted by many universities, especially private ones", descAr: "مقبول في العديد من الجامعات، خاصة الخاصة" },
    { nameEn: "High School GPA", nameAr: "معدل الثانوية العامة", descEn: "Some universities accept students based on high school grades alone", descAr: "بعض الجامعات تقبل الطلاب بناءً على درجات الثانوية فقط" },
    { nameEn: "National Exams", nameAr: "الامتحانات الوطنية", descEn: "Some universities accept national exams like Sudanese Certificate, Tawjihi, etc.", descAr: "بعض الجامعات تقبل الامتحانات الوطنية مثل الشهادة السودانية، التوجيهي، إلخ" },
  ];

  const tips = [
    { titleEn: "Apply Early", titleAr: "قدم مبكراً", descEn: "Don't wait until the last day - technical issues may occur", descAr: "لا تنتظر حتى اليوم الأخير - قد تحدث مشاكل تقنية" },
    { titleEn: "Apply to Multiple Universities", titleAr: "قدم لعدة جامعات", descEn: "Increase your chances by applying to several universities", descAr: "زد فرصك بالتقديم لعدة جامعات" },
    { titleEn: "Check Requirements Carefully", titleAr: "تحقق من المتطلبات بعناية", descEn: "Each university has different requirements and accepted exams", descAr: "لكل جامعة متطلبات وامتحانات مقبولة مختلفة" },
    { titleEn: "Prepare Documents in Advance", titleAr: "حضر المستندات مسبقاً", descEn: "Get your documents translated and notarized early", descAr: "ترجم مستنداتك ووثقها مبكراً" },
    { titleEn: "Follow Official Channels", titleAr: "تابع القنوات الرسمية", descEn: "Always use official university websites for applications", descAr: "استخدم دائماً المواقع الرسمية للجامعات للتقديم" },
    { titleEn: "Track Deadlines", titleAr: "تابع المواعيد النهائية", descEn: "Use our admissions calendar to never miss a deadline", descAr: "استخدم تقويم المفاضلات لدينا حتى لا تفوتك أي مواعيد" },
  ];

  const mistakes = [
    { titleEn: "Missing Deadlines", titleAr: "تفويت المواعيد", descEn: "Universities strictly close applications on deadline", descAr: "الجامعات تغلق التقديم بشكل صارم في الموعد النهائي" },
    { titleEn: "Incomplete Applications", titleAr: "طلبات غير مكتملة", descEn: "Missing documents lead to automatic rejection", descAr: "المستندات الناقصة تؤدي إلى الرفض التلقائي" },
    { titleEn: "Wrong Document Format", titleAr: "صيغة المستندات خاطئة", descEn: "Check file format and size requirements", descAr: "تحقق من متطلبات صيغة وحجم الملفات" },
    { titleEn: "Not Confirming Acceptance", titleAr: "عدم تأكيد القبول", descEn: "You must confirm your spot within the given timeframe", descAr: "يجب تأكيد مقعدك خلال الفترة المحددة" },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 to-red-700 text-white py-16 md:py-24">
        <Container>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <HelpCircle className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {isRTL ? 'ما هي المفاضلة؟' : 'What is Mufazala (University Placement)?'}
            </h1>
            <p className="text-lg md:text-xl text-red-100 max-w-2xl mx-auto">
              {isRTL
                ? 'دليلك الشامل لفهم نظام القبول الجامعي في تركيا'
                : 'Your comprehensive guide to understanding the university admission system in Turkey'}
            </p>
          </div>
        </Container>
      </section>

      {/* What is Mufazala Section */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg shrink-0">
                  <GraduationCap className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                    {isRTL ? 'تعريف المفاضلة' : 'Definition of Mufazala'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {isRTL
                      ? 'المفاضلة هي نظام القبول الجامعي في تركيا للطلاب الدوليين. تفتح كل جامعة تركية باب التقديم في فترة محددة، ويتنافس الطلاب على المقاعد المتاحة بناءً على درجاتهم في امتحانات مثل اليوس أو السات أو معدل الثانوية العامة.'
                      : 'Mufazala is the university admission system in Turkey for international students. Each Turkish university opens applications during a specific period, and students compete for available seats based on their scores in exams like YÖS, SAT, or high school GPA.'}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-8">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                  <Users className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-1">
                    {isRTL ? 'للطلاب الدوليين' : 'For International Students'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isRTL ? 'نظام خاص بالطلاب الأجانب' : 'Special system for foreign students'}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                  <Calendar className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-1">
                    {isRTL ? 'مواعيد محددة' : 'Specific Deadlines'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isRTL ? 'لكل جامعة مواعيد خاصة' : 'Each university has its own dates'}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                  <Award className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-1">
                    {isRTL ? 'تنافسي' : 'Competitive'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isRTL ? 'القبول بناءً على الدرجات' : 'Admission based on scores'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Accepted Exams Section */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-800">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 text-center mb-8">
              {isRTL ? 'الامتحانات المقبولة' : 'Accepted Exams'}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {acceptedExams.map((exam, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 border border-gray-200 dark:border-gray-600"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-2">
                    {isRTL ? exam.nameAr : exam.nameEn}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isRTL ? exam.descAr : exam.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Application Steps Section */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 text-center mb-8">
              {isRTL ? 'خطوات التقديم' : 'Application Steps'}
            </h2>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 flex items-start gap-4"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full shrink-0 font-bold text-lg">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <step.icon className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                        {isRTL ? step.titleAr : step.titleEn}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {isRTL ? step.descAr : step.descEn}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className={`h-5 w-5 text-gray-300 dark:text-gray-600 hidden md:block ${isRTL ? 'rotate-180' : ''}`} />
                  )}
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
                {isRTL ? 'نصائح للنجاح' : 'Tips for Success'}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                      {isRTL ? tip.titleAr : tip.titleEn}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isRTL ? tip.descAr : tip.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Common Mistakes Section */}
      <section className="py-12 md:py-16 bg-red-50 dark:bg-red-900/20">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-8">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50">
                {isRTL ? 'أخطاء شائعة يجب تجنبها' : 'Common Mistakes to Avoid'}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {mistakes.map((mistake, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-red-200 dark:border-red-800"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                      {isRTL ? mistake.titleAr : mistake.titleEn}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isRTL ? mistake.descAr : mistake.descEn}
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
              {isRTL ? 'ابدأ رحلتك الآن' : 'Start Your Journey Now'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {isRTL
                ? 'تابع تقويم المفاضلات لدينا لمعرفة مواعيد التقديم لجميع الجامعات التركية'
                : 'Follow our admissions calendar to know the application deadlines for all Turkish universities'}
            </p>
            <a
              href={`/${locale}/turkey/calendars/admissions`}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Calendar className="h-5 w-5" />
              {isRTL ? 'تقويم المفاضلات' : 'Admissions Calendar'}
            </a>
          </div>
        </Container>
      </section>
    </div>
  );
}
