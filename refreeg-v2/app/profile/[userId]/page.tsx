// app/profile/[userId]/page.tsx
import {
  getProfile,
  getUserCauses,
  listUserDonations,
  getUserPetitions,
} from "@/actions";
import { getCurrentUser } from "@/actions/auth-actions";
import PublicProfile from "@/components/PublicProfile";

// Type definitions for our parameters
type PageParams = {
  userId: string;
};

type SearchParams = {
  tab?: string;
};

export default async function PublicProfilePage({
  params,
}: {
  params: PageParams;
}) {
  // Properly await the params destructuring
  const { userId } = await params;

  // Destructure searchParams

  const currentUser = await getCurrentUser();
  const isOwner = currentUser?.id === userId;

  // Fetch data
  const profile = await getProfile(userId);
  if (!profile) {
    return <div className="text-center py-12">User not found</div>;
  }

  const causes = await getUserCauses(userId).then((causes) =>
    causes.filter((cause) => cause.status === "approved")
  );
  const donations = await listUserDonations(userId).then((donations) =>
    donations.filter(
      (donation) => (donation.cause as any)?.status === "approved"
    )
  );
  const petitions = await getUserPetitions(userId).then((petitions) =>
    petitions.filter((petition) => petition.status === "approved")
  );

  return (
    <div className="relative">
      <PublicProfile
        profile={profile}
        causes={causes}
        donations={donations}
        petitions={petitions}
        userId={userId}
        isOwner={isOwner}
      />
    </div>
  );
}
