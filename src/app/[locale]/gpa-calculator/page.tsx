'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Calculator, ArrowLeftRight, Trophy, GraduationCap } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { GPAConverter } from '@/components/features/gpa-converter';
import { GPACourseCalculator } from '@/components/features/gpa-course-calculator';
import { ScholarshipEligibility } from '@/components/features/scholarship-eligibility';
import { MainLayout } from '@/components/layout/main-layout';

type Tab = 'converter' | 'calculator' | 'eligibility';

export default function GPACalculatorPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRTL = locale === 'ar';

  const [activeTab, setActiveTab] = useState<Tab>('converter');
  const [gpaPercent, setGpaPercent] = useState<number | null>(null);

  // Tab configuration
  const tabs: { id: Tab; label: { en: string; ar: string }; icon: typeof Calculator }[] = [
    { id: 'converter', label: { en: 'Converter', ar: 'المحول' }, icon: ArrowLeftRight },
    { id: 'calculator', label: { en: 'Calculator', ar: 'الحاسبة' }, icon: Calculator },
    { id: 'eligibility', label: { en: 'Eligibility', ar: 'الأهلية' }, icon: Trophy },
  ];

  // Handle GPA change from converter or calculator
  const handleGPAChange = (percent: number) => {
    setGpaPercent(percent);
  };

  return (
    <MainLayout locale={locale}>
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10 overflow-x-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
        <Container size="lg" className="py-8 md:py-12 overflow-hidden">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {isRTL ? 'حاسبة المعدل الذكية' : 'Smart GPA Calculator'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {isRTL
                ? 'حوّل معدلك بين أنظمة التقييم المختلفة وتحقق من أهليتك للمنح الدراسية العالمية'
                : 'Convert your GPA between different grading systems and check your eligibility for international scholarships'}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all
                      ${activeTab === tab.id
                        ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{isRTL ? tab.label.ar : tab.label.en}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="grid lg:grid-cols-[1fr,400px] gap-8">
            {/* Main Content */}
            <div>
              {activeTab === 'converter' && (
                <GPAConverter locale={locale} onGPAChange={handleGPAChange} />
              )}
              {activeTab === 'calculator' && (
                <GPACourseCalculator locale={locale} onGPAChange={handleGPAChange} />
              )}
              {activeTab === 'eligibility' && (
                <div className="lg:hidden">
                  <ScholarshipEligibility locale={locale} gpaPercent={gpaPercent} />
                </div>
              )}
            </div>

            {/* Sidebar - Eligibility (always visible on desktop) */}
            <div className={`hidden lg:block ${activeTab === 'eligibility' ? 'lg:hidden' : ''}`}>
              <div className="sticky top-24">
                <ScholarshipEligibility locale={locale} gpaPercent={gpaPercent} />
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {isRTL ? 'نصائح مهمة' : 'Important Tips'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  {isRTL ? 'المنحة التركية' : 'Turkish Scholarship'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isRTL
                    ? 'الحد الأدنى 70% للبكالوريوس و75% للماجستير والدكتوراه'
                    : 'Minimum 70% for Bachelor and 75% for Master/PhD programs'}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  {isRTL ? 'نظام التحويل' : 'Conversion System'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isRTL
                    ? 'التحويلات تقريبية وقد تختلف حسب الجامعة'
                    : 'Conversions are approximate and may vary by university'}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  {isRTL ? 'النظام الألماني' : 'German System'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isRTL
                    ? 'في النظام الألماني، 1.0 هو الأفضل و5.0 هو الراسب'
                    : 'In German system, 1.0 is the best and 5.0 is failing'}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
}
