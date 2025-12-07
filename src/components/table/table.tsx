"use client";
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

//COMPONENTS
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

//ICONS
import { ChevronsLeft, ChevronsRight, QrCode, Trash2 } from "lucide-react";
import { useState } from "react";
import { AddParticipantsButton } from "../button/AddParticipantsButton";
import GeneralDialog from "../popup/GeneralDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import GeneralAlert from "../popup/GeneralAlert";
import { deleteAllParticipants } from "@/actions/mutation/participants/deleteAllParticipants";
import LoadingCircle from "../animation/LoadingCircle";
import { AddAccountButton } from "../button/AddAccountButton";
import { useParticipantsContext } from "@/context/ParticipantsContext";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page: "event" | "admin";
  eventUid?: string;
  eventName?: string;
}

export function GeneralTable<TData, TValue>({
  columns,
  data,
  page,
  eventUid,
  eventName,
}: DataTableProps<TData, TValue>) {
  const { refreshParticipants } = useParticipantsContext();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "id", desc: false },
  ]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    suffix: false,
    certificateNumber: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState<boolean>(false);
  const [openDownloadDialog, setOpenDownloadDialog] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [extensionSelected, setExtensionSelected] = useState<string>("webp");

  const memoColumns = React.useMemo(() => columns, [columns]);
  const memoData = React.useMemo(() => data, [data]);

  const table = useReactTable({
    data: memoData,
    columns: memoColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });

  const handleDownload = () => {
    if (extensionSelected === "") {
      toast.error("Please select a format to download the QR code");
      return;
    }
    const downloadFile = async () => {
      try {
        const url = new URL(
          `/qrcode/${eventUid}/all`,
          "https://certify.derisdev.cloud",
        );
        url.searchParams.set("ext", extensionSelected);
        const updatedUrl = url.toString();
        const link = document.createElement("a");
        link.href = updatedUrl;
        link.download = updatedUrl;
        return new Promise<void>((resolve) => {
          link.addEventListener("click", () => {
            setTimeout(() => {
              resolve();
            }, 7000);
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

  const deleteEventHandler = () => {
    setIsLoading(true);
    try {
      toast.promise(deleteAllParticipants(eventUid!), {
        loading: "Deleting all participants...",
        success: (data) => {
          setOpenDeleteAlert(false);
          if (data.success) {
            refreshParticipants();
            return data.message;
          }
          throw new Error(data.message as string);
        },
        error: (error) => {
          console.error("Error deleting all participants :", error);
          return error.message;
        },
        finally: () => {
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error("Error deleting all participants:", error);
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full">
      <div className="flex flex-row justify-start py-4 gap-3">
        <div className="flex w-full">
          <Input
            placeholder={
              page === "event" ? "search by name" : "search by email"
            }
            value={searchInput}
            onChange={(event) => {
              const value = event.target.value;
              setSearchInput(value);
              if (page === "event") {
                table.getColumn("name")?.setFilterValue(value);
              } else {
                table.getColumn("email")?.setFilterValue(value);
              }
            }}
            className={`border-black ${
              page === "event" ? "max-w-4xl" : "max-w-xs"
            } bordered border-b-4 hover:border-b-1`}
          />
        </div>
        {page === "event" ? (
          <>
            <AddParticipantsButton eventUid={eventUid!} />
          </>
        ) : (
          <AddAccountButton />
        )}
      </div>
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  no results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="space-x-2">
          {(() => {
            const currentPage = table.getState().pagination.pageIndex + 1;
            const totalPages = table.getPageCount();
            const pageNumbers = [];
            if (currentPage > 3) {
              pageNumbers.push(1);
            }
            if (currentPage > 4) {
              pageNumbers.push("...");
            }
            for (
              let i = Math.max(1, currentPage - 1);
              i <= Math.min(totalPages, currentPage + 1);
              i++
            ) {
              pageNumbers.push(i);
            }
            if (currentPage < totalPages - 3) {
              pageNumbers.push("...");
            }
            if (currentPage < totalPages - 2) {
              pageNumbers.push(totalPages);
            }
            return (
              <div
                className={
                  table.getRowModel().rows?.length ? "flex space-x-1" : "hidden"
                }
              >
                <Button
                  size="sm"
                  onClick={() => table.previousPage()}
                  className={`bordered bg-purplee hover:bg-purplee/90 text-black ${
                    currentPage === 1 ? "hidden" : ""
                  }`}
                >
                  <ChevronsLeft />
                </Button>
                {pageNumbers.map((page, index) => (
                  <Button
                    key={index}
                    size={"sm"}
                    onClick={() =>
                      typeof page === "number" && table.setPageIndex(page - 1)
                    }
                    className={`hidden md:flex bordered bg-white hover:bg-white/90 text-black ${
                      currentPage === page ? "bg-greenn hover:bg-greenn/90" : ""
                    }`}
                    disabled={page === "..."}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  size="sm"
                  onClick={() => table.nextPage()}
                  className={`bordered bg-purplee hover:bg-purplee/90 text-black ${
                    currentPage === totalPages ? "hidden" : ""
                  }`}
                >
                  <ChevronsRight />
                </Button>
              </div>
            );
          })()}
        </div>
        {page === "event" ? (
          <>
            <div
              className={`${
                !table.getRowModel().rows?.length
                  ? "hidden"
                  : "flex flex-row gap-2 "
              }`}
            >
              <Button
                className="bordered  rounded-md bg-yelloww hover:bg-yelloww text-black"
                onClick={() => setOpenDownloadDialog(true)}
              >
                <span className="hidden md:block">download all</span>
                <QrCode size={16} />
              </Button>
              <Button
                className="bordered  rounded-md bg-redd hover:bg-redd/90 text-black"
                onClick={() => setOpenDeleteAlert(true)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="hidden md:block">delete all</span>
                    <LoadingCircle />
                  </>
                ) : (
                  <>
                    <span className="hidden md:block">delete all</span>
                    <Trash2 size={16} />
                  </>
                )}
              </Button>
            </div>
            <GeneralDialog
              open={openDownloadDialog}
              setOpen={setOpenDownloadDialog}
              message="Please select the format you want to download."
              title="Download All QR Code"
              onSuccess={handleDownload}
              successText="download"
            >
              <div className="inline-flex flex-row w-full">
                <div className=" bg-purplee bordered-nonhover rounded-lg rounded-r-none text-black flex w-full">
                  <QrCode className="mr-1 md:mr-2 my-auto w-4 md:w-6 " />
                  <span className="my-auto text-xs md:text-sm">
                    {eventName}
                  </span>
                </div>
                <Select onValueChange={(e) => setExtensionSelected(e)}>
                  <SelectTrigger className="text-black bg-purplee bordered border-black rounded-lg rounded-l-none  border-b-4 hover:border-b-1 min-h-12">
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
            <GeneralAlert
              open={openDeleteAlert}
              setOpen={setOpenDeleteAlert}
              title="Are you sure for delete all participants data?"
              message={`This action will permanently remove all participants data from storage. This cannot be undone.`}
              onSuccess={deleteEventHandler}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
