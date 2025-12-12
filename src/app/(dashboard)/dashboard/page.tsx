import { CardContent } from "@/components/ui/card";
import { IEventData } from "@/lib/types/Event";
import { Frown, MailWarning, Plus } from "lucide-react";
import Link from "next/link";
import EventCard from "@/components/card/EventCard";
import { Metadata } from "next";
import EventCardSkeleton from "@/components/skeleton/EventCardSkelelon";
import { Suspense } from "react";
import { getSession } from "@/lib/get-session";
import { getEvents } from "@/actions/getEvents";

export const metadata: Metadata = {
  title: "Dashboard | HMTI UDINUS",
  description: "Dashboard Page",
  icons: {
    icon: "/favicon.ico",
  },
};

const EventList = async () => {
  const eventData: IEventData[] | null | undefined = await getEvents();

  return (
    <>
      {eventData?.map((event: IEventData) => {
        return <EventCard event={event} key={event.uid} page="dashboard" />;
      })}
    </>
  );
};

/**
 * Dashboard content component - accesses runtime data (session)
 * Must be wrapped in Suspense boundary per Cache Components requirements
 */
const DashboardContent = async () => {
  const session = await getSession();
  const isPremium = session?.user.isPremium;
  const isVerifiedEmail = session?.user.isVerifiedEmail;

  if (!isVerifiedEmail) {
    return (
      <div className="flex flex-col items-center text-grayy justify-center gap-4 pt-60">
        <MailWarning size={100} />
        <p className="text-sm md:text-lg text-center">
          Please verify your email address to access this feature.
        </p>
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="pt-60 w-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center text-grayy justify-center gap-4">
          <Frown size={100} />
          <p className="text-sm md:text-lg text-center">
            Upgrade to our premium package to unlock this feature.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-rows-1 md:grid-cols-2 lg:grid-cols-3 pt-4 md:pt-8 gap-4 pb-5">
      <Suspense
        fallback={
          <>
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </>
        }
      >
        <EventList />
        <Link
          href="/events/create"
          className="-order-1 md:order-none py-20 rounded-md bordered border-b-4 hover:border-b cursor-pointer"
        >
          <CardContent className="flex flex-col items-center justify-center h-full py-4">
            <Plus className="text-center" />
            <p>Add event</p>
          </CardContent>
        </Link>
      </Suspense>
    </div>
  );
};

/**
 * Dashboard page - wraps runtime data access in Suspense boundary
 * Following Next.js 16 Cache Components best practice
 */
const DashboardPage = () => {
  return (
    <Suspense
      fallback={
        <div className="pt-0 w-full grid grid-rows-1 md:grid-cols-2 lg:grid-cols-3 pt-4 md:pt-8 gap-4 pb-5">
          <EventCardSkeleton />
          <EventCardSkeleton />
          <EventCardSkeleton />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
};

export default DashboardPage;
