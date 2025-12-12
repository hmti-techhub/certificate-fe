// hooks/useParticipants.ts
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  IParticipantData,
  IParticipantResponse,
} from "@/lib/types/Participants";
import { useParticipantsContext } from "@/context/ParticipantsContext";

interface UseParticipantsResult {
  participants: IParticipantData[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetch: () => void;
  refresh: () => void;
}

/**
 * Custom hook untuk fetch participants menggunakan TanStack Query
 *
 * @param token - Authentication token
 * @param eventUid - Event unique identifier
 * @param options - Configuration options
 * @param options.autoFetch - Enable/disable automatic fetching (default: true)
 * @returns Participants data, loading state, error state, dan refetch functions
 */
export const useParticipants = (
  token?: string,
  eventUid?: string,
  options?: { autoFetch?: boolean },
): UseParticipantsResult => {
  const { autoFetch = true } = options || {};
  const queryClient = useQueryClient();
  const { isRefreshing } = useParticipantsContext();

  const { data, isLoading, isError, error, refetch } = useQuery<
    IParticipantData[],
    Error
  >({
    queryKey: ["participants", eventUid, token], // Query key includes eventUid untuk cache per event
    queryFn: async () => {
      // Validasi token dan eventUid - sama seperti logic sebelumnya
      if (!token) {
        throw new Error("Token is missing");
      }
      if (!eventUid) {
        throw new Error("Event UID is missing");
      }

      const res = await fetch(`/api/events/${eventUid}/participants`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // No cache: "no-store" - allow route handler's next.revalidate to work
      });

      const participantsData: IParticipantResponse<IParticipantData[]> =
        await res.json();

      // Handle 404 or empty data as empty array - not an error
      if (res.status === 404 || participantsData.data === null) {
        return [];
      }

      // Other errors (401, 500, etc.) still throw
      if (!res.ok || !participantsData.success) {
        throw new Error(
          (participantsData.message as string) ||
            "Failed to fetch participants",
        );
      }

      return participantsData.data || [];
    },
    staleTime: 30 * 1000, // Data considered fresh for 30 seconds only
    gcTime: 10 * 60 * 1000, // Cache kept for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch when user focuses window
    refetchOnMount: "always", // Always refetch on browser refresh/mount
    refetchOnReconnect: false, // Don't refetch when reconnecting
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: autoFetch && !!token && !!eventUid, // Respect autoFetch option & validate token/eventUid
  });

  // Manual refresh function - delegates to context's refetchQueries
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["participants", eventUid] });
    refetch();
  };

  return {
    participants: data || [],
    isLoading: isLoading || isRefreshing, // Combine loading states
    isError,
    errorMessage: error?.message || null,
    refetch, // TanStack Query native refetch
    refresh, // Manual refresh for compatibility
  };
};

//          _____                    _____                _____                    _____
//         /\    \                  /\    \              /\    \                  /\    \
//        /::\____\                /::\____\            /::\    \                /::\    \
//       /:::/    /               /::::|   |            \:::\    \               \:::\    \
//      /:::/    /               /:::::|   |             \:::\    \               \:::\    \
//     /:::/    /               /::::::|   |              \:::\    \               \:::\    \
//    /:::/____/               /:::/|::|   |               \:::\    \               \:::\    \
//   /::::\    \              /:::/ |::|   |               /::::\    \              /::::\    \
//  /::::::\    \   _____    /:::/  |::|___|______        /::::::\    \    ____    /::::::\    \
// /:::/\:::\    \ /\    \  /:::/   |::::::::\    \      /:::/\:::\    \  /\   \  /:::/\:::\    \
///:::/  \:::\    /::\____\/:::/    |:::::::::\____\    /:::/  \:::\____\/::\   \/:::/  \:::\____\
//\::/    \:::\  /:::/    /\::/    / ~~~~~/:::/    /   /:::/    \::/    /\:::\  /:::/    \::/    /
// \/____/ \:::\/:::/    /  \/____/      /:::/    /   /:::/    / \/____/  \:::\/:::/    / \/____/
//          \::::::/    /               /:::/    /   /:::/    /            \::::::/    /
//           \::::/    /               /:::/    /   /:::/    /              \::::/____/
//           /:::/    /               /:::/    /    \::/    /                \:::\    \
//          /:::/    /               /:::/    /      \/____/                  \:::\    \
//         /:::/    /               /:::/    /                                 \:::\    \
//        /:::/    /               /:::/    /                                   \:::\____\
//        \::/    /                \::/    /                                     \::/    /
//         \/____/                  \/____/                                       \/____/
//
// Copyright (c) 2025, HMTI Software Team. All rights reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.
