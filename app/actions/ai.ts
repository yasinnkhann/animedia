'use server';

import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { tmdbClient, igdbClient } from '@/lib/api';

export async function recommendMedia(
  prompt: string,
  mediaType: 'MOVIE' | 'SHOW' | 'GAME'
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

  const chatPrompt = `You are an expert in ${mediaTypeMapping[mediaType]}.
Given the following user prompt, recommend exactly 6 items that perfectly match their criteria.
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

  const object = JSON.parse(text);

  // Map the LLM's titles to real TMDB/IGDB data
  const results = await Promise.all(
    object.recommendations.map(async (rec: any) => {
      try {
        if (mediaType === 'MOVIE') {
          const res = await tmdbClient.searchMovies(rec.title, 1);
          if (res?.results?.[0]) {
            return { type: 'MOVIE', data: res.results[0] };
          }
        } else if (mediaType === 'SHOW') {
          const res = await tmdbClient.searchShows(rec.title, 1);
          if (res?.results?.[0]) {
            return { type: 'SHOW', data: res.results[0] };
          }
        } else if (mediaType === 'GAME') {
          const res = await igdbClient.searchGames(rec.title, 1, 1);
          if (res?.results?.[0]) {
            return { type: 'GAME', data: res.results[0] };
          }
        }
      } catch (err) {
        console.error(`Error fetching ${rec.title}:`, err);
      }
      return null;
    })
  );

  return results.filter(r => r !== null && r.data !== undefined) as Array<{
    type: string;
    data: any;
  }>;
}
