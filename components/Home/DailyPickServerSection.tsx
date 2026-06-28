import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import DailyPickCard from './DailyPickCard';
import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { MediaType } from '@prisma/client';

export default async function DailyPickServerSection() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  if (!process.env.GROQ_API_KEY) return null; // Gracefully disable if no key

  // Use today's date as cache key string
  const today = new Date();
  const dateString = today.toISOString().split('T')[0];

  // 1. Check if we already generated a pick for today
  const existingPick = await prisma.dailyPick.findUnique({
    where: {
      userId_date: {
        userId: session.user.id,
        date: dateString,
      },
    },
  });

  if (existingPick) {
    return <DailyPickCard pick={existingPick} />;
  }

  // 2. Fetch user's completed items to feed to Gemini
  const completedMovies = await prisma.movie.findMany({
    where: { userId: session.user.id, status: 'COMPLETED' },
    select: { name: true, rating: true },
  });
  const completedShows = await prisma.show.findMany({
    where: { userId: session.user.id, status: 'COMPLETED' },
    select: { name: true, rating: true },
  });
  const completedGames = await prisma.game.findMany({
    where: { userId: session.user.id, wishlist: false }, // Assume non-wishlist games with rating are played
    select: { name: true, rating: true },
  });

  // 3. Fetch user's PTW / Backlog to pick from
  const ptwMovies = await prisma.movie.findMany({
    where: { userId: session.user.id, status: 'PLAN_TO_WATCH' },
    select: { id: true, name: true },
  });
  const ptwShows = await prisma.show.findMany({
    where: { userId: session.user.id, status: 'PLAN_TO_WATCH' },
    select: { id: true, name: true },
  });
  const ptwGames = await prisma.game.findMany({
    where: { userId: session.user.id, wishlist: true },
    select: { id: true, name: true },
  });

  const totalPtw = ptwMovies.length + ptwShows.length + ptwGames.length;
  if (totalPtw === 0) return null; // Nothing to recommend!

  // 4. Construct prompt for Gemini
  const completedText = `
Movies: ${completedMovies.map(m => `${m.name} (Rated: ${m.rating || 'N/A'}/10)`).join(', ')}
Shows: ${completedShows.map(s => `${s.name} (Rated: ${s.rating || 'N/A'}/10)`).join(', ')}
Games: ${completedGames.map(g => `${g.name} (Rated: ${g.rating || 'N/A'}/10)`).join(', ')}
  `.trim();

  const backlogText = `
Movies: ${ptwMovies.map(m => `${m.name} [ID: ${m.id}]`).join(', ')}
Shows: ${ptwShows.map(s => `${s.name} [ID: ${s.id}]`).join(', ')}
Games: ${ptwGames.map(g => `${g.name} [ID: ${g.id}]`).join(', ')}
  `.trim();

  const prompt = `
You are an expert media curator AI. I will give you a list of media the user has completed and their ratings, and a list of their "Plan to Watch" backlog.
Based on their completed items and high ratings, pick EXACTLY ONE item from their Plan to Watch backlog that they should start today.

Completed items & Ratings:
${completedText || 'No completed items yet.'}

Plan to Watch Backlog:
${backlogText}

Respond ONLY with a valid JSON object matching this schema, nothing else:
{
  "id": "The database ID of the selected item from the backlog text",
  "type": "MOVIE" | "SHOW" | "GAME",
  "pitch": "A highly personalized 2-sentence pitch explaining exactly why they will love this based on their highly rated completed items."
}
`;

  let newPick;
  try {
    const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });
    const { text } = await generateText({
      model: groq('llama-3.1-8b-instant'),
      prompt,
      temperature: 0.7,
    });

    const parsed = JSON.parse(text || '{}');

    if (!parsed.id || !parsed.type || !parsed.pitch) {
      console.error('Invalid Groq response format:', parsed);
      return null;
    }

    // Save to database as DailyPick
    newPick = await prisma.dailyPick.create({
      data: {
        userId: session.user.id,
        date: dateString,
        mediaId: parsed.id,
        mediaType: parsed.type as MediaType,
        pitch: parsed.pitch,
      },
    });
  } catch (error) {
    console.error('Error generating daily pick:', error);
    return null; // Fail gracefully
  }

  if (newPick) {
    return <DailyPickCard pick={newPick} />;
  }
  return null;
}
