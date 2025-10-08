import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import { SignatureTrends } from "@/components/charts/signature-trends";
import { PetitionEngagementMetrics } from "@/components/charts/engagement-metrics";
import { getPetitionAnalytics } from "@/actions/dashboard-actions";

export default async function AnalyticsPage({
  params,
}: {
  params: { id: string };
}) {
  const Params = await params;
  const analytics = await getPetitionAnalytics(Params.id);

  if (!analytics) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Error Loading Analytics</h1>
          <p className="text-muted-foreground">
            Unable to load analytics data for this Petition.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Petition Analytics</h1>
        <p className="text-muted-foreground">
          Track your petition's performance and engagement
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Signatures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analytics.overview.totalSignatures)}
            </div>
            <p className="text-xs text-muted-foreground">
              from {analytics.overview.totalSigners} donors
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Average Signature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analytics.overview.averageSignature)}
            </div>
            <p className="text-xs text-muted-foreground">per signer</p>
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
          <SignatureTrends data={analytics.signatures.daily} />
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <PetitionEngagementMetrics {...analytics.engagement} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
