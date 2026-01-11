'use client';

import { useMemo } from 'react';
import type { CVWizardData } from '@/lib/cv-builder/types';

export type StepStatus = 'pending' | 'current' | 'completed';

export interface StepCompletionResult {
  stepStatuses: StepStatus[];
  isStepComplete: (stepIndex: number) => boolean;
  getCompletedStepsCount: () => number;
}

export function useStepCompletion(
  data: CVWizardData,
  currentStep: number
): StepCompletionResult {
  const stepStatuses = useMemo(() => {
    const statuses: StepStatus[] = [];

    // Step 0: Personal - requires name and email
    const isPersonalComplete = !!(
      data.personal.fullName?.trim() &&
      data.personal.email?.trim()
    );

    // Step 1: Education - at least one entry with required fields
    const isEducationComplete =
      data.education.length > 0 &&
      data.education.some(
        (edu) =>
          edu.institution?.trim() && edu.degree?.trim() && edu.field?.trim()
      );

    // Step 2: Experience - optional, complete if empty or has valid entry
    const isExperienceComplete =
      data.experience.length === 0 ||
      data.experience.some(
        (exp) => exp.company?.trim() && exp.position?.trim()
      );

    // Step 3: Skills - at least one skill
    const isSkillsComplete =
      data.skills.length > 0 && data.skills.some((skill) => skill.name?.trim());

    // Step 4: Projects - optional
    const isProjectsComplete =
      data.projects.length === 0 ||
      data.projects.some((proj) => proj.name?.trim());

    // Step 5: Awards - optional
    const isAwardsComplete =
      data.awards.length === 0 ||
      data.awards.some((award) => award.title?.trim());

    // Step 6: Extras - optional (summary or certifications)
    const isExtrasComplete =
      !!data.summary?.trim() ||
      data.certifications.some((cert) => cert.name?.trim());

    // Step 7: Template - always has a default selection
    const isTemplateComplete = !!data.template;

    const completionChecks = [
      isPersonalComplete,
      isEducationComplete,
      isExperienceComplete,
      isSkillsComplete,
      isProjectsComplete,
      isAwardsComplete,
      isExtrasComplete,
      isTemplateComplete,
    ];

    completionChecks.forEach((isComplete, index) => {
      if (index === currentStep) {
        statuses.push('current');
      } else if (isComplete) {
        statuses.push('completed');
      } else {
        statuses.push('pending');
      }
    });

    return statuses;
  }, [data, currentStep]);

  const isStepComplete = (stepIndex: number): boolean => {
    return stepStatuses[stepIndex] === 'completed';
  };

  const getCompletedStepsCount = (): number => {
    return stepStatuses.filter((s) => s === 'completed').length;
  };

  return { stepStatuses, isStepComplete, getCompletedStepsCount };
}
