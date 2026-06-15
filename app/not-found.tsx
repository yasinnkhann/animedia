import Link from 'next/link';
import { FiHelpCircle, FiHome } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className='flex min-h-[70vh] flex-col items-center justify-center px-4 text-center'>
      <div className='relative mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-muted/50 before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-primary/20 before:blur-2xl'>
        <FiHelpCircle className='h-16 w-16 text-primary' />
      </div>

      <h1 className='mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl'>
        404 - Lost in the Void
      </h1>

      <p className='mb-8 max-w-md text-lg text-muted-foreground'>
        We couldn&apos;t find the page or media you were looking for. It might have been removed, or
        the link might be broken.
      </p>

      <Link
        href='/'
        className='group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:ring-4 hover:ring-primary/30'
      >
        <FiHome className='h-5 w-5 transition-transform group-hover:-translate-y-0.5' />
        Return Home
      </Link>
    </div>
  );
}
