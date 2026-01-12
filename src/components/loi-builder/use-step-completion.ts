'use client';

import { useMemo } from 'react';
import type { LOIWizardData } from '@/lib/loi-builder/types';
import { isStepComplete } from '@/lib/loi-builder/quality-rules';

export type StepStatus = 'completed' | 'current' | 'pending';

export interface StepCompletionResult {
  stepStatuses: StepStatus[];
  isStepComplete: (stepIndex: number) => boolean;
  getCompletedStepsCount: () => number;
  canNavigateToStep: (stepIndex: number) => boolean;
}

export function useStepCompletion(
  data: LOIWizardData,
  currentStep: number
): StepCompletionResult {
  const stepStatuses = useMemo(() => {
    const statuses: StepStatus[] = [];

    for (let i = 0; i < 7; i++) {
      if (i === currentStep) {
        statuses.push('current');
      } else if (isStepComplete(i, data)) {
        statuses.push('completed');
      } else {
        statuses.push('pending');
      }
    }

    return statuses;
  }, [data, currentStep]);

  const checkStepComplete = (stepIndex: number): boolean => {
    return isStepComplete(stepIndex, data);
  };

  const getCompletedStepsCount = (): number => {
    return stepStatuses.filter((s) => s === 'completed').length;
  };

  // Allow navigation to any step (for flexibility)
  const canNavigateToStep = (stepIndex: number): boolean => {
    // Allow going back to any previous step
    if (stepIndex <= currentStep) return true;
    // Allow going forward one step at a time, or to completed steps
    return stepIndex === currentStep + 1 || isStepComplete(stepIndex, data);
  };

  return {
    stepStatuses,
    isStepComplete: checkStepComplete,
    getCompletedStepsCount,
    canNavigateToStep,
  };
}
