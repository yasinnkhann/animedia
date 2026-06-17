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
