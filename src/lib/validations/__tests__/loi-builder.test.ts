import {
  hookSchema,
  academicSchema,
  whyScholarshipSchema,
  whyTurkeySchema,
  leadershipSchema,
  futureSchema,
  closingSchema,
  settingsSchema,
  loiCompleteSchema,
  hookPartialSchema,
  academicPartialSchema,
  whyScholarshipPartialSchema,
  whyTurkeyPartialSchema,
  leadershipPartialSchema,
  futurePartialSchema,
  closingPartialSchema,
} from '../loi-builder';

describe('LOI Builder Validation Schemas', () => {
  describe('hookSchema', () => {
    it('should validate a correct hook', () => {
      const validHook = {
        openingStatement: 'This is a comprehensive opening statement that explains my goals and aspirations for pursuing higher education.',
        fieldOfInterest: 'Computer Engineering',
        careerGoal: 'To become a leading AI researcher in healthcare technology.',
      };

      const result = hookSchema.safeParse(validHook);
      expect(result.success).toBe(true);
    });

    it('should reject opening statement that is too short', () => {
      const invalidHook = {
        openingStatement: 'Too short',
        fieldOfInterest: 'Computer Engineering',
        careerGoal: 'To become a researcher.',
      };

      const result = hookSchema.safeParse(invalidHook);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('openingStatement');
      }
    });

    it('should reject opening statement that exceeds max length', () => {
      const invalidHook = {
        openingStatement: 'A'.repeat(501),
        fieldOfInterest: 'Computer Engineering',
        careerGoal: 'To become a researcher.',
      };

      const result = hookSchema.safeParse(invalidHook);
      expect(result.success).toBe(false);
    });

    it('should reject empty field of interest', () => {
      const invalidHook = {
        openingStatement: 'This is a comprehensive opening statement that explains my goals and aspirations.',
        fieldOfInterest: '',
        careerGoal: 'To become a researcher.',
      };

      const result = hookSchema.safeParse(invalidHook);
      expect(result.success).toBe(false);
    });
  });

  describe('academicSchema', () => {
    it('should validate correct academic data', () => {
      const validAcademic = {
        currentEducation: 'I am completing my BSc in Computer Science at MIT with a 3.9 GPA.',
        relevantCourses: 'Machine Learning, Deep Learning, Data Structures, and Algorithms.',
        academicAchievements: 'Published 2 papers in top conferences, won best thesis award, and led research group.',
        skillsGained: 'Python, TensorFlow, PyTorch, and research methodology skills.',
      };

      const result = academicSchema.safeParse(validAcademic);
      expect(result.success).toBe(true);
    });

    it('should reject short current education', () => {
      const invalid = {
        currentEducation: 'BSc CS',
        relevantCourses: 'Machine Learning courses.',
        academicAchievements: 'Won several awards in my academic career.',
        skillsGained: 'Programming and research.',
      };

      const result = academicSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('whyScholarshipSchema', () => {
    it('should validate correct scholarship reasons', () => {
      const valid = {
        whatAttracted: 'The comprehensive support system and cultural exchange opportunities attracted me.',
        alignmentWithGoals: 'The program aligns with my career goals of international collaboration.',
        uniqueOffering: 'The unique Turkish language training.',
      };

      const result = whyScholarshipSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject short whatAttracted field', () => {
      const invalid = {
        whatAttracted: 'Great program',
        alignmentWithGoals: 'Aligns with my goals perfectly.',
        uniqueOffering: 'Turkish language.',
      };

      const result = whyScholarshipSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('whyTurkeySchema', () => {
    it('should validate correct Turkey reasons', () => {
      const valid = {
        countryReasons: 'Turkey bridges Europe and Asia, offering unique cultural exposure.',
        universityName: 'Middle East Technical University',
        programName: 'Computer Engineering',
        whyThisProgram: 'The program has world-renowned faculty in AI research.',
        specificDetails: 'Professor Aydin AI Research Lab.',
      };

      const result = whyTurkeySchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject short university name', () => {
      const invalid = {
        countryReasons: 'Turkey bridges Europe and Asia offering unique exposure.',
        universityName: 'MU',
        programName: 'CE',
        whyThisProgram: 'The program has great faculty and research.',
        specificDetails: 'Good labs and facilities.',
      };

      const result = whyTurkeySchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('leadershipSchema', () => {
    it('should validate correct STAR format', () => {
      const valid = {
        situation: 'During my role as president of the Engineering Club in 2022.',
        task: 'Organize the annual technology conference.',
        action: 'I recruited 20 volunteers, secured 5 corporate sponsors, and coordinated all logistics.',
        result: 'Event attracted 300 participants.',
        lessonsLearned: 'Learned project management.',
      };

      const result = leadershipSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject short situation description', () => {
      const invalid = {
        situation: 'President 2022',
        task: 'Organized conference.',
        action: 'Recruited volunteers.',
        result: 'Successful event.',
        lessonsLearned: 'Learned a lot.',
      };

      const result = leadershipSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('futureSchema', () => {
    it('should validate correct future plans', () => {
      const valid = {
        shortTermGoals: 'Complete my PhD within 4 years with a focus on AI.',
        longTermGoals: 'Establish an AI research center in my home country.',
        impactOnCommunity: 'Train 500 local engineers in modern technology.',
        measurableOutcomes: 'Publish 10 papers and 3 patents.',
      };

      const result = futureSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject short goals', () => {
      const invalid = {
        shortTermGoals: 'Finish PhD',
        longTermGoals: 'Start a lab',
        impactOnCommunity: 'Help people',
        measurableOutcomes: 'Publish papers',
      };

      const result = futureSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('closingSchema', () => {
    it('should validate correct closing', () => {
      const valid = {
        commitment: 'I am fully committed to this opportunity and will work diligently.',
        gratitude: 'Thank you for considering my application.',
      };

      const result = closingSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject short commitment', () => {
      const invalid = {
        commitment: 'Committed',
        gratitude: 'Thanks.',
      };

      const result = closingSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('settingsSchema', () => {
    it('should validate correct settings', () => {
      const valid = {
        fullName: 'John Doe',
        tone: 'balanced' as const,
        language: 'en' as const,
        targetWordCount: 700,
      };

      const result = settingsSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject invalid tone', () => {
      const invalid = {
        fullName: 'John Doe',
        tone: 'casual',
        language: 'en',
        targetWordCount: 700,
      };

      const result = settingsSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject invalid language', () => {
      const invalid = {
        fullName: 'John Doe',
        tone: 'balanced',
        language: 'fr',
        targetWordCount: 700,
      };

      const result = settingsSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject word count below minimum', () => {
      const invalid = {
        fullName: 'John Doe',
        tone: 'balanced',
        language: 'en',
        targetWordCount: 200,
      };

      const result = settingsSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject word count above maximum', () => {
      const invalid = {
        fullName: 'John Doe',
        tone: 'balanced',
        language: 'en',
        targetWordCount: 1500,
      };

      const result = settingsSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('loiCompleteSchema', () => {
    it('should validate a complete LOI', () => {
      const complete = {
        hook: {
          openingStatement: 'This is a comprehensive opening statement that explains my goals and aspirations for pursuing higher education.',
          fieldOfInterest: 'Computer Engineering',
          careerGoal: 'To become a leading AI researcher in healthcare technology.',
        },
        academic: {
          currentEducation: 'I am completing my BSc in Computer Science at MIT with a 3.9 GPA.',
          relevantCourses: 'Machine Learning, Deep Learning, Data Structures, and Algorithms.',
          academicAchievements: 'Published 2 papers in top conferences, won best thesis award, and led research group.',
          skillsGained: 'Python, TensorFlow, PyTorch, and research methodology skills.',
        },
        whyScholarship: {
          whatAttracted: 'The comprehensive support system and cultural exchange opportunities attracted me.',
          alignmentWithGoals: 'The program aligns with my career goals of international collaboration.',
          uniqueOffering: 'The unique Turkish language training.',
        },
        whyTurkey: {
          countryReasons: 'Turkey bridges Europe and Asia, offering unique cultural exposure.',
          universityName: 'Middle East Technical University',
          programName: 'Computer Engineering',
          whyThisProgram: 'The program has world-renowned faculty in AI research.',
          specificDetails: 'Professor Aydin AI Research Lab.',
        },
        leadership: {
          situation: 'During my role as president of the Engineering Club in 2022.',
          task: 'Organize the annual technology conference.',
          action: 'I recruited 20 volunteers, secured 5 corporate sponsors, and coordinated all logistics.',
          result: 'Event attracted 300 participants.',
          lessonsLearned: 'Learned project management.',
        },
        future: {
          shortTermGoals: 'Complete my PhD within 4 years with a focus on AI.',
          longTermGoals: 'Establish an AI research center in my home country.',
          impactOnCommunity: 'Train 500 local engineers in modern technology.',
          measurableOutcomes: 'Publish 10 papers and 3 patents.',
        },
        closing: {
          commitment: 'I am fully committed to this opportunity and will work diligently.',
          gratitude: 'Thank you for considering my application.',
        },
        settings: {
          fullName: 'John Doe',
          tone: 'balanced' as const,
          language: 'en' as const,
          targetWordCount: 700,
        },
      };

      const result = loiCompleteSchema.safeParse(complete);
      expect(result.success).toBe(true);
    });

    it('should reject incomplete LOI', () => {
      const incomplete = {
        hook: {
          openingStatement: 'Short',
          fieldOfInterest: '',
          careerGoal: '',
        },
        // Missing other sections
      };

      const result = loiCompleteSchema.safeParse(incomplete);
      expect(result.success).toBe(false);
    });
  });

  describe('Partial Schemas', () => {
    describe('hookPartialSchema', () => {
      it('should allow empty strings', () => {
        const partial = {
          openingStatement: '',
          fieldOfInterest: '',
          careerGoal: '',
        };

        const result = hookPartialSchema.safeParse(partial);
        expect(result.success).toBe(true);
      });

      it('should enforce max length', () => {
        const partial = {
          openingStatement: 'A'.repeat(501),
          fieldOfInterest: '',
          careerGoal: '',
        };

        const result = hookPartialSchema.safeParse(partial);
        expect(result.success).toBe(false);
      });
    });

    describe('academicPartialSchema', () => {
      it('should allow empty strings', () => {
        const partial = {
          currentEducation: '',
          relevantCourses: '',
          academicAchievements: '',
          skillsGained: '',
        };

        const result = academicPartialSchema.safeParse(partial);
        expect(result.success).toBe(true);
      });
    });

    describe('whyScholarshipPartialSchema', () => {
      it('should allow partial input', () => {
        const partial = {
          whatAttracted: 'Some text',
          alignmentWithGoals: '',
          uniqueOffering: '',
        };

        const result = whyScholarshipPartialSchema.safeParse(partial);
        expect(result.success).toBe(true);
      });
    });

    describe('whyTurkeyPartialSchema', () => {
      it('should allow partial input', () => {
        const partial = {
          countryReasons: '',
          universityName: 'METU',
          programName: '',
          whyThisProgram: '',
          specificDetails: '',
        };

        const result = whyTurkeyPartialSchema.safeParse(partial);
        expect(result.success).toBe(true);
      });
    });

    describe('leadershipPartialSchema', () => {
      it('should allow empty STAR format', () => {
        const partial = {
          situation: '',
          task: '',
          action: '',
          result: '',
          lessonsLearned: '',
        };

        const result = leadershipPartialSchema.safeParse(partial);
        expect(result.success).toBe(true);
      });
    });

    describe('futurePartialSchema', () => {
      it('should allow empty goals', () => {
        const partial = {
          shortTermGoals: '',
          longTermGoals: '',
          impactOnCommunity: '',
          measurableOutcomes: '',
        };

        const result = futurePartialSchema.safeParse(partial);
        expect(result.success).toBe(true);
      });
    });

    describe('closingPartialSchema', () => {
      it('should allow empty closing', () => {
        const partial = {
          commitment: '',
          gratitude: '',
        };

        const result = closingPartialSchema.safeParse(partial);
        expect(result.success).toBe(true);
      });

      it('should enforce max length', () => {
        const partial = {
          commitment: 'A'.repeat(251),
          gratitude: '',
        };

        const result = closingPartialSchema.safeParse(partial);
        expect(result.success).toBe(false);
      });
    });
  });
});
