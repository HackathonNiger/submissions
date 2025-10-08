"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  FileText,
  Home,
  Settings,
  Users,
  Shield,
  UserCog,
  ClipboardCheckIcon,
} from "lucide-react";
import { useAdmin } from "@/hooks/use-admin";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const userNavItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "My Causes",
    href: "/dashboard/causes",
    icon: FileText,
  },
  {
    title: "My Petitions",
    href: "/dashboard/petitions",
    icon: FileText,
  },
  {
    title: "My Donations",
    href: "/dashboard/donations",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

// Admin-specific nav items
const adminNavItems = [
  {
    title: "Manage Causes",
    href: "/dashboard/admin/causes",
    icon: FileText,
  },
  {
    title: "Manage Petitions",
    href: "/dashboard/admin/petitions",
    icon: FileText,
  },
  {
    title: "Manage Users",
    href: "/dashboard/admin/users",
    icon: UserCog,
  },
  {
    title: "Analytics",
    href: "/dashboard/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Logs",
    href: "/dashboard/admin/logs",
    icon: ClipboardCheckIcon,
  },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { isAdminOrManager, isLoading } = useAdmin(user?.id);
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <nav className="grid items-start gap-2 py-4">
        {userNavItems.map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
        <div className="my-2">
          {/* <div className="mb-2 px-2 text-xs font-semibold tracking-tight flex items-center">
            <Shield className="mr-1 h-3 w-3" />
            Admin
          </div> */}
          {adminNavItems.map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav className="grid items-start gap-2 py-4">
      {/* Mobile/Tablet hamburger toggle for dashboard nav */}
      <div className="md:hidden flex justify-between items-center mb-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle dashboard menu"
          onClick={() => setOpen(!open)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </Button>
      </div>
      <div className={cn("md:block", open ? "block" : "hidden")}>
        {userNavItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                pathname === item.href ? "bg-secondary hover:bg-secondary" : ""
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Button>
          </Link>
        ))}

        {!isLoading && isAdminOrManager && (
          <>
            <div className="my-2 grid items-start gap-2 ">
              <div className="mb-2 px-2 text-xs font-semibold tracking-tight flex items-center">
                <Shield className="mr-1 h-3 w-3" />
                Admin
              </div>
              {adminNavItems.map((item, index) => (
                <Link key={index} href={item.href}>
                  <Button
                    variant={
                      pathname === item.href ||
                      pathname.startsWith(`${item.href}/`)
                        ? "secondary"
                        : "ghost"
                    }
                    className={cn(
                      "w-full justify-start",
                      pathname === item.href ||
                        pathname.startsWith(`${item.href}/`)
                        ? "bg-secondary hover:bg-secondary"
                        : ""
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Button>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
