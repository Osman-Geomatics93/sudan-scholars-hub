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

export interface GeneratedCard {
  front: string;
  back: string;
}

export async function generateFlashcards(
  text: string,
  count: number = 10,
  language: string = 'en',
): Promise<GeneratedCard[]> {
  const langInstruction = language === 'ar'
    ? 'Generate the flashcards in Arabic.'
    : 'Generate the flashcards in English.';

  const completion = await getClient().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are a flashcard generator. Create study flashcards from the provided text.
Each flashcard should have a clear question (front) and a concise answer (back).
${langInstruction}
Return ONLY a valid JSON array of objects with "front" and "back" keys. No markdown, no explanation.
Example: [{"front":"What is X?","back":"X is..."},{"front":"Define Y","back":"Y means..."}]`,
      },
      {
        role: 'user',
        content: `Create ${count} flashcards from this text:\n\n${text.slice(0, 15000)}`,
      },
    ],
    max_tokens: 3000,
    temperature: 0.7,
  });

  const raw = completion.choices[0]?.message?.content || '[]';

  // Extract JSON array from response (handle markdown code blocks)
  const jsonMatch = raw.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return [];

  try {
    const cards = JSON.parse(jsonMatch[0]) as GeneratedCard[];
    return cards.filter((c) => c.front && c.back).slice(0, count);
  } catch {
    return [];
  }
}
