"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import {
  CauseCard,
  DonationCard,
  EmptyState,
  PetitionCard,
} from "./ProfileCards";
import { ExpandableCard } from "./ExpandableCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryState } from "nuqs";

type ProfileProps = {
  profile: any;
  causes: any[];
  donations: any[];
  petitions: any[];
  userId: string;
  isOwner: boolean;
};

export default function PublicProfile({
  profile,
  causes,
  donations,
  petitions,
  userId,
  isOwner,
}: ProfileProps) {
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "causes",
    shallow: false,
  });

  const donationsCount = donations.length;
  const causesCount = causes.length;
  const petitionsCount = petitions.length;

  const handleBack = () => {
    window.history.back();
  };

  // Default profile image configuration
  const defaultProfileImage = "/default-avatar.jpg";
  const profileImage = profile.profile_photo || defaultProfileImage;
  const displayName = profile.full_name || "Anonymous";

  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div>
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Profile Header - Full width aligned left */}
        <div className="flex flex-col md:flex-row gap-6 items-start mt-6 w-full">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100">
            <Image
              src={profileImage}
              alt={`${displayName}'s profile picture`}
              fill
              className="object-cover"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = defaultProfileImage;
              }}
            />
          </div>

          <div className="flex-1 w-full">
            <div>
              <h1 className="text-2xl font-bold">{displayName}</h1>
            </div>

            {/* Stats */}
            <div className="flex gap-4 mt-4 text-sm">
              <span className="text-gray-700">
                <span className="font-semibold">{causesCount}</span>{" "}
                {causesCount === 1 ? "cause" : "causes"}
              </span>
              <span className="text-gray-700">
                <span className="font-semibold">{donationsCount}</span>{" "}
                {donationsCount === 1 ? "donation" : "donations"}
              </span>
              <span className="text-gray-700">
                <span className="font-semibold">{petitionsCount}</span>{" "}
                {petitionsCount === 1 ? "petition" : "petitions"}
              </span>
            </div>

            {/* Bio */}
            <p className="mt-4 text-gray-700">{profile.bio || "No Bio Yet"}</p>
          </div>
        </div>

        {/* Custom-styled shadcn Tabs - Full width */}
        <div className="border-b mt-8 w-full">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <div className="flex justify-center">
              <TabsList className="bg-transparent p-0 gap-0">
                <TabsTrigger
                  value="causes"
                  className="px-6 py-2 font-medium flex items-center gap-2 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none text-gray-500 hover:text-gray-700 rounded-none"
                >
                  Causes
                  {causesCount > 0 && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {causesCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="donations"
                  className="px-6 py-2 font-medium flex items-center gap-2 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none text-gray-500 hover:text-gray-700 rounded-none"
                >
                  Donations
                  {donationsCount > 0 && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {donationsCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="petitions"
                  className="px-6 py-2 font-medium flex items-center gap-2 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none text-gray-500 hover:text-gray-700 rounded-none"
                >
                  Petitions
                  {petitionsCount > 0 && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {petitionsCount}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="mt-6 w-full">
              <TabsContent value="causes">
                {causesCount === 0 ? (
                  <EmptyState
                    title="No Causes Yet"
                    description={`It looks like ${
                      displayName.split(" ")[0] || "this user"
                    } hasn't started a cause yet. Stay tuned for their first impact story!`}
                    cta="Explore causes on refreeg"
                    ctaLink="/causes"
                  />
                ) : (
                  <ExpandableCard
                    items={causes.map((cause) => ({
                      id: cause.id,
                      title: cause.title,
                      description: cause.description,
                      image: cause.image,
                      goal: cause.goal || 0,
                      raised: cause.raised || 0,
                      category: cause.category || "Cause",
                      sections: cause.sections || [],
                    }))}
                    type="cause"
                  />
                )}
              </TabsContent>
              <TabsContent value="donations">
                {donationsCount === 0 ? (
                  <EmptyState
                    title="No Donations Yet"
                    description={`${
                      displayName.split(" ")[0] || "This user"
                    } hasn't donated to any causes yet.`}
                    cta="Explore causes on refreeg"
                    ctaLink="/causes"
                  />
                ) : (
                  <div className="space-y-4 w-full">
                    {donations.map((donation) => (
                      <DonationCard key={donation.id} donation={donation} />
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="petitions">
                {petitionsCount === 0 ? (
                  <EmptyState
                    title="No Petitions Yet"
                    description={`${
                      displayName.split(" ")[0] || "This user"
                    } hasn't created any petitions yet.`}
                    cta="Explore petitions on refreeg"
                    ctaLink="/petitions"
                  />
                ) : (
                  <ExpandableCard
                    items={petitions.map((petition) => ({
                      id: petition.id,
                      title: petition.title,
                      description: petition.description,
                      image: petition.image,
                      goal: petition.goal || 0,
                      signatures: petition.signatures || 0,
                      category: petition.category || "Petition",
                      sections: petition.sections || [],
                    }))}
                    type="petition"
                  />
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
