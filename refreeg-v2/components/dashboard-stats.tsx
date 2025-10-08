import { Users, CreditCard, TrendingUp } from "lucide-react";
import { AnalyticsCard } from "@/components/analytics-card";
import { getDashboardStats } from "@/actions/dashboard-actions";
import { getCurrentUser } from "@/actions/auth-actions";
import { getPetitionDashboardStats } from "@/actions/dashboard-actions";

export async function DashboardStats({
  type = "all",
  userId,
}: {
  type?: "cause" | "petition" | "all";
  userId?: string;
}) {
  if (!userId) return null;
  let stats = null;
  if (type === "cause" || type === "all") {
    stats = await getDashboardStats(userId);
  }
  let petitionStats = null;
  if (type === "petition" || type === "all") {
    petitionStats = await getPetitionDashboardStats(userId);
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats && (
        <>
          <AnalyticsCard
            title="Total Raised"
            value={stats.totalRaised}
            description="Total amount raised from donations"
            icon={CreditCard}
          />
          <AnalyticsCard
            title="Total Donors"
            value={stats.totalDonors}
            description="Total number of unique donors"
            icon={Users}
          />
          <AnalyticsCard
            title="Active Causes"
            value={stats.activeCauses}
            description="Number of approved causes"
            icon={TrendingUp}
          />
        </>
      )}
      {petitionStats && (
        <>
          <AnalyticsCard
            title="Total Signatures"
            value={petitionStats.totalDonors ?? 0}
            description="Total number of petition signatures"
            icon={Users}
          />
          <AnalyticsCard
            title="Active Petitions"
            value={petitionStats.activePetitions ?? 0}
            description="Number of approved petitions"
            icon={TrendingUp}
          />
        </>
      )}
    </div>
  );
}
