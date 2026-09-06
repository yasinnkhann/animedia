import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';
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
      SHOW: 'TV shows',
      GAME: 'video games',
    };

    const exclusionInstruction =
      excludedTitles.length > 0 ? `\nDo not include these: ${JSON.stringify(excludedTitles)}` : '';

    const chatPrompt = `Recommend up to 15 ${mediaTypeMapping[mediaType] || 'media'} matching: "${prompt}".${exclusionInstruction}

List the titles as a simple bulleted list.`;

    let text = '';
    let retries = 0;
    while (!text && retries < 4) {
      const response = await generateText({
        model: groq('openai/gpt-oss-20b'),
        prompt: chatPrompt,
        temperature: 0.9 + retries * 0.1,
      });
      text = response.text.trim();
      retries++;
      if (!text) {
        console.warn(`gpt-oss-20b returned empty string (retry ${retries})...`);
      }
    }

    console.log('AI TEXT:', text);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const fetchedTitles = new Set<string>(excludedTitles.map((t: string) => t.toLowerCase()));

        try {
          const regex = /^\s*[-*]\s+(.+?)(?=\r?$)/gm;
          let match;
          const fetchPromises = [];

          while ((match = regex.exec(text)) !== null) {
            let title = match[1].replace(/["']/g, '').trim();
            const lowerTitle = title.toLowerCase();
            if (fetchedTitles.has(lowerTitle)) continue;

            fetchedTitles.add(lowerTitle);

            const fetchTask = async () => {
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
            };
            fetchPromises.push(fetchTask());
          }

          await Promise.all(fetchPromises);
        } catch (e) {
          console.error('Parse error:', e);
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
