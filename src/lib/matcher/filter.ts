/**
 * AI Scholarship Matcher - Hard Filtering Logic
 *
 * This module handles the first step of matching: eliminating scholarships
 * that the user is definitively not eligible for based on hard requirements.
 */

import type { Scholarship } from '@/types/scholarship';
import type { MatcherProfile } from './types';
import { SCHOLARSHIP_REQUIREMENTS, type ScholarshipRequirement } from '@/lib/gpa-utils';

// GPA buffer - allow matches within 5% of requirement (for "close" matches)
const GPA_BUFFER_PERCENT = 5;

/**
 * Filter scholarships by hard requirements
 * Returns only scholarships the user might be eligible for
 */
export function filterScholarships(
  scholarships: Scholarship[],
  profile: MatcherProfile
): Scholarship[] {
  const now = new Date();

  return scholarships.filter((scholarship) => {
    // 1. Deadline check - must be in the future
    const deadline = new Date(scholarship.deadline);
    if (deadline < now) {
      return false;
    }

    // 2. Level check - target level must be offered by scholarship
    const targetLevelUpper = profile.targetLevel.toUpperCase();
    const hasMatchingLevel = scholarship.levels.some(
      (level) => level.toUpperCase() === targetLevelUpper
    );
    if (!hasMatchingLevel) {
      return false;
    }

    // 3. Funding preference check
    if (profile.fundingPreference === 'FULLY_FUNDED_ONLY') {
      const fundingType = scholarship.fundingType.toUpperCase().replace('-', '_');
      if (fundingType !== 'FULLY_FUNDED') {
        return false;
      }
    }

    // 4. GPA check against known scholarship requirements
    const requirement = findScholarshipRequirement(scholarship);
    if (requirement) {
      // Check if user's GPA is too far below requirement
      const minWithBuffer = requirement.minPercent - GPA_BUFFER_PERCENT;
      if (profile.gpaValue < minWithBuffer) {
        return false;
      }

      // Check if scholarship level matches requirement levels
      const requirementHasLevel = requirement.levels.some(
        (level) => level.toUpperCase() === targetLevelUpper
      );
      if (!requirementHasLevel) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Find the scholarship requirement definition for a given scholarship
 * Matches by name similarity
 */
export function findScholarshipRequirement(
  scholarship: Scholarship
): ScholarshipRequirement | undefined {
  const titleLower = scholarship.title.toLowerCase();

  // Try to find exact or partial match
  return SCHOLARSHIP_REQUIREMENTS.find((req) => {
    const reqNameLower = req.name.en.toLowerCase();

    // Check if scholarship title contains requirement name or vice versa
    return (
      titleLower.includes(reqNameLower) ||
      reqNameLower.includes(titleLower) ||
      // Also check by country match for government scholarships
      (titleLower.includes(req.country.toLowerCase()) &&
       (titleLower.includes('government') || titleLower.includes('scholarship')))
    );
  });
}

/**
 * Check if a scholarship is within the deadline window (not expired)
 */
export function isDeadlineValid(deadline: string | Date): boolean {
  const deadlineDate = new Date(deadline);
  return deadlineDate >= new Date();
}

/**
 * Get days until deadline
 */
export function getDaysUntilDeadline(deadline: string | Date): number {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Check if user meets GPA requirement for a scholarship
 */
export function meetsGPARequirement(
  userGPA: number,
  scholarship: Scholarship
): { meets: boolean; close: boolean; difference: number } {
  const requirement = findScholarshipRequirement(scholarship);

  if (!requirement) {
    // No known requirement, assume eligible
    return { meets: true, close: false, difference: 0 };
  }

  const difference = userGPA - requirement.minPercent;

  return {
    meets: difference >= 0,
    close: difference >= -GPA_BUFFER_PERCENT && difference < 0,
    difference,
  };
}

/**
 * Check if scholarship matches user's target level
 */
export function matchesTargetLevel(
  scholarship: Scholarship,
  targetLevel: string
): boolean {
  const targetLevelUpper = targetLevel.toUpperCase();
  return scholarship.levels.some(
    (level) => level.toUpperCase() === targetLevelUpper
  );
}

/**
 * Check if scholarship matches user's field of study
 */
export function matchesFieldOfStudy(
  scholarship: Scholarship,
  userFields: string[]
): boolean {
  const scholarshipFieldUpper = scholarship.field.toUpperCase();
  return userFields.some(
    (field) => field.toUpperCase() === scholarshipFieldUpper
  );
}

/**
 * Get the minimum GPA percentage required for a scholarship
 */
export function getMinGPAPercent(scholarship: Scholarship): number | null {
  const requirement = findScholarshipRequirement(scholarship);
  return requirement?.minPercent ?? null;
}

/**
 * Filter results type for detailed filtering info
 */
export interface FilterResult {
  scholarship: Scholarship;
  passed: boolean;
  reasons: FilterReason[];
}

export interface FilterReason {
  type: 'deadline' | 'level' | 'funding' | 'gpa';
  passed: boolean;
  detail: string;
}

/**
 * Filter scholarships with detailed reasons
 * Useful for showing users why certain scholarships were excluded
 */
export function filterScholarshipsWithReasons(
  scholarships: Scholarship[],
  profile: MatcherProfile
): FilterResult[] {
  const now = new Date();

  return scholarships.map((scholarship) => {
    const reasons: FilterReason[] = [];
    let passed = true;

    // 1. Deadline check
    const deadline = new Date(scholarship.deadline);
    const deadlineValid = deadline >= now;
    reasons.push({
      type: 'deadline',
      passed: deadlineValid,
      detail: deadlineValid
        ? `Deadline: ${deadline.toLocaleDateString()}`
        : 'Deadline has passed',
    });
    if (!deadlineValid) passed = false;

    // 2. Level check
    const levelMatches = matchesTargetLevel(scholarship, profile.targetLevel);
    reasons.push({
      type: 'level',
      passed: levelMatches,
      detail: levelMatches
        ? `Offers ${profile.targetLevel} level`
        : `Does not offer ${profile.targetLevel} level`,
    });
    if (!levelMatches) passed = false;

    // 3. Funding check
    let fundingOk = true;
    if (profile.fundingPreference === 'FULLY_FUNDED_ONLY') {
      const fundingType = scholarship.fundingType.toUpperCase().replace('-', '_');
      fundingOk = fundingType === 'FULLY_FUNDED';
    }
    reasons.push({
      type: 'funding',
      passed: fundingOk,
      detail: fundingOk
        ? scholarship.fundingType
        : 'Not fully funded',
    });
    if (!fundingOk) passed = false;

    // 4. GPA check
    const gpaResult = meetsGPARequirement(profile.gpaValue, scholarship);
    const gpaOk = gpaResult.meets || gpaResult.close;
    const requirement = findScholarshipRequirement(scholarship);
    reasons.push({
      type: 'gpa',
      passed: gpaOk,
      detail: requirement
        ? `Requires ${requirement.minPercent}%, you have ${profile.gpaValue.toFixed(1)}%`
        : 'GPA requirement not specified',
    });
    if (!gpaOk) passed = false;

    return {
      scholarship,
      passed,
      reasons,
    };
  });
}
