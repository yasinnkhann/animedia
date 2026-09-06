'use client';

import { useRef, ReactNode, useTransition, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import SearchBar from './Search/SearchBar';
import { ActivityFeed } from './Social/ActivityFeed';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import HomeHorizontalScroller from '@/components/HorizontalScroller/Home/HomeHorizontalScroller';
import HorizontalScrollerSkeleton from '@/components/Skeletons/HorizontalScrollerSkeleton';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface Props {
  popular: 'movies' | 'shows' | 'theatres';
  trending: 'movies' | 'shows';
  time: 'day' | 'week';
  forYouContent: ReactNode;
  dailyPickContent: ReactNode;
  popularContent: ReactNode;
  trendingContent: ReactNode;
}

const HomePageClient = ({
  popular,
  trending,
  time,
  forYouContent,
  dailyPickContent,
  popularContent,
  trendingContent,
}: Props) => {
  const router = useRouter();

  const [localPopular, setLocalPopular] = useState(popular);
  const [localTrending, setLocalTrending] = useState(trending);
  const [localTime, setLocalTime] = useState(time);

  const searchBarRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();

  const { data: clientPopularData, isValidating: isPopularLoading } = useSWR(
    localPopular !== popular ? `/api/tmdb/popular?type=${localPopular}` : null,
    fetcher
  );

  const { data: clientTrendingData, isValidating: isTrendingLoading } = useSWR(
    localTrending !== trending || localTime !== time
      ? `/api/tmdb/trending?type=${localTrending}&time=${localTime}`
      : null,
    fetcher
  );

  const handleUpdateParams = useCallback((key: string, value: string) => {
    if (key === 'popular') setLocalPopular(value as any);
    if (key === 'trending') setLocalTrending(value as any);
    if (key === 'time') setLocalTime(value as any);
  }, []);

  return (
    <motion.main
      className='mt-[calc(var(--header-height-mobile)+1rem)]'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className='relative z-50'>
        <div className='hidden px-4 md:px-[3rem] lg:block'>
          <SearchBar ref={searchBarRef} />
        </div>

        {forYouContent}

        <section className='mt-8'>
          <section className='flex w-full flex-col items-start gap-3 px-4 sm:flex-row sm:items-end md:px-[3rem]'>
            <div>
              <h1 className='truncate whitespace-nowrap text-xl sm:text-3xl'>
                What&apos;s Popular
              </h1>
            </div>
            <ul className='flex gap-6 text-sm sm:w-[25rem] sm:justify-around sm:gap-0 sm:text-base'>
              <li
                className='relative cursor-pointer pb-1'
                onClick={() => handleUpdateParams('popular', 'movies')}
              >
                Movies
                {localPopular === 'movies' && (
                  <motion.div
                    layoutId='popular-tab'
                    className='absolute bottom-0 left-0 right-0 h-1 rounded-t-sm bg-indigo-500'
                  />
                )}
              </li>
              <li
                className='relative cursor-pointer pb-1'
                onClick={() => handleUpdateParams('popular', 'shows')}
              >
                Shows
                {localPopular === 'shows' && (
                  <motion.div
                    layoutId='popular-tab'
                    className='absolute bottom-0 left-0 right-0 h-1 rounded-t-sm bg-indigo-500'
                  />
                )}
              </li>
              <li
                className='relative cursor-pointer pb-1'
                onClick={() => handleUpdateParams('popular', 'theatres')}
              >
                In Theatres
                {localPopular === 'theatres' && (
                  <motion.div
                    layoutId='popular-tab'
                    className='absolute bottom-0 left-0 right-0 h-1 rounded-t-sm bg-indigo-500'
                  />
                )}
              </li>
            </ul>
          </section>

          <section className='relative mt-4'>
            {localPopular === popular ? (
              popularContent
            ) : isPopularLoading ? (
              <HorizontalScrollerSkeleton />
            ) : clientPopularData ? (
              <HomeHorizontalScroller items={clientPopularData} />
            ) : (
              <HorizontalScrollerSkeleton />
            )}
          </section>

          <section className='mt-4 flex w-full flex-col items-start gap-3 px-4 sm:flex-row sm:items-end md:px-[3rem]'>
            <div>
              <h1 className='truncate whitespace-nowrap text-xl sm:text-3xl'>Trending</h1>
            </div>
            <section className='flex w-full flex-wrap gap-x-8 gap-y-3 sm:w-auto sm:flex-1 sm:flex-nowrap sm:justify-around sm:gap-x-0'>
              <ul className='flex gap-6 text-sm sm:text-base'>
                <li
                  className='relative cursor-pointer pb-1'
                  onClick={() => handleUpdateParams('trending', 'movies')}
                >
                  Movies
                  {localTrending === 'movies' && (
                    <motion.div
                      layoutId='trending-type-tab'
                      className='absolute bottom-0 left-0 right-0 h-1 rounded-t-sm bg-indigo-500'
                    />
                  )}
                </li>
                <li
                  className='relative cursor-pointer pb-1'
                  onClick={() => handleUpdateParams('trending', 'shows')}
                >
                  Shows
                  {localTrending === 'shows' && (
                    <motion.div
                      layoutId='trending-type-tab'
                      className='absolute bottom-0 left-0 right-0 h-1 rounded-t-sm bg-indigo-500'
                    />
                  )}
                </li>
              </ul>
              <ul className='flex gap-6 text-sm sm:text-base'>
                <li
                  className='relative cursor-pointer pb-1'
                  onClick={() => handleUpdateParams('time', 'day')}
                >
                  Today
                  {localTime === 'day' && (
                    <motion.div
                      layoutId='trending-time-tab'
                      className='absolute bottom-0 left-0 right-0 h-1 rounded-t-sm bg-indigo-500'
                    />
                  )}
                </li>
                <li
                  className='relative cursor-pointer pb-1'
                  onClick={() => handleUpdateParams('time', 'week')}
                >
                  This Week
                  {localTime === 'week' && (
                    <motion.div
                      layoutId='trending-time-tab'
                      className='absolute bottom-0 left-0 right-0 h-1 rounded-t-sm bg-indigo-500'
                    />
                  )}
                </li>
              </ul>
            </section>
          </section>

          <section className='relative mt-4'>
            {localTrending === trending && localTime === time ? (
              trendingContent
            ) : isTrendingLoading ? (
              <HorizontalScrollerSkeleton />
            ) : clientTrendingData ? (
              <HomeHorizontalScroller items={clientTrendingData} />
            ) : (
              <HorizontalScrollerSkeleton />
            )}
          </section>
        </section>

        <div className='mt-16 px-4 md:px-[3rem]'>{dailyPickContent}</div>

        {session && (
          <section className='mt-16 px-4 lg:px-12'>
            <h2 className='mb-6 truncate whitespace-nowrap text-xl font-bold sm:text-3xl'>
              Friends Activity
            </h2>
            <ActivityFeed />
          </section>
        )}
      </div>
    </motion.main>
  );
};

export default HomePageClient;
