'use client';

import { useMemo } from 'react';
import MyMediaList from '@components/MyMedia/MyMediaList';
import { CommonMethods } from '@utils/CommonMethods';
import LibraryNav from '@/components/MyMedia/LibraryNav';
import { useParams, redirect } from 'next/navigation';
import { TStatusParam } from '@ts/types';
import { useSession } from 'next-auth/react';
import { useUserMedia } from '@/components/UserMediaProvider';
import Loading from './loading';

const Status = () => {
  const { data: session, status: sessionStatus } = useSession();

  const params = useParams();
  const statusParam = params.status as string;

  const { userGames, isLoading } = useUserMedia();

  if (!statusParam || !CommonMethods.statusParams.has(statusParam)) {
    redirect('/');
  }

  const myGames = useMemo(() => {
    if (!userGames) return [];
    if (statusParam === 'wishlist') {
      return userGames.filter(game => game?.wishlist);
    }
    // If other statuses are requested for games, they return empty for now
    return [];
  }, [userGames, statusParam]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className='mt-[calc(var(--header-height-mobile)+1rem)]'>
      <LibraryNav currentTab='games' />
      <MyMediaList status={statusParam as TStatusParam} myMedias={myGames} mediaType='GAMES' />
    </main>
  );
};

export default Status;
