import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Providers from './Providers';

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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel='preconnect' href='https://image.tmdb.org' />
        <link rel='preconnect' href='https://images.igdb.com' />
      </head>
      <body suppressHydrationWarning>
        <NextTopLoader color='#00b3ff' showSpinner={false} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
