'use client';
import MediaCardSkeleton from '@/components/Skeletons/MediaCardSkeleton';

export default function Loading() {
  return (
    <section className='mt-[calc(var(--header-height-mobile)+1rem)] w-full px-4 sm:px-10 md:px-20 lg:px-40'>
      <div className='flex animate-pulse flex-col pb-4'>
        <div className='relative mb-6 mt-8 h-[3rem] w-full rounded-t-lg bg-muted/50' />

        <div className='mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
          {[...Array(15)].map((_, i) => (
            <MediaCardSkeleton key={`loading-${i}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
