import {
  STEPS,
  DEFAULT_LOI_DATA,
} from '../types';
import type { LOIWizardData, StepConfig, QualityScore } from '../types';

describe('LOI Builder Types', () => {
  describe('STEPS', () => {
    it('should have exactly 7 steps', () => {
      expect(STEPS).toHaveLength(7);
    });

    it('should have correct step IDs', () => {
      const expectedIds = [
        'hook',
        'academic',
        'why-scholarship',
        'why-turkey',
        'leadership',
        'future',
        'closing',
      ];

      STEPS.forEach((step, index) => {
        expect(step.id).toBe(expectedIds[index]);
      });
    });

    it('should have English labels for all steps', () => {
      STEPS.forEach((step) => {
        expect(step.label.en).toBeDefined();
        expect(step.label.en.length).toBeGreaterThan(0);
      });
    });

    it('should have Arabic labels for all steps', () => {
      STEPS.forEach((step) => {
        expect(step.label.ar).toBeDefined();
        expect(step.label.ar.length).toBeGreaterThan(0);
      });
    });

    it('should have correct step structure', () => {
      const hookStep = STEPS[0];
      expect(hookStep).toEqual({
        id: 'hook',
        label: { en: 'Hook', ar: 'المقدمة' },
      });
    });
  });

  describe('DEFAULT_LOI_DATA', () => {
    it('should have all required sections', () => {
      expect(DEFAULT_LOI_DATA).toHaveProperty('hook');
      expect(DEFAULT_LOI_DATA).toHaveProperty('academic');
      expect(DEFAULT_LOI_DATA).toHaveProperty('whyScholarship');
      expect(DEFAULT_LOI_DATA).toHaveProperty('whyTurkey');
      expect(DEFAULT_LOI_DATA).toHaveProperty('leadership');
      expect(DEFAULT_LOI_DATA).toHaveProperty('future');
      expect(DEFAULT_LOI_DATA).toHaveProperty('closing');
      expect(DEFAULT_LOI_DATA).toHaveProperty('settings');
    });

    it('should have empty strings for all text fields', () => {
      expect(DEFAULT_LOI_DATA.hook.openingStatement).toBe('');
      expect(DEFAULT_LOI_DATA.hook.fieldOfInterest).toBe('');
      expect(DEFAULT_LOI_DATA.hook.careerGoal).toBe('');
      expect(DEFAULT_LOI_DATA.academic.currentEducation).toBe('');
      expect(DEFAULT_LOI_DATA.leadership.situation).toBe('');
    });

    it('should have default settings', () => {
      expect(DEFAULT_LOI_DATA.settings.fullName).toBe('');
      expect(DEFAULT_LOI_DATA.settings.tone).toBe('balanced');
      expect(DEFAULT_LOI_DATA.settings.language).toBe('en');
      expect(DEFAULT_LOI_DATA.settings.targetWordCount).toBe(700);
    });

    it('should have hook section with correct fields', () => {
      expect(DEFAULT_LOI_DATA.hook).toHaveProperty('openingStatement');
      expect(DEFAULT_LOI_DATA.hook).toHaveProperty('fieldOfInterest');
      expect(DEFAULT_LOI_DATA.hook).toHaveProperty('careerGoal');
    });

    it('should have academic section with correct fields', () => {
      expect(DEFAULT_LOI_DATA.academic).toHaveProperty('currentEducation');
      expect(DEFAULT_LOI_DATA.academic).toHaveProperty('relevantCourses');
      expect(DEFAULT_LOI_DATA.academic).toHaveProperty('academicAchievements');
      expect(DEFAULT_LOI_DATA.academic).toHaveProperty('skillsGained');
    });

    it('should have leadership section with STAR fields', () => {
      expect(DEFAULT_LOI_DATA.leadership).toHaveProperty('situation');
      expect(DEFAULT_LOI_DATA.leadership).toHaveProperty('task');
      expect(DEFAULT_LOI_DATA.leadership).toHaveProperty('action');
      expect(DEFAULT_LOI_DATA.leadership).toHaveProperty('result');
      expect(DEFAULT_LOI_DATA.leadership).toHaveProperty('lessonsLearned');
    });

    it('should have future section with correct fields', () => {
      expect(DEFAULT_LOI_DATA.future).toHaveProperty('shortTermGoals');
      expect(DEFAULT_LOI_DATA.future).toHaveProperty('longTermGoals');
      expect(DEFAULT_LOI_DATA.future).toHaveProperty('impactOnCommunity');
      expect(DEFAULT_LOI_DATA.future).toHaveProperty('measurableOutcomes');
    });
  });


  describe('Type Structures', () => {
    it('should create valid LOIWizardData', () => {
      const data: LOIWizardData = {
        hook: {
          openingStatement: 'Test',
          fieldOfInterest: 'Engineering',
          careerGoal: 'Research',
        },
        academic: {
          currentEducation: 'BSc',
          relevantCourses: 'ML',
          academicAchievements: 'GPA 4.0',
          skillsGained: 'Python',
        },
        whyScholarship: {
          whatAttracted: 'Support',
          alignmentWithGoals: 'Aligned',
          uniqueOffering: 'Unique',
        },
        whyTurkey: {
          countryReasons: 'Strategic',
          universityName: 'METU',
          programName: 'CE',
          whyThisProgram: 'Faculty',
          specificDetails: 'Labs',
        },
        leadership: {
          situation: 'Club',
          task: 'Lead',
          action: 'Organized',
          result: 'Success',
          lessonsLearned: 'Growth',
        },
        future: {
          shortTermGoals: 'PhD',
          longTermGoals: 'Professor',
          impactOnCommunity: 'Teach',
          measurableOutcomes: 'Papers',
        },
        closing: {
          commitment: 'Committed',
          gratitude: 'Thank you',
        },
        settings: {
          fullName: 'John Doe',
          tone: 'balanced',
          language: 'en',
          targetWordCount: 700,
        },
      };

      expect(data).toBeDefined();
      expect(data.hook.openingStatement).toBe('Test');
      expect(data.settings.tone).toBe('balanced');
    });

    it('should create valid QualityScore', () => {
      const score: QualityScore = {
        overall: 75,
        specificity: 70,
        completeness: 80,
        clicheScore: 90,
        futureClarity: 65,
        issues: [
          {
            step: 0,
            field: 'openingStatement',
            type: 'cliche',
            message: 'Cliche detected',
            suggestion: 'Be more specific',
          },
        ],
      };

      expect(score.overall).toBe(75);
      expect(score.issues).toHaveLength(1);
      expect(score.issues[0].type).toBe('cliche');
    });

    it('should create valid StepConfig', () => {
      const step: StepConfig = {
        id: 'test-step',
        label: {
          en: 'Test Step',
          ar: 'خطوة اختبار',
        },
      };

      expect(step.id).toBe('test-step');
      expect(step.label.en).toBe('Test Step');
      expect(step.label.ar).toBe('خطوة اختبار');
    });
  });
});
