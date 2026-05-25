'use client';

import { useEffect, useMemo } from 'react';
import MyMediaList from 'components/MyMedia/MyMediaList';
import * as Queries from '../../../graphql/queries';
import { Circles } from 'react-loading-icons';
import { CommonMethods } from 'utils/CommonMethods';
import { useRouter, useParams } from 'next/navigation';
import { TStatusParam } from '@ts/types';
import { useSession } from 'next-auth/react';
import { useQuery } from '@apollo/client/react';
import { UserShow, WatchStatusTypes } from 'graphql/generated/code-gen/graphql';

function watchStatusFromParam(statusParam: string): WatchStatusTypes | undefined {
  switch (statusParam) {
    case 'watching':
      return WatchStatusTypes.Watching;
    case 'completed':
      return WatchStatusTypes.Completed;
    case 'on-hold':
      return WatchStatusTypes.OnHold;
    case 'dropped':
      return WatchStatusTypes.Dropped;
    case 'plan-to-watch':
      return WatchStatusTypes.PlanToWatch;
    default:
      return undefined;
  }
}

const Status = () => {
  const { data: session, status: sessionStatus } = useSession();

  const router = useRouter();
  const params = useParams();

  const statusParam = params.status as string;

  const { data: usersShowsData, loading: usersShowsLoading } = useQuery(Queries.USERS_SHOWS, {
    fetchPolicy: 'network-only',
  });

  const watchStatus = statusParam ? watchStatusFromParam(statusParam) : undefined;

  const myShows = useMemo((): UserShow[] => {
    if (!usersShowsData?.usersShows || watchStatus === undefined) {
      return [];
    }
    return usersShowsData.usersShows.filter(show => show?.status === watchStatus) as UserShow[];
  }, [usersShowsData, watchStatus]);

  useEffect(() => {
    if (sessionStatus && sessionStatus !== 'loading' && statusParam) {
      if (!session || !CommonMethods.statusParams.has(statusParam)) {
        router.push('/');
      }
    }
  }, [router, session, sessionStatus, statusParam]);

  if (usersShowsLoading || sessionStatus === 'loading' || statusParam === undefined) {
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
      <MyMediaList status={statusParam as TStatusParam} myMedias={myShows} mediaType='SHOWS' />
    </main>
  );
};

export default Status;
