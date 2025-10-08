// components/profile/ProfileCards.tsx
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Component for empty states
export function EmptyState({
  title,
  description,
  cta,
  ctaLink,
}: {
  title: string;
  description: string;
  cta: string;
  ctaLink: string;
}) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-500 max-w-md mx-auto">{description}</p>
      <Button className="mt-4" asChild>
        <Link href={ctaLink}>{cta}</Link>
      </Button>
    </div>
  );
}

// Component for cause cards
export function CauseCard({ cause }: { cause: any }) {
  const progressPercentage = Math.min(
    Math.round((cause.raised / cause.goal) * 100),
    100
  );

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/causes/${cause.id}`}>
        <div className="aspect-video relative bg-gray-100">
          <Image
            src={cause.image || "/placeholder-cause.jpg"}
            alt={cause.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="text-xs px-2 py-1 rounded-full"
            >
              {cause.category}
            </Badge>
          </div>
          <h3 className="font-medium line-clamp-2">{cause.title}</h3>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">
                ₦{cause.raised.toLocaleString()}
              </span>
              <span className="text-gray-500">
                of ₦{cause.goal.toLocaleString()}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-gray-200" />
            <div className="text-xs text-gray-500 text-right">
              {progressPercentage}% funded
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// Component for donation cards
export function DonationCard({ donation }: { donation: any }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex justify-between">
        <div>
          <p className="font-medium">₦{donation.amount.toLocaleString()}</p>
          <p className="text-sm text-gray-500">
            {new Date(donation.created_at).toLocaleDateString()}
          </p>
        </div>
        {donation.cause_id && (
          <Link
            href={`/causes/${donation.cause_id}`}
            className="text-blue-600 hover:underline text-sm"
          >
            View Cause
          </Link>
        )}
      </div>
      {donation.message && (
        <p className="mt-2 text-sm italic">"{donation.message}"</p>
      )}
    </div>
  );
}

// Component for petition cards
export function PetitionCard({ petition }: { petition: any }) {
  const signatureCount = petition.signatures ?? 0;
  const goal = petition.goal ?? 0;

  const progressPercentage =
    goal > 0 ? Math.min(Math.round((signatureCount / goal) * 100), 100) : 0;

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/petitions/${petition.id}`}>
        <div className="aspect-video relative bg-gray-100">
          <Image
            src={petition.image || "/placeholder-petition.jpg"}
            alt={petition.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="text-xs px-2 py-1 rounded-full"
            >
              {petition.category || "Petition"}
            </Badge>
          </div>

          <h3 className="font-medium line-clamp-2">{petition.title}</h3>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">
                {signatureCount.toLocaleString()} signatures
              </span>
              {goal > 0 && (
                <span className="text-gray-500">
                  of {goal.toLocaleString()}
                </span>
              )}
            </div>

            {goal > 0 && (
              <>
                <Progress
                  value={progressPercentage}
                  className="h-2 bg-gray-200"
                />
                <div className="text-xs text-gray-500 text-right">
                  {progressPercentage}% reached
                </div>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
