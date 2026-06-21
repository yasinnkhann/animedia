'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Movie, Show, Game } from '@prisma/client';
import { fetchUserMedia } from '@/app/actions/userMediaActions';

interface UserMediaContextType {
  userMovies: Movie[];
  userShows: Show[];
  userGames: Game[];
  isLoading: boolean;
  refetchUserMedia: () => Promise<any>;
  mutateUserMediaCache: (updater: (oldData: any) => any) => void;
  getUserMediaCache: () => any;
}

const UserMediaContext = createContext<UserMediaContextType>({
  userMovies: [],
  userShows: [],
  userGames: [],
  isLoading: false,
  refetchUserMedia: async () => {},
  mutateUserMediaCache: () => {},
  getUserMediaCache: () => null,
});

export const useUserMedia = () => useContext(UserMediaContext);

interface Props {
  children: ReactNode;
}

export const UserMediaProvider = ({ children }: Props) => {
  const { status } = useSession();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading: queryLoading,
    refetch,
  } = useQuery({
    queryKey: ['userMedia'],
    queryFn: fetchUserMedia,
    enabled: status === 'authenticated',
    staleTime: Infinity,
  });

  const isLoading = status === 'loading' || queryLoading;

  const userMovies = data?.userMovies ?? [];
  const userShows = data?.userShows ?? [];
  const userGames = data?.userGames ?? [];

  const mutateUserMediaCache = (updater: (oldData: any) => any) => {
    queryClient.setQueryData(['userMedia'], updater);
  };

  const getUserMediaCache = () => {
    return queryClient.getQueryData(['userMedia']);
  };

  return (
    <UserMediaContext.Provider
      value={{
        userMovies,
        userShows,
        userGames,
        isLoading,
        refetchUserMedia: refetch,
        mutateUserMediaCache,
        getUserMediaCache,
      }}
    >
      {children}
    </UserMediaContext.Provider>
  );
};
