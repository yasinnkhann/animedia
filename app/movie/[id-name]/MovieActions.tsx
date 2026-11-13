'use client';

import { useState, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { watchStatusOptions, ratingOptions } from '@/models/dropDownOptions';
import type { WatchStatus, Movie } from '@prisma/client';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useUserMedia } from '@/components/UserMediaProvider';
import { addMovie, updateMovie, deleteMovie, startMovieRewatch } from '@/app/actions/media';
import { BiCollection, BiShare, BiNote, BiRevision } from 'react-icons/bi';
import toast from 'react-hot-toast';
import AddToCollectionModal from '@/components/Collections/AddToCollectionModal';
import RecommendModal from '@/components/Notifications/RecommendModal';
import PersonalDetailsModal from '@/components/MyMedia/PersonalDetailsModal';

interface Props {
  movieId: string;
  movieTitle: string;
  movieImage: string | null;
}

export default function MovieActions({ movieId, movieTitle, movieImage }: Props) {
  const { data: session, status } = useSession();
  const [watchStatusInput, setWatchStatus] = useState<WatchStatus | 'NOT_WATCHING' | null>(null);
  const [ratingInput, setRating] = useState<number | string | null>(null);
  const [, startTransition] = useTransition();
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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
              mediaType: 'MOVIE',
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
      } catch (_err) {
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
      } catch (_err) {
        mutateUserMediaCache(() => previousData);
        setRating(rating);
      }
    });
  };

  const handleStartRewatch = () => {
    if (!movieId || !movieTitle) return;

    const nextRewatchCount = (usersMovie?.rewatch_count ?? 0) + 1;
    setWatchStatus('WATCHING');

    startTransition(async () => {
      const previousData = getUserMediaCache();
      mutateUserMediaCache((old: any) => {
        if (!old) return old;
        const newMovies = old.userMovies.map((m: any) =>
          m.id === movieId ? { ...m, status: 'WATCHING', rewatch_count: nextRewatchCount } : m
        );
        return { ...old, userMovies: newMovies };
      });

      try {
        await startMovieRewatch(movieId);
        toast.success(`Started rewatch #${nextRewatchCount}!`);
      } catch (_err) {
        mutateUserMediaCache(() => previousData);
        toast.error('Failed to start rewatch.');
      }
    });
  };

  if (status !== 'authenticated' || !session) return null;

  if (isLoading) {
    return (
      <section className='my-4 flex flex-wrap items-center gap-4'>
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
    <section className='my-4 flex flex-wrap items-center gap-4'>
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

      <button
        onClick={() => setIsCollectionModalOpen(true)}
        className='flex h-[42px] w-[42px] items-center justify-center rounded border border-border bg-transparent text-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary'
        title='Add to Collection'
      >
        <BiCollection size={20} />
      </button>

      <button
        onClick={() => setIsRecommendModalOpen(true)}
        className='flex h-[42px] w-[42px] items-center justify-center rounded border border-border bg-transparent text-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary'
        title='Recommend to a Friend'
      >
        <BiShare size={20} />
      </button>

      <button
        onClick={() => setIsDetailsModalOpen(true)}
        disabled={watchStatus === 'NOT_WATCHING'}
        className={`flex h-[42px] items-center gap-1.5 rounded border border-border bg-transparent px-3 text-sm text-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary ${
          watchStatus === 'NOT_WATCHING' ? 'cursor-not-allowed opacity-40' : ''
        } ${
          usersMovie?.notes ||
          (usersMovie?.tags && usersMovie.tags.length > 0) ||
          (usersMovie?.rewatch_count && usersMovie.rewatch_count > 0)
            ? 'border-primary text-primary'
            : ''
        }`}
        title={
          watchStatus === 'NOT_WATCHING'
            ? 'Add to list first to log notes & tags'
            : 'Personal Notes, Tags & Rewatches'
        }
      >
        <BiNote size={18} />
        <span className='hidden sm:inline'>Log Details</span>
        {usersMovie?.rewatch_count && usersMovie.rewatch_count > 0 ? (
          <span className='ml-1 rounded-full bg-primary/20 px-1.5 py-0.5 text-xs font-semibold'>
            {usersMovie.rewatch_count}x
          </span>
        ) : null}
      </button>

      {/* Start Rewatch Button (when movie is COMPLETED) */}
      {usersMovie?.status === 'COMPLETED' && (
        <button
          type='button'
          onClick={handleStartRewatch}
          className='flex h-[42px] items-center gap-1.5 rounded border border-purple-500/50 bg-purple-500/10 px-3.5 text-sm font-semibold text-purple-400 transition-colors hover:border-purple-400 hover:bg-purple-500/20'
          title='Rewatch this movie'
        >
          <BiRevision size={18} />
          <span>Rewatch</span>
          {usersMovie.rewatch_count > 0 ? (
            <span className='ml-0.5 text-xs opacity-75'>({usersMovie.rewatch_count}x)</span>
          ) : null}
        </button>
      )}

      {/* Rewatching Badge (when currently WATCHING with rewatch_count > 0) */}
      {usersMovie?.status === 'WATCHING' && (usersMovie?.rewatch_count ?? 0) > 0 && (
        <div
          className='flex h-[42px] items-center gap-1.5 rounded border border-purple-500/40 bg-purple-500/15 px-3 text-xs font-semibold text-purple-300 shadow-sm'
          title={`Currently on rewatch #${usersMovie.rewatch_count}`}
        >
          <BiRevision size={16} />
          <span>Rewatching #{usersMovie.rewatch_count}</span>
        </div>
      )}

      {(usersMovie?.notes || (usersMovie?.tags && usersMovie.tags.length > 0)) && (
        <div className='w-full rounded-xl border border-border/60 bg-muted/20 p-3'>
          {usersMovie.tags && usersMovie.tags.length > 0 && (
            <div className='mb-1.5 flex flex-wrap items-center gap-1.5'>
              {usersMovie.tags.map((tag: string) => (
                <span
                  key={tag}
                  className='rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          {usersMovie.notes && (
            <p className='line-clamp-2 text-xs italic text-muted-foreground'>
              &ldquo;{usersMovie.notes}&rdquo;
            </p>
          )}
        </div>
      )}

      <AddToCollectionModal
        mediaType='MOVIE'
        mediaId={movieId}
        mediaTitle={movieTitle}
        mediaImage={usersMovie?.image ?? movieImage}
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
      />

      <RecommendModal
        mediaType='MOVIE'
        mediaId={movieId}
        mediaTitle={movieTitle}
        mediaImage={usersMovie?.image ?? movieImage}
        isOpen={isRecommendModalOpen}
        onClose={() => setIsRecommendModalOpen(false)}
      />

      <PersonalDetailsModal
        mediaType='MOVIE'
        mediaId={movieId}
        mediaTitle={movieTitle}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        initialNotes={usersMovie?.notes}
        initialTags={usersMovie?.tags}
        initialRewatchCount={usersMovie?.rewatch_count}
        onSaveSuccess={({ notes, tags, rewatchCount }) => {
          mutateUserMediaCache((old: any) => {
            if (!old) return old;
            const newMovies = old.userMovies.map((m: any) =>
              m.id === movieId ? { ...m, notes, tags, rewatch_count: rewatchCount } : m
            );
            return { ...old, userMovies: newMovies };
          });
        }}
      />
    </section>
  );
}
