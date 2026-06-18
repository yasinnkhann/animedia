import { tmdbClient } from '@/lib/api';
import HomeHorizontalScroller from '../HorizontalScroller/Home/HomeHorizontalScroller';
import { CommonMethods } from '@/utils/CommonMethods';

interface Props {
  popular: 'movies' | 'shows' | 'theatres';
}

export default async function PopularServerSection({ popular }: Props) {
  const data = await (popular === 'movies'
    ? tmdbClient.getPopularMovies()
    : popular === 'shows'
      ? tmdbClient.getPopularShows()
      : tmdbClient.getMoviesInTheatres());

  const items = data.results ?? [];
  const enrichedItems = items.map((item: any) => {
    return { ...item };
  });

  return <HomeHorizontalScroller items={enrichedItems} />;
}
