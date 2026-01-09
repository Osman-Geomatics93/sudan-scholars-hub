'use client';

import { useState } from 'react';
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
  CheckCircle,
  GraduationCap,
  Info,
  Search,
  ChevronDown,
  ChevronUp,
  FileDown,
  Star
} from 'lucide-react';

// Past Exam Papers Data
const examPapersData = [
  {
    id: 1,
    nameEn: "TR-YÖS (Unified YÖS Exam)",
    nameAr: "اختبار اليوس الموحد في تركيا",
    nameTr: "TR-YÖS",
    isUnified: true,
    papers: [
      { year: "01/2024", url: "https://drive.google.com/file/d/15mK6iFKaTvjLg5DfYOJdhxbdKMEVHSq8/view?usp=sharing" },
      { year: "02/2023", url: "https://drive.google.com/file/d/1buNKjf7fqi0bFGSy5kbCcqhZDCW8Ymu4/view?usp=sharing" },
      { year: "2023", url: "https://drive.google.com/file/d/1F2gB11fKoL48RrkX5zQER6nIceJK09OX/view?usp=sharing" },
    ]
  },
  {
    id: 2,
    nameEn: "Ankara University",
    nameAr: "جامعة انقرة",
    nameTr: "Ankara Üniversitesi",
    papers: [
      { year: "2021", url: "https://drive.google.com/file/d/1lT6GCHsqrkb68EL41xw9AiBCBlWdE8t5/view?usp=sharing" },
      { year: "2020", url: "https://drive.google.com/file/d/13Su87oHprO6MvqUQtBF3ppTN7XjOOdXy/view?usp=sharing" },
      { year: "2019", url: "https://drive.google.com/file/d/13VxwZnlDD630Q6xiIFRkLIjCVbpMWGGr/view?usp=sharing" },
      { year: "2018", url: "https://drive.google.com/file/d/13WVCyaXbGqeOoAnTN5_jx-O1A5ClwAqo/view?usp=sharing" },
    ]
  },
  {
    id: 3,
    nameEn: "Afyon Kocatepe University",
    nameAr: "جامعة افيون كوجاتبه",
    nameTr: "Afyon Kocatepe Üniversitesi",
    papers: [
      { year: "2012", url: "https://drive.google.com/file/d/1JJCx4ajYk1FORpgcdkRBgboQA2csJT3L/view" },
    ]
  },
  {
    id: 4,
    nameEn: "Akdeniz University",
    nameAr: "جامعة اكدينيز",
    nameTr: "Akdeniz Üniversitesi",
    papers: [
      { year: "2013", url: "https://drive.google.com/file/d/1v7_VTL5DhMXcNsIObShk_3KvzdXa7c0O/view" },
    ]
  },
  {
    id: 5,
    nameEn: "Ataturk University",
    nameAr: "جامعة اتاتورك",
    nameTr: "Atatürk Üniversitesi",
    papers: [
      { year: "2018", url: "https://drive.google.com/file/d/11LXCz7PhqqgCMnWcLzigm1ni6pLa2keK/view?usp=sharing" },
      { year: "2017", url: "https://drive.google.com/file/d/11XGmLa26alrVNLlchuAJCao0P-j59GDw/view?usp=sharing" },
      { year: "2016", url: "https://drive.google.com/file/d/11P_Y9aL18AFyDMt6FezHHa3hnkpDImH5/view?usp=sharing" },
      { year: "2015", url: "https://drive.google.com/file/d/11AuSQ4hhhU9_JUQ5MaPMo9r5FzpVxCdM/view?usp=sharing" },
    ]
  },
  {
    id: 6,
    nameEn: "Balikesir University",
    nameAr: "جامعة بالك اسير",
    nameTr: "Balıkesir Üniversitesi",
    papers: [
      { year: "2018", url: "https://drive.google.com/file/d/1H6b-WYOaTj5at2sc1mjehUkPX-YcCaXo/view?usp=sharing" },
      { year: "2017", url: "https://drive.google.com/file/d/1I91OG25OPM0SLriUqGqN6S_GCURvKGo-/view?usp=sharing" },
    ]
  },
  {
    id: 7,
    nameEn: "Sivas Cumhuriyet University",
    nameAr: "جامعة جمهوريات",
    nameTr: "Sivas Cumhuriyet Üniversitesi",
    papers: [
      { year: "2019", url: "https://drive.google.com/file/d/1FPL9zufjo7j_qdvFz2Ar7Pqse5oqrTev/view?usp=sharing" },
      { year: "2018", url: "https://drive.google.com/file/d/1FU8qeJzVVsrlcx7HGj57mH4U6WCU-gqC/view?usp=sharing" },
    ]
  },
  {
    id: 8,
    nameEn: "Cukurova University",
    nameAr: "جامعة تشوكوروفا",
    nameTr: "Çukurova Üniversitesi",
    papers: [
      { year: "2018", url: "https://drive.google.com/file/d/1H9BG_hnEOqZpKbrHnk4IAwXmw2HB4LZi/view?usp=sharing" },
      { year: "2017", url: "https://drive.google.com/file/d/1H92I1_lPTfteYJ1WmAq39EiWSLwEqw2t/view?usp=sharing" },
      { year: "2016", url: "https://drive.google.com/file/d/1HArLAo6G3sWCVV1o-YQUoWsF2edpYXD0/view?usp=sharing" },
    ]
  },
  {
    id: 9,
    nameEn: "Kutahya Dumlupinar University",
    nameAr: "جامعة كوتاهيا دوملوبينار",
    nameTr: "Kütahya Dumlupınar Üniversitesi",
    papers: [
      { year: "2020", url: "https://drive.google.com/file/d/1HoicNasJvwezWNJWM87a17fH8uX1NaHk/view?usp=sharing" },
      { year: "2019", url: "https://drive.google.com/file/d/1I5az8yNIv_LF5uYy2JnL26wlpyR35GRI/view?usp=sharing" },
      { year: "2018", url: "https://drive.google.com/file/d/1HVqUk_y_ulvj5R-6K0DyrDfiprVeTkQU/view?usp=sharing" },
      { year: "2017", url: "https://drive.google.com/file/d/1HhuJ2z9V1rn2Hg4GWzHMPALqhgqXUQ6e/view?usp=sharing" },
    ]
  },
  {
    id: 10,
    nameEn: "Erciyes University",
    nameAr: "جامعة ارجيس",
    nameTr: "Erciyes Üniversitesi",
    papers: [
      { year: "2019", url: "https://drive.google.com/file/d/11XQwhmSr_hQUPCCehtJm3o2BWrBIX0f0/view?usp=sharing" },
      { year: "2017", url: "https://drive.google.com/file/d/11ZUITm3LVBpfp3ziQCo-WpApNJU3Wb0O/view?usp=sharing" },
    ]
  },
  {
    id: 11,
    nameEn: "Firat University",
    nameAr: "جامعة الفرات",
    nameTr: "Fırat Üniversitesi",
    papers: [
      { year: "2021", url: "https://drive.google.com/file/d/1Is5JYIPKmrH4VYhcj9aC7USIN6Y6IyVw/view?usp=sharing" },
      { year: "2019", url: "https://drive.google.com/file/d/137GbSWDMaHi4EOc1FCKc1MHhvfIfOxlo/view?usp=sharing" },
      { year: "2018", url: "https://drive.google.com/file/d/138a7QHwtwI2AwVVGkdnJbIPqFbQ5rJdt/view?usp=sharing" },
    ]
  },
  {
    id: 12,
    nameEn: "Gaziantep University",
    nameAr: "جامعة غازي عنتاب",
    nameTr: "Gaziantep Üniversitesi",
    papers: [
      { year: "2021", url: "https://drive.google.com/file/d/1OMk0um4UE63hr85wBeu2SPk3OjdcQ6lk/view?usp=sharing" },
      { year: "2020", url: "https://drive.google.com/file/d/1D8pvma2dTUUx9EpI7M4q2vkHtZtKuFn0/view?usp=sharing" },
      { year: "2019", url: "https://drive.google.com/file/d/1eSW7-15ZRGZ_OB6vXcs-3vkoI-3L5TW4/view" },
    ]
  },
  {
    id: 13,
    nameEn: "Harran University",
    nameAr: "جامعة حران",
    nameTr: "Harran Üniversitesi",
    papers: [
      { year: "01/2023", url: "https://drive.google.com/file/d/1uAxjaQmwYeW6K2j4D0jahAojGL7CuCd1/view?usp=sharing" },
      { year: "02/2022", url: "https://drive.google.com/file/d/1ORm4d16dUcDMD0LyLZr1wFZyt2VoiKGu/view?usp=sharing" },
      { year: "01/2022", url: "https://drive.google.com/file/d/1-RrYJsohHwRC40Iler-xEMKl3UKp2TDR/view?usp=sharing" },
      { year: "01/2021", url: "https://drive.google.com/file/d/1-EGkMF21G2p8nNzoAY-504U6_gGYllr0/view?usp=sharing" },
      { year: "02/2020", url: "https://drive.google.com/file/d/1-YbiDOIRH1fPp9FRGdomCAjEHmjKw5gx/view?usp=sharing" },
      { year: "01/2020", url: "https://drive.google.com/file/d/1-L22SBf0jIVE_Ap6msn35vhfzfEPxOgn/view?usp=sharing" },
      { year: "01/2019", url: "https://drive.google.com/file/d/1-N0FCGHYoD1hxQ8zyM65uLcdNRuGAoZ4/view?usp=sharing" },
      { year: "02/2018", url: "https://drive.google.com/file/d/1-OM4X4ur1hiqcCI1IEXwr7upv0x0szVZ/view?usp=sharing" },
      { year: "01/2018", url: "https://drive.google.com/file/d/1-BFdUM4aXAPAzz-gELeJE65PPkRZ_Lue/view?usp=sharing" },
    ]
  },
  {
    id: 14,
    nameEn: "Inonu University",
    nameAr: "جامعة اينونو",
    nameTr: "İnönü Üniversitesi",
    papers: [
      { year: "2021", url: "https://drive.google.com/file/d/1OOnq8xz6TPSv4TaFWRNtquIDnVL3c8Wk/view?usp=sharing" },
      { year: "2020", url: "https://drive.google.com/file/d/1F7rL-KZ59TfJ9aBOxE6kZM2Ms3ZzNepc/view?usp=sharing" },
      { year: "2019", url: "https://drive.google.com/file/d/1FBIZoaYxQ7AFQzukiyAvStfDzyHKBM14/view?usp=sharing" },
      { year: "2018", url: "https://drive.google.com/file/d/1FAtv4ERbtuZ0cvmmdZNUOHN81yzzdwnF/view?usp=sharing" },
      { year: "2017", url: "https://drive.google.com/file/d/1FLYqaowvG-ldCwuwM0nPT9HWUKzCBOuI/view?usp=sharing" },
    ]
  },
  {
    id: 15,
    nameEn: "Istanbul University",
    nameAr: "جامعة اسطنبول",
    nameTr: "İstanbul Üniversitesi",
    papers: [
      { year: "2023", url: "https://drive.google.com/file/d/1F7-ir-GI0-QH07CSw9Z219s-ss_HwlOQ/view?usp=sharing" },
      { year: "2022", url: "https://drive.google.com/file/d/1zQmkygIbgPjiKBGFNIJvSa3nPKG4oVUj/view?usp=sharing" },
      { year: "2021", url: "https://drive.google.com/file/d/1GduPHN2vO-ZQ58M5io5wHhIIxqJVZ3Ae/view?usp=sharing" },
      { year: "2020", url: "https://drive.google.com/file/d/1H6XlnXc52t_aDCZGFh2HylIi7uxtKzLt/view?usp=sharing" },
      { year: "2019", url: "https://drive.google.com/file/d/1H6XlnXc52t_aDCZGFh2HylIi7uxtKzLt/view?usp=sharing" },
      { year: "2018", url: "https://drive.google.com/file/d/1HC2QAVyeoUi5QIQGglDYebvA48LoJ-Fw/view?usp=sharing" },
      { year: "2017", url: "https://drive.google.com/file/d/1GS-bVHr22NdGUuCL8CxndFqzPfURKmmA/view?usp=sharing" },
      { year: "2016", url: "https://drive.google.com/file/d/1GkWWTpp6YWghkWoX0I6pG1hVXZ8e6dAW/view?usp=sharing" },
      { year: "2015", url: "https://drive.google.com/file/d/1GZyQ94nATqlhK7fmZ7VnOYg1EPRXXWzz/view?usp=sharing" },
      { year: "2014", url: "https://drive.google.com/file/d/1GfA-NC-2CDeoGRFJtO-pct2N8nqONrx7/view?usp=sharing" },
      { year: "2013", url: "https://drive.google.com/file/d/1H3bUZ1m7R0-xBU5QidK9LcqnmjZ9TIUm/view?usp=sharing" },
    ]
  },
];

export default function YosQuestionsPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const isRTL = locale === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUniversities, setExpandedUniversities] = useState<number[]>([1]); // TR-YÖS expanded by default

  const toggleUniversity = (id: number) => {
    setExpandedUniversities(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const filteredUniversities = examPapersData.filter(uni =>
    uni.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    uni.nameAr.includes(searchQuery) ||
    uni.nameTr.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <section className="bg-gradient-to-br from-red-600 to-red-700 text-white pt-24 pb-16 md:pt-32 md:pb-24">
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

      {/* Info Banner */}
      <section className="py-8 md:py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 md:p-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg shrink-0">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700 dark:text-gray-300">
                    {isRTL
                      ? 'هذه الصفحة لعرض أسئلة السنوات السابقة لاختبارات اليوس السابقة. يُذكر أن بعض الجامعات لا تنشر اختباراتها.'
                      : 'This page displays past YÖS exam questions from previous years. Note that some universities do not publish their exams.'}
                  </p>
                  <p className="text-amber-700 dark:text-amber-400 font-medium">
                    {isRTL
                      ? 'اختبارات اليوس تم إلغاؤها وحل محلها اختبار اليوس الموحد (TR-YÖS) في تركيا، ولكن يمكن للطلاب الاستفادة من أسئلة دورات اليوس السابقة للتدرب على اختبار اليوس الموحد.'
                      : 'Individual university YÖS exams have been replaced by the Unified YÖS Exam (TR-YÖS) in Turkey, but students can still benefit from past exam papers for practice.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Past Exam Papers Section */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-800">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-3">
                {isRTL ? 'أسئلة دورات اليوس السابقة' : 'Past YÖS Exam Papers'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {isRTL
                  ? `${examPapersData.length} جامعة متاحة مع ${examPapersData.reduce((acc, uni) => acc + uni.papers.length, 0)} ورقة امتحان`
                  : `${examPapersData.length} universities available with ${examPapersData.reduce((acc, uni) => acc + uni.papers.length, 0)} exam papers`}
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                <input
                  type="text"
                  placeholder={isRTL ? 'ابحث عن جامعة...' : 'Search for a university...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
                />
              </div>
            </div>

            {/* University Cards */}
            <div className="space-y-4">
              {filteredUniversities.map((university) => {
                const isExpanded = expandedUniversities.includes(university.id);
                const isUnified = 'isUnified' in university && university.isUnified;

                return (
                  <div
                    key={university.id}
                    className={`rounded-xl overflow-hidden transition-all ${
                      isUnified
                        ? 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-2 border-amber-400 dark:border-amber-600'
                        : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <button
                      onClick={() => toggleUniversity(university.id)}
                      className="w-full px-5 py-4 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${
                          isUnified
                            ? 'bg-amber-100 dark:bg-amber-900/50'
                            : 'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          {isUnified ? (
                            <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          ) : (
                            <GraduationCap className="h-5 w-5 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div className="text-left">
                          <h3 className={`font-semibold ${isUnified ? 'text-amber-900 dark:text-amber-100' : 'text-gray-900 dark:text-gray-50'}`}>
                            {isRTL ? university.nameAr : university.nameEn}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {university.nameTr}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isUnified
                            ? 'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}>
                          {university.papers.length} {isRTL ? 'ورقة' : 'papers'}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className={`px-5 pb-5 pt-2 border-t ${
                        isUnified
                          ? 'border-amber-200 dark:border-amber-700'
                          : 'border-gray-200 dark:border-gray-600'
                      }`}>
                        <div className="flex flex-wrap gap-2">
                          {university.papers.map((paper, index) => (
                            <a
                              key={index}
                              href={paper.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                isUnified
                                  ? 'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-100 hover:bg-amber-300 dark:hover:bg-amber-700'
                                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50'
                              }`}
                            >
                              <FileDown className="h-4 w-4" />
                              {paper.year}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredUniversities.length === 0 && (
                <div className="text-center py-12">
                  <GraduationCap className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {isRTL ? 'لم يتم العثور على جامعات مطابقة' : 'No matching universities found'}
                  </p>
                </div>
              )}
            </div>
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
