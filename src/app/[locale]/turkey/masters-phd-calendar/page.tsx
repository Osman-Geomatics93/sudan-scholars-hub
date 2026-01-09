'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Card } from '@/components/ui/card';
import { AdmissionsTable } from '@/components/features/admissions-table';
import { UniversityAdmission } from '@/lib/admissions-data';
import { SkeletonTable } from '@/components/ui/skeleton';
import {
  School,
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
  BookOpen,
} from 'lucide-react';

export default function MastersPhDCalendarPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const isRTL = locale === 'ar';

  const [admissions, setAdmissions] = useState<UniversityAdmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdmissions() {
      try {
        const res = await fetch('/api/university-admissions?active=true&calendarType=masters-phd');
        if (res.ok) {
          const data = await res.json();
          setAdmissions(data.admissions);
        }
      } catch (error) {
        console.error('Failed to fetch admissions:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAdmissions();
  }, []);

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
        { icon: Award, text: 'رسوم التقديم (مجاني أو مدفوع)' },
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
        { icon: Award, text: 'Application Fee (Free or Paid)' },
      ];

  const calendarFeatures = isRTL
    ? [
        'تقويم مخصص لبرامج الماجستير والدكتوراه في الجامعات التركية',
        'يحتوي على جميع المعلومات اللازمة للتقديم على برامج الدراسات العليا',
        'يتم تحديث التقويم بشكل مستمر لضمان دقة المعلومات',
        'يمكنك البحث والفرز حسب الشهادة المقبولة والمدينة',
      ]
    : [
        'Dedicated calendar for Masters and PhD programs in Turkish universities',
        'Contains all necessary information for applying to graduate programs',
        'Calendar is continuously updated to ensure information accuracy',
        'Search and filter by accepted certificate and city',
      ];

  const latestUpdates = isRTL
    ? [
        { icon: RefreshCw, text: 'تم إضافة تقويم مخصص لبرامج الماجستير والدكتوراه' },
        { icon: Filter, text: 'ميزة الفرز والبحث متاحة' },
        { icon: CheckCircle, text: 'تم إضافة ميزة اختيار الشهادة المقبولة' },
        { icon: Search, text: 'اضافة ميزة البحث لمشاهدة الجامعة بشكل اسرع' },
        { icon: Palette, text: 'الوان مميزة لمعرفة حالة التسجيل' },
      ]
    : [
        { icon: RefreshCw, text: 'Added dedicated calendar for Masters and PhD programs' },
        { icon: Filter, text: 'Sorting and search features available' },
        { icon: CheckCircle, text: 'Added certificate filter to find matching universities' },
        { icon: Search, text: 'Added search feature for faster university lookup' },
        { icon: Palette, text: 'Distinct colors to indicate registration status' },
      ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-purple-700 text-white pt-24 pb-16 md:pt-32 md:pb-24">
        <Container>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <School className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {isRTL ? 'تقويم الماجستير والدكتوراه 2026' : 'Masters & PhD Calendar 2026'}
            </h1>
            <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto">
              {isRTL
                ? 'تقويم مفاضلات الماجستير والدكتوراه في الجامعات التركية'
                : 'Graduate Programs Admissions Calendar for Turkish Universities'}
            </p>
          </div>
        </Container>
      </section>

      {/* Introduction Section */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-900">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-6 flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-purple-600" />
              {isRTL ? 'تعريف' : 'Introduction'}
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {isRTL
                  ? 'مرحبا بكم في صفحة تقويم مفاضلات الماجستير والدكتوراه. هذا التقويم مخصص للطلاب الراغبين في إكمال دراستهم العليا في الجامعات التركية. يحتوي التقويم على جميع مواعيد التقديم للبرامج المتاحة في مختلف الجامعات التركية.'
                  : 'Welcome to the Masters & PhD Admissions Calendar page. This calendar is dedicated to students who wish to pursue their graduate studies at Turkish universities. The calendar contains all application deadlines for available programs across various Turkish universities.'}
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
              <Database className="h-8 w-8 text-purple-600" />
              {isRTL ? 'ماذا يحتوي التقويم' : 'What Our Calendar Contains'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {calendarContains.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800"
                >
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-purple-600" />
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
              <Star className="h-8 w-8 text-purple-600" />
              {isRTL ? 'مميزات التقويم' : 'Calendar Features'}
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
              <RefreshCw className="h-8 w-8 text-purple-600" />
              {isRTL ? 'أحدث التحديثات' : 'Latest Updates'}
            </h2>
            <div className="space-y-4">
              {latestUpdates.map((update, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800"
                >
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center shrink-0">
                    <update.icon className="h-5 w-5 text-purple-600" />
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
            {isRTL ? 'تقويم الماجستير والدكتوراه' : 'Masters & PhD Calendar'}
          </h2>
          {loading ? (
            <div className="space-y-4">
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              <SkeletonTable columns={12} rows={10} showHeader />
            </div>
          ) : admissions.length > 0 ? (
            <AdmissionsTable admissions={admissions} locale={locale} />
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
              <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {isRTL ? 'لا توجد مفاضلات حالياً' : 'No Admissions Available'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {isRTL
                  ? 'سيتم إضافة مفاضلات الماجستير والدكتوراه قريباً'
                  : 'Masters & PhD admissions will be added soon'}
              </p>
            </div>
          )}
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
