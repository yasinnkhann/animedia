import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import DailyPickCard from './DailyPickCard';
import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { MediaType } from '@prisma/client';

// Pure helper function outside the component body
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default async function DailyPickServerSection() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  if (!process.env.GROQ_API_KEY)
    return (
      <div className='mb-12 rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-500'>
        Error: GROQ_API_KEY is not set in this environment.
      </div>
    );

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

  // 2. Fetch user's completed items to feed to Groq (Limit to top 30 highly rated)
  const completedMovies = await prisma.movie.findMany({
    where: { userId: session.user.id, status: 'COMPLETED' },
    select: { name: true, rating: true },
    orderBy: { rating: 'desc' },
    take: 30,
  });
  const completedShows = await prisma.show.findMany({
    where: { userId: session.user.id, status: 'COMPLETED' },
    select: { name: true, rating: true },
    orderBy: { rating: 'desc' },
    take: 30,
  });
  const completedGames = await prisma.game.findMany({
    where: { userId: session.user.id, wishlist: false }, // Assume non-wishlist games with rating are played
    select: { name: true, rating: true },
    orderBy: { rating: 'desc' },
    take: 30,
  });

  // 3. Fetch user's full PTW / Backlog to pick from
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
  if (totalPtw === 0)
    return (
      <div className='mb-12 rounded-3xl border border-border bg-card p-6 text-center text-muted-foreground'>
        Add some Movies, Shows, or Games to your Plan to Watch list to get a personalized AI Daily
        Pick!
      </div>
    );

  // 4. Construct prompt for Gemini
  const completedText = `
Movies: ${completedMovies.map(m => `${m.name} (Rated: ${m.rating || 'N/A'}/10)`).join(', ')}
Shows: ${completedShows.map(s => `${s.name} (Rated: ${s.rating || 'N/A'}/10)`).join(', ')}
Games: ${completedGames.map(g => `${g.name} (Rated: ${g.rating || 'N/A'}/10)`).join(', ')}
  `.trim();

  // Randomly sample up to 15 items per category so the AI sees fresh candidates every day
  // without exceeding the 6000 TPM limit
  const sampledMovies = shuffleArray(ptwMovies).slice(0, 15);
  const sampledShows = shuffleArray(ptwShows).slice(0, 15);
  const sampledGames = shuffleArray(ptwGames).slice(0, 15);

  const backlogText = `
Movies: ${sampledMovies.map(m => `${m.name} [ID: ${m.id}]`).join(', ')}
Shows: ${sampledShows.map(s => `${s.name} [ID: ${s.id}]`).join(', ')}
Games: ${sampledGames.map(g => `${g.name} [ID: ${g.id}]`).join(', ')}
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
  let errorMsg = '';
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
      errorMsg = 'AI returned an invalid response format. Check Vercel logs.';
    } else {
      // Save to database as DailyPick
      newPick = await prisma.dailyPick.create({
        data: {
          userId: session.user.id,
          date: dateString,
          mediaId: String(parsed.id),
          mediaType: parsed.type as MediaType,
          pitch: parsed.pitch,
        },
      });
    }
  } catch (error: any) {
    console.error('Error generating daily pick:', error);
    errorMsg = error?.message || 'Unknown error';
  }

  if (errorMsg) {
    return (
      <div className='mb-12 rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-500'>
        Error generating daily pick: {errorMsg}
      </div>
    );
  }

  if (newPick) {
    return <DailyPickCard pick={newPick} />;
  }
  return null;
}
