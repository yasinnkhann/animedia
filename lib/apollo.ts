import { ApolloClient, ApolloLink, InMemoryCache, HttpLink } from '@apollo/client';
import { relayStylePagination } from '@apollo/client/utilities';
import { ErrorLink } from '@apollo/client/link/error';
import { SERVER_BASE_URL } from '@utils/constants';

const errorLink = new ErrorLink(({ graphQLErrors, networkError }: any) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((err: any) => {
      const { locations, message, path } = err;
      console.warn(`[GraphQL Error]:\nMessage: ${message}, Locations: ${locations}, Path: ${path}`);
    });
  }

  if (networkError) {
    console.warn(`[Network Error]:\n${networkError}`);
  }
});

const link = ApolloLink.from([
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
