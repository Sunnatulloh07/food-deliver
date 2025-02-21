import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { client } from "@/graphql/gql.setup";
import { ApolloProvider } from "@apollo/client";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/shared/sidebar/AppSidebar";
import { SiteHeader } from "@/components/shared/header/siteHeader";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [isNotSideHeader, setIsNotSideHeader] = React.useState(true);
  const pathname = useRouter().asPath;

  React.useEffect(() => {
    if (
      pathname.includes("/sign-in") ||
      pathname.includes("/sign-up") ||
      pathname.includes("/activate-restaurant")
    ) {
      setIsNotSideHeader(false);
    } else {
      setIsNotSideHeader(true);
    }
  }, [pathname]);
  return (
    <ApolloProvider client={client}>
      <NextThemesProvider
        {...props}
        attribute="class"
        defaultTheme="light"
        disableTransitionOnChange
      >
        {/* <div className="[--header-height:calc(theme(spacing.14))]"> */}
        <SidebarProvider defaultOpen={true}>
          <div className="flex flex-1">
            {isNotSideHeader && <AppSidebar />}
            <SidebarInset>
              {isNotSideHeader && <SiteHeader />}
              <div className="p-4">
              {children}
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
        {/* </div> */}
        <Toaster position="top-right" reverseOrder={false} />
      </NextThemesProvider>
    </ApolloProvider>
  );
}
