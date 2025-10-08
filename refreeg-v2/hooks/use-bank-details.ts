"use client"

import { useQuery } from "@tanstack/react-query"
import { hasBankDetails } from "@/actions/profile-actions"

export function useBankDetails(userId: string | undefined) {
  const query = useQuery({
    queryKey: ["bankDetails", userId],
    queryFn: () => hasBankDetails(userId!),
    enabled: !!userId,
  })

  return {
    hasBankDetails: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
  }
}

