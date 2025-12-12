import { getSession } from "@/lib/get-session";
import { IEventData, IEventResponse } from "@/lib/types/Event";
import { cacheTag, cacheLife } from "next/cache";

/**
 * Cached function - receives token and eventUid as arguments which become part of cache key
 * Uses both "events" tag (for bulk invalidation) and event-specific tag (for granular invalidation)
 */
async function fetchEventByIdCached(token: string, eventUid: string) {
  "use cache";
  cacheTag("events", `event-${eventUid}`);
  cacheLife("minutes"); // 5 minutes default

  try {
    const res = await fetch(
      `${process.env.FRONTEND_URL}/api/events/${eventUid}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const eventData: IEventResponse<IEventData> = await res.json();
    if (!eventData.success && eventData.status !== 200) {
      return null;
    }
    return eventData.data;
  } catch (error) {
    console.error(
      `Error fetching event (${eventUid}) data (SERVER ACTIONS) : `,
      error,
    );
    return null;
  }
}

/**
 * Public function - handles runtime data (session), then calls cached function
 * Following Next.js Cache Components best practice: runtime data cannot be
 * used in the same scope as 'use cache'
 */
export const getEventByEventId = async (eventUid: string) => {
  if (!eventUid) {
    console.error("Event UID is required");
    return null;
  }

  const session = await getSession();
  if (!session?.token) {
    console.error("Session or token not found");
    return null;
  }

  return fetchEventByIdCached(session.token, eventUid);
};
