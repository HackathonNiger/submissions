import { notFound, redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  getVerificationStatus,
  updateVerificationStatus,
} from "@/actions/kyc-actions";
import { getProfile, updateProfile } from "@/actions/profile-actions";
import {
  Shield,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import KycRejectionDialog from "./KycRejectionDialog";

export default async function KycReviewPage({
  params,
  searchParams,
}: {
  params: { userId: string };
  searchParams?: Promise<{ kyc_alert?: string }>; // 👈 note Promise here
}) {
  const userId = params.userId;

  const resolvedSearchParams = searchParams ? await searchParams : {};

  const { status: kyc, error: kycError } = await getVerificationStatus(userId);
  const profile = await getProfile(userId);

  // Handle missing KYC submission
  if (kycError || !kyc) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <Alert variant="destructive">
          <AlertTitle>No KYC Submission</AlertTitle>
          <AlertDescription>
            This user has not submitted KYC yet.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Handle missing profile
  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <Alert variant="destructive">
          <AlertTitle>No Profile Found</AlertTitle>
          <AlertDescription>
            This user does not have a profile yet.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  async function approveAction() {
    "use server";
    if (!kyc) return;

    try {
      const { error } = await updateVerificationStatus(kyc.id, "approved");
      if (error) {
        console.error("Error approving KYC:", error);
        throw new Error(error);
      }
      redirect(`/dashboard/admin/users?kyc_alert=approved`);
    } catch (error) {
      console.error("Error in approveAction:", error);
      throw error;
    }
  }

  return (
    <div className=" mt-4 md:mt-8 space-y-4 md:space-y-6 px-4 md:px-0">
      {/* Success/Error Alerts */}
      {resolvedSearchParams.kyc_alert === "approved" && (
        <Alert className="bg-green-100 border-green-300 text-green-800">
          <CheckCircle className="h-4 w-4 text-green-700" />
          <AlertTitle className="text-green-900">KYC Approved</AlertTitle>
          <AlertDescription className="text-green-800">
            The KYC verification has been approved successfully.
          </AlertDescription>
        </Alert>
      )}

      {resolvedSearchParams.kyc_alert === "rejected" && (
        <Alert className="bg-red-100 border-red-300 text-red-800">
          <XCircle className="h-4 w-4 text-red-700" />
          <AlertTitle className="text-red-900">KYC Rejected</AlertTitle>
          <AlertDescription className="text-red-800">
            The KYC verification has been rejected.
          </AlertDescription>
        </Alert>
      )}

      {/* User Information */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Information
          </CardTitle>
          <CardDescription>Basic user details</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-medium break-words">
                {profile.full_name || "Not provided"}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium break-all">
                {profile.email || "Not provided"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KYC Status */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            KYC Status
          </CardTitle>
          <CardDescription>Current verification status</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Status</p>
              <Badge
                variant={
                  kyc.status === "approved"
                    ? "default"
                    : kyc.status === "pending"
                    ? "secondary"
                    : "destructive"
                }
              >
                {kyc.status.charAt(0).toUpperCase() + kyc.status.slice(1)}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Document Type</p>
              <p className="font-medium">
                {kyc.document_type || "Not specified"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KYC Submission Details */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            KYC Submission Details
          </CardTitle>
          <CardDescription>
            Personal information provided by the user
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">
                    Full Name:
                  </span>
                </div>
                <span className="text-gray-700 break-words">
                  {kyc.full_name || "-"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">
                    Date of Birth:
                  </span>
                </div>
                <span className="text-gray-700">{kyc.dob || "-"}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">
                    Phone:
                  </span>
                </div>
                <span className="text-gray-700 break-all">
                  {kyc.phone || "-"}
                </span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Address Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">
              Address Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">
                    Address:
                  </span>
                </div>
                <span className="text-gray-700 break-words">
                  {kyc.address || "-"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">
                    City:
                  </span>
                </div>
                <span className="text-gray-700">{kyc.city || "-"}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">
                    State:
                  </span>
                </div>
                <span className="text-gray-700">{kyc.state || "-"}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">
                    Postal Code:
                  </span>
                </div>
                <span className="text-gray-700">{kyc.postal || "-"}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">
                    Country:
                  </span>
                </div>
                <span className="text-gray-700">{kyc.country || "-"}</span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Document Preview */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">
              Document Preview
            </h4>
            {kyc?.document_url ? (
              kyc.document_url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                <div className="border rounded-lg p-4 bg-gray-50 flex justify-center items-center">
                  <a
                    href={kyc.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Image
                      src={kyc.document_url}
                      alt="KYC Document"
                      width={500}
                      height={300}
                      className="object-contain rounded shadow-sm hover:shadow-md transition-shadow max-h-64"
                    />
                    <p className="text-sm text-blue-600 mt-2 text-center">
                      Click image to view full size
                    </p>
                  </a>
                </div>
              ) : (
                <div className="border rounded-lg p-4 bg-gray-50 flex items-center gap-4">
                  <span className="inline-block w-8 h-8 bg-gray-200 flex items-center justify-center rounded">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.828A2 2 0 0 0 19.414 7.414l-4.828-4.828A2 2 0 0 0 12.172 2H6zm7 1.414L18.586 9H15a2 2 0 0 1-2-2V3.414z"
                        fill="#e53e3e"
                      />
                    </svg>
                  </span>
                  <a
                    href={kyc.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View PDF Document
                  </a>
                </div>
              )
            ) : (
              <div className="border rounded-lg p-8 bg-gray-50 text-center text-gray-500">
                No document uploaded
              </div>
            )}
            {kyc?.status === "rejected" && kyc?.verification_notes && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg mt-4">
                <h3 className="font-medium text-destructive mb-2">
                  Rejection Reason
                </h3>
                <p className="text-sm text-destructive">
                  {kyc.verification_notes}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <form action={approveAction}>
              <Button
                type="submit"
                disabled={kyc?.status === "approved"}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 w-full"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve KYC
              </Button>
            </form>
            <KycRejectionDialog kycId={kyc.id} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
