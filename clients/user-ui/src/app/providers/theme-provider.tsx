"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { GQLClient } from "@/graphql/gql.setup";
import { ApolloProvider } from "@apollo/client";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <ApolloProvider client={GQLClient}>
      <NextThemesProvider
        {...props}
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    </ApolloProvider>
  );
}
