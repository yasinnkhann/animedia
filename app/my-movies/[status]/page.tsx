'use client';

import { useEffect, useMemo } from 'react';
import MyMediaList from '@components/MyMedia/MyMediaList';
import { Circles } from 'react-loading-icons';
import { CommonMethods } from '@utils/CommonMethods';
import { useRouter, useParams } from 'next/navigation';
import { TStatusParam } from '@ts/types';
import { useSession } from 'next-auth/react';
import { useUserMedia } from '@/components/UserMediaProvider';
import { redirect } from 'next/navigation';
import Loading from './loading';

const Status = () => {
  const { data: session, status: sessionStatus } = useSession();

  const router = useRouter();
  const params = useParams();

  const statusParam = params.status as string;

  const { userMovies, isLoading } = useUserMedia();

  if (!statusParam || !CommonMethods.statusParams.has(statusParam)) {
    redirect('/');
  }

  const watchStatus = CommonMethods.watchStatusFromParam(statusParam);

  const myMovies = useMemo(() => {
    if (!userMovies || watchStatus === undefined) {
      return [];
    }
    return userMovies.filter(movie => movie?.status === watchStatus);
  }, [userMovies, watchStatus]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
      <MyMediaList status={statusParam as TStatusParam} myMedias={myMovies} mediaType='MOVIES' />
    </main>
  );
};

export default Status;
