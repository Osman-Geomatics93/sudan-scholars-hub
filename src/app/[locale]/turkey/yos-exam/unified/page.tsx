'use client';

import { usePathname } from 'next/navigation';
import { Container } from '@/components/layout/container';
import {
  FileCheck,
  Globe,
  Calendar,
  MapPin,
  CheckCircle,
  AlertCircle,
  Building2,
  Users,
  Award,
  ExternalLink,
  Clock,
  Lightbulb
} from 'lucide-react';

export default function UnifiedYosPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const isRTL = locale === 'ar';

  const benefits = [
    {
      icon: Globe,
      titleEn: "One Exam, Multiple Universities",
      titleAr: "امتحان واحد، جامعات متعددة",
      descEn: "Apply to all participating universities with a single exam result",
      descAr: "قدم لجميع الجامعات المشاركة بنتيجة امتحان واحدة"
    },
    {
      icon: Calendar,
      titleEn: "Centralized Application",
      titleAr: "تقديم مركزي",
      descEn: "Simplified application process through a unified portal",
      descAr: "عملية تقديم مبسطة من خلال بوابة موحدة"
    },
    {
      icon: MapPin,
      titleEn: "Multiple Exam Centers",
      titleAr: "مراكز امتحان متعددة",
      descEn: "Take the exam in Turkey or at international centers worldwide",
      descAr: "قدم الامتحان في تركيا أو في مراكز دولية حول العالم"
    },
    {
      icon: Award,
      titleEn: "Standardized Scoring",
      titleAr: "تقييم موحد",
      descEn: "Fair and consistent evaluation across all applicants",
      descAr: "تقييم عادل ومتسق لجميع المتقدمين"
    },
  ];

  const participatingUniversities = [
    { nameEn: "Ankara University", nameAr: "جامعة أنقرة", city: "Ankara" },
    { nameEn: "Hacettepe University", nameAr: "جامعة حجي تبه", city: "Ankara" },
    { nameEn: "Gazi University", nameAr: "جامعة غازي", city: "Ankara" },
    { nameEn: "Istanbul University", nameAr: "جامعة اسطنبول", city: "Istanbul" },
    { nameEn: "Marmara University", nameAr: "جامعة مرمرة", city: "Istanbul" },
    { nameEn: "Ege University", nameAr: "جامعة إيجة", city: "Izmir" },
    { nameEn: "Dokuz Eylül University", nameAr: "جامعة دوكوز أيلول", city: "Izmir" },
    { nameEn: "Atatürk University", nameAr: "جامعة أتاتورك", city: "Erzurum" },
    { nameEn: "Bursa Uludağ University", nameAr: "جامعة بورصة أولوداغ", city: "Bursa" },
    { nameEn: "Selçuk University", nameAr: "جامعة سلجوق", city: "Konya" },
    { nameEn: "Erciyes University", nameAr: "جامعة إرجيس", city: "Kayseri" },
    { nameEn: "Ondokuz Mayıs University", nameAr: "جامعة أون دوكوز مايس", city: "Samsun" },
  ];

  const examDetails = [
    { labelEn: "Exam Duration", labelAr: "مدة الامتحان", valueEn: "100 minutes", valueAr: "100 دقيقة" },
    { labelEn: "Total Questions", labelAr: "إجمالي الأسئلة", valueEn: "80 questions", valueAr: "80 سؤال" },
    { labelEn: "IQ Section", labelAr: "قسم الذكاء", valueEn: "40 questions", valueAr: "40 سؤال" },
    { labelEn: "Math Section", labelAr: "قسم الرياضيات", valueEn: "40 questions", valueAr: "40 سؤال" },
    { labelEn: "Question Type", labelAr: "نوع الأسئلة", valueEn: "Multiple choice (5 options)", valueAr: "اختيار من متعدد (5 خيارات)" },
    { labelEn: "Negative Marking", labelAr: "العلامات السالبة", valueEn: "Yes (0.25 per wrong answer)", valueAr: "نعم (0.25 لكل إجابة خاطئة)" },
  ];

  const steps = [
    { stepEn: "Create an account on the T-YÖS portal", stepAr: "إنشاء حساب على بوابة T-YÖS" },
    { stepEn: "Fill in personal and educational information", stepAr: "ملء المعلومات الشخصية والتعليمية" },
    { stepEn: "Upload required documents (passport, photo, diploma)", stepAr: "رفع المستندات المطلوبة (جواز السفر، صورة، شهادة)" },
    { stepEn: "Select exam center and date", stepAr: "اختيار مركز وتاريخ الامتحان" },
    { stepEn: "Pay the exam fee online", stepAr: "دفع رسوم الامتحان عبر الإنترنت" },
    { stepEn: "Download admission ticket before exam", stepAr: "تحميل بطاقة الدخول قبل الامتحان" },
  ];

  const tips = [
    { en: "Register early - popular exam centers fill up quickly", ar: "سجل مبكراً - مراكز الامتحان الشائعة تمتلئ بسرعة" },
    { en: "Check participating universities before registering", ar: "تحقق من الجامعات المشاركة قبل التسجيل" },
    { en: "The unified exam may have different dates than individual YÖS exams", ar: "قد يكون للامتحان الموحد تواريخ مختلفة عن امتحانات اليوس الفردية" },
    { en: "Results are typically announced within 2-3 weeks", ar: "تُعلن النتائج عادة خلال 2-3 أسابيع" },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 to-red-700 text-white py-16 md:py-24">
        <Container>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <FileCheck className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {isRTL ? 'اليوس الموحد (T-YÖS)' : 'Unified YÖS (T-YÖS)'}
            </h1>
            <p className="text-lg md:text-xl text-red-100 max-w-2xl mx-auto">
              {isRTL
                ? 'امتحان واحد للقبول في عشرات الجامعات التركية الحكومية'
                : 'One exam for admission to dozens of Turkish public universities'}
            </p>
          </div>
        </Container>
      </section>

      {/* What is Unified YÖS */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg shrink-0">
                  <Users className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                    {isRTL ? 'ما هو اليوس الموحد؟' : 'What is Unified YÖS?'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {isRTL
                      ? 'اليوس الموحد (T-YÖS) هو امتحان مركزي تنظمه مجموعة من الجامعات التركية الحكومية. بدلاً من إجراء امتحان منفصل لكل جامعة، يمكن للطلاب إجراء امتحان واحد واستخدام نتيجته للتقديم لجميع الجامعات المشاركة.'
                      : 'Unified YÖS (T-YÖS) is a centralized exam organized by a group of Turkish public universities. Instead of taking separate exams for each university, students can take one exam and use the result to apply to all participating universities.'}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {isRTL
                    ? 'ملاحظة: ليست كل الجامعات التركية تشارك في اليوس الموحد. بعض الجامعات لا تزال تجري امتحاناتها الخاصة.'
                    : 'Note: Not all Turkish universities participate in Unified YÖS. Some universities still conduct their own exams.'}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Benefits */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-800">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 text-center mb-8">
              {isRTL ? 'مميزات اليوس الموحد' : 'Benefits of Unified YÖS'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg mb-4">
                    <benefit.icon className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">
                    {isRTL ? benefit.titleAr : benefit.titleEn}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {isRTL ? benefit.descAr : benefit.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Exam Details */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 text-center mb-8">
              {isRTL ? 'تفاصيل الامتحان' : 'Exam Details'}
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="grid md:grid-cols-2">
                {examDetails.map((detail, index) => (
                  <div
                    key={index}
                    className={`p-4 border-b border-gray-200 dark:border-gray-700 ${
                      index % 2 === 1 ? 'md:border-s' : ''
                    } ${index >= examDetails.length - 2 ? 'md:border-b-0' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {isRTL ? detail.labelAr : detail.labelEn}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-gray-50">
                        {isRTL ? detail.valueAr : detail.valueEn}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Registration Steps */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-800">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 text-center mb-8">
              {isRTL ? 'خطوات التسجيل' : 'Registration Steps'}
            </h2>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 flex items-center gap-4 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-red-600 text-white rounded-full shrink-0 font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-900 dark:text-gray-50">
                    {isRTL ? step.stepAr : step.stepEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Participating Universities */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 text-center mb-4">
              {isRTL ? 'بعض الجامعات المشاركة' : 'Some Participating Universities'}
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
              {isRTL
                ? 'هذه قائمة جزئية - تحقق من الموقع الرسمي للقائمة الكاملة'
                : 'This is a partial list - check the official website for the complete list'}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {participatingUniversities.map((uni, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center"
                >
                  <Building2 className="h-6 w-6 text-red-600 dark:text-red-400 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900 dark:text-gray-50 text-sm mb-1">
                    {isRTL ? uni.nameAr : uni.nameEn}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{uni.city}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Tips Section */}
      <section className="py-12 md:py-16 bg-amber-50 dark:bg-amber-900/20">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Lightbulb className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50">
                {isRTL ? 'نصائح مهمة' : 'Important Tips'}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-amber-200 dark:border-amber-800 flex items-start gap-3"
                >
                  <CheckCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-gray-700 dark:text-gray-300">
                    {isRTL ? tip.ar : tip.en}
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
              {isRTL ? 'تابع آخر الأخبار' : 'Stay Updated'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {isRTL
                ? 'تابع تقويم المفاضلات لمعرفة مواعيد التسجيل والامتحان'
                : 'Follow our admissions calendar to know registration and exam dates'}
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

      {/* Disclaimer */}
      <section className="py-8 bg-gray-100 dark:bg-gray-800/50">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isRTL
                ? 'المعلومات المقدمة هنا للإرشاد فقط. يرجى التحقق من الموقع الرسمي لليوس الموحد للحصول على أحدث المعلومات.'
                : 'Information provided here is for guidance only. Please verify with the official T-YÖS website for the latest information.'}
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
              <ExternalLink className="h-4 w-4" />
              <span>{isRTL ? 'آخر تحديث: 2025' : 'Last updated: 2025'}</span>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
