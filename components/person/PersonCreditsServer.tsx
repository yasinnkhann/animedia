import RelatedHorizontalScroller from '@/components/HorizontalScroller/Related/RelatedHorizontalScroller';
import { tmdbClient } from '@/lib/api';
import { IRelatedMedia } from '@/models/ts/interfaces';
import { KNOWN_FOR_MIN_EP_COUNT, KNOWN_FOR_CARDS_LIMIT } from '@/utils/constants';
import _ from 'lodash';

export default async function PersonCreditsServer({ personId }: { personId: string }) {
  const [knownForMoviesData, knownForShowsData] = await Promise.all([
    tmdbClient.getPersonMovieCredits(personId),
    tmdbClient.getPersonShowCredits(personId),
  ]);

  const uniqueMovies: Set<string> = new Set();
  const mappedMoviesCast: IRelatedMedia[] = [];

  for (const castObj of knownForMoviesData?.cast ?? []) {
    if (castObj && !uniqueMovies.has(castObj.id)) {
      uniqueMovies.add(castObj.id);

      mappedMoviesCast.push({
        id: castObj.id,
        imagePath: castObj.poster_path,
        name: castObj.title,
        popularity: castObj.popularity,
        type: 'movie',
      });
    }
  }

  const uniqueShows: Set<string> = new Set();
  const mappedShowsCast: IRelatedMedia[] = [];

  for (const castObj of knownForShowsData?.cast ?? []) {
    if (
      castObj &&
      !uniqueShows.has(castObj.id) &&
      (castObj.episode_count ?? 0) > KNOWN_FOR_MIN_EP_COUNT
    ) {
      uniqueShows.add(castObj.id);

      mappedShowsCast.push({
        id: castObj.id,
        imagePath: castObj.poster_path,
        name: castObj.name,
        popularity: castObj.popularity,
        type: 'show',
      });
    }
  }

  const memoMappedMedia = mappedMoviesCast
    .concat(mappedShowsCast)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, KNOWN_FOR_CARDS_LIMIT);

  if (_.isEmpty(memoMappedMedia)) return null;

  return (
    <div className='mt-8'>
      <h2 className='mb-6 text-2xl font-bold text-gray-800'>Known For</h2>
      <div className='-mx-4 sm:-mx-0'>
        <RelatedHorizontalScroller items={memoMappedMedia} />
      </div>
    </div>
  );
}
