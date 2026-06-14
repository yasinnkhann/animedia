import MediaCastHorizontalScroller from '@/components/HorizontalScroller/MediaCast/MediaCastHorizontalScroller';
import { tmdbClient } from '@/lib/api';
import { RESULTS_PER_PAGE } from '@/utils/constants';
import { ICast } from '@ts/interfaces';
import _ from 'lodash';

export default async function MovieCastServer({ movieId }: { movieId: string }) {
  const moviesCastCrew = await tmdbClient.getMovieCredits(movieId);

  if (!moviesCastCrew?.cast?.length) return null;

  return (
    <section>
      <h3 className='mb-4 ml-8'>Cast</h3>
      <MediaCastHorizontalScroller
        items={
          _.uniqBy(moviesCastCrew.cast, 'id')
            .map((cast: any) => ({
              id: cast.id,
              name: cast.name,
              character: cast.character,
              profile_path: cast.profile_path,
              type: 'character',
            }))
            .slice(0, RESULTS_PER_PAGE) as ICast[]
        }
      />
    </section>
  );
}
