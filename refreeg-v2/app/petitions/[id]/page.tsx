import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SignatureForm } from "@/components/signature-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getPetition,
  getCurrentUser,
  getProfile,
  listSignaturesForPetition,
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
import { SignersList } from "@/components/signers-list";
import { CommentsSection } from "@/components/comments/comment-section";

// Mock data for a petition
const mockPetition = {
  id: "1",
  title: "Clean Water Initiative",
  description:
    "Providing clean water to communities in rural areas. Access to clean water is a fundamental human right, yet millions of people around the world still lack this basic necessity. This initiative aims to install water purification systems in communities that currently rely on contaminated water sources, reducing waterborne diseases and improving overall health outcomes. Your donation will directly fund the purchase and installation of water filters, the construction of wells, and educational programs on water hygiene and conservation.",
  category: "Environment",
  raised: 12500,
  goal: 20000,
  image: "/placeholder.svg?height=300&width=600",
  user: {
    name: "Environmental Action Group",
    email: "contact@example.org",
  },
  created_at: "2023-05-15T10:30:00Z",
  status: "approved",
};

// Mock Signers data
const mockSigners = [
  {
    id: "1",
    name: "John Doe",
    amount: 500,
    date: "2023-06-01T14:30:00Z",
    message: "Keep up the great work!",
  },
  {
    id: "2",
    name: "Anonymous",
    amount: 1000,
    date: "2023-06-02T09:15:00Z",
    message: null,
  },
  {
    id: "3",
    name: "Sarah Johnson",
    amount: 250,
    date: "2023-06-03T16:45:00Z",
    message: "Happy to support this cause",
  },
  {
    id: "4",
    name: "Anonymous",
    amount: 5000,
    date: "2023-06-04T11:20:00Z",
    message: "Water is life",
  },
  {
    id: "5",
    name: "Michael Brown",
    amount: 750,
    date: "2023-06-05T13:10:00Z",
    message: null,
  },
];

export default async function PetitionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const myparams = params;
  const petition = await getPetition(myparams.id);
  if (!petition) {
    notFound();
  }

  const signers = await listSignaturesForPetition(petition.id);
  let comments: any[] = [];
  try {
    const { listPetitionComments } = await import(
      "@/actions/petition-comment-actions"
    );
    comments = await listPetitionComments(petition.id);
  } catch (e) {
    comments = [];
  }

  // Map signer messages to comment shape and merge with petition comments
  const signerMessages = (signers || [])
    .filter((s: any) => s.message && String(s.message).trim() !== "")
    .map((s: any) => ({
      id: `signer-${s.id}`,
      cause_id: petition.id,
      user_id: s.user_id || "anonymous",
      content: s.message || "",
      created_at: s.created_at,
      updated_at: s.created_at,
      is_edited: false,
      parent_id: null,
      user: {
        full_name: s.name || "Anonymous",
        profile_photo: null,
      },
      replies: [],
      replies_count: 0,
    }));

  const mergedComments = [...comments, ...signerMessages].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Format the date
  const formattedDate = new Date(petition.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // Calculate signature progress based on number of signers
  const percentRaised = Math.min(
    Math.round(((signers?.length || 0) / petition.goal) * 100),
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
  // Check if creator has a wallet
  const creatorProfile = await getProfile(petition.user_id);
  const hasCreatorWallet = !!creatorProfile?.solana_wallet;

  // Parse social media links from JSON string
  let socialMedia = {
    twitter: "",
    facebook: "",
    instagram: "",
    linkedin: "",
  };

  if (creatorProfile?.social_media) {
    try {
      // Handle both string (from DB) and object (already parsed) cases
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

  // Check if any social media links exist
  const hasSocialMedia =
    socialMedia.twitter ||
    socialMedia.facebook ||
    socialMedia.instagram ||
    socialMedia.linkedin;

  // Multimedia logic (carousel)
  const allMedia = Array.isArray((petition as any).multimedia)
    ? (petition as any).multimedia
    : [];
  // Video links (if supported)
  const videoLinks = Array.isArray((petition as any).video_links)
    ? (petition as any).video_links
    : [];

  return (
    <div className="container py-10">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {(() => {
            // Combine multimedia (images) and video_links (video URLs)
            const combinedMedia = [...(allMedia || []), ...(videoLinks || [])];

            return combinedMedia.length > 0 ? (
              <MultimediaCarousel
                media={combinedMedia}
                coverImage={petition.image || undefined}
                title={petition.title}
              />
            ) : (
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={petition.image ?? "/placeholder.svg"}
                  alt={petition.title}
                  className="object-cover w-full h-full"
                />
              </div>
            );
          })()}

          <Tabs defaultValue="about">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="signers">
                Signers ({signers.length})
              </TabsTrigger>
              <TabsTrigger value="comments">
                Comments ({mergedComments.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="space-y-4">
              <h1 className="text-3xl font-bold">{petition.title}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {petition.user && (
                  <span>
                    Created by{" "}
                    <Link
                      href={`/profile/${petition.user_id}`}
                      className="hover:underline text-blue-600"
                    >
                      {petition.user?.name}
                    </Link>
                  </span>
                )}
                <span>•</span>
                <span>{formattedDate}</span>
                <span>•</span>
                <span className="capitalize">{petition.category}</span>
              </div>
              {/* Social Media Links */}
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
              {/* Main description */}
              {petition.description && (
                <p className="whitespace-pre-line text-lg text-neutral-800">
                  {petition.description}
                </p>
              )}
              {/* Video links (if supported) */}
              {videoLinks.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-xl font-semibold mb-2">Videos</h3>
                  <ul className="space-y-2">
                    {videoLinks.map((link: string, idx: number) => (
                      <li key={idx}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Sections */}
              {petition.sections &&
                petition.sections.length > 0 &&
                petition.sections.map((section, index) => (
                  <div key={index} className="mt-4">
                    <h3 className="text-xl font-semibold">{section.heading}</h3>
                    <p className="text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                ))}
            </TabsContent>
            <TabsContent value="signers">
              <SignersList signers={signers} />
            </TabsContent>
            <TabsContent value="comments" className="space-y-4">
              <CommentsSection
                comments={mergedComments as any}
                causeId={petition.id}
                currentUserId={user?.id}
                entityType="petition"
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Signature Progress</CardTitle>
              <CardDescription>
                Help us reach our goal of {petition.goal.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{signers.length}</span>
                  <span className="text-muted-foreground">
                    of {petition.goal.toLocaleString()}
                  </span>
                </div>
                <Progress value={percentRaised} />
                <div className="text-sm text-muted-foreground text-right">
                  {percentRaised}% of goal
                </div>
              </div>

              <div className="text-sm">
                <div className="flex justify-between py-1">
                  <span>Total signers</span>
                  <span className="font-medium">{signers.length}</span>
                </div>
                <div className="flex justify-between py-1 border-t">
                  <span>Days Left</span>
                  <span className="font-medium">{petition.days_active}</span>
                </div>
              </div>

              <div className="pt-4">
                <ShareModal
                  url={`${baseUrl}/petitions/${petition.id}`}
                  title={petition.title}
                  entityId={petition.id}
                  entityType="petition"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sign a Petition</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <SignatureForm
                  petitionId={petition.id}
                  profile={profile}
                  status={petition.status}
                  subaccount={petition?.user?.sub_account_code}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
