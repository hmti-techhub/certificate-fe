import {
  IParticipantData,
  IParticipantResponse,
} from "@/lib/types/Participants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventUid: string }> },
) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  const { eventUid } = await params;

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        status: 401,
        message: "Authorization token is required",
      },
      { status: 401 },
    );
  }

  if (!eventUid) {
    return NextResponse.json(
      { success: false, status: 400, message: "Event UID is required" },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/events/participants/${eventUid}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 60, tags: ["participants"] },
      },
    );

    const data: IParticipantResponse<IParticipantData> = await res.json();

    if (!res.ok || !data.success) {
      return NextResponse.json(
        {
          success: false,
          status: res.status,
          message: data.message || "Failed fetching participants",
        },
        { status: res.status },
      );
    }

    return NextResponse.json(
      {
        success: true,
        status: 200,
        message: "Participants fetched successfully",
        data: data.data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching participants:", error);
    return NextResponse.json(
      { success: false, status: 500, message: "Internal server error" },
      { status: 500 },
    );
  }
}
