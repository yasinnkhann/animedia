import { tmdbClient } from '@/lib/api';
import HomeHorizontalScroller from '../HorizontalScroller/Home/HomeHorizontalScroller';
import { getCachedBlurDataUrl } from '@/lib/getImageBlur';
import { CommonMethods } from '@/utils/CommonMethods';
import { IMediaItem } from '@/models/ts/interfaces';

interface Props {
  trending: 'movies' | 'shows';
  time: 'day' | 'week';
}

export default async function TrendingServerSection({ trending, time }: Props) {
  let enrichedItems: IMediaItem[] = [];

  try {
    const data = await tmdbClient.getTrending(trending === 'movies' ? 'movie' : 'tv', time);

    const items = data.results ?? [];
    enrichedItems = await Promise.all(
      items.map(async (item: IMediaItem) => {
        const imageUrl = CommonMethods.getTheMovieDbImage(item.poster_path);
        const blurDataUrl = await getCachedBlurDataUrl(
          typeof imageUrl === 'string' ? imageUrl : undefined
        );
        return { ...item, blurDataUrl };
      })
    );
  } catch (error) {
    console.error('Error in TrendingServerSection:', error);
  }

  return <HomeHorizontalScroller items={enrichedItems} />;
}
