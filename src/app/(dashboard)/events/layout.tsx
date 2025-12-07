// @ts-ignore: allow side-effect import of global CSS without explicit type declarations
import "../../globals.css";
import { ParticipantsProvider } from "@/context/ParticipantsContext";

export default async function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ParticipantsProvider>{children}</ParticipantsProvider>;
}
