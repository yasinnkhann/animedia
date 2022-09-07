import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { relayStylePagination } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { SERVER_BASE_URL } from 'utils/URLs';

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		graphQLErrors.forEach(err => {
			const { locations, message, path } = err;
			console.warn(
				`[GraphQL Error]:\nMessage: ${message}, Locations: ${locations}, Path: ${path}`
			);
		});
	}

	if (networkError) {
		console.warn(`[Network Error]:\n${networkError}`);
	}
});

const link = from([
	errorLink,
	new HttpLink({
		uri: SERVER_BASE_URL,
	}),
]);

export const client = new ApolloClient({
	cache: new InMemoryCache({
		typePolicies: {
			Query: {
				fields: {
					links: relayStylePagination(),
				},
			},
		},
	}),
	link,
});
