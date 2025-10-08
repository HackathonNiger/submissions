"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProfile, updateProfile, updateBankDetails, updateProfilePhoto } from "@/actions/profile-actions"
import type { Profile, ProfileFormData, BankDetailsFormData } from "@/types"
import { toast } from "@/components/ui/use-toast"

export function useProfile(userId: string | undefined) {
  const queryClient = useQueryClient()

  // Query for fetching profile data
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfile(userId!),
    enabled: !!userId,
  })

  // Mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: (profileData: ProfileFormData) => updateProfile(userId!, profileData),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["profile", userId], updatedProfile)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // Mutation for updating profile photo
  const updateProfilePhotoMutation = useMutation({
    mutationFn: (file: File) => updateProfilePhoto(userId!, file),
    onSuccess: (photoUrl) => {
      queryClient.setQueryData(["profile", userId], (old: Profile | undefined) =>
        old ? { ...old, profile_photo: photoUrl } : undefined
      )
      toast({
        title: "Profile photo updated",
        description: "Your profile photo has been updated successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error updating profile photo",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // Mutation for updating bank details
  const updateBankDetailsMutation = useMutation({
    mutationFn: (bankData: BankDetailsFormData) => updateBankDetails(userId!, bankData),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["profile", userId], updatedProfile)
      toast({
        title: "Bank details updated",
        description: "Your bank details have been updated successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error updating bank details",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  return {
    profile,
    isLoading,
    isUploading: updateProfilePhotoMutation.isPending,
    error: error as string | null,
    updateProfile: updateProfileMutation.mutate,
    updateProfilePhoto: updateProfilePhotoMutation.mutate,
    updateBankDetails: updateBankDetailsMutation.mutate,
    hasBankDetails: profile ? !!(profile.account_number && profile.bank_name) : false,
  }
}

