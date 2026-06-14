'use client';

import { useMemo } from 'react';
import MyMediaList from '@components/MyMedia/MyMediaList';
import { Circles } from 'react-loading-icons';
import { useSearchParams } from 'next/navigation';
import { TStatusParam } from '@ts/types';
import { useSession } from 'next-auth/react';
import { useUserMedia } from '@/components/UserMediaProvider';

const MyGames = () => {
  const { status } = useSession();

  const searchParams = useSearchParams();

  const { userGames } = useUserMedia();

  if (status === 'loading') {
    return (
      <section className='flex h-screen items-center justify-center'>
        <Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
      </section>
    );
  }

  return (
    <main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
      <MyMediaList
        status={searchParams.get('status') as TStatusParam}
        myMedias={userGames}
        mediaType='GAMES'
      />
    </main>
  );
};

export default MyGames;
