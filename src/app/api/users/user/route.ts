import { NextRequest, NextResponse } from "next/server";
import { IUserData, IUserResponse } from "@/lib/types/User";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    const userId = req.headers.get("userId");
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          status: 401,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          status: 401,
          message: "User ID not found",
        },
        { status: 401 },
      );
    }
    const res = await fetch(`${process.env.BACKEND_URL}/api/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: {
        tags: [`user-${userId}`],
        revalidate: 60,
      },
    });
    const userResponse: IUserResponse<IUserData> = await res.json();
    if (!userResponse.success && userResponse.status !== 200) {
      return NextResponse.json(
        {
          success: false,
          status: userResponse.status || 500,
          message: userResponse.message || "Failed to fetch user data",
        },
        { status: userResponse.status || 500 },
      );
    } else {
      console.log("User data fetched successfully", userResponse.data);
      if (!userResponse.data) {
        return NextResponse.json(
          {
            success: false,
            status: 404,
            message: "User data not found",
          },
          { status: 404 },
        );
      }

      // Inject JSON ke dalam response dari `unstable_update`
      return NextResponse.json(
        {
          success: true,
          status: 200,
          message: "User data fetched and session updated successfully",
          data: userResponse.data,
        },
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching users (ROUTE HANDLER): ", errorMessage);
    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: "Failed to fetch user data",
      },
      { status: 500 },
    );
  }
}
