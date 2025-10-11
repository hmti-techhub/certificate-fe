"use client";

import { FormatDate } from "@/lib/functions";
import { IEventParticipantCertificate } from "@/lib/types/Event";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { TemplateHeader } from "./components/TemplateHeader";
import { TemplateCertificateNumber } from "./components/TemplateCertificateNumber";
import { TemplateEventLogo } from "./components/TemplateEventLogo";
import { TemplateContent } from "./components/TemplateContent";
import { TemplateStakeholderImage } from "./components/TemplateStakeholderImage";
import { TemplateStakeholderName } from "./components/TemplateStakeholderName";
import { TemplateEventName } from "./components/TemplateEventName";
import { TemplateEventTheme } from "./components/TemplateEventTheme";
import { TemplateFooter } from "./components/TemplateFooter";

type Props = {
  participantCertificateData?: IEventParticipantCertificate;
  mode: "CREATE/EDIT" | "PREVIEW" | "VIEW";
};

export const TechnologyDesign2Template = ({
  participantCertificateData,
  mode,
}: Props) => {
  const [stakeholderData] = useState<
    | {
        name: string;
        photoPath: string | null;
        position: string;
      }
    | undefined
  >(
    participantCertificateData
      ? {
          name: participantCertificateData.stakeholders.name,
          photoPath: participantCertificateData.stakeholders.photoPath,
          position: participantCertificateData.stakeholders.position,
        }
      : undefined,
  );

  if (!participantCertificateData || !stakeholderData) {
    return (
      <div className="flex items-center justify-center w-full h-full p-4 text-gray-500 font-bold rounded-lg bg-transparent">
        <span>Certificate data not available</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        mode === "CREATE/EDIT"
          ? "w-[280px] h-[400px] md:w-[300px] md:h-[450px]"
          : mode === "PREVIEW"
          ? "w-[300px] h-[450px] md:w-[500px] md:h-[750px]"
          : "w-[350px] h-[500px] md:w-[490px] md:h-[700px]",
      )}
    >
      <div className="relative mx-auto overflow-hidden flex flex-col items-center justify-center w-full h-full">
        {/* BACKGROUND IMAGE */}
        <Image
          src={`/template/${
            participantCertificateData.eventTemplate || "default"
          }.png`}
          alt="Event Template"
          width={465}
          height={465}
          className={cn(
            "object-center",
            "object-cover",
            "mx-auto",
            "w-full h-full",
          )}
          priority
        />
        <div
          className={cn(
            "absolute inset-0 flex flex-col justify-center",
            mode === "CREATE/EDIT"
              ? "py-2 md:py-2 px-8 md:px-8"
              : mode === "PREVIEW"
              ? "py-2 md:py-3 px-8 md:px-13"
              : "py-2 md:py-3 px-10 md:px-14",
          )}
        >
          {/* HEADER */}
          <TemplateHeader
            className={
              mode === "CREATE/EDIT"
                ? participantCertificateData.logoFirst ||
                  participantCertificateData.logoSecond
                  ? stakeholderData.photoPath
                    ? "mb-11 md:mb-12"
                    : "mb-0 md:mb-11"
                  : stakeholderData.photoPath
                  ? "mb-[45px] md:mb-12"
                  : "mb-9 md:mb-11"
                : mode === "PREVIEW"
                ? participantCertificateData.logoFirst ||
                  participantCertificateData.logoSecond
                  ? stakeholderData.photoPath
                    ? "mb-12 md:mb-24"
                    : "mb-11 md:mb-21"
                  : stakeholderData.photoPath
                  ? "mb-12 md:mb-24"
                  : "mb-11 md:mb-21"
                : participantCertificateData.logoFirst ||
                  participantCertificateData.logoSecond
                ? stakeholderData.photoPath
                  ? "mb-13 md:mb-20"
                  : "mb-12 md:mb-21"
                : stakeholderData.photoPath
                ? "mb-12 md:mb-12"
                : "mb-12 md:mb-21"
            }
          >
            <TemplateCertificateNumber
              participantCertificateData={participantCertificateData}
              mode={mode}
              className={cn(
                mode === "CREATE/EDIT"
                  ? "text-[6px] md:text-[7px]"
                  : mode === "PREVIEW"
                  ? "text-[7px] md:text-[11px]"
                  : "text-[9px] md:text-xs",
                "font-light md:font-medium font-ramaraja uppercase",
                "text-white",
                "tracking-widest",
              )}
            />
            <div className="flex flex-row justify-between items-center w-full">
              <TemplateEventLogo
                participantCertificateData={participantCertificateData}
                className={
                  mode === "CREATE/EDIT"
                    ? "w-[35px] h-[35px] md:w-[45px] md:h-[45px]"
                    : mode === "PREVIEW"
                    ? "w-[45px] h-[45px] md:w-[70px] md:h-[70px]"
                    : "w-[50px] h-[50px] md:w-[70px] md:h-[70px]"
                }
                logo="first"
              />
              <TemplateEventLogo
                participantCertificateData={participantCertificateData}
                className={
                  mode === "CREATE/EDIT"
                    ? "w-[35px] h-[35px] md:w-[45px] md:h-[45px]"
                    : mode === "PREVIEW"
                    ? "w-[45px] h-[45px] md:w-[70px] md:h-[70px]"
                    : "w-[50px] h-[50px] md:w-[70px] md:h-[70px]"
                }
                logo="second"
              />
            </div>
          </TemplateHeader>
          {/* END HEADER */}

          {/* CONTENT */}
          <TemplateContent
            className={
              mode === "CREATE/EDIT"
                ? "space-y-3"
                : mode === "PREVIEW"
                ? "space-y-2 md:space-y-5"
                : "space-y-2 md:space-y-6"
            }
          >
            {/* STAKEHOLDER IMAGE */}
            <TemplateStakeholderImage
              stakeholderData={stakeholderData}
              classNameNoPhotoPath={
                mode === "CREATE/EDIT"
                  ? "w-21 h-21 md:w-20 md:h-20"
                  : mode === "PREVIEW"
                  ? "w-21 h-21 md:w-34 md:h-34"
                  : "w-22 h-22 md:w-27 md:h-27"
              }
              classNamePhotoPath={
                mode === "CREATE/EDIT"
                  ? "w-16 h-16 md:w-18 md:h-18"
                  : mode === "PREVIEW"
                  ? "w-18 h-18 md:w-29 md:h-29"
                  : "w-20 h-20 md:w-28 md:h-28"
              }
            />
            {/* END STAKEHOLDER IMAGE */}
            {/* STAKEHOLDER DATA */}
            <div
              className={cn(
                "flex flex-col items-center space-y-2",
                stakeholderData.photoPath === null
                  ? mode === "CREATE/EDIT"
                    ? stakeholderData.photoPath
                      ? "mt-8 md:mt-9"
                      : "mt-2 md:mt-5"
                    : mode === "PREVIEW"
                    ? "mt-6 md:mt-10"
                    : "mt-8 md:mt-9"
                  : mode === "CREATE/EDIT"
                  ? "mt-8 md:mt-9"
                  : mode === "PREVIEW"
                  ? "mt-10 md:mt-17"
                  : "mt-11 md:mt-15",
              )}
            >
              {/* STAKEHOLDER NAME */}
              <TemplateStakeholderName
                stakeholderData={stakeholderData}
                className={cn(
                  mode === "CREATE/EDIT"
                    ? "text-[10px] md:text-xs"
                    : mode === "PREVIEW"
                    ? "text-xs md:text-lg"
                    : "text-sm md:text-xl",
                  "text-white font-roboto-condensed font-bold",
                )}
              />
              {/* END STAKEHOLDER NAME */}
              <span
                className={cn(
                  "font-light font-roboto-condensed",
                  "text-gray-300",
                  mode === "CREATE/EDIT"
                    ? "text-[9px] md:text-[7px]"
                    : mode === "PREVIEW"
                    ? "text-[9px] md:text-[12px]"
                    : "text-[9px] md:text-xs",
                  "tracking-widest",
                )}
              >
                PENANDATANGAN
              </span>
            </div>
            {/* END STAKEHOLDER DATA */}
            {/* EVENT DATA */}
            <div className="flex flex-col items-center space-y-2">
              <span
                className={cn(
                  "font-light font-roboto-condensed tracking-wider",
                  "text-white",
                  mode === "CREATE/EDIT"
                    ? "text-[9px] md:text-xs"
                    : mode === "PREVIEW"
                    ? "text-[9px] md:text-[18px]"
                    : "text-xs md:text-[18px]",
                )}
              >
                Dalam Kegiatan
              </span>
              {/* EVENT NAME */}
              <TemplateEventName
                participantCertificateData={participantCertificateData}
                className={cn(
                  mode === "CREATE/EDIT"
                    ? "text-xs md:text-sm"
                    : mode === "PREVIEW"
                    ? "text-sm md:text-2xl"
                    : "text-lg md:text-2xl",
                  "text-[#74b5d8] font-roboto-condensed font-bold tracking-wider",
                )}
              />
              {/* END EVENT NAME */}
              {/* EVENT THEME */}
              <TemplateEventTheme
                participantCertificateData={participantCertificateData}
                className={cn(
                  mode === "CREATE/EDIT"
                    ? "text-[9px] md:text-[9px]"
                    : mode === "PREVIEW"
                    ? "text-[9px] md:text-[13px]"
                    : "text-[9px] md:text-xs",
                  "tracking-widest",
                )}
              />
              {/* END EVENT THEME */}
            </div>
            {/* END EVENT DATA */}
          </TemplateContent>
          {/* END CONTENT */}

          {/* FOOTER */}
          <TemplateFooter
            className={cn(
              mode === "CREATE/EDIT"
                ? "text-[6px] md:text-[8px] mb-1"
                : mode === "PREVIEW"
                ? "text-[7px] md:text-xs mb-1 md:mb-2"
                : "text-[9px] md:text-xs mb-1 md:mb-2",
            )}
          >
            <span>Diselenggarakan oleh : </span>
            <span className="text-center">
              {participantCertificateData.organizer}
            </span>
            <span className="text-center">
              Pada Tanggal{" "}
              {participantCertificateData.activityAt
                ? FormatDate({
                    children: participantCertificateData.activityAt,
                    withDay: false,
                  })
                : "Date not available"}
            </span>
          </TemplateFooter>
          {/* END FOOTER */}
        </div>
      </div>
    </div>
  );
};
