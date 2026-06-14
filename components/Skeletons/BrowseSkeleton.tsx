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
            <div className='mb-2 ml-4 h-7 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700' />
            <div className='overflow-x-auto'>
              <table className='w-full table-auto text-left text-sm sm:text-base'>
                <thead>
                  <tr className='border-b border-border bg-muted/20 text-muted-foreground'>
                    <th className='w-1/6 px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider'>
                      Rank
                    </th>
                    <th className='px-4 py-4 text-xs font-semibold uppercase tracking-wider'>
                      Title
                    </th>
                    <th className='w-1/6 px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider'>
                      Rating
                    </th>
                    {session && (
                      <>
                        <th className='w-1/6 px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider'>
                          My Rating
                        </th>
                        <th className='w-1/6 px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider'>
                          Status
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className='divide-y divide-border'>
                  {Array.from({ length: 15 }).map((_, idx) => (
                    <MediaCardSkeleton key={`loading-skeleton-${idx}`} />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
