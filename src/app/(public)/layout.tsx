import "../globals.css";
import { Suspense } from "react";
import { getSession } from "@/lib/get-session";
import LandingPageNavbar from "@/components/LandingPageNavbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Public Layout Header with cached session
 * Wrapped in Suspense for non-blocking render
 */
async function PublicHeader() {
  const session = await getSession();
  return <LandingPageNavbar session={session!} />;
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen">
      <header>
        <Suspense
          fallback={
            <div className="w-full py-4 bg-white px-4 md:px-20 lg:px-40">
              <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          }
        >
          <PublicHeader />
        </Suspense>
      </header>
      <main>{children}</main>
      <Footer />
    </div>
  );
}
