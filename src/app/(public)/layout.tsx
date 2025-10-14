import "../globals.css";
import { auth } from "@/auth";
import LandingPageNavbar from "@/components/LandingPageNavbar";
import Footer from "@/components/Footer";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="w-full min-h-screen">
      <header>
        <LandingPageNavbar session={session!} />
      </header>
      <main>{children}</main>
      <Footer />
    </div>
  );
}
