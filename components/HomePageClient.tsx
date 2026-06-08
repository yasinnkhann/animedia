'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SearchBar from './Search/SearchBar';
import HomeHorizontalScroller from './HorizontalScroller/Home/HomeHorizontalScroller';
import * as Queries from '../graphql/queries';
import { Circles } from 'react-loading-icons';
import { TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { CommonMethods } from '../utils/CommonMethods';
import type {
  PopularMoviesQuery,
  PopularMoviesQueryVariables,
  PopularShowsQuery,
  PopularShowsQueryVariables,
  MoviesInTheatresQuery,
  MoviesInTheatresQueryVariables,
  TrendingMoviesQuery,
  TrendingMoviesQueryVariables,
  TrendingShowsQuery,
  TrendingShowsQueryVariables,
  TimeWindowTypes,
} from '../graphql/generated/code-gen/graphql';

type WhatsPopularQuery = PopularMoviesQuery | PopularShowsQuery | MoviesInTheatresQuery;
type WhatsPopularQueryVariables =
  | PopularMoviesQueryVariables
  | PopularShowsQueryVariables
  | MoviesInTheatresQueryVariables;
type TrendingQuery = TrendingMoviesQuery | TrendingShowsQuery;
type TrendingQueryVariables = TrendingMoviesQueryVariables | TrendingShowsQueryVariables;
type HomeListData =
  | PopularMoviesQuery['popularMovies']
  | PopularShowsQuery['popularShows']
  | MoviesInTheatresQuery['moviesInTheatres']
  | TrendingMoviesQuery['trendingMovies']
  | TrendingShowsQuery['trendingShows'];
type HomeScrollerData = HomeListData['results'];

const HomePageClient = () => {
  const [whatsPopularQueryType, setWhatsPopularQueryType] = useState<
    TypedDocumentNode<WhatsPopularQuery, WhatsPopularQueryVariables>
  >(Queries.POPULAR_MOVIES);

  const [trendingQueryType, setTrendingQueryType] = useState<
    TypedDocumentNode<TrendingQuery, TrendingQueryVariables>
  >(Queries.TRENDING_MOVIES);

  const [trendingTimeWindow, setTrendingTimeWindow] = useState<TimeWindowTypes>('day');

  const searchBarRef = useRef<HTMLInputElement>(null);

  const { data: whatsPopularData, loading: whatsPopularLoading } = useQuery(whatsPopularQueryType);

  const { data: trendingData, loading: trendingLoading } = useQuery(trendingQueryType, {
    variables: {
      timeWindow: trendingTimeWindow,
    },
  });

  useQuery(Queries.POPULAR_SHOWS);

  useQuery(Queries.MOVIES_IN_THEATRES);

  useQuery(Queries.TRENDING_MOVIES, {
    variables: {
      timeWindow: 'week',
    },
  });

  useQuery(Queries.TRENDING_SHOWS, {
    variables: {
      timeWindow: 'day',
    },
  });

  useQuery(Queries.TRENDING_SHOWS, {
    variables: {
      timeWindow: 'week',
    },
  });

  const allDataLoaded: boolean = !!(
    whatsPopularData &&
    !whatsPopularLoading &&
    trendingData &&
    !trendingLoading
  );

  const handleChangePopularQueryType = (
    queryType: TypedDocumentNode<WhatsPopularQuery, WhatsPopularQueryVariables>
  ) => {
    setWhatsPopularQueryType(queryType);
  };

  const handleChangeTrendingQueryType = (
    queryType: TypedDocumentNode<TrendingQuery, TrendingQueryVariables>
  ) => {
    setTrendingQueryType(queryType);
  };

  if (trendingLoading || whatsPopularLoading) {
    return (
      <section className='flex h-screen items-center justify-center'>
        <Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
      </section>
    );
  }

  return (
    <motion.main
      className='mt-[calc(var(--header-height-mobile)+1rem)]'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {allDataLoaded && (
        <div>
          <SearchBar ref={searchBarRef} />
          <section className='mt-4'>
            <section className='ml-[3rem] flex w-full items-end'>
              <div>
                <h1 className='text-xl sm:text-3xl'>What&apos;s Popular</h1>
              </div>
              <ul className='flex w-[15rem] justify-around md:w-[25rem]'>
                <li
                  className='relative cursor-pointer pb-1'
                  onClick={() => handleChangePopularQueryType(Queries.POPULAR_MOVIES)}
                >
                  Movies
                  {whatsPopularQueryType === Queries.POPULAR_MOVIES && (
                    <motion.div
                      layoutId='popular-tab'
                      className='absolute bottom-0 left-0 right-0 h-1 rounded-t-sm bg-indigo-500'
                    />
                  )}
                </li>
                <li
                  className='relative cursor-pointer pb-1'
                  onClick={() => handleChangePopularQueryType(Queries.POPULAR_SHOWS)}
                >
                  Shows
                  {whatsPopularQueryType === Queries.POPULAR_SHOWS && (
                    <motion.div
                      layoutId='popular-tab'
                      className='absolute bottom-0 left-0 right-0 h-1 rounded-t-sm bg-indigo-500'
                    />
                  )}
                </li>
                <li
                  className='relative cursor-pointer pb-1'
                  onClick={() => handleChangePopularQueryType(Queries.MOVIES_IN_THEATRES)}
                >
                  In Theatres
                  {whatsPopularQueryType === Queries.MOVIES_IN_THEATRES && (
                    <motion.div
                      layoutId='popular-tab'
                      className='absolute bottom-0 left-0 right-0 h-1 rounded-t-sm bg-indigo-500'
                    />
                  )}
                </li>
              </ul>
            </section>

            <section className='mt-4'>
              <HomeHorizontalScroller
                items={(() => {
                  const data = whatsPopularData!;
                  return (CommonMethods.extractGraphQLData(data) as unknown as HomeListData)
                    .results as HomeScrollerData;
                })()}
              />
            </section>

            <section className='ml-[3rem] mt-4 flex items-end'>
              <div>
                <h1 className='text-xl sm:text-3xl'>Trending</h1>
              </div>
              <section className='flex w-full justify-around'>
                <ul className='flex justify-around'>
                  <li
                    className='relative mr-4 cursor-pointer pb-1 md:mr-20'
                    onClick={() => handleChangeTrendingQueryType(Queries.TRENDING_MOVIES)}
                  >
                    Movies
                    {trendingQueryType === Queries.TRENDING_MOVIES && (
                      <motion.div
                        layoutId='trending-type-tab'
                        className='absolute bottom-0 left-0 right-0 h-1 rounded-t-sm bg-indigo-500'
                      />
                    )}
                  </li>
                  <li
                    className='relative cursor-pointer pb-1'
                    onClick={() => handleChangeTrendingQueryType(Queries.TRENDING_SHOWS)}
                  >
                    Shows
                    {trendingQueryType === Queries.TRENDING_SHOWS && (
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
                    onClick={() => setTrendingTimeWindow('day')}
                  >
                    Today
                    {trendingTimeWindow === 'day' && (
                      <motion.div
                        layoutId='trending-time-tab'
                        className='absolute bottom-0 left-0 right-0 h-1 rounded-t-sm bg-indigo-500'
                      />
                    )}
                  </li>
                  <li
                    className='relative cursor-pointer pb-1'
                    onClick={() => setTrendingTimeWindow('week')}
                  >
                    This Week
                    {trendingTimeWindow === 'week' && (
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
              <HomeHorizontalScroller
                items={(() => {
                  const data = trendingData!;
                  return (CommonMethods.extractGraphQLData(data) as unknown as HomeListData)
                    .results as HomeScrollerData;
                })()}
              />
            </section>
          </section>
        </div>
      )}
    </motion.main>
  );
};

export default HomePageClient;
