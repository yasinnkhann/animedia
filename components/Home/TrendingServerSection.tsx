import { tmdbClient } from '@/lib/api';
import HomeHorizontalScroller from '../HorizontalScroller/Home/HomeHorizontalScroller';
import { IMediaItem } from '@/models/ts/interfaces';

interface Props {
  trending: 'movies' | 'shows';
  time: 'day' | 'week';
}

export default async function TrendingServerSection({ trending, time }: Props) {
  let items: IMediaItem[] = [];

  try {
    const data = await tmdbClient.getTrending(trending === 'movies' ? 'movie' : 'tv', time);
    items = data.results ?? [];
  } catch (error) {
    console.error('Error in TrendingServerSection:', error);
  }

  return <HomeHorizontalScroller items={items} />;
}
