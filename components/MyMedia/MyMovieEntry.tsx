import MediaCard from '../MediaCard/MediaCard';
import { useState, useEffect } from 'react';
import type { Movie } from '@prisma/client';
import { deleteMovie } from '@/app/actions/media';
import { getMovieDetailsAction } from '@/lib/actions/tmdbActions';
import { useUserMedia } from '@/components/UserMediaProvider';

import { IoMdClose } from 'react-icons/io';

interface Props {
  myMovie: Movie;
}

const MyMovieEntry = ({ myMovie }: Props) => {
  const [movieData, setMovieData] = useState<any>({
    poster_path: myMovie.image ?? null,
    release_date: myMovie.release_date ?? null,
  });
  const { mutateUserMediaCache, getUserMediaCache } = useUserMedia();

  useEffect(() => {
    if (!myMovie.image || !myMovie.release_date) {
      getMovieDetailsAction(myMovie.id).then(data => {
        if (data) setMovieData(data);
      });
    }
  }, [myMovie.id, myMovie.image, myMovie.release_date]);

  return (
    <MediaCard
      item={{ ...myMovie, ...movieData }}
      mediaType='MOVIE'
      userRating={myMovie.rating}
      onRemove={async () => {
        const previousData = getUserMediaCache();
        mutateUserMediaCache((old: any) => {
          if (!old) return old;
          return {
            ...old,
            userMovies: old.userMovies.filter((m: Movie) => m.id !== myMovie.id),
          };
        });
        try {
          await deleteMovie(myMovie.id);
        } catch (err) {
          mutateUserMediaCache(() => previousData);
        }
      }}
    />
  );
};

export default MyMovieEntry;
