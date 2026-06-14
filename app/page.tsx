import HomePageClient from '../components/HomePageClient';
import { tmdbClient } from '@/lib/api';

export const metadata = {
  title: 'Home',
};

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const popular =
    searchParams.popular === 'shows'
      ? 'shows'
      : searchParams.popular === 'theatres'
        ? 'theatres'
        : 'movies';
  const trending = searchParams.trending === 'shows' ? 'shows' : 'movies';
  const time = searchParams.time === 'week' ? 'week' : 'day';

  const [popularData, trendingData] = await Promise.all([
    popular === 'movies'
      ? tmdbClient.getPopularMovies()
      : popular === 'shows'
        ? tmdbClient.getPopularShows()
        : tmdbClient.getMoviesInTheatres(),
    tmdbClient.getTrending(trending === 'movies' ? 'movie' : 'tv', time),
  ]);

  return (
    <HomePageClient
      popular={popular}
      trending={trending}
      time={time}
      popularData={popularData.results ?? []}
      trendingData={trendingData.results ?? []}
    />
  );
}
