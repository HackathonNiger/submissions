import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, ExternalLink } from "lucide-react"
import { listUserDonations } from "@/actions"

// Mock data for user's donations
const mockUserDonations = [
  {
    id: "1",
    cause_id: "1",
    cause_title: "Clean Water Initiative",
    amount: 2500,
    date: "2023-06-15T10:30:00Z",
    status: "completed",
    receipt_url: "#",
    is_anonymous: false,
  },
  {
    id: "2",
    cause_id: "2",
    cause_title: "Education for All",
    amount: 1000,
    date: "2023-07-20T14:45:00Z",
    status: "completed",
    receipt_url: "#",
    is_anonymous: true,
  },
  {
    id: "3",
    cause_id: "5",
    cause_title: "Disaster Relief Fund",
    amount: 5000,
    date: "2023-08-05T09:15:00Z",
    status: "completed",
    receipt_url: "#",
    is_anonymous: false,
  },
  {
    id: "4",
    cause_id: "6",
    cause_title: "Animal Shelter Support",
    amount: 1500,
    date: "2023-09-10T11:30:00Z",
    status: "completed",
    receipt_url: "#",
    is_anonymous: false,
  },
  {
    id: "5",
    cause_id: "7",
    cause_title: "Renewable Energy Project",
    amount: 3000,
    date: "2023-10-01T08:45:00Z",
    status: "completed",
    receipt_url: "#",
    is_anonymous: true,
  },
]

interface MyDonationsListProps {
  userId: string
  timeframe?: "all" | "recent"
  showReceipts?: boolean
}

export async function MyDonationsList({ userId, timeframe = "all", showReceipts = false }: MyDonationsListProps) {
  
  const donations = await listUserDonations(userId, timeframe)

  // Use mock data for now
  let filteredDonations = donations
  if (timeframe === "recent") {
    // Filter to only show donations from the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    filteredDonations = filteredDonations.filter((donation) => new Date(donation.created_at) >= thirtyDaysAgo)
  }

  // Calculate total amount donated
  const totalDonated = filteredDonations.reduce((sum, donation) => sum + donation.amount, 0)

  if (filteredDonations.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg bg-muted/20">
        <h3 className="text-lg font-medium mb-2">No donations found</h3>
        <p className="text-muted-foreground mb-4">
          {timeframe === "recent"
            ? "You haven't made any donations in the last 30 days."
            : "You haven't made any donations yet."}
        </p>
        <Link href="/causes">
          <Button>Explore Causes</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="text-sm text-muted-foreground">Total Donated</div>
        <div className="text-3xl font-bold">₦{totalDonated.toLocaleString()}</div>
        <div className="text-sm text-muted-foreground mt-1">
          Across {filteredDonations.length} donation{filteredDonations.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="space-y-4">
        {filteredDonations.map((donation) => (
          <Card key={donation.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{donation.cause.title}</CardTitle>
                  <CardDescription>
                    {new Date(donation.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardDescription>
                </div>
                <div className="flex items-center">
                  <Badge variant="outline">{donation.is_anonymous ? "Anonymous" : "Public"}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">₦{donation.amount.toLocaleString()}</div>
                <Badge variant="default">{donation.status}</Badge>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-4">
              <Link href={`/causes/${donation.cause_id}`}>
                <Button variant="outline" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Cause
                </Button>
              </Link>
              <Button variant="ghost" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Receipt
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

