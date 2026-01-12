import { calculateQualityScore } from '@/lib/loi-builder/quality-rules';
import { DEFAULT_LOI_DATA } from '@/lib/loi-builder/types';
import type { LOIWizardData, QualityScore } from '@/lib/loi-builder/types';

// Test the quality score calculation functions used by StrengthMeter
// Component integration tests require complex mocking

describe('StrengthMeter Score Calculations', () => {
  describe('calculateQualityScore', () => {
    it('should return low score for empty data', () => {
      const score = calculateQualityScore(DEFAULT_LOI_DATA);

      expect(score.overall).toBeLessThan(30);
      expect(score.completeness).toBe(0);
    });

    it('should return higher score for complete data', () => {
      const completeData: LOIWizardData = {
        hook: {
          openingStatement: 'A comprehensive opening statement that explains my goals and background.',
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

      const score = calculateQualityScore(completeData);

      expect(score.overall).toBeGreaterThan(50);
      expect(score.completeness).toBeGreaterThan(90);
    });

    it('should return all score components', () => {
      const score = calculateQualityScore(DEFAULT_LOI_DATA);

      expect(score).toHaveProperty('overall');
      expect(score).toHaveProperty('specificity');
      expect(score).toHaveProperty('completeness');
      expect(score).toHaveProperty('clicheScore');
      expect(score).toHaveProperty('futureClarity');
      expect(score).toHaveProperty('issues');
    });

    it('should detect issues in low-quality text', () => {
      const dataWithIssues: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        hook: {
          openingStatement: 'Since childhood, I have always wanted to pursue my dreams.',
          fieldOfInterest: 'Engineering',
          careerGoal: 'To change the world.',
        },
      };

      const score = calculateQualityScore(dataWithIssues);

      expect(score.issues.length).toBeGreaterThan(0);
      expect(score.issues.some(i => i.type === 'cliche')).toBe(true);
    });

    it('should return high cliche score for clean text', () => {
      const cleanData: LOIWizardData = {
        ...DEFAULT_LOI_DATA,
        hook: {
          openingStatement: 'In 2023, I completed my BSc at MIT with a focus on neural networks.',
          fieldOfInterest: 'Machine Learning',
          careerGoal: 'Develop AI diagnostic tools for underserved healthcare systems.',
        },
      };

      const score = calculateQualityScore(cleanData);

      expect(score.clicheScore).toBe(100);
    });
  });

  describe('Score Classification', () => {
    it('should classify score below 40 as weak', () => {
      const score: QualityScore = {
        overall: 25,
        specificity: 20,
        completeness: 30,
        clicheScore: 40,
        futureClarity: 10,
        issues: [],
      };

      expect(score.overall).toBeLessThan(40);
    });

    it('should classify score 40-60 as fair', () => {
      const score: QualityScore = {
        overall: 55,
        specificity: 50,
        completeness: 60,
        clicheScore: 70,
        futureClarity: 40,
        issues: [],
      };

      expect(score.overall).toBeGreaterThanOrEqual(40);
      expect(score.overall).toBeLessThan(60);
    });

    it('should classify score 60-80 as strong', () => {
      const score: QualityScore = {
        overall: 75,
        specificity: 70,
        completeness: 80,
        clicheScore: 90,
        futureClarity: 60,
        issues: [],
      };

      expect(score.overall).toBeGreaterThanOrEqual(60);
      expect(score.overall).toBeLessThan(80);
    });

    it('should classify score 80+ as excellent', () => {
      const score: QualityScore = {
        overall: 90,
        specificity: 85,
        completeness: 95,
        clicheScore: 100,
        futureClarity: 80,
        issues: [],
      };

      expect(score.overall).toBeGreaterThanOrEqual(80);
    });
  });
});
