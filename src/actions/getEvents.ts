import { IEventData, IEventResponse } from "@/lib/types/Event";
import { getSession } from "@/lib/get-session";

export const getEvents = async () => {
  "use cache";
  try {
    const session = await getSession();
    if (!session) {
      console.error("Session not found");
      return null;
    }
    const token = session.token;
    if (!token) {
      console.error("Token not found");
      return null;
    }

    const res = await fetch(`${process.env.BACKEND_URL}/api/events`, {
      method: "GET",
      // next: {
      //   revalidate: 60, // Revalidate every 60 seconds
      //   tags: ["events"],
      // },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const eventData: IEventResponse<IEventData[]> = await res.json();
    if (!eventData.success && eventData.status !== 200) {
      return null;
    }

    return eventData.data;
  } catch (error) {
    console.error(`Error fetching event data (SERVER ACTIONS) : `, error);
  }
};
