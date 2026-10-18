'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { getCachedBlurDataUrl } from '@/lib/getImageBlur';
import { CommonMethods } from '@/utils/CommonMethods';
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

    const enrichedMovies: EnrichedMovie[] = await Promise.all(
      userMovies.map(async m => ({
        ...m,
        mediaType: 'MOVIE' as const,
        blurDataUrl: await getCachedBlurDataUrl(
          m.image ? CommonMethods.getTheMovieDbImage(m.image) : undefined
        ),
      }))
    );

    const enrichedShows: EnrichedShow[] = await Promise.all(
      userShows.map(async s => ({
        ...s,
        mediaType: 'SHOW' as const,
        blurDataUrl: await getCachedBlurDataUrl(
          s.image ? CommonMethods.getTheMovieDbImage(s.image) : undefined
        ),
      }))
    );

    const enrichedGames: EnrichedGame[] = await Promise.all(
      userGames.map(async g => ({
        ...g,
        mediaType: 'GAME' as const,
        blurDataUrl: await getCachedBlurDataUrl(
          g.image ? CommonMethods.getIgdbImage(g.image) : undefined
        ),
      }))
    );

    return { userMovies: enrichedMovies, userShows: enrichedShows, userGames: enrichedGames };
  },
  ['userMedia'],
  {
    revalidate: 30,
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
