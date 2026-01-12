import { STEPS, DEFAULT_LOI_DATA } from '@/lib/loi-builder/types';
import { isStepComplete } from '@/lib/loi-builder/quality-rules';
import type { LOIWizardData } from '@/lib/loi-builder/types';

// Test step configuration and completion logic used by WizardStepTabs
// Component integration tests require complex mocking of hooks

describe('WizardStepTabs Configuration', () => {
  describe('STEPS configuration', () => {
    it('should have exactly 7 steps', () => {
      expect(STEPS).toHaveLength(7);
    });

    it('should have correct step IDs in order', () => {
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
      const expectedLabels = [
        'Hook',
        'Academic',
        'Why Scholarship',
        'Why Turkey',
        'Leadership',
        'Future Plan',
        'Closing',
      ];

      STEPS.forEach((step, index) => {
        expect(step.label.en).toBe(expectedLabels[index]);
      });
    });

    it('should have Arabic labels for all steps', () => {
      const expectedLabels = [
        'المقدمة',
        'الأكاديمي',
        'لماذا المنحة',
        'لماذا تركيا',
        'القيادة',
        'الخطة المستقبلية',
        'الختام',
      ];

      STEPS.forEach((step, index) => {
        expect(step.label.ar).toBe(expectedLabels[index]);
      });
    });
  });

  describe('Step completion logic', () => {
    it('should mark empty hook as incomplete', () => {
      expect(isStepComplete(0, DEFAULT_LOI_DATA)).toBe(false);
    });

    it('should mark filled hook as complete', () => {
      const data: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        hook: {
          openingStatement: 'A comprehensive opening statement that explains my goals.',
          fieldOfInterest: 'Computer Engineering',
          careerGoal: 'My career goal is to become a researcher.',
        },
      };

      expect(isStepComplete(0, data)).toBe(true);
    });

    it('should mark empty academic as incomplete', () => {
      expect(isStepComplete(1, DEFAULT_LOI_DATA)).toBe(false);
    });

    it('should mark filled academic as complete', () => {
      const data: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        academic: {
          currentEducation: 'Bachelor of Science in Computer Science from MIT.',
          relevantCourses: 'Machine Learning, Deep Learning, Data Structures.',
          academicAchievements: 'Published 2 papers in top conferences, GPA 3.9.',
          skillsGained: 'Python, TensorFlow, React.',
        },
      };

      expect(isStepComplete(1, data)).toBe(true);
    });

    it('should check all leadership STAR fields', () => {
      const incompleteData: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        leadership: {
          situation: 'Led student organization.',
          task: '', // Empty
          action: 'Organized events.',
          result: 'Success.',
          lessonsLearned: '',
        },
      };

      expect(isStepComplete(4, incompleteData)).toBe(false);

      const completeData: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        leadership: {
          situation: 'During my role as student council president in 2022.',
          task: 'I was responsible for organizing the annual conference.',
          action: 'I recruited volunteers and secured sponsors.',
          result: 'The event attracted 300 participants.',
          lessonsLearned: 'I learned valuable leadership skills.',
        },
      };

      expect(isStepComplete(4, completeData)).toBe(true);
    });

    it('should require fullName for closing step', () => {
      const noNameData: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        closing: {
          commitment: 'I am fully committed to this program.',
          gratitude: 'Thank you.',
        },
        settings: {
          ...DEFAULT_LOI_DATA.settings,
          fullName: '',
        },
      };

      expect(isStepComplete(6, noNameData)).toBe(false);

      const withNameData: LOIWizardData = {
        ...noNameData,
        settings: {
          ...noNameData.settings,
          fullName: 'John Doe',
        },
      };

      expect(isStepComplete(6, withNameData)).toBe(true);
    });
  });

  describe('Step navigation bounds', () => {
    it('should have valid step indices', () => {
      expect(STEPS.length).toBe(7);
      expect(STEPS[0]).toBeDefined();
      expect(STEPS[6]).toBeDefined();
    });

    it('first step should be hook', () => {
      expect(STEPS[0].id).toBe('hook');
    });

    it('last step should be closing', () => {
      expect(STEPS[6].id).toBe('closing');
    });
  });
});
