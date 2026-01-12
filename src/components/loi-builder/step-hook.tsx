'use client';

import { useState, useEffect, useCallback } from 'react';
import { Sparkles, Lightbulb, AlertCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { LOIWizardData } from '@/lib/loi-builder/types';
import { detectCliches, detectGenericPhrases, getWordCount, getImprovementSuggestion } from '@/lib/loi-builder/quality-rules';
import { QualityHint } from './quality-hint';
import { WordCounter } from './word-counter';

interface StepHookProps {
  locale: string;
  data: LOIWizardData;
  onDataChange: (data: Partial<LOIWizardData>) => void;
}

export function StepHook({ locale, data, onDataChange }: StepHookProps) {
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<string | null>(null);

  const isRTL = locale === 'ar';
  const lang = data.settings.language;

  const handleChange = useCallback(
    (field: keyof typeof data.hook, value: string) => {
      onDataChange({
        hook: { ...data.hook, [field]: value },
      });
    },
    [data.hook, onDataChange]
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
          sectionName: 'hook',
          fieldName: field,
          currentText: data.hook[field as keyof typeof data.hook] || '',
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
    getWordCount(data.hook.openingStatement) +
    getWordCount(data.hook.fieldOfInterest) +
    getWordCount(data.hook.careerGoal);

  return (
    <div className="space-y-6">
      {/* Section explanation */}
      <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border border-primary-100 dark:border-primary-800">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-primary-700 dark:text-primary-300">
              {isRTL ? 'المقدمة والاتجاه' : 'Hook & Direction'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {isRTL
                ? 'في 3-5 جمل، قدم نفسك ومجال اهتمامك وما تهدف إلى تحقيقه. كن محددًا وتجنب العبارات العامة.'
                : 'In 3-5 sentences, introduce yourself, your field of interest, and what you aim to achieve. Be specific and avoid generic statements.'}
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
              ? 'ما الذي أثار اهتمامك في مجالك المختار؟'
              : 'What sparked your interest in your chosen field?'}
          </li>
          <li>
            {isRTL
              ? 'ما الشيء الوحيد الذي تريد أن تتذكره اللجنة عنك؟'
              : 'What is the ONE thing you want the committee to remember about you?'}
          </li>
          <li>
            {isRTL
              ? 'أين ترى نفسك تساهم بعد 10 سنوات؟'
              : 'Where do you see yourself contributing in 10 years?'}
          </li>
        </ul>
      </div>

      {/* Form fields */}
      <div className="space-y-5">
        {/* Opening Statement */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {isRTL ? 'البيان الافتتاحي' : 'Opening Statement'} *
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleGetAISuggestion('openingStatement')}
              disabled={isLoadingAI}
              className="text-primary-600 hover:text-primary-700"
            >
              <Sparkles className="w-4 h-4 me-1" />
              {isLoadingAI && activeField === 'openingStatement'
                ? isRTL ? 'جاري...' : 'Loading...'
                : isRTL ? 'اقتراح AI' : 'AI Suggest'}
            </Button>
          </div>
          <Textarea
            value={data.hook.openingStatement}
            onChange={(e) => handleChange('openingStatement', e.target.value)}
            placeholder={
              isRTL
                ? 'كطالب هندسة حاسوب في السنة الأخيرة في جامعة ABC مع التركيز على تطبيقات الذكاء الاصطناعي في الرعاية الصحية، أتقدم لمتابعة درجة الماجستير...'
                : 'As a final-year Computer Engineering student at ABC University with a focus on AI applications in healthcare, I am applying to pursue my Master\'s degree...'
            }
            className="min-h-[120px]"
          />
          <QualityHint
            text={data.hook.openingStatement}
            fieldType="openingStatement"
            language={lang}
          />
          {aiSuggestion && activeField === 'openingStatement' && (
            <div className="mt-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-sm">
              <p className="text-primary-700 dark:text-primary-300">
                <strong>{isRTL ? 'اقتراح:' : 'Suggestion:'}</strong> {aiSuggestion}
              </p>
            </div>
          )}
        </div>

        {/* Field of Interest */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {isRTL ? 'مجال الاهتمام' : 'Field of Interest'} *
          </label>
          <Input
            value={data.hook.fieldOfInterest}
            onChange={(e) => handleChange('fieldOfInterest', e.target.value)}
            placeholder={
              isRTL
                ? 'مثال: هندسة الحاسوب مع التركيز على التعلم الآلي'
                : 'e.g., Computer Engineering with focus on Machine Learning'
            }
          />
        </div>

        {/* Career Goal */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {isRTL ? 'الهدف المهني (جملة واحدة)' : 'Career Goal (1 sentence)'} *
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleGetAISuggestion('careerGoal')}
              disabled={isLoadingAI}
              className="text-primary-600 hover:text-primary-700"
            >
              <Sparkles className="w-4 h-4 me-1" />
              {isLoadingAI && activeField === 'careerGoal'
                ? isRTL ? 'جاري...' : 'Loading...'
                : isRTL ? 'اقتراح AI' : 'AI Suggest'}
            </Button>
          </div>
          <Textarea
            value={data.hook.careerGoal}
            onChange={(e) => handleChange('careerGoal', e.target.value)}
            placeholder={
              isRTL
                ? 'مثال: تطوير أدوات تشخيص بالذكاء الاصطناعي تحسن الوصول إلى الرعاية الصحية في المناطق المحرومة'
                : 'e.g., To develop AI diagnostic tools that improve healthcare access in underserved regions'
            }
            className="min-h-[80px]"
          />
          <QualityHint
            text={data.hook.careerGoal}
            fieldType="careerGoal"
            language={lang}
          />
          {aiSuggestion && activeField === 'careerGoal' && (
            <div className="mt-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-sm">
              <p className="text-primary-700 dark:text-primary-300">
                <strong>{isRTL ? 'اقتراح:' : 'Suggestion:'}</strong> {aiSuggestion}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Section word count */}
      <WordCounter
        current={sectionWordCount}
        min={50}
        max={100}
        label={isRTL ? 'كلمات هذا القسم' : 'Section words'}
      />
    </div>
  );
}
