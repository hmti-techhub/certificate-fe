import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

import { Plus_Jakarta_Sans } from "next/font/google";
import { SessionProvider } from "next-auth/react";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="scroll-smooth [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-purplee"
    >
      <body className={`${plusJakarta.variable}  antialiased`}>
        <Toaster
          position="top-right"
          className="toaster"
          toastOptions={{
            style: {
              borderWidth: "1px",
              borderColor: "black",
              borderBottomWidth: "4px",
              borderBottomStyle: "solid",
              backgroundColor: "white",
            },
            duration: 3000,
          }}
        />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
