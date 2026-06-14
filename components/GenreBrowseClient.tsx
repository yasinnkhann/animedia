'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import MediaList from './MediaPerson/MediaList';
import { Select } from 'antd';

interface Props {
  initialData: any;
  sortBy: string;
  genre: string;
  basePath: string;
  sortByOptions: { text: string; value: string }[];
  genreOptions: { text: string; value: string }[];
  fetchNextPageAction: (page: number) => Promise<any>;
}

const GenreBrowseClient = ({
  initialData,
  sortBy,
  genre,
  basePath,
  sortByOptions,
  genreOptions,
  fetchNextPageAction,
}: Props) => {
  const router = useRouter();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [basePath, genre, sortBy],
    queryFn: ({ pageParam = 1 }) => fetchNextPageAction(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage && lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialData: {
      pages: [initialData],
      pageParams: [1],
    },
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allResults = useMemo(() => {
    return data?.pages.flatMap(page => page?.results || []) || [];
  }, [data]);

  const handleSortByChange = (value: string) => {
    router.push(
      `${basePath}?sortBy=${encodeURIComponent(value)}&genre=${encodeURIComponent(genre)}`
    );
  };

  const handleGenreTypeChange = (value: string) => {
    router.push(
      `${basePath}?sortBy=${encodeURIComponent(sortBy)}&genre=${encodeURIComponent(value)}`
    );
  };

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
              value={sortBy}
              options={sortByOptions.map(option => ({
                value: option.value,
                label: option.text,
              }))}
              onChange={handleSortByChange}
            />
          </div>

          <div>
            <label className='mb-1 block text-blue-500' htmlFor='genre-type-dropdown'>
              Genre Type:
            </label>
            <Select
              className='!w-[10rem]'
              id='genre-type-dropdown'
              size='middle'
              value={genre}
              options={genreOptions.map(option => ({
                value: option.value,
                label: option.text,
              }))}
              onChange={handleGenreTypeChange}
            />
          </div>
        </section>

        <section className='flex flex-col items-center'>
          <MediaList
            results={allResults}
            title={`${sortBy} ${genre} ${basePath.includes('show') ? 'Shows' : basePath.includes('game') ? 'Games' : 'Movies'}`}
            genrePage
            isFetchingNextPage={isFetchingNextPage}
          />

          <div className='my-8 flex justify-center'>
            <div ref={ref} className='h-1 w-full'></div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default GenreBrowseClient;
