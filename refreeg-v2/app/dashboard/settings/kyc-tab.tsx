"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { getVerificationStatus } from "@/actions/kyc-actions";
import {
  Shield,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  User,
  Calendar,
  Phone,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { Profile } from "@/types";
import Image from "next/image";
import NavigationLoader from "@/components/NavigationLoader";

interface KycTabProps {
  profile: Profile;
  user: any;
}

export function KycTab({ profile, user }: KycTabProps) {
  const [kycData, setKycData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchKycStatus() {
      try {
        const { status, error: kycError } = await getVerificationStatus(
          user.id
        );
        if (kycError) {
          setError(kycError);
        } else {
          setKycData(status);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch KYC status");
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) {
      fetchKycStatus();
    }
  }, [user?.id]);

  const getStatusIcon = () => {
    if (!kycData) return <Shield className="h-8 w-8 text-gray-400" />;

    switch (kycData.status) {
      case "approved":
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case "rejected":
        return <XCircle className="h-8 w-8 text-red-500" />;
      case "pending":
        return <Clock className="h-8 w-8 text-yellow-500" />;
      default:
        return <Shield className="h-8 w-8 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    if (!kycData) return <Badge variant="outline">Not Submitted</Badge>;

    switch (kycData.status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Approved
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending Review
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusMessage = () => {
    if (!kycData) return "You haven't submitted KYC verification yet.";

    switch (kycData.status) {
      case "approved":
        return "Your KYC has been approved! You can now list causes and access all features.";
      case "rejected":
        return "Your KYC was rejected. Please review the requirements and resubmit your application.";
      case "pending":
        return "Your KYC is under review. We'll notify you once it's processed.";
      default:
        return "Unknown status.";
    }
  };

  if (loading) {
    return <NavigationLoader />;
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center gap-3">
            {getStatusIcon()}
            KYC Verification Status
          </CardTitle>
          <CardDescription>Your identity verification status</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">{getStatusMessage()}</p>
            {getStatusBadge()}
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* KYC Details */}
      {kycData && (
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              KYC Submission Details
            </CardTitle>
            <CardDescription>
              Information you provided for verification
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Personal & Address Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">
                  Personal Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Full Name:</span>
                    <span className="text-gray-700">
                      {kycData.full_name || "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Date of Birth:</span>
                    <span className="text-gray-700">{kycData.dob || "-"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Phone:</span>
                    <span className="text-gray-700">
                      {kycData.phone || "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">
                  Address Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Address:</span>
                    <span className="text-gray-700">
                      {kycData.address || "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">City:</span>
                    <span className="text-gray-700">{kycData.city || "-"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">State:</span>
                    <span className="text-gray-700">
                      {kycData.state || "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Postal Code:</span>
                    <span className="text-gray-700">
                      {kycData.postal || "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Country:</span>
                    <span className="text-gray-700">
                      {kycData.country || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Document Preview */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">
                Document Preview
              </h4>

              {kycData?.document_url ? (
                <>
                  {kycData.document_url.endsWith(".pdf") ? (
                    <div className="border rounded-lg p-4 bg-gray-50 flex items-center gap-4">
                      <span className="inline-block w-8 h-8 bg-gray-200 flex items-center justify-center rounded">
                        📄
                      </span>
                      <a
                        href={kycData.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View PDF Document
                      </a>
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 bg-gray-50 flex flex-col items-center">
                      <Image
                        src={kycData.document_url}
                        alt="KYC Document"
                        width={400}
                        height={300}
                        className="object-contain rounded shadow-sm hover:shadow-md transition-shadow max-h-64"
                      />
                      <p className="text-sm text-blue-600 mt-2 text-center">
                        Click image to view full size
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="border rounded-lg p-8 bg-gray-50 text-center text-gray-500">
                  No document uploaded
                </div>
              )}

              {kycData?.status === "rejected" &&
                kycData?.verification_notes && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg mt-4">
                    <h3 className="font-medium text-destructive mb-2">
                      Rejection Reason
                    </h3>
                    <p className="text-sm text-destructive">
                      {kycData.verification_notes}
                    </p>
                  </div>
                )}
            </div>

            <Separator className="my-6" />

            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Document Type:</span>
              <span className="text-gray-700">
                {kycData.document_type || "-"}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!kycData && (
              <Button
                onClick={() => router.push("/dashboard/settings/kyc-setup")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                <Shield className="h-4 w-4 mr-2" />
                Setup KYC Verification
              </Button>
            )}

            {kycData?.status === "rejected" && (
              <Button
                onClick={() => router.push("/dashboard/settings/kyc-setup")}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
              >
                <Shield className="h-4 w-4 mr-2" />
                Resubmit KYC
              </Button>
            )}

            {kycData?.status === "pending" && (
              <div className="text-center text-gray-600">
                <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <p>Your KYC is under review. Please wait until we review it.</p>
              </div>
            )}

            {kycData?.status === "approved" && (
              <div className="text-center text-green-600">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p>Your KYC is approved! You can now list causes.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
