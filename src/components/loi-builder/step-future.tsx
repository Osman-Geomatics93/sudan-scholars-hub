'use client';

import { useState, useCallback } from 'react';
import { Sparkles, Rocket, Target, Globe, BarChart } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { LOIWizardData } from '@/lib/loi-builder/types';
import { getWordCount } from '@/lib/loi-builder/quality-rules';
import { QualityHint } from './quality-hint';
import { WordCounter } from './word-counter';

interface StepFutureProps {
  locale: string;
  data: LOIWizardData;
  onDataChange: (data: Partial<LOIWizardData>) => void;
}

export function StepFuture({ locale, data, onDataChange }: StepFutureProps) {
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<string | null>(null);

  const isRTL = locale === 'ar';
  const lang = data.settings.language;

  const handleChange = useCallback(
    (field: keyof typeof data.future, value: string) => {
      onDataChange({
        future: { ...data.future, [field]: value },
      });
    },
    [data.future, onDataChange]
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
          sectionName: 'future',
          fieldName: field,
          currentText: data.future[field as keyof typeof data.future] || '',
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
    getWordCount(data.future.shortTermGoals) +
    getWordCount(data.future.longTermGoals) +
    getWordCount(data.future.impactOnCommunity) +
    getWordCount(data.future.measurableOutcomes);

  return (
    <div className="space-y-6">
      {/* Section explanation */}
      <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border border-primary-100 dark:border-primary-800">
        <div className="flex items-start gap-3">
          <Rocket className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-primary-700 dark:text-primary-300">
              {isRTL ? 'الخطة المستقبلية والتأثير' : 'Future Plan & Impact'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {isRTL
                ? 'قدم أهدافًا واضحة وقابلة للقياس تظهر أنك فكرت بعمق في مستقبلك. تجنب الأهداف الغامضة - كن محددًا بشأن الجداول الزمنية والأرقام.'
                : 'Present clear, measurable goals that show you\'ve thought deeply about your future. Avoid vague goals - be specific about timelines and numbers.'}
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
              ? 'ما المنصب أو الدور المحدد الذي تريده خلال 3 سنوات؟'
              : 'What specific position or role do you want in 3 years?'}
          </li>
          <li>
            {isRTL
              ? 'كيف ستستخدم تعليمك لفائدة مجتمعك؟'
              : 'How will you use your education to benefit your community?'}
          </li>
          <li>
            {isRTL
              ? 'ما التأثير القابل للقياس الذي تهدف لتحقيقه في 10 سنوات؟'
              : 'What measurable impact do you aim to achieve in 10 years?'}
          </li>
        </ul>
      </div>

      {/* Form fields */}
      <div className="space-y-5">
        {/* Short-term Goals */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Target className="w-4 h-4 text-primary-600" />
            {isRTL ? 'الأهداف قصيرة المدى (1-3 سنوات)' : 'Short-term Goals (1-3 years)'} *
          </label>
          <Textarea
            value={data.future.shortTermGoals}
            onChange={(e) => handleChange('shortTermGoals', e.target.value)}
            placeholder={
              isRTL
                ? 'مثال: بعد التخرج، أخطط للانضمام إلى مختبر أبحاث الذكاء الاصطناعي كباحث مبتدئ، مع التركيز على تطبيقات الرعاية الصحية. خلال عامين، أهدف لنشر 2-3 أوراق بحثية في مؤتمرات رائدة...'
                : 'e.g., Upon graduation, I plan to join an AI research lab as a junior researcher, focusing on healthcare applications. Within 2 years, I aim to publish 2-3 papers at top conferences...'
            }
            className="min-h-[100px]"
          />
          <QualityHint
            text={data.future.shortTermGoals}
            fieldType="shortTermGoals"
            language={lang}
          />
        </div>

        {/* Long-term Goals */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Rocket className="w-4 h-4 text-primary-600" />
              {isRTL ? 'الأهداف طويلة المدى (5-10 سنوات)' : 'Long-term Goals (5-10 years)'} *
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleGetAISuggestion('longTermGoals')}
              disabled={isLoadingAI}
              className="text-primary-600 hover:text-primary-700"
            >
              <Sparkles className="w-4 h-4 me-1" />
              {isLoadingAI && activeField === 'longTermGoals'
                ? isRTL ? 'جاري...' : 'Loading...'
                : isRTL ? 'اقتراح AI' : 'AI Suggest'}
            </Button>
          </div>
          <Textarea
            value={data.future.longTermGoals}
            onChange={(e) => handleChange('longTermGoals', e.target.value)}
            placeholder={
              isRTL
                ? 'مثال: رؤيتي طويلة المدى هي تأسيس مركز أبحاث للذكاء الاصطناعي في السودان خلال 10 سنوات، مع التركيز على حلول الرعاية الصحية للمناطق الريفية...'
                : 'e.g., My long-term vision is to establish an AI research center in Sudan within 10 years, focusing on healthcare solutions for rural areas...'
            }
            className="min-h-[100px]"
          />
          <QualityHint
            text={data.future.longTermGoals}
            fieldType="longTermGoals"
            language={lang}
          />
          {aiSuggestion && activeField === 'longTermGoals' && (
            <div className="mt-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-sm">
              <p className="text-primary-700 dark:text-primary-300">
                <strong>{isRTL ? 'اقتراح:' : 'Suggestion:'}</strong> {aiSuggestion}
              </p>
            </div>
          )}
        </div>

        {/* Impact on Community */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Globe className="w-4 h-4 text-primary-600" />
              {isRTL ? 'التأثير على المجتمع' : 'Impact on Community'} *
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleGetAISuggestion('impactOnCommunity')}
              disabled={isLoadingAI}
              className="text-primary-600 hover:text-primary-700"
            >
              <Sparkles className="w-4 h-4 me-1" />
              {isLoadingAI && activeField === 'impactOnCommunity'
                ? isRTL ? 'جاري...' : 'Loading...'
                : isRTL ? 'اقتراح AI' : 'AI Suggest'}
            </Button>
          </div>
          <Textarea
            value={data.future.impactOnCommunity}
            onChange={(e) => handleChange('impactOnCommunity', e.target.value)}
            placeholder={
              isRTL
                ? 'مثال: سأستخدم تعليمي لمعالجة فجوة الرعاية الصحية في المناطق الريفية في السودان، حيث يعاني أكثر من 60% من السكان من نقص في الوصول للتشخيص الطبي...'
                : 'e.g., I will use my education to address the healthcare gap in rural Sudan, where over 60% of the population lacks access to medical diagnostics...'
            }
            className="min-h-[100px]"
          />
          <QualityHint
            text={data.future.impactOnCommunity}
            fieldType="impactOnCommunity"
            language={lang}
          />
          {aiSuggestion && activeField === 'impactOnCommunity' && (
            <div className="mt-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-sm">
              <p className="text-primary-700 dark:text-primary-300">
                <strong>{isRTL ? 'اقتراح:' : 'Suggestion:'}</strong> {aiSuggestion}
              </p>
            </div>
          )}
        </div>

        {/* Measurable Outcomes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <BarChart className="w-4 h-4 text-primary-600" />
              {isRTL ? 'النتائج القابلة للقياس' : 'Measurable Outcomes'}
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleGetAISuggestion('measurableOutcomes')}
              disabled={isLoadingAI}
              className="text-primary-600 hover:text-primary-700"
            >
              <Sparkles className="w-4 h-4 me-1" />
              {isLoadingAI && activeField === 'measurableOutcomes'
                ? isRTL ? 'جاري...' : 'Loading...'
                : isRTL ? 'اقتراح AI' : 'AI Suggest'}
            </Button>
          </div>
          <Textarea
            value={data.future.measurableOutcomes}
            onChange={(e) => handleChange('measurableOutcomes', e.target.value)}
            placeholder={
              isRTL
                ? 'مثال: أهدف لتدريب 500 من العاملين في الرعاية الصحية على أدوات تشخيص الذكاء الاصطناعي، وإنشاء 3 عيادات متنقلة تخدم 10,000 مريض سنويًا، ونشر 5 أوراق بحثية حول تطبيقات الذكاء الاصطناعي في البيئات منخفضة الموارد...'
                : 'e.g., I aim to train 500 healthcare workers on AI diagnostic tools, establish 3 mobile clinics serving 10,000 patients annually, and publish 5 research papers on AI applications in low-resource settings...'
            }
            className="min-h-[80px]"
          />
          <QualityHint
            text={data.future.measurableOutcomes}
            fieldType="measurableOutcomes"
            language={lang}
          />
          {aiSuggestion && activeField === 'measurableOutcomes' && (
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
        min={80}
        max={150}
        label={isRTL ? 'كلمات هذا القسم' : 'Section words'}
      />
    </div>
  );
}
