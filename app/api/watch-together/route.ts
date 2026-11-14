import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { calculateWatchTogetherBlend } from '@/lib/watchTogether';
import { selectSeedItems } from '@/lib/recommendations';
import { tmdbClient } from '@/lib/api';
import _ from 'lodash';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const friendId = searchParams.get('friendId');

    if (!friendId) {
      return NextResponse.json({ error: 'friendId parameter is required' }, { status: 400 });
    }

    if (friendId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot watch together with yourself. Choose a friend!' },
        { status: 400 }
      );
    }

    // Fetch both users
    const [currentUser, friend] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, name: true, image: true },
      }),
      prisma.user.findUnique({
        where: { id: friendId },
        select: { id: true, name: true, image: true },
      }),
    ]);

    if (!friend) {
      return NextResponse.json({ error: 'Friend not found' }, { status: 404 });
    }

    // Fetch libraries for both users
    const [u1Movies, u1Shows, u2Movies, u2Shows] = await Promise.all([
      prisma.movie.findMany({ where: { userId: session.user.id } }),
      prisma.show.findMany({ where: { userId: session.user.id } }),
      prisma.movie.findMany({ where: { userId: friendId } }),
      prisma.show.findMany({ where: { userId: friendId } }),
    ]);

    // Calculate core blend
    const blend = calculateWatchTogetherBlend(
      { movies: u1Movies, shows: u1Shows },
      { movies: u2Movies, shows: u2Shows }
    );

    // Identify items missing poster or release date to backfill concurrently
    const allBlendItems = [
      ...blend.mutualPlanToWatch,
      ...blend.mutualFavorites,
      ...blend.friendPicksForYou,
      ...blend.yourPicksForFriend,
    ];

    const uniqueMissingMap = new Map<string, { id: string; mediaType: 'movie' | 'show' }>();
    for (const item of allBlendItems) {
      if (!item.image || !item.release_date) {
        const key = `${item.mediaType}-${item.id}`;
        if (!uniqueMissingMap.has(key)) {
          uniqueMissingMap.set(key, { id: item.id, mediaType: item.mediaType });
        }
      }
    }

    const backfillPromises: Promise<void>[] = [];
    for (const { id, mediaType } of Array.from(uniqueMissingMap.values()).slice(0, 15)) {
      backfillPromises.push(
        (async () => {
          try {
            if (mediaType === 'movie') {
              const details = await tmdbClient.getMovieDetails(id);
              if (details) {
                const poster = details.poster_path || null;
                const release = details.release_date || null;
                for (const item of allBlendItems) {
                  if (item.id === id && item.mediaType === 'movie') {
                    if (poster) {
                      item.image = poster;
                      item.poster_path = poster;
                    }
                    if (release) {
                      item.release_date = release;
                    }
                  }
                }
                if (poster || release) {
                  prisma.movie
                    .updateMany({
                      where: {
                        id: String(id),
                        OR: [{ image: null }, { release_date: null }],
                      },
                      data: {
                        ...(poster ? { image: poster } : {}),
                        ...(release ? { release_date: release } : {}),
                      },
                    })
                    .catch(() => {});
                }
              }
            } else if (mediaType === 'show') {
              const details = await tmdbClient.getShowDetails(id);
              if (details) {
                const poster = details.poster_path || null;
                const release = details.first_air_date || null;
                for (const item of allBlendItems) {
                  if (item.id === id && item.mediaType === 'show') {
                    if (poster) {
                      item.image = poster;
                      item.poster_path = poster;
                    }
                    if (release) {
                      item.release_date = release;
                      item.first_air_date = release;
                    }
                  }
                }
                if (poster || release) {
                  prisma.show
                    .updateMany({
                      where: {
                        id: String(id),
                        OR: [{ image: null }, { release_date: null }],
                      },
                      data: {
                        ...(poster ? { image: poster } : {}),
                        ...(release ? { release_date: release } : {}),
                      },
                    })
                    .catch(() => {});
                }
              }
            }
          } catch {
            // Ignore individual backfill error
          }
        })()
      );
    }

    // Generate fresh joint recommendations using top seeds from BOTH users
    const u1MovieSeeds = selectSeedItems(u1Movies, 2);
    const u2MovieSeeds = selectSeedItems(u2Movies, 2);
    const u1ShowSeeds = selectSeedItems(u1Shows, 2);
    const u2ShowSeeds = selectSeedItems(u2Shows, 2);

    const movieSeeds = [...u1MovieSeeds, ...u2MovieSeeds].slice(0, 4);
    const showSeeds = [...u1ShowSeeds, ...u2ShowSeeds].slice(0, 4);

    const recPromises: Promise<any>[] = [];

    for (const seed of movieSeeds) {
      recPromises.push(
        tmdbClient
          .getRecommendedMovies(seed.id)
          .then(res =>
            (res.results || []).slice(0, 4).map((m: any) => ({
              ...m,
              mediaType: 'movie',
              recommendedReason: `Blended taste match from ${seed.name}`,
            }))
          )
          .catch(() => [])
      );
    }

    for (const seed of showSeeds) {
      recPromises.push(
        tmdbClient
          .getRecommendedShows(seed.id)
          .then(res =>
            (res.results || []).slice(0, 4).map((s: any) => ({
              ...s,
              mediaType: 'show',
              recommendedReason: `Blended taste match from ${seed.name}`,
            }))
          )
          .catch(() => [])
      );
    }

    const [recResults] = await Promise.all([
      Promise.all(recPromises),
      Promise.allSettled(backfillPromises),
    ]);
    const allRecs = recResults.flat();

    // Filter out titles tracked by EITHER user
    const trackedIds = new Set([
      ...u1Movies.map(m => String(m.id)),
      ...u1Shows.map(s => String(s.id)),
      ...u2Movies.map(m => String(m.id)),
      ...u2Shows.map(s => String(s.id)),
    ]);

    const uniqueFreshRecs = _.uniqBy(
      allRecs.filter((item: any) => !trackedIds.has(String(item.id))),
      (item: any) => `${item.mediaType}-${item.id}`
    );

    return NextResponse.json({
      currentUser,
      friend,
      blend,
      blendedRecommendations: _.shuffle(uniqueFreshRecs).slice(0, 12),
    });
  } catch (error: any) {
    console.error('Error calculating Watch Together:', error);
    return NextResponse.json(
      { error: 'Failed to calculate Watch Together blend' },
      { status: 500 }
    );
  }
}
