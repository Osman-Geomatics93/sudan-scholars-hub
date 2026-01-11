import OpenAI from 'openai';
import type { ResumeEducationInput, ResumeExperienceInput, ResumeSkillInput } from '@/lib/validations/cv-builder';

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1',
});

interface GenerateSummaryParams {
  education: ResumeEducationInput[];
  experience: ResumeExperienceInput[];
  skills: ResumeSkillInput[];
  targetRole?: string;
  language: 'en' | 'ar';
}

const SYSTEM_PROMPT_EN = `You are a professional resume writer specializing in ATS-optimized content. Your task is to generate compelling professional summaries.

Guidelines:
- Write in first person (implied, not starting with "I am")
- Be concise: 2-3 sentences maximum
- Focus on key qualifications and achievements
- Use action-oriented language
- Make it ATS-friendly: use standard industry terminology
- Include years of experience when applicable
- Highlight relevant skills and education
- Be professional but engaging

Example format:
"Results-driven [role] with [X] years of experience in [field]. Skilled in [key skills], with a proven track record of [achievement]. [Education] graduate passionate about [area of interest]."`;

const SYSTEM_PROMPT_AR = `أنت كاتب سير ذاتية محترف متخصص في المحتوى المُحسَّن لأنظمة تتبع المتقدمين. مهمتك هي كتابة ملخصات مهنية مقنعة.

الإرشادات:
- اكتب بضمير الغائب أو المبني للمجهول
- كن موجزاً: 2-3 جمل كحد أقصى
- ركز على المؤهلات والإنجازات الرئيسية
- استخدم لغة عملية وموجهة نحو الفعل
- اجعله متوافقاً مع أنظمة ATS: استخدم المصطلحات القياسية في المجال
- اذكر سنوات الخبرة عند الاقتضاء
- أبرز المهارات والتعليم ذات الصلة
- كن مهنياً ولكن جذاباً`;

function formatEducation(education: ResumeEducationInput[]): string {
  if (!education.length) return '';

  return education.map(edu => {
    const year = edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present';
    return `${edu.degree} in ${edu.field} from ${edu.institution} (${year})`;
  }).join('; ');
}

function formatExperience(experience: ResumeExperienceInput[]): string {
  if (!experience.length) return '';

  return experience.map(exp => {
    const duration = calculateDuration(exp.startDate, exp.endDate, exp.current);
    return `${exp.position} at ${exp.company} (${duration})`;
  }).join('; ');
}

function calculateDuration(startDate: string, endDate?: string, current?: boolean): string {
  const start = new Date(startDate);
  const end = current ? new Date() : (endDate ? new Date(endDate) : new Date());

  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years >= 1) {
    return years === 1 ? '1 year' : `${years} years`;
  }
  return `${remainingMonths} months`;
}

function formatSkills(skills: ResumeSkillInput[]): string {
  if (!skills.length) return '';
  return skills.map(s => s.name).slice(0, 5).join(', ');
}

export async function generateCVSummary(params: GenerateSummaryParams): Promise<string> {
  const { education, experience, skills, targetRole, language } = params;

  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('Groq API key not configured');
    }

    const systemPrompt = language === 'ar' ? SYSTEM_PROMPT_AR : SYSTEM_PROMPT_EN;

    const userPrompt = language === 'ar'
      ? `قم بإنشاء ملخص مهني بناءً على المعلومات التالية:

${targetRole ? `الدور المستهدف: ${targetRole}` : ''}

التعليم:
${formatEducation(education) || 'لم يتم تحديده'}

الخبرة المهنية:
${formatExperience(experience) || 'لم يتم تحديدها'}

المهارات:
${formatSkills(skills) || 'لم يتم تحديدها'}

اكتب ملخصاً مهنياً من 2-3 جمل باللغة العربية.`
      : `Generate a professional summary based on the following information:

${targetRole ? `Target Role: ${targetRole}` : ''}

Education:
${formatEducation(education) || 'Not specified'}

Work Experience:
${formatExperience(experience) || 'Not specified'}

Key Skills:
${formatSkills(skills) || 'Not specified'}

Write a 2-3 sentence professional summary in English.`;

    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content;

    if (!text) {
      throw new Error('No response from AI');
    }

    // Clean up the response
    return text.trim().replace(/^["']|["']$/g, '');

  } catch (error) {
    console.error('AI Summary generation error:', error);

    // Return a fallback message
    return language === 'ar'
      ? 'لم نتمكن من إنشاء الملخص. يرجى المحاولة مرة أخرى أو كتابة الملخص يدوياً.'
      : 'Unable to generate summary. Please try again or write your summary manually.';
  }
}
