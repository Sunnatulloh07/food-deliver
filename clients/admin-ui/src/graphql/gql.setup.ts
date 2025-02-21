import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import Router from "next/router";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
});

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
    },
  }));

  return forward(operation);
});

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((err) => {
      const isAuthError =
        err?.message?.includes("Unauthorized") ||
        err?.message?.includes("Invalid access token") ||
        err?.extensions?.code === "UNAUTHENTICATED";

      if (isAuthError) {
        if (operation?.operationName === "ActivateRestaurant") {
          return;
        } else {
          Router.push("/sign-in");
        }
      }
    });
  }
  if (networkError) {
    console.error("[Network error]:", networkError);
  }
});




export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});
