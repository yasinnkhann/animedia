import { NextResponse } from 'next/server';
import { tmdbClient } from '@/lib/api';

export const revalidate = 3600; // Cache API response at the Edge for 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'movies';

  try {
    const data = await (type === 'shows'
      ? tmdbClient.getPopularShows()
      : type === 'theatres'
        ? tmdbClient.getMoviesInTheatres()
        : tmdbClient.getPopularMovies());

    return NextResponse.json(data.results ?? []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch popular media' }, { status: 500 });
  }
}
