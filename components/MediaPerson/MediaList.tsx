'use client';

import { Fragment } from 'react';
import MovieCard from './MovieCard';
import ShowCard from './ShowCard';
import GameCard from './GameCard';
import MediaCardSkeleton from '../Skeletons/MediaCardSkeleton';
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
        <h3 className='mb-2 ml-4 text-lg lg:text-xl'>{title.split('_').join(' ')}</h3>
        <div className='overflow-x-auto'>
          <table className='w-full table-auto text-left text-sm sm:text-base'>
            <thead>
              <tr className='border-b border-border bg-muted/20 text-muted-foreground'>
                <th className='w-1/6 px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider'>
                  Rank
                </th>
                <th className='px-4 py-4 text-xs font-semibold uppercase tracking-wider'>
                  {title.toLowerCase().includes('movie') ? 'Title' : 'Name'}
                </th>
                <th className='w-1/6 px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider'>
                  Rating
                </th>
                {session && (
                  <>
                    <th className='w-1/6 px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider'>
                      My Rating
                    </th>

                    <th className='w-1/6 px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider'>
                      {title.toLowerCase().includes('game') ? 'In Wishlist' : 'Status'}
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {results.map((media: any, idx: number) => {
                let mediaComp = <></>;

                let isMovie = false;
                let isShow = false;
                let isGame = false;

                if (media.media_type) {
                  isMovie = media.media_type === 'movie';
                  isShow = media.media_type === 'tv';
                } else {
                  isMovie = 'title' in media;
                  isGame =
                    'released' in media || 'background_image' in media || 'playtime' in media;
                  isShow = 'name' in media && !isGame;
                }

                if (isMovie) {
                  mediaComp = <MovieCard movie={media} rank={idx + 1} />;
                } else if (isShow) {
                  mediaComp = <ShowCard show={media} rank={idx + 1} />;
                } else if (isGame) {
                  mediaComp = <GameCard game={media} rank={idx + 1} />;
                }
                return <Fragment key={`${media.id}-${idx}`}>{mediaComp}</Fragment>;
              })}
              {isFetchingNextPage &&
                Array.from({ length: 20 }).map((_, idx) => (
                  <MediaCardSkeleton key={`skeleton-${idx}`} />
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
};

export default MediaList;
