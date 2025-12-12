"use client";

import { IEventData } from "@/lib/types/Event";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { FormatDate } from "@/lib/functions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  ImageUp,
  MoreHorizontal,
  Newspaper,
  SquarePen,
  Trash2,
  View,
} from "lucide-react";
import { useState } from "react";
import GeneralAlert from "../popup/GeneralAlert";
import { toast } from "sonner";
import { deleteEvent } from "@/actions/mutation/events/deleteEvent";
import { useRouter } from "next/navigation";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { EventStakeholderDetailSheet } from "../sheet/form/EventStakeholderDetails";
import { UploadLogoSheet } from "../sheet/form/UploadLogoSheet";

const EventCard = ({
  event,
  page,
}: {
  event: IEventData;
  page: "dashboard" | "event";
}) => {
  const router = useRouter();
  const [openDeleteAlert, setOpenDeleteAlert] = useState<boolean>(false);
  const [openStakeholderDetail, setOpenStakeholderDetail] =
    useState<boolean>(false);
  const [openUploadLogoSheet, setOpenUploadLogoSheet] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const deleteEventHandler = () => {
    setIsLoading(true);
    try {
      toast.promise(deleteEvent(event.uid), {
        loading: "Deleting event...",
        success: (data) => {
          setOpenDeleteAlert(false);
          if (data.success) {
            router.push("/dashboard");
            return data.message;
          }
          throw new Error(data.message as string);
        },
        error: (error) => {
          console.error("Error deleting event:", error);
          return error.message;
        },
        finally: () => {
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      setIsLoading(false);
    }
  };

  const editEventHandler = () => {
    router.push(`/events/${event.uid}/update`);
  };
  if (page === "event") {
    return (
      <>
        <Card className="bordered-nonhover py-4 border-b-4 gap-3">
          <CardHeader className="aspect-[7/1] p-0 w-full rounded-md border-black overflow-hidden border">
            <Image
              src="/eventbg-1.jpg"
              alt="Event Background"
              width={1000}
              height={500}
              className="object-cover object-center h-full w-full"
              priority
            />
          </CardHeader>
          <CardContent className="flex flex-col items-start p-0 m-0">
            <div className="badge mb-2 text-[10px] md:text-xs">
              {event.organizer}
            </div>
            <h1 className="font-bold text-xl ">{event.eventName}</h1>
            <p className="text-xs md:text-sm text-grayy">{event.description}</p>
          </CardContent>
          <CardFooter className="flex flex-row justify-between p-0 m-0 text-gray-700 text-xs md:text-sm">
            <FormatDate>{event.activityAt}</FormatDate>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="bordered bg-greenn hover:bg-greenn/90 hover:border-b-1 border-b-4 text-black"
                  variant={"outline"}
                >
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bordered border-b-4 hover:border-b-1"
              >
                <DropdownMenuLabel className="text-sm">
                  Event Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="text-xs"
                    onClick={() => {
                      setTimeout(() => {
                        setOpenUploadLogoSheet(true);
                      }, 50);
                    }}
                  >
                    <ImageUp />
                    Upload Logo
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-xs"
                    onClick={() => {
                      setTimeout(() => {
                        setOpenStakeholderDetail(true);
                      }, 50);
                    }}
                  >
                    <View />
                    Stakeholder Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-xs"
                    onClick={() => {
                      setTimeout(() => {
                        router.push(`/events/${event.uid}/preview`);
                      }, 50);
                    }}
                  >
                    <Newspaper /> Preview
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="text-xs"
                    onClick={() => editEventHandler()}
                  >
                    <SquarePen /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-xs"
                    onClick={() => setOpenDeleteAlert(true)}
                    disabled={isLoading}
                  >
                    <Trash2 /> {isLoading ? "Deleting..." : "Delete"}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
        <GeneralAlert
          open={openDeleteAlert}
          setOpen={setOpenDeleteAlert}
          title="Are you sure for delete event data?"
          message={`This action will permanently remove the event data from storage. This cannot be undone.`}
          onSuccess={deleteEventHandler}
        />
        <EventStakeholderDetailSheet
          eventData={event}
          open={openStakeholderDetail}
          setOpen={setOpenStakeholderDetail}
        />
        <UploadLogoSheet
          open={openUploadLogoSheet}
          setOpen={setOpenUploadLogoSheet}
          eventData={event}
        />
      </>
    );
  }
  return (
    <Link href={"/events/" + event.uid} key={event.uid}>
      <Card className="h-full flex flex-col bordered py-4 border-b-4 hover:border-b cursor-pointer">
        <CardHeader className="aspect-[7/2] p-0 w-full  rounded-md border-black overflow-hidden border">
          <Image
            src="/eventbg-1.jpg"
            alt="Event Background"
            width={1000}
            height={500}
            className="object-cover object-center h-full w-full"
            priority
          />
        </CardHeader>
        <div className="h-full flex flex-col justify-between">
          <CardContent className="flex flex-col items-start p-0 m-0">
            <div className="badge mb-2 flex text-[10.5px] md:text-xs">
              {event.organizer}
            </div>
            <h1 className="font-bold text-xl">{event.eventName}</h1>
          </CardContent>
          <CardFooter className="flex flex-row justify-between p-0 m-0 text-gray-700 text-sm">
            <FormatDate>{event.activityAt}</FormatDate>
          </CardFooter>
        </div>
      </Card>
    </Link>
  );
};

export default EventCard;
