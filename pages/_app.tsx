import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { client } from '../lib/apollo';
import { UserProvider } from '@auth0/nextjs-auth0';
import Layout from '../components/Layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<UserProvider>
			<ApolloProvider client={client}>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</ApolloProvider>
		</UserProvider>
	);
}

export default MyApp;
