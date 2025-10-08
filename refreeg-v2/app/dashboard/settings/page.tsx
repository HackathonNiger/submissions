"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { useKyc } from "@/hooks/use-kyc";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryState } from "nuqs";
import { useSearchParams, useRouter } from "next/navigation";
import { ProfileForm } from "./profile-form";
import { BankDetailsForm } from "./bank-details-form";
import { NotificationsForm } from "./notifications-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KycTab } from "./kyc-tab";
import { useEffect, useState } from "react";
import { getVerificationStatus } from "@/actions/kyc-actions";
import { DeleteAccountButton } from "@/app/dashboard/settings/delete-account-button";
import { isProfileComplete } from "@/actions/profile-actions";

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    profile,
    isLoading: profileLoading,
    error: profileError,
  } = useProfile(user?.id);
  const { isLoading: isKycLoading } = useKyc(user?.id);

  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "profile",
    parse: (value) => value,
    serialize: (value) => value,
  });

  const [alert, setAlert] = useState<null | React.ReactNode>(null);

  useEffect(() => {
    async function checkRequirements() {
      if (!user?.id) return;

      // Fetch KYC status (handle null safely)
      const kycResult = await getVerificationStatus(user.id);

      // Extract only the status field (if kycResult is not null)
      const kycStatus = (kycResult?.status ?? undefined) as
        | "pending"
        | "approved"
        | "rejected"
        | undefined;

      // Check profile completeness
      const { isComplete } = await isProfileComplete(user.id);

      if (!isComplete || searchParams.get("error") === "profile_incomplete") {
        setAlert(
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Profile Incomplete</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>
                You need to complete your profile (full name, bio, and profile
                picture) to list causes.
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("profile")}
              >
                Complete Profile
              </Button>
            </AlertDescription>
          </Alert>
        );
        return;
      }

      // Handle KYC status
      if (!kycStatus || searchParams.get("error") === "kyc_required") {
        setAlert(
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>KYC Verification Required</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>
                Complete your KYC verification to list causes and access all
                features.
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/settings/kyc-setup")}
              >
                Set up KYC
              </Button>
            </AlertDescription>
          </Alert>
        );
      } else if (
        kycStatus === "pending" ||
        searchParams.get("error") === "kyc_pending"
      ) {
        setAlert(
          <Alert>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertTitle>KYC Under Review</AlertTitle>
            <AlertDescription>
              Your KYC submission is pending review. You will be notified once
              it is approved or if further action is required.
            </AlertDescription>
          </Alert>
        );
      } else if (
        kycStatus === "rejected" ||
        searchParams.get("error") === "kyc_rejected"
      ) {
        setAlert(
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>KYC Rejected</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>
                Your KYC submission was rejected. Please resubmit your details.
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/settings/kyc-setup")}
              >
                Resubmit KYC
              </Button>
            </AlertDescription>
          </Alert>
        );
      } else {
        setAlert(null); // Approved → no alert
      }
    }

    checkRequirements();
  }, [user, searchParams, router, setActiveTab]);

  if (profileLoading || isKycLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and payment details.
        </p>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and payment details.
        </p>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{profileError}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and payment details.
        </p>
      </div>

      {alert}

      <Tabs
        defaultValue={activeTab}
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="bank">Bank Details</TabsTrigger>
          <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="danger">Account Management</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          {profile && user && <ProfileForm profile={profile} user={user} />}
        </TabsContent>

        <TabsContent value="bank">
          {profile && user && <BankDetailsForm profile={profile} user={user} />}
        </TabsContent>

        <TabsContent value="kyc">
          {profile && user && <KycTab profile={profile} user={user} />}
        </TabsContent>

        <TabsContent value="notifications">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Notifications</h2>
              <NotificationsForm />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="danger">
          {user && <DeleteAccountButton userId={user.id} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
