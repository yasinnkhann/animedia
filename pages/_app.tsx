import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { ApolloProvider } from '@apollo/client';
import { client } from '../lib/apollo';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { Analytics } from '@vercel/analytics/react';
import '../styles/globals.css';

function MyApp({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps<{ session: Session; hideScrollBar: string }>) {
	useEffect(() => {
		document.body.className = pageProps.hideScrollBar ? 'scrollbar-hide' : '';
	});

	return (
		<SessionProvider session={session}>
			<ApolloProvider client={client}>
				<Layout>
					<Component {...pageProps} />
					<Analytics />
				</Layout>
			</ApolloProvider>
		</SessionProvider>
	);
}

export default MyApp;
