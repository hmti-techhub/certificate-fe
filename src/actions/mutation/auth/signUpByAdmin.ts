"use server";

import { addAccountFormSchema } from "@/lib/types/General";
import { IAuthResponse } from "@/lib/types/Auth";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { getSession } from "@/lib/get-session";

export const signUpByAdmin = async (
  values: z.infer<typeof addAccountFormSchema>,
) => {
  try {
    const session = await getSession();
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
    const validatedFields = addAccountFormSchema.safeParse(values);
    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }
    const { email, password, roles, packagePremium } = validatedFields.data;
    const res = await fetch(`${process.env.FRONTEND_URL}/api/users/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        password,
        roles,
        packagePremium,
      }),
    });

    const data: IAuthResponse = await res.json();
    if (!data.success) {
      return {
        success: false,
        message: data.message,
      };
    }
    revalidateTag("users");
    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    console.error("ERROR IN ADD ACCOUNT (SERVER ACTION) : ", error);
    return {
      success: false,
      message: "An unknown error occurred",
    };
  }
};
