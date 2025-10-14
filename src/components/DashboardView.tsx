import Navbar from "./Navbar";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { FormatDate } from "@/lib/functions";
import { Plus } from "lucide-react";
import { IAuthSession } from "@/lib/types/Auth";

interface IDummyEvent {
  owner: string;
  eventName: string;
  eventTimestamp: string;
}

const DashboardView = () => {
  const dummyEvent: IDummyEvent[] = [
    {
      owner: "Sindu",
      eventName: "SEMNASTI",
      eventTimestamp: "2024-11-30T14:00:00Z",
    },
    {
      owner: "Alvin",
      eventName: "HI-TECH",
      eventTimestamp: "2025-05-15T14:00:00Z",
    },
    {
      owner: "Ulya",
      eventName: "IT Competition",
      eventTimestamp: "2025-01-23T14:00:00Z",
    },
  ];
  return (
    <>
      <div className="border-1 border-black  bg-white">
        <div className="w-full md:px-10 lg:px-24 pt-4 pb-24 min-h-screen">
          <Navbar clickable={false} />
          <div className="flex flex-col pt-14">
            <div className="pt-4">
              <div className="w-full grid grid-cols-3 gap-4">
                {dummyEvent.map((event) => {
                  return (
                    <Card
                      className="bordered py-4 border-b-4 hover:border-b cursor-pointer"
                      key={event.eventName}
                    >
                      <div className="aspect-[7/2] p-0 w-full rounded-md border-black overflow-hidden border">
                        <Image
                          src="/eventbg-1.jpg"
                          alt="Event Background"
                          width={1000}
                          height={500}
                          className="object-cover object-center h-full w-full"
                        />
                      </div>
                      <div className="flex flex-col items-start">
                        <div className="badge mb-2">{event.owner}</div>
                        <h1 className="font-bold text-xl mb-4">
                          {event.eventName}
                        </h1>
                        <p className="text-grayy text-sm">
                          {FormatDate({ children: event.eventTimestamp })}
                        </p>
                      </div>
                    </Card>
                  );
                })}
                <Card className="py-20 rounded-md bordered border-b-4 hover:border-b cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center h-full">
                    <Plus className="text-center" />
                    <p>Add event</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardView;
