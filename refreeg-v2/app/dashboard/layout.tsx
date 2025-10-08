import type React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return <ClientLayoutWrapper>{children}</ClientLayoutWrapper>;
}
