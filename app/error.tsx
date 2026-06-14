'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import Link from 'next/link';
import { FiAlertOctagon, FiRotateCcw, FiHome } from 'react-icons/fi';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className='flex min-h-[70vh] flex-col items-center justify-center px-4 text-center'>
      <div className='relative mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-red-900/20 before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-red-600/20 before:blur-2xl'>
        <FiAlertOctagon className='h-16 w-16 text-red-500' />
      </div>

      <h1 className='mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl'>
        Oops, something went wrong!
      </h1>

      <p className='mb-8 max-w-md text-lg text-gray-400'>
        We&apos;ve logged the error and are looking into it. Please try again or return to the
        homepage.
      </p>

      <div className='flex flex-col gap-4 sm:flex-row'>
        <button
          onClick={() => reset()}
          className='group inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-500 hover:ring-4 hover:ring-blue-600/30'
        >
          <FiRotateCcw className='h-5 w-5 transition-transform group-hover:-rotate-90' />
          Try Again
        </button>

        <Link
          href='/'
          className='group inline-flex items-center justify-center gap-2 rounded-full bg-gray-800 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-gray-700 hover:ring-4 hover:ring-gray-800/30'
        >
          <FiHome className='h-5 w-5 transition-transform group-hover:-translate-y-0.5' />
          Return Home
        </Link>
      </div>
    </div>
  );
}
