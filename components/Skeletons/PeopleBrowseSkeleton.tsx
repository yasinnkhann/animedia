'use client';

import PersonCardSkeleton from './PersonCardSkeleton';

export default function PeopleBrowseSkeleton() {
  return (
    <main className='mt-[calc(var(--header-height-mobile)+1rem)] px-48'>
      <div className='mb-4 h-7 w-48 animate-pulse rounded bg-muted' />
      <section className='mb-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
        {Array.from({ length: 20 }).map((_, idx) => (
          <PersonCardSkeleton key={`skeleton-${idx}`} />
        ))}
      </section>
    </main>
  );
}
