// hooks/useEvents.ts
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IEventData, IEventResponse } from "@/lib/types/Event";

interface UseEventsResult {
  events: IEventData[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  refresh: () => void;
  refetch: () => void;
}

/**
 * Custom hook untuk fetch events menggunakan TanStack Query
 * 
 * @param token - Authentication token (optional, handled by API client if not provided)
 * @returns Events data, loading state, error state, dan refresh function
 * 
 * Features:
 * - Automatic caching (60 seconds stale time)
 * - Auto refetch on window focus
 * - Retry on failure (3 attempts)
 * - Error handling dengan custom error messages
 * - Manual refresh functionality
 */
export const useEvents = (token?: string): UseEventsResult => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<IEventData[], Error>({
    queryKey: ["events", token], // Include token in query key untuk cache separation
    queryFn: async () => {
      // Validasi token jika diperlukan
      if (!token) {
        throw new Error("Token is missing");
      }

      const res = await fetch(`http://localhost:3000/api/events`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Token bisa ditambahkan di header jika diperlukan
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        cache: "no-store", // Disable browser cache, rely on React Query cache
      });

      const eventData: IEventResponse<IEventData[]> = await res.json();

      // Error handling yang sama seperti sebelumnya
      if (!res.ok || !eventData.success) {
        throw new Error(
          (eventData.message as string) || "Failed to fetch events",
        );
      }

      return eventData.data || [];
    },
    staleTime: 60 * 1000, // Data dianggap fresh selama 60 detik (sama seperti revalidate sebelumnya)
    gcTime: 5 * 60 * 1000, // Cache disimpan selama 5 menit (previously cacheTime)
    refetchOnWindowFocus: true, // Auto refetch saat user kembali ke tab
    refetchOnMount: true, // Refetch saat component mount
    retry: 3, // Retry 3x jika gagal
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    enabled: !!token, // Only fetch jika token ada
  });

  // Manual refresh function - invalidate cache dan refetch
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["events", token] });
  };

  return {
    events: data || [],
    isLoading,
    isError,
    errorMessage: error?.message || null,
    refresh, // Untuk compatibility dengan code lama
    refetch, // TanStack Query native refetch
  };
};
