'use client';

import { useMemo } from 'react';
import MotionItem from '../MotionItem';
import HomeCard from './HomeCard';
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import { LeftArrow, RightArrow } from '../Arrows';
import { useQuery } from '@apollo/client/react';
import * as Queries from '../../../graphql/queries';
import { useSession } from 'next-auth/react';
import { useHorizontalScroller } from '@hooks/useHorizontalScroller';
import type {
  PopularMoviesQuery,
  PopularShowsQuery,
  UsersMoviesQuery,
  UsersShowsQuery,
} from '@/graphql/generated/code-gen/graphql';

type MovieResult = PopularMoviesQuery['popularMovies']['results'][number];
type ShowResult = PopularShowsQuery['popularShows']['results'][number];
type UserMovie = NonNullable<NonNullable<UsersMoviesQuery['usersMovies']>[number]>;
type UserShow = NonNullable<NonNullable<UsersShowsQuery['usersShows']>[number]>;

interface Props {
  items: MovieResult[] | ShowResult[];
}

const HomeHorizontalScroller = ({ items }: Props) => {
  const { status } = useSession();
  const shouldFetchUserMedia = status === 'authenticated';

  const { data: usersShowsData } = useQuery(Queries.USERS_SHOWS, {
    skip: !shouldFetchUserMedia || items.length === 0 || 'title' in items[0],
    fetchPolicy: 'network-only',
  });

  const { data: usersMoviesData } = useQuery(Queries.USERS_MOVIES, {
    skip: !shouldFetchUserMedia || items.length === 0 || 'name' in items[0],
    fetchPolicy: 'network-only',
  });

  const { dragging, handleDrag, handleMouseDown, handleMouseUp, handleWheel } =
    useHorizontalScroller();

  const userMatchedMedias = useMemo(() => {
    if (!shouldFetchUserMedia || items.length === 0) {
      return [];
    }

    const matchedMedias: Array<UserShow | UserMovie> = [];
    const usersMediaDict = new Map<string, UserShow | UserMovie>();

    const isMovie = 'title' in items[0];
    const userDataArr = isMovie ? usersMoviesData?.usersMovies : usersShowsData?.usersShows;

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
  }, [usersShowsData?.usersShows, usersMoviesData?.usersMovies, items, shouldFetchUserMedia]);

  return (
    <ScrollMenu
      LeftArrow={LeftArrow}
      RightArrow={RightArrow}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleDrag}
      scrollContainerClassName='!h-[26rem] !overflow-y-hidden !scrollbar-thin !scrollbar-thumb-gray-900 !scrollbar-track-gray-400 !scrollbar-thumb-rounded-2xl !scrollbar-track-rounded-2xl'
    >
      {items.map((item, idx) => (
        <MotionItem
          key={item.id}
          itemId={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.05 }}
        >
          <HomeCard
            itemId={item.id}
            item={item}
            dragging={dragging}
            userMatchedMedias={userMatchedMedias}
          />
        </MotionItem>
      ))}
    </ScrollMenu>
  );
};

export default HomeHorizontalScroller;
