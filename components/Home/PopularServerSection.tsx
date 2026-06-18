import { tmdbClient } from '@/lib/api';
import HomeHorizontalScroller from '../HorizontalScroller/Home/HomeHorizontalScroller';
import { getCachedBlurDataUrl } from '@/lib/getImageBlur';
import { CommonMethods } from '@/utils/CommonMethods';
import { IMediaItem } from '@/models/ts/interfaces';

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
  const enrichedItems: IMediaItem[] = await Promise.all(
    items.map(async (item: IMediaItem) => {
      const imageUrl = CommonMethods.getTheMovieDbImage(item.poster_path);
      const blurDataUrl = await getCachedBlurDataUrl(
        typeof imageUrl === 'string' ? imageUrl : undefined
      );
      return { ...item, blurDataUrl };
    })
  );

  return <HomeHorizontalScroller items={enrichedItems} />;
}
