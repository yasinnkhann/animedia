import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return Response.json({ error: 'GROQ_API_KEY is not set' }, { status: 500 });
    }

    const body = await req.json();
    const { reviews, mediaTitle } = body || {};

    if (!reviews || !Array.isArray(reviews)) {
      return Response.json({ error: 'No reviews provided' }, { status: 400 });
    }

    // Sanitize and bound reviews to prevent prompt injection, token exhaustion, and timeouts
    const sanitizedReviews = reviews
      .filter((r): r is string => typeof r === 'string' && r.trim().length > 0)
      .slice(0, 20)
      .map(r => r.trim().slice(0, 1000));

    if (sanitizedReviews.length === 0) {
      return Response.json({ error: 'No valid reviews provided' }, { status: 400 });
    }

    const title =
      typeof mediaTitle === 'string' && mediaTitle.trim().length > 0
        ? mediaTitle.trim().slice(0, 200)
        : 'this title';

    const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

    const systemPrompt = `You are an expert media analyst. Read the following user reviews for the media titled "${title}". 
Write a 2-3 sentence, spoiler-free consensus summarizing the community's overall thoughts. Do not use markdown. Do not include phrases like "The consensus is" or "Overall". Just write the summary directly.`;

    const userPrompt = `Reviews for ${title}:\n\n${sanitizedReviews.map((r, i) => `Review ${i + 1}:\n${r}`).join('\n\n')}`;

    const { textStream } = await streamText({
      model: groq('openai/gpt-oss-20b'),
      system: systemPrompt,
      prompt: userPrompt,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of textStream) {
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (e) {
          console.error('Stream error:', e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error: any) {
    console.error('Error in POST /api/summarize-reviews:', error);
    return Response.json(
      { error: error?.message || 'Failed to summarize reviews' },
      { status: 500 }
    );
  }
}
