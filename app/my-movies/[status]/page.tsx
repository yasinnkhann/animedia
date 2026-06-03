'use client';

import { useEffect, useMemo } from 'react';
import * as Queries from '@/graphql/queries';
import MyMediaList from 'components/MyMedia/MyMediaList';
import { Circles } from 'react-loading-icons';
import { CommonMethods } from 'utils/CommonMethods';
import { useRouter, useParams } from 'next/navigation';
import { TStatusParam } from '@ts/types';
import { useSession } from 'next-auth/react';
import { useQuery } from '@apollo/client/react';
import type { UsersMoviesQuery, WatchStatusTypes } from '@/graphql/generated/code-gen/graphql';

type UserMovie = NonNullable<NonNullable<UsersMoviesQuery['usersMovies']>[number]>;

function watchStatusFromParam(statusParam: string): WatchStatusTypes | undefined {
  switch (statusParam) {
    case 'watching':
      return 'WATCHING';
    case 'completed':
      return 'COMPLETED';
    case 'on-hold':
      return 'ON_HOLD';
    case 'dropped':
      return 'DROPPED';
    case 'plan-to-watch':
      return 'PLAN_TO_WATCH';
    default:
      return undefined;
  }
}

const Status = () => {
  const { data: session, status: sessionStatus } = useSession();

  const router = useRouter();
  const params = useParams();

  const statusParam = params.status as string;

  const { data: usersMoviesData, loading: usersMoviesLoading } = useQuery(Queries.USERS_MOVIES, {
    fetchPolicy: 'network-only',
  });

  const watchStatus = statusParam ? watchStatusFromParam(statusParam) : undefined;

  const myMovies = useMemo((): UserMovie[] => {
    if (!usersMoviesData?.usersMovies || watchStatus === undefined) {
      return [];
    }
    return usersMoviesData.usersMovies.filter(
      movie => movie?.status === watchStatus
    ) as UserMovie[];
  }, [usersMoviesData, watchStatus]);

  useEffect(() => {
    if (sessionStatus && sessionStatus !== 'loading' && statusParam) {
      if (!session || !CommonMethods.statusParams.has(statusParam)) {
        router.push('/');
      }
    }
  }, [router, session, sessionStatus, statusParam]);

  if (usersMoviesLoading || sessionStatus === 'loading' || statusParam === undefined) {
    return (
      <section className='flex h-screen items-center justify-center'>
        <Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
      </section>
    );
  }

  if (!CommonMethods.statusParams.has(statusParam) || !session) {
    router.push('/');
    return null;
  }

  return (
    <main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
      <MyMediaList status={statusParam as TStatusParam} myMedias={myMovies} mediaType='MOVIES' />
    </main>
  );
};

export default Status;
