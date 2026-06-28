'use client';

import { useQuery } from '@tanstack/react-query';
import RelatedHorizontalScroller from '@/components/HorizontalScroller/Related/RelatedHorizontalScroller';
import { getRecommendedMoviesAction } from '@/lib/actions/tmdbActions';
import HorizontalScrollerSkeleton from '@/components/Skeletons/HorizontalScrollerSkeleton';
import _ from 'lodash';
import { useMounted } from '@/hooks/useMounted';

export default function MovieRelatedClient({ movieId }: { movieId: string }) {
  const isMounted = useMounted();
  const { data: recMovies, isLoading } = useQuery({
    queryKey: ['movie-recommendations', movieId],
    queryFn: () => getRecommendedMoviesAction(movieId),
    enabled: !!movieId && isMounted, // wait for mount
  });

  if (!isMounted || isLoading) {
    return <HorizontalScrollerSkeleton />;
  }

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
          release_date: movie.release_date,
          vote_average: movie.vote_average,
        }))}
        mediaType={'movies'}
      />
    </section>
  );
}
