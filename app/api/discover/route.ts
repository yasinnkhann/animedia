import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { tmdbClient, igdbClient } from '@/lib/api';

export const maxDuration = 60;

const TARGET_ITEMS_TO_DELIVER = 10;
const AI_CANDIDATE_BUFFER = 16;
const MAX_MODEL_RETRIES = 2;

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
      excludedTitles.length > 0
        ? `\n\nI already have these: ${excludedTitles.join(', ')}. Please recommend ${AI_CANDIDATE_BUFFER} OTHER ${mediaTypeMapping[mediaType] || 'media'} that are completely different.`
        : '';

    const chatPrompt = `Recommend ${AI_CANDIDATE_BUFFER} distinct ${mediaTypeMapping[mediaType] || 'media'} matching: "${prompt}".${exclusionInstruction}

List ONLY the titles as a simple bulleted list with no notes, explanations, or extra commentary.`;

    const models = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'];
    let text = '';
    for (const modelName of models) {
      let retries = 0;
      while (!text && retries < MAX_MODEL_RETRIES) {
        try {
          const response = await generateText({
            model: groq(modelName),
            prompt: chatPrompt,
            temperature: 0.7 + retries * 0.1,
          });
          text = response.text.trim();
          if (text) break;
        } catch (err: any) {
          console.warn(`Model ${modelName} error: ${err.message}. Trying fallback...`);
          break;
        }
        retries++;
      }
      if (text) break;
    }

    console.log('AI TEXT:', text);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const fetchedTitles = new Set<string>(excludedTitles.map((t: string) => t.toLowerCase()));

        try {
          // Regex to match -, *, •, or numbers (1., 2., etc) at the start of a line
          const regex = /^\s*(?:[-*•]|\d+\.)\s+(.+?)(?=\r?$)/gm;
          let match;
          const candidateTitles: string[] = [];

          while ((match = regex.exec(text)) !== null) {
            // Strip quotes, markdown bold asterisks, and trailing years (e.g. " (2018)")
            let title = match[1]
              .replace(/["'*]/g, '')
              .replace(/\s*\(\d{4}\)\s*$/, '')
              .trim();
            const lowerTitle = title.toLowerCase();
            if (!fetchedTitles.has(lowerTitle)) {
              fetchedTitles.add(lowerTitle);
              candidateTitles.push(title);
            }
          }

          const deliveredIds = new Set<string | number>();
          let deliveredCount = 0;

          for (const title of candidateTitles) {
            if (deliveredCount >= TARGET_ITEMS_TO_DELIVER) break;

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

              if (result && !deliveredIds.has(result.data.id)) {
                deliveredIds.add(result.data.id);
                deliveredCount++;
                controller.enqueue(encoder.encode(JSON.stringify(result) + '\n'));
              }
            } catch (err) {
              console.error(`Error fetching ${title}:`, err);
            }
          }
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
