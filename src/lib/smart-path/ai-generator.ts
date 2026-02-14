import OpenAI from 'openai';
import { getGroqApiKey } from '../env';

let client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: getGroqApiKey(),
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }
  return client;
}

export interface StudyPathDayPlan {
  dayNumber: number;
  subject: string;
  topic: string;
  description: string;
  durationMin: number;
  taskType: 'study' | 'review' | 'practice' | 'exam-prep';
  priority: 'high' | 'normal' | 'low';
}

export interface GeneratedStudyPath {
  title: string;
  days: StudyPathDayPlan[];
}

export interface UserStudyData {
  sessions: { subject: string; totalMinutes: number; sessionCount: number }[];
  flashcardPerformance: { subject: string; avgQuality: number; cardCount: number }[];
  upcomingExams: { title: string; subject: string; daysUntil: number }[];
  streak: number;
  goals: { type: string; targetMinutes: number }[];
  masteryData: { subject: string; masteryPct: number }[];
}

export async function generateStudyPath(
  data: UserStudyData,
  durationDays: number = 14,
  focusSubjects: string[] = [],
  language: string = 'en',
): Promise<GeneratedStudyPath> {
  const langInstruction = language === 'ar'
    ? 'Generate ALL text content in Arabic (titles, topics, descriptions).'
    : 'Generate ALL text content in English.';

  const focusNote = focusSubjects.length > 0
    ? `The student wants to FOCUS on these subjects: ${focusSubjects.join(', ')}. Prioritize these heavily.`
    : '';

  const examNote = data.upcomingExams.length > 0
    ? `UPCOMING EXAMS (prioritize exam-prep for these):\n${data.upcomingExams.map((e) => `- ${e.title} (${e.subject}) in ${e.daysUntil} days`).join('\n')}`
    : 'No upcoming exams scheduled.';

  const sessionNote = data.sessions.length > 0
    ? `STUDY HISTORY (last 90 days):\n${data.sessions.map((s) => `- ${s.subject}: ${s.totalMinutes} min across ${s.sessionCount} sessions`).join('\n')}`
    : 'No recent study sessions recorded.';

  const flashcardNote = data.flashcardPerformance.length > 0
    ? `FLASHCARD PERFORMANCE (avg quality 0-5 scale):\n${data.flashcardPerformance.map((f) => `- ${f.subject}: avg ${f.avgQuality.toFixed(1)} quality (${f.cardCount} cards)`).join('\n')}`
    : 'No flashcard data available.';

  const masteryNote = data.masteryData.length > 0
    ? `CURRENT MASTERY LEVELS:\n${data.masteryData.map((m) => `- ${m.subject}: ${m.masteryPct.toFixed(0)}%`).join('\n')}`
    : 'No mastery data yet.';

  const streakNote = `Current study streak: ${data.streak} days`;
  const goalNote = data.goals.length > 0
    ? `Study goals: ${data.goals.map((g) => `${g.type}: ${g.targetMinutes} min`).join(', ')}`
    : '';

  const systemPrompt = `You are an expert study planner AI. Create a personalized day-by-day study plan.
${langInstruction}

Rules:
1. Prioritize exam-prep for upcoming exams (schedule review sessions before exam dates)
2. Reinforce subjects with low flashcard quality scores (below 3.0)
3. Balance workload across days (30-120 minutes per day)
4. Include rest/light-review days every 5-7 days
5. Subjects with low mastery need more study sessions
6. Vary task types: study (new material), review (revisit), practice (exercises), exam-prep (focused prep)
7. Set priority: high for exam-prep and weak subjects, normal for regular study, low for review days

Return ONLY a valid JSON object with this exact structure:
{"title":"Plan title here","days":[{"dayNumber":1,"subject":"Subject","topic":"Specific topic","description":"What to study and how","durationMin":60,"taskType":"study","priority":"normal"}]}

Each day must have: dayNumber (1-based), subject, topic, description (2-3 sentences), durationMin (30-120), taskType (study/review/practice/exam-prep), priority (high/normal/low).`;

  const userPrompt = `Create a ${durationDays}-day study plan for this student.

${focusNote}
${examNote}
${sessionNote}
${flashcardNote}
${masteryNote}
${streakNote}
${goalNote}

Generate exactly ${durationDays} days. Each day should have a clear, actionable study task.`;

  const completion = await getClient().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: 4000,
    temperature: 0.7,
  });

  const raw = completion.choices[0]?.message?.content || '{}';

  // Extract JSON object from response
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI response: no JSON found');
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]) as GeneratedStudyPath;

    // Validate and clamp values
    if (!parsed.title || !Array.isArray(parsed.days) || parsed.days.length === 0) {
      throw new Error('Invalid response structure');
    }

    const validTaskTypes = ['study', 'review', 'practice', 'exam-prep'];
    const validPriorities = ['high', 'normal', 'low'];

    parsed.days = parsed.days.slice(0, durationDays).map((day, idx) => ({
      dayNumber: idx + 1,
      subject: String(day.subject || 'General').slice(0, 200),
      topic: String(day.topic || 'Study Session').slice(0, 200),
      description: String(day.description || 'Study session').slice(0, 2000),
      durationMin: Math.max(15, Math.min(180, Number(day.durationMin) || 60)),
      taskType: validTaskTypes.includes(day.taskType) ? day.taskType : 'study',
      priority: validPriorities.includes(day.priority) ? day.priority : 'normal',
    }));

    return parsed;
  } catch (e) {
    throw new Error(`Failed to parse AI study path: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }
}
