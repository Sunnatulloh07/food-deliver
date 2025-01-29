import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import Cookies from "js-cookie";

const authmiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      accesstoken: Cookies.get("access_token"),
      refreshtoken: Cookies.get("refresh_token"),
    },
  });
  return forward(operation);
});

export const GQLClient = new ApolloClient({
  link: authmiddleware.concat(
    new HttpLink({ uri: process.env.NEXT_PUBLIC_SERVER_URL })
  ),
  cache: new InMemoryCache(),
});
