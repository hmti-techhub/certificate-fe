"use server";

import { updateParticipantSchema } from "@/lib/types/General";
import { z } from "zod";
import { IParticipantResponse } from "@/lib/types/Participants";
import { revalidateTag } from "next/cache";
import { getSession } from "@/lib/get-session";

export const updateParticipant = async (
  values: z.infer<typeof updateParticipantSchema>,
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
    const validatedFields = updateParticipantSchema.safeParse(values);
    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid event data.",
      };
    }
    const { name, email, position } = validatedFields.data;
    const res = await fetch(
      `${process.env.FRONTEND_URL}/api/events/${eventUid}/participants/${participantUid}/update`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          participantName: name,
          participantEmail: email,
          participantPosition: position,
        }),
      },
    );
    if (!res.ok) {
      const errorData: IParticipantResponse = await res.json();
      return {
        success: false,
        message: errorData.message,
      };
    }
    const data: IParticipantResponse = await res.json();
    if (!data.success) {
      return {
        success: false,
        message: data.message,
      };
    } else {
      revalidateTag("participants", "max");
      return {
        success: true,
        message: data.message,
      };
    }
  } catch (error) {
    console.error("ERROR IN PARTICIPANT UPDATE (SERVER ACTION) : ", error);
    return {
      success: false,
      message: "An unknown error occurred",
    };
  }
};
