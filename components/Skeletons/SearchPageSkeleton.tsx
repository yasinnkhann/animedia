'use client';

import SearchResultSkeleton from './SearchResultSkeleton';

export default function SearchPageSkeleton() {
  return (
    <main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
      <div className='flex items-center justify-center pt-8'>
        <div className='h-12 w-1/2 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700' />
      </div>
      <section className='mt-8 grid grid-cols-[20%_80%]'>
        <section className='m-4 flex flex-col items-center'>
          <div className='mb-4 w-full'>
            <div className='h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700' />
          </div>
          <ul className='w-full'>
            {[1, 2, 3, 4].map(idx => (
              <li key={idx} className='flex w-full items-center justify-between py-2'>
                <div className='h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700' />
                <div className='h-4 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700' />
              </li>
            ))}
          </ul>
        </section>

        <section className='m-4'>
          {Array.from({ length: 10 }).map((_, idx) => (
            <SearchResultSkeleton key={`search-loading-${idx}`} />
          ))}
        </section>
      </section>
    </main>
  );
}
