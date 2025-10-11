import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  stakeholderData: {
    name: string;
    photoPath: string | null;
    position: string;
  };
  classNameNoPhotoPath?: string;
  classNamePhotoPath?: string;
};
export const TemplateStakeholderImage = ({
  stakeholderData,
  classNameNoPhotoPath,
  classNamePhotoPath,
}: Props) => {
  return (
    <>
      {stakeholderData.photoPath === null || undefined ? (
        <div
          className={cn(
            "flex items-center justify-center  text-gray-500 font-bold rounded-full bg-transparent",
            classNameNoPhotoPath,
          )}
        ></div>
      ) : (
        <Image
          src={
            "https://api-certify.hmtiudinus.org" +
            stakeholderData.photoPath
          }
          width={108}
          height={108}
          className={cn(
            "flex items-center justify-center object-cover object-center rounded-full m-auto",
            classNamePhotoPath,
          )}
          alt={stakeholderData.name.slice(0, 2)}
        />
      )}
    </>
  );
};
