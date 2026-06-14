'use client';

import { useEffect, useMemo } from 'react';
import MyMediaList from '@components/MyMedia/MyMediaList';
import { Circles } from 'react-loading-icons';
import { CommonMethods } from '@utils/CommonMethods';
import { useRouter, useParams } from 'next/navigation';
import { TStatusParam } from '@ts/types';
import { useSession } from 'next-auth/react';
import { useUserMedia } from '@/components/UserMediaProvider';
import type { WatchStatus } from '@prisma/client';

function watchStatusFromParam(statusParam: string): WatchStatus | undefined {
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

  const { userShows } = useUserMedia();

  const watchStatus = statusParam ? watchStatusFromParam(statusParam) : undefined;

  const myShows = useMemo(() => {
    if (!userShows || watchStatus === undefined) {
      return [];
    }
    return userShows.filter(show => show?.status === watchStatus);
  }, [userShows, watchStatus]);

  useEffect(() => {
    if (sessionStatus && sessionStatus !== 'loading' && statusParam) {
      if (!session || !CommonMethods.statusParams.has(statusParam)) {
        router.push('/');
      }
    }
  }, [router, session, sessionStatus, statusParam]);

  if (sessionStatus === 'loading' || statusParam === undefined) {
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
