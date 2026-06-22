'use client';

import Image from 'next/image';
import Link from 'next/link';
import RoundProgressBar from '@/components/RoundProgressBar';
import { CommonMethods } from '@/utils/CommonMethods';
import { IoMdClose } from 'react-icons/io';
import { motion } from 'framer-motion';

export type MediaCardVariant = 'fixed' | 'responsive';
export type MediaType = 'MOVIE' | 'SHOW' | 'GAME' | 'PERSON';

interface MediaCardProps {
  item: any;
  mediaType?: MediaType;
  variant?: MediaCardVariant;
  dragging?: boolean;
  priority?: boolean;
  index?: number;

  userStatus?: string | null;
  userRating?: number | null;

  onRemove?: () => void;
}

export default function MediaCard({
  item,
  mediaType,
  variant = 'responsive',
  dragging = false,
  priority = false,
  index = 0,
  userStatus,
  userRating,
  onRemove,
}: MediaCardProps) {
  let inferredType = mediaType;
  if (!inferredType) {
    if (item.media_type) {
      let typeStr = item.media_type.toUpperCase();
      if (typeStr === 'TV') typeStr = 'SHOW';
      inferredType = typeStr as MediaType;
    } else if ('character' in item || item.type === 'GameCharacter' || item.profile_path) {
      inferredType = 'PERSON';
    } else if ('coverUrl' in item || 'first_release_date' in item || 'playtime' in item) {
      inferredType = 'GAME';
    } else if ('title' in item || 'release_date' in item) {
      inferredType = 'MOVIE';
    } else if ('name' in item && 'first_air_date' in item) {
      inferredType = 'SHOW';
    } else {
      inferredType = 'MOVIE';
    }
  }

  const isGame = inferredType === 'GAME';
  const isMovie = inferredType === 'MOVIE';
  const isShow = inferredType === 'SHOW';
  const isPerson = inferredType === 'PERSON';

  const titleName = item.title || item.name || 'Unknown';

  let imageUrl = '';

  if (isGame) {
    imageUrl =
      (CommonMethods.getIgdbImage(item.image || item.coverUrl || item.profile_path) as string) ||
      '';
  } else if (isPerson && item.type === 'GameCharacter') {
    imageUrl = (CommonMethods.getIgdbImage(item.profile_path || item.image) as string) || '';
  } else {
    imageUrl =
      (CommonMethods.getTheMovieDbImage(
        item.image || item.poster_path || item.profile_path
      ) as string) || '';
  }

  let releaseDateText = '';
  if (isGame) {
    releaseDateText = item.first_release_date
      ? CommonMethods.formatDate(new Date(item.first_release_date * 1000).toISOString()) ||
        'Release Date Not Available'
      : 'Release Date Not Available';
  } else if (isMovie) {
    releaseDateText = item.release_date
      ? CommonMethods.formatDate(item.release_date) || 'Release Date Not Available'
      : 'Release Date Not Available';
  } else if (isShow) {
    releaseDateText = item.first_air_date
      ? CommonMethods.formatDate(item.first_air_date) || 'First Air Date Not Available'
      : 'First Air Date Not Available';
  } else if (isPerson) {
    releaseDateText = item.character || '';
  }

  let ratingVal = 0;
  if (item.rating !== undefined && item.rating !== null) {
    if (isGame) {
      // Game ratings are stored out of 100 in IGDB, but in our DB we might store them differently?
      // Let's check userRating from DB. Wait, if it's a user rating (1-10), we multiply by 10.
      // If it's IGDB rating (already 0-100), we just use it.
      // We will check if it's a user rating which is <= 10.
      if (item.rating <= 10 && item.rating > 0) ratingVal = item.rating * 10;
      else ratingVal = Math.round(item.rating);
    } else {
      // For TMDB it is vote_average (0-10) or user rating (0-10)
      if (item.rating <= 10 && item.rating > 0) ratingVal = item.rating * 10;
      else ratingVal = Math.round(item.rating);
    }
  } else if (item.vote_average !== undefined) {
    ratingVal = +(item.vote_average ?? 0).toFixed(1) * 10;
  }

  const detailsRoute = CommonMethods.getDetailsPageRoute(
    isGame ? 'game' : isMovie ? 'movie' : isShow ? 'show' : 'person',
    item.id,
    titleName
  );

  const containerClasses =
    variant === 'fixed'
      ? 'relative mx-4 h-[15rem] w-[10rem] select-none flex-shrink-0 group'
      : 'relative flex flex-col gap-2 w-full group';

  const imageWrapperClasses =
    variant === 'fixed'
      ? 'relative h-full w-full overflow-hidden rounded-lg shadow-md transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-primary/20'
      : 'relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:border-primary/50 group-hover:shadow-xl group-hover:shadow-primary/20';

  const handleClick = (e: React.MouseEvent) => {
    if (dragging) e.preventDefault();
  };

  return (
    <motion.div
      className={containerClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: Math.min(index * 0.05, 0.5) }}
    >
      <div className={imageWrapperClasses}>
        <Link
          href={detailsRoute}
          onClick={handleClick}
          className='block h-full w-full outline-none'
        >
          <Image
            className='object-cover transition-transform duration-500 ease-out group-hover:scale-110'
            src={imageUrl || '/placeholder.png'}
            alt={titleName}
            fill
            priority={priority}
            sizes={
              variant === 'fixed'
                ? '(max-width: 768px) 50vw, 20vw'
                : '(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw'
            }
            {...(item.blurDataUrl && {
              placeholder: 'blur',
              blurDataURL: item.blurDataUrl,
            })}
          />

          {!onRemove && (
            <div className='absolute inset-0 flex flex-col items-center justify-end rounded-lg bg-black/40 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100'>
              <div className='mb-6 translate-y-4 rounded-full border border-white/30 bg-white/20 px-6 py-2 text-sm font-semibold text-white opacity-0 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
                {isPerson && item.type !== 'GameCharacter' ? 'View Profile' : 'View Details'}
              </div>
            </div>
          )}
        </Link>

        {userStatus && !onRemove && (
          <div
            className={`absolute right-0 top-0 z-10 flex h-7 w-7 items-center justify-center ${CommonMethods.getWatchStatusBackgroundColor(
              userStatus as any
            )} text-base text-white shadow-sm ${variant === 'fixed' ? '' : 'rounded-bl-xl rounded-tr-xl'}`}
          >
            {userStatus}
          </div>
        )}

        {userRating && (
          <div className='absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-xs font-bold text-yellow-400 shadow-sm backdrop-blur-md'>
            ★ {userRating}
          </div>
        )}

        {onRemove && (
          <button
            onClick={e => {
              e.preventDefault();
              onRemove();
            }}
            className='absolute right-2 top-2 z-20 cursor-pointer rounded-full bg-black/60 p-1.5 text-white opacity-0 shadow-sm backdrop-blur-md transition-all group-hover:opacity-100 hover:scale-110 hover:bg-red-500/80'
            title='Remove from library'
          >
            <IoMdClose size={16} />
          </button>
        )}
      </div>

      {variant === 'fixed' ? (
        <div className='relative flex w-full flex-wrap content-start whitespace-normal pt-2'>
          {!isPerson && (
            <div className='relative bottom-[1.5rem] left-2 h-[2.5rem] w-[2.5rem] rounded-full border border-white/10 bg-background/60 shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-md dark:border-white/5'>
              <RoundProgressBar percentageVal={ratingVal} />
            </div>
          )}
          <Link
            href={detailsRoute}
            onClick={handleClick}
            className={`block w-full text-inherit no-underline ${isPerson ? '' : 'mt-[-1rem]'}`}
          >
            <h2
              className={`m-0 w-full break-words text-base font-bold transition-colors group-hover:text-primary ${isPerson ? 'text-center' : ''}`}
            >
              {titleName}
            </h2>
            {isPerson && releaseDateText && (
              <p className='break-words text-center text-sm text-muted-foreground'>
                {releaseDateText}
              </p>
            )}
          </Link>
          {!isPerson && (
            <p className='m-0 w-full break-words p-0 text-sm text-muted-foreground'>
              {releaseDateText}
            </p>
          )}
        </div>
      ) : (
        <div className='relative flex w-full flex-col pt-1'>
          {!isPerson && (
            <div className='absolute -top-[2rem] left-2 h-[2.5rem] w-[2.5rem] rounded-full border border-white/10 bg-background/60 shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-md dark:border-white/5'>
              <RoundProgressBar percentageVal={ratingVal} />
            </div>
          )}
          <Link
            href={detailsRoute}
            onClick={handleClick}
            className={`text-inherit no-underline ${!isPerson ? 'mt-3' : ''}`}
          >
            <h3 className='line-clamp-2 text-sm font-semibold transition-colors hover:text-primary'>
              {titleName}
            </h3>
            <p className='mt-0.5 text-xs text-muted-foreground'>{releaseDateText}</p>
          </Link>
        </div>
      )}
    </motion.div>
  );
}
