import "../globals.css";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import { getSession } from "@/lib/get-session";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Dashboard Header Component with cached session
 * Wrapped in Suspense for non-blocking render
 */
async function DashboardHeader() {
  const session = await getSession();
  return <Navbar clickable session={session!} />;
}

/**
 * Dashboard Layout with Suspense boundary
 * This prevents blocking the entire page while loading session
 */
export default function DashboardLayout({
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
                <Skeleton className="h-12 w-48" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          }
        >
          <DashboardHeader />
        </Suspense>
      </header>
      <div className="px-4 md:px-20 lg:px-40">
        <main>{children}</main>
      </div>
    </div>
  );
}
