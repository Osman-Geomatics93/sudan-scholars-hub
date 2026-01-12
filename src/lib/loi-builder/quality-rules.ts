import type { LOIWizardData, QualityScore, QualityIssue } from './types';

// Word count targets
export const TOTAL_WORD_TARGET = {
  min: 500,
  max: 900,
  ideal: 700,
};

// Common cliches to avoid in LOI
export const CLICHES: Record<string, string[]> = {
  en: [
    'since childhood',
    'since i was a child',
    'since i was young',
    'my dream',
    'always wanted',
    'passionate about',
    'best country in the world',
    'great opportunity',
    'amazing experience',
    'change the world',
    'make a difference',
    'give back to society',
    'pursue my dreams',
    'reach my full potential',
    'stepping stone',
    'golden opportunity',
    'once in a lifetime',
    'broaden my horizons',
    'outside my comfort zone',
    'think outside the box',
    'at the end of the day',
    'global citizen',
    'make the world a better place',
    'follow my passion',
    'ever since i can remember',
    'it has always been my dream',
    'i believe i am the perfect candidate',
    'i am very interested',
    'very motivated',
    'highly motivated',
  ],
  tr: [
    'cocuklugumdan beri',
    'kucuklugumden beri',
    'hayalim',
    'en iyi ulke',
    'muhtesem firsat',
    'harika deneyim',
    'dunyayi degistirmek',
    'fark yaratmak',
    'topluma geri vermek',
    'hayallerimin pesinden gitmek',
    'altin firsat',
    'omur boyu firsat',
  ],
};

// Generic phrases that should be made more specific
export const GENERIC_PHRASES: string[] = [
  'i am hardworking',
  'i am motivated',
  'i have leadership skills',
  'i am a team player',
  'good communication skills',
  'problem-solving skills',
  'i am dedicated',
  'i am committed',
  'strong work ethic',
  'quick learner',
  'detail-oriented',
  'self-motivated',
  'results-driven',
  'i am passionate',
  'i have experience',
  'valuable experience',
];

// Patterns that indicate specificity (good)
export const SPECIFICITY_INDICATORS: RegExp[] = [
  /\d+\s*%/, // Percentages
  /\d+\s*(students|people|members|participants|projects|hours|months|years)/i,
  /professor|dr\.|prof\.|lab|research group|department/i,
  /university of|institute of|college of/i,
  /\$\s*[\d,]+|\d+\s*(tl|usd|eur|gbp)/i, // Money amounts
  /\b(19|20)\d{2}\b/, // Years
  /first|second|third|1st|2nd|3rd\s*(place|prize|rank)/i,
  /published|presented|won|awarded|received|achieved/i,
  /increased|decreased|improved|reduced|grew|expanded/i,
  /gpa|cgpa|grade|score|rank/i,
  /founded|established|created|launched|initiated|led/i,
  /team of|group of|committee|organization|association/i,
];

// Detect cliches in text
export function detectCliches(
  text: string,
  language: 'en' | 'tr' = 'en'
): string[] {
  const found: string[] = [];
  const lowerText = text.toLowerCase();

  const clicheList = CLICHES[language] || CLICHES.en;
  clicheList.forEach((cliche) => {
    if (lowerText.includes(cliche)) {
      found.push(cliche);
    }
  });

  return found;
}

// Detect generic phrases
export function detectGenericPhrases(text: string): string[] {
  const found: string[] = [];
  const lowerText = text.toLowerCase();

  GENERIC_PHRASES.forEach((phrase) => {
    if (lowerText.includes(phrase)) {
      found.push(phrase);
    }
  });

  return found;
}

// Calculate specificity score (0-100)
export function calculateSpecificityScore(text: string): number {
  if (!text || text.trim().length === 0) return 0;

  let score = 0;
  const maxIndicatorScore = SPECIFICITY_INDICATORS.length * 8;

  // Check for specificity indicators
  SPECIFICITY_INDICATORS.forEach((pattern) => {
    if (pattern.test(text)) score += 8;
  });

  // Bonus for named entities (capitalized words not at sentence start)
  const namedEntities = text.match(/(?<=[a-z]\s)[A-Z][a-z]+/g) || [];
  score += Math.min(namedEntities.length * 4, 20);

  // Bonus for numbers
  const numbers = text.match(/\d+/g) || [];
  score += Math.min(numbers.length * 3, 15);

  // Penalty for very short text
  const wordCount = getWordCount(text);
  if (wordCount < 20) score -= 20;

  return Math.min(Math.max((score / maxIndicatorScore) * 100, 0), 100);
}

// Get word count
export function getWordCount(text: string): number {
  if (!text || text.trim().length === 0) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Calculate section word count
export function getSectionWordCount(sectionData: Record<string, string>): number {
  return Object.values(sectionData).reduce((total, value) => {
    return total + getWordCount(value || '');
  }, 0);
}

// Calculate completeness score (0-100)
export function calculateCompletenessScore(data: LOIWizardData): number {
  const requiredFields = [
    data.hook.openingStatement,
    data.hook.fieldOfInterest,
    data.hook.careerGoal,
    data.academic.currentEducation,
    data.academic.relevantCourses,
    data.academic.academicAchievements,
    data.whyScholarship.whatAttracted,
    data.whyScholarship.alignmentWithGoals,
    data.whyTurkey.countryReasons,
    data.whyTurkey.universityName,
    data.whyTurkey.programName,
    data.whyTurkey.whyThisProgram,
    data.leadership.situation,
    data.leadership.task,
    data.leadership.action,
    data.leadership.result,
    data.future.shortTermGoals,
    data.future.longTermGoals,
    data.future.impactOnCommunity,
    data.closing.commitment,
    data.settings.fullName,
  ];

  const filledCount = requiredFields.filter(
    (field) => field && field.trim().length >= 10
  ).length;

  return Math.round((filledCount / requiredFields.length) * 100);
}

// Calculate future clarity score (0-100)
export function calculateFutureClarityScore(data: LOIWizardData): number {
  const futureText = Object.values(data.future).join(' ');

  let score = 0;

  // Has specific timeline indicators
  if (/\d+\s*(years?|months?)/i.test(futureText)) score += 20;
  if (/within|by|after|before/i.test(futureText)) score += 10;

  // Has measurable outcomes
  if (/\d+\s*%/i.test(futureText)) score += 15;
  if (/\d+\s*(students|people|projects|companies)/i.test(futureText)) score += 15;

  // Has specific roles/positions
  if (/researcher|professor|engineer|doctor|founder|manager|director|specialist/i.test(futureText)) score += 15;

  // Has geographic focus
  if (/my country|sudan|africa|region|community|village|city/i.test(futureText)) score += 10;

  // Length and detail
  const wordCount = getWordCount(futureText);
  if (wordCount >= 100) score += 15;
  else if (wordCount >= 50) score += 10;

  return Math.min(score, 100);
}

// Calculate cliche score (higher = better, fewer cliches)
export function calculateClicheScore(data: LOIWizardData): number {
  const allText = getAllText(data);
  const language = data.settings.language;

  const cliches = detectCliches(allText, language);
  const genericPhrases = detectGenericPhrases(allText);

  const totalIssues = cliches.length + genericPhrases.length;

  // Start with 100, subtract for each issue
  const score = Math.max(100 - totalIssues * 10, 0);

  return score;
}

// Get all text from LOI data
export function getAllText(data: LOIWizardData): string {
  const sections = [
    data.hook,
    data.academic,
    data.whyScholarship,
    data.whyTurkey,
    data.leadership,
    data.future,
    data.closing,
  ];

  return sections
    .map((section) => Object.values(section).join(' '))
    .join(' ');
}

// Get total word count
export function getTotalWordCount(data: LOIWizardData): number {
  return getWordCount(getAllText(data));
}

// Find quality issues
export function findQualityIssues(data: LOIWizardData): QualityIssue[] {
  const issues: QualityIssue[] = [];
  const language = data.settings.language;

  // Check each section for cliches and generic phrases
  const sections = [
    { step: 0, name: 'hook', data: data.hook },
    { step: 1, name: 'academic', data: data.academic },
    { step: 2, name: 'whyScholarship', data: data.whyScholarship },
    { step: 3, name: 'whyTurkey', data: data.whyTurkey },
    { step: 4, name: 'leadership', data: data.leadership },
    { step: 5, name: 'future', data: data.future },
    { step: 6, name: 'closing', data: data.closing },
  ];

  sections.forEach(({ step, name, data: sectionData }) => {
    Object.entries(sectionData).forEach(([field, value]) => {
      if (!value || typeof value !== 'string') return;

      // Check for cliches
      const cliches = detectCliches(value, language);
      cliches.forEach((cliche) => {
        issues.push({
          step,
          field,
          type: 'cliche',
          message: `Cliche detected: "${cliche}"`,
          suggestion: 'Replace with a specific, personal example or detail.',
        });
      });

      // Check for generic phrases
      const generic = detectGenericPhrases(value);
      generic.forEach((phrase) => {
        issues.push({
          step,
          field,
          type: 'generic',
          message: `Generic phrase: "${phrase}"`,
          suggestion: 'Add a specific example that demonstrates this quality.',
        });
      });

      // Check for missing required content
      const wordCount = getWordCount(value);
      if (wordCount < 10 && field !== 'gratitude') {
        issues.push({
          step,
          field,
          type: 'too_short',
          message: 'This section is too short.',
          suggestion: 'Add more detail with specific examples, numbers, or outcomes.',
        });
      }
    });
  });

  return issues;
}

// Calculate overall quality score
export function calculateQualityScore(data: LOIWizardData): QualityScore {
  const allText = getAllText(data);
  const specificity = calculateSpecificityScore(allText);
  const completeness = calculateCompletenessScore(data);
  const clicheScore = calculateClicheScore(data);
  const futureClarity = calculateFutureClarityScore(data);
  const issues = findQualityIssues(data);

  // Weighted average for overall score
  const overall = Math.round(
    specificity * 0.25 +
    completeness * 0.30 +
    clicheScore * 0.20 +
    futureClarity * 0.25
  );

  return {
    overall,
    specificity: Math.round(specificity),
    completeness,
    clicheScore,
    futureClarity: Math.round(futureClarity),
    issues,
  };
}

// Get suggestion for improvement based on current text
export function getImprovementSuggestion(
  text: string,
  fieldType: string
): string | null {
  const wordCount = getWordCount(text);
  const cliches = detectCliches(text, 'en');
  const generic = detectGenericPhrases(text);
  const specificity = calculateSpecificityScore(text);

  if (wordCount < 10) {
    return 'Start by answering the guiding questions above.';
  }

  if (cliches.length > 0) {
    return `Avoid cliches like "${cliches[0]}". What specific experience can you share instead?`;
  }

  if (generic.length > 0) {
    return `"${generic[0]}" is too generic. Add a specific example that proves this.`;
  }

  if (specificity < 30) {
    switch (fieldType) {
      case 'result':
      case 'measurableOutcomes':
        return 'Add numbers! How many people? What percentage? What amount?';
      case 'whyThisProgram':
      case 'specificDetails':
        return 'Mention specific professors, research labs, or course names.';
      case 'academicAchievements':
        return 'Include GPA, rankings, awards, or project outcomes with numbers.';
      default:
        return 'Add specific details: names, dates, numbers, or outcomes.';
    }
  }

  if (wordCount < 30) {
    return 'Good start! Expand with more specific details.';
  }

  return null; // No suggestion needed - text looks good
}

// Check if step is complete (all required fields filled)
export function isStepComplete(
  step: number,
  data: LOIWizardData
): boolean {
  const minLength = 20;

  switch (step) {
    case 0: // Hook
      return (
        data.hook.openingStatement.length >= minLength &&
        data.hook.fieldOfInterest.length >= 5 &&
        data.hook.careerGoal.length >= minLength
      );
    case 1: // Academic
      return (
        data.academic.currentEducation.length >= minLength &&
        data.academic.relevantCourses.length >= minLength &&
        data.academic.academicAchievements.length >= minLength
      );
    case 2: // Why Scholarship
      return (
        data.whyScholarship.whatAttracted.length >= minLength &&
        data.whyScholarship.alignmentWithGoals.length >= minLength
      );
    case 3: // Why Turkey
      return (
        data.whyTurkey.countryReasons.length >= minLength &&
        data.whyTurkey.universityName.length >= 3 &&
        data.whyTurkey.programName.length >= 3 &&
        data.whyTurkey.whyThisProgram.length >= minLength
      );
    case 4: // Leadership
      return (
        data.leadership.situation.length >= minLength &&
        data.leadership.task.length >= minLength &&
        data.leadership.action.length >= minLength &&
        data.leadership.result.length >= minLength
      );
    case 5: // Future
      return (
        data.future.shortTermGoals.length >= minLength &&
        data.future.longTermGoals.length >= minLength &&
        data.future.impactOnCommunity.length >= minLength
      );
    case 6: // Closing
      return (
        data.closing.commitment.length >= minLength &&
        data.settings.fullName.length >= 2
      );
    default:
      return false;
  }
}
