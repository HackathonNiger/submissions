import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DonationForm } from "@/components/donation-form";
import { DonorsList } from "@/components/donors-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getCause,
  getCurrentUser,
  getProfile,
  listDonationsForCause,
} from "@/actions";
import { notFound } from "next/navigation";
import { ShareModal } from "@/components/share-modal";
import { getBaseURL } from "@/lib/utils";
import SolanaDonationButtonWrapper from "@/components/crypto-details/SolanaDonationButtonWrapper";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import MultimediaCarousel from "@/components/MultimediaCarousel";
import { listCommentsForCause } from "@/actions/comment-actions";
import { CommentsTabWrapper } from "@/components/comments/comments-tab-wrapper";
import { MilestoneNotifications } from "@/components/milestone-notifications";

export default async function CauseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const myparams = await params;
  const cause = await getCause(myparams.id);
  if (!cause) {
    notFound();
  }

  const donors = await listDonationsForCause(cause.id);
  const comments = await listCommentsForCause(cause.id);
  const formattedDate = new Date(cause.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const percentRaised = Math.min(
    Math.round((cause.raised / cause.goal) * 100),
    100
  );
  const user = await getCurrentUser();
  const myprofile = user ? await getProfile(user.id) : undefined;
  const profile = {
    email: myprofile?.email || "",
    name: myprofile?.full_name || "",
    id: myprofile?.id || "",
    subaccount: myprofile?.sub_account_code || "",
  };

  const baseUrl = getBaseURL();
  const creatorProfile = await getProfile(cause.user_id);
  const hasCreatorWallet = !!creatorProfile?.solana_wallet;

  let socialMedia = {
    twitter: "",
    facebook: "",
    instagram: "",
    linkedin: "",
  };

  if (creatorProfile?.social_media) {
    try {
      const parsedSocial =
        typeof creatorProfile.social_media === "string"
          ? JSON.parse(creatorProfile.social_media)
          : creatorProfile.social_media;

      socialMedia = {
        twitter: parsedSocial.twitter || "",
        facebook: parsedSocial.facebook || "",
        instagram: parsedSocial.instagram || "",
        linkedin: parsedSocial.linkedin || "",
      };
    } catch (e) {
      console.error("Error parsing social media:", e);
    }
  }

  const hasSocialMedia =
    socialMedia.twitter ||
    socialMedia.facebook ||
    socialMedia.instagram ||
    socialMedia.linkedin;

  const donorsList = donors.map((donor) => ({
    ...donor,
    name: donor.name || "Anonymous",
    amount: donor.amount || 0,
    created_at: donor.created_at,
    message: donor.message || "",
  }));

  // Map donor messages to comment shape
  const donorMessages = donors
    .filter((d) => d.message && d.message.trim() !== "")
    .map((d) => ({
      id: `donor-${d.id}`,
      cause_id: d.cause_id,
      user_id: d.user_id || "anonymous",
      content: d.message || "", // Ensure string
      created_at: d.created_at,
      updated_at: d.created_at,
      is_edited: false,
      parent_id: null,
      user: {
        full_name: d.name || "Anonymous",
        profile_photo: null,
      },
      replies: [],
      replies_count: 0,
    }));

  // Merge and sort
  const mergedComments = [...comments, ...donorMessages].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="container py-10">
      <MilestoneNotifications
        raised={cause.raised}
        goal={cause.goal}
        causeId={cause.id}
        causeTitle={cause.title}
        userName={cause.user.name}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {(() => {
            // Combine multimedia (images) and video_links (video URLs)
            const allMedia = [
              ...(cause.multimedia || []),
              ...(cause.video_links || []),
            ];

            return allMedia.length > 0 ? (
              <MultimediaCarousel
                media={allMedia}
                coverImage={cause.image || undefined}
                title={cause.title}
              />
            ) : (
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={cause.image || "/placeholder.svg"}
                  alt={cause.title}
                  className="object-cover w-full h-full"
                />
              </div>
            );
          })()}

          <Tabs defaultValue="about">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="donors">Donors</TabsTrigger>
              <TabsTrigger value="comments">
                Comments ({comments.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="space-y-4">
              <h1 className="text-3xl font-bold">{cause.title}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  Created by{" "}
                  <Link
                    href={`/profile/${cause.user_id}`}
                    className="hover:underline text-blue-600"
                  >
                    {cause.user.name}
                  </Link>
                </span>
                <span>•</span>
                <span>{formattedDate}</span>
                <span>•</span>
                <span className="capitalize">{cause.category}</span>
              </div>

              {hasSocialMedia && (
                <div className="flex items-center gap-4 pt-2">
                  {socialMedia.twitter && (
                    <a
                      href={socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-blue-400 transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  {socialMedia.facebook && (
                    <a
                      href={socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-blue-600 transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                  )}
                  {socialMedia.instagram && (
                    <a
                      href={socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-pink-600 transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  )}
                  {socialMedia.linkedin && (
                    <a
                      href={socialMedia.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-blue-700 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                </div>
              )}

              {cause.sections &&
                cause.sections.length > 0 &&
                cause.sections.map((section, index) => (
                  <div key={index} className="mt-4">
                    <h3 className="text-xl font-semibold mb-2">
                      {section.heading}
                    </h3>
                    <p className="text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                ))}
            </TabsContent>
            <TabsContent value="donors">
              <DonorsList donors={donorsList} />
            </TabsContent>
            <CommentsTabWrapper
              initialComments={mergedComments}
              causeId={cause.id}
              currentUserId={user?.id}
            />
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Donation Progress</CardTitle>
              <CardDescription>
                Help us reach our goal of ₦{cause.goal.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">
                    ₦{cause.raised.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">
                    of ₦{cause.goal.toLocaleString()}
                  </span>
                </div>
                <Progress value={percentRaised} />
                <div className="text-sm text-muted-foreground text-right">
                  {percentRaised}% raised
                </div>
              </div>

              <div className="text-sm">
                <div className="flex justify-between py-1">
                  <span>Total donors</span>
                  <span className="font-medium">{donors.length}</span>
                </div>
                <div className="flex justify-between py-1 border-t">
                  <span>Days left</span>
                  <span className="font-medium">{cause.days_active}</span>
                </div>
              </div>

              <div className="pt-4">
                <ShareModal
                  url={`${baseUrl}/causes/${cause.id}`}
                  title={cause.title}
                  entityId={cause.id}
                  entityType="cause"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Make a Donation</CardTitle>
              <CardDescription>
                Choose your preferred donation method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasCreatorWallet ? (
                <div className="space-y-4">
                  <SolanaDonationButtonWrapper causeId={cause.id} />
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or donate with
                      </span>
                    </div>
                    <DonationForm
                      causeId={cause.id}
                      profile={profile}
                      status={cause.status}
                      subaccount={cause?.user.sub_account_code}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Crypto donations are not available for this cause as the
                      creator has not connected their wallet.
                    </AlertDescription>
                  </Alert>
                  <DonationForm
                    causeId={cause.id}
                    profile={profile}
                    status={cause.status}
                    subaccount={cause?.user.sub_account_code}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
