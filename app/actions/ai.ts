'use server';

import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { tmdbClient, igdbClient } from '@/lib/api';

export async function recommendMedia(
  prompt: string,
  mediaType: 'MOVIE' | 'SHOW' | 'GAME',
  excludedTitles: string[] = []
): Promise<Array<{ type: string; data: any }>> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not set in environment variables.');
  }

  const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

  const mediaTypeMapping = {
    MOVIE: 'movies',
    SHOW: 'TV shows (anime included)',
    GAME: 'video games',
  };

  const exclusionInstruction =
    excludedTitles.length > 0
      ? `\nIMPORTANT: Do NOT recommend any of the following titles as they have already been generated: ${excludedTitles.join(', ')}`
      : '';

  const chatPrompt = `You are an expert in ${mediaTypeMapping[mediaType]}.
Given the following user prompt, recommend exactly 10 items that perfectly match their criteria.${exclusionInstruction}
User prompt: "${prompt}"

IMPORTANT: You must return ONLY a JSON object exactly matching this structure, with no markdown formatting, no backticks, and no extra text:
{
  "recommendations": [
    { "title": "Exactly spelled title" }
  ]
}`;

  const { text } = await generateText({
    model: groq('llama-3.1-8b-instant'),
    prompt: chatPrompt,
  });

  // Extract just the JSON part in case Llama wrapped it in markdown backticks
  let cleanText = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);

  // Remove bad control characters (like unescaped newlines or tabs) that break JSON.parse
  cleanText = cleanText.replace(/[\u0000-\u001F]/g, '');

  let titles: string[] = [];
  try {
    const object = JSON.parse(cleanText);
    titles = object.recommendations.map((r: any) => r.title);
  } catch (e) {
    console.warn(
      'JSON parsing failed due to Llama hallucination, falling back to regex extraction',
      e
    );
    const regex = /"title"\s*:\s*"([^"]+)"/gi;
    let match;
    while ((match = regex.exec(text)) !== null) {
      titles.push(match[1]);
    }
  }

  // Map the LLM's titles to real TMDB/IGDB data
  const results = await Promise.all(
    titles.map(async (title: string) => {
      try {
        if (mediaType === 'MOVIE') {
          const res = await tmdbClient.searchMovies(title, 1);
          if (res?.results?.[0]) {
            return { type: 'MOVIE', data: res.results[0] };
          }
        } else if (mediaType === 'SHOW') {
          const res = await tmdbClient.searchShows(title, 1);
          if (res?.results?.[0]) {
            return { type: 'SHOW', data: res.results[0] };
          }
        } else if (mediaType === 'GAME') {
          const res = await igdbClient.searchGames(title, 1, 1);
          if (res?.results?.[0]) {
            return { type: 'GAME', data: res.results[0] };
          }
        }
      } catch (err) {
        console.error(`Error fetching ${title}:`, err);
      }
      return null;
    })
  );

  return results.filter(r => r !== null && r.data !== undefined) as Array<{
    type: string;
    data: any;
  }>;
}
