"use server";

import { getSession } from "@/lib/get-session";
import { revalidateTag } from "next/cache";

export const uploadStakeholderImage = async (file: File, eventUid: string) => {
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
    formData.append("image", file);

    //HIT ENDPOINT ROUTE FROM BACKEND API SERVICE
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/events/${eventUid}/upload-stakeholder`,
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
        message: responseData.message || "Failed to upload file image",
      };
    } else {
      revalidateTag("events/" + eventUid, "max");
      return {
        success: true,
        message: "Stakeholder image uploaded successfully",
      };
    }
  } catch (error) {
    console.error("ERROR IN STAKEHOLDER IMAGE UPLOAD (SERVER ACTION):", error);
    return {
      success: false,
      message:
        "An unknown error occurred while uploading stakeholder image file",
    };
  }
};
