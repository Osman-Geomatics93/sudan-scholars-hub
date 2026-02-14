import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { sendMessageSchema } from '@/lib/validations/study-assistant';
import { streamChatResponse } from '@/lib/study-assistant/chat-service';

export const dynamic = 'force-dynamic';

// POST - Send a message and get SSE streaming response
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const { id: sessionId } = await params;
    const userId = (session!.user as { id: string }).id;

    const chatSession = await prisma.aIChatSession.findFirst({
      where: { id: sessionId, userId },
      include: {
        messages: { orderBy: { createdAt: 'asc' }, take: 20 },
      },
    });

    if (!chatSession) {
      return new Response(JSON.stringify({ error: 'Session not found' }), { status: 404 });
    }

    const body = await request.json();
    const result = sendMessageSchema.safeParse(body);
    if (!result.success) {
      return new Response(JSON.stringify({ error: 'Validation failed' }), { status: 400 });
    }

    // Save user message
    await prisma.aIChatMessage.create({
      data: { sessionId, role: 'user', content: result.data.content },
    });

    // Build message history for AI
    const history = chatSession.messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));
    history.push({ role: 'user', content: result.data.content });

    // Stream response via SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = '';
        try {
          const aiStream = await streamChatResponse(history, chatSession.contextText);

          for await (const chunk of aiStream) {
            const text = chunk.choices[0]?.delta?.content || '';
            if (text) {
              fullResponse += text;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }

          // Save assistant message to DB
          await prisma.aIChatMessage.create({
            data: { sessionId, role: 'assistant', content: fullResponse },
          });

          // Update session timestamp
          await prisma.aIChatSession.update({
            where: { id: sessionId },
            data: { updatedAt: new Date() },
          });

          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
        } catch (err) {
          console.error('Streaming error:', err);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: 'AI response failed' })}\n\n`),
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    console.error('Error in chat message:', err);
    return new Response(JSON.stringify({ error: 'Failed to process message' }), { status: 500 });
  }
}
