import EventCard from "@/components/card/EventCard";
import { auth } from "@/auth";
import { getEventByEventId } from "@/actions/mutation/events/getEventByEventId";
import { ParticipantsTable } from "@/components/table/ParticipantsTable";
import { TriangleAlert } from "lucide-react";

const EventPage = async ({
  params,
}: {
  params: Promise<{ eventUid: string }>;
}) => {
  const { eventUid } = await params;
  const session = await auth();

  const token = session?.token;
  if (!token) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        Unauthorized access
      </div>
    );
  }
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

export default EventPage;
