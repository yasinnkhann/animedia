'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import Layout from '../components/Layout';
import { UserMediaProvider } from '../components/UserMediaProvider';
import type { Movie, Show, Game } from '@prisma/client';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import '../styles/globals.css';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

interface Props {
  children: ReactNode;
}

export default function Providers({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        <SessionProvider>
          <UserMediaProvider>
            <Layout>{children}</Layout>
          </UserMediaProvider>
        </SessionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
