import { Activity, Heart, Thermometer, Droplets } from "lucide-react";
import { Card, CardContent, CardHeader } from "../../../ui/card";
import { Button } from "../../../ui/button";

export default function RecentVitals() {
  const recentVitals = [
    {
      name: "Blood Pressure",
      value: "120/80",
      unit: "mmHg",
      status: "normal",
      icon: Heart,
      lastUpdated: "2 hours ago",
    },
    {
      name: "Heart Rate",
      value: "72",
      unit: "bpm",
      status: "normal",
      icon: Activity,
      lastUpdated: "2 hours ago",
    },
    {
      name: "Temperature",
      value: "98.6",
      unit: "°F",
      status: "normal",
      icon: Thermometer,
      lastUpdated: "2 hours ago",
    },
    {
      name: "Blood Sugar",
      value: "95",
      unit: "mg/dL",
      status: "normal",
      icon: Droplets,
      lastUpdated: "4 hours ago",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-success border-success bg-success-light";
      case "warning":
        return "text-warning border-warning bg-warning-light";
      case "critical":
        return "text-destructive border-destructive bg-destructive/10";
      default:
        return "text-primary border-primary bg-primary/10";
    }
  };

  return (
    <div>
      <div className="">
        <div className="w-full flex justify-between items-center mb-3">
          <h3 className="text-xl font-semibold text-foreground">
            Recent Vitals
          </h3>

          <div className="flex items-center space-x-4">
            <p>Check vitals :</p>
            <Button
              variant="outline"
              size="sm"
              className="text-red-700 hover:text-red-600"
            >
              <span className="md:block hidden text-3xl ">•</span>
              Device not connected
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentVitals.map((vital, index) => (
            <Card
              key={index}
              className="shadow-soft hover:shadow-medium transition-all duration-300"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <vital.icon className="h-6 w-6 text-primary" />
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      vital.status
                    )}`}
                  >
                    {vital.status}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="font-medium text-foreground mb-1">
                  {vital.name}
                </h4>
                <div className="text-2xl font-bold text-foreground">
                  {vital.value}
                  <span className="text-sm text-muted-foreground ml-1">
                    {vital.unit}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Updated {vital.lastUpdated}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
