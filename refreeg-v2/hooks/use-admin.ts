"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserRoleInfo,
  setUserRole,
  listUsersWithRoles,
} from "@/actions/role-actions";
import { blockUser, unblockUser } from "@/actions/user-actions";
import {
  updateCauseStatus,
  listCauses,
  getCauseEdits,
} from "@/actions/cause-actions";
import {
  updatePetitionStatus,
  listPetitions,
  getPetitionEdits,
} from "@/actions/petition-actions";
import { logAdminActivity } from "@/actions/database-actions";
import { toast } from "@/components/ui/use-toast";
import type { CauseStatus, UserRole, UserWithRole } from "@/types";

export function useAdmin(userId: string | undefined, status?: CauseStatus) {
  const queryClient = useQueryClient();

  const {
    data: roleInfo,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userRole", userId],
    queryFn: () => (userId ? getUserRoleInfo(userId) : null),
    enabled: !!userId,
  });

  const isAdminUser = roleInfo?.isAdmin ?? false;
  const isManagerUser = roleInfo?.isManager ?? false;
  const userRole = roleInfo?.role ?? "user";

  const appointManagerMutation = useMutation({
    mutationFn: (targetUserId: string) => setUserRole(targetUserId, "manager"),
    onSuccess: (_, targetUserId) => {
      logAdminActivity("appoint-manager", userId!);
      queryClient.invalidateQueries({ queryKey: ["userRole", targetUserId] });
      toast({
        title: "Manager appointed",
        description: "User has been appointed as a manager",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error appointing manager",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeManagerMutation = useMutation({
    mutationFn: (targetUserId: string) => setUserRole(targetUserId, "user"),
    onSuccess: (_, targetUserId) => {
      logAdminActivity("remove-manager", userId!);
      queryClient.invalidateQueries({ queryKey: ["userRole", targetUserId] });
      toast({
        title: "Manager removed",
        description: "User's manager role has been removed",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error removing manager",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const blockUserMutation = useMutation({
    mutationFn: blockUser,
    onSuccess: () => {
      logAdminActivity("block-user", userId!);
      toast({
        title: "User blocked",
        description: "User has been blocked successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error blocking user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const unblockUserMutation = useMutation({
    mutationFn: unblockUser,
    onSuccess: () => {
      logAdminActivity("unblock-user", userId!);
      toast({
        title: "User unblocked",
        description: "User has been unblocked successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error unblocking user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const approveCauseMutation = useMutation({
    mutationFn: async (causeId: string) => {
      await updateCauseStatus(causeId, "approved");
      return true;
    },
    onSuccess: () => {
      logAdminActivity("approve-cause", userId!);
      toast({
        title: "Cause approved",
        description: "The cause has been approved successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error approving cause",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const rejectCauseMutation = useMutation({
    mutationFn: async ({
      causeId,
      reason,
    }: {
      causeId: string;
      reason: string;
    }) => {
      await updateCauseStatus(causeId, "rejected", reason);
      return true;
    },
    onSuccess: () => {
      logAdminActivity("reject-cause", userId!);
      toast({
        title: "Cause rejected",
        description: "The cause has been rejected",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error rejecting cause",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const approvePetitionMutation = useMutation({
    mutationFn: async (petitionId: string) => {
      await updatePetitionStatus(petitionId, "approved");
      return true;
    },
    onSuccess: () => {
      logAdminActivity("approve-petition", userId!);
      toast({
        title: "Petition approved",
        description: "The petition has been approved successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error approving petition",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const rejectPetitionMutation = useMutation({
    mutationFn: async ({
      petitionId,
      reason,
    }: {
      petitionId: string;
      reason: string;
    }) => {
      await updatePetitionStatus(petitionId, "rejected", reason);
      return true;
    },
    onSuccess: () => {
      logAdminActivity("reject-petition", userId!);
      toast({
        title: "Petition rejected",
        description: "The petition has been rejected",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error rejecting petition",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { data: users = [], isLoading: isUsersLoading } = useQuery({
    queryKey: ["usersWithRoles"],
    queryFn: listUsersWithRoles,
    enabled: isAdminUser || isManagerUser,
  });
  const { data: causes = [], isLoading: isCausesLoading } = useQuery({
    queryKey: ["adminCauses", status],
    queryFn: () => listCauses({ status: status }),
    enabled: isAdminUser || isManagerUser,
  });

  const { data: causeEdits = [], isLoading: isCauseEditsLoading } = useQuery({
    queryKey: ["adminCauseEdits"],
    queryFn: getCauseEdits,
    enabled: isAdminUser || isManagerUser,
  });

  const { data: petitions = [], isLoading: isPetitionsLoading } = useQuery({
    queryKey: ["adminPetitions", status],
    queryFn: () => listPetitions({ status: status }),
    enabled: isAdminUser || isManagerUser,
  });

  const { data: petitionEdits = [], isLoading: isPetitionEditsLoading } =
    useQuery({
      queryKey: ["adminPetitionEdits"],
      queryFn: getPetitionEdits,
      enabled: isAdminUser || isManagerUser,
    });

  // Combine causes and edits for pending tab
  const combinedPendingItems =
    status === "pending"
      ? [
          ...causes.map((cause) => ({ ...cause, type: "cause" })),
          ...causeEdits.map((edit) => ({
            ...edit,
            type: "edit",
            status: "pending edit",
          })),
        ]
      : causes.map((cause) => ({ ...cause, type: "cause" }));

  // Combine petitions and edits for pending tab
  const combinedPendingPetitions =
    status === "pending"
      ? [
          ...petitions.map((petition) => ({ ...petition, type: "petition" })),
          ...petitionEdits.map((edit) => ({
            ...edit,
            type: "edit",
            status: "pending edit",
          })),
        ]
      : petitions.map((petition) => ({ ...petition, type: "petition" }));

  const appointManager = async (targetUserId: string): Promise<boolean> => {
    if (!isAdminUser) {
      toast({
        title: "Permission denied",
        description: "Only admins can appoint managers",
        variant: "destructive",
      });
      return false;
    }
    return appointManagerMutation.mutateAsync(targetUserId);
  };

  const removeManager = async (targetUserId: string): Promise<boolean> => {
    if (!isAdminUser) {
      toast({
        title: "Permission denied",
        description: "Only admins can remove managers",
        variant: "destructive",
      });
      return false;
    }
    return removeManagerMutation.mutateAsync(targetUserId);
  };

  const blockUserAccount = async (targetUserId: string): Promise<boolean> => {
    if (!isAdminUser && !isManagerUser) {
      toast({
        title: "Permission denied",
        description: "Only admins and managers can block users",
        variant: "destructive",
      });
      return false;
    }
    return blockUserMutation.mutateAsync(targetUserId);
  };

  const unblockUserAccount = async (targetUserId: string): Promise<boolean> => {
    if (!isAdminUser && !isManagerUser) {
      toast({
        title: "Permission denied",
        description: "Only admins and managers can unblock users",
        variant: "destructive",
      });
      return false;
    }
    return unblockUserMutation.mutateAsync(targetUserId);
  };

  const approveCause = async (causeId: string): Promise<boolean> => {
    if (!isAdminUser && !isManagerUser) {
      toast({
        title: "Permission denied",
        description: "Only admins and managers can approve causes",
        variant: "destructive",
      });
      return false;
    }
    return approveCauseMutation.mutateAsync(causeId);
  };

  const rejectCause = async (
    causeId: string,
    reason: string
  ): Promise<boolean> => {
    if (!isAdminUser && !isManagerUser) {
      toast({
        title: "Permission denied",
        description: "Only admins and managers can reject causes",
        variant: "destructive",
      });
      return false;
    }
    return rejectCauseMutation.mutateAsync({ causeId, reason });
  };

  const approvePetition = async (petitionId: string): Promise<boolean> => {
    if (!isAdminUser && !isManagerUser) {
      toast({
        title: "Permission denied",
        description: "Only admins and managers can approve petitions",
        variant: "destructive",
      });
      return false;
    }
    return approvePetitionMutation.mutateAsync(petitionId);
  };

  const rejectPetition = async (
    petitionId: string,
    reason: string
  ): Promise<boolean> => {
    if (!isAdminUser && !isManagerUser) {
      toast({
        title: "Permission denied",
        description: "Only admins and managers can reject petitions",
        variant: "destructive",
      });
      return false;
    }
    return rejectPetitionMutation.mutateAsync({ petitionId, reason });
  };

  return {
    isAdmin: isAdminUser,
    isManager: isManagerUser,
    isAdminOrManager: isAdminUser || isManagerUser,
    userRole,
    isLoading:
      isLoading ||
      isUsersLoading ||
      isCausesLoading ||
      isCauseEditsLoading ||
      isPetitionsLoading ||
      isPetitionEditsLoading,
    error: error as string | null,
    appointManager,
    removeManager,
    blockUser: blockUserAccount,
    unblockUser: unblockUserAccount,
    approveCause,
    rejectCause,
    approvePetition,
    rejectPetition,
    fetchUsers: () => users,
    causes: combinedPendingItems,
    petitions: combinedPendingPetitions,
    causeEdits,
    petitionEdits,
  };
}
