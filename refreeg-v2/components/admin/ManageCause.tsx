"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";
import { useAdmin } from "@/hooks/use-admin";
import type { Cause, CauseStatus, CauseWithUser } from "@/types";
import Image from "next/image";
import { useQueryState } from "nuqs";
import { format } from "date-fns";
import { categories } from "@/lib/categories";
import { useNotifications } from "@/hooks/use-notification";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import NavigationLoader from "../NavigationLoader";
import MultimediaCarousel from "../MultimediaCarousel";

export default function ManageCauses() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "pending",
    parse: (value) => value,
    serialize: (value) => value,
  });
  const {
    isAdminOrManager,
    isLoading: adminLoading,
    approveCause,
    rejectCause,
    causes,
    causeEdits,
  } = useAdmin(user?.id, activeTab as CauseStatus);

  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean;
    causeId: string;
    title: string;
    reason: string;
  }>({
    open: false,
    causeId: "",
    title: "",
    reason: "",
  });

  const [previewDialog, setPreviewDialog] = useState<{
    open: boolean;
    cause: CauseWithUser | null;
    isLoading: boolean;
  }>({
    open: false,
    cause: null,
    isLoading: false,
  });

  const { showNotification } = useNotifications();

  const handleApprove = async (causeId: string) => {
    try {
      await approveCause(causeId);
      showNotification("Cause Approved", {
        body: "A new cause has been approved and is now live!",
        icon: "/icons/icon-192x192.png",
      });
    } catch (error) {
      console.error("Error approving cause:", error);
    }
  };

  const openRejectDialog = (causeId: string, title: string) => {
    setRejectDialog({
      open: true,
      causeId,
      title,
      reason: "",
    });
  };

  const handleReject = async () => {
    await rejectCause(rejectDialog.causeId, rejectDialog.reason);
    setRejectDialog((prev) => ({ ...prev, open: false }));
  };

  const openPreviewDialog = (cause: Cause | CauseWithUser) => {
    // For preview, we'll use the basic cause data and handle missing user info
    const previewCause = {
      ...cause,
      user: (cause as CauseWithUser).user || {
        name: (cause as any).profiles?.full_name || "Anonymous",
        email: (cause as any).profiles?.email || "",
        sub_account_code: "",
        profile_photo: (cause as any).profiles?.profile_photo || null,
      },
      sections: (cause as CauseWithUser).sections || [],
      multimedia: (cause as CauseWithUser).multimedia || [],
      video_links: (cause as any).video_links || [],
    } as any;

    setPreviewDialog({
      open: true,
      cause: previewCause,
      isLoading: false,
    });
  };

  const closePreviewDialog = () => {
    setPreviewDialog({
      open: false,
      cause: null,
      isLoading: false,
    });
  };

  if (adminLoading) {
    return <NavigationLoader />;
  }

  if (!isAdminOrManager) {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Causes</h1>
        <p className="text-muted-foreground">
          Review and approve causes submitted by users.
        </p>
      </div>

      <Tabs
        defaultValue={activeTab}
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="space-y-4">
          {causes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No {activeTab} causes to display.
            </p>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Goal</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {causes.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.title}
                        {item.type === "edit" && (
                          <Badge variant="outline" className="ml-2">
                            Edit Request
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>₦{item.goal.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {(item as any).profiles?.profile_photo ? (
                            <Image
                              src={(item as any).profiles.profile_photo}
                              alt={(item as any).profiles?.full_name || "User"}
                              width={32}
                              height={32}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">
                                {((item as any).profiles?.full_name || "A")
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span className="font-medium">
                            {(item as any).profiles?.full_name || "Anonymous"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === "approved"
                              ? "default"
                              : item.status === "pending"
                              ? "secondary"
                              : item.status === "pending edit"
                              ? "outline"
                              : "destructive"
                          }
                        >
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openPreviewDialog(item)}
                            >
                              Preview
                            </DropdownMenuItem>
                            {activeTab === "pending" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() =>
                                    openRejectDialog(
                                      item.type === "edit"
                                        ? item.original_cause_id
                                        : item.id,
                                      item.title
                                    )
                                  }
                                >
                                  Reject
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleApprove(
                                      item.type === "edit"
                                        ? item.original_cause_id
                                        : item.id
                                    )
                                  }
                                >
                                  Approve
                                </DropdownMenuItem>
                              </>
                            )}
                            {activeTab === "rejected" && (
                              <DropdownMenuItem
                                onClick={() => handleApprove(item.id)}
                              >
                                Approve
                              </DropdownMenuItem>
                            )}
                            {activeTab === "approved" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  openRejectDialog(item.id, item.title)
                                }
                              >
                                Take Down
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialog.open}
        onOpenChange={(open) => setRejectDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Cause</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting "{rejectDialog.title}". This
              will be shown to the user.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Rejection reason..."
            value={rejectDialog.reason}
            onChange={(e) =>
              setRejectDialog((prev) => ({ ...prev, reason: e.target.value }))
            }
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setRejectDialog((prev) => ({ ...prev, open: false }))
              }
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectDialog.reason.trim()}
            >
              Reject Cause
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog - Simulates the actual cause page */}
      <Dialog open={previewDialog.open} onOpenChange={closePreviewDialog}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0">
          {/* DialogTitle for accessibility (visually hidden) */}
          <DialogTitle className="sr-only">
            Preview Cause: {previewDialog.cause?.title || "Cause Preview"}
          </DialogTitle>

          {previewDialog.isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Icons.spinner className="h-8 w-8 animate-spin" />
            </div>
          ) : previewDialog.cause ? (
            <div className="container py-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  {/* Cover Image */}
                  {previewDialog.cause.image && (
                    <div className="aspect-video w-full overflow-hidden rounded-lg">
                      <Image
                        src={previewDialog.cause.image}
                        alt={previewDialog.cause.title}
                        className="object-cover w-full h-full"
                        width={800}
                        height={450}
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="space-y-6">
                    <h1 className="text-3xl font-bold">
                      {previewDialog.cause.title}
                    </h1>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        {(previewDialog.cause.user as any)?.profile_photo ? (
                          <Image
                            src={
                              (previewDialog.cause.user as any).profile_photo
                            }
                            alt={previewDialog.cause.user?.name || "User"}
                            width={24}
                            height={24}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {(previewDialog.cause.user?.name || "A")
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span>
                          Created by{" "}
                          {previewDialog.cause.user?.name || "Anonymous"}
                        </span>
                      </div>
                      <span>•</span>
                      <span>
                        {previewDialog.cause.created_at
                          ? format(
                              new Date(previewDialog.cause.created_at),
                              "PPP"
                            )
                          : "-"}
                      </span>
                      <span>•</span>
                      <span className="capitalize">
                        {previewDialog.cause.category}
                      </span>
                    </div>

                    {/* Description */}
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-line text-lg">
                        {previewDialog.cause.description}
                      </p>
                    </div>

                    {/* Sections (handle sections on both main cause and edit rows) */}
                    {Array.isArray((previewDialog.cause as any).cause_edit_sections) &&
                    (previewDialog.cause as any).cause_edit_sections.length > 0 ? (
                      (previewDialog.cause as any).cause_edit_sections.map(
                        (section: any, index: number) => (
                          <div key={section.id ?? index} className="space-y-3">
                            <h3 className="text-xl font-semibold">{section.heading}</h3>
                            <p className="text-muted-foreground whitespace-pre-line">
                              {section.description}
                            </p>
                          </div>
                        )
                      )
                    ) : (
                      previewDialog.cause.sections &&
                      previewDialog.cause.sections.length > 0 &&
                      previewDialog.cause.sections.map(
                        (section: any, index: number) => (
                          <div key={index} className="space-y-3">
                            <h3 className="text-xl font-semibold">{section.heading}</h3>
                            <p className="text-muted-foreground whitespace-pre-line">
                              {section.description}
                            </p>
                          </div>
                        )
                      )
                    )}

                    {/* Multimedia Preview */}
                    {((previewDialog.cause as any).multimedia &&
                      (previewDialog.cause as any).multimedia.length > 0) ||
                    ((previewDialog.cause as any).video_links &&
                      (previewDialog.cause as any).video_links.length > 0) ? (
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Media</h3>
                        <MultimediaCarousel
                          media={[
                            ...((previewDialog.cause as any).multimedia || []),
                            ...((previewDialog.cause as any).video_links || []),
                          ]}
                          coverImage={previewDialog.cause.image || undefined}
                          title={previewDialog.cause.title}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Sidebar - Donation Info */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Donation Progress</CardTitle>
                      <CardDescription>
                        Help reach the goal of ₦
                        {previewDialog.cause.goal.toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">
                            ₦
                            {(previewDialog.cause.raised || 0).toLocaleString()}
                          </span>
                          <span className="text-muted-foreground">
                            of ₦{previewDialog.cause.goal.toLocaleString()}
                          </span>
                        </div>
                        <Progress
                          value={Math.min(
                            Math.round(
                              ((previewDialog.cause.raised || 0) /
                                previewDialog.cause.goal) *
                                100
                            ),
                            100
                          )}
                        />
                        <div className="text-sm text-muted-foreground text-right">
                          {Math.min(
                            Math.round(
                              ((previewDialog.cause.raised || 0) /
                                previewDialog.cause.goal) *
                                100
                            ),
                            100
                          )}
                          % raised
                        </div>
                      </div>

                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span>Status</span>
                          <Badge
                            variant={
                              previewDialog.cause.status === "approved"
                                ? "default"
                                : previewDialog.cause.status === "pending"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {previewDialog.cause.status
                              .charAt(0)
                              .toUpperCase() +
                              previewDialog.cause.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span>Goal Amount</span>
                          <span className="font-medium">
                            ₦{previewDialog.cause.goal.toLocaleString()}
                          </span>
                        </div>
                        {previewDialog.cause.days_active && (
                          <div className="flex justify-between pt-2 border-t">
                            <span>Duration</span>
                            <span className="font-medium">
                              {previewDialog.cause.days_active} days
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {previewDialog.cause.status === "pending" && (
                      <>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            closePreviewDialog();
                            openRejectDialog(
                              previewDialog.cause!.id,
                              previewDialog.cause!.title
                            );
                          }}
                          className="flex-1"
                        >
                          Reject
                        </Button>
                        <Button
                          onClick={() => {
                            closePreviewDialog();
                            handleApprove(previewDialog.cause!.id);
                          }}
                          className="flex-1"
                        >
                          Approve
                        </Button>
                      </>
                    )}
                    {previewDialog.cause.status === "rejected" && (
                      <Button
                        onClick={() => {
                          closePreviewDialog();
                          handleApprove(previewDialog.cause!.id);
                        }}
                        className="w-full"
                      >
                        Approve
                      </Button>
                    )}
                    {previewDialog.cause.status === "approved" && (
                      <Button
                        variant="destructive"
                        onClick={() => {
                          closePreviewDialog();
                          openRejectDialog(
                            previewDialog.cause!.id,
                            previewDialog.cause!.title
                          );
                        }}
                        className="w-full"
                      >
                        Take Down
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No cause data to display
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
