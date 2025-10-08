"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPetition, updatePetition } from "@/actions/petition-actions"
import type { PetitionFormData } from "@/types"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export function usePetition() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: ({ userId, petitionData }: { userId: string; petitionData: PetitionFormData }) =>
      createPetition(userId, petitionData),
    onSuccess: () => {
      toast({
        title: "Petition created successfully",
        description: "Your petition has been submitted for approval.",
      })
      queryClient.invalidateQueries({ queryKey: ["petitions"] })
      router.push("/dashboard/petitions")
    },
    onError: (error: any) => {
      toast({
        title: "Error creating petition",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ petitionId, userId, petitionData }: { petitionId: string; userId: string; petitionData: Partial<PetitionFormData> }) =>
      updatePetition(petitionId, userId, petitionData),
    onSuccess: () => {
      toast({
        title: "Petition updated successfully",
        description: "Your petition has been updated.",
      })
      queryClient.invalidateQueries({ queryKey: ["petitions"] })
      router.push(`/dashboard/petitions`)
    },
    onError: (error: any) => {
      toast({
        title: "Error updating petition",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const createUserPetition = async (userId: string, petitionData: PetitionFormData) => {
    return createMutation.mutateAsync({ userId, petitionData })
  }

  const updateUserPetition = async (petitionId: string, userId: string, petitionData: Partial<PetitionFormData>) => {
    return updateMutation.mutateAsync({ petitionId, userId, petitionData })
  }

  return {
    isLoading: createMutation.isPending || updateMutation.isPending,
    createPetition: createUserPetition,
    updatePetition: updateUserPetition,
  }
}

