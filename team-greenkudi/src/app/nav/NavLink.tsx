"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/navigation";

interface NavLinkProps {
  item: NavItem;
  variant?: "desktop" | "mobile";
}

export function NavLink({ item, variant = "desktop" }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  if (variant === "mobile") {
    return (
      <Link
        href={item.href}
        className={`nav-link-mobile ${isActive ? "nav-link-mobile-active" : ""}`}
        aria-current={isActive ? "page" : undefined}
      >
        <span className="text-lg" role="img" aria-hidden="true">
          {item.icon}
        </span>
        <span className="text-xs font-medium">
          {item.shortLabel || item.label}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      className={`nav-link ${isActive ? "nav-link-active" : ""}`}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="text-lg" role="img" aria-hidden="true">
        {item.icon}
      </span>
      <div className="flex flex-col">
        <span className="font-medium">
          {item.label}
        </span>
        {item.description && (
          <span className="text-xs text-[--text-muted]">
            {item.description}
          </span>
        )}
      </div>
    </Link>
  );
}