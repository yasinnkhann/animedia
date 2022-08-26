import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { relayStylePagination } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors)
		graphQLErrors.forEach(err => {
			const { locations, message, path } = err;
			console.warn(
				`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
			);
		});
});

const link = from([
	errorLink,
	new HttpLink({
		uri:
			process.env.NODE_ENV === 'production'
				? 'https://animedia.vercel.app/api/graphql'
				: 'http://localhost:3000/api/graphql',
		credentials: 'include',
		headers: {
			Origin: 'https://animedia.vercel.app', // <- Added this and now builds are no longer 500 erroring on vercel
		},
	}),
]);

export const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: link,
});

// export const client = new ApolloClient({
// 	uri: 'http://localhost:3000/api/graphql',
// 	// uri: 'https://animedia.vercel.app/api/graphql',

// 	cache: new InMemoryCache({
// 		typePolicies: {
// 			Query: {
// 				fields: {
// 					links: relayStylePagination(),
// 				},
// 			},
// 		},
// 	}),
// });
