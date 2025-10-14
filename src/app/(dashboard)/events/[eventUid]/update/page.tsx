import UpdateEventForm from "@/components/forms/UpdateEventForm";
import { getEventByEventId } from "@/actions/mutation/events/getEventByEventId";
const UpdateEventPage = async ({
  params,
}: {
  params: Promise<{ eventUid: string }>;
}) => {
  const { eventUid } = await params;

  if (!eventUid) {
    return (
      <div className="max-w-4xl mb-7 flex flex-col items-center justify-center mx-auto">
        <div className="bordered-nonhover flex flex-col text-white bg-redd w-full px-4 py-2 rounded-md pt-20">
          <h1 className="text-xl font-bold">Error</h1>
          <p className="text-sm ">Event UID is missing.</p>
        </div>
      </div>
    );
  }
  const eventData = await getEventByEventId(eventUid);
  if (!eventData) {
    return (
      <div className="max-w-4xl mb-7 flex flex-col items-center justify-center mx-auto">
        <div className="bordered-nonhover flex flex-col text-white bg-redd w-full px-4 py-2 rounded-md pt-20">
          <h1 className="text-xl font-bold">Error</h1>
          <p className="text-sm ">Event not found.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mb-7 flex flex-col items-center justify-center mx-auto">
      <div className="bordered-nonhover flex flex-col text-black bg-redd w-full px-4 py-2 rounded-md pt-20">
        <h1 className="text-xl font-bold">Update Event</h1>
        <p className="text-sm ">
          Fill out the form below to update a exiting event.
        </p>
      </div>
      <div className="mt-4 w-full">
        <UpdateEventForm eventData={eventData} />
      </div>
    </div>
  );
};

export default UpdateEventPage;
