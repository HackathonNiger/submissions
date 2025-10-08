import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus } from "lucide-react"
import { getCurrentUser, getUserCauses } from "@/actions"

// Mock data for user's causes
// const userCauses = [
//   {
//     id: "1",
//     title: "Clean Water Initiative",
//     description: "Providing clean water to communities in rural areas.",
//     category: "Environment",
//     raised: 12500,
//     goal: 20000,
//     status: "approved",
//     created_at: "2023-05-15T10:30:00Z",
//   },
//   {
//     id: "2",
//     title: "Education for All",
//     description: "Supporting education for underprivileged children.",
//     category: "Education",
//     raised: 8700,
//     goal: 15000,
//     status: "approved",
//     created_at: "2023-06-10T14:45:00Z",
//   },
//   {
//     id: "3",
//     title: "Medical Supplies Drive",
//     description: "Collecting medical supplies for local clinics.",
//     category: "Healthcare",
//     raised: 0,
//     goal: 10000,
//     status: "pending",
//     created_at: "2023-07-05T09:15:00Z",
//   },
// ]

export async function DashboardCauses() {
  const user = await getCurrentUser()
  const userCauses = await getUserCauses(user?.id ?? '')
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Causes</h3>
        <Link href="/dashboard/causes/create">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </Link>
      </div>

      {userCauses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h4 className="text-lg font-medium mb-2">No causes yet</h4>
          <p className="text-muted-foreground mb-4">Start making a difference by creating your first cause</p>
          <Link href="/dashboard/causes/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Cause
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userCauses.map((cause) => (
            <Card key={cause.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{cause.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{cause.description}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      cause.status === "approved" ? "default" : cause.status === "pending" ? "secondary" : "destructive"
                    }
                  >
                    {cause.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">₦{cause.raised.toLocaleString()}</span>
                    <span className="text-muted-foreground">of ₦{cause.goal.toLocaleString()}</span>
                  </div>
                  <Progress value={(cause.raised / cause.goal) * 100} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/dashboard/causes/${cause.id}/analytics`}>
                  <Button variant="outline" size="sm">
                    Analytics
                  </Button>
                </Link>
                <Link href={`/causes/${cause.id}`}>
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
  )
}

