"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DonateButtonProps {
  type?: "cause" | "petition"; // optional override
  id?: string; // optional ID
  href?: string; // optional direct href
  fullWidth?: boolean;
  onClick?: () => void; // fallback for modal usage
  disableLink?: boolean; // ✅ prevent nested <a>
}

export function DonateButton({
  type,
  id,
  href,
  fullWidth = true,
  onClick,
  disableLink = false,
}: DonateButtonProps) {
  const pathname = usePathname();

  // Auto-detect type if not passed
  const detectedType: "cause" | "petition" | null =
    type ||
    (pathname.includes("/causes")
      ? "cause"
      : pathname.includes("/petitions")
      ? "petition"
      : null);

  if (!detectedType && !href) {
    console.warn(
      "DonateButton: Could not detect type from pathname. Provide 'type' or 'href'."
    );
    return null;
  }

  // Auto-detect id
  const detectedId = id || pathname.split("/").filter(Boolean).pop();

  // Final href
  const finalHref =
    href ||
    (detectedId
      ? `/${detectedType}s/${detectedId}/donate`
      : `/${detectedType}s/donate`);

  const button = (
    <Button
      className={`${
        fullWidth ? "w-full" : ""
      } bg-white hover:text-white border border-blue-900 text-blue-900`}
      variant="default"
      size="default"
      onClick={onClick}
    >
      {detectedType === "cause" ? "Donate" : "Sign Now"}
    </Button>
  );

  // ✅ Prevent nested <a>
  if (disableLink) return button;

  return href || finalHref ? <Link href={finalHref}>{button}</Link> : button;
}
