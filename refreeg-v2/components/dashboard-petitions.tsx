import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";
import {
  getCurrentUser,
  getUserPetitions,
  listSignaturesForPetition,
} from "@/actions";

export async function DashboardPetitions() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="text-center py-10 border rounded-lg bg-muted/20">
        <h3 className="text-lg font-medium mb-2">Please sign in</h3>
        <p className="text-muted-foreground mb-4">
          You need to log in to see your petitions.
        </p>
        <Link href="/auth/login">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  const petitions = await getUserPetitions(user.id);

  // attach signatures count
  const petitionsWithSigners = await Promise.all(
    petitions.map(async (petition) => {
      const signers = await listSignaturesForPetition(petition.id);
      return { ...petition, signatures: signers.length };
    })
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Petitions</h3>
        <Link href="/dashboard/petitions/create">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </Link>
      </div>

      {petitionsWithSigners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h4 className="text-lg font-medium mb-2">No petitions yet</h4>
          <p className="text-muted-foreground mb-4">
            Start making a difference by creating your first petition
          </p>
          <Link href="/dashboard/petitions/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Petition
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {petitionsWithSigners.map((petition) => (
            <Card key={petition.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{petition.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {petition.description}
                    </CardDescription>
                  </div>
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
              </CardContent>

              <CardFooter className="flex justify-between">
                <Link href={`/dashboard/petitions/${petition.id}/analytics`}>
                  <Button variant="outline" size="sm">
                    Analytics
                  </Button>
                </Link>
                <Link href={`/petitions/${petition.id}`}>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
