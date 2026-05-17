'use client';

import { ReactNode } from 'react';
import Layout from '../components/Layout';
import { ApolloProvider } from '@apollo/client/react';
import { client } from '../lib/apollo';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import '../styles/globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body suppressHydrationWarning>
				<SessionProvider>
					<ApolloProvider client={client}>
						<Layout>
							{children}
							<Analytics />
						</Layout>
					</ApolloProvider>
				</SessionProvider>
			</body>
		</html>
	);
}
