import React from 'react';
import PageAnimationWrapper from '@/components/PageAnimationWrapper';
import HorizontalScrollerSkeleton from '@/components/Skeletons/HorizontalScrollerSkeleton';

export default function MediaDetailsSkeleton() {
  return (
    <PageAnimationWrapper className='mt-[calc(var(--header-height-mobile)+1rem)] grid grid-cols-[30%_70%] px-16'>
      {/* Left Column - Poster */}
      <section className='aspect-h-16 aspect-w-16 relative mx-4 mt-4'>
        <div className='h-full w-full animate-pulse rounded-lg bg-muted shadow-lg' />
      </section>

      {/* Right Column - Main Info */}
      <section className='mt-4'>
        <section className='mb-8 mt-8 flex items-center'>
          <div className='h-[5rem] w-[5rem] animate-pulse rounded-full bg-muted' />
          <div className='ml-4 h-4 w-32 animate-pulse rounded bg-muted' />
        </section>

        {/* Action Buttons Skeleton */}
        <div className='mb-8 flex gap-4'>
          <div className='h-10 w-32 animate-pulse rounded bg-muted' />
          <div className='h-10 w-10 animate-pulse rounded-full bg-muted' />
        </div>

        <section className='pb-32'>
          <div className='mb-4 h-10 w-2/3 animate-pulse rounded bg-muted' />
          <div className='my-4 h-6 w-1/3 animate-pulse rounded bg-muted' />
          <div className='mt-8 space-y-3'>
            <div className='h-4 w-full animate-pulse rounded bg-muted' />
            <div className='h-4 w-11/12 animate-pulse rounded bg-muted' />
            <div className='h-4 w-4/5 animate-pulse rounded bg-muted' />
            <div className='h-4 w-full animate-pulse rounded bg-muted' />
          </div>
        </section>
      </section>

      {/* Left Column - Details List */}
      <section className='my-4 ml-8 space-y-4'>
        <div className='mb-8 h-6 w-24 animate-pulse rounded bg-muted' />
        <div className='h-4 w-20 animate-pulse rounded bg-muted' />
        <div className='ml-1 h-3 w-16 animate-pulse rounded bg-muted' />
        <div className='h-4 w-20 animate-pulse rounded bg-muted' />
        <div className='ml-1 h-3 w-24 animate-pulse rounded bg-muted' />
        <div className='h-4 w-24 animate-pulse rounded bg-muted' />
        <div className='ml-1 h-3 w-32 animate-pulse rounded bg-muted' />
      </section>

      {/* Right Column - Scrollers */}
      <section className='col-start-2 mt-4'>
        <HorizontalScrollerSkeleton />
        <div className='my-8' />
        <HorizontalScrollerSkeleton />
      </section>
    </PageAnimationWrapper>
  );
}
