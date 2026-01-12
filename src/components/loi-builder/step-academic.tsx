'use client';

import { useState, useCallback } from 'react';
import { Sparkles, Lightbulb, GraduationCap } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { LOIWizardData } from '@/lib/loi-builder/types';
import { getWordCount } from '@/lib/loi-builder/quality-rules';
import { QualityHint } from './quality-hint';
import { WordCounter } from './word-counter';

interface StepAcademicProps {
  locale: string;
  data: LOIWizardData;
  onDataChange: (data: Partial<LOIWizardData>) => void;
}

export function StepAcademic({ locale, data, onDataChange }: StepAcademicProps) {
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<string | null>(null);

  const isRTL = locale === 'ar';
  const lang = data.settings.language;

  const handleChange = useCallback(
    (field: keyof typeof data.academic, value: string) => {
      onDataChange({
        academic: { ...data.academic, [field]: value },
      });
    },
    [data.academic, onDataChange]
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
          sectionName: 'academic',
          fieldName: field,
          currentText: data.academic[field as keyof typeof data.academic] || '',
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
    getWordCount(data.academic.currentEducation) +
    getWordCount(data.academic.relevantCourses) +
    getWordCount(data.academic.academicAchievements) +
    getWordCount(data.academic.skillsGained);

  return (
    <div className="space-y-6">
      {/* Section explanation */}
      <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border border-primary-100 dark:border-primary-800">
        <div className="flex items-start gap-3">
          <GraduationCap className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-primary-700 dark:text-primary-300">
              {isRTL ? 'الخلفية الأكاديمية' : 'Academic Preparation'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {isRTL
                ? 'أظهر استعدادك الأكاديمي من خلال الدورات والمشاريع والإنجازات المحددة. ركز على ما يجعلك مؤهلاً لبرنامجك المستهدف.'
                : 'Demonstrate your academic readiness through specific courses, projects, and achievements. Focus on what makes you qualified for your target program.'}
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
              ? 'ما الدورات أو المشاريع التي أعدتك مباشرة لبرنامجك المستهدف؟'
              : 'What courses or projects directly prepared you for your target program?'}
          </li>
          <li>
            {isRTL
              ? 'ما الإنجازات الأكاديمية القابلة للقياس التي تظهر قدرتك؟'
              : 'What measurable academic achievements show your capability?'}
          </li>
          <li>
            {isRTL
              ? 'ما المهارات التي طورتها وذات صلة بمجالك؟'
              : 'What skills have you developed that are relevant to your field?'}
          </li>
        </ul>
      </div>

      {/* Form fields */}
      <div className="space-y-5">
        {/* Current Education */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {isRTL ? 'التعليم الحالي' : 'Current Education'} *
          </label>
          <Textarea
            value={data.academic.currentEducation}
            onChange={(e) => handleChange('currentEducation', e.target.value)}
            placeholder={
              isRTL
                ? 'مثال: أنا حاليًا في السنة الرابعة من دراسة بكالوريوس علوم الحاسوب في جامعة XYZ، مع معدل تراكمي 3.8/4.0...'
                : 'e.g., I am currently in my fourth year of BSc Computer Science at XYZ University, maintaining a 3.8/4.0 GPA...'
            }
            className="min-h-[100px]"
          />
          <QualityHint
            text={data.academic.currentEducation}
            fieldType="currentEducation"
            language={lang}
          />
        </div>

        {/* Relevant Courses */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {isRTL ? 'الدورات ذات الصلة' : 'Relevant Courses'} *
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleGetAISuggestion('relevantCourses')}
              disabled={isLoadingAI}
              className="text-primary-600 hover:text-primary-700"
            >
              <Sparkles className="w-4 h-4 me-1" />
              {isLoadingAI && activeField === 'relevantCourses'
                ? isRTL ? 'جاري...' : 'Loading...'
                : isRTL ? 'اقتراح AI' : 'AI Suggest'}
            </Button>
          </div>
          <Textarea
            value={data.academic.relevantCourses}
            onChange={(e) => handleChange('relevantCourses', e.target.value)}
            placeholder={
              isRTL
                ? 'مثال: أكملت دورات متقدمة في التعلم الآلي، التعلم العميق، ورؤية الحاسوب، وحققت أعلى الدرجات في الفصل (95%) في مشروع التخرج...'
                : 'e.g., I have completed advanced courses in Machine Learning, Deep Learning, and Computer Vision, achieving the highest grade in my class (95%) for my capstone project...'
            }
            className="min-h-[100px]"
          />
          <QualityHint
            text={data.academic.relevantCourses}
            fieldType="relevantCourses"
            language={lang}
          />
          {aiSuggestion && activeField === 'relevantCourses' && (
            <div className="mt-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-sm">
              <p className="text-primary-700 dark:text-primary-300">
                <strong>{isRTL ? 'اقتراح:' : 'Suggestion:'}</strong> {aiSuggestion}
              </p>
            </div>
          )}
        </div>

        {/* Academic Achievements */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {isRTL ? 'الإنجازات الأكاديمية' : 'Academic Achievements'} *
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleGetAISuggestion('academicAchievements')}
              disabled={isLoadingAI}
              className="text-primary-600 hover:text-primary-700"
            >
              <Sparkles className="w-4 h-4 me-1" />
              {isLoadingAI && activeField === 'academicAchievements'
                ? isRTL ? 'جاري...' : 'Loading...'
                : isRTL ? 'اقتراح AI' : 'AI Suggest'}
            </Button>
          </div>
          <Textarea
            value={data.academic.academicAchievements}
            onChange={(e) => handleChange('academicAchievements', e.target.value)}
            placeholder={
              isRTL
                ? 'مثال: نشرت ورقة بحثية في مؤتمر IEEE 2024، فزت بالمركز الثاني في هاكاثون جامعي، حصلت على منحة التميز الأكاديمي لمدة 3 فصول متتالية...'
                : 'e.g., Published a research paper at IEEE Conference 2024, won 2nd place in university hackathon, received Dean\'s List recognition for 3 consecutive semesters...'
            }
            className="min-h-[100px]"
          />
          <QualityHint
            text={data.academic.academicAchievements}
            fieldType="academicAchievements"
            language={lang}
          />
          {aiSuggestion && activeField === 'academicAchievements' && (
            <div className="mt-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-sm">
              <p className="text-primary-700 dark:text-primary-300">
                <strong>{isRTL ? 'اقتراح:' : 'Suggestion:'}</strong> {aiSuggestion}
              </p>
            </div>
          )}
        </div>

        {/* Skills Gained */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {isRTL ? 'المهارات المكتسبة' : 'Skills Gained'}
          </label>
          <Textarea
            value={data.academic.skillsGained}
            onChange={(e) => handleChange('skillsGained', e.target.value)}
            placeholder={
              isRTL
                ? 'مثال: من خلال دراستي، طورت إتقانًا قويًا في Python وTensorFlow وتحليل البيانات، بالإضافة إلى مهارات البحث والتفكير النقدي...'
                : 'e.g., Through my studies, I have developed strong proficiency in Python, TensorFlow, and data analysis, alongside research skills and critical thinking...'
            }
            className="min-h-[80px]"
          />
          <QualityHint
            text={data.academic.skillsGained}
            fieldType="skillsGained"
            language={lang}
          />
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
