import { getEventByEventId } from "@/actions/mutation/events/getEventByEventId";
import { FormalDesign1Template } from "@/components/template/FormalDesign1Template";
import { FormalDesign2Template } from "@/components/template/FormalDesign2Template";
import { FormalDesign3Template } from "@/components/template/FormalDesign3Template";
import { TechnologyDesign1Template } from "@/components/template/TechnologyDesign1Template";
import { TechnologyDesign2Template } from "@/components/template/TechnologyDesign2Template";
import { TechnologyDesign3Template } from "@/components/template/TechnologyDesign3Template";
import { IEventParticipantCertificate } from "@/lib/types/Event";
import { TriangleAlert } from "lucide-react";

type Props = {
  params: Promise<{
    eventUid: string;
  }>;
};
const PreviewPage = async ({ params }: Props) => {
  const { eventUid } = await params;
  const eventData = await getEventByEventId(eventUid);
  if (!eventData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="inline-flex items-center font-bold text-2xl ">
          <TriangleAlert className="mr-1" /> Event UID Not Valid
        </h1>
        <p className="mt-4 text-lg text-grayy font-medium">
          The event you are looking for does not exist.
        </p>
      </div>
    );
  }
  const participantCertificateData: IEventParticipantCertificate = {
    eventName: eventData.eventName,
    eventDescription: eventData.description,
    activityAt: eventData.activityAt,
    eventTemplate: eventData.eventTemplate,
    eventTheme: eventData.eventTheme,
    organizer: eventData.organizer,
    logoFirst: eventData.logoFirstPath,
    logoSecond: eventData.logoSecondPath,
    name: null,
    email: null,
    position: null,
    addedAt: null,
    certificateNumber: `${eventData.prefixCode}${eventData.suffixCode}`,
    stakeholders: {
      name: eventData.stakeholders![0].name,
      position: eventData.stakeholders![0].position,
      photoPath: eventData.stakeholders![0].photoPath,
    },
    qrCodes: null,
  };

  return (
    <>
      {eventData.eventTemplate === "DEFAULTDESIGN" ? (
        "DEFAULT DESIGN"
      ) : eventData.eventTemplate === "FORMALDESIGN_1" ? (
        <div className="flex flex-col items-center justify-center">
          <FormalDesign1Template
            mode="PREVIEW"
            participantCertificateData={participantCertificateData}
          />
        </div>
      ) : eventData.eventTemplate === "FORMALDESIGN_2" ? (
        <div className="flex flex-col items-center justify-center">
          <FormalDesign2Template
            mode="PREVIEW"
            participantCertificateData={participantCertificateData}
          />
        </div>
      ) : eventData.eventTemplate === "FORMALDESIGN_3" ? (
        <div className="flex flex-col items-center justify-center">
          <FormalDesign3Template
            mode="PREVIEW"
            participantCertificateData={participantCertificateData}
          />
        </div>
      ) : eventData.eventTemplate === "TECHNOLOGYDESIGN_1" ? (
        <div className="flex flex-col items-center justify-center">
          <TechnologyDesign1Template
            mode="PREVIEW"
            participantCertificateData={participantCertificateData}
          />
        </div>
      ) : eventData.eventTemplate === "TECHNOLOGYDESIGN_2" ? (
        <div className="flex flex-col items-center justify-center">
          <TechnologyDesign2Template
            mode="PREVIEW"
            participantCertificateData={participantCertificateData}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <TechnologyDesign3Template
            mode="PREVIEW"
            participantCertificateData={participantCertificateData}
          />
        </div>
      )}
    </>
  );
};

export default PreviewPage;
