'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// Global memory cache to prevent redundant DB calls during soft navigations
const mediaCache = new Map<string, { data: any; expiresAt: number }>();
const CACHE_TTL = 30000; // 30 seconds

export async function fetchUserMedia() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return { userMovies: [], userShows: [], userGames: [] };
  }

  const cached = mediaCache.get(userId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const [userMovies, userShows, userGames] = await Promise.all([
    prisma.movie.findMany({ where: { userId } }),
    prisma.show.findMany({ where: { userId } }),
    prisma.game.findMany({ where: { userId } }),
  ]);

  const result = { userMovies, userShows, userGames };
  mediaCache.set(userId, { data: result, expiresAt: Date.now() + CACHE_TTL });

  return result;
}
