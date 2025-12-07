import { FormatDate } from "@/lib/functions";
import { IEventData } from "@/lib/types/Event";
import Image from "next/image";

type Props = {
  eventData: IEventData;
};
export const FormalDesign1 = ({ eventData }: Props) => {
  return (
    <div
      className="relative max-w-[400px] h-[500px] md:max-w-[600px] md:min-h-screen aspect-[3/4] bg-cover bg-center mx-auto "
      style={{ backgroundImage: `url(/template/FORMALDESIGN_1.png)` }}
    >
      <div className="absolute inset-0 flex items-start justify-start mt-[10.3%] ml-[38%]">
        <div className="text-left text-black font-light text-xs md:text-sm">
          {eventData.prefixCode}000
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-black font-bold text-5xl">
          {eventData.stakeholders![0].name}
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center -mt-[41.5%]">
        <Image
          src={
            ("https://certify.derisdev.cloud" +
              eventData.stakeholders![0].photoPath) as string
          }
          alt="Logo"
          width={100}
          height={100}
          className="w-[90px] h-auto md:w-[123px] md:h-auto object-cover rounded-full "
        />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center mt-[45%] gap-2">
        <div className="text-center text-[#5aa6ce] font-bold text-2xl">
          {eventData.eventName}
        </div>
        <div className="text-center text-black font-medium text-lg">
          {eventData.eventTheme}
        </div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center mt-[100%] gap-6">
        <div className="text-center text-black font-medium text-sm">
          {eventData.organizer}
        </div>
        <div className="text-center text-black font-medium text-sm">
          Pada Tanggal{" "}
          {FormatDate({ children: eventData.activityAt, withDay: true })}
        </div>
        <div className="text-center text-black font-medium text-sm">
          {eventData.description}
        </div>
      </div>
    </div>
  );
};
