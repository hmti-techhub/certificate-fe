import { IEventResponse, IEventUploadLogo } from "@/lib/types/Event";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ eventUid: string; option: string }> },
) {
  try {
    const { eventUid, option } = await params;
    const token = req.headers.get("Authorization")?.split(" ")[1];
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
    if (!eventUid) {
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: "Event UID is required",
        },
        { status: 400 },
      );
    }
    if (option !== "first" && option !== "second") {
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: "Invalid option",
        },
        { status: 400 },
      );
    }

    const formData = await req.formData();

    const file = formData.get(option + "_logo") as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: "File is required",
        },
        { status: 400 },
      );
    }

    // Forward to backend API
    const backendFormData = new FormData();
    backendFormData.append(option + "_logo", file);

    const res = await fetch(
      `${process.env.BACKEND_URL}/api/events/${eventUid}/upload-logo/${option}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: backendFormData,
      },
    );

    const responseData: IEventResponse<IEventUploadLogo> = await res.json();

    if (!res.ok || !responseData.success) {
      const errorData: IEventResponse = await res.json();
      return NextResponse.json(
        {
          success: false,
          status: res.status,
          message: errorData.message || "Failed to upload event logo",
        },
        { status: res.status },
      );
    } else {
      return NextResponse.json({
        success: true,
        status: 200,
        message: "Event logo uploaded successfully",
        data: responseData.data,
      });
    }
  } catch (error) {
    console.error(
      "Error in POST /api/events/:eventUid/upload-logo/:upload-logo :",
      error,
    );
    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
