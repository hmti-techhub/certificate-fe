"use server";

import { unstable_update } from "@/auth";
import { Session } from "next-auth";
export const updateSession = async (user: Session | null): Promise<void> => {
  try {
    if (!user) {
      console.error("No user session found");
      return;
    }
    await unstable_update(user);
  } catch (error) {
    console.error("Error updating session: ", error);
  }
};
