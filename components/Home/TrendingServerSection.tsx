import { tmdbClient } from '@/lib/api';
import HomeHorizontalScroller from '../HorizontalScroller/Home/HomeHorizontalScroller';
import { CommonMethods } from '@/utils/CommonMethods';

interface Props {
  trending: 'movies' | 'shows';
  time: 'day' | 'week';
}

export default async function TrendingServerSection({ trending, time }: Props) {
  const data = await tmdbClient.getTrending(trending === 'movies' ? 'movie' : 'tv', time);

  const items = data.results ?? [];
  const enrichedItems = items.map((item: any) => {
    return { ...item };
  });

  return <HomeHorizontalScroller items={enrichedItems} />;
}
