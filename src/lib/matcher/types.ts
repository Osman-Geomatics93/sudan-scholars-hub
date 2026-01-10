/**
 * AI Scholarship Matcher - Type Definitions
 */

import type { GPASystem } from '@/lib/gpa-utils';
import type { Scholarship, StudyLevel, FieldOfStudy, FundingType } from '@/types/scholarship';

// ============ PROFILE TYPES ============

export type CurrentLevel = 'HIGH_SCHOOL' | 'BACHELOR' | 'MASTER' | 'PHD';
export type TargetLevel = 'BACHELOR' | 'MASTER' | 'PHD';
export type FundingPreference = 'FULLY_FUNDED_ONLY' | 'ANY';

export interface MatcherProfile {
  id: string;
  userId: string;

  // GPA Information
  gpaValue: number;          // Stored as percentage (0-100)
  gpaSystem: GPASystem;

  // Education
  currentLevel: CurrentLevel;
  targetLevel: TargetLevel;
  fieldsOfStudy: FieldOfStudy[];

  // Personal
  countryOfOrigin: string;   // ISO country code
  languages: string[];       // Array of languages
  age: number | null;

  // Preferences
  fundingPreference: FundingPreference;
  specialCircumstances: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface MatcherProfileInput {
  gpaValue: number;
  gpaSystem: GPASystem;
  currentLevel: CurrentLevel;
  targetLevel: TargetLevel;
  fieldsOfStudy: FieldOfStudy[];
  countryOfOrigin: string;
  languages: string[];
  age: number | null;
  fundingPreference: FundingPreference;
  specialCircumstances: string | null;
}

// ============ MATCH FACTOR TYPES ============

export type MatchFactorType =
  | 'gpa'
  | 'level'
  | 'field'
  | 'country'
  | 'language'
  | 'age'
  | 'funding'
  | 'deadline';

export type MatchFactorStatus = 'match' | 'partial' | 'mismatch';

export interface MatchFactor {
  type: MatchFactorType;
  status: MatchFactorStatus;
  score: number;           // Points earned for this factor
  maxScore: number;        // Maximum possible points
  detail: {
    en: string;
    ar: string;
  };
}

// ============ MATCH RESULT TYPES ============

export type MatchLevel = 'excellent' | 'good' | 'fair';

export interface ScholarshipMatch {
  scholarshipId: string;
  scholarship: Scholarship;
  score: number;              // Overall score (0-100)
  matchLevel: MatchLevel;
  explanation: {
    en: string;
    ar: string;
  };
  factors: MatchFactor[];
}

export interface PreliminaryMatch {
  scholarship: Scholarship;
  score: number;
  factors: MatchFactor[];
}

export interface MatchResults {
  id: string;
  matches: ScholarshipMatch[];
  totalMatched: number;
  processingTimeMs: number;
  aiModel: string;
  profile: MatcherProfile;
  createdAt: Date;
}

// ============ API TYPES ============

export interface MatcherProfileResponse {
  profile: MatcherProfile | null;
}

export interface MatchResultsResponse {
  resultId: string;
  matches: ScholarshipMatch[];
  totalMatched: number;
  processingTimeMs: number;
}

export interface MatchHistoryItem {
  id: string;
  totalMatched: number;
  createdAt: Date;
  topMatches: Array<{
    scholarshipId: string;
    title: string;
    score: number;
  }>;
}

export interface MatchHistoryResponse {
  history: MatchHistoryItem[];
  totalCount: number;
}

// ============ AI RESPONSE TYPES ============

export interface AIMatchResponse {
  matches: Array<{
    index: number;
    rating: MatchLevel;
    explanation: string;
  }>;
}

// ============ WIZARD STEP TYPES ============

export interface WizardStepProps {
  locale: string;
  data: Partial<MatcherProfileInput>;
  onNext: (stepData: Partial<MatcherProfileInput>) => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

// ============ SCORING WEIGHTS ============

export const SCORING_WEIGHTS = {
  gpa: 30,        // GPA match (30 points max)
  field: 25,      // Field of study match (25 points max)
  level: 20,      // Study level match (20 points max)
  funding: 15,    // Funding type match (15 points max)
  country: 10,    // Country/region bonus (10 points max)
} as const;

export const TOTAL_MAX_SCORE = Object.values(SCORING_WEIGHTS).reduce((a, b) => a + b, 0);

// ============ MATCH LEVEL THRESHOLDS ============

export const MATCH_LEVEL_THRESHOLDS = {
  excellent: 80,  // Score >= 80 = Excellent
  good: 60,       // Score >= 60 = Good
  fair: 0,        // Score < 60 = Fair
} as const;

export function getMatchLevel(score: number): MatchLevel {
  if (score >= MATCH_LEVEL_THRESHOLDS.excellent) return 'excellent';
  if (score >= MATCH_LEVEL_THRESHOLDS.good) return 'good';
  return 'fair';
}
