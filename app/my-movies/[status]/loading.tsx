'use client';

export default function Loading() {
  return (
    <section className='mt-[calc(var(--header-height-mobile)+1rem)] w-full px-4 sm:px-10 md:px-20 lg:px-40'>
      <div className='flex animate-pulse flex-col pb-4'>
        <div className='relative mt-8 h-[3rem] w-full rounded-t-lg bg-muted/50' />

        <div className='mb-6 mt-4 flex flex-wrap gap-2'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='h-9 w-24 rounded-full bg-muted/50' />
          ))}
        </div>

        <div className='flex flex-col gap-4'>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className='flex h-[9rem] w-full items-center rounded-lg border border-border bg-card/50 p-4'
            >
              <div className='h-[7rem] w-[5rem] shrink-0 rounded-lg bg-muted' />
              <div className='ml-4 flex flex-1 flex-col justify-center space-y-3'>
                <div className='h-5 w-3/4 max-w-[200px] rounded bg-muted' />
                <div className='h-4 w-1/2 max-w-[150px] rounded bg-muted' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
