"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  getVerificationStatus,
  updateVerificationStatus,
} from "@/actions/kyc-actions";
import { getProfile } from "@/actions/profile-actions";
import NavigationLoader from "@/components/NavigationLoader";

export default function KycReviewPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const userId = params?.userId as string;
  const [kyc, setKyc] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const kycAlert = searchParams.get("kyc_alert");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const { status, error: kycError } = await getVerificationStatus(userId);
        if (kycError) throw new Error(kycError);
        setKyc(status);
        const profileData = await getProfile(userId);
        setProfile(profileData);
      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    if (userId) fetchData();
  }, [userId]);

  const handleAction = async (status: "approved" | "rejected") => {
    if (!kyc) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const { error } = await updateVerificationStatus(kyc.id, status);
      if (error) throw new Error(error);
      router.push(`/dashboard/admin/users?kyc_alert=${status}`);
    } catch (err: any) {
      setActionError(err.message || "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <NavigationLoader />;
  }
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  if (!kyc || !profile) {
    return (
      <Alert variant="destructive">
        <AlertTitle>No KYC Submission</AlertTitle>
        <AlertDescription>This user has not submitted KYC.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-8">
      {kycAlert && (
        <Alert variant="default" className="mb-4">
          <AlertTitle>
            KYC {kycAlert === "approved" ? "Approved" : "Rejected"}
          </AlertTitle>
          <AlertDescription>
            KYC has been {kycAlert === "approved" ? "approved" : "rejected"}{" "}
            successfully.
          </AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>KYC Review</CardTitle>
          <CardDescription>
            Review and approve/reject this user's KYC submission.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">User Details</h3>
            <div>Name: {profile.full_name || "-"}</div>
            <div>Email: {profile.email || "-"}</div>
          </div>
          <div>
            <h3 className="font-semibold">KYC Submission</h3>
            <div>Full Name: {profile.full_name || "-"}</div>
            <div>Date of Birth: {profile.date_of_birth || "-"}</div>
            <div>Phone: {profile.phone || "-"}</div>
            <div>Address: {profile.address || "-"}</div>
            <div>Document Type: {kyc.document_type || "-"}</div>
            <div>Status: {kyc.status}</div>
            <div>Notes: {kyc.verification_notes || "-"}</div>
            <div className="mt-2">
              <span className="font-semibold">Document:</span>
              <br />
              {kyc.document_url ? (
                <a
                  href={kyc.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={kyc.document_url}
                    alt="KYC Document"
                    className="max-w-xs max-h-48 border rounded"
                  />
                </a>
              ) : (
                <span>No document uploaded</span>
              )}
            </div>
          </div>
          {actionError && (
            <Alert variant="destructive">
              <AlertDescription>{actionError}</AlertDescription>
            </Alert>
          )}
          <div className="flex gap-4 mt-4">
            <Button
              disabled={actionLoading || kyc.status === "approved"}
              onClick={() => handleAction("approved")}
            >
              ✅ Approve
            </Button>
            <Button
              variant="destructive"
              disabled={actionLoading || kyc.status === "rejected"}
              onClick={() => handleAction("rejected")}
            >
              ❌ Reject
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
