import {
  detectCliches,
  detectGenericPhrases,
  getImprovementSuggestion,
} from '@/lib/loi-builder/quality-rules';

// Test the quality rules functions used by QualityHint component
// Component integration tests would require mocking too many dependencies

describe('QualityHint Functions', () => {
  describe('detectCliches', () => {
    it('should detect English cliches', () => {
      const text = 'Since childhood, I have always wanted to become an engineer.';
      const cliches = detectCliches(text, 'en');

      expect(cliches).toContain('since childhood');
      expect(cliches).toContain('always wanted');
    });

    it('should not detect cliches in clean text', () => {
      const text = 'In 2023, I led a team of engineers to develop a system.';
      const cliches = detectCliches(text, 'en');

      expect(cliches).toHaveLength(0);
    });
  });

  describe('detectGenericPhrases', () => {
    it('should detect generic phrases', () => {
      const text = 'I am hardworking and dedicated to my studies.';
      const generic = detectGenericPhrases(text);

      expect(generic).toContain('i am hardworking');
    });

    it('should not detect generic phrases in specific text', () => {
      const text = 'I developed 5 projects and led 15 engineers.';
      const generic = detectGenericPhrases(text);

      expect(generic).toHaveLength(0);
    });
  });

  describe('getImprovementSuggestion', () => {
    it('should suggest avoiding cliches', () => {
      const suggestion = getImprovementSuggestion(
        'Since childhood I have always wanted to become an engineer and follow my passion.',
        'openingStatement'
      );
      expect(suggestion).toContain('cliche');
    });

    it('should suggest more specifics for generic text', () => {
      const suggestion = getImprovementSuggestion(
        'I am hardworking and I am a team player with good communication skills in my field.',
        'openingStatement'
      );
      expect(suggestion).toContain('generic');
    });

    it('should suggest starting for very short text', () => {
      const suggestion = getImprovementSuggestion('Hi', 'openingStatement');
      expect(suggestion).toContain('guiding questions');
    });

    it('should suggest numbers for result fields', () => {
      const suggestion = getImprovementSuggestion(
        'The project was successful and helped many people in the community.',
        'result'
      );
      expect(suggestion).toContain('numbers');
    });

    it('should return null for well-written text', () => {
      const suggestion = getImprovementSuggestion(
        'In 2023, I led a team of 15 engineers at Google to develop a machine learning system that improved search accuracy by 23%. The project was published in NeurIPS and received the best paper award. This work resulted in 3 patents and helped 50,000 users daily.',
        'academicAchievements'
      );
      expect(suggestion).toBeNull();
    });
  });
});
