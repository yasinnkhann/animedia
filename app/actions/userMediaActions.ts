'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

import { unstable_cache } from 'next/cache';

const getCachedUserMedia = unstable_cache(
  async (userId: string) => {
    const [userMovies, userShows, userGames] = await Promise.all([
      prisma.movie.findMany({ where: { userId } }),
      prisma.show.findMany({ where: { userId } }),
      prisma.game.findMany({ where: { userId } }),
    ]);
    return { userMovies, userShows, userGames };
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
