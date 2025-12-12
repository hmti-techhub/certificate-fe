"use server";

import { updateStakeholderSchema } from "@/lib/types/General";
import { z } from "zod";
import { IEventResponse } from "@/lib/types/Event";
import { revalidateTag } from "next/cache";
import { getSession } from "@/lib/get-session";

export const updateStakeholderData = async (
  values: z.infer<typeof updateStakeholderSchema>,
  eventUid: string,
  stakeholderUid: string,
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
    const validatedFields = updateStakeholderSchema.safeParse(values);
    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid event stakeholder data.",
      };
    }
    const { eventStakeholderName, eventStakeholderPosition } =
      validatedFields.data;
    const res = await fetch(
      `${process.env.FRONTEND_URL}/api/events/${eventUid}/stakeholder/${stakeholderUid}/update`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventStakeholderName: eventStakeholderName,
          eventStakeholderPosition: eventStakeholderPosition,
        }),
      },
    );
    if (!res.ok) {
      const errorData: IEventResponse = await res.json();
      return {
        success: false,
        message: errorData.message,
      };
    }
    const data: IEventResponse = await res.json();
    if (!data.success) {
      return {
        success: false,
        message: data.message,
      };
    } else {
      revalidateTag("events/" + eventUid, "max");
      return {
        success: true,
        message: data.message,
      };
    }
  } catch (error) {
    console.error(
      "ERROR IN EVENT STAKEHOLDER UPDATE (SERVER ACTION) : ",
      error,
    );
    return {
      success: false,
      message: "An unknown error occurred",
    };
  }
};
