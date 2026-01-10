'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StepGPA } from './step-gpa';
import { StepEducation } from './step-education';
import { StepPersonal } from './step-personal';
import { StepPreferences } from './step-preferences';
import { StepReview } from './step-review';
import type { MatcherProfileInput } from '@/lib/validations/matcher';

interface MatcherWizardProps {
  locale: string;
  existingProfile?: MatcherProfileInput | null;
}

const STEPS = [
  { id: 'gpa', component: StepGPA, label: { en: 'GPA', ar: 'المعدل' } },
  { id: 'education', component: StepEducation, label: { en: 'Education', ar: 'التعليم' } },
  { id: 'personal', component: StepPersonal, label: { en: 'Personal', ar: 'الشخصية' } },
  { id: 'preferences', component: StepPreferences, label: { en: 'Preferences', ar: 'التفضيلات' } },
  { id: 'review', component: StepReview, label: { en: 'Review', ar: 'المراجعة' } },
];

export function MatcherWizard({ locale, existingProfile }: MatcherWizardProps) {
  const router = useRouter();
  const isRTL = locale === 'ar';

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<MatcherProfileInput>>(
    existingProfile || {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle step data updates
  const handleStepData = useCallback((stepData: Partial<MatcherProfileInput>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    setError(null);
  }, []);

  // Navigate to next step
  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep]);

  // Navigate to previous step
  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // Submit profile and run matching
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Save/update profile
      const profileResponse = await fetch('/api/matcher/profile', {
        method: existingProfile ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!profileResponse.ok) {
        const data = await profileResponse.json();
        throw new Error(data.error || 'Failed to save profile');
      }

      // Run matching
      const matchResponse = await fetch('/api/matcher/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': locale,
        },
      });

      if (!matchResponse.ok) {
        const data = await matchResponse.json();
        throw new Error(data.error || 'Failed to run matching');
      }

      const matchData = await matchResponse.json();

      // Check if we have results
      if (!matchData.resultId) {
        // No matches found - show message
        setError(
          matchData.message ||
            (isRTL
              ? 'لم يتم العثور على منح تتطابق مع ملفك الشخصي. جرب تعديل تفضيلاتك.'
              : 'No scholarships match your profile. Try adjusting your preferences.')
        );
        setIsSubmitting(false);
        return;
      }

      // Redirect to results page
      router.push(`/${locale}/matcher/results?id=${matchData.resultId}`);
    } catch (err) {
      console.error('Matching error:', err);
      setError(
        err instanceof Error
          ? err.message
          : isRTL
          ? 'حدث خطأ أثناء المطابقة'
          : 'An error occurred during matching'
      );
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = STEPS[currentStep].component;
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {STEPS.map((step, idx) => (
            <div
              key={step.id}
              className="flex flex-col items-center flex-1"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  idx < currentStep
                    ? 'bg-primary text-white'
                    : idx === currentStep
                    ? 'bg-primary text-white ring-4 ring-primary/20'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}
              >
                {idx + 1}
              </div>
              <span className="text-xs mt-1 text-gray-600 dark:text-gray-400 hidden sm:block">
                {isRTL ? step.label.ar : step.label.en}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`flex-1 h-1 rounded ${
                idx <= currentStep ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
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

      {/* Navigation Buttons */}
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
              {isRTL ? 'السابق' : 'Back'}
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
                {isRTL ? 'جاري البحث...' : 'Finding Matches...'}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {isRTL ? 'ابحث عن المنح' : 'Find My Scholarships'}
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
                {isRTL ? 'التالي' : 'Next'}
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
