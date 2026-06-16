'use client';

import { useRef, ReactNode, useTransition, useState } from 'react';
import { motion } from 'framer-motion';
import SearchBar from './Search/SearchBar';
import { ActivityFeed } from './Social/ActivityFeed';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  popular: 'movies' | 'shows' | 'theatres';
  trending: 'movies' | 'shows';
  time: 'day' | 'week';
  forYouContent: ReactNode;
  popularContent: ReactNode;
  trendingContent: ReactNode;
}

const HomePageClient = ({
  popular,
  trending,
  time,
  forYouContent,
  popularContent,
  trendingContent,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchBarRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  // Optimistic UI state for tabs
  const [localPopular, setLocalPopular] = useState(popular);
  const [prevPopular, setPrevPopular] = useState(popular);

  const [localTrending, setLocalTrending] = useState(trending);
  const [prevTrending, setPrevTrending] = useState(trending);

  const [localTime, setLocalTime] = useState(time);
  const [prevTime, setPrevTime] = useState(time);

  // Sync with actual props if they change externally (e.g., via browser back button)
  if (popular !== prevPopular) {
    setPrevPopular(popular);
    setLocalPopular(popular);
  }
  if (trending !== prevTrending) {
    setPrevTrending(trending);
    setLocalTrending(trending);
  }
  if (time !== prevTime) {
    setPrevTime(time);
    setLocalTime(time);
  }

  const handleUpdateParams = (key: string, value: string) => {
    // Optimistic UI update
    if (key === 'popular') setLocalPopular(value as any);
    if (key === 'trending') setLocalTrending(value as any);
    if (key === 'time') setLocalTime(value as any);

    const params = new URLSearchParams(searchParams?.toString());
    params.set(key, value);
    startTransition(() => {
      router.push(`/?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <motion.main
      className={`mt-[calc(var(--header-height-mobile)+1rem)] transition-opacity duration-300 ${isPending ? 'opacity-70' : 'opacity-100'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className='relative z-50'>
        <SearchBar ref={searchBarRef} />

        {forYouContent}

        <section className='mt-8'>
          <section className='ml-[3rem] flex w-full items-end'>
            <div>
              <h1 className='text-xl sm:text-3xl'>What&apos;s Popular</h1>
            </div>
            <ul className='flex w-[15rem] justify-around md:w-[25rem]'>
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

          <section className='mt-4'>{popularContent}</section>

          <section className='ml-[3rem] mt-4 flex items-end'>
            <div>
              <h1 className='text-xl sm:text-3xl'>Trending</h1>
            </div>
            <section className='flex w-full justify-around'>
              <ul className='flex justify-around'>
                <li
                  className='relative mr-4 cursor-pointer pb-1 md:mr-20'
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
              <ul className='flex justify-around'>
                <li
                  className='relative mr-4 cursor-pointer pb-1 md:mr-20'
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

          <section className='mt-4'>{trendingContent}</section>
        </section>

        <section className='ml-[3rem] mr-[3rem] mt-16'>
          <h2 className='mb-6 text-xl font-bold sm:text-3xl'>Friends Activity</h2>
          <ActivityFeed />
        </section>
      </div>
    </motion.main>
  );
};

export default HomePageClient;
