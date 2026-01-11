'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { WizardStepTabs } from './wizard-step-tabs';
import { useStepCompletion } from './use-step-completion';
import { StepPersonal } from './step-personal';
import { StepEducation } from './step-education';
import { StepExperience } from './step-experience';
import { StepSkills } from './step-skills';
import { StepProjects } from './step-projects';
import { StepAwards } from './step-awards';
import { StepExtras } from './step-extras';
import { StepTemplate } from './step-template';
import type { CVWizardData } from '@/lib/cv-builder/types';

interface CVWizardProps {
  locale: string;
  existingData?: Partial<CVWizardData> | null;
  resumeId?: string;
}

const STEPS = [
  { id: 'personal', component: StepPersonal, label: { en: 'Personal', ar: 'الشخصية' } },
  { id: 'education', component: StepEducation, label: { en: 'Education', ar: 'التعليم' } },
  { id: 'experience', component: StepExperience, label: { en: 'Experience', ar: 'الخبرة' } },
  { id: 'skills', component: StepSkills, label: { en: 'Skills', ar: 'المهارات' } },
  { id: 'projects', component: StepProjects, label: { en: 'Projects', ar: 'المشاريع' } },
  { id: 'awards', component: StepAwards, label: { en: 'Awards', ar: 'الجوائز' } },
  { id: 'extras', component: StepExtras, label: { en: 'Extras', ar: 'إضافات' } },
  { id: 'template', component: StepTemplate, label: { en: 'Template', ar: 'القالب' } },
];

const defaultData: CVWizardData = {
  personal: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    website: '',
  },
  education: [],
  experience: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
  awards: [],
  summary: '',
  summaryAr: '',
  template: 'modern',
  primaryColor: '#2563eb',
};

export function CVWizard({ locale, existingData, resumeId }: CVWizardProps) {
  const router = useRouter();
  const isRTL = locale === 'ar';

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CVWizardData>({
    ...defaultData,
    ...existingData,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Track step completion status
  const { stepStatuses } = useStepCompletion(formData, currentStep);

  // Handle step data updates
  const handleStepData = useCallback((stepData: Partial<CVWizardData>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    setError(null);
  }, []);

  // Navigate to any step (clickable tabs)
  const handleStepClick = useCallback(
    (stepIndex: number) => {
      if (stepIndex !== currentStep && !isSubmitting) {
        setIsTransitioning(true);
        // Small delay for animation
        setTimeout(() => {
          setCurrentStep(stepIndex);
          setIsTransitioning(false);
        }, 150);
      }
    },
    [currentStep, isSubmitting]
  );

  // Navigate to next step
  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      handleStepClick(currentStep + 1);
    }
  }, [currentStep, handleStepClick]);

  // Navigate to previous step
  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      handleStepClick(currentStep - 1);
    }
  }, [currentStep, handleStepClick]);

  // Submit/Save resume
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        resumeId ? `/api/cv-builder/${resumeId}` : '/api/cv-builder',
        {
          method: resumeId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save resume');
      }

      const data = await response.json();
      const savedResumeId = data.resume?.id;

      if (savedResumeId) {
        router.push(`/${locale}/cv-builder/${savedResumeId}`);
      } else {
        router.push(`/${locale}/cv-builder`);
      }
    } catch (err) {
      console.error('Save error:', err);
      setError(
        err instanceof Error
          ? err.message
          : isRTL
          ? 'حدث خطأ أثناء حفظ السيرة الذاتية'
          : 'An error occurred while saving the resume'
      );
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = STEPS[currentStep].component;
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Clickable Step Tabs */}
      <WizardStepTabs
        steps={STEPS}
        currentStep={currentStep}
        stepStatuses={stepStatuses}
        onStepClick={handleStepClick}
        locale={locale}
        disabled={isSubmitting}
      />

      {/* Step Content with transition */}
      <Card
        className={cn(
          'transition-opacity duration-150',
          isTransitioning ? 'opacity-50' : 'opacity-100'
        )}
      >
        <CardContent className="p-6">
          <CurrentStepComponent
            locale={locale}
            data={formData}
            onDataChange={handleStepData}
          />
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Navigation Buttons (Secondary) */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0 || isSubmitting}
          className="gap-2"
        >
          {isRTL ? (
            <>
              <ArrowRight className="w-4 h-4" />
              السابق
            </>
          ) : (
            <>
              <ArrowLeft className="w-4 h-4" />
              Back
            </>
          )}
        </Button>

        {isLastStep ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isRTL ? 'جاري الحفظ...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isRTL ? 'حفظ السيرة الذاتية' : 'Save Resume'}
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={isSubmitting}
            className="gap-2"
          >
            {isRTL ? (
              <>
                التالي
                <ArrowLeft className="w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
