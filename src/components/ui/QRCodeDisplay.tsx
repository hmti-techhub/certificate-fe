"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
}

/**
 * Generates and displays a QR code from a URL string
 * Uses the 'qrcode' library to generate consistent QR codes
 */
export function QRCodeDisplay({
  value,
  size = 80,
  className = "",
}: QRCodeDisplayProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!value) {
      setError(true);
      return;
    }

    // Generate QR code as data URL
    QRCode.toDataURL(value, {
      width: size,
      margin: 1,
      errorCorrectionLevel: "M",
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })
      .then((url) => {
        setQrDataUrl(url);
        setError(false);
      })
      .catch((err) => {
        console.error("Error generating QR code:", err);
        setError(true);
      });
  }, [value, size]);

  if (error || !qrDataUrl) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 rounded ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-gray-400">No QR</span>
      </div>
    );
  }

  return (
    <Image
      src={qrDataUrl}
      alt="QR Code"
      width={size}
      height={size}
      className={`rounded ${className}`}
      unoptimized // Data URLs don't need optimization
    />
  );
}
