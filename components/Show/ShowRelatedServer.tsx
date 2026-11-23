import RelatedHorizontalScroller from '@/components/HorizontalScroller/Related/RelatedHorizontalScroller';
import { tmdbClient } from '@/lib/api';
import _ from 'lodash';

export default async function ShowRelatedServer({ showId }: { showId: string }) {
  const recShows = await tmdbClient.getRecommendedShows(showId);

  if (!recShows?.results || _.isEmpty(recShows.results)) return null;

  return (
    <section className='pb-4'>
      <h3 className='mb-4 ml-8 mt-4'>Recommended Shows</h3>
      <RelatedHorizontalScroller
        items={recShows.results.map((show: any) => ({
          id: show.id,
          imagePath: show.poster_path,
          name: show.name,
          popularity: show.popularity ?? 0,
          type: 'show',
          first_air_date: show.first_air_date,
          vote_average: show.vote_average,
        }))}
        mediaType={'shows'}
      />
    </section>
  );
}
