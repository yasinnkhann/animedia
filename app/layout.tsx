import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Providers from './Providers';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { getUserMovies, getUserShows, getUserGames } from '@/lib/services/userMedia';
import NextTopLoader from 'nextjs-toploader';

export const metadata: Metadata = {
  title: {
    default: 'AniMedia',
    template: '%s | AniMedia',
  },
  description:
    'Track your movies, TV shows, and games. Discover trending content and manage your watchlist with AniMedia.',
  openGraph: {
    title: 'AniMedia',
    description: 'Track your movies, TV shows, and games.',
    type: 'website',
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const [userMovies, userShows, userGames] = await Promise.all([
    getUserMovies(userId),
    getUserShows(userId),
    getUserGames(userId),
  ]);

  return (
    <html lang='en' suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextTopLoader color='#00b3ff' showSpinner={false} />
        <Providers userMovies={userMovies} userShows={userShows} userGames={userGames}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
