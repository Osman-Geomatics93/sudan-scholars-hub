/**
 * AI Scholarship Matcher - AI Ranking Integration
 *
 * Uses Groq AI to generate personalized explanations for scholarship matches.
 */

import OpenAI from 'openai';
import type { MatcherProfile, ScholarshipMatch, PreliminaryMatch, MatchLevel } from './types';
import { getMatchLevel } from './types';
import { buildMatcherPrompt, parseAIResponse, generateFallbackExplanation } from './prompts';

// Initialize Groq client
const groqClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1',
});

/**
 * Generate AI explanations for scholarship matches
 */
export async function generateMatchExplanations(
  matches: PreliminaryMatch[],
  profile: MatcherProfile,
  locale: string
): Promise<ScholarshipMatch[]> {
  // If no matches, return empty array
  if (matches.length === 0) {
    return [];
  }

  // Try AI generation
  try {
    const aiResults = await callAIForExplanations(matches, profile, locale);

    if (aiResults) {
      return mergeAIResults(matches, aiResults, locale);
    }
  } catch (error) {
    console.error('AI explanation generation failed:', error);
  }

  // Fallback: generate explanations without AI
  return generateFallbackMatches(matches, locale);
}

/**
 * Call AI service for explanations
 */
async function callAIForExplanations(
  matches: PreliminaryMatch[],
  profile: MatcherProfile,
  locale: string
): Promise<{ index: number; rating: MatchLevel; explanation: string }[] | null> {
  if (!process.env.GROQ_API_KEY) {
    console.warn('Groq API key not configured, using fallback');
    return null;
  }

  const prompt = buildMatcherPrompt(matches, profile, locale);

  try {
    const completion = await groqClient.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000, // More tokens for multiple explanations
      temperature: 0.7,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      console.error('Empty response from AI');
      return null;
    }

    return parseAIResponse(responseText);
  } catch (error) {
    console.error('Groq API call failed:', error);
    return null;
  }
}

/**
 * Merge AI results with preliminary matches
 */
function mergeAIResults(
  matches: PreliminaryMatch[],
  aiResults: { index: number; rating: MatchLevel; explanation: string }[],
  locale: string
): ScholarshipMatch[] {
  const isArabic = locale === 'ar';

  return matches.map((match, index) => {
    // Find AI result for this match (1-indexed)
    const aiResult = aiResults.find((r) => r.index === index + 1);

    // Determine match level
    let matchLevel: MatchLevel;
    if (aiResult?.rating) {
      matchLevel = aiResult.rating;
    } else {
      matchLevel = getMatchLevel(match.score);
    }

    // Get explanation
    let explanation: { en: string; ar: string };
    if (aiResult?.explanation) {
      explanation = isArabic
        ? { en: '', ar: aiResult.explanation }
        : { en: aiResult.explanation, ar: '' };
    } else {
      const fallback = generateFallbackExplanation(match, isArabic);
      explanation = isArabic
        ? { en: '', ar: fallback }
        : { en: fallback, ar: '' };
    }

    return {
      scholarshipId: match.scholarship.id,
      scholarship: match.scholarship,
      score: match.score,
      matchLevel,
      explanation,
      factors: match.factors,
    };
  });
}

/**
 * Generate fallback matches without AI
 */
function generateFallbackMatches(
  matches: PreliminaryMatch[],
  locale: string
): ScholarshipMatch[] {
  const isArabic = locale === 'ar';

  return matches.map((match) => {
    const matchLevel = getMatchLevel(match.score);
    const fallbackText = generateFallbackExplanation(match, isArabic);

    return {
      scholarshipId: match.scholarship.id,
      scholarship: match.scholarship,
      score: match.score,
      matchLevel,
      explanation: isArabic
        ? { en: '', ar: fallbackText }
        : { en: fallbackText, ar: '' },
      factors: match.factors,
    };
  });
}

/**
 * Check if AI service is available
 */
export function isAIAvailable(): boolean {
  return Boolean(process.env.GROQ_API_KEY);
}

/**
 * Get the AI model being used
 */
export function getAIModel(): string {
  return 'groq:llama-3.3-70b-versatile';
}
