import { IEventData, IEventResponse } from "@/lib/types/Event";
import { getSession } from "@/lib/get-session";
import { cacheTag, cacheLife } from "next/cache";

async function fetchEventsCached(token: string) {
  "use cache";
  cacheTag("events");
  cacheLife("minutes");

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const eventData: IEventResponse<IEventData[]> = await res.json();

    if (!eventData.success || eventData.status !== 200) return null;

    return eventData.data;
  } catch (error) {
    console.error("Error fetching event data:", error);
    return null;
  }
}

export const getEvents = async () => {
  const session = await getSession();
  if (!session?.token) {
    console.error("Session or token not found");
    return null;
  }

  return fetchEventsCached(session.token);
};
