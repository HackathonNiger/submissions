"use client";

import { useRouter } from "next/navigation";
import SolanaDonationButton from "./SolanaDonationButton";

interface SolanaDonationButtonWrapperProps {
  causeId: string;
}

export default function SolanaDonationButtonWrapper({
  causeId,
}: SolanaDonationButtonWrapperProps) {
  const router = useRouter();

  const handleDonationSuccess = (amountInNaira: number) => {
    // Refresh the page to update the progress bar and donor count
    router.refresh();
  };

  return (
    <SolanaDonationButton
      causeId={causeId}
      onDonationSuccess={handleDonationSuccess}
    />
  );
}
