"use server";

import { getSession } from "@/lib/get-session";
import { IParticipantResponse } from "@/lib/types/Participants";
import { revalidateTag } from "next/cache";

export const deleteParticipant = async (
  eventUid: string,
  participantUid: string,
) => {
  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: "Session not found.",
      };
    }
    const token = session.token;
    if (!token) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }
    if (!eventUid || !participantUid) {
      return {
        success: false,
        message: "Invalid event uid / participant uid.",
      };
    }
    const res = await fetch(
      `${process.env.FRONTEND_URL}/api/events/${eventUid}/participants/${participantUid}/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      const errorData: IParticipantResponse = await res.json();
      return {
        success: false,
        message: errorData.message as string,
      };
    }

    const participantData: IParticipantResponse = await res.json();

    if (!participantData.success) {
      return {
        success: false,
        message: participantData.message,
      };
    } else {
      revalidateTag("participants", "max");
      return {
        success: true,
        message: participantData.message,
      };
    }
  } catch (error) {
    console.error("ERROR IN PARTICIPANT DELETE (SERVER ACTION) : ", error);
    return {
      success: false,
      message: "An unknown error occurred",
    };
  }
};
