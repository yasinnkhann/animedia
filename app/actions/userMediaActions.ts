'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { getCachedBlurDataUrl } from '@/lib/getImageBlur';
import { CommonMethods } from '@/utils/CommonMethods';

import { unstable_cache } from 'next/cache';

const getCachedUserMedia = unstable_cache(
  async (userId: string) => {
    const [userMovies, userShows, userGames] = await Promise.all([
      prisma.movie.findMany({ where: { userId } }),
      prisma.show.findMany({ where: { userId } }),
      prisma.game.findMany({ where: { userId } }),
    ]);

    const enrichedMovies = await Promise.all(
      userMovies.map(async m => ({
        ...m,
        blurDataUrl: await getCachedBlurDataUrl(
          m.image ? CommonMethods.getTheMovieDbImage(m.image) : undefined
        ),
      }))
    );

    const enrichedShows = await Promise.all(
      userShows.map(async s => ({
        ...s,
        blurDataUrl: await getCachedBlurDataUrl(
          s.image ? CommonMethods.getTheMovieDbImage(s.image) : undefined
        ),
      }))
    );

    const enrichedGames = await Promise.all(
      userGames.map(async g => ({
        ...g,
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
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return { userMovies: [], userShows: [], userGames: [] };
  }

  return getCachedUserMedia(userId);
}
