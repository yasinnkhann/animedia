'use client';

export default function SearchResultSkeleton() {
  return (
    <div className='animate-pulse text-inherit no-underline'>
      <section className='my-4 mr-16 flex h-[10rem] rounded-lg border border-gray-200 dark:border-gray-700'>
        <div className='relative w-[7rem] min-w-[7rem] rounded-l-lg bg-gray-200 dark:bg-gray-700' />
        <div className='flex w-full flex-col gap-3 p-4'>
          <div className='h-6 w-1/3 rounded bg-gray-200 dark:bg-gray-700' />
          <div className='h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mt-2 flex flex-col gap-2'>
            <div className='h-4 w-full rounded bg-gray-200 dark:bg-gray-700' />
            <div className='h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700' />
          </div>
        </div>
      </section>
    </div>
  );
}
