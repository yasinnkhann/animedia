import { NextResponse } from 'next/server';
import { tmdbClient } from '@/lib/api';
import { getCachedBlurDataUrl } from '@/lib/getImageBlur';
import { CommonMethods } from '@/utils/CommonMethods';
import { IMediaItem } from '@/models/ts/interfaces';

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

    const items = data.results ?? [];
    const enrichedItems: IMediaItem[] = await Promise.all(
      items.map(async (item: IMediaItem) => {
        const imageUrl = CommonMethods.getTheMovieDbImage(item.poster_path);
        const blurDataUrl = await getCachedBlurDataUrl(
          typeof imageUrl === 'string' ? imageUrl : undefined
        );
        return { ...item, blurDataUrl };
      })
    );

    return NextResponse.json(enrichedItems);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch popular media' }, { status: 500 });
  }
}
