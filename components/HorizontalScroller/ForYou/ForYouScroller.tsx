'use client';

import { useMemo } from 'react';
import MediaCard from '../../MediaCard/MediaCard';
import { CommonMethods } from '../../../utils/CommonMethods';
import { useSession } from 'next-auth/react';
import { BaseHorizontalScroller } from '../BaseHorizontalScroller';
import { useUserMedia } from '../../UserMediaProvider';
import type { Movie, Show, Game } from '@prisma/client';

interface Props {
  items: any[];
}

const ForYouScroller = ({ items }: Props) => {
  const { status } = useSession();
  const shouldFetchUserMedia = status === 'authenticated';
  const { userMovies, userShows, userGames } = useUserMedia();

  const userMatchedMedias = useMemo(() => {
    if (!shouldFetchUserMedia || items.length === 0) {
      return [];
    }

    const matchedMedias: Array<Show | Movie | Game> = [];
    const usersMediaDict = new Map<string, Show | Movie | Game>();

    if (userMovies) {
      for (const userDataObj of userMovies) {
        if (userDataObj?.id) {
          usersMediaDict.set(String(userDataObj.id), userDataObj);
        }
      }
    }

    if (userShows) {
      for (const userDataObj of userShows) {
        if (userDataObj?.id) {
          usersMediaDict.set(String(userDataObj.id), userDataObj);
        }
      }
    }

    if (userGames) {
      for (const userDataObj of userGames) {
        if (userDataObj?.id) {
          usersMediaDict.set(String(userDataObj.id), userDataObj);
        }
      }
    }

    for (const item of items) {
      const matched = usersMediaDict.get(String(item.id));
      if (matched) {
        matchedMedias.push(matched);
      }
    }

    return matchedMedias;
  }, [userShows, userMovies, userGames, items, shouldFetchUserMedia]);

  return (
    <BaseHorizontalScroller<any>
      items={items}
      keyExtractor={item => `${item.mediaType}-${item.id}`}
      renderItem={(item, _idx, dragging) => {
        const userStatus = CommonMethods.getUserStatusFromMedia(userMatchedMedias, item);
        return (
          <MediaCard
            item={item}
            dragging={dragging}
            variant='fixed'
            priority={_idx < 5}
            userStatus={userStatus}
          />
        );
      }}
    />
  );
};

export default ForYouScroller;
