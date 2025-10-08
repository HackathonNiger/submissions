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
import { deleteCause, getUserCausesWithStatus } from "@/actions";
import { CauseDropdown } from "./cause-dropdown";

// Mock data for user's causes
const mockUserCauses = [
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

interface MyCausesListProps {
  status: string;
  userId: string;
}

export async function MyCausesList({ status, userId }: MyCausesListProps) {
  const causes = await getUserCausesWithStatus(userId, status);

  const filteredCauses =
    status === "all"
      ? causes
      : causes.filter((cause) => cause.status === status);

  if (filteredCauses.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg bg-muted/20">
        <h3 className="text-lg font-medium mb-2">No causes found</h3>
        {status === "all" ? (
          <p className="text-muted-foreground mb-4">
            You haven't created any causes yet.
          </p>
        ) : status === "approved" ? (
          <p className="text-muted-foreground mb-4">
            You don't have any active causes.
          </p>
        ) : status === "pending" ? (
          <p className="text-muted-foreground mb-4">
            You don't have any causes pending approval.
          </p>
        ) : (
          <p className="text-muted-foreground mb-4">
            You don't have any rejected causes.
          </p>
        )}
        <Link href="/dashboard/causes/create">
          <Button>Create a New Cause</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredCauses.map((cause) => (
        <Card key={cause.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg line-clamp-1">
                  {cause.title}
                </CardTitle>
                {/* <CardDescription className="line-clamp-2">{cause.description}</CardDescription> */}
              </div>
              <div className="flex items-center">
                <Badge
                  variant={
                    cause.status === "approved"
                      ? "default"
                      : cause.status === "pending"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {cause.status}
                </Badge>
                <CauseDropdown causeId={cause.id} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">
                  ₦{cause.raised.toLocaleString()}
                </span>
                <span className="text-muted-foreground">
                  of ₦{cause.goal.toLocaleString()}
                </span>
              </div>
              <Progress value={(cause.raised / cause.goal) * 100} />
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Created:</span>
                <span>{new Date(cause.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Last updated:</span>
                <span>{new Date(cause.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
            {cause.status === "rejected" && cause.rejection_reason && (
              <div className="mt-4 p-2 bg-destructive/10 text-destructive text-sm rounded">
                <strong>Reason:</strong> {cause.rejection_reason}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between pt-4">
            {cause.status === "approved" ? (
              <Link
                href={`/dashboard/causes/${cause.id}/analytics`}
                className="w-full"
              >
                <Button variant="outline" className="w-full">
                  View Analytics
                </Button>
              </Link>
            ) : cause.status === "pending" ? (
              <Button variant="outline" className="w-full" disabled>
                Awaiting Approval
              </Button>
            ) : (
              <Link
                href={`/dashboard/causes/${cause.id}/edit`}
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
