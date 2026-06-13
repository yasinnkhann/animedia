'use client';

import { useMemo } from 'react';
import MyMediaList from '@components/MyMedia/MyMediaList';
import * as Queries from '@graphql/queries';
import { Circles } from 'react-loading-icons';
import { useSearchParams } from 'next/navigation';
import { TStatusParam } from '@ts/types';
import { useSession } from 'next-auth/react';
import { useQuery } from '@apollo/client/react';
import type { UsersGamesQuery } from '@/graphql/generated/code-gen/graphql';

type UserGame = NonNullable<NonNullable<UsersGamesQuery['usersGames']>[number]>;

const MyGames = () => {
  const { status } = useSession();

  const searchParams = useSearchParams();

  const { data: usersGamesData, loading: usersGamesLoading } = useQuery(Queries.USERS_GAMES, {
    fetchPolicy: 'network-only',
  });

  const myGames = useMemo((): UserGame[] => {
    if (usersGamesData?.usersGames && Array.isArray(usersGamesData.usersGames)) {
      return usersGamesData.usersGames as UserGame[];
    }
    return [];
  }, [usersGamesData?.usersGames]);

  if (usersGamesLoading || status === 'loading') {
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
        myMedias={myGames}
        mediaType='GAMES'
      />
    </main>
  );
};

export default MyGames;
