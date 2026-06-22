import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { tmdbClient, igdbClient } from '@/lib/api';

export async function POST(req: Request) {
  try {
    const { prompt, mediaType, excludedTitles = [] } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return Response.json({ error: 'GROQ_API_KEY is not set' }, { status: 500 });
    }

    const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

    const mediaTypeMapping: Record<string, string> = {
      MOVIE: 'movies',
      SHOW: 'TV shows (anime included)',
      GAME: 'video games',
    };

    const exclusionInstruction =
      excludedTitles.length > 0
        ? `\nIMPORTANT: Do NOT recommend any of the following titles as they have already been generated: ${excludedTitles.join(', ')}`
        : '';

    const chatPrompt = `You are an expert in ${mediaTypeMapping[mediaType] || 'media'}.
Given the following user prompt, recommend exactly 10 items that perfectly match their criteria.${exclusionInstruction}
User prompt: "${prompt}"

IMPORTANT: You must return ONLY a JSON object exactly matching this structure, with no markdown formatting, no backticks, and no extra text:
{
  "recommendations": [
    { "title": "Exactly spelled title" }
  ]
}`;

    const { textStream } = streamText({
      model: groq('llama-3.1-8b-instant'),
      prompt: chatPrompt,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const fetchedTitles = new Set<string>();
        let fullText = '';

        try {
          for await (const chunk of textStream) {
            fullText += chunk;

            const regex = /"title"\s*:\s*"([^"]+)"/gi;
            let match;
            while ((match = regex.exec(fullText)) !== null) {
              const title = match[1];
              if (fetchedTitles.has(title)) continue;

              fetchedTitles.add(title);

              try {
                let result = null;
                if (mediaType === 'MOVIE') {
                  const res = await tmdbClient.searchMovies(title, 1);
                  if (res?.results?.[0]) result = { type: 'MOVIE', data: res.results[0] };
                } else if (mediaType === 'SHOW') {
                  const res = await tmdbClient.searchShows(title, 1);
                  if (res?.results?.[0]) result = { type: 'SHOW', data: res.results[0] };
                } else if (mediaType === 'GAME') {
                  const res = await igdbClient.searchGames(title, 1, 1);
                  if (res?.results?.[0]) result = { type: 'GAME', data: res.results[0] };
                }

                if (result) {
                  controller.enqueue(encoder.encode(JSON.stringify(result) + '\n'));
                }
              } catch (err) {
                console.error(`Error fetching ${title}:`, err);
              }
            }
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
