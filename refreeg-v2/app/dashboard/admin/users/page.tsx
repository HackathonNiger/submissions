import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Shield,
  UserCheck,
  UserX,
  MoreHorizontal,
  Search,
  UserCog,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserActions } from "./user-actions";
import { UserSearch } from "@/components/search";
import { CopyEmail } from "@/components/copy-email";
import type { UserWithRole } from "@/types";
import { getUserRole, listUsersWithRoles } from "@/actions/role-actions";
import Link from "next/link";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const supabase = await createClient();
  const params = await searchParams;

  const {
    data: { user: currentuser },
  } = await supabase.auth.getUser();

  if (!currentuser) {
    redirect("/signin");
  }

  // Check if user is admin or manager
  const user = await getUserRole(currentuser.id);

  if (!user || (user !== "admin" && user !== "manager")) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            You do not have permission to access this page.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Fetch users using server action
  const users = await listUsersWithRoles();

  // Filter users based on search query if provided

  const filteredUsers = params.search
    ? users.filter(
        (user) =>
          user.email.toLowerCase().includes(params.search!.toLowerCase()) ||
          user.full_name?.toLowerCase().includes(params.search!.toLowerCase())
      )
    : users;

  // Find users with KYC status 'pending'
  const kycAttentionUsers = filteredUsers.filter(
    (u) => u.kyc_status === "pending"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
        <p className="text-muted-foreground">
          View and manage user accounts and permissions.
        </p>
      </div>

      {/* KYC Notification Banner */}
      {kycAttentionUsers.length > 0 && (
        <div className="rounded-md bg-yellow-50 border border-yellow-300 p-4 flex items-center gap-4">
          <Shield className="h-6 w-6 text-yellow-600" />
          <div className="flex-1">
            <span className="font-medium text-yellow-800">
              {kycAttentionUsers.length} KYC submission
              {kycAttentionUsers.length > 1 ? "s" : ""} require review
            </span>
            <span className="block text-yellow-700 text-sm">
              There {kycAttentionUsers.length === 1 ? "is" : "are"}{" "}
              {kycAttentionUsers.length} user
              {kycAttentionUsers.length > 1 ? "s" : ""} with new or edited KYC
              submissions awaiting your attention.
            </span>
          </div>
          <Link
            href={`/dashboard/admin/users/kyc/${kycAttentionUsers[0].id}`}
            className="ml-4 px-3 py-1 rounded bg-yellow-200 text-yellow-900 font-medium hover:bg-yellow-300 transition"
          >
            Review Now
          </Link>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Users</CardTitle>
            <UserSearch defaultValue={params.search} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>KYC</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((userItem: UserWithRole) => (
                    <TableRow key={userItem.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <Link
                            href={`/profile/${userItem.id}`}
                            className="font-medium hover:underline"
                          >
                            {userItem.full_name || "Unnamed User"}
                          </Link>
                          <CopyEmail email={userItem.email} />
                        </div>
                      </TableCell>
                      <TableCell>
                        {userItem.role === "admin" ? (
                          <Badge variant="default" className="bg-red-500">
                            <Shield className="mr-1 h-3 w-3" />
                            Admin
                          </Badge>
                        ) : userItem.role === "manager" ? (
                          <Badge variant="default" className="bg-blue-500">
                            <UserCog className="mr-1 h-3 w-3" />
                            Manager
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <User className="mr-1 h-3 w-3" />
                            User
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {userItem.is_blocked ? (
                          <Badge variant="destructive">Blocked</Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-green-500/10 text-green-500 border-green-500/20"
                          >
                            Active
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(new Date(userItem.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {/* KYC Shield Icon with color and dot overlay */}
                        <a
                          href={`/dashboard/admin/users/kyc/${userItem.id}`}
                          className="inline-block relative group"
                          title="Review KYC"
                        >
                          {/* Shield color logic */}
                          {userItem.kyc_status === "approved" ? (
                            <Shield className="h-6 w-6 text-green-500" />
                          ) : userItem.kyc_status === "rejected" ? (
                            <Shield className="h-6 w-6 text-red-500" />
                          ) : userItem.kyc_status === "pending" ? (
                            <Shield className="h-6 w-6 text-black" />
                          ) : (
                            <Shield className="h-6 w-6 text-gray-400" />
                          )}
                          {/* Red dot overlay if pending */}
                          {userItem.kyc_status === "pending" && (
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
                          )}
                        </a>
                      </TableCell>
                      <TableCell className="text-right">
                        <UserActions user={userItem} currentUserRole={user} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
