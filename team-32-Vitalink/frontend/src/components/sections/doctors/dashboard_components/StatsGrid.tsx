import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Users, UserPlus, Bell, Calendar } from "lucide-react";

export default function StatsGrid() {
  const stats = [
    {
      title: "Total Patients",
      value: "247",
      description: "Active patients under your care",
      icon: Users,
      trend: "+12 this month",
      trendUp: true,
    },
    {
      title: "New Requests",
      value: "8",
      description: "Pending patient requests",
      icon: UserPlus,
      trend: "3 urgent",
      trendUp: false,
    },
    {
      title: "Appointments Today",
      value: "12",
      description: "Scheduled consultations",
      icon: Calendar,
      trend: "2 virtual",
      trendUp: true,
    },
    {
      title: "Critical Alerts",
      value: "3",
      description: "Patients requiring attention",
      icon: Bell,
      trend: "Review needed",
      trendUp: false,
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-soft hover:shadow-medium transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              <div className={`text-xs mt-2 ${stat.trendUp ? "text-success" : "text-warning"}`}>{stat.trend}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
