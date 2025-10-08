"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hasKycVerification, updateKycStatus } from "@/actions/profile-actions";
import { toast } from "@/components/ui/use-toast";
import { KycVerification, KycStatus } from "@/types/kyc-types";

export function useKyc(userId: string | undefined) {
  const queryClient = useQueryClient();

  // Fetch KYC verification record
  const {
    data: kycVerification,
    isLoading,
    error,
  } = useQuery<KycVerification | null>({
    queryKey: ["kyc", userId],
    queryFn: () => hasKycVerification(userId!),
    enabled: !!userId,
  });

  // Update KYC status
  const updateKycMutation = useMutation({
    mutationFn: ({
      verificationId,
      status,
      notes,
    }: {
      verificationId: string;
      status: KycStatus; // "approved" | "rejected"
      notes?: string;
    }) => updateKycStatus(verificationId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kyc", userId] });
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      toast({
        title: "KYC status updated",
        description:
          "The KYC verification status has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating KYC status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    kycVerification, // full record: id, status, notes, timestamps, etc.
    isVerified: kycVerification?.status === "approved",
    isLoading,
    error: error as string | null,
    updateKycStatus: updateKycMutation.mutate,
  };
}
