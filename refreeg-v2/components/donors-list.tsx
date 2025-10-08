import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Donation } from "@/types";

interface DonorsListProps {
  donors: Donation[];
}

export function DonorsList({ donors }: DonorsListProps) {
  // Sort donors by date (most recent first)
  const sortedDonors = [...donors].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Recent Donors</h2>
      {sortedDonors.length === 0 ? (
        <p className="text-muted-foreground">
          No donations yet. Be the first to donate!
        </p>
      ) : (
        <div className="space-y-4">
          {sortedDonors.map((donor) => (
            <Card key={donor.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {donor.name === "Anonymous"
                        ? "A"
                        : donor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{donor.name}</CardTitle>
                    <CardDescription>
                      {new Date(donor.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </div>
                  <div className="ml-auto">
                    <span className="font-bold">
                      ₦{donor.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardHeader>
              {donor.message && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {donor.message}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
