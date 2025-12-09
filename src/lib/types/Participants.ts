export interface IParticipantResponse<
  T = IParticipantData[] | IParticipantAdd | null,
> {
  success: boolean;
  status: number;
  message: string;
  data: T | null;
}

export interface IParticipantData {
  uid: string;
  name: string;
  email: string;
  position: string;
  addedAt: string;
  certificateNumber: string;
  qrCodes?: {
    pathQr: string;
    generatedAt: string;
  }[];
}

export interface IParticipantAdd {
  count: number;
  participants: {
    uid: string;
    eventId: string;
    email: string;
    name: string;
    position: string;
    addedAt: string;
    certificateNumber: string;
  }[];
}

export interface IParticipantDataTable {
  token: string;
  eventUid: string;
  uid: string;
  name: string;
  certificateNumber: string;
  suffix: number;
  pathQr: string;
  email?: string;
  position?: string;
}
