import MediaCard from '../MediaCard/MediaCard';
import { useState, useEffect } from 'react';
import type { Movie } from '@prisma/client';
import { deleteMovie } from '@/app/actions/media';
import { getMovieDetailsAction } from '@/lib/actions/tmdbActions';
import { useUserMedia } from '@/components/UserMediaProvider';

import { IoMdClose } from 'react-icons/io';

interface Props {
  movie: Movie;
  index: number;
}

const MyMovieEntry = ({ movie, index }: Props) => {
  const [movieData, setMovieData] = useState<any>({
    poster_path: movie.image ?? null,
    release_date: movie.release_date ?? null,
  });
  const { mutateUserMediaCache, getUserMediaCache } = useUserMedia();

  useEffect(() => {
    if (!movie.image || !movie.release_date) {
      getMovieDetailsAction(movie.id).then(data => {
        if (data) setMovieData(data);
      });
    }
  }, [movie.id, movie.image, movie.release_date]);

  return (
    <MediaCard
      item={{ ...movie, ...movieData }}
      mediaType='MOVIE'
      variant='responsive'
      userStatus={movie.status}
      userRating={movie.rating}
      index={index}
      onRemove={async () => {
        const previousData = getUserMediaCache();
        mutateUserMediaCache((old: any) => {
          if (!old) return old;
          return {
            ...old,
            userMovies: old.userMovies.filter((m: Movie) => m.id !== movie.id),
          };
        });
        try {
          await deleteMovie(movie.id);
        } catch (err) {
          mutateUserMediaCache(() => previousData);
        }
      }}
    />
  );
};

export default MyMovieEntry;
