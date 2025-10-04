import AIHealthSuggestions from "./dashboard_components/AIHealthSuggestions";
import PatientInfoCard from "./dashboard_components/PatientInfoCard";
import QuickActions from "./dashboard_components/QuickActions";
import RecentVitals from "./dashboard_components/RecentVitals";

export default function Dashboard() {
  return (
    <div>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Patient Info Card */}
        <PatientInfoCard />

        {/* Recent Vitals */}
        <RecentVitals />

        <div className="grid lg:grid-cols-3 grid-cols-1 gap-8">
          {/* AI Suggestions */}
          <div className="w-full lg:col-span-2">
            <AIHealthSuggestions />
          </div>

          {/* Quick Actions */}
          <div className="w-full">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}
