import { tmdbClient } from '@/lib/api';
import HomeHorizontalScroller from '../HorizontalScroller/Home/HomeHorizontalScroller';

interface Props {
  popular: 'movies' | 'shows' | 'theatres';
}

export default async function PopularServerSection({ popular }: Props) {
  const data = await (popular === 'movies'
    ? tmdbClient.getPopularMovies()
    : popular === 'shows'
      ? tmdbClient.getPopularShows()
      : tmdbClient.getMoviesInTheatres());

  return <HomeHorizontalScroller items={data.results ?? []} />;
}
