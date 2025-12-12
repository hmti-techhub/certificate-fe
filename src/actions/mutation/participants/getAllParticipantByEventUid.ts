import { getSession } from "@/lib/get-session";
import {
  IParticipantResponse,
  IParticipantData,
} from "@/lib/types/Participants";
import { cacheTag, cacheLife } from "next/cache";

/**
 * Cached function - receives token and eventUid as arguments which become part of cache key
 * Uses "participants" tag for bulk invalidation and event-specific tag for granular invalidation
 */
async function fetchParticipantsCached(
  token: string,
  eventUid: string,
): Promise<IParticipantData[] | null> {
  "use cache";
  cacheTag("participants", `participants-${eventUid}`);
  cacheLife("minutes"); // 5 minutes default

  try {
    const res = await fetch(
      `${process.env.FRONTEND_URL}/api/events/participants/${eventUid}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const participantsData: IParticipantResponse<IParticipantData[]> =
      await res.json();
    if (!participantsData.success && participantsData.status !== 200) {
      return null;
    }
    return participantsData.data;
  } catch (error) {
    console.error(
      `Error fetching participants for event (${eventUid}):`,
      error,
    );
    return null;
  }
}

/**
 * Public function - handles runtime data (session), then calls cached function
 * Following Next.js 16 Cache Components best practice
 */
const getAllParticipanByEventUid = async (
  eventUid: string,
): Promise<IParticipantData[] | null | undefined> => {
  if (!eventUid) {
    console.error("Event UID is required");
    return null;
  }

  const session = await getSession();
  if (!session?.token) {
    console.error("Session or token not found");
    return null;
  }

  return fetchParticipantsCached(session.token, eventUid);
};

export default getAllParticipanByEventUid;
