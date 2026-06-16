import HomePageClient from '../components/HomePageClient';
import { tmdbClient } from '@/lib/api';
import { fetchUserMedia } from '@/app/actions/userMediaActions';
import { getForYouRecommendations } from '@/lib/recommendations';

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

  const [popularData, trendingData, userMedia] = await Promise.all([
    popular === 'movies'
      ? tmdbClient.getPopularMovies()
      : popular === 'shows'
        ? tmdbClient.getPopularShows()
        : tmdbClient.getMoviesInTheatres(),
    tmdbClient.getTrending(trending === 'movies' ? 'movie' : 'tv', time),
    fetchUserMedia(),
  ]);

  let forYouData: any[] = [];
  if (userMedia) {
    forYouData = await getForYouRecommendations(
      userMedia.userMovies,
      userMedia.userShows,
      userMedia.userGames
    );
  }

  return (
    <HomePageClient
      popular={popular}
      trending={trending}
      time={time}
      popularData={popularData.results ?? []}
      trendingData={trendingData.results ?? []}
      forYouData={forYouData}
    />
  );
}
