'use client';

import { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';
import { client } from '../lib/apollo';
import Layout from '../components/Layout';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import '../styles/globals.css';

interface Props {
  children: ReactNode;
}

export default function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <ApolloProvider client={client}>
        <Layout>
          {children}
          <Analytics />
        </Layout>
      </ApolloProvider>
    </SessionProvider>
  );
}
