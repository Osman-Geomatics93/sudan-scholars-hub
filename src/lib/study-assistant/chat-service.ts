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

const STUDY_SYSTEM_PROMPT = `You are an AI study assistant for Sudan Scholars Hub. You help students understand their study materials.

Your capabilities:
- Explain concepts from provided documents
- Generate summaries of content
- Answer questions about the material
- Create practice questions
- Simplify complex topics

Rules:
- Base answers on the provided document context when available
- If asked about something not in the document, say so clearly
- Be concise but thorough
- Use bullet points and formatting for clarity
- Respond in the same language as the user (English or Arabic)
- Be encouraging and supportive`;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function streamChatResponse(
  messages: ChatMessage[],
  documentContext?: string | null,
) {
  const systemMessages: ChatMessage[] = [
    { role: 'system', content: STUDY_SYSTEM_PROMPT },
  ];

  if (documentContext) {
    systemMessages.push({
      role: 'system',
      content: `Here is the document context the student is studying:\n\n---\n${documentContext.slice(0, 30000)}\n---\n\nUse this context to answer the student's questions. If a question is unrelated to this context, you can still help but mention that it's outside the provided material.`,
    });
  }

  const stream = await getClient().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [...systemMessages, ...messages],
    max_tokens: 2000,
    temperature: 0.7,
    stream: true,
  });

  return stream;
}
