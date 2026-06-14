'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';
import Layout from '../components/Layout';
import { UserMediaProvider } from '../components/UserMediaProvider';
import type { Movie, Show, Game } from '@prisma/client';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import '../styles/globals.css';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface Props {
  children: ReactNode;
}

export default function Providers({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <UserMediaProvider>
          <Layout>
            {children}
            <Analytics />
          </Layout>
        </UserMediaProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
