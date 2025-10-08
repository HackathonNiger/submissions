"use client";

import { usePathname } from "next/navigation";
import { DashboardNav } from "@/components/dashboard-nav";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNav = pathname.startsWith("/dashboard/settings/kyc-setup");

  return (
    <div className="flex min-h-screen flex-col">
      {hideNav ? (
        <div className="flex-1 flex flex-col w-full">
          <main className="flex w-full flex-col overflow-hidden py-6">
            {children}
          </main>
        </div>
      ) : (
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
            <DashboardNav />
          </aside>
          <main className="flex w-full flex-col overflow-hidden py-6">
            {children}
          </main>
        </div>
      )}
    </div>
  );
}
