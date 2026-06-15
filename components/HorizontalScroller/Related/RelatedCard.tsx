'use client';

import Image from 'next/image';
import Link from 'next/link';
import { IRelatedMedia } from '@ts/interfaces';
import { CommonMethods } from '@utils/CommonMethods';
import type { Movie, Show, Game } from '@prisma/client';

const RelatedCard = ({
  item,
  dragging,
  userMatchedMedias,
}: {
  item: IRelatedMedia;
  dragging: boolean;
  userMatchedMedias: Array<Show | Movie | Game>;
  itemId: string;
}) => {
  const userWatchStatusFromMedia = CommonMethods.getUserStatusFromMedia(userMatchedMedias, item);

  return (
    <Link
      href={CommonMethods.getDetailsPageRoute(item.type, item.id, item.name)}
      className='group block text-inherit no-underline transition-all duration-300 active:scale-95'
      onClick={e => dragging && e.preventDefault()}
    >
      <section className='relative mx-4 h-[15rem] w-[10rem] select-none'>
        <div className='relative h-full w-full overflow-hidden rounded-lg shadow-md transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-primary/20'>
          <Image
            className='rounded-lg object-cover transition-transform duration-500 ease-out group-hover:scale-110'
            src={
              item.type !== 'game'
                ? CommonMethods.getTheMovieDbImage(item.imagePath)
                : CommonMethods.getIgdbImage(item.imagePath)
            }
            alt={item.name}
            fill
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

        <div className='relative mt-3 flex w-full flex-wrap content-start whitespace-normal'>
          <h2 className='m-0 w-full break-words text-base'>
            <p className='font-bold'>{item.name}</p>
          </h2>
        </div>
      </section>
    </Link>
  );
};

export default RelatedCard;
