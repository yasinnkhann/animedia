'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function fetchUserMedia() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return { userMovies: [], userShows: [], userGames: [] };
  }

  const [userMovies, userShows, userGames] = await Promise.all([
    prisma.movie.findMany({ where: { userId } }),
    prisma.show.findMany({ where: { userId } }),
    prisma.game.findMany({ where: { userId } }),
  ]);

  return { userMovies, userShows, userGames };
}
