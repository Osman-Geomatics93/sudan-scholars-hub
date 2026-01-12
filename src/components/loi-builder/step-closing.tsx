'use client';

import { useState, useCallback } from 'react';
import { Heart, User, Settings } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { LOIWizardData } from '@/lib/loi-builder/types';
import { getWordCount } from '@/lib/loi-builder/quality-rules';
import { QualityHint } from './quality-hint';
import { WordCounter } from './word-counter';

interface StepClosingProps {
  locale: string;
  data: LOIWizardData;
  onDataChange: (data: Partial<LOIWizardData>) => void;
}

export function StepClosing({ locale, data, onDataChange }: StepClosingProps) {
  const isRTL = locale === 'ar';
  const lang = data.settings.language;

  const handleClosingChange = useCallback(
    (field: keyof typeof data.closing, value: string) => {
      onDataChange({
        closing: { ...data.closing, [field]: value },
      });
    },
    [data.closing, onDataChange]
  );

  const handleSettingsChange = useCallback(
    (field: keyof typeof data.settings, value: string | number) => {
      onDataChange({
        settings: { ...data.settings, [field]: value },
      });
    },
    [data.settings, onDataChange]
  );

  const sectionWordCount =
    getWordCount(data.closing.commitment) +
    getWordCount(data.closing.gratitude);

  return (
    <div className="space-y-6">
      {/* Section explanation */}
      <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border border-primary-100 dark:border-primary-800">
        <div className="flex items-start gap-3">
          <Heart className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-primary-700 dark:text-primary-300">
              {isRTL ? 'الختام' : 'Closing'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {isRTL
                ? 'اختم خطابك ببيان التزام صادق وشكر للجنة. تجنب أن تكون عامًا - عبّر عن حماسك الحقيقي.'
                : 'End your letter with a sincere commitment statement and gratitude to the committee. Avoid being generic - express your genuine enthusiasm.'}
            </p>
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="space-y-5">
        {/* Commitment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {isRTL ? 'بيان الالتزام' : 'Commitment Statement'} *
          </label>
          <Textarea
            value={data.closing.commitment}
            onChange={(e) => handleClosingChange('commitment', e.target.value)}
            placeholder={
              isRTL
                ? 'مثال: ألتزم باستخدام المعرفة والمهارات المكتسبة في تركيا للمساهمة في تطوير قطاع التكنولوجيا في السودان، وأتطلع لأكون سفيرًا لمنحة تركيا في بلدي...'
                : 'e.g., I commit to using the knowledge and skills gained in Turkey to contribute to Sudan\'s tech sector development, and I look forward to being an ambassador for Turkiye Scholarships in my country...'
            }
            className="min-h-[100px]"
          />
          <QualityHint
            text={data.closing.commitment}
            fieldType="commitment"
            language={lang}
          />
        </div>

        {/* Gratitude */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {isRTL ? 'الشكر والامتنان' : 'Gratitude'} *
          </label>
          <Textarea
            value={data.closing.gratitude}
            onChange={(e) => handleClosingChange('gratitude', e.target.value)}
            placeholder={
              isRTL
                ? 'مثال: أشكر لجنة الاختيار على وقتها في مراجعة طلبي. سيكون من شرفي العظيم أن أكون جزءًا من مجتمع منحة تركيا.'
                : 'e.g., I thank the selection committee for their time in reviewing my application. It would be my great honor to be part of the Turkiye Scholarships community.'
            }
            className="min-h-[80px]"
          />
          <QualityHint
            text={data.closing.gratitude}
            fieldType="gratitude"
            language={lang}
          />
        </div>
      </div>

      {/* Settings section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">
            {isRTL ? 'إعدادات الخطاب' : 'Letter Settings'}
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <Label htmlFor="fullName" className="mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              {isRTL ? 'الاسم الكامل' : 'Full Name'} *
            </Label>
            <Input
              id="fullName"
              value={data.settings.fullName}
              onChange={(e) => handleSettingsChange('fullName', e.target.value)}
              placeholder={isRTL ? 'مثال: أحمد محمد علي' : 'e.g., Ahmed Mohamed Ali'}
            />
          </div>

          {/* Tone */}
          <div>
            <Label htmlFor="tone" className="mb-2">
              {isRTL ? 'نبرة الخطاب' : 'Tone'}
            </Label>
            <select
              id="tone"
              value={data.settings.tone}
              onChange={(e) => handleSettingsChange('tone', e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="formal">
                {isRTL ? 'رسمي' : 'Formal'}
              </option>
              <option value="balanced">
                {isRTL ? 'متوازن (موصى به)' : 'Balanced (Recommended)'}
              </option>
              <option value="personal">
                {isRTL ? 'شخصي لكن مهني' : 'Personal but Professional'}
              </option>
            </select>
          </div>

          {/* Language */}
          <div>
            <Label htmlFor="language" className="mb-2">
              {isRTL ? 'لغة الخطاب' : 'Letter Language'}
            </Label>
            <select
              id="language"
              value={data.settings.language}
              onChange={(e) => handleSettingsChange('language', e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="en">English</option>
              <option value="tr">Türkçe</option>
            </select>
          </div>

          {/* Target Word Count */}
          <div>
            <Label htmlFor="wordCount" className="mb-2">
              {isRTL ? 'عدد الكلمات المستهدف' : 'Target Word Count'}
            </Label>
            <select
              id="wordCount"
              value={data.settings.targetWordCount}
              onChange={(e) => handleSettingsChange('targetWordCount', parseInt(e.target.value))}
              className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value={500}>500 {isRTL ? 'كلمة (قصير)' : 'words (Short)'}</option>
              <option value={700}>700 {isRTL ? 'كلمة (موصى به)' : 'words (Recommended)'}</option>
              <option value={900}>900 {isRTL ? 'كلمة (مفصل)' : 'words (Detailed)'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section word count */}
      <WordCounter
        current={sectionWordCount}
        min={30}
        max={60}
        label={isRTL ? 'كلمات هذا القسم' : 'Section words'}
      />
    </div>
  );
}
