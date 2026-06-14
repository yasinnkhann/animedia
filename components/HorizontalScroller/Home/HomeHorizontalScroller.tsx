'use client';

import { useMemo } from 'react';
import HomeCard from './HomeCard';
import { useQuery } from '@apollo/client/react';
import * as Queries from '../../../graphql/queries';
import { useSession } from 'next-auth/react';
import { BaseHorizontalScroller } from '../BaseHorizontalScroller';
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
    <BaseHorizontalScroller<MovieResult | ShowResult>
      items={items as (MovieResult | ShowResult)[]}
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
