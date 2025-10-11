"use client";
import { useState } from "react";
import LoadingCircle from "../animation/LoadingCircle";
import Image from "next/image";

type QRCodeProps = {
  qrCodeSource: string;
  alt: string;
};

export const QRCodeImage = ({ qrCodeSource, alt }: QRCodeProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const src = `https://api-certify.hmtiudinus.org${qrCodeSource}`;

  if (hasError) {
    return <div className="text-purplee text-xs">genereting...</div>;
  }
  return (
    <div className="relative w-[60px] h-[60px] flex items-center justify-center">
      {isLoading && <LoadingCircle />}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="60px"
        className={`object-contain rounded-md transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        loading="lazy"
      />
    </div>
  );
};
