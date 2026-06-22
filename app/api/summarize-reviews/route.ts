import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';

export async function POST(req: Request) {
  try {
    const { reviews, mediaTitle } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return Response.json({ error: 'GROQ_API_KEY is not set' }, { status: 500 });
    }

    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return Response.json({ error: 'No reviews provided' }, { status: 400 });
    }

    const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

    const systemPrompt = `You are an expert media analyst. Read the following user reviews for the media titled "${mediaTitle}". 
Write a 2-3 sentence, spoiler-free consensus summarizing the community's overall thoughts. Do not use markdown. Do not include phrases like "The consensus is" or "Overall". Just write the summary directly.`;

    const userPrompt = `Reviews for ${mediaTitle}:\n\n${reviews.map((r, i) => `Review ${i + 1}:\n${r}`).join('\n\n')}`;

    const { textStream } = await streamText({
      model: groq('llama-3.1-8b-instant'),
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
    return Response.json({ error: error.message }, { status: 500 });
  }
}
