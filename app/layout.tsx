import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from './Providers';

import NextTopLoader from 'nextjs-toploader';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || ''),
  title: {
    default: 'AniMedia - Track Movies, Shows & Games',
    template: '%s | AniMedia',
  },
  description:
    'Track your movies, TV shows, and games. Discover trending content, see what your friends are watching, and manage your watchlist with AniMedia.',
  keywords: [
    'animedia',
    'anime',
    'movies tracker',
    'tv shows tracker',
    'video games tracker',
    'watchlist',
    'discover',
  ],
  authors: [{ name: 'Yasin Khan' }],
  creator: 'Yasin Khan',
  openGraph: {
    title: 'AniMedia - Track Movies, Shows & Games',
    description:
      'Track your movies, TV shows, and games. Discover trending content, see what your friends are watching, and manage your watchlist with AniMedia.',
    type: 'website',
    siteName: 'AniMedia',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AniMedia - Track Movies, Shows & Games',
    description:
      'Track your movies, TV shows, and games. Discover trending content, see what your friends are watching, and manage your watchlist with AniMedia.',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' className={inter.className} suppressHydrationWarning>
      <link rel='preconnect' href='https://image.tmdb.org' />
      <link rel='preconnect' href='https://images.igdb.com' />
      <body suppressHydrationWarning>
        <NextTopLoader key='next-top-loader' color='#00b3ff' showSpinner={false} />
        <Providers key='app-providers'>{children}</Providers>
        <SpeedInsights key='speed-insights' />
        <Analytics key='analytics' />
      </body>
    </html>
  );
}
