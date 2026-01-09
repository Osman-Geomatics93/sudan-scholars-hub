'use client';

import { usePathname } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Card } from '@/components/ui/card';
import { AdmissionsTable } from '@/components/features/admissions-table';
import { admissionsData } from '@/lib/admissions-data';
import {
  Calendar,
  CheckCircle,
  Database,
  RefreshCw,
  Search,
  Filter,
  Palette,
  Star,
  ArrowRight,
  FileText,
  Globe,
  Clock,
  Award,
} from 'lucide-react';

export default function AdmissionsCalendarPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const isRTL = locale === 'ar';

  const calendarContains = isRTL
    ? [
        { icon: FileText, text: 'اسم الجامعة' },
        { icon: Globe, text: 'مدينة الجامعة' },
        { icon: Clock, text: 'بدء التسجيل' },
        { icon: Clock, text: 'انتهاء التسجيل' },
        { icon: Award, text: 'صدور النتائج' },
        { icon: CheckCircle, text: 'الشهادات المقبولة' },
        { icon: ArrowRight, text: 'رابط لمشاهدة جميع التفاصيل' },
        { icon: Star, text: 'الترتيب المحلي للجامعة' },
      ]
    : [
        { icon: FileText, text: 'University Name' },
        { icon: Globe, text: 'University City' },
        { icon: Clock, text: 'Registration Start' },
        { icon: Clock, text: 'Registration End' },
        { icon: Award, text: 'Results Date' },
        { icon: CheckCircle, text: 'Accepted Certificates' },
        { icon: ArrowRight, text: 'Link to View All Details' },
        { icon: Star, text: 'Local University Ranking' },
      ];

  const calendarFeatures = isRTL
    ? [
        'بسبب تميز تقويمنا تم تصدره نتائج البحث في جوجل (Google) ولهذا يمكنكم العثور على التقويم بشكل اسرع',
        'تقويمنا يحتوى على ميزات لا يمكن ايجادها في اماكن أُخرى ومن اهمها اختيار الشهادة المقبولة',
        'عن طريق الضغط على رابط التفاصيل يمكنكم بسهولة ايجاد التفاصيل بشكل كامل وبشكل سريع',
        'يتم تحديث تقويم المفاضلات بشكل مستمر لكي لا يُفَوت الطالب أيّة مفاضلة',
      ]
    : [
        'Our calendar ranks high in Google search results, making it easy to find',
        'Our calendar contains features not found elsewhere, including certificate filter',
        'Click the details link to easily find complete information quickly',
        'The admissions calendar is updated continuously so students don\'t miss any deadline',
      ];

  const latestUpdates = isRTL
    ? [
        { icon: RefreshCw, text: 'تم تحديث تقويم المفاضلات بشكل كامل ليسهل عليكم العثور على المفاضلات بشكل اسرع واسلس' },
        { icon: Filter, text: 'ميزة الفرز ولتطبيقها يمكنكم الضغط على عناوين الأعمدة' },
        { icon: CheckCircle, text: 'تم إضافة ميزة اختيار الشهادة المقبولة ليسهل العثور على الجامعة التي تناسب شهادتكم' },
        { icon: Search, text: 'اضافة ميزة البحث لمشاهدة الجامعة بشكل اسرع' },
        { icon: Palette, text: 'الوان اضافية لمعرفة حالة التسجيل بشكل واضح' },
      ]
    : [
        { icon: RefreshCw, text: 'Completely updated calendar design for easier and smoother navigation' },
        { icon: Filter, text: 'Sorting feature - click column headers to sort' },
        { icon: CheckCircle, text: 'Added certificate filter to find universities matching your certificate' },
        { icon: Search, text: 'Added search feature for faster university lookup' },
        { icon: Palette, text: 'Additional colors to clearly indicate registration status' },
      ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 to-red-700 text-white pt-24 pb-16 md:pt-32 md:pb-24">
        <Container>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Calendar className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {isRTL ? 'تقويم المفاضلات 2026' : 'Admissions Calendar 2026'}
            </h1>
            <p className="text-lg md:text-xl text-red-100 max-w-2xl mx-auto">
              {isRTL
                ? 'تقويم المفاضلات علي الجامعات التركية - تتبع مواعيد التقديم والمفاضلات'
                : 'Turkish University Admissions Calendar - Track application deadlines and admissions dates'}
            </p>
          </div>
        </Container>
      </section>

      {/* Introduction Section */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-900">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-6">
              {isRTL ? 'تعريف' : 'Introduction'}
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {isRTL
                  ? 'مرحبا بكم في صفحة تقويم المفاضلات. تم إنشاء تقويم المفاضلات ليتمكن الطالب الراغب بالدراسة في تركيا من التسجيل على الجامعة التي تناسبه بشكل سلس، تقويم المفاضلات وموقعنا الالكتروني يتيح للطالب متابعة الأخبار بشكل أسرع من أي مصدر آخر، يتصدر تقويمنا نتائج البحث لعدة اسباب اهمها هي رغبة الطالب بالحصول على المعلومات بشكل افضل واسرع بدون أي تأخير.'
                  : 'Welcome to the Admissions Calendar page. This calendar was created to help students who want to study in Turkey register at suitable universities smoothly. Our admissions calendar and website allow students to follow the news faster than any other source. Our calendar ranks high in search results for several reasons, most importantly the student\'s desire to obtain information better and faster without any delay.'}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* What Calendar Contains */}
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-950">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-8 flex items-center gap-3">
              <Database className="h-8 w-8 text-red-600" />
              {isRTL ? 'ماذا يحتوي تقويم المفاضلات الخاص بنا' : 'What Our Calendar Contains'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {calendarContains.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800"
                >
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-red-600" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Calendar Features */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-900">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-8 flex items-center gap-3">
              <Star className="h-8 w-8 text-red-600" />
              {isRTL ? 'مضمون التقويم' : 'Calendar Features'}
            </h2>
            <Card className="p-6">
              <ul className="space-y-4">
                {calendarFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Container>
      </section>

      {/* Latest Updates */}
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-950">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-8 flex items-center gap-3">
              <RefreshCw className="h-8 w-8 text-red-600" />
              {isRTL ? 'اهم تحديثات تقويم المفاضلات' : 'Latest Calendar Updates'}
            </h2>
            <div className="space-y-4">
              {latestUpdates.map((update, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800"
                >
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shrink-0">
                    <update.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{update.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Status Legend */}
      <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <Container>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isRTL ? 'التسجيل مفتوح' : 'Registration Open'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isRTL ? 'ينتهي قريباً' : 'Ending Soon'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isRTL ? 'قادم' : 'Upcoming'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isRTL ? 'انتهى' : 'Ended'}
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Admissions Table */}
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-950">
        <Container>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-8 text-center">
            {isRTL ? 'تقويم المفاضلات' : 'Admissions Calendar'}
          </h2>
          <AdmissionsTable admissions={admissionsData} locale={locale} />
        </Container>
      </section>

      {/* Footer Note */}
      <section className="py-8 bg-white dark:bg-gray-900">
        <Container>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            {isRTL
              ? 'يتم تحديث هذه البيانات بشكل دوري. يرجى التحقق من المواقع الرسمية للجامعات للحصول على أحدث المعلومات.'
              : 'This data is updated periodically. Please verify with official university websites for the most current information.'}
          </p>
        </Container>
      </section>
    </div>
  );
}
