import { fetchUserMedia } from '@/app/actions/userMediaActions';
import { getForYouRecommendations } from '@/lib/recommendations';
import ForYouSection from '../HorizontalScroller/ForYou/ForYouSection';
import { CommonMethods } from '@/utils/CommonMethods';

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

  const enrichedItems = forYouData.map((item: any) => {
    return { ...item };
  });

  return <ForYouSection forYouData={enrichedItems} />;
}
