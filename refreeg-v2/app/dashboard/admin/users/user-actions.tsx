"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { User, UserCog, UserCheck, UserX, MoreHorizontal } from "lucide-react"
import { setUserRole } from "@/actions/role-actions"
import { blockUser, unblockUser } from "@/actions/user-actions"
import { UserWithRole } from "@/types"
import { useRouter } from "next/navigation"

interface UserActionsProps {
    user: UserWithRole
    currentUserRole: string
}

export function UserActions({ user: userItem, currentUserRole }: UserActionsProps) {
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean
        title: string
        description: string
        action: () => Promise<void>
    }>({
        open: false,
        title: "",
        description: "",
        action: async () => { },
    })

    const router = useRouter()

    const handleAppointManager = (userId: string, email: string) => {
        setConfirmDialog({
            open: true,
            title: "Appoint Manager",
            description: `Are you sure you want to appoint ${email} as a manager? They will be able to approve/reject causes and block users.`,
            action: async () => {
                await setUserRole(userId, "manager")
                setConfirmDialog((prev) => ({ ...prev, open: false }))
                router.refresh()
            },
        })
    }

    const handleRemoveManager = (userId: string, email: string) => {
        setConfirmDialog({
            open: true,
            title: "Remove Manager",
            description: `Are you sure you want to remove ${email} as a manager? They will no longer be able to perform administrative actions.`,
            action: async () => {
                await setUserRole(userId, "user")
                setConfirmDialog((prev) => ({ ...prev, open: false }))
                router.refresh()
            },
        })
    }

    const handleBlockUser = (userId: string, email: string) => {
        setConfirmDialog({
            open: true,
            title: "Block User",
            description: `Are you sure you want to block ${email}? They will no longer be able to log in or use the platform.`,
            action: async () => {
                await blockUser(userId)
                setConfirmDialog((prev) => ({ ...prev, open: false }))
                router.refresh()
            },
        })
    }

    const handleUnblockUser = (userId: string, email: string) => {
        setConfirmDialog({
            open: true,
            title: "Unblock User",
            description: `Are you sure you want to unblock ${email}? They will be able to log in and use the platform again.`,
            action: async () => {
                await unblockUser(userId)
                setConfirmDialog((prev) => ({ ...prev, open: false }))
                router.refresh()
            },
        })
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    {/* Admin-only actions */}
                    {currentUserRole === "admin" && userItem.role !== "admin" && (
                        <>
                            {userItem.role === "manager" ? (
                                <DropdownMenuItem onClick={() => handleRemoveManager(userItem.id, userItem.email)}>
                                    <User className="mr-2 h-4 w-4" />
                                    Remove Manager Role
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem onClick={() => handleAppointManager(userItem.id, userItem.email)}>
                                    <UserCog className="mr-2 h-4 w-4" />
                                    Appoint as Manager
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                        </>
                    )}

                    {/* Admin and Manager actions */}
                    {userItem.role !== "admin" && (
                        <>
                            {userItem.is_blocked ? (
                                <DropdownMenuItem onClick={() => handleUnblockUser(userItem.id, userItem.email)}>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Unblock User
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem onClick={() => handleBlockUser(userItem.id, userItem.email)}>
                                    <UserX className="mr-2 h-4 w-4" />
                                    Block User
                                </DropdownMenuItem>
                            )}
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Confirmation Dialog */}
            <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{confirmDialog.title}</DialogTitle>
                        <DialogDescription>{confirmDialog.description}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}>
                            Cancel
                        </Button>
                        <Button onClick={() => confirmDialog.action()}>Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
} 