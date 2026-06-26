import React from 'react';
import HorizontalScrollerSkeleton from './HorizontalScrollerSkeleton';

export default function ForYouScrollerSkeleton() {
  return (
    <section className='mt-8'>
      <div className='mx-[3rem] flex flex-col justify-between md:flex-row md:items-end'>
        <div>
          <div className='h-8 w-64 animate-pulse rounded bg-muted sm:h-10' />
          <div className='mt-2 h-4 w-48 animate-pulse rounded bg-muted' />
        </div>

        {/* Filters & Sorting Controls Skeleton */}
        <div className='mt-4 flex flex-wrap items-center gap-3 md:mt-0'>
          <div className='h-8 w-[14rem] animate-pulse rounded-md bg-muted' />
          <div className='h-8 w-32 animate-pulse rounded-md bg-muted' />
        </div>
      </div>

      <section className='mt-4'>
        <HorizontalScrollerSkeleton />
      </section>
    </section>
  );
}
