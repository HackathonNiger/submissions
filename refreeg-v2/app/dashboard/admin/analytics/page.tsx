import AdminAnalytics from "@/components/admin/AdminAnalytics";
import { getAdminAnalytics } from "@/actions/admin-analytics-actions";

export default async function AdminAnalyticsPage() {
  const analytics = await getAdminAnalytics();

  return <AdminAnalytics analytics={analytics} />;
}
