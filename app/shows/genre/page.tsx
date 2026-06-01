'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Pagination from '@/components/Pagination';
import MediaList from '@/components/MediaPerson/MediaList';
import * as Queries from '@/graphql/queries';
import { Select } from 'antd';
import { RESULTS_PER_PAGE } from '@/utils/constants';
import { Circles } from 'react-loading-icons';
import { TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { CommonMethods } from '@/utils/CommonMethods';
import { SORT_BY_OPTIONS, SHOW_GENRE_TYPE_OPTIONS } from '@/models/dropDownOptions';
import type {
  PopularShowsByGenreQuery,
  TopRatedShowsByGenreQuery,
} from '@/graphql/generated/code-gen/graphql';
import {
  ShowGenreTypes as GQLShowGenreTypes,
  Exact,
  InputMaybe,
} from '@/graphql/generated/code-gen/runtimeEnums';
import { TShowsGenreData } from '@ts/types';

const { Option } = Select;

const Genre = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get('page') ?? '1';
  const currPage = Math.max(1, Number.parseInt(page, 10) || 1);

  const [sortByQueryType, setSortByQueryType] = useState<
    TypedDocumentNode<
      PopularShowsByGenreQuery | TopRatedShowsByGenreQuery,
      Exact<{
        page?: InputMaybe<number> | undefined;
        genre: GQLShowGenreTypes;
      }>
    >
  >(Queries.POPULAR_SHOWS_BY_GENRE);

  const [showGenreType, setShowGenreType] = useState<GQLShowGenreTypes>(
    GQLShowGenreTypes.ActionAmpersandAdventure
  );

  const { data: genreOfShowsData } = useQuery(sortByQueryType, {
    variables: {
      genre: showGenreType,
      page: parseInt(page, 10),
    },
  });

  const handleSortByChange = (value: 'Popular' | 'Top Rated') => {
    if (value === 'Popular') {
      setSortByQueryType(Queries.POPULAR_SHOWS_BY_GENRE);
    } else {
      setSortByQueryType(Queries.TOP_RATED_SHOWS_BY_GENRE);
    }
  };

  const handleGenreTypeChange = (value: string) => {
    setShowGenreType(value as GQLShowGenreTypes);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToTop();
  }, [page]);

  return (
    <main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
      <section className='grid grid-cols-[20%_60%_20%]'>
        <section className='m-4 justify-self-center'>
          <div className='mb-2'>
            <label className='mb-1 block text-blue-500' htmlFor='sort-by-dropdown'>
              Sort By:
            </label>
            <Select
              className='!w-[10rem]'
              id='sort-by-dropdown'
              defaultValue='Popular'
              onChange={handleSortByChange}
            >
              {SORT_BY_OPTIONS.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.text}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <label className='mb-1 block text-blue-500' htmlFor='genre-type-dropdown'>
              Genre Type:
            </label>
            <Select
              className='!w-[10rem]'
              id='genre-type-dropdown'
              size='middle'
              defaultValue='Action_AMPERSAND_Adventure'
              onChange={handleGenreTypeChange}
            >
              {SHOW_GENRE_TYPE_OPTIONS.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.text}
                </Option>
              ))}
            </Select>
          </div>
        </section>

        {(CommonMethods.extractGraphQLData(
          genreOfShowsData ?? {}
        ) as unknown as TShowsGenreData) ? (
          <div>
            <MediaList
              mediaData={
                CommonMethods.extractGraphQLData(
                  genreOfShowsData ?? {}
                ) as unknown as TShowsGenreData
              }
              pageNum={currPage}
              title={`${
                sortByQueryType === Queries.POPULAR_SHOWS_BY_GENRE ? 'Popular' : 'Top Rated'
              } ${CommonMethods.unParseSpecialChars(showGenreType)} Shows`}
              genrePage
            />

            <Pagination
              currPage={currPage}
              totalItems={
                (
                  CommonMethods.extractGraphQLData(
                    genreOfShowsData ?? {}
                  ) as unknown as TShowsGenreData
                ).total_results
              }
              itemsPerPage={RESULTS_PER_PAGE}
              paginate={(pageNum: number) => router.push(`/shows/genre?page=${pageNum}`)}
              siblingCount={1}
              maxPageNum={500}
            />
          </div>
        ) : (
          <section className='flex h-[calc(100vh-var(--header-height-mobile))] items-center justify-center'>
            <Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
          </section>
        )}
      </section>
    </main>
  );
};

export default Genre;
