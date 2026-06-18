import { tmdbClient } from '@/lib/api';
import HomeHorizontalScroller from '../HorizontalScroller/Home/HomeHorizontalScroller';
import { getCachedBlurDataUrl } from '@/lib/getImageBlur';
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
  const enrichedItems = await Promise.all(
    items.map(async (item: any) => {
      const imageUrl = CommonMethods.getTheMovieDbImage(item.poster_path);
      const blurDataUrl = await getCachedBlurDataUrl(imageUrl);
      return { ...item, blurDataUrl };
    })
  );

  return <HomeHorizontalScroller items={enrichedItems} />;
}
