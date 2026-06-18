'use server';

import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { tmdbClient, igdbClient } from '@/lib/api';

export async function recommendMedia(prompt: string): Promise<Array<{ type: string; data: any }>> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not set in environment variables.');
  }

  const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

  const chatPrompt = `You are an expert in movies, TV shows (anime included), and video games.
Given the following user prompt, recommend exactly 6 items that perfectly match their criteria.
User prompt: "${prompt}"

IMPORTANT: You must return ONLY a JSON object exactly matching this structure, with no markdown formatting, no backticks, and no extra text:
{
  "recommendations": [
    { "type": "MOVIE", "title": "Exactly spelled movie title" },
    { "type": "SHOW", "title": "Exactly spelled show title" },
    { "type": "GAME", "title": "Exactly spelled game title" }
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
        if (rec.type === 'MOVIE') {
          const res = await tmdbClient.searchMovies(rec.title, 1);
          if (res?.results?.[0]) {
            return { type: 'MOVIE', data: res.results[0] };
          }
        } else if (rec.type === 'SHOW') {
          const res = await tmdbClient.searchShows(rec.title, 1);
          if (res?.results?.[0]) {
            return { type: 'SHOW', data: res.results[0] };
          }
        } else if (rec.type === 'GAME') {
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
