import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { tmdbClient, igdbClient } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { CommonMethods } from '@/utils/CommonMethods';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type')?.toUpperCase();
  const id = searchParams.get('id');
  const season = searchParams.get('season');

  if (!type || !id) {
    return NextResponse.json({ error: 'Missing type or id parameter' }, { status: 400 });
  }

  try {
    if (type === 'MOVIE') {
      const details = await tmdbClient.getMovieDetails(id);
      if (details) {
        const image = details.poster_path || null;
        const release_date = details.release_date || null;
        if (image || release_date) {
          try {
            const updated = await prisma.movie.updateMany({
              where: {
                id: String(id),
                OR: [{ image: null }, { release_date: null }],
              },
              data: {
                ...(image ? { image } : {}),
                ...(release_date ? { release_date } : {}),
              },
            });
            if (updated.count > 0) {
              revalidateTag('user-media', 'max');
            }
          } catch {
            // Ignore backfill errors so read still succeeds
          }
        }
      }
      return NextResponse.json(details);
    }

    if (type === 'SHOW') {
      const details = await tmdbClient.getShowDetails(id);
      if (details) {
        const image = details.poster_path || null;
        const release_date = details.first_air_date || null;
        const total_episodes = CommonMethods.getAiredEpisodeCount(details);
        if (image || release_date || total_episodes !== null) {
          try {
            const updated = await prisma.show.updateMany({
              where: {
                id: String(id),
                OR: [{ image: null }, { release_date: null }, { total_episodes: null }],
              },
              data: {
                ...(image ? { image } : {}),
                ...(release_date ? { release_date } : {}),
                ...(total_episodes !== null ? { total_episodes } : {}),
              },
            });
            if (updated.count > 0) {
              revalidateTag('user-media', 'max');
            }
          } catch {
            // Ignore backfill errors so read still succeeds
          }
        }
      }
      return NextResponse.json(details);
    }

    if (type === 'GAME') {
      const res = await igdbClient.getGameDetails(id);
      const details = (res as any)?.results?.[0] || null;
      if (details) {
        const image = details.coverUrl || null;
        const release_date = details.first_release_date
          ? new Date(details.first_release_date * 1000).toISOString()
          : null;
        if (image || release_date) {
          try {
            const updated = await prisma.game.updateMany({
              where: {
                id: String(id),
                OR: [{ image: null }, { release_date: null }],
              },
              data: {
                ...(image ? { image } : {}),
                ...(release_date ? { release_date } : {}),
              },
            });
            if (updated.count > 0) {
              revalidateTag('user-media', 'max');
            }
          } catch {
            // Ignore backfill errors so read still succeeds
          }
        }
      }
      return NextResponse.json(details);
    }

    if (type === 'SEASON') {
      if (!season) {
        return NextResponse.json({ error: 'Missing season parameter' }, { status: 400 });
      }
      const details = await tmdbClient.getSeasonDetails(id, Number(season));
      return NextResponse.json(details);
    }

    if (type === 'RECOMMENDED_MOVIES') {
      const details = await tmdbClient.getRecommendedMovies(id);
      return NextResponse.json(details);
    }

    return NextResponse.json({ error: 'Unsupported media type' }, { status: 400 });
  } catch (error) {
    console.error(`Error in GET /api/media/details (${type} ${id}):`, error);
    return NextResponse.json(null, { status: 200 });
  }
}
