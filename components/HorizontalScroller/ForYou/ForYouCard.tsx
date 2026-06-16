'use client';

import Image from 'next/image';
import Link from 'next/link';
import RoundProgressBar from '../../RoundProgressBar';
import { CommonMethods } from '../../../utils/CommonMethods';
import type { Movie, Show, Game } from '@prisma/client';

const ForYouCard = ({
  item,
  dragging,
  userMatchedMedias,
  priority = false,
}: {
  item: any;
  dragging: boolean;
  userMatchedMedias: Array<Show | Movie | Game>;
  priority?: boolean;
}) => {
  const isGame = item.mediaType === 'game';
  const isMovie = item.mediaType === 'movie';
  const titleName = isMovie ? item.title : item.name;
  const userWatchStatusFromMedia = CommonMethods.getUserStatusFromMedia(
    userMatchedMedias as any,
    item
  );

  let routeType = isGame ? 'game' : isMovie ? 'movie' : 'show';
  let imageSrc = isGame ? item.coverUrl : CommonMethods.getTheMovieDbImage(item.poster_path);
  if (imageSrc && imageSrc.startsWith('//')) {
    imageSrc = `https:${imageSrc}`;
  }
  const ratingValue = isGame
    ? Math.round(item.rating ?? 0)
    : +(item.vote_average ?? 0).toFixed(1) * 10;

  return (
    <Link
      href={CommonMethods.getDetailsPageRoute(routeType as any, item.id, titleName)}
      className='group block text-inherit no-underline transition-all duration-300 active:scale-95'
      onClick={e => dragging && e.preventDefault()}
    >
      <section className='relative mx-4 h-[15rem] w-[10rem] select-none'>
        <div className='relative h-full w-full overflow-hidden rounded-lg shadow-md transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-primary/20'>
          <Image
            className='rounded-lg object-cover transition-transform duration-500 ease-out group-hover:scale-110'
            src={imageSrc}
            alt={titleName}
            fill
            priority={priority}
            sizes='(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw'
          />

          <div className='absolute inset-0 flex flex-col items-center justify-end rounded-lg bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
            <div className='mb-4 translate-y-4 rounded-full bg-primary/90 px-4 py-1 text-sm font-semibold text-white opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
              View Details
            </div>
          </div>

          {userWatchStatusFromMedia && (
            <div
              className={`absolute right-0 top-0 z-10 flex h-7 w-7 items-center justify-center ${CommonMethods.getWatchStatusBackgroundColor(
                userWatchStatusFromMedia
              )} text-base text-white shadow-sm`}
            >
              {userWatchStatusFromMedia}
            </div>
          )}
        </div>

        <div className='relative flex w-full flex-wrap content-start whitespace-normal'>
          <div className='relative bottom-[1rem] left-4 h-[2.5rem] w-[2.5rem]'>
            <RoundProgressBar percentageVal={ratingValue} />
          </div>

          <div className='m-0 flex w-full flex-col'>
            <p className='truncate text-sm font-bold leading-tight'>{titleName}</p>
            <p className='mt-0.5 truncate text-[0.65rem] italic text-muted-foreground'>
              {item.recommendedReason}
            </p>
          </div>
        </div>
      </section>
    </Link>
  );
};

export default ForYouCard;
