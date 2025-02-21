import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

const authmiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
    },
  }));
  return forward(operation);
});

export const GQLClient = new ApolloClient({
  link: authmiddleware.concat(
    new HttpLink({
      uri: process.env.NEXT_PUBLIC_SERVER_URL,
      credentials: "include",
    })
  ),
  cache: new InMemoryCache(),
});
