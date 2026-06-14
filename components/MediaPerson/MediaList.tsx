'use client';

import { Fragment } from 'react';
import MovieCard from './MovieCard';
import ShowCard from './ShowCard';
import GameCard from './GameCard';
import { RESULTS_PER_PAGE } from '../../utils/constants';
import { useSession } from 'next-auth/react';
interface Props {
  mediaData: any;
  pageNum: number;
  title: string;
  genrePage?: boolean;
}

const MediaList = ({ mediaData, pageNum, title, genrePage }: Props) => {
  const { data: session } = useSession();

  return (
    <section
      className={`w-full ${!genrePage ? 'px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24' : ''}`}
    >
      <section className='flex flex-col'>
        <h3 className='mb-2 ml-4 text-lg lg:text-xl'>{title.split('_').join(' ')}</h3>
        <div className='overflow-x-auto'>
          <table className='w-full table-auto text-sm sm:text-base'>
            <thead>
              <tr className='border-2 border-gray-200'>
                <th className='w-1/6 border-r-2 border-gray-200 px-2 py-2 lg:w-1/12 lg:px-4 lg:py-4'>
                  Rank
                </th>
                <th className='border-r-2 border-gray-200 px-2  py-2 lg:px-4 lg:py-4'>
                  {title.toLowerCase().includes('movie') ? 'Title' : 'Name'}
                </th>
                <th className='w-1/6 border-r-2 border-gray-200 px-2 py-2 lg:w-1/12 lg:px-4 lg:py-4'>
                  Rating
                </th>
                {session && (
                  <>
                    <th className='w-1/6 border-r-2 border-gray-200 px-2 py-2 lg:w-1/12 lg:px-4 lg:py-4'>
                      My Rating
                    </th>

                    <th className='w-1/6 border-r-2 border-gray-200 px-2 py-2 lg:w-1/12 lg:px-4 lg:py-4'>
                      {title.toLowerCase().includes('game') ? 'In Wishlist' : 'Status'}
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {mediaData.results.map((media: any, idx: number) => {
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
                  mediaComp = (
                    <MovieCard
                      movie={media}
                      rank={pageNum * RESULTS_PER_PAGE - (RESULTS_PER_PAGE - idx) + 1}
                    />
                  );
                } else if (isShow) {
                  mediaComp = (
                    <ShowCard
                      show={media}
                      rank={pageNum * RESULTS_PER_PAGE - (RESULTS_PER_PAGE - idx) + 1}
                    />
                  );
                } else if (isGame) {
                  mediaComp = (
                    <GameCard
                      game={media}
                      rank={pageNum * RESULTS_PER_PAGE - (RESULTS_PER_PAGE - idx) + 1}
                    />
                  );
                }
                return <Fragment key={media.id}>{mediaComp}</Fragment>;
              })}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
};

export default MediaList;
