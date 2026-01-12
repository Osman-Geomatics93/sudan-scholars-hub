import {
  assembleLetter,
  getLetterWithHighlights,
  getLetterWordCount,
  estimatePageCount,
} from '../letter-assembler';
import { DEFAULT_LOI_DATA } from '../types';
import type { LOIWizardData } from '../types';

describe('Letter Assembler', () => {
  describe('assembleLetter', () => {
    it('should include salutation', () => {
      const letter = assembleLetter(DEFAULT_LOI_DATA);
      expect(letter).toContain('Dear Turkiye Scholarships Selection Committee,');
    });

    it('should include Turkish salutation when language is tr', () => {
      const data: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        settings: {
          ...DEFAULT_LOI_DATA.settings,
          language: 'tr',
        },
      };

      const letter = assembleLetter(data);
      expect(letter).toContain('Sayin Turkiye Burslari Secim Komitesi,');
    });

    it('should include signature with name', () => {
      const data: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        settings: {
          ...DEFAULT_LOI_DATA.settings,
          fullName: 'John Doe',
        },
      };

      const letter = assembleLetter(data);
      expect(letter).toContain('Sincerely,');
      expect(letter).toContain('John Doe');
    });

    it('should use placeholder when name is empty', () => {
      const letter = assembleLetter(DEFAULT_LOI_DATA);
      expect(letter).toContain('[Your Name]');
    });

    it('should include hook paragraph when provided', () => {
      const data: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        hook: {
          openingStatement: 'I am applying to pursue my Master\'s degree in Computer Engineering.',
          fieldOfInterest: 'Artificial Intelligence',
          careerGoal: 'Develop AI-powered diagnostic tools for healthcare.',
        },
      };

      const letter = assembleLetter(data);
      expect(letter).toContain('Computer Engineering');
      expect(letter).toContain('Artificial Intelligence');
    });

    it('should include academic paragraph with transition', () => {
      const data: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        academic: {
          currentEducation: 'I am currently completing my BSc in Computer Science.',
          relevantCourses: 'Machine Learning, Deep Learning, and Data Structures.',
          academicAchievements: 'Graduated with a GPA of 3.9/4.0.',
          skillsGained: 'Python, TensorFlow, and PyTorch.',
        },
      };

      const letter = assembleLetter(data);
      expect(letter).toContain('academic');
      expect(letter).toContain('Computer Science');
    });

    it('should include leadership paragraph using STAR format', () => {
      const data: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        leadership: {
          situation: 'During my role as president of the Engineering Club.',
          task: 'organizing the first inter-university hackathon.',
          action: 'I recruited 20 volunteers and secured corporate sponsors.',
          result: 'the event attracted 150 participants from 8 universities.',
          lessonsLearned: 'leadership requires both vision and attention to detail.',
        },
      };

      const letter = assembleLetter(data);
      expect(letter).toContain('Engineering Club');
      expect(letter).toContain('hackathon');
      expect(letter).toContain('150 participants');
    });

    describe('tone variations', () => {
      it('should use formal transitions when tone is formal', () => {
        const data: LOIWizardData = {
          ...DEFAULT_LOI_DATA,
          academic: {
            currentEducation: 'BSc Computer Science.',
            relevantCourses: 'ML courses.',
            academicAchievements: 'High GPA.',
            skillsGained: 'Programming.',
          },
          settings: {
            ...DEFAULT_LOI_DATA.settings,
            tone: 'formal',
          },
        };

        const letter = assembleLetter(data);
        expect(letter).toContain('thoroughly prepared');
      });

      it('should use balanced transitions when tone is balanced', () => {
        const data: LOIWizardData = {
          ...DEFAULT_LOI_DATA,
          academic: {
            currentEducation: 'BSc Computer Science.',
            relevantCourses: 'ML courses.',
            academicAchievements: 'High GPA.',
            skillsGained: 'Programming.',
          },
          settings: {
            ...DEFAULT_LOI_DATA.settings,
            tone: 'balanced',
          },
        };

        const letter = assembleLetter(data);
        expect(letter).toContain('prepared me well');
      });

      it('should use personal transitions when tone is personal', () => {
        const data: LOIWizardData = {
          ...DEFAULT_LOI_DATA,
          academic: {
            currentEducation: 'BSc Computer Science.',
            relevantCourses: 'ML courses.',
            academicAchievements: 'High GPA.',
            skillsGained: 'Programming.',
          },
          settings: {
            ...DEFAULT_LOI_DATA.settings,
            tone: 'personal',
          },
        };

        const letter = assembleLetter(data);
        expect(letter).toContain('transformative');
      });
    });

    it('should assemble complete letter with all sections', () => {
      const completeData: LOIWizardData = {
        hook: {
          openingStatement: 'I am applying to pursue a Master\'s in AI.',
          fieldOfInterest: 'Artificial Intelligence',
          careerGoal: 'Develop healthcare AI solutions.',
        },
        academic: {
          currentEducation: 'BSc Computer Science from MIT.',
          relevantCourses: 'Machine Learning, Deep Learning.',
          academicAchievements: 'Published 2 papers in top conferences.',
          skillsGained: 'Python, TensorFlow, research methodology.',
        },
        whyScholarship: {
          whatAttracted: 'The comprehensive support system.',
          alignmentWithGoals: 'Perfect fit for my career objectives.',
          uniqueOffering: 'Cultural exchange opportunities.',
        },
        whyTurkey: {
          countryReasons: 'Strategic location bridging Europe and Asia.',
          universityName: 'Middle East Technical University',
          programName: 'Computer Engineering',
          whyThisProgram: 'World-renowned AI research group.',
          specificDetails: 'Professor Aydin\'s neural networks lab.',
        },
        leadership: {
          situation: 'Led the university AI club.',
          task: 'Organizing workshops for 200 students.',
          action: 'Partnered with 5 tech companies.',
          result: 'Increased membership by 300%.',
          lessonsLearned: 'Stakeholder management skills.',
        },
        future: {
          shortTermGoals: 'Complete PhD in 4 years.',
          longTermGoals: 'Establish an AI research center.',
          impactOnCommunity: 'Train 500 engineers in my country.',
          measurableOutcomes: 'Publish 10 papers and 3 patents.',
        },
        closing: {
          commitment: 'I am fully committed to this opportunity.',
          gratitude: 'Thank you for considering my application.',
        },
        settings: {
          fullName: 'Ahmed Ibrahim',
          tone: 'balanced',
          language: 'en',
          targetWordCount: 700,
        },
      };

      const letter = assembleLetter(completeData);

      // Check all sections are present
      expect(letter).toContain('Dear Turkiye Scholarships');
      expect(letter).toContain('Master\'s in AI');
      expect(letter).toContain('MIT');
      expect(letter).toContain('Middle East Technical University');
      expect(letter).toContain('AI club');
      expect(letter).toContain('PhD');
      expect(letter).toContain('committed');
      expect(letter).toContain('Ahmed Ibrahim');
    });

    it('should handle empty sections gracefully', () => {
      const letter = assembleLetter(DEFAULT_LOI_DATA);

      // Should still have structure even if empty
      expect(letter).toContain('Dear');
      expect(letter).toContain('Sincerely');
    });
  });

  describe('getLetterWithHighlights', () => {
    it('should return letter and missing steps', () => {
      const result = getLetterWithHighlights(DEFAULT_LOI_DATA);

      expect(result).toHaveProperty('letter');
      expect(result).toHaveProperty('missingSteps');
    });

    it('should identify all missing steps for empty data', () => {
      const result = getLetterWithHighlights(DEFAULT_LOI_DATA);

      expect(result.missingSteps).toContain('Hook');
      expect(result.missingSteps).toContain('Academic');
      expect(result.missingSteps).toContain('Why Scholarship');
      expect(result.missingSteps).toContain('Why Turkey');
      expect(result.missingSteps).toContain('Leadership');
      expect(result.missingSteps).toContain('Future Plan');
      expect(result.missingSteps).toContain('Closing');
    });

    it('should not include completed steps in missing list', () => {
      const data: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        hook: {
          openingStatement: 'Complete opening statement.',
          fieldOfInterest: 'Engineering',
          careerGoal: 'Research',
        },
        academic: {
          currentEducation: 'BSc completed.',
          relevantCourses: 'Many courses.',
          academicAchievements: 'High GPA.',
          skillsGained: 'Many skills.',
        },
      };

      const result = getLetterWithHighlights(data);

      expect(result.missingSteps).not.toContain('Hook');
      expect(result.missingSteps).not.toContain('Academic');
      expect(result.missingSteps).toContain('Why Scholarship');
    });

    it('should return empty missing steps for complete data', () => {
      const completeData: LOIWizardData = {
        hook: {
          openingStatement: 'Complete opening.',
          fieldOfInterest: 'Engineering',
          careerGoal: 'Research',
        },
        academic: {
          currentEducation: 'BSc.',
          relevantCourses: 'Courses.',
          academicAchievements: 'Achievements.',
          skillsGained: 'Skills.',
        },
        whyScholarship: {
          whatAttracted: 'Attracted.',
          alignmentWithGoals: 'Aligned.',
          uniqueOffering: 'Unique.',
        },
        whyTurkey: {
          countryReasons: 'Reasons.',
          universityName: 'METU',
          programName: 'CE',
          whyThisProgram: 'Why.',
          specificDetails: 'Details.',
        },
        leadership: {
          situation: 'Situation.',
          task: 'Task.',
          action: 'Action.',
          result: 'Result.',
          lessonsLearned: 'Lessons.',
        },
        future: {
          shortTermGoals: 'Short.',
          longTermGoals: 'Long.',
          impactOnCommunity: 'Impact.',
          measurableOutcomes: 'Outcomes.',
        },
        closing: {
          commitment: 'Commitment.',
          gratitude: 'Gratitude.',
        },
        settings: {
          fullName: 'John Doe',
          tone: 'balanced',
          language: 'en',
          targetWordCount: 700,
        },
      };

      const result = getLetterWithHighlights(completeData);
      expect(result.missingSteps).toHaveLength(0);
    });
  });

  describe('getLetterWordCount', () => {
    it('should count words in assembled letter', () => {
      const data: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        hook: {
          openingStatement: 'This is a test opening statement with several words.',
          fieldOfInterest: 'Engineering',
          careerGoal: 'Research',
        },
      };

      const wordCount = getLetterWordCount(data);
      expect(wordCount).toBeGreaterThan(10);
    });

    it('should return low count for empty data', () => {
      const wordCount = getLetterWordCount(DEFAULT_LOI_DATA);
      // Should only have salutation and signature
      expect(wordCount).toBeLessThan(50);
    });
  });

  describe('estimatePageCount', () => {
    it('should estimate 1 page for short letters', () => {
      const pages = estimatePageCount(DEFAULT_LOI_DATA);
      expect(pages).toBe(1);
    });

    it('should estimate more pages for longer content', () => {
      // Create data with lots of content
      const longData: LOIWizardData = {
        hook: {
          openingStatement: Array(50).fill('word').join(' '),
          fieldOfInterest: Array(30).fill('word').join(' '),
          careerGoal: Array(30).fill('word').join(' '),
        },
        academic: {
          currentEducation: Array(50).fill('word').join(' '),
          relevantCourses: Array(50).fill('word').join(' '),
          academicAchievements: Array(50).fill('word').join(' '),
          skillsGained: Array(50).fill('word').join(' '),
        },
        whyScholarship: {
          whatAttracted: Array(50).fill('word').join(' '),
          alignmentWithGoals: Array(50).fill('word').join(' '),
          uniqueOffering: Array(30).fill('word').join(' '),
        },
        whyTurkey: {
          countryReasons: Array(50).fill('word').join(' '),
          universityName: 'University',
          programName: 'Program',
          whyThisProgram: Array(50).fill('word').join(' '),
          specificDetails: Array(30).fill('word').join(' '),
        },
        leadership: {
          situation: Array(50).fill('word').join(' '),
          task: Array(30).fill('word').join(' '),
          action: Array(50).fill('word').join(' '),
          result: Array(30).fill('word').join(' '),
          lessonsLearned: Array(20).fill('word').join(' '),
        },
        future: {
          shortTermGoals: Array(50).fill('word').join(' '),
          longTermGoals: Array(50).fill('word').join(' '),
          impactOnCommunity: Array(30).fill('word').join(' '),
          measurableOutcomes: Array(30).fill('word').join(' '),
        },
        closing: {
          commitment: Array(30).fill('word').join(' '),
          gratitude: Array(20).fill('word').join(' '),
        },
        settings: {
          fullName: 'John Doe',
          tone: 'balanced',
          language: 'en',
          targetWordCount: 700,
        },
      };

      const pages = estimatePageCount(longData);
      expect(pages).toBeGreaterThanOrEqual(3);
    });
  });
});
