"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { AnalyticsData } from "@/actions/admin-analytics-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useAdmin } from "@/hooks/use-admin";
import { BarChart, Users, DollarSign, TrendingUp } from "lucide-react";
import { AnalyticsCard } from "@/components/analytics-card";

export default function AdminAnalytics({
  analytics,
}: {
  analytics: AnalyticsData;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const { isAdminOrManager, isLoading: adminLoading } = useAdmin(user?.id);

  useEffect(() => {
    if (!adminLoading && !isAdminOrManager && user) {
      router.push("/dashboard");
    }
  }, [user, adminLoading, isAdminOrManager, router]);

  if (adminLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!isAdminOrManager) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            You do not have permission to access this page.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Platform statistics and performance metrics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          title="Total Donations"
          value={analytics.totalDonations.current}
          description={analytics.totalDonations.percentageChange}
          icon={DollarSign}
        />
        <AnalyticsCard
          title="Total Users"
          value={String(analytics.totalUsers.current)}
          description={analytics.totalUsers.percentageChange}
          icon={Users}
        />
        <AnalyticsCard
          title="Active Causes"
          value={String(analytics.activeCauses.current)}
          description={analytics.activeCauses.percentageChange}
          icon={TrendingUp}
        />
        <AnalyticsCard
          title="Pending Approvals"
          value={String(analytics.pendingApprovals.current)}
          description={analytics.pendingApprovals.percentageChange}
          icon={BarChart}
        />
      </div>

      <Tabs defaultValue="donations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="causes">Causes</TabsTrigger>
        </TabsList>
        <TabsContent value="donations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Donation Trends</CardTitle>
              <CardDescription>
                Monthly donation volume over time.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center bg-muted/50">
              <p className="text-muted-foreground">
                Donation chart will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>
                New user registrations over time.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center bg-muted/50">
              <p className="text-muted-foreground">
                User growth chart will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="causes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cause Categories</CardTitle>
              <CardDescription>
                Distribution of causes by category.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center bg-muted/50">
              <p className="text-muted-foreground">
                Cause categories chart will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
