'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import type { Movie, Show, Game } from '@prisma/client';
import { fetchUserMedia } from '@/app/actions/userMediaActions';

interface UserMediaContextType {
  userMovies: Movie[];
  userShows: Show[];
  userGames: Game[];
  isLoading: boolean;
  refetchUserMedia: () => Promise<any>;
}

const UserMediaContext = createContext<UserMediaContextType>({
  userMovies: [],
  userShows: [],
  userGames: [],
  isLoading: false,
  refetchUserMedia: async () => {},
});

export const useUserMedia = () => useContext(UserMediaContext);

interface Props {
  children: ReactNode;
}

export const UserMediaProvider = ({ children }: Props) => {
  const { status } = useSession();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['userMedia'],
    queryFn: fetchUserMedia,
    enabled: status === 'authenticated',
  });

  const userMovies = data?.userMovies ?? [];
  const userShows = data?.userShows ?? [];
  const userGames = data?.userGames ?? [];

  return (
    <UserMediaContext.Provider
      value={{ userMovies, userShows, userGames, isLoading, refetchUserMedia: refetch }}
    >
      {children}
    </UserMediaContext.Provider>
  );
};
