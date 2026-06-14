import React from 'react';

export default function HorizontalScrollerSkeleton() {
  return (
    <div className='flex gap-4 overflow-hidden px-4 py-6'>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className='flex flex-col gap-2'>
          <div className='h-[15rem] w-[10rem] animate-pulse rounded-lg bg-muted' />
          <div className='h-4 w-3/4 animate-pulse rounded bg-muted' />
          <div className='h-3 w-1/2 animate-pulse rounded bg-muted' />
        </div>
      ))}
    </div>
  );
}
