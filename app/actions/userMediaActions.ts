'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';
import type { EnrichedMovie, EnrichedShow, EnrichedGame } from '@/models/ts/types';

const getCachedUserMedia = unstable_cache(
  async (
    userId: string
  ): Promise<{
    userMovies: EnrichedMovie[];
    userShows: EnrichedShow[];
    userGames: EnrichedGame[];
  }> => {
    const [userMovies, userShows, userGames] = await Promise.all([
      prisma.movie.findMany({ where: { userId } }),
      prisma.show.findMany({ where: { userId } }),
      prisma.game.findMany({ where: { userId } }),
    ]);

    const enrichedMovies: EnrichedMovie[] = userMovies.map(m => ({
      ...m,
      mediaType: 'MOVIE' as const,
    }));

    const enrichedShows: EnrichedShow[] = userShows.map(s => ({
      ...s,
      mediaType: 'SHOW' as const,
    }));

    const enrichedGames: EnrichedGame[] = userGames.map(g => ({
      ...g,
      mediaType: 'GAME' as const,
    }));

    return { userMovies: enrichedMovies, userShows: enrichedShows, userGames: enrichedGames };
  },
  ['userMedia'],
  {
    revalidate: 3600,
    tags: ['user-media'],
  }
);

export async function fetchUserMedia() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return { userMovies: [], userShows: [], userGames: [] };
    }

    return await getCachedUserMedia(userId);
  } catch (error) {
    console.error('Error fetching user media:', error);
    return { userMovies: [], userShows: [], userGames: [] };
  }
}
