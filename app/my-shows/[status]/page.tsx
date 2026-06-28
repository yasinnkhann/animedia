'use client';

import { useEffect, useMemo } from 'react';
import MyMediaList from '@components/MyMedia/MyMediaList';
import { Circles } from 'react-loading-icons';
import { CommonMethods } from '@utils/CommonMethods';
import LibraryNav from '@/components/MyMedia/LibraryNav';
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

  const { userShows, isLoading } = useUserMedia();

  if (!statusParam || !CommonMethods.statusParams.has(statusParam)) {
    redirect('/');
  }

  const watchStatus = CommonMethods.watchStatusFromParam(statusParam);

  const myShows = useMemo(() => {
    if (!userShows || watchStatus === undefined) {
      return [];
    }
    return userShows.filter(show => show?.status === watchStatus);
  }, [userShows, watchStatus]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
      <LibraryNav currentTab='shows' />
      <MyMediaList status={statusParam as TStatusParam} myMedias={myShows} mediaType='SHOWS' />
    </main>
  );
};

export default Status;
