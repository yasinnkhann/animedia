'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import SearchBar from './Search/SearchBar';
import HomeHorizontalScroller from './HorizontalScroller/Home/HomeHorizontalScroller';
import ForYouSection from './HorizontalScroller/ForYou/ForYouSection';
import { useRouter } from 'next/navigation';

interface Props {
  popular: 'movies' | 'shows' | 'theatres';
  trending: 'movies' | 'shows';
  time: 'day' | 'week';
  popularData: any[];
  trendingData: any[];
  forYouData?: any[];
}

const HomePageClient = ({
  popular,
  trending,
  time,
  popularData,
  trendingData,
  forYouData,
}: Props) => {
  const router = useRouter();
  const searchBarRef = useRef<HTMLInputElement>(null);

  const handleUpdateParams = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set(key, value);
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <motion.main
      className='mt-[calc(var(--header-height-mobile)+1rem)]'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className='relative z-50'>
        <SearchBar ref={searchBarRef} />

        <ForYouSection forYouData={forYouData} />

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
                {popular === 'movies' && (
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
                {popular === 'shows' && (
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
                {popular === 'theatres' && (
                  <motion.div
                    layoutId='popular-tab'
                    className='absolute bottom-0 left-0 right-0 h-1 rounded-t-sm bg-indigo-500'
                  />
                )}
              </li>
            </ul>
          </section>

          <section className='mt-4'>
            <HomeHorizontalScroller items={popularData} />
          </section>

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
                  {trending === 'movies' && (
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
                  {trending === 'shows' && (
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
                  {time === 'day' && (
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
                  {time === 'week' && (
                    <motion.div
                      layoutId='trending-time-tab'
                      className='absolute bottom-0 left-0 right-0 h-1 rounded-t-sm bg-indigo-500'
                    />
                  )}
                </li>
              </ul>
            </section>
          </section>

          <section className='mt-4'>
            <HomeHorizontalScroller items={trendingData} />
          </section>
        </section>
      </div>
    </motion.main>
  );
};

export default HomePageClient;
