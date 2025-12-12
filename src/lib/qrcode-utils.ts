import QRCode from "qrcode";

export interface QRCodeDownloadOptions {
  format: "png" | "jpeg" | "jpg" | "webp";
  size?: number;
  margin?: number;
}

/**
 * Generate QR code as data URL from a URL string
 */
export async function generateQRCodeDataURL(
  value: string,
  options: QRCodeDownloadOptions,
): Promise<string> {
  const { size = 300, margin = 2 } = options;

  return await QRCode.toDataURL(value, {
    width: size,
    margin: margin,
    errorCorrectionLevel: "M",
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });
}

/**
 * Download a single QR code as an image file
 */
export async function downloadQRCode(
  value: string,
  filename: string,
  options: QRCodeDownloadOptions,
): Promise<void> {
  const { format, size = 300, margin = 2 } = options;

  // Generate QR code as data URL
  const dataUrl = await generateQRCodeDataURL(value, { format, size, margin });

  // Convert data URL to blob for proper file download
  const response = await fetch(dataUrl);
  const blob = await response.blob();

  // Create appropriate mime type based on format
  const mimeType =
    format === "jpg"
      ? "image/jpeg"
      : format === "jpeg"
      ? "image/jpeg"
      : `image/${format}`;

  // Create blob with correct mime type
  const convertedBlob = new Blob([blob], { type: mimeType });

  // Create download link
  const url = URL.createObjectURL(convertedBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Cleanup
  URL.revokeObjectURL(url);
}

/**
 * Download multiple QR codes as a zip file
 */
export async function downloadAllQRCodes(
  participants: Array<{ name: string; qrCodeLink: string }>,
  eventName: string,
  options: QRCodeDownloadOptions,
): Promise<void> {
  const { format, size = 300, margin = 2 } = options;

  // Dynamically import JSZip for code splitting
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  // Generate QR codes for all participants
  const promises = participants.map(async (participant, index) => {
    if (!participant.qrCodeLink) return;

    try {
      const dataUrl = await generateQRCodeDataURL(participant.qrCodeLink, {
        format,
        size,
        margin,
      });

      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      // Add to zip with sanitized filename
      const safeName = participant.name.replace(/[^a-zA-Z0-9]/g, "_");
      const filename = `${String(index + 1).padStart(
        3,
        "0",
      )}_${safeName}.${format}`;
      zip.file(filename, blob);
    } catch (error) {
      console.error(`Error generating QR for ${participant.name}:`, error);
    }
  });

  await Promise.all(promises);

  // Generate zip file
  const zipBlob = await zip.generateAsync({ type: "blob" });

  // Download zip
  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${eventName.replace(/[^a-zA-Z0-9]/g, "_")}_QRCodes.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Cleanup
  URL.revokeObjectURL(url);
}
