"use server";

import { getSession } from "@/lib/get-session";
import { IUserResponse } from "@/lib/types/User";
import { revalidateTag } from "next/cache";

export const deleteUser = async (userUid: string) => {
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
    if (!userUid) {
      return {
        success: false,
        message: "Invalid user uid.",
      };
    }
    const res = await fetch(
      `${process.env.FRONTEND_URL}/api/users/${userUid}/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      const errorData: IUserResponse = await res.json();
      return {
        success: false,
        message: errorData.message as string,
      };
    }

    const userData: IUserResponse = await res.json();

    if (!userData.success) {
      return {
        success: false,
        message: userData.message,
      };
    } else {
      revalidateTag("users", "max");
      return {
        success: true,
        message: userData.message,
      };
    }
  } catch (error) {
    console.error("ERROR IN USER DELETE (SERVER ACTION) : ", error);
    return {
      success: false,
      message: "An unknown error occurred",
    };
  }
};
