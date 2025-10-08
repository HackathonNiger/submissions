import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { LayoutDashboard, Users, BarChart3, Settings, Heart, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useUser } from "../../contexts/UserContext";
import { FaHeartbeat } from "react-icons/fa";

const navigationItems = [
  { title: "Dashboard", url: "/doctor/dashboard", icon: LayoutDashboard },
  { title: "Patients", url: "/doctor/patients", icon: Users },
  { title: "Analytics", url: "/doctor/analytics", icon: BarChart3 },
  { title: "Settings", url: "/doctor/settings", icon: Settings },
];

export function DoctorSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const { user } = useUser();

  if (!user) return null;

  const isActive = (path: string) => currentPath === path;

  const handleLogout = () => {
    // In a real app, this would clear auth tokens
    window.location.href = "/";
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-card border-r">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <FaHeartbeat className="w-8 h-8 text-red-400" />
            {!collapsed && (
              <div>
                <h2 className="text-lg font-semibold text-foreground">Vitalink</h2>
                <p className="text-sm text-muted-foreground">Doctor Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url}>
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Section */}
        <div className="mt-auto p-4 border-t">
          {!collapsed ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold">DR</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">Dr. {user.name}</p>
                  <p className="text-xs text-muted-foreground truncate capitalize">{user.specs}</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Button variant="secondary" size="sm" className="w-full p-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
