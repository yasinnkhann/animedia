'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';
import { WatchStatus } from '@prisma/client';

export async function addMovie(movieId: string, movieName: string, watchStatus: WatchStatus) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Not authenticated');

  const movie = await prisma.movie.create({
    data: {
      id: movieId,
      name: movieName,
      status: watchStatus,
      userId: session.user.id,
    },
  });
  revalidatePath('/');
  return movie;
}

export async function addShow(
  showId: string,
  showName: string,
  watchStatus: WatchStatus,
  currentEpisode?: number
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Not authenticated');

  const show = await prisma.show.create({
    data: {
      id: showId,
      name: showName,
      status: watchStatus,
      current_episode: currentEpisode ?? 0,
      userId: session.user.id,
    },
  });
  revalidatePath('/');
  return show;
}

export async function addGame(
  gameId: string,
  gameName: string,
  wishlist?: boolean,
  rating?: number
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Not authenticated');

  const game = await prisma.game.create({
    data: {
      id: gameId,
      name: gameName,
      wishlist: wishlist ?? false,
      rating,
      userId: session.user.id,
    },
  });
  revalidatePath('/');
  return game;
}

export async function updateMovie(movieId: string, watchStatus: WatchStatus, movieRating?: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Not authenticated');

  const movie = await prisma.movie.update({
    where: {
      id_userId: {
        id: movieId,
        userId: session.user.id,
      },
    },
    data: {
      status: watchStatus,
      rating: movieRating,
    },
  });
  revalidatePath('/');
  return movie;
}

export async function updateShow(
  showId: string,
  watchStatus: WatchStatus,
  showRating?: number,
  currentEpisode?: number
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Not authenticated');

  const show = await prisma.show.update({
    where: {
      id_userId: {
        id: showId,
        userId: session.user.id,
      },
    },
    data: {
      status: watchStatus,
      rating: showRating,
      current_episode: currentEpisode,
    },
  });
  revalidatePath('/');
  return show;
}

export async function updateGame(gameId: string, wishlist?: boolean, rating?: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Not authenticated');

  const game = await prisma.game.update({
    where: {
      id_userId: {
        id: gameId,
        userId: session.user.id,
      },
    },
    data: {
      wishlist,
      rating,
    },
  });
  revalidatePath('/');
  return game;
}

export async function deleteMovie(movieId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Not authenticated');

  const movie = await prisma.movie.delete({
    where: {
      id_userId: {
        id: movieId,
        userId: session.user.id,
      },
    },
  });
  revalidatePath('/');
  return movie;
}

export async function deleteShow(showId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Not authenticated');

  const show = await prisma.show.delete({
    where: {
      id_userId: {
        id: showId,
        userId: session.user.id,
      },
    },
  });
  revalidatePath('/');
  return show;
}

export async function deleteGame(gameId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Not authenticated');

  const game = await prisma.game.delete({
    where: {
      id_userId: {
        id: gameId,
        userId: session.user.id,
      },
    },
  });
  revalidatePath('/');
  return game;
}
