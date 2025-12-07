import { IEventParticipantCertificate } from "@/lib/types/Event";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  participantCertificateData: IEventParticipantCertificate;
  className?: string;
  logo: "first" | "second";
};
export const TemplateEventLogo = ({
  participantCertificateData,
  className,
  logo,
}: Props) => {
  if (logo === "first") {
    return (
      <div className={cn(className)}>
        {participantCertificateData.logoFirst ? (
          <Image
            src={
              typeof participantCertificateData.logoFirst === "string"
                ? "https://certify.derisdev.cloud" +
                  participantCertificateData.logoFirst
                : URL.createObjectURL(
                    participantCertificateData.logoFirst[0] as Blob,
                  )
            }
            width={50}
            height={50}
            alt="Logo First"
            className={cn("object-contain object-center mx-auto w-full h-full")}
            priority
          />
        ) : (
          <div className="w-[50px] h-[50px] invisible" />
        )}
      </div>
    );
  }
  return (
    <div className={cn(className)}>
      {participantCertificateData.logoSecond ? (
        <Image
          src={
            typeof participantCertificateData.logoSecond === "string"
              ? "https://certify.derisdev.cloud" +
                participantCertificateData.logoSecond
              : URL.createObjectURL(
                  participantCertificateData.logoSecond[0] as Blob,
                )
          }
          width={50}
          height={50}
          alt="Logo Second"
          className={cn("object-contain object-center mx-auto w-full h-full")}
          priority
        />
      ) : (
        <div className="w-[50px] h-[50px] invisible" />
      )}
    </div>
    // <div
    //   className={cn(
    //     mode === "CREATE/EDIT"
    //       ? "w-[35px] h-[35px] md:w-[40px] md:h-[40px]"
    //       : mode === "PREVIEW"
    //       ? "w-[45px] h-[45px] md:w-[70px] md:h-[70px]"
    //       : "w-[50px] h-[50px] md:w-[70px] md:h-[70px]",
    //   )}
    // >
    //   {participantCertificateData.logoFirst ? (
    //     <Image
    //       src={
    //         typeof participantCertificateData.logoFirst === "string"
    //           ? "https://api-certify.hmtiudinus.org" +
    //             participantCertificateData.logoFirst
    //           : URL.createObjectURL(
    //               participantCertificateData.logoFirst[0] as Blob,
    //             )
    //       }
    //       width={50}
    //       height={50}
    //       alt="Logo First"
    //       className={cn("object-contain object-center mx-auto w-full h-full")}
    //       priority
    //     />
    //   ) : (
    //     <div className="w-[50px] h-[50px] invisible" />
    //   )}
    // </div>
  );
};
