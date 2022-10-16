import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { ApolloProvider } from '@apollo/client';
import { client } from '../lib/apollo';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import '../styles/globals.css';

function MyApp({
	Component,
	pageProps,
}: AppProps<{ session: Session; hideScrollBar: string }>) {
	useEffect(() => {
		document.body.className = pageProps.hideScrollBar ? 'scrollbar-hide' : '';
	});

	return (
		<SessionProvider session={pageProps.session}>
			<ApolloProvider client={client}>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</ApolloProvider>
		</SessionProvider>
	);
}

export default MyApp;
