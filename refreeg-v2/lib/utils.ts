import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getBaseURL(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}
export const calculateServiceFee = (amount: number): number => {
  const serviceFeePercentage = Number(
    process.env.NEXT_PUBLIC_REFREEG_SERVICE_FEE || "0"
  );
  return Math.round(amount * (serviceFeePercentage / 100) || 0);
};
