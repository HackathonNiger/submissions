import HospitalInfo from "./dashboard_components/HospitalInfo";
import QuickActions from "./dashboard_components/QuickActions";
import RecentPatients from "./dashboard_components/RecentPatients";
import StatsGrid from "./dashboard_components/StatsGrid";

export default function Dashboard() {
  return (
    <div>
      <div className="">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats Grid */}
          <StatsGrid />

          <div className="grid lg:grid-cols-3 grid-cols-1 gap-8">
            {/* Recent Patients */}
            <div className="w-full lg:col-span-2">
              <RecentPatients />
            </div>

            {/* Quick Actions */}
            <div className="w-full">
              <QuickActions />
            </div>
          </div>

          {/* Hospital Information */}
          <HospitalInfo />
        </div>
      </div>
    </div>
  );
}
