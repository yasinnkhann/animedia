import { NextResponse } from 'next/server';
import { tmdbClient } from '@/lib/api';

export const revalidate = 86400; // Cache for 24 hours at the Edge

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type')?.toUpperCase();
  const id = searchParams.get('id');

  if (!type || !id || (type !== 'MOVIE' && type !== 'SHOW')) {
    return NextResponse.json(
      { error: 'Missing or invalid type/id parameter (type must be MOVIE or SHOW)' },
      { status: 400 }
    );
  }

  try {
    const data =
      type === 'MOVIE'
        ? await tmdbClient.getMovieWatchProviders(id)
        : await tmdbClient.getShowWatchProviders(id);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching watch providers:', error);
    return NextResponse.json({ id, results: {} }, { status: 200 });
  }
}
