
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'http://compdash.homelinux.com:8000/',
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
