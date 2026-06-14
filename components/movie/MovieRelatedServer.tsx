import RelatedHorizontalScroller from '@/components/HorizontalScroller/Related/RelatedHorizontalScroller';
import { tmdbClient } from '@/lib/api';
import _ from 'lodash';

export default async function MovieRelatedServer({ movieId }: { movieId: string }) {
  const recMovies = await tmdbClient.getRecommendedMovies(movieId);

  if (!recMovies?.results || _.isEmpty(recMovies.results)) return null;

  return (
    <section className='pb-4'>
      <h3 className='mb-4 ml-8 mt-4'>Recommended Movies</h3>
      <RelatedHorizontalScroller
        items={recMovies.results.map((movie: any) => ({
          id: movie.id,
          imagePath: movie.poster_path,
          name: movie.title,
          popularity: movie.popularity ?? 0,
          type: 'movie',
        }))}
        mediaType={'movies'}
      />
    </section>
  );
}
