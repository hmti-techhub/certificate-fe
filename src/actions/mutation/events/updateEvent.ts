"use server";

import { updateEventSchema } from "@/lib/types/General";
import { z } from "zod";
import { IEventResponse } from "@/lib/types/Event";
import { revalidateTag } from "next/cache";
import { getSession } from "@/lib/get-session";

export const updateEvent = async (
  values: z.infer<typeof updateEventSchema>,
  eventUid: string,
) => {
  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: "Session expired. Please log in again.",
      };
    }
    const token = session.token;
    if (!token) {
      return {
        success: false,
        message: "Unauthorized access",
      };
    }
    const validatedFields = updateEventSchema.safeParse(values);
    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid event data.",
      };
    }
    const {
      eventName,
      description,
      activityAt,
      prefixCode,
      suffixCode,
      organizer,
      eventTemplate,
      eventTheme,
    } = validatedFields.data;
    const res = await fetch(
      `${process.env.FRONTEND_URL}/api/events/update/${eventUid}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventName,
          description,
          activityAt,
          prefixCode,
          suffixCode,
          organizer,
          eventTemplate,
          eventTheme,
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
      revalidateTag("events", "max");
      revalidateTag(`event-${eventUid}`, "max");
      revalidateTag("participants", "max");
      return {
        success: true,
        message: data.message,
      };
    }
  } catch (error) {
    console.error("ERROR IN EVENT UPDATE (SERVER ACTION) : ", error);
    return {
      success: false,
      message: "An unknown error occurred",
    };
  }
};
