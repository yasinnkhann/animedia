import { NextResponse } from 'next/server';
import { tmdbClient } from '@/lib/api';

export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'movies';
  const time = searchParams.get('time') || 'day';

  try {
    const data = await tmdbClient.getTrending(
      type === 'movies' ? 'movie' : 'tv',
      time as 'day' | 'week'
    );

    return NextResponse.json(data.results ?? []);
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to fetch trending media' }, { status: 500 });
  }
}
