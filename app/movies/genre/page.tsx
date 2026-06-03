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
import type {
  MovieGenreTypes as GQLMovieGenreTypes,
  PopularMoviesByGenreQuery,
  PopularMoviesByGenreQueryVariables,
  TopRatedMoviesByGenreQuery,
  TopRatedMoviesByGenreQueryVariables,
} from '@/graphql/generated/code-gen/graphql';
import { SORT_BY_OPTIONS, MOVIE_GENRE_TYPE_OPTIONS } from '@/models/dropDownOptions';

const { Option } = Select;

type MoviesGenreData =
  | PopularMoviesByGenreQuery['popularMoviesByGenre']
  | TopRatedMoviesByGenreQuery['topRatedMoviesByGenre'];
type MoviesGenreVariables =
  | PopularMoviesByGenreQueryVariables
  | TopRatedMoviesByGenreQueryVariables;

const Genre = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get('page') ?? '1';
  const currPage = Math.max(1, Number.parseInt(page, 10) || 1);

  const [sortByQueryType, setSortByQueryType] = useState<
    TypedDocumentNode<PopularMoviesByGenreQuery | TopRatedMoviesByGenreQuery, MoviesGenreVariables>
  >(Queries.POPULAR_MOVIES_BY_GENRE);

  const [movieGenreType, setMovieGenreType] = useState<GQLMovieGenreTypes>('Action');

  const { data: genreOfMoviesData } = useQuery(sortByQueryType, {
    variables: { genre: movieGenreType, page: parseInt(page, 10) },
  });

  const handleSortByChange = (value: 'Popular' | 'Top Rated') => {
    if (value === 'Popular') {
      setSortByQueryType(Queries.POPULAR_MOVIES_BY_GENRE);
    } else {
      setSortByQueryType(Queries.TOP_RATED_MOVIES_BY_GENRE);
    }
  };

  const handleGenreTypeChange = (value: string) => {
    setMovieGenreType(value as GQLMovieGenreTypes);
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
        <section className='mt-4 justify-self-center'>
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
              defaultValue='Action'
              onChange={handleGenreTypeChange}
            >
              {MOVIE_GENRE_TYPE_OPTIONS.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.text}
                </Option>
              ))}
            </Select>
          </div>
        </section>

        {(genreOfMoviesData?.[
          Object.keys(genreOfMoviesData)[0] as keyof typeof genreOfMoviesData
        ] as unknown as MoviesGenreData) ? (
          <div>
            <MediaList
              mediaData={
                genreOfMoviesData?.[
                  Object.keys(genreOfMoviesData)[0] as keyof typeof genreOfMoviesData
                ] as unknown as MoviesGenreData
              }
              pageNum={currPage}
              title={`${
                sortByQueryType === Queries.POPULAR_MOVIES_BY_GENRE ? 'Popular' : 'Top Rated'
              } ${movieGenreType} Movies`}
              genrePage
            />

            <Pagination
              currPage={currPage}
              totalItems={
                (
                  genreOfMoviesData?.[
                    Object.keys(genreOfMoviesData)[0] as keyof typeof genreOfMoviesData
                  ] as unknown as MoviesGenreData
                ).total_results
              }
              itemsPerPage={RESULTS_PER_PAGE}
              paginate={(pageNum: number) => router.push(`/movies/genre?page=${pageNum}`)}
              siblingCount={1}
              maxPageNum={500}
            />
          </div>
        ) : (
          <div className='flex h-[calc(100vh-var(--header-height-mobile))] items-center justify-center'>
            <Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
          </div>
        )}
      </section>
    </main>
  );
};

export default Genre;
