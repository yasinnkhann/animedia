'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import type { Movie, Show, Game } from '@prisma/client';

interface UserMediaContextType {
  userMovies: Movie[];
  userShows: Show[];
  userGames: Game[];
}

const UserMediaContext = createContext<UserMediaContextType>({
  userMovies: [],
  userShows: [],
  userGames: [],
});

export const useUserMedia = () => useContext(UserMediaContext);

interface Props {
  children: ReactNode;
  userMovies: Movie[];
  userShows: Show[];
  userGames: Game[];
}

export const UserMediaProvider = ({ children, userMovies, userShows, userGames }: Props) => {
  return (
    <UserMediaContext.Provider value={{ userMovies, userShows, userGames }}>
      {children}
    </UserMediaContext.Provider>
  );
};
