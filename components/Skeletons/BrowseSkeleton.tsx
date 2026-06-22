'use client';

import { useSession } from 'next-auth/react';
import MediaCardSkeleton from './MediaCardSkeleton';

export default function BrowseSkeleton() {
  const { data: session } = useSession();

  return (
    <main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
      <section className='flex flex-col items-center'>
        <section className='w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24'>
          <section className='flex flex-col'>
            <div className='mb-2 ml-4 h-7 w-48 animate-pulse rounded bg-muted' />
            <div className='mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
              {Array.from({ length: 15 }).map((_, idx) => (
                <MediaCardSkeleton key={`loading-skeleton-${idx}`} />
              ))}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
