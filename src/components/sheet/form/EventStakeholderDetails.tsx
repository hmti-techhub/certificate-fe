import { useEffect, useState } from "react";
import { GeneralSheet } from "../GeneralSheet";
import { IEventData, IEventStakeholder } from "@/lib/types/Event";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateStakeholderSchema } from "@/lib/types/General";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { InputFormField } from "@/components/forms/fields/CustomInputField";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { updateStakeholderData } from "@/actions/mutation/events/updateStakeholderData";
import { useRouter } from "next/navigation";
import { Image as Img } from "lucide-react";
import { UploadStakeholderImageDialog } from "@/components/popup/form/UploadStakeholderImageDialog";
import LoadingCircle from "@/components/animation/LoadingCircle";

type EventStakeholderDetailSheetProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  eventData: IEventData;
};

export const EventStakeholderDetailSheet = ({
  open,
  setOpen,
  eventData,
}: EventStakeholderDetailSheetProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [stakeholderData, setStakeholderData] = useState<IEventStakeholder>({
    uid: eventData.stakeholders![0].uid,
    eventId: eventData.stakeholders![0].eventId,
    name: eventData.stakeholders![0].name,
    position: eventData.stakeholders![0].position,
    photoPath: eventData.stakeholders![0].photoPath
      ? "https://api-certify.hmtiudinus.org" +
        eventData.stakeholders![0].photoPath
      : "https://github.com/shadcn.png",
  });
  const form = useForm<z.infer<typeof updateStakeholderSchema>>({
    resolver: zodResolver(updateStakeholderSchema),
    defaultValues: {
      eventStakeholderName: stakeholderData.name,
      eventStakeholderPosition: stakeholderData.position,
    },
  });

  const handleSubmitStakeholderData = (
    values: z.infer<typeof updateStakeholderSchema>,
  ) => {
    setIsLoading(true);
    setOpen(false);
    try {
      toast.promise(
        updateStakeholderData(values, eventData.uid, stakeholderData.uid),
        {
          loading: "Updating stakeholder data...",
          success: (data) => {
            if (data.success) {
              setOpen(false);
              router.push("/events/" + eventData.uid);
              return data.message;
            }
            throw new Error(data.message as string);
          },
          error: (error) => {
            console.error("Error updating stakeholder data:", error);
            return error.message;
          },
          finally: () => {
            setIsLoading(false);
          },
        },
      );
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setStakeholderData({
      uid: eventData.stakeholders![0].uid,
      eventId: eventData.stakeholders![0].eventId,
      name: eventData.stakeholders![0].name,
      position: eventData.stakeholders![0].position,
      photoPath: eventData.stakeholders![0].photoPath,
    });
  }, [eventData]);
  return (
    <>
      <GeneralSheet
        open={open}
        setOpen={setOpen}
        title="Stakeholder Details"
        description="View and manage stakeholder details for this event."
      >
        <div className="">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmitStakeholderData)}
              className="w-full flex flex-col justify-center gap-4 px-4"
            >
              <div className="flex flex-row items-start justify-start">
                <div className="w-[70px] h-[70px] mr-4 rounded-full overflow-hidden border-2 border-black ">
                  {stakeholderData.photoPath === null || undefined ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 font-bold">
                      {stakeholderData.name.slice(0, 2)}
                    </div>
                  ) : (
                    <Image
                      src={
                        stakeholderData.photoPath !== null
                          ? "https://api-certify.hmtiudinus.org" +
                            stakeholderData.photoPath
                          : "https://github.com/shadcn.png"
                      }
                      width={70}
                      height={70}
                      className="object-cover object-center w-full h-full"
                      alt={stakeholderData.name.slice(0, 2)}
                      onLoad={() => {
                        return <LoadingCircle />;
                      }}
                      loading="lazy"
                      onError={(e) => {
                        console.log("Error loading stakeholder image", e);
                      }}
                    />
                  )}
                </div>
                <div className="flex flex-col gap-[1px] items-start justify-center">
                  <h1 className="text-lg font-bold">{stakeholderData.name}</h1>
                  <p className="text-sm text-grayy">
                    {stakeholderData.position}
                  </p>
                </div>
              </div>
              <Separator
                orientation="horizontal"
                className="text-black bg-black pb-[1px]"
              />
              <div className="flex flex-col gap-4">
                <InputFormField
                  form={form}
                  name="eventStakeholderName"
                  label="Stakeholder Name"
                  placeholder="Stakeholder Name"
                  type="text"
                  description="Enter the name of the stakeholder."
                />
                <InputFormField
                  form={form}
                  name="eventStakeholderPosition"
                  label="Stakeholder Position"
                  placeholder="Stakeholder Position"
                  type="text"
                  description="Enter the name position of the stakeholder."
                />
                <Button
                  type="button"
                  size={"lg"}
                  className="bordered bg-purplee hover:bg-purplee/90 border-b-4 hover:border-b-1 text-black w-full"
                  onClick={() => setOpenDialog(true)}
                >
                  <Img /> upload stakeholder image
                </Button>
                <Button
                  type="submit"
                  className="bordered bg-greenn hover:bg-greenn/90 border-b-4 hover:border-b-1 text-black w-full"
                  size={"lg"}
                  disabled={isLoading}
                >
                  update data
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </GeneralSheet>
      <UploadStakeholderImageDialog
        eventUid={eventData.uid}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        setOpenSheet={setOpen}
      />
    </>
  );
};
