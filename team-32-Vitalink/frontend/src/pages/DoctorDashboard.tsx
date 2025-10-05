import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { DoctorSidebar } from "../components/sidebars/DoctorSidebar";
import { Button } from "../components/ui/button";
import { Bell } from "lucide-react";
import Dashboard from "../components/sections/doctors/Dashboard";
import { useUser } from "../contexts/UserContext";

const DoctorDashboard = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DoctorSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center px-6">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1">
              <h1 className="text-sm md:text-lg lg:text-2xl font-bold text-foreground">Doctor Dashboard</h1>
              <p className="text-sm text-muted-foreground flex gap-1">
                Welcome back, Dr. <strong className="sm:block hidden">{user.name}</strong>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <Dashboard />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DoctorDashboard;
