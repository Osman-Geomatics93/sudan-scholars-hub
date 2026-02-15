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

export interface WritingGradeResult {
  band: number;
  criteria: {
    taskAchievement: number;
    coherence: number;
    lexicalResource: number;
    grammar: number;
  };
  feedback: string;
  suggestions: string[];
}

export interface ToeflWritingGradeResult {
  score: number;
  criteria: {
    development: number;
    organization: number;
    languageUse: number;
  };
  feedback: string;
  suggestions: string[];
}

export interface SpeakingGradeResult {
  band: number;
  criteria: {
    fluency: number;
    lexical: number;
    grammar: number;
    pronunciation: number;
  };
  feedback: string;
  suggestions: string[];
}

export async function gradeWritingTask(
  prompt: string,
  response: string,
  examType: 'ielts' | 'toefl',
  taskType: string
): Promise<WritingGradeResult | ToeflWritingGradeResult> {
  const systemPrompt = examType === 'ielts'
    ? `You are an expert IELTS writing examiner. Grade the following IELTS ${taskType} response on these criteria:
1. Task Achievement (0-9)
2. Coherence and Cohesion (0-9)
3. Lexical Resource (0-9)
4. Grammatical Range and Accuracy (0-9)

Calculate an overall band score (average rounded to nearest 0.5).
Return ONLY valid JSON: {"band":7,"criteria":{"taskAchievement":7,"coherence":6.5,"lexicalResource":7,"grammar":7},"feedback":"...","suggestions":["...","..."]}`
    : `You are an expert TOEFL writing examiner. Grade the following TOEFL writing response on these criteria:
1. Development (0-5)
2. Organization (0-5)
3. Language Use (0-5)

Calculate an overall score (average rounded to nearest 0.5).
Return ONLY valid JSON: {"score":4,"criteria":{"development":4,"organization":4,"languageUse":3.5},"feedback":"...","suggestions":["...","..."]}`;

  const completion = await getClient().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Task prompt: ${prompt}\n\nStudent response:\n${response.slice(0, 15000)}` },
    ],
    max_tokens: 2000,
    temperature: 0.3,
  });

  const raw = completion.choices[0]?.message?.content || '{}';
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI grading response');
  }
  return JSON.parse(jsonMatch[0]);
}

export async function gradeSpeakingTask(
  prompt: string,
  transcription: string,
  examType: 'ielts' | 'toefl',
  partNumber: number
): Promise<SpeakingGradeResult> {
  const systemPrompt = examType === 'ielts'
    ? `You are an expert IELTS speaking examiner. Grade this Part ${partNumber} response transcription on:
1. Fluency and Coherence (0-9)
2. Lexical Resource (0-9)
3. Grammatical Range and Accuracy (0-9)
4. Pronunciation (0-9)

Calculate an overall band score (average rounded to nearest 0.5).
Return ONLY valid JSON: {"band":6.5,"criteria":{"fluency":6,"lexical":7,"grammar":6.5,"pronunciation":6.5},"feedback":"...","suggestions":["...","..."]}`
    : `You are an expert TOEFL speaking examiner. Grade this speaking response transcription on:
1. Fluency and Coherence (0-5)
2. Lexical Resource (0-5)
3. Grammar (0-5)
4. Pronunciation (0-5)

Calculate an overall score. Return ONLY valid JSON: {"band":3.5,"criteria":{"fluency":3,"lexical":4,"grammar":3.5,"pronunciation":3.5},"feedback":"...","suggestions":["...","..."]}`;

  const completion = await getClient().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Task prompt: ${prompt}\n\nTranscription:\n${transcription.slice(0, 10000)}` },
    ],
    max_tokens: 2000,
    temperature: 0.3,
  });

  const raw = completion.choices[0]?.message?.content || '{}';
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI speaking grade response');
  }
  return JSON.parse(jsonMatch[0]);
}

export async function generateVocabQuiz(
  words: { word: string; definition: string }[],
  count: number = 10
): Promise<{ questions: { word: string; sentenceWithBlank: string; options: string[]; correct: string }[] }> {
  const wordList = words.slice(0, 30).map(w => `${w.word}: ${w.definition}`).join('\n');

  const completion = await getClient().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are a vocabulary quiz generator. Create fill-in-the-blank questions using the given words.
Return ONLY valid JSON: {"questions":[{"word":"example","sentenceWithBlank":"The ___ was clear.","options":["example","sample","instance","model"],"correct":"example"}]}`,
      },
      {
        role: 'user',
        content: `Create ${count} vocab quiz questions from these words:\n${wordList}`,
      },
    ],
    max_tokens: 3000,
    temperature: 0.7,
  });

  const raw = completion.choices[0]?.message?.content || '{"questions":[]}';
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return { questions: [] };

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    return { questions: [] };
  }
}
