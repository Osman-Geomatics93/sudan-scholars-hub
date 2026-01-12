'use client';

import { useState, useCallback } from 'react';
import { Sparkles, Users, Target, Zap, Trophy, Lightbulb } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { LOIWizardData } from '@/lib/loi-builder/types';
import { getWordCount } from '@/lib/loi-builder/quality-rules';
import { QualityHint } from './quality-hint';
import { WordCounter } from './word-counter';

interface StepLeadershipProps {
  locale: string;
  data: LOIWizardData;
  onDataChange: (data: Partial<LOIWizardData>) => void;
}

export function StepLeadership({ locale, data, onDataChange }: StepLeadershipProps) {
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<string | null>(null);

  const isRTL = locale === 'ar';
  const lang = data.settings.language;

  const handleChange = useCallback(
    (field: keyof typeof data.leadership, value: string) => {
      onDataChange({
        leadership: { ...data.leadership, [field]: value },
      });
    },
    [data.leadership, onDataChange]
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
          sectionName: 'leadership',
          fieldName: field,
          currentText: data.leadership[field as keyof typeof data.leadership] || '',
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
    getWordCount(data.leadership.situation) +
    getWordCount(data.leadership.task) +
    getWordCount(data.leadership.action) +
    getWordCount(data.leadership.result) +
    getWordCount(data.leadership.lessonsLearned);

  return (
    <div className="space-y-6">
      {/* Section explanation */}
      <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border border-primary-100 dark:border-primary-800">
        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-primary-700 dark:text-primary-300">
              {isRTL ? 'قصة القيادة (تنسيق STAR)' : 'Leadership Story (STAR Format)'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {isRTL
                ? 'شارك قصة واحدة ذات معنى باستخدام تنسيق STAR لإظهار شخصيتك. اختر تجربة محددة أظهرت فيها القيادة أو حل المشكلات أو المرونة.'
                : 'Share ONE meaningful story using the STAR format to show your character. Choose a specific experience where you demonstrated leadership, problem-solving, or resilience.'}
            </p>
          </div>
        </div>
      </div>

      {/* STAR Format explanation */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
          {isRTL ? 'تنسيق STAR' : 'STAR Format'}
        </h4>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="bg-primary-600 text-white px-2 py-0.5 rounded font-bold text-xs">S</span>
            <span className="text-gray-600 dark:text-gray-400">
              {isRTL ? 'الموقف - السياق والإطار' : 'Situation - Context and setting'}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-primary-600 text-white px-2 py-0.5 rounded font-bold text-xs">T</span>
            <span className="text-gray-600 dark:text-gray-400">
              {isRTL ? 'المهمة - مسؤوليتك' : 'Task - Your responsibility'}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-primary-600 text-white px-2 py-0.5 rounded font-bold text-xs">A</span>
            <span className="text-gray-600 dark:text-gray-400">
              {isRTL ? 'الإجراء - ما فعلته أنت' : 'Action - What YOU did'}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-primary-600 text-white px-2 py-0.5 rounded font-bold text-xs">R</span>
            <span className="text-gray-600 dark:text-gray-400">
              {isRTL ? 'النتيجة - النتيجة القابلة للقياس' : 'Result - Measurable outcome'}
            </span>
          </div>
        </div>
      </div>

      {/* Guiding questions */}
      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800">
        <h4 className="font-medium text-amber-700 dark:text-amber-300 mb-2">
          {isRTL ? 'أسئلة إرشادية' : 'Guiding Questions'}
        </h4>
        <ul className="list-disc list-inside text-sm text-amber-600 dark:text-amber-400 space-y-1">
          <li>
            {isRTL
              ? 'ما التحدي الذي واجهته وأختبر شخصيتك؟'
              : 'What challenge did you face that tested your character?'}
          </li>
          <li>
            {isRTL
              ? 'ما الإجراءات المحددة التي اتخذتها أنت (وليس فريقك)؟'
              : 'What specific actions did YOU take (not your team)?'}
          </li>
          <li>
            {isRTL
              ? 'ما النتيجة القابلة للقياس أو ما الذي تعلمته؟'
              : 'What was the measurable outcome or what did you learn?'}
          </li>
        </ul>
      </div>

      {/* Form fields */}
      <div className="space-y-5">
        {/* Situation */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Target className="w-4 h-4 text-primary-600" />
            {isRTL ? 'الموقف (السياق)' : 'Situation (Context)'} *
          </label>
          <Textarea
            value={data.leadership.situation}
            onChange={(e) => handleChange('situation', e.target.value)}
            placeholder={
              isRTL
                ? 'مثال: خلال دوري كرئيس لجمعية طلاب الهندسة (أكثر من 200 عضو) في عام 2023، واجه النادي أزمة تمويل بسبب انخفاض رعاية الشركات بنسبة 60%...'
                : 'e.g., During my role as president of the Engineering Students Association (200+ members) in 2023, the club faced a funding crisis due to a 60% drop in corporate sponsorship...'
            }
            className="min-h-[100px]"
          />
          <QualityHint
            text={data.leadership.situation}
            fieldType="situation"
            language={lang}
          />
        </div>

        {/* Task */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Zap className="w-4 h-4 text-primary-600" />
            {isRTL ? 'المهمة (مسؤوليتك)' : 'Task (Your Responsibility)'} *
          </label>
          <Textarea
            value={data.leadership.task}
            onChange={(e) => handleChange('task', e.target.value)}
            placeholder={
              isRTL
                ? 'مثال: كنت مسؤولاً عن تنظيم أول هاكاثون بين الجامعات بميزانية 5,000 دولار فقط، مع توقع 100 مشارك على الأقل...'
                : 'e.g., I was responsible for organizing the first inter-university hackathon with only a $5,000 budget, while expecting at least 100 participants...'
            }
            className="min-h-[80px]"
          />
          <QualityHint
            text={data.leadership.task}
            fieldType="task"
            language={lang}
          />
        </div>

        {/* Action */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Zap className="w-4 h-4 text-primary-600" />
              {isRTL ? 'الإجراء (ما فعلته)' : 'Action (What You Did)'} *
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleGetAISuggestion('action')}
              disabled={isLoadingAI}
              className="text-primary-600 hover:text-primary-700"
            >
              <Sparkles className="w-4 h-4 me-1" />
              {isLoadingAI && activeField === 'action'
                ? isRTL ? 'جاري...' : 'Loading...'
                : isRTL ? 'اقتراح AI' : 'AI Suggest'}
            </Button>
          </div>
          <Textarea
            value={data.leadership.action}
            onChange={(e) => handleChange('action', e.target.value)}
            placeholder={
              isRTL
                ? 'مثال: حصلت شخصيًا على 3 رعاة من الشركات من خلال عروض تقديمية مخصصة، وجندت 15 متطوعًا، وأنشأت البنية التحتية التقنية، وتفاوضت على خصومات مع المكان...'
                : 'e.g., I personally secured 3 corporate sponsors through tailored presentations, recruited 15 volunteers, created the technical infrastructure, and negotiated venue discounts...'
            }
            className="min-h-[100px]"
          />
          <QualityHint
            text={data.leadership.action}
            fieldType="action"
            language={lang}
          />
          {aiSuggestion && activeField === 'action' && (
            <div className="mt-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-sm">
              <p className="text-primary-700 dark:text-primary-300">
                <strong>{isRTL ? 'اقتراح:' : 'Suggestion:'}</strong> {aiSuggestion}
              </p>
            </div>
          )}
        </div>

        {/* Result */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Trophy className="w-4 h-4 text-primary-600" />
              {isRTL ? 'النتيجة (النتيجة القابلة للقياس)' : 'Result (Measurable Outcome)'} *
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleGetAISuggestion('result')}
              disabled={isLoadingAI}
              className="text-primary-600 hover:text-primary-700"
            >
              <Sparkles className="w-4 h-4 me-1" />
              {isLoadingAI && activeField === 'result'
                ? isRTL ? 'جاري...' : 'Loading...'
                : isRTL ? 'اقتراح AI' : 'AI Suggest'}
            </Button>
          </div>
          <Textarea
            value={data.leadership.result}
            onChange={(e) => handleChange('result', e.target.value)}
            placeholder={
              isRTL
                ? 'مثال: جذب الحدث 150 مشاركًا من 8 جامعات، وحقق 12,000 دولار من الرعايات (زيادة 140%)، وأدى إلى 3 مشاريع ناشئة لا تزال نشطة...'
                : 'e.g., The event attracted 150 participants from 8 universities, generated $12,000 in sponsorships (140% increase), and led to 3 startup projects that are still active...'
            }
            className="min-h-[100px]"
          />
          <QualityHint
            text={data.leadership.result}
            fieldType="result"
            language={lang}
          />
          {aiSuggestion && activeField === 'result' && (
            <div className="mt-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-sm">
              <p className="text-primary-700 dark:text-primary-300">
                <strong>{isRTL ? 'اقتراح:' : 'Suggestion:'}</strong> {aiSuggestion}
              </p>
            </div>
          )}
        </div>

        {/* Lessons Learned */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Lightbulb className="w-4 h-4 text-primary-600" />
            {isRTL ? 'الدروس المستفادة' : 'Lessons Learned'}
          </label>
          <Textarea
            value={data.leadership.lessonsLearned}
            onChange={(e) => handleChange('lessonsLearned', e.target.value)}
            placeholder={
              isRTL
                ? 'مثال: علمتني هذه التجربة أهمية التواصل الاستباقي وبناء العلاقات. تعلمت أن القيادة لا تتعلق بالسيطرة بل بتمكين الآخرين...'
                : 'e.g., This experience taught me the importance of proactive communication and relationship building. I learned that leadership is not about control but about empowering others...'
            }
            className="min-h-[80px]"
          />
          <QualityHint
            text={data.leadership.lessonsLearned}
            fieldType="lessonsLearned"
            language={lang}
          />
        </div>
      </div>

      {/* Section word count */}
      <WordCounter
        current={sectionWordCount}
        min={100}
        max={180}
        label={isRTL ? 'كلمات هذا القسم' : 'Section words'}
      />
    </div>
  );
}
