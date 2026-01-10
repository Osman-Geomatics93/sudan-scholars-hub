/**
 * AI Scholarship Matcher - Prompt Templates
 *
 * Bilingual prompts for AI-powered scholarship matching and explanations.
 */

import type { MatcherProfile, PreliminaryMatch } from './types';
import { FIELD_LABELS, LEVEL_LABELS } from '@/lib/validations/matcher';

// System prompts for different languages
export const MATCHER_SYSTEM_PROMPTS = {
  en: `You are an expert scholarship advisor for Sudan Scholars Hub, helping Sudanese and international students find the best scholarship opportunities.

Your task is to analyze scholarship matches and provide personalized, encouraging explanations for each match.

For each scholarship, explain in 2-3 sentences:
1. Why this scholarship is a good fit for the student's profile
2. What makes them competitive or what advantages they have
3. Any important considerations or tips for applying

Guidelines:
- Be encouraging but realistic
- Focus on actionable insights
- Highlight positive aspects while noting any challenges
- Keep explanations concise and helpful
- Consider the student's background, GPA, field of study, and preferences`,

  ar: `أنت مستشار منح دراسية خبير لـ Sudan Scholars Hub، تساعد الطلاب السودانيين والدوليين في العثور على أفضل فرص المنح الدراسية.

مهمتك هي تحليل تطابق المنح وتقديم شروحات مخصصة ومشجعة لكل منحة.

لكل منحة، اشرح في 2-3 جمل:
1. لماذا هذه المنحة مناسبة لملف الطالب
2. ما الذي يجعلهم منافسين أو ما هي مميزاتهم
3. أي اعتبارات مهمة أو نصائح للتقديم

إرشادات:
- كن مشجعاً ولكن واقعياً
- ركز على النصائح العملية
- أبرز الجوانب الإيجابية مع ذكر أي تحديات
- اجعل الشروحات مختصرة ومفيدة
- ضع في اعتبارك خلفية الطالب ومعدله ومجال دراسته وتفضيلاته`,
};

/**
 * Build the complete prompt for AI matching
 */
export function buildMatcherPrompt(
  matches: PreliminaryMatch[],
  profile: MatcherProfile,
  locale: string
): string {
  const isArabic = locale === 'ar';

  // Build profile summary
  const profileSummary = buildProfileSummary(profile, isArabic);

  // Build scholarships list
  const scholarshipsList = buildScholarshipsList(matches, isArabic);

  // Build the complete prompt
  const prompt = isArabic
    ? `${MATCHER_SYSTEM_PROMPTS.ar}

${profileSummary}

المنح الدراسية للتحليل:
${scholarshipsList}

لكل منحة، قدم:
1. تقييم التطابق: "excellent" (ممتاز) أو "good" (جيد) أو "fair" (مقبول)
2. شرح مختصر (2-3 جمل) باللغة العربية يوضح لماذا هذه المنحة مناسبة للطالب

أجب بتنسيق JSON التالي فقط:
{
  "matches": [
    {"index": 1, "rating": "excellent|good|fair", "explanation": "الشرح هنا..."},
    {"index": 2, "rating": "excellent|good|fair", "explanation": "الشرح هنا..."}
  ]
}`
    : `${MATCHER_SYSTEM_PROMPTS.en}

${profileSummary}

Scholarships to analyze:
${scholarshipsList}

For each scholarship, provide:
1. Match rating: "excellent", "good", or "fair"
2. Brief explanation (2-3 sentences) in English explaining why this scholarship fits the student

Respond ONLY with the following JSON format:
{
  "matches": [
    {"index": 1, "rating": "excellent|good|fair", "explanation": "Your explanation here..."},
    {"index": 2, "rating": "excellent|good|fair", "explanation": "Your explanation here..."}
  ]
}`;

  return prompt;
}

/**
 * Build profile summary section
 */
function buildProfileSummary(profile: MatcherProfile, isArabic: boolean): string {
  const currentLevelLabel = LEVEL_LABELS[profile.currentLevel]?.[isArabic ? 'ar' : 'en'] || profile.currentLevel;
  const targetLevelLabel = LEVEL_LABELS[profile.targetLevel]?.[isArabic ? 'ar' : 'en'] || profile.targetLevel;
  const fieldsLabels = profile.fieldsOfStudy
    .map((f) => FIELD_LABELS[f]?.[isArabic ? 'ar' : 'en'] || f)
    .join(', ');

  if (isArabic) {
    return `الملف الشخصي للطالب:
- المعدل: ${profile.gpaValue.toFixed(1)}%
- المستوى التعليمي الحالي: ${currentLevelLabel}
- المستوى المستهدف: ${targetLevelLabel}
- مجالات الدراسة: ${fieldsLabels}
- بلد الأصل: ${profile.countryOfOrigin}
- اللغات: ${profile.languages.join(', ')}
- العمر: ${profile.age || 'غير محدد'}
- تفضيل التمويل: ${profile.fundingPreference === 'FULLY_FUNDED_ONLY' ? 'ممولة بالكامل فقط' : 'أي نوع'}
${profile.specialCircumstances ? `- ظروف خاصة: ${profile.specialCircumstances}` : ''}`;
  } else {
    return `Student Profile:
- GPA: ${profile.gpaValue.toFixed(1)}%
- Current Education Level: ${currentLevelLabel}
- Target Study Level: ${targetLevelLabel}
- Fields of Study: ${fieldsLabels}
- Country of Origin: ${profile.countryOfOrigin}
- Languages: ${profile.languages.join(', ')}
- Age: ${profile.age || 'Not specified'}
- Funding Preference: ${profile.fundingPreference === 'FULLY_FUNDED_ONLY' ? 'Fully funded only' : 'Any funding type'}
${profile.specialCircumstances ? `- Special Circumstances: ${profile.specialCircumstances}` : ''}`;
  }
}

/**
 * Build scholarships list section
 */
function buildScholarshipsList(matches: PreliminaryMatch[], isArabic: boolean): string {
  return matches
    .map((match, index) => {
      const s = match.scholarship;
      const title = isArabic ? s.titleAr || s.title : s.title;
      const university = isArabic ? s.universityAr || s.university : s.university;
      const country = isArabic ? s.countryAr || s.country : s.country;

      return isArabic
        ? `${index + 1}. ${title}
   - الجامعة: ${university}
   - البلد: ${country}
   - نسبة التطابق المبدئية: ${match.score}%
   - المجال: ${s.field}
   - التمويل: ${s.fundingType === 'FULLY_FUNDED' ? 'ممولة بالكامل' : 'ممولة جزئياً'}`
        : `${index + 1}. ${title}
   - University: ${university}
   - Country: ${country}
   - Preliminary Score: ${match.score}%
   - Field: ${s.field}
   - Funding: ${s.fundingType === 'FULLY_FUNDED' ? 'Fully Funded' : 'Partially Funded'}`;
    })
    .join('\n\n');
}

/**
 * Extract and validate AI response
 */
export function parseAIResponse(
  response: string
): { index: number; rating: 'excellent' | 'good' | 'fair'; explanation: string }[] | null {
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in AI response');
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.matches || !Array.isArray(parsed.matches)) {
      console.error('Invalid AI response format: missing matches array');
      return null;
    }

    // Validate and normalize each match
    return parsed.matches.map((match: { index: number; rating: string; explanation: string }) => {
      // Normalize rating
      let rating: 'excellent' | 'good' | 'fair' = 'fair';
      const ratingLower = (match.rating || '').toLowerCase();
      if (ratingLower.includes('excellent') || ratingLower.includes('ممتاز')) {
        rating = 'excellent';
      } else if (ratingLower.includes('good') || ratingLower.includes('جيد')) {
        rating = 'good';
      }

      return {
        index: Number(match.index),
        rating,
        explanation: String(match.explanation || ''),
      };
    });
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return null;
  }
}

/**
 * Generate fallback explanations when AI fails
 */
export function generateFallbackExplanation(
  match: PreliminaryMatch,
  isArabic: boolean
): string {
  const { scholarship, score, factors } = match;

  // Find the strongest factor
  const strongestFactor = factors.reduce((best, current) =>
    current.score > best.score ? current : best
  );

  if (isArabic) {
    if (score >= 80) {
      return `هذه المنحة مناسبة جداً لملفك الشخصي. ${strongestFactor.detail.ar}. ننصحك بالتقديم في أقرب وقت.`;
    } else if (score >= 60) {
      return `منحة جيدة تتناسب مع معظم متطلباتك. ${strongestFactor.detail.ar}. تحقق من المتطلبات التفصيلية قبل التقديم.`;
    } else {
      return `قد تكون هذه المنحة مناسبة لك رغم بعض التحديات. ${strongestFactor.detail.ar}. راجع المتطلبات بعناية.`;
    }
  } else {
    if (score >= 80) {
      return `This scholarship is an excellent match for your profile. ${strongestFactor.detail.en}. We recommend applying as soon as possible.`;
    } else if (score >= 60) {
      return `A good scholarship that matches most of your requirements. ${strongestFactor.detail.en}. Check the detailed requirements before applying.`;
    } else {
      return `This scholarship could be suitable despite some challenges. ${strongestFactor.detail.en}. Review the requirements carefully.`;
    }
  }
}
