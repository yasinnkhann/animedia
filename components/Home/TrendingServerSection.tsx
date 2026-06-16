import { tmdbClient } from '@/lib/api';
import HomeHorizontalScroller from '../HorizontalScroller/Home/HomeHorizontalScroller';

interface Props {
  trending: 'movies' | 'shows';
  time: 'day' | 'week';
}

export default async function TrendingServerSection({ trending, time }: Props) {
  const data = await tmdbClient.getTrending(trending === 'movies' ? 'movie' : 'tv', time);

  return <HomeHorizontalScroller items={data.results ?? []} />;
}
