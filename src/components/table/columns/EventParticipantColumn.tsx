"use client";

import { ColumnDef } from "@tanstack/react-table";

//ICONS
import { IParticipantDataTable } from "@/lib/types/Participants";
import { ParticipantActionOption } from "@/components/options/ParticipantActionOption";
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
    accessorKey: "pathQr",
    header: () => {
      return <div className="text-center text-xs md:text-sm">QR Code</div>;
    },
    cell: ({ row }) => {
      const data = row.original;
      return <h1>test</h1>;
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
