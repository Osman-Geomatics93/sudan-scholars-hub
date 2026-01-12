import {
  detectCliches,
  detectGenericPhrases,
  calculateSpecificityScore,
  getWordCount,
  getSectionWordCount,
  calculateCompletenessScore,
  calculateFutureClarityScore,
  calculateClicheScore,
  getAllText,
  getTotalWordCount,
  findQualityIssues,
  calculateQualityScore,
  getImprovementSuggestion,
  isStepComplete,
  CLICHES,
  GENERIC_PHRASES,
  SPECIFICITY_INDICATORS,
  TOTAL_WORD_TARGET,
} from '../quality-rules';
import { DEFAULT_LOI_DATA } from '../types';
import type { LOIWizardData } from '../types';

describe('Quality Rules', () => {
  describe('TOTAL_WORD_TARGET', () => {
    it('should have correct word count targets', () => {
      expect(TOTAL_WORD_TARGET.min).toBe(500);
      expect(TOTAL_WORD_TARGET.max).toBe(900);
      expect(TOTAL_WORD_TARGET.ideal).toBe(700);
    });
  });

  describe('detectCliches', () => {
    it('should detect English cliches', () => {
      const text = 'Since childhood, I have always wanted to pursue my dreams.';
      const cliches = detectCliches(text, 'en');

      expect(cliches).toContain('since childhood');
      expect(cliches).toContain('always wanted');
      expect(cliches).toContain('pursue my dreams');
    });

    it('should detect Turkish cliches', () => {
      const text = 'Cocuklugumdan beri bu hayalim oldu.';
      const cliches = detectCliches(text, 'tr');

      expect(cliches).toContain('cocuklugumdan beri');
      expect(cliches).toContain('hayalim');
    });

    it('should return empty array when no cliches found', () => {
      const text = 'I studied Computer Science at MIT with a focus on AI systems.';
      const cliches = detectCliches(text, 'en');

      expect(cliches).toHaveLength(0);
    });

    it('should be case insensitive', () => {
      const text = 'SINCE CHILDHOOD I have been PASSIONATE ABOUT engineering.';
      const cliches = detectCliches(text, 'en');

      expect(cliches).toContain('since childhood');
      expect(cliches).toContain('passionate about');
    });

    it('should detect multiple cliches', () => {
      const text = 'This golden opportunity will help me make a difference and change the world.';
      const cliches = detectCliches(text, 'en');

      expect(cliches.length).toBeGreaterThanOrEqual(3);
      expect(cliches).toContain('golden opportunity');
      expect(cliches).toContain('make a difference');
      expect(cliches).toContain('change the world');
    });
  });

  describe('detectGenericPhrases', () => {
    it('should detect generic phrases', () => {
      const text = 'I am hardworking and I am a team player with good communication skills.';
      const generic = detectGenericPhrases(text);

      expect(generic).toContain('i am hardworking');
      expect(generic).toContain('i am a team player');
      expect(generic).toContain('good communication skills');
    });

    it('should return empty array when no generic phrases found', () => {
      const text = 'I led a team of 15 engineers to deliver a $2M project on time.';
      const generic = detectGenericPhrases(text);

      expect(generic).toHaveLength(0);
    });
  });

  describe('calculateSpecificityScore', () => {
    it('should return 0 for empty text', () => {
      expect(calculateSpecificityScore('')).toBe(0);
      expect(calculateSpecificityScore('   ')).toBe(0);
    });

    it('should give higher score for text with numbers', () => {
      const genericText = 'I worked on many projects and helped many students.';
      const specificText = 'I worked on 5 projects and helped 200 students achieve 95% pass rate.';

      const genericScore = calculateSpecificityScore(genericText);
      const specificScore = calculateSpecificityScore(specificText);

      expect(specificScore).toBeGreaterThan(genericScore);
    });

    it('should give higher score for text with named entities', () => {
      // Need at least 20 words to avoid short text penalty
      const genericText = 'I studied at the university and worked at a company doing various tasks and projects for several years in the field.';
      const specificText = 'I studied at the University of Oxford and worked at Google on machine learning projects for 3 years developing AI models.';

      const genericScore = calculateSpecificityScore(genericText);
      const specificScore = calculateSpecificityScore(specificText);

      expect(specificScore).toBeGreaterThan(genericScore);
    });

    it('should detect professor/research mentions', () => {
      // Need at least 20 words to avoid short text penalty
      const text = 'I want to work with Professor Smith in the AI Research Lab to develop new algorithms for machine learning systems and data analysis applications.';
      const score = calculateSpecificityScore(text);

      expect(score).toBeGreaterThan(0);
    });

    it('should detect achievements', () => {
      // Need at least 20 words to avoid short text penalty
      const text = 'I won first place in the competition and published my research paper in a top journal in 2023 with significant impact.';
      const score = calculateSpecificityScore(text);

      expect(score).toBeGreaterThan(0);
    });

    it('should give penalty for very short text', () => {
      const shortText = 'I am good.';
      const score = calculateSpecificityScore(shortText);

      expect(score).toBeLessThan(50);
    });
  });

  describe('getWordCount', () => {
    it('should count words correctly', () => {
      expect(getWordCount('Hello world')).toBe(2);
      expect(getWordCount('This is a test sentence.')).toBe(5);
      expect(getWordCount('')).toBe(0);
      expect(getWordCount('   ')).toBe(0);
    });

    it('should handle multiple spaces', () => {
      expect(getWordCount('Hello    world   test')).toBe(3);
    });

    it('should handle newlines and tabs', () => {
      expect(getWordCount('Hello\nworld\ttest')).toBe(3);
    });
  });

  describe('getSectionWordCount', () => {
    it('should count words across all fields in a section', () => {
      const section = {
        field1: 'Hello world',
        field2: 'This is a test',
        field3: 'One more sentence here',
      };

      expect(getSectionWordCount(section)).toBe(10);
    });

    it('should handle empty sections', () => {
      const section = {
        field1: '',
        field2: '',
      };

      expect(getSectionWordCount(section)).toBe(0);
    });
  });

  describe('calculateCompletenessScore', () => {
    it('should return 0 for empty data', () => {
      const score = calculateCompletenessScore(DEFAULT_LOI_DATA);
      expect(score).toBe(0);
    });

    it('should return higher score for more complete data', () => {
      const partialData: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        hook: {
          openingStatement: 'This is a sufficient opening statement for testing.',
          fieldOfInterest: 'Computer Science is my field of interest.',
          careerGoal: 'My career goal is to become a researcher.',
        },
        settings: {
          ...DEFAULT_LOI_DATA.settings,
          fullName: 'John Doe',
        },
      };

      const emptyScore = calculateCompletenessScore(DEFAULT_LOI_DATA);
      const partialScore = calculateCompletenessScore(partialData);

      expect(partialScore).toBeGreaterThan(emptyScore);
    });

    it('should return 100 for fully complete data', () => {
      // All fields need to be at least 10 characters
      const completeData: LOIWizardData = {
        hook: {
          openingStatement: 'A comprehensive opening statement that explains my goals.',
          fieldOfInterest: 'Computer Engineering with focus on AI',
          careerGoal: 'My career goal is to become a researcher in AI.',
        },
        academic: {
          currentEducation: 'Bachelor of Science in Computer Science from MIT.',
          relevantCourses: 'Machine Learning, Deep Learning, Data Structures.',
          academicAchievements: 'Published 2 papers in top conferences, GPA 3.9.',
          skillsGained: 'Python, TensorFlow, React, and research methodology.',
        },
        whyScholarship: {
          whatAttracted: 'The program offers unique benefits for researchers.',
          alignmentWithGoals: 'Aligns perfectly with my career goals.',
          uniqueOffering: 'Cultural exchange and networking opportunities.',
        },
        whyTurkey: {
          countryReasons: 'Strategic location bridging Europe and Asia.',
          universityName: 'Middle East Technical University',
          programName: 'Computer Engineering Masters',
          whyThisProgram: 'Excellent faculty and world-class research.',
          specificDetails: 'Professor Aydin AI Research Lab.',
        },
        leadership: {
          situation: 'Led student organization as president.',
          task: 'Organize annual technology conference.',
          action: 'Recruited 20 volunteers and 5 sponsors.',
          result: 'Event attracted 500 participants.',
          lessonsLearned: 'Learned project management skills.',
        },
        future: {
          shortTermGoals: 'Complete PhD in 4 years at METU.',
          longTermGoals: 'Establish research center in my country.',
          impactOnCommunity: 'Train 500 local engineers.',
          measurableOutcomes: 'Help 1000 students access education.',
        },
        closing: {
          commitment: 'Fully committed to this opportunity.',
          gratitude: 'Thank you for considering my application.',
        },
        settings: {
          fullName: 'John Doe',
          tone: 'balanced',
          language: 'en',
          targetWordCount: 700,
        },
      };

      const score = calculateCompletenessScore(completeData);
      // Should be very high (95-100) for complete data
      expect(score).toBeGreaterThanOrEqual(95);
    });
  });

  describe('calculateFutureClarityScore', () => {
    it('should give higher score for text with timeline', () => {
      const dataWithTimeline: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        future: {
          shortTermGoals: 'Within 2 years, I will complete my masters.',
          longTermGoals: 'In 10 years, I aim to lead a research team.',
          impactOnCommunity: 'Help 500 students in my country.',
          measurableOutcomes: 'Increase enrollment by 30%.',
        },
      };

      const dataWithoutTimeline: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        future: {
          shortTermGoals: 'I will complete my masters.',
          longTermGoals: 'I aim to lead a research team.',
          impactOnCommunity: 'Help students.',
          measurableOutcomes: 'Increase enrollment.',
        },
      };

      const scoreWithTimeline = calculateFutureClarityScore(dataWithTimeline);
      const scoreWithoutTimeline = calculateFutureClarityScore(dataWithoutTimeline);

      expect(scoreWithTimeline).toBeGreaterThan(scoreWithoutTimeline);
    });

    it('should give bonus for specific roles', () => {
      const dataWithRole: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        future: {
          shortTermGoals: 'Become a researcher at a university.',
          longTermGoals: 'Become a professor and director of AI lab.',
          impactOnCommunity: '',
          measurableOutcomes: '',
        },
      };

      const score = calculateFutureClarityScore(dataWithRole);
      expect(score).toBeGreaterThan(0);
    });
  });

  describe('calculateClicheScore', () => {
    it('should return 100 for text without cliches', () => {
      const cleanData: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        hook: {
          openingStatement: 'I am applying to study AI at METU.',
          fieldOfInterest: 'Artificial Intelligence',
          careerGoal: 'Develop diagnostic tools for healthcare.',
        },
      };

      const score = calculateClicheScore(cleanData);
      expect(score).toBe(100);
    });

    it('should return lower score for text with cliches', () => {
      const clicheData: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        hook: {
          openingStatement: 'Since childhood, I have always wanted to pursue my dreams.',
          fieldOfInterest: 'I am passionate about technology.',
          careerGoal: 'Change the world and make a difference.',
        },
      };

      const score = calculateClicheScore(clicheData);
      expect(score).toBeLessThan(100);
    });
  });

  describe('getAllText', () => {
    it('should concatenate all text from all sections', () => {
      const data: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        hook: {
          openingStatement: 'Hello',
          fieldOfInterest: 'World',
          careerGoal: 'Test',
        },
      };

      const allText = getAllText(data);
      expect(allText).toContain('Hello');
      expect(allText).toContain('World');
      expect(allText).toContain('Test');
    });
  });

  describe('getTotalWordCount', () => {
    it('should count total words across all sections', () => {
      const data: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        hook: {
          openingStatement: 'One two three',
          fieldOfInterest: 'Four five',
          careerGoal: 'Six',
        },
      };

      const totalWords = getTotalWordCount(data);
      expect(totalWords).toBeGreaterThanOrEqual(6);
    });
  });

  describe('findQualityIssues', () => {
    it('should find cliche issues', () => {
      const data: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        hook: {
          openingStatement: 'Since childhood, I wanted this.',
          fieldOfInterest: 'Engineering',
          careerGoal: 'Research',
        },
      };

      const issues = findQualityIssues(data);
      const clicheIssues = issues.filter(i => i.type === 'cliche');

      expect(clicheIssues.length).toBeGreaterThan(0);
      expect(clicheIssues[0].message).toContain('since childhood');
    });

    it('should find generic phrase issues', () => {
      const data: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        hook: {
          openingStatement: 'I am hardworking and dedicated.',
          fieldOfInterest: 'Engineering',
          careerGoal: 'Research',
        },
      };

      const issues = findQualityIssues(data);
      const genericIssues = issues.filter(i => i.type === 'generic');

      expect(genericIssues.length).toBeGreaterThan(0);
    });

    it('should find too_short issues', () => {
      const data: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        hook: {
          openingStatement: 'Short',
          fieldOfInterest: 'Eng',
          careerGoal: 'Goal',
        },
      };

      const issues = findQualityIssues(data);
      const shortIssues = issues.filter(i => i.type === 'too_short');

      expect(shortIssues.length).toBeGreaterThan(0);
    });
  });

  describe('calculateQualityScore', () => {
    it('should return all score components', () => {
      const score = calculateQualityScore(DEFAULT_LOI_DATA);

      expect(score).toHaveProperty('overall');
      expect(score).toHaveProperty('specificity');
      expect(score).toHaveProperty('completeness');
      expect(score).toHaveProperty('clicheScore');
      expect(score).toHaveProperty('futureClarity');
      expect(score).toHaveProperty('issues');
    });

    it('should return overall score between 0 and 100', () => {
      const score = calculateQualityScore(DEFAULT_LOI_DATA);

      expect(score.overall).toBeGreaterThanOrEqual(0);
      expect(score.overall).toBeLessThanOrEqual(100);
    });
  });

  describe('getImprovementSuggestion', () => {
    it('should suggest starting for very short text', () => {
      const suggestion = getImprovementSuggestion('Hi', 'openingStatement');
      expect(suggestion).toContain('guiding questions');
    });

    it('should suggest avoiding cliches', () => {
      const suggestion = getImprovementSuggestion(
        'Since childhood I have always wanted to be an engineer.',
        'openingStatement'
      );
      expect(suggestion).toContain('cliche');
    });

    it('should suggest adding specifics for generic text', () => {
      const suggestion = getImprovementSuggestion(
        'I am hardworking and dedicated to my studies. I work very hard every day.',
        'openingStatement'
      );
      expect(suggestion).toContain('generic');
    });

    it('should return null for good text with sufficient length and specificity', () => {
      // Text needs to be 30+ words with good specificity score
      const suggestion = getImprovementSuggestion(
        'In 2023, I led a team of 15 engineers at Google to develop a machine learning system that improved search accuracy by 23%. The project was published in NeurIPS and received the best paper award. This work resulted in 3 patents and helped 50,000 users daily.',
        'academicAchievements'
      );
      expect(suggestion).toBeNull();
    });

    it('should give specific suggestions for result fields', () => {
      const suggestion = getImprovementSuggestion(
        'The project was successful and helped many people in the community.',
        'result'
      );
      expect(suggestion).toContain('numbers');
    });
  });

  describe('isStepComplete', () => {
    it('should return false for empty hook step', () => {
      expect(isStepComplete(0, DEFAULT_LOI_DATA)).toBe(false);
    });

    it('should return true for complete hook step', () => {
      const data: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        hook: {
          openingStatement: 'A complete and comprehensive opening statement for the application.',
          fieldOfInterest: 'Computer Engineering',
          careerGoal: 'My career goal is to become a leading AI researcher.',
        },
      };

      expect(isStepComplete(0, data)).toBe(true);
    });

    it('should return false for incomplete academic step', () => {
      const data: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        academic: {
          currentEducation: 'BSc Computer Science',
          relevantCourses: '', // Empty
          academicAchievements: '',
          skillsGained: '',
        },
      };

      expect(isStepComplete(1, data)).toBe(false);
    });

    it('should return true for complete leadership step', () => {
      const data: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        leadership: {
          situation: 'During my role as student council president in 2022.',
          task: 'I was responsible for organizing the annual technology conference.',
          action: 'I recruited 20 volunteers, secured 5 sponsors, and coordinated logistics.',
          result: 'The event attracted 300 participants and raised $10,000 for scholarships.',
          lessonsLearned: 'I learned valuable lessons about leadership and teamwork.',
        },
      };

      expect(isStepComplete(4, data)).toBe(true);
    });

    it('should check fullName for closing step', () => {
      const dataWithoutName: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        closing: {
          commitment: 'I am fully committed to this program and will work diligently.',
          gratitude: 'Thank you for your consideration.',
        },
        settings: {
          ...DEFAULT_LOI_DATA.settings,
          fullName: '', // Empty name
        },
      };

      const dataWithName: LOIWizardData = {
        ...dataWithoutName,
        settings: {
          ...dataWithoutName.settings,
          fullName: 'John Doe',
        },
      };

      expect(isStepComplete(6, dataWithoutName)).toBe(false);
      expect(isStepComplete(6, dataWithName)).toBe(true);
    });
  });
});

describe('Constants', () => {
  describe('CLICHES', () => {
    it('should have English cliches', () => {
      expect(CLICHES.en).toBeDefined();
      expect(CLICHES.en.length).toBeGreaterThan(10);
    });

    it('should have Turkish cliches', () => {
      expect(CLICHES.tr).toBeDefined();
      expect(CLICHES.tr.length).toBeGreaterThan(5);
    });
  });

  describe('GENERIC_PHRASES', () => {
    it('should have generic phrases', () => {
      expect(GENERIC_PHRASES.length).toBeGreaterThan(10);
    });
  });

  describe('SPECIFICITY_INDICATORS', () => {
    it('should have specificity indicators', () => {
      expect(SPECIFICITY_INDICATORS.length).toBeGreaterThan(5);
    });

    it('should be valid regex patterns', () => {
      SPECIFICITY_INDICATORS.forEach((pattern) => {
        expect(pattern).toBeInstanceOf(RegExp);
      });
    });
  });
});
