"use server";

import { auth } from "@/auth";
import { updownPackageFormSchema } from "@/lib/types/General";
import { revalidateTag } from "next/cache";
import { z } from "zod";
export const updownUserPackage = async (
  values: z.infer<typeof updownPackageFormSchema>,
  userUid: string,
) => {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        message: "Session not found",
      };
    }
    const token = session?.token;
    if (!token) {
      return {
        success: false,
        message: "Token not found",
      };
    }
    const validatedFields = updownPackageFormSchema.safeParse(values);
    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid package data.",
      };
    }
    const { premiumPackage } = validatedFields.data;
    if (!userUid) {
      return {
        success: false,
        message: "Invalid user uid.",
      };
    }
    const res = await fetch(
      `${process.env.FRONTEND_URL}/api/users/${userUid}/updown-package`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          premiumPackage,
        }),
      },
    );
    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: false,
        message: errorData.message,
      };
    }
    const data = await res.json();
    if (!data.success) {
      return {
        success: false,
        message: data.message,
      };
    } else {
      revalidateTag("users");
      revalidateTag(`user-${userUid}`);
      return {
        success: true,
        message: data.message,
      };
    }
  } catch (error) {
    console.error("ERROR IN USER UPDOWN (SERVER ACTION) : ", error);
    return {
      success: false,
      message: "An unknown error occurred",
    };
  }
};
