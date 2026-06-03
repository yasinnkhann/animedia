'use client';

import { useRef, useState } from 'react';
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
    <main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
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
                  className={`cursor-pointer ${
                    whatsPopularQueryType === Queries.POPULAR_MOVIES
                      ? 'border-b-4 border-indigo-500'
                      : ''
                  }`}
                  onClick={() => handleChangePopularQueryType(Queries.POPULAR_MOVIES)}
                >
                  Movies
                </li>
                <li
                  className={`cursor-pointer ${
                    whatsPopularQueryType === Queries.POPULAR_SHOWS
                      ? 'border-b-4 border-indigo-500'
                      : ''
                  }`}
                  onClick={() => handleChangePopularQueryType(Queries.POPULAR_SHOWS)}
                >
                  Shows
                </li>
                <li
                  className={`cursor-pointer ${
                    whatsPopularQueryType === Queries.MOVIES_IN_THEATRES
                      ? 'border-b-4 border-indigo-500'
                      : ''
                  }`}
                  onClick={() => handleChangePopularQueryType(Queries.MOVIES_IN_THEATRES)}
                >
                  In Theatres
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
                    className={`mr-4 cursor-pointer md:mr-20 ${
                      trendingQueryType === Queries.TRENDING_MOVIES
                        ? 'border-b-4 border-indigo-500'
                        : ''
                    }`}
                    onClick={() => handleChangeTrendingQueryType(Queries.TRENDING_MOVIES)}
                  >
                    Movies
                  </li>
                  <li
                    className={`cursor-pointer ${
                      trendingQueryType === Queries.TRENDING_SHOWS
                        ? 'border-b-4 border-indigo-500'
                        : ''
                    }`}
                    onClick={() => handleChangeTrendingQueryType(Queries.TRENDING_SHOWS)}
                  >
                    Shows
                  </li>
                </ul>
                <ul className='flex justify-around'>
                  <li
                    className={`mr-4 cursor-pointer md:mr-20 ${
                      trendingTimeWindow === 'day' ? 'border-b-4 border-indigo-500' : ''
                    }`}
                    onClick={() => setTrendingTimeWindow('day')}
                  >
                    Today
                  </li>
                  <li
                    className={`cursor-pointer ${
                      trendingTimeWindow === 'week' ? 'border-b-4 border-indigo-500' : ''
                    }`}
                    onClick={() => setTrendingTimeWindow('week')}
                  >
                    This Week
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
    </main>
  );
};

export default HomePageClient;
