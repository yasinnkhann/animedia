'use client';

export default function PersonCardSkeleton() {
  return (
    <section className='animate-pulse'>
      <div className='relative h-[20rem] rounded-lg bg-muted' />
      <div className='ml-4 mt-4'>
        <div className='h-5 w-3/4 rounded bg-muted' />
      </div>
    </section>
  );
}
