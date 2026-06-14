import { prisma } from '../prisma';

export async function getUserShows(userId: string | undefined | null) {
  if (!userId) return [];
  return prisma.show.findMany({
    where: { userId },
  });
}

export async function getUserMovies(userId: string | undefined | null) {
  if (!userId) return [];
  return prisma.movie.findMany({
    where: { userId },
  });
}

export async function getUserGames(userId: string | undefined | null) {
  if (!userId) return [];
  return prisma.game.findMany({
    where: { userId },
  });
}
