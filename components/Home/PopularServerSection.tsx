import { tmdbClient } from '@/lib/api';
import HomeHorizontalScroller from '../HorizontalScroller/Home/HomeHorizontalScroller';
import { IMediaItem } from '@/models/ts/interfaces';

interface Props {
  popular: 'movies' | 'shows' | 'theatres';
}

export default async function PopularServerSection({ popular }: Props) {
  let items: IMediaItem[] = [];

  try {
    const data = await (popular === 'movies'
      ? tmdbClient.getPopularMovies()
      : popular === 'shows'
        ? tmdbClient.getPopularShows()
        : tmdbClient.getMoviesInTheatres());

    items = data.results ?? [];
  } catch (error) {
    console.error('Error in PopularServerSection:', error);
  }

  return <HomeHorizontalScroller items={items} />;
}
