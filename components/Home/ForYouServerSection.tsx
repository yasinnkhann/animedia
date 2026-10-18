import { fetchUserMedia } from '@/app/actions/userMediaActions';
import { getForYouRecommendations } from '@/lib/recommendations';
import ForYouSection from '../HorizontalScroller/ForYou/ForYouSection';
import { getCachedBlurDataUrl } from '@/lib/getImageBlur';
import { CommonMethods } from '@/utils/CommonMethods';
import { IMediaItem } from '@/models/ts/interfaces';

export default async function ForYouServerSection() {
  let enrichedItems: IMediaItem[] = [];

  try {
    const userMedia = await fetchUserMedia();

    let forYouData: IMediaItem[] = [];
    if (userMedia) {
      forYouData = await getForYouRecommendations(
        userMedia.userMovies,
        userMedia.userShows,
        userMedia.userGames
      );
    }

    enrichedItems = await Promise.all(
      forYouData.map(async (item: IMediaItem) => {
        const isGame = item.mediaType === 'game';
        let imageUrl = isGame ? item.coverUrl : CommonMethods.getTheMovieDbImage(item.poster_path);
        if (typeof imageUrl === 'string' && imageUrl.startsWith('//')) {
          imageUrl = `https:${imageUrl}`;
        }

        const blurDataUrl = await getCachedBlurDataUrl(imageUrl);
        return { ...item, blurDataUrl };
      })
    );
  } catch (error) {
    console.error('Error in ForYouServerSection:', error);
    return null;
  }

  return <ForYouSection forYouData={enrichedItems} />;
}
