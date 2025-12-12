"use server";

import { multipleParticipantSchema } from "@/lib/types/General";
import { z } from "zod";
import {
  IParticipantResponse,
  IParticipantAdd,
} from "@/lib/types/Participants";
import { revalidateTag } from "next/cache";
import { getSession } from "@/lib/get-session";

export const addParticipants = async (
  values: z.infer<typeof multipleParticipantSchema>,
  eventUid: string,
) => {
  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: "Unauthorized access",
      };
    }
    const token = session.token;
    if (!token) {
      return {
        success: false,
        message: "Token is required",
      };
    }
    const validatedFields = multipleParticipantSchema.safeParse(values);
    if (!eventUid) {
      return {
        success: false,
        message: "Event UID is required",
      };
    }
    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid event data.",
      };
    }
    const res = await fetch(
      `${process.env.FRONTEND_URL}/api/events/${eventUid}/participants/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(validatedFields.data),
      },
    );
    if (!res.ok) {
      const errorData: IParticipantResponse<IParticipantAdd> = await res.json();
      console.log("errorData", errorData);
      return {
        success: false,
        message: errorData.message,
      };
    }
    const data: IParticipantResponse<IParticipantAdd> = await res.json();
    if (!data.success) {
      return {
        success: false,
        message: data.message,
      };
    } else {
      revalidateTag("participants", "max");
      return {
        success: true,
        message: "Participants added successfully",
      };
    }
  } catch (error) {
    console.error("ERROR IN PARTICIPANTS ADD (SERVER ACTION) : ", error);
    return {
      success: false,
      message: "An unknown error occurred",
    };
  }
};
