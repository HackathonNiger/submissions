import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  deletePetition,
  getUserPetitionsWithStatus,
  listSignaturesForPetition,
} from "@/actions";
import { PetitionDropdown } from "./petition-dropdown";

// Mock data for user's petitions
const mockUserPetition = [
  {
    id: "1",
    title: "Clean Water Initiative",
    description: "Providing clean water to communities in rural areas.",
    category: "Environment",
    raised: 12500,
    goal: 20000,
    status: "approved",
    created_at: "2023-05-15T10:30:00Z",
    updated_at: "2023-05-16T08:45:00Z",
  },
  {
    id: "2",
    title: "Education for All",
    description: "Supporting education for underprivileged children.",
    category: "Education",
    raised: 8700,
    goal: 15000,
    status: "approved",
    created_at: "2023-06-10T14:45:00Z",
    updated_at: "2023-06-11T09:30:00Z",
  },
  {
    id: "3",
    title: "Medical Supplies Drive",
    description: "Collecting medical supplies for local clinics.",
    category: "Healthcare",
    raised: 0,
    goal: 10000,
    status: "pending",
    created_at: "2023-07-05T09:15:00Z",
    updated_at: "2023-07-05T09:15:00Z",
  },
  {
    id: "4",
    title: "Community Garden Project",
    description: "Creating a sustainable garden in our neighborhood.",
    category: "Community",
    raised: 0,
    goal: 5000,
    status: "rejected",
    created_at: "2023-07-10T11:30:00Z",
    updated_at: "2023-07-12T15:20:00Z",
    rejection_reason:
      "Insufficient details provided about project implementation.",
  },
];

interface MyPetitionsListProps {
  status: string;
  userId: string;
}

export async function MyPetitionsList({
  status,
  userId,
}: MyPetitionsListProps) {
  const petitions = await getUserPetitionsWithStatus(userId, status);

  // 1. Filter petitions first
  const filteredPetitions =
    status === "all"
      ? petitions
      : petitions.filter((petition) => petition.status === status);

  // 2. Then attach signature counts
  const petitionsWithSigners = await Promise.all(
    filteredPetitions.map(async (petition) => {
      const signers = await listSignaturesForPetition(petition.id);
      return {
        ...petition,
        signatures: signers.length,
      };
    })
  );

  if (petitionsWithSigners.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg bg-muted/20">
        <h3 className="text-lg font-medium mb-2">No petitions found</h3>
        {status === "all" ? (
          <p className="text-muted-foreground mb-4">
            You haven't created any petitions yet.
          </p>
        ) : status === "approved" ? (
          <p className="text-muted-foreground mb-4">
            You don't have any active petitions.
          </p>
        ) : status === "pending" ? (
          <p className="text-muted-foreground mb-4">
            You don't have any petitions pending approval.
          </p>
        ) : (
          <p className="text-muted-foreground mb-4">
            You don't have any rejected petitions.
          </p>
        )}
        <Link href="/dashboard/petitions/create">
          <Button>Create a New Petition</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {petitionsWithSigners.map((petition) => (
        <Card key={petition.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg line-clamp-1">
                  {petition.title}
                </CardTitle>
              </div>
              <div className="flex items-center">
                <Badge
                  variant={
                    petition.status === "approved"
                      ? "default"
                      : petition.status === "pending"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {petition.status}
                </Badge>
                <PetitionDropdown petitionId={petition.id} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">
                  {petition.signatures} signatures
                </span>
                <span className="text-muted-foreground">
                  of {petition.goal.toLocaleString()}
                </span>
              </div>
              <Progress
                value={Math.min(
                  (petition.signatures / petition.goal) * 100,
                  100
                )}
              />
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Created:</span>
                <span>
                  {new Date(petition.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last updated:</span>
                <span>
                  {new Date(petition.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            {petition.status === "rejected" && petition.rejection_reason && (
              <div className="mt-4 p-2 bg-destructive/10 text-destructive text-sm rounded">
                <strong>Reason:</strong> {petition.rejection_reason}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between pt-4">
            {petition.status === "approved" ? (
              <Link
                href={`/dashboard/petitions/${petition.id}/analytics`}
                className="w-full"
              >
                <Button variant="outline" className="w-full">
                  View Analytics
                </Button>
              </Link>
            ) : petition.status === "pending" ? (
              <Button variant="outline" className="w-full" disabled>
                Awaiting Approval
              </Button>
            ) : (
              <Link
                href={`/dashboard/petitions/${petition.id}/edit`}
                className="w-full"
              >
                <Button variant="outline" className="w-full">
                  Revise & Resubmit
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
