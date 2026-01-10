/**
 * AI Scholarship Matcher - Module Exports
 */

// Types
export * from './types';

// Filter functions
export {
  filterScholarships,
  findScholarshipRequirement,
  isDeadlineValid,
  getDaysUntilDeadline,
  meetsGPARequirement,
  matchesTargetLevel,
  matchesFieldOfStudy,
  getMinGPAPercent,
  filterScholarshipsWithReasons,
  type FilterResult,
  type FilterReason,
} from './filter';

// Scoring functions
export {
  calculatePreliminaryScore,
  scoreAndSortScholarships,
  getTopMatches,
} from './scorer';

// AI functions
export {
  generateMatchExplanations,
  isAIAvailable,
  getAIModel,
} from './ai-ranker';

// Prompts
export {
  MATCHER_SYSTEM_PROMPTS,
  buildMatcherPrompt,
  parseAIResponse,
  generateFallbackExplanation,
} from './prompts';
