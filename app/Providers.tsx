'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';
import Layout from '../components/Layout';
import { UserMediaProvider } from '../components/UserMediaProvider';
import type { Movie, Show, Game } from '@prisma/client';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import '../styles/globals.css';

interface Props {
  children: ReactNode;
  userMovies: Movie[];
  userShows: Show[];
  userGames: Game[];
}

export default function Providers({ children, userMovies, userShows, userGames }: Props) {
  return (
    <SessionProvider>
      <UserMediaProvider userMovies={userMovies} userShows={userShows} userGames={userGames}>
        <Layout>
          {children}
          <Analytics />
        </Layout>
      </UserMediaProvider>
    </SessionProvider>
  );
}
