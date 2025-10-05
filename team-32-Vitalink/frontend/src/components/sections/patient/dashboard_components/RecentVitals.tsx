import { Activity, Heart, Thermometer, Droplets } from "lucide-react";
import { Card, CardContent, CardHeader } from "../../../ui/card";
import { Button } from "../../../ui/button";

type VitalStatus = "normal" | "low" | "slightly-high" | "high" | "critical";

interface Vital {
  name: string;
  value: string;
  unit: string;
  status: VitalStatus;
  icon: React.ElementType;
  lastUpdated: string;
}

export default function RecentVitals() {
  const recentVitals: Vital[] = [
    {
      name: "Blood Pressure",
      value: "135/88",
      unit: "mmHg",
      status: "slightly-high",
      icon: Heart,
      lastUpdated: "2 hours ago",
    },
    {
      name: "Heart Rate",
      value: "102",
      unit: "bpm",
      status: "high",
      icon: Activity,
      lastUpdated: "1 hour ago",
    },
    {
      name: "Temperature",
      value: "100.2",
      unit: "°F",
      status: "slightly-high",
      icon: Thermometer,
      lastUpdated: "30 mins ago",
    },
    {
      name: "Blood Sugar",
      value: "65",
      unit: "mg/dL",
      status: "low",
      icon: Droplets,
      lastUpdated: "4 hours ago",
    },
  ];

  const getStatusColor = (status: VitalStatus) => {
    switch (status) {
      case "normal":
        return "text-green-600 border-green-600 bg-green-100";
      case "low":
        return "text-blue-600 border-blue-600 bg-blue-100";
      case "slightly-high":
        return "text-yellow-600 border-yellow-600 bg-yellow-100";
      case "high":
        return "text-orange-600 border-orange-600 bg-orange-100";
      case "critical":
        return "text-red-600 border-red-600 bg-red-100";
      default:
        return "text-gray-600 border-gray-400 bg-gray-100";
    }
  };

  const getStatusLabel = (status: VitalStatus) => {
    switch (status) {
      case "normal":
        return "Normal";
      case "low":
        return "Low";
      case "slightly-high":
        return "Slightly High";
      case "high":
        return "High";
      case "critical":
        return "Critical";
      default:
        return "Unknown";
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
              <span className="md:block hidden text-3xl">•</span>
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
                  <vital.icon
                    className={`h-6 w-6 ${
                      vital.status === "critical"
                        ? "text-red-600"
                        : vital.status === "high"
                        ? "text-orange-500"
                        : vital.status === "slightly-high"
                        ? "text-yellow-500"
                        : vital.status === "low"
                        ? "text-blue-500"
                        : "text-green-500"
                    }`}
                  />
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      vital.status
                    )}`}
                  >
                    {getStatusLabel(vital.status)}
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
