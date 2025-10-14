import "../globals.css";
import Navbar from "@/components/Navbar";
import { auth } from "@/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <div className="w-full min-h-screen">
      <header>
        <Navbar clickable session={session!} />
      </header>
      <div className="px-4 md:px-20 lg:px-40">
        <main>{children}</main>
      </div>
    </div>
  );
}
