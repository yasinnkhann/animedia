'use client';

import { useEffect, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { Circles } from 'react-loading-icons';
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
    <main className='mt-[calc(var(--header-height-mobile)+1rem)] px-48'>
      <h3 className='mb-4'>{title}</h3>
      <PeopleList results={allResults} />

      <div ref={ref} className='my-8 flex justify-center'>
        {isFetchingNextPage && <Circles className='h-8 w-8' stroke='#00b3ff' />}
      </div>
    </main>
  );
};

export default PeopleBrowseClient;
