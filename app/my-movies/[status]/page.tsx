'use client';

import { useMemo } from 'react';
import MyMediaList from '@components/MyMedia/MyMediaList';
import { CommonMethods } from '@utils/CommonMethods';
import LibraryNav from '@/components/MyMedia/LibraryNav';
import { useParams, redirect } from 'next/navigation';
import { TStatusParam } from '@ts/types';
import { useUserMedia } from '@/components/UserMediaProvider';
import Loading from './loading';

const Status = () => {
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
      <LibraryNav currentTab='movies' />
      <MyMediaList status={statusParam as TStatusParam} myMedias={myMovies} mediaType='MOVIES' />
    </main>
  );
};

export default Status;
