'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Card } from '@/components/ui/card';
import { AdmissionsTable } from '@/components/features/admissions-table';
import { UniversityAdmission, programDurations } from '@/lib/admissions-data';
import { SkeletonTable } from '@/components/ui/skeleton';
import {
  Sun,
  CheckCircle,
  Database,
  RefreshCw,
  Search,
  Palette,
  Star,
  ArrowRight,
  FileText,
  Globe,
  Clock,
  Award,
  Languages,
  Calendar,
} from 'lucide-react';

export default function SummerCalendarPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const isRTL = locale === 'ar';

  const [admissions, setAdmissions] = useState<UniversityAdmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdmissions() {
      try {
        const res = await fetch('/api/university-admissions?active=true&calendarType=summer');
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
        { icon: Calendar, text: 'مدة البرنامج' },
        { icon: Languages, text: 'لغة التدريس' },
        { icon: ArrowRight, text: 'رابط لمشاهدة جميع التفاصيل' },
        { icon: Award, text: 'رسوم التقديم' },
      ]
    : [
        { icon: FileText, text: 'University Name' },
        { icon: Globe, text: 'University City' },
        { icon: Clock, text: 'Registration Start' },
        { icon: Clock, text: 'Registration End' },
        { icon: Calendar, text: 'Program Duration' },
        { icon: Languages, text: 'Language of Instruction' },
        { icon: ArrowRight, text: 'Link to View All Details' },
        { icon: Award, text: 'Application Fee' },
      ];

  const calendarFeatures = isRTL
    ? [
        'تقويم مخصص للبرامج الصيفية في الجامعات التركية',
        'يحتوي على معلومات مدة البرنامج ولغة التدريس',
        'فرصة ممتازة لتجربة الدراسة في تركيا',
        'برامج متنوعة تشمل اللغة التركية والثقافة والتخصصات الأكاديمية',
      ]
    : [
        'Dedicated calendar for Summer programs in Turkish universities',
        'Contains program duration and language of instruction information',
        'Excellent opportunity to experience studying in Turkey',
        'Various programs including Turkish language, culture, and academic specializations',
      ];

  const latestUpdates = isRTL
    ? [
        { icon: RefreshCw, text: 'تم إضافة تقويم مخصص للبرامج الصيفية' },
        { icon: Calendar, text: 'تم إضافة معلومات مدة البرنامج' },
        { icon: Languages, text: 'تم إضافة لغة التدريس لكل برنامج' },
        { icon: Search, text: 'ميزة البحث والفرز متاحة' },
        { icon: Palette, text: 'الوان مميزة لمعرفة حالة التسجيل' },
      ]
    : [
        { icon: RefreshCw, text: 'Added dedicated calendar for Summer programs' },
        { icon: Calendar, text: 'Added program duration information' },
        { icon: Languages, text: 'Added language of instruction for each program' },
        { icon: Search, text: 'Search and filter features available' },
        { icon: Palette, text: 'Distinct colors to indicate registration status' },
      ];

  const getDurationLabel = (duration: string | undefined) => {
    if (!duration) return '';
    const found = programDurations.find((d) => d.value === duration);
    return isRTL ? found?.labelAr || duration : found?.labelEn || duration;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white pt-24 pb-16 md:pt-32 md:pb-24">
        <Container>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Sun className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {isRTL ? 'تقويم البرامج الصيفية 2026' : 'Summer Programs Calendar 2026'}
            </h1>
            <p className="text-lg md:text-xl text-orange-100 max-w-2xl mx-auto">
              {isRTL
                ? 'البرامج الصيفية في الجامعات التركية - تجربة تعليمية فريدة'
                : 'Summer Programs at Turkish Universities - A Unique Educational Experience'}
            </p>
          </div>
        </Container>
      </section>

      {/* Introduction Section */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-900">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-6 flex items-center gap-3">
              <Sun className="h-8 w-8 text-orange-500" />
              {isRTL ? 'تعريف' : 'Introduction'}
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {isRTL
                  ? 'مرحبا بكم في صفحة تقويم البرامج الصيفية. البرامج الصيفية هي فرصة ممتازة للطلاب الدوليين لتجربة الحياة الأكاديمية في تركيا. تقدم هذه البرامج دورات مكثفة في اللغة التركية والثقافة والتخصصات الأكاديمية المختلفة.'
                  : 'Welcome to the Summer Programs Calendar page. Summer programs are an excellent opportunity for international students to experience academic life in Turkey. These programs offer intensive courses in Turkish language, culture, and various academic specializations.'}
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
              <Database className="h-8 w-8 text-orange-500" />
              {isRTL ? 'ماذا يحتوي التقويم' : 'What Our Calendar Contains'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {calendarContains.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800"
                >
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-orange-500" />
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
              <Star className="h-8 w-8 text-orange-500" />
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
              <RefreshCw className="h-8 w-8 text-orange-500" />
              {isRTL ? 'أحدث التحديثات' : 'Latest Updates'}
            </h2>
            <div className="space-y-4">
              {latestUpdates.map((update, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800"
                >
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center shrink-0">
                    <update.icon className="h-5 w-5 text-orange-500" />
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
            {isRTL ? 'تقويم البرامج الصيفية' : 'Summer Programs Calendar'}
          </h2>
          {loading ? (
            <div className="space-y-4">
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              <SkeletonTable columns={12} rows={10} showHeader />
            </div>
          ) : admissions.length > 0 ? (
            <>
              {/* Summer Programs with Duration and Language Info */}
              <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {admissions.slice(0, 6).map((admission) => (
                  <Card key={admission.id} className="p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {isRTL ? admission.universityNameAr : admission.universityNameEn}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Globe className="h-4 w-4" />
                        <span>{isRTL ? admission.cityAr : admission.city}</span>
                      </div>
                      {admission.programDuration && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          <span>{getDurationLabel(admission.programDuration)}</span>
                        </div>
                      )}
                      {admission.languageOfInstruction && admission.languageOfInstruction.length > 0 && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Languages className="h-4 w-4" />
                          <span>{admission.languageOfInstruction.join(', ')}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(admission.registrationStart).toLocaleDateString()} -{' '}
                          {new Date(admission.registrationEnd).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <a
                      href={admission.detailsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700"
                    >
                      {isRTL ? 'عرض التفاصيل' : 'View Details'}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Card>
                ))}
              </div>
              <AdmissionsTable admissions={admissions} locale={locale} />
            </>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
              <Sun className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {isRTL ? 'لا توجد برامج صيفية حالياً' : 'No Summer Programs Available'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {isRTL
                  ? 'سيتم إضافة البرامج الصيفية قريباً'
                  : 'Summer programs will be added soon'}
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
