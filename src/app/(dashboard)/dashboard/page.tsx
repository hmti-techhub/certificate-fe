import { CardContent } from "@/components/ui/card";
import { IEventData } from "@/lib/types/Event";
import { Frown, MailWarning, Plus } from "lucide-react";
import Link from "next/link";
import EventCard from "@/components/card/EventCard";
import { auth } from "@/auth";
import { getAllEvents } from "@/actions/mutation/events/getAllEvents";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard Page",
  icons: {
    icon: "/favicon.ico",
  },
};

const DashboardPage = async () => {
  const session = await auth();
  const isPremium = session?.user.isPremium;
  const isVerifiedEmail = session?.user.isVerifiedEmail;
  const eventData = await getAllEvents();

  return (
    <div
      className={
        isPremium
          ? "pt-0"
          : "pt-60 w-full flex flex-col items-center justify-center"
      }
    >
      {" "}
      {isVerifiedEmail ? (
        isPremium ? (
          <div className="w-full grid grid-rows-1 md:grid-cols-2 lg:grid-cols-3 pt-4 md:pt-8 gap-4 pb-5">
            {eventData?.map((event: IEventData) => {
              return (
                <EventCard event={event} key={event.uid} page="dashboard" />
              );
            })}
            <Link
              href="/events/create"
              className="-order-1 md:order-none py-20 rounded-md bordered border-b-4 hover:border-b cursor-pointer"
            >
              <CardContent className="flex flex-col items-center justify-center h-full py-4">
                <Plus className="text-center" />
                <p>Add event</p>
              </CardContent>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center text-grayy  justify-center gap-4">
            <Frown size={100} />
            <p className="text-sm md:text-lg text-center ">
              Upgrade to our premium package to unlock this feature.
            </p>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center text-grayy justify-center gap-4 pt-60">
          <MailWarning size={100} />
          <p className="text-sm md:text-lg text-center">
            Please verify your email address to access this feature.
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
