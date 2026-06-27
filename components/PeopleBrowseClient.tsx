'use client';

import { useEffect, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import PeopleList from './MediaPerson/PeopleList';

interface Props {
  initialData: any;
  title: string;
  queryKey: string[];
  fetchNextPageAction: (page: number) => Promise<any>;
}

const PeopleBrowseClient = ({ initialData, title, queryKey, fetchNextPageAction }: Props) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey,
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

  return (
    <main className='mt-[calc(var(--header-height-mobile)+1rem)] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24'>
      <h3 className='mb-4'>{title}</h3>
      <PeopleList results={allResults} isFetchingNextPage={isFetchingNextPage} />

      <div className='my-8 flex justify-center'>
        <div ref={ref} className='h-1 w-full'></div>
      </div>
    </main>
  );
};

export default PeopleBrowseClient;
