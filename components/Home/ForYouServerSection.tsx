import { fetchUserMedia } from '@/app/actions/userMediaActions';
import { getForYouRecommendations } from '@/lib/recommendations';
import ForYouSection from '../HorizontalScroller/ForYou/ForYouSection';
import { IMediaItem } from '@/models/ts/interfaces';

export default async function ForYouServerSection() {
  let forYouData: IMediaItem[] = [];

  try {
    const userMedia = await fetchUserMedia();

    if (userMedia) {
      forYouData = await getForYouRecommendations(
        userMedia.userMovies,
        userMedia.userShows,
        userMedia.userGames
      );
    }
  } catch (error) {
    console.error('Error in ForYouServerSection:', error);
    return null;
  }

  return <ForYouSection forYouData={forYouData} />;
}
