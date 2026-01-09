'use client';

import { useState } from 'react';
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
  Lightbulb,
  Languages,
  FileDown,
  CreditCard,
  ChevronDown,
  ChevronUp,
  CalendarDays,
  CalendarCheck,
  CalendarClock,
  Timer,
  ClipboardCheck
} from 'lucide-react';

// Exam Languages Data
const examLanguages = [
  { code: 'ar', nameEn: 'Arabic', nameAr: 'عربي', flag: '🇸🇦' },
  { code: 'en', nameEn: 'English', nameAr: 'إنكليزي', flag: '🇬🇧' },
  { code: 'tr', nameEn: 'Turkish', nameAr: 'تركي', flag: '🇹🇷' },
  { code: 'de', nameEn: 'German', nameAr: 'ألماني', flag: '🇩🇪' },
  { code: 'fr', nameEn: 'French', nameAr: 'فرنسي', flag: '🇫🇷' },
  { code: 'ru', nameEn: 'Russian', nameAr: 'روسي', flag: '🇷🇺' },
];

// Sample Exams Data
const sampleExams = [
  { nameEn: 'Sample Exam', nameAr: 'نموذج امتحان TR-YÖS', url: 'https://drive.google.com/file/d/19f21zYfo8ShIUMccX18UPz11ChugTWTB/view?usp=sharing' },
  { nameEn: 'TR-YÖS 2023 (10%)', nameAr: 'اختبار 2023 (10%)', url: 'https://drive.google.com/file/d/1F2gB11fKoL48RrkX5zQER6nIceJK09OX/view?usp=sharing' },
  { nameEn: 'TR-YÖS 2023/2 (10%)', nameAr: 'اختبار 2023/2 (10%)', url: 'https://drive.google.com/file/d/1buNKjf7fqi0bFGSy5kbCcqhZDCW8Ymu4/view?usp=sharing' },
  { nameEn: 'TR-YÖS 2024/1 (10%)', nameAr: 'اختبار 2024/1 (10%)', url: 'https://drive.google.com/file/d/15mK6iFKaTvjLg5DfYOJdhxbdKMEVHSq8/view?usp=sharing' },
  { nameEn: 'TR-YÖS 2024/2 (10%)', nameAr: 'اختبار 2024/2 (10%)', url: 'https://drive.google.com/file/d/1S5sLDnDkzH0PcyVsSl9S0dDMC6AMVLZI/view?usp=drivesdk' },
];

// Exam Centers Data by Region
const examCenters = [
  {
    id: 'middle-east',
    regionEn: 'Middle East',
    regionAr: 'الشرق الأوسط',
    centers: [
      { countryEn: 'Jordan', countryAr: 'الأردن', cityEn: 'Amman', cityAr: 'عمان' },
      { countryEn: 'Saudi Arabia', countryAr: 'السعودية', cityEn: 'Jeddah', cityAr: 'جدة' },
      { countryEn: 'Saudi Arabia', countryAr: 'السعودية', cityEn: 'Riyadh', cityAr: 'الرياض' },
      { countryEn: 'Qatar', countryAr: 'قطر', cityEn: 'Doha', cityAr: 'الدوحة' },
    ]
  },
  {
    id: 'africa',
    regionEn: 'Africa',
    regionAr: 'أفريقيا',
    centers: [
      { countryEn: 'Mauritania', countryAr: 'موريتانيا', cityEn: 'Nouakchott', cityAr: 'نواكشوط' },
      { countryEn: 'Niger', countryAr: 'النيجر', cityEn: 'Niamey', cityAr: 'نيامي' },
      { countryEn: 'Nigeria', countryAr: 'نيجيريا', cityEn: 'Abuja', cityAr: 'أبوجا' },
      { countryEn: 'Senegal', countryAr: 'السنغال', cityEn: 'Dakar', cityAr: 'داكار' },
      { countryEn: 'Somalia', countryAr: 'الصومال', cityEn: 'Mogadishu', cityAr: 'مقديشو' },
      { countryEn: 'Somaliland', countryAr: 'صوماليلاند', cityEn: 'Hargeisa', cityAr: 'هرجيسا' },
      { countryEn: 'Tanzania', countryAr: 'تنزانيا', cityEn: 'Dar es Salaam', cityAr: 'دار السلام' },
      { countryEn: 'Tunisia', countryAr: 'تونس', cityEn: 'Tunis', cityAr: 'تونس' },
      { countryEn: 'Uganda', countryAr: 'أوغندا', cityEn: 'Kampala', cityAr: 'كمبالا' },
    ]
  },
  {
    id: 'central-asia',
    regionEn: 'Central Asia',
    regionAr: 'آسيا الوسطى',
    centers: [
      { countryEn: 'Uzbekistan', countryAr: 'أوزبكستان', cityEn: 'Tashkent', cityAr: 'طشقند' },
      { countryEn: 'Tajikistan', countryAr: 'طاجيكستان', cityEn: 'Dushanbe', cityAr: 'دوشنبه' },
      { countryEn: 'Tatarstan', countryAr: 'تتارستان', cityEn: 'Kazan', cityAr: 'قازان' },
    ]
  },
  {
    id: 'south-asia',
    regionEn: 'South Asia',
    regionAr: 'جنوب آسيا',
    centers: [
      { countryEn: 'Pakistan', countryAr: 'باكستان', cityEn: 'Islamabad', cityAr: 'إسلام آباد' },
      { countryEn: 'Pakistan', countryAr: 'باكستان', cityEn: 'Lahore', cityAr: 'لاهور' },
      { countryEn: 'Pakistan', countryAr: 'باكستان', cityEn: 'Karachi', cityAr: 'كراتشي' },
      { countryEn: 'Sri Lanka', countryAr: 'سريلانكا', cityEn: 'Colombo', cityAr: 'كولومبو' },
    ]
  },
  {
    id: 'europe',
    regionEn: 'Europe',
    regionAr: 'أوروبا',
    centers: [
      { countryEn: 'Romania', countryAr: 'رومانيا', cityEn: 'Bucharest', cityAr: 'بوخارست' },
      { countryEn: 'Russia', countryAr: 'روسيا', cityEn: 'Moscow', cityAr: 'موسكو' },
      { countryEn: 'Belgium', countryAr: 'بلجيكا', cityEn: 'Ghent', cityAr: 'غينت' },
      { countryEn: 'Switzerland', countryAr: 'سويسرا', cityEn: 'Bern', cityAr: 'برن' },
      { countryEn: 'Montenegro', countryAr: 'الجبل الأسود', cityEn: 'Podgorica', cityAr: 'بودغوريتشا' },
      { countryEn: 'Kosovo', countryAr: 'كوسوفو', cityEn: 'Pristina', cityAr: 'بريشتينا' },
    ]
  },
];

export default function UnifiedYosPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const isRTL = locale === 'ar';
  const [expandedRegion, setExpandedRegion] = useState<string | null>('middle-east');

  const toggleRegion = (regionId: string) => {
    setExpandedRegion(expandedRegion === regionId ? null : regionId);
  };

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
    { labelEn: "Exam Duration", labelAr: "مدة الامتحان", valueEn: "100 minutes", valueAr: "100 دقيقة", icon: Timer },
    { labelEn: "Total Score", labelAr: "مجموع الدرجات", valueEn: "500 points", valueAr: "500 نقطة", icon: Award },
    { labelEn: "Math Weight", labelAr: "وزن الرياضيات", valueEn: "× 0.55 per question", valueAr: "× 0.55 لكل سؤال", icon: ClipboardCheck },
    { labelEn: "IQ Weight", labelAr: "وزن الذكاء", valueEn: "× 0.45 per question", valueAr: "× 0.45 لكل سؤال", icon: ClipboardCheck },
    { labelEn: "Negative Marking", labelAr: "الخصم السلبي", valueEn: "4 wrong = 1 deducted", valueAr: "4 خاطئة = خصم سؤال", icon: AlertCircle },
    { labelEn: "Certificate Validity", labelAr: "صلاحية الشهادة", valueEn: "2 years", valueAr: "سنتان", icon: Calendar },
  ];

  const steps = [
    { stepEn: "Create an account on the TR-YÖS portal", stepAr: "إنشاء حساب على بوابة TR-YÖS" },
    { stepEn: "Fill in personal and educational information", stepAr: "ملء المعلومات الشخصية والتعليمية" },
    { stepEn: "Upload required documents (passport, photo, diploma)", stepAr: "رفع المستندات المطلوبة (جواز السفر، صورة، شهادة)" },
    { stepEn: "Select exam center and date", stepAr: "اختيار مركز وتاريخ الامتحان" },
    { stepEn: "Pay the exam fee online", stepAr: "دفع رسوم الامتحان عبر الإنترنت" },
    { stepEn: "Download admission ticket before exam", stepAr: "تحميل بطاقة الدخول قبل الامتحان" },
  ];

  const tips = [
    { en: "Register early - popular exam centers fill up quickly", ar: "سجل مبكراً - مراكز الامتحان الشائعة تمتلئ بسرعة" },
    { en: "Check participating universities before registering", ar: "تحقق من الجامعات المشاركة قبل التسجيل" },
    { en: "Practice with sample exams to get familiar with the format", ar: "تدرب على نماذج الامتحانات للتعرف على الشكل" },
    { en: "Results are typically announced within 2-3 weeks", ar: "تُعلن النتائج عادة خلال 2-3 أسابيع" },
  ];

  // 2025 Exam Dates
  const examDates2025 = {
    first: {
      titleEn: "First Exam 2025",
      titleAr: "الامتحان الأول 2025",
      examDate: "11/05/2025",
      examTime: isRTL ? "لم تُعلن" : "TBA",
      registrationStart: "13/02/2025",
      registrationEnd: "20/03/2025",
      lateRegistrationStart: "18/03/2025",
      lateRegistrationEnd: "20/03/2025",
      results: "11/06/2025"
    },
    second: {
      titleEn: "Second Exam 2025",
      titleAr: "الامتحان الثاني 2025",
      examDate: "19/10/2025",
      examTime: isRTL ? "لم تُعلن" : "TBA",
      registrationStart: "07/08/2025",
      registrationEnd: "25/08/2025",
      lateRegistrationStart: "02/09/2025",
      lateRegistrationEnd: "04/09/2025",
      results: "14/11/2025"
    }
  };

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
              {isRTL ? 'اليوس الموحد (TR-YÖS)' : 'Unified YÖS (TR-YÖS)'}
            </h1>
            <p className="text-lg md:text-xl text-red-100 max-w-2xl mx-auto">
              {isRTL
                ? 'امتحان واحد للقبول في عشرات الجامعات التركية الحكومية'
                : 'One exam for admission to dozens of Turkish public universities'}
            </p>
          </div>
        </Container>
      </section>

      {/* 2025 Exam Dates Section */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-3">
                {isRTL ? 'مواعيد امتحان TR-YÖS 2025' : 'TR-YÖS 2025 Exam Dates'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {isRTL ? 'سجل الآن للحصول على مقعدك في الامتحان' : 'Register now to secure your exam spot'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* First Exam Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border-2 border-green-200 dark:border-green-800 overflow-hidden">
                <div className="bg-green-600 dark:bg-green-700 text-white px-6 py-4">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-6 w-6" />
                    <h3 className="text-xl font-bold">{isRTL ? examDates2025.first.titleAr : examDates2025.first.titleEn}</h3>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-green-200 dark:border-green-800">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <CalendarCheck className="h-4 w-4" />
                      {isRTL ? 'تاريخ الامتحان' : 'Exam Date'}
                    </span>
                    <span className="font-bold text-green-700 dark:text-green-400">{examDates2025.first.examDate}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-green-200 dark:border-green-800">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {isRTL ? 'ساعة الامتحان' : 'Exam Time'}
                    </span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{examDates2025.first.examTime}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-green-200 dark:border-green-800">
                    <span className="text-gray-600 dark:text-gray-400">{isRTL ? 'بدء التسجيل' : 'Registration Start'}</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{examDates2025.first.registrationStart}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-green-200 dark:border-green-800">
                    <span className="text-gray-600 dark:text-gray-400">{isRTL ? 'انتهاء التسجيل' : 'Registration End'}</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{examDates2025.first.registrationEnd}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-green-200 dark:border-green-800">
                    <span className="text-gray-600 dark:text-gray-400">{isRTL ? 'التسجيل المتأخر' : 'Late Registration'}</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{examDates2025.first.lateRegistrationStart} - {examDates2025.first.lateRegistrationEnd}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <CalendarClock className="h-4 w-4" />
                      {isRTL ? 'إعلان النتائج' : 'Results'}
                    </span>
                    <span className="font-bold text-green-700 dark:text-green-400">{examDates2025.first.results}</span>
                  </div>
                </div>
              </div>

              {/* Second Exam Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 overflow-hidden">
                <div className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-4">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-6 w-6" />
                    <h3 className="text-xl font-bold">{isRTL ? examDates2025.second.titleAr : examDates2025.second.titleEn}</h3>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-blue-200 dark:border-blue-800">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <CalendarCheck className="h-4 w-4" />
                      {isRTL ? 'تاريخ الامتحان' : 'Exam Date'}
                    </span>
                    <span className="font-bold text-blue-700 dark:text-blue-400">{examDates2025.second.examDate}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-blue-200 dark:border-blue-800">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {isRTL ? 'ساعة الامتحان' : 'Exam Time'}
                    </span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{examDates2025.second.examTime}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-blue-200 dark:border-blue-800">
                    <span className="text-gray-600 dark:text-gray-400">{isRTL ? 'بدء التسجيل' : 'Registration Start'}</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{examDates2025.second.registrationStart}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-blue-200 dark:border-blue-800">
                    <span className="text-gray-600 dark:text-gray-400">{isRTL ? 'انتهاء التسجيل' : 'Registration End'}</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{examDates2025.second.registrationEnd}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-blue-200 dark:border-blue-800">
                    <span className="text-gray-600 dark:text-gray-400">{isRTL ? 'التسجيل المتأخر' : 'Late Registration'}</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{examDates2025.second.lateRegistrationStart} - {examDates2025.second.lateRegistrationEnd}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <CalendarClock className="h-4 w-4" />
                      {isRTL ? 'إعلان النتائج' : 'Results'}
                    </span>
                    <span className="font-bold text-blue-700 dark:text-blue-400">{examDates2025.second.results}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* What is Unified YÖS */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-800">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg shrink-0">
                  <Users className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                    {isRTL ? 'ما هو امتحان اليوس الموحد TR-YÖS؟' : 'What is the Unified YÖS Exam (TR-YÖS)?'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {isRTL
                      ? 'اليوس الموحد (TR-YÖS) هو امتحان مركزي تنظمه مجموعة من الجامعات التركية الحكومية. يتكون من أقسام الرياضيات والهندسة والذكاء (IQ). بدلاً من إجراء امتحان منفصل لكل جامعة، يمكن للطلاب إجراء امتحان واحد واستخدام نتيجته للتقديم لجميع الجامعات المشاركة.'
                      : 'Unified YÖS (TR-YÖS) is a centralized exam organized by a group of Turkish public universities. It consists of Math, Geometry, and IQ sections. Instead of taking separate exams for each university, students can take one exam and use the result to apply to all participating universities.'}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {isRTL
                    ? 'ملاحظة: صلاحية شهادة TR-YÖS هي سنتان من تاريخ الامتحان.'
                    : 'Note: TR-YÖS certificate validity is 2 years from the exam date.'}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Exam Languages Section */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg mb-4">
                <Languages className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                {isRTL ? 'لغات الامتحان' : 'Exam Languages'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {isRTL ? 'يمكنك اختيار إحدى اللغات التالية للامتحان' : 'You can choose one of the following languages for the exam'}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {examLanguages.map((lang) => (
                <div
                  key={lang.code}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 transition-colors"
                >
                  <span className="text-3xl mb-2 block">{lang.flag}</span>
                  <p className="font-medium text-gray-900 dark:text-gray-50">
                    {isRTL ? lang.nameAr : lang.nameEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Exam Details */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-800">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 text-center mb-8">
              {isRTL ? 'تفاصيل الامتحان' : 'Exam Details'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {examDetails.map((detail, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <detail.icon className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      {isRTL ? detail.labelAr : detail.labelEn}
                    </span>
                  </div>
                  <p className="font-bold text-lg text-gray-900 dark:text-gray-50">
                    {isRTL ? detail.valueAr : detail.valueEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Sample Exams Section */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                {isRTL ? 'نماذج امتحان TR-YÖS' : 'TR-YÖS Sample Exams'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {isRTL ? 'تدرب على نماذج الامتحانات السابقة' : 'Practice with past exam samples'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleExams.map((exam, index) => (
                <a
                  key={index}
                  href={exam.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg shrink-0 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                    <FileDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-50">
                    {isRTL ? exam.nameAr : exam.nameEn}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Exam Centers Section */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-800">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                {isRTL ? 'مراكز الامتحان حول العالم' : 'Exam Centers Worldwide'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {isRTL ? 'اختر مركز الامتحان الأقرب إليك' : 'Choose the exam center closest to you'}
              </p>
            </div>
            <div className="space-y-4">
              {examCenters.map((region) => {
                const isExpanded = expandedRegion === region.id;
                return (
                  <div
                    key={region.id}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleRegion(region.id)}
                      className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-red-600 dark:text-red-400" />
                        <span className="font-semibold text-gray-900 dark:text-gray-50">
                          {isRTL ? region.regionAr : region.regionEn}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({region.centers.length} {isRTL ? 'مركز' : 'centers'})
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-gray-200 dark:border-gray-600">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                          {region.centers.map((center, index) => (
                            <div
                              key={index}
                              className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
                            >
                              <p className="font-medium text-gray-900 dark:text-gray-50">
                                {isRTL ? center.countryAr : center.countryEn}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {isRTL ? center.cityAr : center.cityEn}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* Benefits */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 text-center mb-8">
              {isRTL ? 'مميزات اليوس الموحد' : 'Benefits of Unified YÖS'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
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

      {/* Important Links Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-4">
              {isRTL ? 'روابط التسجيل المهمة' : 'Important Registration Links'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {isRTL
                ? 'استخدم الروابط الرسمية للتسجيل ودفع رسوم الامتحان'
                : 'Use official links to register and pay exam fees'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://tryos.osym.gov.tr/TryosYetki/Giris"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-red-600/25"
              >
                <ExternalLink className="h-5 w-5" />
                {isRTL ? 'بوابة التسجيل' : 'Registration Portal'}
              </a>
              <a
                href="https://odeme.osym.gov.tr/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-50 px-6 py-3 rounded-xl font-medium transition-colors border border-gray-300 dark:border-gray-600"
              >
                <CreditCard className="h-5 w-5" />
                {isRTL ? 'بوابة الدفع' : 'Payment Portal'}
              </a>
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

      {/* Disclaimer */}
      <section className="py-8 bg-gray-100 dark:bg-gray-800/50">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isRTL
                ? 'المعلومات المقدمة هنا للإرشاد فقط. يرجى التحقق من الموقع الرسمي لليوس الموحد للحصول على أحدث المعلومات.'
                : 'Information provided here is for guidance only. Please verify with the official TR-YÖS website for the latest information.'}
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
              <ExternalLink className="h-4 w-4" />
              <span>{isRTL ? 'آخر تحديث: يناير 2025' : 'Last updated: January 2025'}</span>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
