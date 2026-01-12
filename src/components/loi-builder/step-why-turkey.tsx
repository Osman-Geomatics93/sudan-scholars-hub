'use client';

import { useState, useCallback } from 'react';
import { Sparkles, MapPin, Building } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { LOIWizardData } from '@/lib/loi-builder/types';
import { getWordCount } from '@/lib/loi-builder/quality-rules';
import { QualityHint } from './quality-hint';
import { WordCounter } from './word-counter';

interface StepWhyTurkeyProps {
  locale: string;
  data: LOIWizardData;
  onDataChange: (data: Partial<LOIWizardData>) => void;
}

export function StepWhyTurkey({ locale, data, onDataChange }: StepWhyTurkeyProps) {
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<string | null>(null);

  const isRTL = locale === 'ar';
  const lang = data.settings.language;

  const handleChange = useCallback(
    (field: keyof typeof data.whyTurkey, value: string) => {
      onDataChange({
        whyTurkey: { ...data.whyTurkey, [field]: value },
      });
    },
    [data.whyTurkey, onDataChange]
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
          sectionName: 'whyTurkey',
          fieldName: field,
          currentText: data.whyTurkey[field as keyof typeof data.whyTurkey] || '',
          fieldOfStudy: data.hook.fieldOfInterest,
          universityName: data.whyTurkey.universityName,
          programName: data.whyTurkey.programName,
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
    getWordCount(data.whyTurkey.countryReasons) +
    getWordCount(data.whyTurkey.universityName) +
    getWordCount(data.whyTurkey.programName) +
    getWordCount(data.whyTurkey.whyThisProgram) +
    getWordCount(data.whyTurkey.specificDetails);

  return (
    <div className="space-y-6">
      {/* Section explanation */}
      <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border border-primary-100 dark:border-primary-800">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-primary-700 dark:text-primary-300">
              {isRTL ? 'لماذا تركيا والبرنامج' : 'Why Turkey & Program'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {isRTL
                ? 'اشرح لماذا اخترت تركيا كوجهة دراسية، ولماذا هذه الجامعة والبرنامج تحديدًا. كن محددًا - اذكر أساتذة، مختبرات، أو مناهج معينة.'
                : 'Explain why you chose Turkey as a study destination, and why this specific university and program. Be specific - mention particular professors, labs, or curricula.'}
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
              ? 'ما الذي يجعل تركيا مميزة لمجال دراستك مقارنة ببلدان أخرى؟'
              : 'What makes Turkey unique for your field of study compared to other countries?'}
          </li>
          <li>
            {isRTL
              ? 'هل بحثت عن أساتذة محددين، مجموعات بحثية، أو مرافق في جامعتك المستهدفة؟'
              : 'Have you researched specific professors, research groups, or facilities at your target university?'}
          </li>
          <li>
            {isRTL
              ? 'ما الدورات أو الفرص المحددة التي تثير اهتمامك في هذا البرنامج؟'
              : 'What specific courses or opportunities in this program interest you?'}
          </li>
        </ul>
      </div>

      {/* Form fields */}
      <div className="space-y-5">
        {/* University and Program Names */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Building className="w-4 h-4 inline me-1" />
              {isRTL ? 'اسم الجامعة' : 'University Name'} *
            </label>
            <Input
              value={data.whyTurkey.universityName}
              onChange={(e) => handleChange('universityName', e.target.value)}
              placeholder={
                isRTL
                  ? 'مثال: جامعة الشرق الأوسط التقنية'
                  : 'e.g., Middle East Technical University'
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {isRTL ? 'اسم البرنامج' : 'Program Name'} *
            </label>
            <Input
              value={data.whyTurkey.programName}
              onChange={(e) => handleChange('programName', e.target.value)}
              placeholder={
                isRTL
                  ? 'مثال: ماجستير هندسة الحاسوب'
                  : 'e.g., MSc Computer Engineering'
              }
            />
          </div>
        </div>

        {/* Country Reasons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {isRTL ? 'لماذا تركيا' : 'Why Turkey'} *
          </label>
          <Textarea
            value={data.whyTurkey.countryReasons}
            onChange={(e) => handleChange('countryReasons', e.target.value)}
            placeholder={
              isRTL
                ? 'مثال: تقع تركيا في موقع استراتيجي كجسر بين أوروبا وآسيا، مما يوفر منظورًا فريدًا للتكنولوجيا العالمية. كما أن النمو السريع في قطاع التكنولوجيا (نمو 25% في 2023)...'
                : 'e.g., Turkey\'s strategic location as a bridge between Europe and Asia offers a unique perspective on global technology. The rapidly growing tech sector (25% growth in 2023)...'
            }
            className="min-h-[100px]"
          />
          <QualityHint
            text={data.whyTurkey.countryReasons}
            fieldType="countryReasons"
            language={lang}
          />
        </div>

        {/* Why This Program */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {isRTL ? 'لماذا هذا البرنامج' : 'Why This Program'} *
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleGetAISuggestion('whyThisProgram')}
              disabled={isLoadingAI}
              className="text-primary-600 hover:text-primary-700"
            >
              <Sparkles className="w-4 h-4 me-1" />
              {isLoadingAI && activeField === 'whyThisProgram'
                ? isRTL ? 'جاري...' : 'Loading...'
                : isRTL ? 'اقتراح AI' : 'AI Suggest'}
            </Button>
          </div>
          <Textarea
            value={data.whyTurkey.whyThisProgram}
            onChange={(e) => handleChange('whyThisProgram', e.target.value)}
            placeholder={
              isRTL
                ? 'مثال: أنا متحمس بشكل خاص للعمل مع البروفيسور أحمد يلماز، الذي قاد أبحاثًا رائدة في معالجة اللغة الطبيعية للغات منخفضة الموارد...'
                : 'e.g., I am particularly excited to work with Professor Ahmet Yilmaz, who has led groundbreaking research in NLP for low-resource languages...'
            }
            className="min-h-[100px]"
          />
          <QualityHint
            text={data.whyTurkey.whyThisProgram}
            fieldType="whyThisProgram"
            language={lang}
          />
          {aiSuggestion && activeField === 'whyThisProgram' && (
            <div className="mt-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-sm">
              <p className="text-primary-700 dark:text-primary-300">
                <strong>{isRTL ? 'اقتراح:' : 'Suggestion:'}</strong> {aiSuggestion}
              </p>
            </div>
          )}
        </div>

        {/* Specific Details */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {isRTL ? 'تفاصيل محددة' : 'Specific Details'}
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleGetAISuggestion('specificDetails')}
              disabled={isLoadingAI}
              className="text-primary-600 hover:text-primary-700"
            >
              <Sparkles className="w-4 h-4 me-1" />
              {isLoadingAI && activeField === 'specificDetails'
                ? isRTL ? 'جاري...' : 'Loading...'
                : isRTL ? 'اقتراح AI' : 'AI Suggest'}
            </Button>
          </div>
          <Textarea
            value={data.whyTurkey.specificDetails}
            onChange={(e) => handleChange('specificDetails', e.target.value)}
            placeholder={
              isRTL
                ? 'مثال: يوفر مختبر AI-Lab في METU إمكانية الوصول إلى مجموعة حوسبة GPU، وتتضمن المناهج دورات متقدمة في التعلم العميق والرؤية الحاسوبية التي تتوافق تمامًا مع أبحاثي...'
                : 'e.g., The AI-Lab at METU provides access to a GPU computing cluster, and the curriculum includes advanced courses in deep learning and computer vision that perfectly align with my research interests...'
            }
            className="min-h-[80px]"
          />
          <QualityHint
            text={data.whyTurkey.specificDetails}
            fieldType="specificDetails"
            language={lang}
          />
          {aiSuggestion && activeField === 'specificDetails' && (
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
