import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { MyCausesList } from "@/components/my-causes-list"
import { getCurrentUser } from "@/actions"
export default async function MyCausesPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/signin")
  }
 const param = await searchParams
  const status = param.status || "all"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Causes</h1>
          <p className="text-muted-foreground">Manage and track all your fundraising causes.</p>
        </div>
        <Link href="/dashboard/causes/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Cause
          </Button>
        </Link>
      </div>

      <Tabs defaultValue={status} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" asChild>
            <Link href="/dashboard/causes">All</Link>
          </TabsTrigger>
          <TabsTrigger value="approved" asChild>
            <Link href="/dashboard/causes?status=approved">Active</Link>
          </TabsTrigger>
          <TabsTrigger value="pending" asChild>
            <Link href="/dashboard/causes?status=pending">Pending</Link>
          </TabsTrigger>
          <TabsTrigger value="rejected" asChild>
            <Link href="/dashboard/causes?status=rejected">Rejected</Link>
          </TabsTrigger>
        </TabsList>
        <TabsContent value={status} className="space-y-4">
          <MyCausesList status={status} userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

