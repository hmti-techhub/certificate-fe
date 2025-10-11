import { auth } from "@/auth";
import { IUserData, IUserResponse } from "@/lib/types/User";
export const getUserData = async (): Promise<{
  success: boolean;
  message: string;
  data?: IUserData;
}> => {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }
    const token = session?.token;
    if (!token) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }
    const res = await fetch(`${process.env.FRONTEND_URL}/api/users/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        userId: session.user.id,
      },
      next: {
        tags: [`user-${session.user.id}`],
      },
    });
    const userResponse: IUserResponse<IUserData> = await res.json();
    if (!userResponse.success && userResponse.status !== 200) {
      return {
        success: false,
        message: userResponse.message || "Failed to fetch user data",
      };
    } else {
      if (!userResponse.data) {
        return {
          success: false,
          message: "User data not found",
        };
      }

      return {
        success: true,
        message: "User data fetched successfully",
        data: userResponse.data,
      };
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching user data: ", errorMessage);
    return {
      success: false,
      message: "Failed to fetch user data",
    };
  }
};
