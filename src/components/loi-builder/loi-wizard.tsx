'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { STEPS, DEFAULT_LOI_DATA, type LOIWizardData } from '@/lib/loi-builder/types';
import { WizardStepTabs } from './wizard-step-tabs';
import { useStepCompletion } from './use-step-completion';
import { LivePreview } from './live-preview';
import { StepHook } from './step-hook';
import { StepAcademic } from './step-academic';
import { StepWhyScholarship } from './step-why-scholarship';
import { StepWhyTurkey } from './step-why-turkey';
import { StepLeadership } from './step-leadership';
import { StepFuture } from './step-future';
import { StepClosing } from './step-closing';

const STORAGE_KEY = 'loi-builder-draft';
const AUTO_SAVE_INTERVAL = 5000; // 5 seconds

interface LOIWizardProps {
  locale: string;
}

export function LOIWizard({ locale }: LOIWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<LOIWizardData>(DEFAULT_LOI_DATA);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const isRTL = locale === 'ar';
  const { stepStatuses, getCompletedStepsCount } = useStepCompletion(formData, currentStep);

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData({ ...DEFAULT_LOI_DATA, ...parsed });
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    const saveTimer = setInterval(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        setLastSaved(new Date());
      } catch (error) {
        console.error('Error saving draft:', error);
      }
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(saveTimer);
  }, [formData]);

  // Handle step navigation
  const handleStepClick = useCallback((stepIndex: number) => {
    if (stepIndex === currentStep) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(stepIndex);
      setIsTransitioning(false);
    }, 150);
  }, [currentStep]);

  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      handleStepClick(currentStep + 1);
    }
  }, [currentStep, handleStepClick]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      handleStepClick(currentStep - 1);
    }
  }, [currentStep, handleStepClick]);

  // Handle data changes from step components
  const handleDataChange = useCallback((stepData: Partial<LOIWizardData>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  }, []);

  // Reset draft
  const handleReset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData(DEFAULT_LOI_DATA);
    setCurrentStep(0);
    setShowResetConfirm(false);
    setLastSaved(null);
  }, []);

  // Render current step component
  const renderStep = () => {
    const stepProps = {
      locale,
      data: formData,
      onDataChange: handleDataChange,
    };

    switch (currentStep) {
      case 0:
        return <StepHook {...stepProps} />;
      case 1:
        return <StepAcademic {...stepProps} />;
      case 2:
        return <StepWhyScholarship {...stepProps} />;
      case 3:
        return <StepWhyTurkey {...stepProps} />;
      case 4:
        return <StepLeadership {...stepProps} />;
      case 5:
        return <StepFuture {...stepProps} />;
      case 6:
        return <StepClosing {...stepProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {isRTL ? 'منشئ خطاب النية' : 'Letter of Intent Builder'}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {isRTL
            ? 'أنشئ خطاب دافع مقنع لمنحة تركيا'
            : 'Create a compelling motivation letter for Turkiye Scholarships'}
        </p>
        {lastSaved && (
          <p className="mt-1 text-xs text-gray-400">
            {isRTL ? 'آخر حفظ: ' : 'Last saved: '}
            {lastSaved.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Step tabs */}
      <div className="mb-8">
        <WizardStepTabs
          currentStep={currentStep}
          stepStatuses={stepStatuses}
          onStepClick={handleStepClick}
          locale={locale}
          completedCount={getCompletedStepsCount()}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Form section */}
        <div className={`flex-1 ${showPreview ? 'lg:w-3/5' : 'w-full'}`}>
          <div
            role="tabpanel"
            id={`step-panel-${STEPS[currentStep].id}`}
            className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-opacity duration-150 ${
              isTransitioning ? 'opacity-50' : 'opacity-100'
            }`}
          >
            {renderStep()}
          </div>

          {/* Navigation buttons */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0 || isTransitioning}
              >
                {isRTL ? (
                  <>
                    <ArrowRight className="w-4 h-4 me-2" />
                    {isRTL ? 'السابق' : 'Back'}
                  </>
                ) : (
                  <>
                    <ArrowLeft className="w-4 h-4 me-2" />
                    Back
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowResetConfirm(true)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <RotateCcw className="w-4 h-4 me-1" />
                {isRTL ? 'إعادة تعيين' : 'Reset'}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle preview button (mobile) */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="lg:hidden"
              >
                {showPreview ? (
                  <>
                    <EyeOff className="w-4 h-4 me-1" />
                    {isRTL ? 'إخفاء' : 'Hide'}
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 me-1" />
                    {isRTL ? 'معاينة' : 'Preview'}
                  </>
                )}
              </Button>

              <Button
                onClick={handleNext}
                disabled={currentStep === STEPS.length - 1 || isTransitioning}
              >
                {isRTL ? (
                  <>
                    {isRTL ? 'التالي' : 'Next'}
                    <ArrowLeft className="w-4 h-4 ms-2" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ms-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Preview section */}
        {showPreview && (
          <div className="lg:w-2/5">
            <LivePreview data={formData} locale={locale} />
          </div>
        )}
      </div>

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">
              {isRTL ? 'إعادة تعيين المسودة؟' : 'Reset Draft?'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {isRTL
                ? 'هل أنت متأكد؟ سيؤدي هذا إلى حذف كل تقدمك.'
                : 'Are you sure? This will delete all your progress.'}
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowResetConfirm(false)}
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                variant="destructive"
                onClick={handleReset}
              >
                {isRTL ? 'إعادة تعيين' : 'Reset'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
