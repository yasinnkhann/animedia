'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { revalidatePath, revalidateTag } from 'next/cache';
import { WatchStatus } from '@prisma/client';
import { getMovieDetailsAction, getShowDetailsAction } from '@/lib/actions/tmdbActions';
import { getGameDetailsAction } from '@/lib/actions/igdbActions';
import { CommonMethods } from '@/utils/CommonMethods';

async function logActivity(
  userId: string,
  type: 'ADDED' | 'RATED' | 'STATUS_CHANGED',
  mediaType: 'MOVIE' | 'SHOW' | 'GAME',
  mediaId: string,
  mediaTitle: string,
  metadata?: any
) {
  try {
    let mediaImage = null;
    if (mediaType === 'MOVIE') {
      const details = await getMovieDetailsAction(mediaId);
      if (details?.poster_path) mediaImage = CommonMethods.getTheMovieDbImage(details.poster_path);
    } else if (mediaType === 'SHOW') {
      const details = await getShowDetailsAction(mediaId);
      if (details?.poster_path) mediaImage = CommonMethods.getTheMovieDbImage(details.poster_path);
    } else if (mediaType === 'GAME') {
      const details = await getGameDetailsAction(mediaId);
      if (details?.coverUrl) mediaImage = details.coverUrl;
    }

    await prisma.activity.create({
      data: {
        userId,
        type,
        mediaType,
        mediaId,
        mediaTitle,
        mediaImage,
        metadata: metadata ? metadata : undefined,
      },
    });
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
}

export async function addMovie(movieId: string, movieName: string, watchStatus: WatchStatus) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Not authenticated');

  const movie = await prisma.movie.upsert({
    where: {
      id_userId: {
        id: String(movieId),
        userId: session.user.id,
      },
    },
    update: {
      name: movieName,
      status: watchStatus,
    },
    create: {
      id: String(movieId),
      name: movieName,
      status: watchStatus,
      userId: session.user.id,
    },
  });

  // Background activity logging
  logActivity(session.user.id, 'ADDED', 'MOVIE', String(movieId), movieName, {
    status: watchStatus,
  });

  revalidatePath('/');
  // @ts-ignore
  revalidateTag('user-media');
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

  const show = await prisma.show.upsert({
    where: {
      id_userId: {
        id: String(showId),
        userId: session.user.id,
      },
    },
    update: {
      name: showName,
      status: watchStatus,
      current_episode: currentEpisode ?? 0,
    },
    create: {
      id: String(showId),
      name: showName,
      status: watchStatus,
      current_episode: currentEpisode ?? 0,
      userId: session.user.id,
    },
  });

  logActivity(session.user.id, 'ADDED', 'SHOW', String(showId), showName, { status: watchStatus });

  revalidatePath('/');
  // @ts-ignore
  revalidateTag('user-media');
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

  const game = await prisma.game.upsert({
    where: {
      id_userId: {
        id: String(gameId),
        userId: session.user.id,
      },
    },
    update: {
      name: gameName,
      wishlist: wishlist ?? false,
      rating,
    },
    create: {
      id: String(gameId),
      name: gameName,
      wishlist: wishlist ?? false,
      rating,
      userId: session.user.id,
    },
  });

  logActivity(session.user.id, 'ADDED', 'GAME', String(gameId), gameName);

  revalidatePath('/');
  // @ts-ignore
  revalidateTag('user-media');
  return game;
}

export async function updateMovie(movieId: string, watchStatus: WatchStatus, movieRating?: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Not authenticated');

  const movie = await prisma.movie.update({
    where: {
      id_userId: {
        id: String(movieId),
        userId: session.user.id,
      },
    },
    data: {
      status: watchStatus,
      rating: movieRating,
    },
  });

  const type = movieRating ? 'RATED' : 'STATUS_CHANGED';
  logActivity(session.user.id, type, 'MOVIE', String(movieId), movie.name, {
    status: watchStatus,
    rating: movieRating,
  });

  revalidatePath('/');
  // @ts-ignore
  revalidateTag('user-media');
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
        id: String(showId),
        userId: session.user.id,
      },
    },
    data: {
      status: watchStatus,
      rating: showRating,
      current_episode: currentEpisode,
    },
  });

  const type = showRating ? 'RATED' : 'STATUS_CHANGED';
  logActivity(session.user.id, type, 'SHOW', String(showId), show.name, {
    status: watchStatus,
    rating: showRating,
    current_episode: currentEpisode,
  });

  revalidatePath('/');
  // @ts-ignore
  revalidateTag('user-media');
  return show;
}

export async function updateGame(gameId: string, wishlist?: boolean, rating?: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Not authenticated');

  const game = await prisma.game.update({
    where: {
      id_userId: {
        id: String(gameId),
        userId: session.user.id,
      },
    },
    data: {
      wishlist,
      rating,
    },
  });

  const type = rating ? 'RATED' : 'STATUS_CHANGED';
  logActivity(session.user.id, type, 'GAME', String(gameId), game.name, { wishlist, rating });

  revalidatePath('/');
  // @ts-ignore
  revalidateTag('user-media');
  return game;
}

export async function deleteMovie(movieId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Not authenticated');

  const movie = await prisma.movie.delete({
    where: {
      id_userId: {
        id: String(movieId),
        userId: session.user.id,
      },
    },
  });
  revalidatePath('/');
  // @ts-ignore
  revalidateTag('user-media');
  return movie;
}

export async function deleteShow(showId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Not authenticated');

  const show = await prisma.show.delete({
    where: {
      id_userId: {
        id: String(showId),
        userId: session.user.id,
      },
    },
  });
  revalidatePath('/');
  // @ts-ignore
  revalidateTag('user-media');
  return show;
}

export async function deleteGame(gameId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Not authenticated');

  const game = await prisma.game.delete({
    where: {
      id_userId: {
        id: String(gameId),
        userId: session.user.id,
      },
    },
  });
  revalidatePath('/');
  // @ts-ignore
  revalidateTag('user-media');
  return game;
}
