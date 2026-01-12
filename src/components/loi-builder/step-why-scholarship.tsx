'use client';

import { useState, useCallback } from 'react';
import { Sparkles, Award } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { LOIWizardData } from '@/lib/loi-builder/types';
import { getWordCount } from '@/lib/loi-builder/quality-rules';
import { QualityHint } from './quality-hint';
import { WordCounter } from './word-counter';

interface StepWhyScholarshipProps {
  locale: string;
  data: LOIWizardData;
  onDataChange: (data: Partial<LOIWizardData>) => void;
}

export function StepWhyScholarship({ locale, data, onDataChange }: StepWhyScholarshipProps) {
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<string | null>(null);

  const isRTL = locale === 'ar';
  const lang = data.settings.language;

  const handleChange = useCallback(
    (field: keyof typeof data.whyScholarship, value: string) => {
      onDataChange({
        whyScholarship: { ...data.whyScholarship, [field]: value },
      });
    },
    [data.whyScholarship, onDataChange]
  );

  const handleGetAISuggestion = async (field: string) => {
    setIsLoadingAI(true);
    setActiveField(field);
    setAiSuggestion(null);

    try {
      const response = await fetch('/api/loi-builder/ai-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionName: 'whyScholarship',
          fieldName: field,
          currentText: data.whyScholarship[field as keyof typeof data.whyScholarship] || '',
          fieldOfStudy: data.hook.fieldOfInterest,
          language: lang,
        }),
      });

      const result = await response.json();
      if (result.suggestion) {
        setAiSuggestion(result.suggestion);
      }
    } catch (error) {
      console.error('AI suggestion error:', error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const sectionWordCount =
    getWordCount(data.whyScholarship.whatAttracted) +
    getWordCount(data.whyScholarship.alignmentWithGoals) +
    getWordCount(data.whyScholarship.uniqueOffering);

  return (
    <div className="space-y-6">
      {/* Section explanation */}
      <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border border-primary-100 dark:border-primary-800">
        <div className="flex items-start gap-3">
          <Award className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-primary-700 dark:text-primary-300">
              {isRTL ? 'لماذا منحة تركيا' : 'Why Turkiye Scholarships'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {isRTL
                ? 'اشرح ما الذي يجذبك تحديدًا لبرنامج منح تركيا. تجنب العبارات العامة مثل "منحة رائعة" - كن محددًا.'
                : 'Explain what specifically attracts you to the Turkiye Scholarships program. Avoid generic praise like "great scholarship" - be specific.'}
            </p>
          </div>
        </div>
      </div>

      {/* Guiding questions */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
          {isRTL ? 'أسئلة إرشادية' : 'Guiding Questions'}
        </h4>
        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>
            {isRTL
              ? 'ما الميزات المحددة في برنامج منح تركيا التي تتوافق مع احتياجاتك؟'
              : 'What specific features of Turkiye Scholarships align with your needs?'}
          </li>
          <li>
            {isRTL
              ? 'كيف يتناسب هذا البرنامج مع خطتك المهنية طويلة المدى؟'
              : 'How does this program fit into your long-term career plan?'}
          </li>
          <li>
            {isRTL
              ? 'ما الذي يميز هذه المنحة عن غيرها بالنسبة لك؟'
              : 'What sets this scholarship apart from others for you?'}
          </li>
        </ul>
      </div>

      {/* Form fields */}
      <div className="space-y-5">
        {/* What Attracted */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {isRTL ? 'ما الذي جذبك' : 'What Attracted You'} *
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleGetAISuggestion('whatAttracted')}
              disabled={isLoadingAI}
              className="text-primary-600 hover:text-primary-700"
            >
              <Sparkles className="w-4 h-4 me-1" />
              {isLoadingAI && activeField === 'whatAttracted'
                ? isRTL ? 'جاري...' : 'Loading...'
                : isRTL ? 'اقتراح AI' : 'AI Suggest'}
            </Button>
          </div>
          <Textarea
            value={data.whyScholarship.whatAttracted}
            onChange={(e) => handleChange('whatAttracted', e.target.value)}
            placeholder={
              isRTL
                ? 'مثال: ينجذبني برنامج منح تركيا بسبب تغطيته الشاملة للدراسة والمعيشة، وفرصة تعلم اللغة التركية، وشبكة خريجين تضم أكثر من 17,000 طالب من 160 دولة...'
                : 'e.g., I am drawn to Turkiye Scholarships because of its comprehensive coverage of tuition and living expenses, the opportunity to learn Turkish language, and the alumni network of 17,000+ scholars from 160 countries...'
            }
            className="min-h-[100px]"
          />
          <QualityHint
            text={data.whyScholarship.whatAttracted}
            fieldType="whatAttracted"
            language={lang}
          />
          {aiSuggestion && activeField === 'whatAttracted' && (
            <div className="mt-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-sm">
              <p className="text-primary-700 dark:text-primary-300">
                <strong>{isRTL ? 'اقتراح:' : 'Suggestion:'}</strong> {aiSuggestion}
              </p>
            </div>
          )}
        </div>

        {/* Alignment with Goals */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {isRTL ? 'التوافق مع أهدافك' : 'Alignment with Your Goals'} *
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleGetAISuggestion('alignmentWithGoals')}
              disabled={isLoadingAI}
              className="text-primary-600 hover:text-primary-700"
            >
              <Sparkles className="w-4 h-4 me-1" />
              {isLoadingAI && activeField === 'alignmentWithGoals'
                ? isRTL ? 'جاري...' : 'Loading...'
                : isRTL ? 'اقتراح AI' : 'AI Suggest'}
            </Button>
          </div>
          <Textarea
            value={data.whyScholarship.alignmentWithGoals}
            onChange={(e) => handleChange('alignmentWithGoals', e.target.value)}
            placeholder={
              isRTL
                ? 'مثال: يتوافق هذا البرنامج مع هدفي في أن أصبح باحثًا في الذكاء الاصطناعي لأن تركيا تستثمر بكثافة في التكنولوجيا، مع أكثر من 30 حاضنة تكنولوجية ومبادرة رؤية 2053...'
                : 'e.g., This program aligns with my goal to become an AI researcher because Turkey is heavily investing in technology, with over 30 technoparks and the Vision 2053 initiative...'
            }
            className="min-h-[100px]"
          />
          <QualityHint
            text={data.whyScholarship.alignmentWithGoals}
            fieldType="alignmentWithGoals"
            language={lang}
          />
          {aiSuggestion && activeField === 'alignmentWithGoals' && (
            <div className="mt-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-sm">
              <p className="text-primary-700 dark:text-primary-300">
                <strong>{isRTL ? 'اقتراح:' : 'Suggestion:'}</strong> {aiSuggestion}
              </p>
            </div>
          )}
        </div>

        {/* Unique Offering */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {isRTL ? 'ما الذي يميز هذه المنحة' : 'What Sets This Scholarship Apart'}
          </label>
          <Textarea
            value={data.whyScholarship.uniqueOffering}
            onChange={(e) => handleChange('uniqueOffering', e.target.value)}
            placeholder={
              isRTL
                ? 'مثال: على عكس المنح الأخرى، تقدم منح تركيا سنة تحضيرية للغة والثقافة، مما سيسمح لي بالاندماج بشكل أفضل في المجتمع الأكاديمي...'
                : 'e.g., Unlike other scholarships, Turkiye Scholarships offers a preparatory year for language and culture, which will allow me to better integrate into the academic community...'
            }
            className="min-h-[80px]"
          />
          <QualityHint
            text={data.whyScholarship.uniqueOffering}
            fieldType="uniqueOffering"
            language={lang}
          />
        </div>
      </div>

      {/* Section word count */}
      <WordCounter
        current={sectionWordCount}
        min={60}
        max={120}
        label={isRTL ? 'كلمات هذا القسم' : 'Section words'}
      />
    </div>
  );
}
