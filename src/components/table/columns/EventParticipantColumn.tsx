"use client";

import { ColumnDef } from "@tanstack/react-table";

//COMPONENTS
import { IParticipantDataTable } from "@/lib/types/Participants";
import { ParticipantActionOption } from "@/components/options/ParticipantActionOption";
import { QRCodeDisplay } from "@/components/ui/QRCodeDisplay";

const EventParticipantColumn: ColumnDef<IParticipantDataTable>[] = [
  {
    id: "id",
    header: () => {
      return <div className="text-center text-xs md:text-sm">No</div>;
    },
    cell: ({ row }) => {
      return <div className="text-center text-sm ">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "name",
    header: () => {
      return <div className="text-center text-xs md:text-sm">Name</div>;
    },
    cell: ({ row }) => {
      const data = row.original;
      const { certificateNumber } = data;
      return (
        <div className="text-center text-xs md:text-sm flex flex-col items-start">
          <h1 className="text-sm">{row.getValue("name")}</h1>
          <p className="text-[10px] md:text-xs">{certificateNumber}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "suffix",
    header: "Suffix",
    enableHiding: true,
  },
  {
    accessorKey: "qrCodeLink",
    header: () => {
      return <div className="text-center text-xs md:text-sm">QR Code</div>;
    },
    cell: ({ row }) => {
      const data = row.original;
      const qrCodeLink = data.qrCodeLink;

      return (
        <div className="flex justify-center">
          {qrCodeLink ? (
            <a
              href={qrCodeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              title="Click to view certificate"
            >
              <QRCodeDisplay value={qrCodeLink} size={64} />
            </a>
          ) : (
            <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded text-xs text-gray-400">
              No QR
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => {
      return <div className="text-center text-xs md:text-sm">Actions</div>;
    },
    cell: ({ row }) => {
      const data = row.original;
      return <ParticipantActionOption data={data} eventUid={data.eventUid} />;
    },
  },
];

export default EventParticipantColumn;
