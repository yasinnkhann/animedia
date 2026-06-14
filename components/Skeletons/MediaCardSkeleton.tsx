'use client';

import { useSession } from 'next-auth/react';

export default function MediaCardSkeleton() {
  const { data: session } = useSession();

  return (
    <tr className='animate-pulse border-b border-border'>
      <td className='p-4 text-center align-middle'>
        <div className='mx-auto h-6 w-8 rounded bg-gray-200 dark:bg-gray-700' />
      </td>

      <td className='grid grid-cols-[5rem_calc(100%-5rem)] grid-rows-[100%] break-words p-4'>
        <section className='relative row-start-1 h-[7rem] w-[5rem] rounded-lg bg-gray-200 dark:bg-gray-700' />
        <section className='col-start-2 flex flex-col justify-center gap-2 pl-4'>
          <div className='h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700' />
          <div className='h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700' />
        </section>
      </td>

      <td className='p-4 text-center align-middle'>
        <div className='mx-auto h-5 w-8 rounded bg-gray-200 dark:bg-gray-700' />
      </td>

      {session && (
        <>
          <td className='p-4 text-center align-middle'>
            <div className='mx-auto h-5 w-8 rounded bg-gray-200 dark:bg-gray-700' />
          </td>
          <td className='px-4 text-center align-middle'>
            <div className='mx-auto h-5 w-16 rounded bg-gray-200 dark:bg-gray-700' />
          </td>
        </>
      )}
    </tr>
  );
}
