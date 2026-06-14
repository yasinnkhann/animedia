import RelatedHorizontalScroller from '@/components/HorizontalScroller/Related/RelatedHorizontalScroller';
import { tmdbClient } from '@/lib/api';

export default async function PersonKnownForMoviesServer({ personId }: { personId: string }) {
  const knownForMovies = await tmdbClient.getPersonMovieCredits(personId);

  if (!knownForMovies?.cast?.length) return null;

  return (
    <section>
      <h3 className='mb-4 ml-8 mt-4'>Known For Movies</h3>
      <RelatedHorizontalScroller
        items={knownForMovies.cast.map((movie: any) => ({
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
