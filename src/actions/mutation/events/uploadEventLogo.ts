"use server";

import { getSession } from "@/lib/get-session";
import { IEventResponse, IEventUploadLogo } from "@/lib/types/Event";
import { revalidateTag } from "next/cache";

export const uploadEventLogo = async (
  file: File,
  eventUid: string,
  option: "first" | "second",
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
    if (!eventUid) {
      return {
        success: false,
        message: "Event UID is required",
      };
    }

    if (!file) {
      return {
        success: false,
        message: "File is required",
      };
    }

    const formData = new FormData();
    formData.append(option + "_logo", file);

    //HIT ENDPOINT ROUTE FROM BACKEND API SERVICE
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/events/${eventUid}/upload-logo/${option}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    const responseData: IEventResponse<IEventUploadLogo> = await res.json();

    if (!res.ok || !responseData.success) {
      return {
        success: false,
        message: responseData.message || "Failed to upload file logo",
      };
    } else {
      revalidateTag("events/" + eventUid);
      return {
        success: true,
        message: "Event logo uploaded successfully",
      };
    }
  } catch (error) {
    console.error("ERROR IN EVENT LOGO UPLOAD (SERVER ACTION):", error);
    return {
      success: false,
      message: "An unknown error occurred while uploading event logo file",
    };
  }
};
