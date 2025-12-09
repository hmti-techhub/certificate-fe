"use server";

import { getSession } from "@/lib/get-session";
import { revalidateTag } from "next/cache";

export const addParticipantsByExcel = async (file: File, eventUid: string) => {
  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: "Unauthorized access",
      };
    }
    const token = session.token;
    if (!eventUid) {
      return {
        success: false,
        message: "Event UID is required",
      };
    }

    if (!token) {
      return {
        success: false,
        message: "Token is required",
      };
    }

    if (!file) {
      return {
        success: false,
        message: "File is required",
      };
    }

    const formData = new FormData();
    formData.append("excel", file);

    const res = await fetch(
      `${process.env.FRONTEND_URL}/api/events/${eventUid}/participants/add-excel`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    const responseData = await res.json();

    if (!res.ok || !responseData.success) {
      return {
        success: false,
        message: responseData.message,
      };
    } else {
      revalidateTag("participants", "max");
      return {
        success: true,
        message: "Added Participants by excel successfully",
      };
    }
  } catch (error) {
    console.log("ERROR IN PARTICIPANTS ADD BY EXCEL (SERVER ACTION):", error);
    return {
      success: false,
      message: "An unknown error occurred while uploading Excel file",
    };
  }
};
