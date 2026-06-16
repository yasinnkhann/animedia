import { fetchUserMedia } from '@/app/actions/userMediaActions';
import { getForYouRecommendations } from '@/lib/recommendations';
import ForYouSection from '../HorizontalScroller/ForYou/ForYouSection';

export default async function ForYouServerSection() {
  const userMedia = await fetchUserMedia();

  let forYouData: any[] = [];
  if (userMedia) {
    forYouData = await getForYouRecommendations(
      userMedia.userMovies,
      userMedia.userShows,
      userMedia.userGames
    );
  }

  return <ForYouSection forYouData={forYouData} />;
}
