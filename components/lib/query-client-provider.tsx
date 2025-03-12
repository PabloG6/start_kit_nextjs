"use client";
import { env } from "@/env";
import { TRPCProvider } from "@/lib/trpc";
import { AppRouter } from "@/server/router";
import {
  defaultShouldDehydrateQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  createTRPCClient,
  loggerLink,
  unstable_httpBatchStreamLink,
} from "@trpc/client";
import { useState } from "react";
import SuperJSON from "superjson";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  if (env.NEXT_PUBLIC_BASE_URL) return `https://${env.NEXT_PUBLIC_BASE_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });
}
let browserQueryClient: QueryClient | undefined = undefined;
function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function TRPCClientProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() => {
    return createTRPCClient<AppRouter>({
      links: [
        loggerLink({
          enabled(op) {
            return (
              env.NODE_ENV === "development" ||
              (op.direction === "down" && op.result instanceof Error)
            );
          },
        }),
        unstable_httpBatchStreamLink({
          url: getBaseUrl() + "/api/trpc",
          transformer: SuperJSON,
        }),
      ],
    });
  });
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
