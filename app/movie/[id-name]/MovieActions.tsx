'use client';

import { useState, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { watchStatusOptions, ratingOptions } from '@/models/dropDownOptions';
import type { WatchStatus, Movie } from '@prisma/client';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useUserMedia } from '@/components/UserMediaProvider';
import { addMovie, updateMovie, deleteMovie } from '@/app/actions/media';

interface Props {
  movieId: string;
  movieTitle: string;
}

export default function MovieActions({ movieId, movieTitle }: Props) {
  const { data: session, status } = useSession();
  const [watchStatusInput, setWatchStatus] = useState<WatchStatus | 'NOT_WATCHING' | null>(null);
  const [ratingInput, setRating] = useState<number | string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { userMovies, isLoading, mutateUserMediaCache, getUserMediaCache } = useUserMedia();
  const usersMovie = userMovies?.find(movie => movie.id === movieId);

  const watchStatus = watchStatusInput ?? usersMovie?.status ?? 'NOT_WATCHING';
  const rating = ratingInput ?? usersMovie?.rating ?? ratingOptions[0].value;

  const handleChangeWatchStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!movieId || !movieTitle) return;

    const { value } = e.target;
    const newWatchStatus = value as WatchStatus | 'NOT_WATCHING';

    setWatchStatus(newWatchStatus);

    startTransition(async () => {
      const previousData = getUserMediaCache();
      mutateUserMediaCache((old: any) => {
        if (!old) return old;
        const newMovies = [...old.userMovies];
        const index = newMovies.findIndex((m: Movie) => m.id === movieId);
        if (newWatchStatus === 'NOT_WATCHING') {
          if (index !== -1) newMovies.splice(index, 1);
        } else {
          if (index !== -1) {
            newMovies[index] = { ...newMovies[index], status: newWatchStatus };
          } else {
            newMovies.push({
              id: movieId,
              name: movieTitle,
              status: newWatchStatus,
              rating: rating === '' ? null : rating,
            });
          }
        }
        return { ...old, userMovies: newMovies };
      });

      try {
        if (usersMovie) {
          if (newWatchStatus === 'NOT_WATCHING') {
            await deleteMovie(movieId);
          } else if (newWatchStatus === 'PLAN_TO_WATCH') {
            await updateMovie(movieId, newWatchStatus as WatchStatus, undefined);
          } else {
            await updateMovie(
              movieId,
              newWatchStatus as WatchStatus,
              usersMovie.rating ?? undefined
            );
          }
        } else {
          if (newWatchStatus !== 'NOT_WATCHING') {
            await addMovie(movieId, movieTitle, newWatchStatus as WatchStatus);
          }
        }
      } catch (err) {
        mutateUserMediaCache(() => previousData);
        setWatchStatus(watchStatus);
      }
    });
  };

  const handleChangeRating = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!movieId || watchStatus === 'NOT_WATCHING') return;

    const { value } = e.target;
    setRating(value === '' ? '' : +value);

    startTransition(async () => {
      const previousData = getUserMediaCache();
      const parsedRating = isNaN(parseInt(value)) ? undefined : parseInt(value);

      mutateUserMediaCache((old: any) => {
        if (!old) return old;
        const newMovies = [...old.userMovies];
        const index = newMovies.findIndex((m: Movie) => m.id === movieId);
        if (index !== -1) {
          newMovies[index] = { ...newMovies[index], rating: parsedRating ?? null };
        }
        return { ...old, userMovies: newMovies };
      });

      try {
        await updateMovie(movieId, watchStatus as WatchStatus, parsedRating);
      } catch (err) {
        mutateUserMediaCache(() => previousData);
        setRating(rating);
      }
    });
  };

  if (status !== 'authenticated' || !session) return null;

  if (isLoading) {
    return (
      <section className='my-4 flex items-center space-x-4'>
        <div className='relative'>
          <select
            disabled
            className='appearance-none rounded border border-border bg-transparent px-2 py-2 pr-8 leading-tight text-muted-foreground focus:outline-none'
          >
            <option>Loading...</option>
          </select>
          <IoMdArrowDropdown className='pointer-events-none absolute inset-y-0 right-0 mr-3 mt-3 text-muted-foreground' />
        </div>
        <div className='relative'>
          <select
            disabled
            className='appearance-none rounded border border-border bg-transparent px-2 py-2 pr-8 leading-tight text-muted-foreground focus:outline-none'
          >
            <option>Loading...</option>
          </select>
          <IoMdArrowDropdown className='pointer-events-none absolute inset-y-0 right-0 mr-3 mt-3 text-muted-foreground' />
        </div>
      </section>
    );
  }

  return (
    <section className='my-4 flex items-center space-x-4'>
      <div className='relative'>
        <select
          className='appearance-none rounded border border-border bg-transparent px-2 py-2 pr-8 leading-tight text-foreground focus:bg-transparent focus:outline-none [&>option]:bg-background'
          value={watchStatus}
          onChange={handleChangeWatchStatus}
          disabled={false}
        >
          {watchStatusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
        <IoMdArrowDropdown className='pointer-events-none absolute inset-y-0 right-0 mr-3 mt-3 text-foreground' />
      </div>

      <div className='relative'>
        <select
          className='appearance-none rounded border border-border bg-transparent px-2 py-2 pr-8 leading-tight text-foreground focus:bg-transparent focus:outline-none [&>option]:bg-background'
          value={rating}
          onChange={handleChangeRating}
          disabled={watchStatus === 'NOT_WATCHING' || watchStatus === 'PLAN_TO_WATCH'}
        >
          {ratingOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
        <IoMdArrowDropdown className='pointer-events-none absolute inset-y-0 right-0 mr-3 mt-3 text-foreground' />
      </div>
    </section>
  );
}
