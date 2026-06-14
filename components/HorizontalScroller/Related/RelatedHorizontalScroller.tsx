'use client';

import { useMemo } from 'react';
import RelatedCard from './RelatedCard';
import { IRelatedMedia } from '@ts/interfaces';
import { TContent } from '@ts/types';
import { ExtractStrict } from '@ts/types';
import { useSession } from 'next-auth/react';
import { BaseHorizontalScroller } from '../BaseHorizontalScroller';
import { useUserMedia } from '../../UserMediaProvider';
import type { Movie, Show, Game } from '@prisma/client';

interface Props {
  items: IRelatedMedia[];
  mediaType?: ExtractStrict<TContent, 'movies' | 'shows'>;
}

const RelatedHorizontalScroller = ({ items, mediaType }: Props) => {
  const { status } = useSession();
  const shouldFetchUserMedia = status === 'authenticated';
  const { userMovies, userShows, userGames } = useUserMedia();

  const userMatchedMedias = useMemo(() => {
    if (!shouldFetchUserMedia) {
      return [];
    }

    const matchedMedias: Array<Show | Movie | Game> = [];

    if (mediaType) {
      const usersMediaMap = new Map<string, Show | Movie | Game>();
      const userDataArr = mediaType === 'movies' ? userMovies : userShows;

      if (userDataArr) {
        for (const userDataObj of userDataArr) {
          if (userDataObj?.id) {
            usersMediaMap.set(userDataObj.id, userDataObj);
          }
        }
        for (const item of items) {
          const matched = usersMediaMap.get(item.id);
          if (matched) {
            matchedMedias.push(matched);
          }
        }
      }
    } else {
      const usersMoviesList = userMovies ?? [];
      const usersShowsList = userShows ?? [];
      const usersGamesList = userGames ?? [];

      const usersMoviesMap = new Map(usersMoviesList.map(u => [u.id, u]));
      const usersShowsMap = new Map(usersShowsList.map(u => [u.id, u]));
      const usersGamesMap = new Map(usersGamesList.map(u => [u.id, u]));

      for (const item of items) {
        const map =
          item.type === 'movie'
            ? usersMoviesMap
            : item.type === 'show'
              ? usersShowsMap
              : usersGamesMap;
        const matched = map.get(item.id);
        if (matched) {
          matchedMedias.push(matched);
        }
      }
    }

    return matchedMedias;
  }, [userShows, userMovies, userGames, items, mediaType, shouldFetchUserMedia]);

  return (
    <BaseHorizontalScroller
      items={items}
      keyExtractor={item => item.id}
      scrollContainerClassName='!h-[22rem] !overflow-y-hidden !scrollbar-thin !scrollbar-thumb-gray-900 !scrollbar-track-gray-400 !scrollbar-thumb-rounded-2xl !scrollbar-track-rounded-2xl'
      renderItem={(item, _idx, dragging) => (
        <RelatedCard
          itemId={item.id}
          item={item}
          dragging={dragging}
          userMatchedMedias={userMatchedMedias}
        />
      )}
    />
  );
};

export default RelatedHorizontalScroller;
