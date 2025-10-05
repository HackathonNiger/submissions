import { MessageCircle } from "lucide-react";
import Dashboard from "../components/sections/patient/Dashboard";
import { PatientSidebar } from "../components/sidebars/PatientSidebar";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { Button } from "../components/ui/button";
import { useUser } from "../contexts/UserContext";

const PatientDashboard = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <PatientSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center px-6">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1">
              <h1 className="text-sm md:text-lg lg:text-2xl font-bold text-foreground">
                Patient Dashboard
              </h1>
              <p className="text-sm text-muted-foreground flex gap-1">
                Welcome back, <strong>{user.username}!</strong>{" "}
                <span className="hidden md:block">
                  your health journey continues.
                </span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4" />
                <span className="md:block hidden">mental health</span>chatbot
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6">
            <Dashboard />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PatientDashboard;
