'use client';

import { CheckCircle2, Edit2 } from 'lucide-react';
import {
  LEVEL_LABELS,
  FIELD_LABELS,
  FUNDING_LABELS,
  LANGUAGE_LABELS,
  type MatcherProfileInput,
} from '@/lib/validations/matcher';
import { GPA_SYSTEMS } from '@/lib/gpa-utils';

interface StepReviewProps {
  locale: string;
  data: Partial<MatcherProfileInput>;
  onDataChange: (data: Partial<MatcherProfileInput>) => void;
}

export function StepReview({ locale, data }: StepReviewProps) {
  const isRTL = locale === 'ar';

  // Get GPA system name
  const gpaSystemName = GPA_SYSTEMS.find((s) => s.id === data.gpaSystem);

  // Review sections
  const sections = [
    {
      title: isRTL ? 'المعدل الأكاديمي' : 'Academic Performance',
      items: [
        {
          label: isRTL ? 'نظام الدرجات' : 'Grading System',
          value: gpaSystemName
            ? isRTL
              ? gpaSystemName.name.ar
              : gpaSystemName.name.en
            : '-',
        },
        {
          label: isRTL ? 'المعدل' : 'GPA',
          value: data.gpaValue ? `${data.gpaValue.toFixed(1)}%` : '-',
        },
      ],
    },
    {
      title: isRTL ? 'المستوى التعليمي' : 'Education Level',
      items: [
        {
          label: isRTL ? 'المستوى الحالي' : 'Current Level',
          value: data.currentLevel
            ? isRTL
              ? LEVEL_LABELS[data.currentLevel]?.ar
              : LEVEL_LABELS[data.currentLevel]?.en
            : '-',
        },
        {
          label: isRTL ? 'الدرجة المستهدفة' : 'Target Degree',
          value: data.targetLevel
            ? isRTL
              ? LEVEL_LABELS[data.targetLevel]?.ar
              : LEVEL_LABELS[data.targetLevel]?.en
            : '-',
        },
        {
          label: isRTL ? 'مجالات الدراسة' : 'Fields of Study',
          value:
            data.fieldsOfStudy?.length
              ? data.fieldsOfStudy
                  .map((f) => (isRTL ? FIELD_LABELS[f]?.ar : FIELD_LABELS[f]?.en))
                  .join(', ')
              : '-',
        },
      ],
    },
    {
      title: isRTL ? 'المعلومات الشخصية' : 'Personal Information',
      items: [
        {
          label: isRTL ? 'البلد' : 'Country',
          value: data.countryOfOrigin || '-',
        },
        {
          label: isRTL ? 'اللغات' : 'Languages',
          value:
            data.languages?.length
              ? data.languages
                  .map((l) => (isRTL ? LANGUAGE_LABELS[l]?.ar || l : LANGUAGE_LABELS[l]?.en || l))
                  .join(', ')
              : '-',
        },
        {
          label: isRTL ? 'العمر' : 'Age',
          value: data.age ? `${data.age}` : isRTL ? 'غير محدد' : 'Not specified',
        },
      ],
    },
    {
      title: isRTL ? 'التفضيلات' : 'Preferences',
      items: [
        {
          label: isRTL ? 'تفضيل التمويل' : 'Funding Preference',
          value: data.fundingPreference
            ? isRTL
              ? FUNDING_LABELS[data.fundingPreference]?.ar
              : FUNDING_LABELS[data.fundingPreference]?.en
            : '-',
        },
        {
          label: isRTL ? 'ظروف خاصة' : 'Special Circumstances',
          value: data.specialCircumstances || (isRTL ? 'لا يوجد' : 'None'),
        },
      ],
    },
  ];

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mb-3">
          <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {isRTL ? 'مراجعة ملفك الشخصي' : 'Review Your Profile'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {isRTL
            ? 'تأكد من صحة المعلومات قبل البحث عن المنح'
            : 'Make sure your information is correct before searching for scholarships'}
        </p>
      </div>

      {/* Review Sections */}
      <div className="space-y-4">
        {sections.map((section) => (
          <div
            key={section.title}
            className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">
              {section.title}
            </h3>
            <div className="space-y-2">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-start text-sm"
                >
                  <span className="text-gray-500 dark:text-gray-400">
                    {item.label}:
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium text-end max-w-[60%]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Ready to Match */}
      <div className="p-4 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg text-center">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {isRTL ? (
            <>
              <span className="font-medium text-primary">جاهز للبحث!</span>
              <br />
              انقر على &quot;ابحث عن المنح&quot; لمعرفة المنح التي تتناسب مع ملفك الشخصي.
            </>
          ) : (
            <>
              <span className="font-medium text-primary">Ready to match!</span>
              <br />
              Click &quot;Find My Scholarships&quot; to discover scholarships that match your profile.
            </>
          )}
        </p>
      </div>

      {/* Edit Hint */}
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
        <Edit2 className="w-3 h-3" />
        {isRTL
          ? 'يمكنك العودة لتعديل أي قسم بالنقر على "السابق"'
          : 'You can go back to edit any section by clicking "Back"'}
      </p>
    </div>
  );
}
