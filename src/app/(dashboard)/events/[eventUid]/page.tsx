import EventCard from "@/components/card/EventCard";
import { getSession } from "@/lib/get-session";
import { getEventByEventId } from "@/actions/mutation/events/getEventByEventId";
import { ParticipantsTable } from "@/components/table/ParticipantsTable";
import { TriangleAlert } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";
import ParticipantsTableSkeleton from "@/components/skeleton/ParticipantsTableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Event | HMTI UDINUS",
  description: "Dashboard Page",
  icons: {
    icon: "/favicon.ico",
  },
};

/**
 * Skeleton for event page loading state
 */
const EventPageSkeleton = () => (
  <div className="w-full px-0 md:px-0 lg:px-0 2xl:px-60 pb-40">
    <Skeleton className="w-full h-48 rounded-xl" />
    <div className="flex w-full justify-between mt-10 items-center">
      <Skeleton className="h-7 w-48" />
    </div>
    <ParticipantsTableSkeleton />
  </div>
);

/**
 * Event page content - accesses runtime data (session)
 * Must be wrapped in Suspense boundary per Cache Components requirements
 */
const EventPageContent = async ({ eventUid }: { eventUid: string }) => {
  const session = (await getSession())!;
  const token = session.token;
  const eventData = await getEventByEventId(eventUid);

  if (!eventData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="inline-flex items-center font-bold text-2xl ">
          <TriangleAlert className="mr-1" /> No Event Found
        </h1>
        <p className="mt-4 text-lg text-grayy font-medium">
          The event you are looking for does not exist or has been deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full px-0 md:px-0 lg:px-0 2xl:px-60 pb-40">
      <div className="w-full">
        <EventCard event={eventData} page="event" />
        <div className="flex w-full justify-between mt-10 items-center">
          <b className="text-xl">table of participants</b>
        </div>
        <ParticipantsTable
          token={token}
          eventData={{ uid: eventData.uid, name: eventData.eventName }}
        />
      </div>
    </div>
  );
};

/**
 * Event page - wraps runtime data access in Suspense boundary
 * Following Next.js 16 Cache Components best practice
 */
const EventPage = async ({
  params,
}: {
  params: Promise<{ eventUid: string }>;
}) => {
  const { eventUid } = await params;

  return (
    <Suspense fallback={<EventPageSkeleton />}>
      <EventPageContent eventUid={eventUid} />
    </Suspense>
  );
};

export default EventPage;
