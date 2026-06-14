'use client';

import { useMemo } from 'react';
import HomeCard from './HomeCard';
import { useSession } from 'next-auth/react';
import { BaseHorizontalScroller } from '../BaseHorizontalScroller';
import { useUserMedia } from '../../UserMediaProvider';
import type { Movie, Show } from '@prisma/client';

interface Props {
  items: any[];
}

const HomeHorizontalScroller = ({ items }: Props) => {
  const { status } = useSession();
  const shouldFetchUserMedia = status === 'authenticated';
  const { userMovies, userShows } = useUserMedia();

  const userMatchedMedias = useMemo(() => {
    if (!shouldFetchUserMedia || items.length === 0) {
      return [];
    }

    const matchedMedias: Array<Show | Movie> = [];
    const usersMediaDict = new Map<string, Show | Movie>();

    const isMovie = 'title' in items[0];
    const userDataArr = isMovie ? userMovies : userShows;

    if (!userDataArr) return [];

    for (const userDataObj of userDataArr) {
      if (userDataObj?.id) {
        usersMediaDict.set(userDataObj.id, userDataObj);
      }
    }
    for (const item of items) {
      const matched = usersMediaDict.get(item.id);
      if (matched) {
        matchedMedias.push(matched);
      }
    }

    return matchedMedias;
  }, [userShows, userMovies, items, shouldFetchUserMedia]);

  return (
    <BaseHorizontalScroller<any>
      items={items}
      keyExtractor={item => item.id}
      renderItem={(item, _idx, dragging) => (
        <HomeCard
          itemId={item.id}
          item={item}
          dragging={dragging}
          userMatchedMedias={userMatchedMedias}
        />
      )}
    />
  );
};

export default HomeHorizontalScroller;
