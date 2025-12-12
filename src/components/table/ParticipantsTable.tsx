"use client";

import { useMemo } from "react";
import { IParticipantDataTable } from "@/lib/types/Participants";
import { GeneralTable } from "./table";
import EventParticipantColumn from "./columns/EventParticipantColumn";
import { useParticipants } from "@/hooks/useParticipants";
import ParticipantsTableSkeleton from "../skeleton/ParticipantsTableSkeleton";

type Props = {
  token: string;
  eventData: {
    uid: string;
    name: string;
  };
};

export const ParticipantsTable = ({ token, eventData }: Props) => {
  const { participants, isLoading } = useParticipants(token, eventData.uid);

  const participantData = useMemo<IParticipantDataTable[]>(
    () =>
      (participants || []).map((participant) => ({
        ...participant,
        token,
        eventUid: eventData.uid,
        pathQr: participant.qrCodes?.[0]?.pathQr ?? "",
        qrCodeLink: participant.qrCodeLink || "",
        name: participant.name,
        suffix: parseInt(participant.certificateNumber?.slice(-3) || "0"),
        certificateNumber: participant.certificateNumber,
      })),
    [participants, token, eventData.uid],
  );

  if (isLoading) return <ParticipantsTableSkeleton />;
  // Note: Don't block on isError - show empty table with accessible buttons
  // Error is logged but table remains functional
  return (
    <div>
      <GeneralTable
        eventUid={eventData.uid}
        eventName={eventData.name}
        page="event"
        data={participantData}
        columns={EventParticipantColumn}
      />
    </div>
  );
};
