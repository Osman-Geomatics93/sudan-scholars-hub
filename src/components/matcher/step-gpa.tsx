'use client';

import { useState, useEffect } from 'react';
import { GraduationCap, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { GPA_SYSTEMS, type GPASystem, toPercentage } from '@/lib/gpa-utils';
import { validateGPAInput } from '@/lib/validations/gpa';
import type { MatcherProfileInput } from '@/lib/validations/matcher';

interface StepGPAProps {
  locale: string;
  data: Partial<MatcherProfileInput>;
  onDataChange: (data: Partial<MatcherProfileInput>) => void;
}

export function StepGPA({ locale, data, onDataChange }: StepGPAProps) {
  const isRTL = locale === 'ar';

  const [gpaSystem, setGpaSystem] = useState<GPASystem>(
    (data.gpaSystem as GPASystem) || 'percentage'
  );
  const [inputValue, setInputValue] = useState<string>(
    data.gpaValue?.toString() || ''
  );
  const [error, setError] = useState<string>('');
  const [percentValue, setPercentValue] = useState<number | null>(
    data.gpaValue || null
  );

  // System config
  const systemConfig = GPA_SYSTEMS.find((s) => s.id === gpaSystem);

  // System options
  const systemOptions = GPA_SYSTEMS.map((system) => ({
    value: system.id,
    label: isRTL ? system.name.ar : system.name.en,
  }));

  // Handle GPA system change
  const handleSystemChange = (newSystem: GPASystem) => {
    setGpaSystem(newSystem);
    setInputValue('');
    setError('');
    setPercentValue(null);
    onDataChange({ gpaSystem: newSystem, gpaValue: 0 });
  };

  // Handle input change and validate
  const handleInputChange = (value: string) => {
    setInputValue(value);

    if (!value) {
      setError('');
      setPercentValue(null);
      return;
    }

    // Validate input
    const validation = validateGPAInput(value, gpaSystem);
    if (!validation.valid) {
      setError(validation.error || '');
      setPercentValue(null);
      return;
    }

    setError('');

    // Convert to percentage
    const numValue = parseFloat(value);
    const percent = toPercentage(numValue, gpaSystem);
    setPercentValue(percent);
    onDataChange({
      gpaSystem,
      gpaValue: percent,
    });
  };

  // Get placeholder text
  const getPlaceholder = () => {
    if (!systemConfig) return '';
    if (systemConfig.isDiscrete) return '';
    return isRTL
      ? `أدخل القيمة (${systemConfig.min} - ${systemConfig.max})`
      : `Enter value (${systemConfig.min} - ${systemConfig.max})`;
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
          <GraduationCap className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {isRTL ? 'أدخل معدلك الأكاديمي' : 'Enter Your GPA'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {isRTL
            ? 'سنقوم بتحويل معدلك للمقارنة مع متطلبات المنح'
            : "We'll convert your GPA to compare with scholarship requirements"}
        </p>
      </div>

      {/* GPA System Selector */}
      <div>
        <Select
          label={isRTL ? 'نظام الدرجات' : 'Grading System'}
          value={gpaSystem}
          onChange={(e) => handleSystemChange(e.target.value as GPASystem)}
          options={systemOptions}
        />
        {systemConfig && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Info className="w-3 h-3" />
            {isRTL ? systemConfig.description.ar : systemConfig.description.en}
          </p>
        )}
      </div>

      {/* GPA Input */}
      <div>
        {systemConfig?.isDiscrete ? (
          <Select
            label={isRTL ? 'اختر درجتك' : 'Select Your Grade'}
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            options={(systemConfig.grades || []).map((grade) => ({
              value: grade,
              label: grade,
            }))}
          />
        ) : (
          <Input
            type="number"
            step="0.1"
            label={isRTL ? 'أدخل معدلك' : 'Enter Your GPA'}
            placeholder={getPlaceholder()}
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            error={error}
          />
        )}
      </div>

      {/* Converted Value Display */}
      {percentValue !== null && percentValue > 0 && (
        <div className="p-4 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {isRTL ? 'معدلك بالنسبة المئوية:' : 'Your GPA as percentage:'}
          </p>
          <p className="text-3xl font-bold text-primary">
            {percentValue.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {isRTL
              ? 'هذه القيمة ستُستخدم للمقارنة مع متطلبات المنح المختلفة'
              : 'This value will be used to compare with different scholarship requirements'}
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
          {isRTL ? 'نصيحة' : 'Tip'}
        </h4>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          {isRTL
            ? 'أدخل معدلك الحالي أو المتوقع عند التخرج. معظم المنح تتطلب معدل 70% أو أعلى.'
            : 'Enter your current or expected graduation GPA. Most scholarships require 70% or higher.'}
        </p>
      </div>
    </div>
  );
}
