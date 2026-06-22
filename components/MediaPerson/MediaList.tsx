'use client';

import { Fragment } from 'react';
import MediaCard from '../MediaCard/MediaCard';
import { RESULTS_PER_PAGE } from '../../utils/constants';
import { useSession } from 'next-auth/react';
interface Props {
  results: any[];
  title: string;
  genrePage?: boolean;
  isFetchingNextPage?: boolean;
}

const MediaList = ({ results, title, genrePage, isFetchingNextPage }: Props) => {
  const { data: session } = useSession();

  return (
    <section
      className={`w-full ${!genrePage ? 'px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24' : ''}`}
    >
      <section className='flex flex-col'>
        <h3 className='mb-2 ml-4 truncate whitespace-nowrap text-lg lg:text-xl'>
          {title.split('_').join(' ')}
        </h3>
        <div className='mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
          {results.map((media: any, idx: number) => {
            let isMovie = false;
            let isShow = false;
            let isGame = false;
            let mediaType: 'MOVIE' | 'SHOW' | 'GAME' | 'PERSON' = 'MOVIE';

            if (media.media_type) {
              isMovie = media.media_type === 'movie';
              isShow = media.media_type === 'tv';
              isGame = media.media_type === 'game';
              if (isMovie) mediaType = 'MOVIE';
              else if (isShow) mediaType = 'SHOW';
              else if (isGame) mediaType = 'GAME';
            } else {
              isMovie = 'title' in media;
              isGame =
                'released' in media ||
                'background_image' in media ||
                'playtime' in media ||
                'first_release_date' in media ||
                'cover' in media ||
                'coverUrl' in media;
              isShow = 'name' in media && !isGame;
              if (isMovie) mediaType = 'MOVIE';
              else if (isShow) mediaType = 'SHOW';
              else if (isGame) mediaType = 'GAME';
            }

            return (
              <Fragment key={`${media.id}-${idx}`}>
                <MediaCard item={media} mediaType={mediaType} variant='responsive' />
              </Fragment>
            );
          })}
          {isFetchingNextPage &&
            Array.from({ length: 20 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className='aspect-[2/3] w-full animate-pulse rounded-xl bg-muted/50'
              ></div>
            ))}
        </div>
      </section>
    </section>
  );
};

export default MediaList;
