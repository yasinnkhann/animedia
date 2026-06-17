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

  const { userMovies } = useUserMedia();

  const watchStatus = statusParam ? watchStatusFromParam(statusParam) : undefined;

  const myMovies = useMemo(() => {
    if (!userMovies || watchStatus === undefined) {
      return [];
    }
    return userMovies.filter(movie => movie?.status === watchStatus);
  }, [userMovies, watchStatus]);

  useEffect(() => {
    if (statusParam && !CommonMethods.statusParams.has(statusParam)) {
      router.push('/');
    }
  }, [router, statusParam]);

  if (statusParam === undefined || !CommonMethods.statusParams.has(statusParam)) {
    return null;
  }

  return (
    <main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
      <MyMediaList status={statusParam as TStatusParam} myMedias={myMovies} mediaType='MOVIES' />
    </main>
  );
};

export default Status;
