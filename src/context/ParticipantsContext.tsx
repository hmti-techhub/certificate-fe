"use client";

import { createContext, useContext, useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface ParticipantsContextType {
  refreshParticipants: () => Promise<void>;
  isRefreshing: boolean;
}

const ParticipantsContext = createContext<ParticipantsContextType | undefined>(
  undefined,
);

export function ParticipantsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshParticipants = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Step 1: Invalidate all participants queries - marks them as stale
      await queryClient.invalidateQueries({
        queryKey: ["participants"],
      });
      // Step 2: Force refetch all participants queries - ensures immediate update
      await queryClient.refetchQueries({
        queryKey: ["participants"],
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient]);

  return (
    <ParticipantsContext.Provider value={{ refreshParticipants, isRefreshing }}>
      {children}
    </ParticipantsContext.Provider>
  );
}

export function useParticipantsContext() {
  const context = useContext(ParticipantsContext);
  if (context === undefined) {
    throw new Error(
      "useParticipantsContext must be used within a ParticipantsProvider",
    );
  }
  return context;
}
