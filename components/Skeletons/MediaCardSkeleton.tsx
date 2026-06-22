'use client';

import { useSession } from 'next-auth/react';

export default function MediaCardSkeleton() {
  const { data: session } = useSession();

  return (
    <div className='relative flex h-full min-h-[18rem] w-full flex-col overflow-hidden rounded-xl bg-card shadow-md'>
      {/* Image Skeleton */}
      <div className='relative aspect-[2/3] w-full animate-pulse bg-muted'>
        {/* Rating Badge Skeleton */}
        <div className='absolute bottom-3 left-3 h-8 w-8 rounded-full bg-background/50' />
      </div>

      {/* Content Skeleton */}
      <div className='flex flex-1 flex-col justify-between p-3'>
        <div className='space-y-2'>
          {/* Title Skeleton */}
          <div className='h-4 w-3/4 animate-pulse rounded bg-muted' />
          <div className='h-4 w-1/2 animate-pulse rounded bg-muted' />

          {/* Date Skeleton */}
          <div className='mt-2 h-3 w-1/3 animate-pulse rounded bg-muted/80' />
        </div>
      </div>
    </div>
  );
}
