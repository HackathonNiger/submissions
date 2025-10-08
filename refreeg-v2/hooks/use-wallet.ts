"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getProfile } from "@/actions/profile-actions";

export function useWallet(userId: string | undefined) {
  const supabase = createClient();

  const {
    data: hasWallet,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wallet", userId],
    queryFn: async () => {
      if (!userId) return false;
      const profile = await getProfile(userId);
      return !!profile?.crypto_wallets?.ethereum;
    },
    enabled: !!userId,
  });

  return {
    hasWallet: hasWallet ?? false,
    isLoading,
    error: error as string | null,
  };
}
