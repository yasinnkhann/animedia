import { NextResponse } from 'next/server';
import { tmdbClient } from '@/lib/api';
import { getCachedBlurDataUrl } from '@/lib/getImageBlur';
import { CommonMethods } from '@/utils/CommonMethods';
import { IMediaItem } from '@/models/ts/interfaces';

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
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to fetch trending media' }, { status: 500 });
  }
}
