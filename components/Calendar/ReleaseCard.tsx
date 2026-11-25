'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarReleaseItem } from './types';
import { getReleaseCountdown, formatFriendlyDate } from './calendarUtils';
import { CommonMethods } from '@/utils/CommonMethods';
import { FaPlus, FaCheck, FaGamepad, FaFilm, FaTv } from 'react-icons/fa6';
import { addMovie, addShow, addGame } from '@/app/actions/media';
import { useUserMedia } from '@/components/UserMediaProvider';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface Props {
  item: CalendarReleaseItem;
}

export default function ReleaseCard({ item }: Props) {
  const { status: authStatus } = useSession();
  const { refetchUserMedia } = useUserMedia();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const countdown = getReleaseCountdown(item.releaseDate);
  const friendlyDate = formatFriendlyDate(item.releaseDate);

  const isGame = item.mediaType === 'GAME';
  const isMovie = item.mediaType === 'MOVIE';
  const isShow = item.mediaType === 'SHOW';

  let imageUrl = '';
  if (isGame) {
    imageUrl = (CommonMethods.getIgdbImage(item.image) as string) || '';
  } else {
    imageUrl = (CommonMethods.getTheMovieDbImage(item.image) as string) || '';
  }

  const detailsRoute = CommonMethods.getDetailsPageRoute(
    isGame ? 'game' : isMovie ? 'movie' : 'show',
    item.id,
    item.name
  );

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (authStatus !== 'authenticated') {
      toast.error('Please sign in to add this to your watchlist.');
      return;
    }

    try {
      setIsAdding(true);
      if (isMovie) {
        await addMovie(String(item.id), item.name, 'PLAN_TO_WATCH');
      } else if (isShow) {
        await addShow(String(item.id), item.name, 'PLAN_TO_WATCH');
      } else if (isGame) {
        await addGame(String(item.id), item.name, 'PLAN_TO_PLAY');
      }
      setAdded(true);
      toast.success(`Added ${item.name} to ${isGame ? 'Plan to Play' : 'Plan to Watch'}!`);
      await refetchUserMedia();
    } catch (err) {
      console.error('Error adding release:', err);
      toast.error('Failed to add item to watchlist.');
    } finally {
      setIsAdding(false);
    }
  };

  const typeIcon = isGame ? (
    <FaGamepad className='text-emerald-400' size={13} />
  ) : isShow ? (
    <FaTv className='text-purple-400' size={13} />
  ) : (
    <FaFilm className='text-sky-400' size={13} />
  );

  const typeLabel = isGame ? 'Game' : isShow ? 'TV Show' : 'Movie';

  return (
    <div className='group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-4 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:bg-card/90 hover:shadow-xl sm:flex-row'>
      {/* Poster Image */}
      <Link
        href={detailsRoute}
        className='relative h-48 w-full shrink-0 overflow-hidden rounded-xl bg-zinc-900 sm:h-36 sm:w-24'
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.name}
            fill
            sizes='(max-width: 640px) 100vw, 96px'
            className='object-cover transition-transform duration-500 group-hover:scale-105'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center text-muted-foreground'>
            {typeIcon}
          </div>
        )}

        {/* Rating Badge */}
        {item.rating && item.rating > 0 && (
          <div className='absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-xs font-bold text-yellow-400 backdrop-blur-md'>
            <span>★</span>
            <span>{item.rating}</span>
          </div>
        )}
      </Link>

      {/* Info Section */}
      <div className='flex min-w-0 flex-1 flex-col justify-between'>
        <div>
          {/* Top row: Type chip & Countdown pill */}
          <div className='mb-2 flex flex-wrap items-center gap-2'>
            <span className='inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-semibold text-foreground'>
              {typeIcon}
              <span>{typeLabel}</span>
            </span>

            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm ${countdown.badgeColor}`}
            >
              {countdown.label}
            </span>
          </div>

          {/* Title */}
          <Link href={detailsRoute}>
            <h3 className='line-clamp-1 text-lg font-bold text-foreground transition-colors hover:text-primary'>
              {item.name}
            </h3>
          </Link>

          {/* Release Date */}
          <p className='mt-0.5 text-sm font-medium text-muted-foreground'>{friendlyDate}</p>

          {/* Episode Info (for TV shows) */}
          {isShow && item.episodeInfo && (
            <div className='mt-2 flex flex-wrap items-center gap-2'>
              <span className='rounded border border-purple-500/30 bg-purple-500/20 px-2 py-0.5 text-xs font-semibold text-purple-300'>
                Season {item.episodeInfo.seasonNumber}, Ep {item.episodeInfo.episodeNumber}
              </span>
              {item.episodeInfo.episodeName && (
                <span className='truncate text-xs italic text-muted-foreground'>
                  &ldquo;{item.episodeInfo.episodeName}&rdquo;
                </span>
              )}
            </div>
          )}

          {/* Platforms (if game) */}
          {isGame && item.platforms && item.platforms.length > 0 && (
            <div className='mt-2 flex flex-wrap gap-1.5'>
              {item.platforms.slice(0, 4).map(p => (
                <span
                  key={p}
                  className='rounded bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground'
                >
                  {p}
                </span>
              ))}
              {item.platforms.length > 4 && (
                <span className='rounded bg-muted/60 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground'>
                  +{item.platforms.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Overview snippet if available */}
          {item.overview && (
            <p className='mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground'>
              {item.overview}
            </p>
          )}
        </div>

        {/* Action / Tracking status footer */}
        <div className='mt-3 flex items-center justify-between border-t border-border/40 pt-3'>
          {item.isTracked || added ? (
            <div className='flex items-center gap-1.5 text-xs font-semibold text-emerald-400'>
              <FaCheck size={12} />
              <span>In Watchlist ({isGame ? 'Plan to Play' : 'Plan to Watch'})</span>
            </div>
          ) : (
            <button
              onClick={handleQuickAdd}
              disabled={isAdding}
              className='hover:text-primary-foreground inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-all duration-200 hover:bg-primary'
            >
              <FaPlus size={10} />
              <span>
                {isAdding ? 'Adding...' : isGame ? 'Add to Plan to Play' : 'Add to Plan to Watch'}
              </span>
            </button>
          )}

          <Link
            href={detailsRoute}
            className='text-xs font-medium text-muted-foreground transition-colors hover:text-foreground'
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
