"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data dianggap fresh selama 1 menit
            staleTime: 60 * 1000,
            // Data di-cache selama 5 menit
            gcTime: 5 * 60 * 1000,
            // Refetch saat window focus
            refetchOnWindowFocus: true,
            // Refetch saat mount component
            refetchOnMount: true,
            // Retry 3 kali jika gagal
            retry: 3,
            // Jangan refetch on reconnect untuk save bandwidth
            refetchOnReconnect: false,
          },
          mutations: {
            // Retry 1 kali untuk mutation
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools hanya muncul di development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </QueryClientProvider>
  );
}
