import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import { DonationTrends } from "@/components/charts/donation-trends";
import { EngagementMetrics } from "@/components/charts/engagement-metrics";
import { getCauseAnalytics } from "@/actions/dashboard-actions";

export default async function AnalyticsPage({
  params,
}: {
  params: { id: string };
}) {
  const Params = await params;
  const analytics = await getCauseAnalytics(Params.id);

  if (!analytics) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Error Loading Analytics</h1>
          <p className="text-muted-foreground">
            Unable to load analytics data for this cause.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Cause Analytics</h1>
        <p className="text-muted-foreground">
          Track your cause's performance and engagement
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analytics.overview.totalDonations)}
            </div>
            <p className="text-xs text-muted-foreground">
              from {analytics.overview.totalDonors} donors
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Average Donation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analytics.overview.averageDonation)}
            </div>
            <p className="text-xs text-muted-foreground">per donor</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.overview.completionPercentage.toFixed(1)}%
            </div>
            <Progress
              value={analytics.overview.completionPercentage}
              className="mt-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Days left</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.overview.daysActive}
            </div>
            <p className="text-xs text-muted-foreground">since launch</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="donations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="donations" className="space-y-4">
          <DonationTrends data={analytics.donations.daily} />
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <EngagementMetrics {...analytics.engagement} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
