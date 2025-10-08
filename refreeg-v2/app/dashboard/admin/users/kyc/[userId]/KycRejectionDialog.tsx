"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { XCircle } from "lucide-react";
import { updateVerificationStatus } from "@/actions/kyc-actions";
import { useRouter } from "next/navigation";

interface KycRejectionDialogProps {
  kycId: string;
}

export default function KycRejectionDialog({ kycId }: KycRejectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleReject = async () => {
    if (!reason.trim()) {
      alert("Please provide a rejection reason.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await updateVerificationStatus(
        kycId,
        "rejected",
        reason.trim()
      );
      if (error) {
        console.error("Error rejecting KYC:", error);
        alert("Failed to reject KYC. Please try again.");
        return;
      }

      setOpen(false);
      setReason("");
      router.push("/dashboard/admin/users?kyc_alert=rejected");
    } catch (error) {
      console.error("Error in handleReject:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          disabled={isSubmitting}
          className="px-8 py-3"
        >
          <XCircle className="h-4 w-4 mr-2" />
          Reject KYC
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reject KYC Verification</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this KYC verification. This
            reason will be shown to the user and sent via email.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="reason" className="text-sm font-medium">
              Rejection Reason
            </label>
            <Textarea
              id="reason"
              placeholder="Enter the reason for rejection..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
              disabled={isSubmitting}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={!reason.trim() || isSubmitting}
          >
            {isSubmitting ? "Rejecting..." : "Reject KYC"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
