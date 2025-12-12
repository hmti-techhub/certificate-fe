"use server";
import { getSession } from "@/lib/get-session";
import { IEventResponse } from "@/lib/types/Event";
import { revalidateTag } from "next/cache";

export const deleteEvent = async (eventUid: string) => {
  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: "Session not valid.",
      };
    }
    const token = session.token;
    if (!eventUid || !token) {
      return {
        success: false,
        message: "Invalid event uid / session.",
      };
    }
    const res = await fetch(
      `${process.env.FRONTEND_URL}/api/events/delete/${eventUid}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!res.ok) {
      const errorData: IEventResponse = await res.json();

      return {
        success: false,
        message: errorData.message as string,
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
      return {
        success: true,
        message: "Event deleted successfully",
      };
    }
  } catch (error) {
    console.error("ERROR IN EVENT DELETE (SERVER ACTION) : ", error);
    return {
      success: false,
      message: "An unknown error occurred",
    };
  }
};
