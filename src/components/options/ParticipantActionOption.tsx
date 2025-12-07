"use client";

import { MoreHorizontal, QrCode, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { IParticipantDataTable } from "@/lib/types/Participants";
import GeneralAlert from "../popup/GeneralAlert";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteParticipant } from "@/actions/mutation/participants/deleteParticipant";
import { UpdateParticipantSheet } from "../sheet/form/UpdateParticipantSheet";
import GeneralDialog from "../popup/GeneralDialog";
import LoadingCircle from "../animation/LoadingCircle";
import { useParticipantsContext } from "@/context/ParticipantsContext";

type ParticantActionOptionProps = {
  data: IParticipantDataTable;
  eventUid: string;
};

export const ParticipantActionOption = ({
  data,
  eventUid,
}: ParticantActionOptionProps) => {
  const { refreshParticipants } = useParticipantsContext();
  const [openDeleteAlert, setOpenDeleteAlert] = useState<boolean>(false);
  const [openUpdateSheet, setOpenUpdateSheet] = useState<boolean>(false);
  const [openDownloadDialog, setOpenDownloadDialog] = useState<boolean>(false);
  const [extensionSelected, setExtensionSelected] = useState<string>("webp");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [participantData, setParticipantData] =
    useState<IParticipantDataTable>(data);

  useEffect(() => {
    setParticipantData(data);
  }, [data, openUpdateSheet]);

  const handleDownload = () => {
    if (extensionSelected === "") {
      toast.error("Please select a format to download the QR code");
      return;
    }
    const downloadFile = async () => {
      try {
        const url = new URL(
          participantData.pathQr,
          "https://certify.derisdev.cloud",
        );
        url.searchParams.set("download", "1");
        const updatedUrl = url.toString() + `&ext=${extensionSelected}`;
        const link = document.createElement("a");
        link.href = updatedUrl;
        link.download = updatedUrl;
        return new Promise<void>((resolve) => {
          link.addEventListener("click", () => {
            setTimeout(() => {
              resolve();
            }, 4000);
          });
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      } catch (error) {
        throw new Error("Error downloading QR code: " + error);
      }
    };
    try {
      toast.promise(downloadFile(), {
        loading: "Downloading QR code...",
        success: () => {
          return "QR code downloaded successfully";
        },
        error: (error) => {
          return error.message as string;
        },
      });
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast.error("Error downloading QR code");
    }
  };
  const handleDelete = () => {
    setIsLoading(true);
    try {
      toast.promise(deleteParticipant(eventUid, participantData.uid), {
        loading: "Deleting participant...",
        success: (data) => {
          if (data.success) {
            refreshParticipants();
            return "Participant deleted successfully";
          }
          throw new Error(data.message);
        },
        error: (error) => {
          return error.message as string;
        },
        finally: () => {
          setIsLoading(false);
          setOpenDeleteAlert(false);
        },
      });
    } catch (error) {
      console.error("Error deleting participant:", error);
    }
  };
  return (
    <>
      <div className="w-full lg:flex flex-1 justify-end items-end space-x-2 hidden">
        <Button
          className="bordered bg-redd hover:bg-redd/90 text-black"
          onClick={() => setOpenDeleteAlert(true)}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="inline-flex items-center">
              deleting... <LoadingCircle />
            </span>
          ) : (
            <span className="inline-flex items-center">
              delete <Trash2 className="ml-2" />
            </span>
          )}
        </Button>
        <Button
          className="bordered bg-[#99B2FF] hover:bg-[#99B2FF]/90 text-black"
          onClick={() => {
            setParticipantData(data);
            setOpenUpdateSheet(true);
          }}
        >
          update <SquarePen />
        </Button>
        <Button
          className="bordered bg-yelloww hover:bg-yelloww/90 text-black"
          onClick={() =>
            setTimeout(() => {
              setOpenDownloadDialog(true);
            }, 50)
          }
        >
          download <QrCode />
        </Button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="lg:hidden flex">
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
          <DropdownMenuLabel>Participant Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              setTimeout(() => {
                setOpenDownloadDialog(true);
              }, 50)
            }
          >
            <QrCode />
            download
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              setTimeout(() => {
                setOpenUpdateSheet(true);
              }, 50)
            }
          >
            <SquarePen />
            update
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              setTimeout(() => {
                setOpenDeleteAlert(true);
              }, 50)
            }
            disabled={isLoading}
          >
            {isLoading ? (
              <div>
                <LoadingCircle />
                <span className="ml-2">deleting...</span>
              </div>
            ) : (
              <span className="inline-flex items-center">
                <Trash2 className="mr-2" /> delete
              </span>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <GeneralAlert
        open={openDeleteAlert}
        setOpen={setOpenDeleteAlert}
        message="This action will permanently remove the participant data from storage. This cannot be undone."
        title="Are you sure you want to delete this participant?"
        onSuccess={handleDelete}
      />
      <UpdateParticipantSheet
        open={openUpdateSheet}
        setOpen={setOpenUpdateSheet}
        data={participantData}
      />
      <GeneralDialog
        open={openDownloadDialog}
        setOpen={setOpenDownloadDialog}
        message="Please select the format you want to download."
        title="Download QR Code"
        onSuccess={handleDownload}
        successText="download"
      >
        <div className="inline-flex flex-row w-full">
          <div className=" bg-purplee bordered-nonhover rounded-lg rounded-r-none text-black flex w-full">
            <QrCode className="mr-2 my-auto w-6 " />
            <span className="my-auto">{participantData.name}</span>
          </div>
          <Select onValueChange={(e) => setExtensionSelected(e)}>
            <SelectTrigger className="text-black bg-purplee bordered border-black rounded-lg rounded-l-none  border-b-4 hover:border-b-1 min-h-12 hover:cursor-pointer">
              <SelectValue placeholder="download as" />
            </SelectTrigger>
            <SelectContent
              className="bordered border-b-4 hover:border-b-1"
              side="bottom"
            >
              <SelectItem value="webp">.webp</SelectItem>
              <SelectItem value="jpeg">.jpeg</SelectItem>
              <SelectItem value="jpg">.jpg</SelectItem>
              <SelectItem value="png">.png</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </GeneralDialog>
    </>
  );
};
