import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Providers from './Providers';

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
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
