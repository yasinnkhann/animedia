import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { client } from '../lib/apollo';
import { SessionProvider } from 'next-auth/react';
import Layout from '../components/Layout';
import { Session } from 'next-auth';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
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
