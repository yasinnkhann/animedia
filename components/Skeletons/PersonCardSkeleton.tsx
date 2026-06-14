'use client';

export default function PersonCardSkeleton() {
  return (
    <section className='animate-pulse'>
      <div className='relative h-[20rem] rounded-lg bg-gray-200 dark:bg-gray-700' />
      <div className='ml-4 mt-4'>
        <div className='h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700' />
      </div>
    </section>
  );
}
