"use server";
import { getSession } from "@/lib/get-session";
import { IParticipantResponse } from "@/lib/types/Participants";
import { revalidateTag } from "next/cache";

export const deleteAllParticipants = async (eventUid: string) => {
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
    if (!eventUid) {
      return {
        success: false,
        message: "Invalid event uid / user token.",
      };
    }
    const res = await fetch(
      `${process.env.FRONTEND_URL}/api/events/${eventUid}/participants/delete`,
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
    console.error("ERROR IN DELETE ALL PARTICIPANTS (SERVER ACTION) : ", error);
    return {
      success: false,
      message: "An unknown error occurred",
    };
  }
};
