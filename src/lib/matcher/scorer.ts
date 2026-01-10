/**
 * AI Scholarship Matcher - Preliminary Scoring Algorithm
 *
 * This module calculates preliminary scores for scholarships before
 * sending them to the AI for final ranking and explanations.
 */

import type { Scholarship } from '@/types/scholarship';
import type {
  MatcherProfile,
  MatchFactor,
  PreliminaryMatch,
  SCORING_WEIGHTS,
} from './types';
import { getMatchLevel, TOTAL_MAX_SCORE } from './types';
import { findScholarshipRequirement, getDaysUntilDeadline } from './filter';

// Scoring weights
const WEIGHTS = {
  gpa: 30,        // GPA match (30 points max)
  field: 25,      // Field of study match (25 points max)
  level: 20,      // Study level match (20 points max)
  funding: 15,    // Funding type match (15 points max)
  country: 10,    // Country/region bonus (10 points max)
} as const;

/**
 * Calculate preliminary score for a scholarship
 */
export function calculatePreliminaryScore(
  scholarship: Scholarship,
  profile: MatcherProfile
): PreliminaryMatch {
  const factors: MatchFactor[] = [];

  // 1. GPA Score
  const gpaFactor = scoreGPA(scholarship, profile);
  factors.push(gpaFactor);

  // 2. Field of Study Score
  const fieldFactor = scoreField(scholarship, profile);
  factors.push(fieldFactor);

  // 3. Study Level Score
  const levelFactor = scoreLevel(scholarship, profile);
  factors.push(levelFactor);

  // 4. Funding Type Score
  const fundingFactor = scoreFunding(scholarship, profile);
  factors.push(fundingFactor);

  // 5. Country/Region Score
  const countryFactor = scoreCountry(scholarship, profile);
  factors.push(countryFactor);

  // Calculate total score as percentage
  const totalScore = factors.reduce((sum, f) => sum + f.score, 0);
  const totalMaxScore = factors.reduce((sum, f) => sum + f.maxScore, 0);
  const normalizedScore = Math.round((totalScore / totalMaxScore) * 100);

  return {
    scholarship,
    score: normalizedScore,
    factors,
  };
}

/**
 * Score based on GPA match
 * Full points if GPA meets or exceeds requirement
 * Partial points if within 5% of requirement
 */
function scoreGPA(
  scholarship: Scholarship,
  profile: MatcherProfile
): MatchFactor {
  const requirement = findScholarshipRequirement(scholarship);
  const maxScore = WEIGHTS.gpa;

  if (!requirement) {
    // No known requirement, give full score
    return {
      type: 'gpa',
      status: 'match',
      score: maxScore,
      maxScore,
      detail: {
        en: 'No specific GPA requirement known',
        ar: 'لا يوجد حد أدنى معروف للمعدل',
      },
    };
  }

  const difference = profile.gpaValue - requirement.minPercent;

  if (difference >= 10) {
    // Exceeds by 10%+
    return {
      type: 'gpa',
      status: 'match',
      score: maxScore,
      maxScore,
      detail: {
        en: `Your GPA (${profile.gpaValue.toFixed(1)}%) exceeds the requirement (${requirement.minPercent}%)`,
        ar: `معدلك (${profile.gpaValue.toFixed(1)}%) يتجاوز المتطلب (${requirement.minPercent}%)`,
      },
    };
  } else if (difference >= 0) {
    // Meets requirement
    return {
      type: 'gpa',
      status: 'match',
      score: Math.round(maxScore * 0.9),
      maxScore,
      detail: {
        en: `Your GPA (${profile.gpaValue.toFixed(1)}%) meets the requirement (${requirement.minPercent}%)`,
        ar: `معدلك (${profile.gpaValue.toFixed(1)}%) يحقق المتطلب (${requirement.minPercent}%)`,
      },
    };
  } else if (difference >= -5) {
    // Close (within 5%)
    return {
      type: 'gpa',
      status: 'partial',
      score: Math.round(maxScore * 0.5),
      maxScore,
      detail: {
        en: `Your GPA (${profile.gpaValue.toFixed(1)}%) is close to requirement (${requirement.minPercent}%)`,
        ar: `معدلك (${profile.gpaValue.toFixed(1)}%) قريب من المتطلب (${requirement.minPercent}%)`,
      },
    };
  } else {
    // Below requirement
    return {
      type: 'gpa',
      status: 'mismatch',
      score: 0,
      maxScore,
      detail: {
        en: `Your GPA (${profile.gpaValue.toFixed(1)}%) is below requirement (${requirement.minPercent}%)`,
        ar: `معدلك (${profile.gpaValue.toFixed(1)}%) أقل من المتطلب (${requirement.minPercent}%)`,
      },
    };
  }
}

/**
 * Score based on field of study match
 */
function scoreField(
  scholarship: Scholarship,
  profile: MatcherProfile
): MatchFactor {
  const maxScore = WEIGHTS.field;
  const scholarshipFieldUpper = scholarship.field.toUpperCase();

  // Check if any of user's fields match
  const exactMatch = profile.fieldsOfStudy.some(
    (field) => field.toUpperCase() === scholarshipFieldUpper
  );

  // Check for related fields (simplified mapping)
  const relatedFields: Record<string, string[]> = {
    ENGINEERING: ['TECHNOLOGY', 'SCIENCE'],
    TECHNOLOGY: ['ENGINEERING', 'SCIENCE'],
    SCIENCE: ['ENGINEERING', 'MEDICINE', 'TECHNOLOGY'],
    MEDICINE: ['SCIENCE'],
    BUSINESS: ['LAW', 'EDUCATION'],
    LAW: ['BUSINESS', 'ARTS'],
    ARTS: ['EDUCATION', 'LAW'],
    EDUCATION: ['ARTS', 'BUSINESS'],
  };

  const userFieldsUpper = profile.fieldsOfStudy.map((f) => f.toUpperCase());
  const related = relatedFields[scholarshipFieldUpper] || [];
  const hasRelatedMatch = related.some((f) => userFieldsUpper.includes(f));

  if (exactMatch) {
    return {
      type: 'field',
      status: 'match',
      score: maxScore,
      maxScore,
      detail: {
        en: `Field matches your interest: ${scholarship.field}`,
        ar: `المجال يتطابق مع اهتمامك: ${scholarship.field}`,
      },
    };
  } else if (hasRelatedMatch) {
    return {
      type: 'field',
      status: 'partial',
      score: Math.round(maxScore * 0.6),
      maxScore,
      detail: {
        en: `Related field: ${scholarship.field}`,
        ar: `مجال مرتبط: ${scholarship.field}`,
      },
    };
  } else {
    return {
      type: 'field',
      status: 'mismatch',
      score: Math.round(maxScore * 0.2),
      maxScore,
      detail: {
        en: `Different field: ${scholarship.field}`,
        ar: `مجال مختلف: ${scholarship.field}`,
      },
    };
  }
}

/**
 * Score based on study level match
 */
function scoreLevel(
  scholarship: Scholarship,
  profile: MatcherProfile
): MatchFactor {
  const maxScore = WEIGHTS.level;
  const targetLevelUpper = profile.targetLevel.toUpperCase();

  const exactMatch = scholarship.levels.some(
    (level) => level.toUpperCase() === targetLevelUpper
  );

  if (exactMatch) {
    // Additional bonus if scholarship offers only target level (specialized)
    const isSpecialized = scholarship.levels.length === 1;
    return {
      type: 'level',
      status: 'match',
      score: isSpecialized ? maxScore : Math.round(maxScore * 0.9),
      maxScore,
      detail: {
        en: `Offers ${profile.targetLevel} program`,
        ar: `يقدم برنامج ${profile.targetLevel}`,
      },
    };
  } else {
    return {
      type: 'level',
      status: 'mismatch',
      score: 0,
      maxScore,
      detail: {
        en: `Does not offer ${profile.targetLevel} program`,
        ar: `لا يقدم برنامج ${profile.targetLevel}`,
      },
    };
  }
}

/**
 * Score based on funding type match
 */
function scoreFunding(
  scholarship: Scholarship,
  profile: MatcherProfile
): MatchFactor {
  const maxScore = WEIGHTS.funding;
  const fundingType = scholarship.fundingType.toUpperCase().replace('-', '_');
  const isFullyFunded = fundingType === 'FULLY_FUNDED';

  if (profile.fundingPreference === 'FULLY_FUNDED_ONLY') {
    if (isFullyFunded) {
      return {
        type: 'funding',
        status: 'match',
        score: maxScore,
        maxScore,
        detail: {
          en: 'Fully funded scholarship',
          ar: 'منحة ممولة بالكامل',
        },
      };
    } else {
      return {
        type: 'funding',
        status: 'mismatch',
        score: 0,
        maxScore,
        detail: {
          en: 'Partially funded (you prefer fully funded)',
          ar: 'ممولة جزئياً (تفضل الممولة بالكامل)',
        },
      };
    }
  } else {
    // User accepts any funding
    return {
      type: 'funding',
      status: isFullyFunded ? 'match' : 'partial',
      score: isFullyFunded ? maxScore : Math.round(maxScore * 0.7),
      maxScore,
      detail: {
        en: isFullyFunded ? 'Fully funded' : 'Partially funded',
        ar: isFullyFunded ? 'ممولة بالكامل' : 'ممولة جزئياً',
      },
    };
  }
}

/**
 * Score based on country/region match
 * Gives bonus for regional scholarships or country-specific benefits
 */
function scoreCountry(
  scholarship: Scholarship,
  profile: MatcherProfile
): MatchFactor {
  const maxScore = WEIGHTS.country;

  // Regional groupings for bonus
  const regions: Record<string, string[]> = {
    MENA: ['SD', 'EG', 'SA', 'AE', 'JO', 'LB', 'SY', 'IQ', 'YE', 'OM', 'KW', 'QA', 'BH', 'DZ', 'MA', 'TN', 'LY'],
    AFRICA: ['SD', 'EG', 'NG', 'KE', 'ZA', 'GH', 'ET', 'TZ', 'UG', 'RW', 'SN'],
    ARAB: ['SD', 'EG', 'SA', 'AE', 'JO', 'LB', 'SY', 'IQ', 'YE', 'OM', 'KW', 'QA', 'BH', 'DZ', 'MA', 'TN', 'LY'],
  };

  const userCountry = profile.countryOfOrigin.toUpperCase();

  // Check if scholarship has regional focus
  const requirement = findScholarshipRequirement(scholarship);

  // Check for scholarships specifically for developing countries or specific regions
  const scholarshipCountry = scholarship.country.toLowerCase();
  const title = scholarship.title.toLowerCase();

  // African scholarships bonus for African students
  if (
    (title.includes('african') || title.includes('africa')) &&
    regions.AFRICA.includes(userCountry)
  ) {
    return {
      type: 'country',
      status: 'match',
      score: maxScore,
      maxScore,
      detail: {
        en: 'Scholarship designed for African students',
        ar: 'منحة مخصصة للطلاب الأفارقة',
      },
    };
  }

  // Arab/MENA scholarships bonus
  if (
    (title.includes('arab') || title.includes('mena') || title.includes('islamic')) &&
    regions.MENA.includes(userCountry)
  ) {
    return {
      type: 'country',
      status: 'match',
      score: maxScore,
      maxScore,
      detail: {
        en: 'Scholarship designed for Arab/MENA students',
        ar: 'منحة مخصصة للطلاب العرب',
      },
    };
  }

  // Turkey scholarship bonus for Arabic-speaking countries
  if (
    scholarshipCountry.includes('turkey') &&
    regions.ARAB.includes(userCountry)
  ) {
    return {
      type: 'country',
      status: 'match',
      score: Math.round(maxScore * 0.8),
      maxScore,
      detail: {
        en: 'Turkey has strong ties with Arab countries',
        ar: 'تركيا لها علاقات قوية مع الدول العربية',
      },
    };
  }

  // Default: partial score for international scholarships
  return {
    type: 'country',
    status: 'partial',
    score: Math.round(maxScore * 0.5),
    maxScore,
    detail: {
      en: 'Open to international students',
      ar: 'مفتوحة للطلاب الدوليين',
    },
  };
}

/**
 * Score and sort all scholarships for a user profile
 */
export function scoreAndSortScholarships(
  scholarships: Scholarship[],
  profile: MatcherProfile
): PreliminaryMatch[] {
  const scored = scholarships.map((scholarship) =>
    calculatePreliminaryScore(scholarship, profile)
  );

  // Sort by score descending
  return scored.sort((a, b) => b.score - a.score);
}

/**
 * Get top N matches
 */
export function getTopMatches(
  scholarships: Scholarship[],
  profile: MatcherProfile,
  limit: number = 15
): PreliminaryMatch[] {
  const sorted = scoreAndSortScholarships(scholarships, profile);
  return sorted.slice(0, limit);
}
