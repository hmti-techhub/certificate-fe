// hooks/useParticipants.ts
"use client";

import { useEffect } from "react";
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
        cache: "no-store", // Disable browser cache
      });

      const participantsData: IParticipantResponse<IParticipantData[]> =
        await res.json();

      // Error handling yang sama seperti sebelumnya
      if (!res.ok || !participantsData.success) {
        throw new Error(
          (participantsData.message as string) ||
            "Failed to fetch participants",
        );
      }

      return participantsData.data || [];
    },
    staleTime: 3 * 60 * 1000, // Data fresh selama 3 menit (lebih pendek karena data participants sering berubah)
    gcTime: 10 * 60 * 1000, // Cache disimpan 10 menit
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: autoFetch && !!token && !!eventUid, // Respect autoFetch option & validate token/eventUid
  });

  // Auto refetch when context triggers refresh (integration dengan ParticipantsContext)
  // Note: useEffect tidak perlu karena TanStack Query sudah handle refetch
  // Tapi kita perlu trigger refetch saat isRefreshing berubah
  useEffect(() => {
    if (isRefreshing) {
      refetch();
    }
  }, [isRefreshing, refetch]);

  // Manual refresh function - invalidate cache
  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: ["participants", eventUid, token],
    });
  };

  return {
    participants: data || [],
    isLoading: isLoading || isRefreshing, // Combine loading states seperti sebelumnya
    isError,
    errorMessage: error?.message || null,
    refetch, // TanStack Query native refetch
    refresh, // Manual refresh untuk compatibility
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
