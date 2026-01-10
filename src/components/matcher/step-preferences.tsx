'use client';

import { useState, useEffect } from 'react';
import { Settings, Wallet, Heart } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { FUNDING_LABELS, type FundingPreference, type MatcherProfileInput } from '@/lib/validations/matcher';

interface StepPreferencesProps {
  locale: string;
  data: Partial<MatcherProfileInput>;
  onDataChange: (data: Partial<MatcherProfileInput>) => void;
}

export function StepPreferences({ locale, data, onDataChange }: StepPreferencesProps) {
  const isRTL = locale === 'ar';

  const [fundingPreference, setFundingPreference] = useState<FundingPreference>(
    (data.fundingPreference as FundingPreference) || 'FULLY_FUNDED_ONLY'
  );
  const [specialCircumstances, setSpecialCircumstances] = useState<string>(
    data.specialCircumstances || ''
  );

  // Update parent on changes
  useEffect(() => {
    onDataChange({
      fundingPreference,
      specialCircumstances: specialCircumstances || null,
    });
  }, [fundingPreference, specialCircumstances, onDataChange]);

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
          <Settings className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {isRTL ? 'تفضيلاتك' : 'Your Preferences'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {isRTL
            ? 'حدد تفضيلاتك للحصول على نتائج أكثر دقة'
            : 'Set your preferences for more accurate results'}
        </p>
      </div>

      {/* Funding Preference */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Wallet className="w-4 h-4 text-gray-500" />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isRTL ? 'تفضيل التمويل' : 'Funding Preference'}
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFundingPreference('FULLY_FUNDED_ONLY')}
            className={`
              p-4 rounded-lg border text-start transition-all
              ${
                fundingPreference === 'FULLY_FUNDED_ONLY'
                  ? 'bg-primary/10 border-primary ring-2 ring-primary/20'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary/50'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                  fundingPreference === 'FULLY_FUNDED_ONLY'
                    ? 'border-primary bg-primary'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {fundingPreference === 'FULLY_FUNDED_ONLY' && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {isRTL ? FUNDING_LABELS.FULLY_FUNDED_ONLY.ar : FUNDING_LABELS.FULLY_FUNDED_ONLY.en}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {isRTL
                    ? 'عرض المنح الممولة بالكامل فقط (رسوم + سكن + راتب)'
                    : 'Show only fully funded scholarships (tuition + housing + stipend)'}
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setFundingPreference('ANY')}
            className={`
              p-4 rounded-lg border text-start transition-all
              ${
                fundingPreference === 'ANY'
                  ? 'bg-primary/10 border-primary ring-2 ring-primary/20'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary/50'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                  fundingPreference === 'ANY'
                    ? 'border-primary bg-primary'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {fundingPreference === 'ANY' && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {isRTL ? FUNDING_LABELS.ANY.ar : FUNDING_LABELS.ANY.en}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {isRTL
                    ? 'عرض جميع المنح بما فيها الممولة جزئياً'
                    : 'Show all scholarships including partially funded ones'}
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Special Circumstances */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-4 h-4 text-gray-500" />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isRTL ? 'ظروف خاصة' : 'Special Circumstances'}
            <span className="text-gray-400 text-xs mx-2">
              ({isRTL ? 'اختياري' : 'Optional'})
            </span>
          </label>
        </div>
        <Textarea
          placeholder={
            isRTL
              ? 'مثال: لاجئ، ذوي احتياجات خاصة، أول جيل جامعي في العائلة، ظروف مالية صعبة...'
              : 'e.g., Refugee status, disability, first-generation student, financial hardship...'
          }
          value={specialCircumstances}
          onChange={(e) => setSpecialCircumstances(e.target.value)}
          rows={3}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {isRTL
            ? 'بعض المنح لها فئات خاصة للطلاب ذوي الظروف المعينة'
            : 'Some scholarships have special categories for students with certain circumstances'}
        </p>
      </div>

      {/* Tips Box */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
          {isRTL ? 'معلومة' : 'Note'}
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          {isRTL
            ? 'اختيار "ممولة بالكامل فقط" قد يقلل من عدد النتائج، لكنه يضمن حصولك على منح تغطي جميع التكاليف.'
            : 'Selecting "Fully Funded Only" may reduce the number of results, but ensures you get scholarships that cover all costs.'}
        </p>
      </div>
    </div>
  );
}
