import { Activity, Heart, Thermometer, Droplets } from "lucide-react";
import { Card, CardContent, CardHeader } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { useEffect, useState } from "react";
import { pullVitals } from "../../../../services/vitalService";

type VitalStatus = "normal" | "low" | "slightly-high" | "high" | "critical";

interface Vital {
  name: string;
  value: string | number;
  unit: string;
  status: VitalStatus;
  icon: React.ElementType;
  lastUpdated: string;
}

interface RecentVitalsProps {
  spo2?: number;
  bpm?: number;
  temp?: number;
  sbp?: number;
  dbp?: number;
  current_step_count?: number;
  alert?: string;
  online?: boolean;
}

interface RecentVitalsProps {
  onVitalsUpdate?: (vitals: Vital[]) => void;
}

export default function RecentVitals({ onVitalsUpdate }: RecentVitalsProps) {
  const [vitals, setVitals] = useState<RecentVitalsProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const data = await pullVitals();
        if (data) {
          setVitals(data);

          // Build the array of vitals and send it upward
          const formatted = [
            {
              name: "Blood Pressure",
              value: `${data.sbp}/${data.dbp}`,
              unit: "mmHg",
              status: getStatus("Blood Pressure", `${data.sbp}/${data.dbp}`),
              icon: Heart,
              lastUpdated: "Just now",
            },
            {
              name: "Heart Rate",
              value: data.bpm || 0,
              unit: "bpm",
              status: getStatus("Heart Rate", data.bpm || 0),
              icon: Activity,
              lastUpdated: "Just now",
            },
            {
              name: "Temperature",
              value: data.temp || 0,
              unit: "°F",
              status: getStatus("Temperature", data.temp || 0),
              icon: Thermometer,
              lastUpdated: "Just now",
            },
            {
              name: "Oxygen Level",
              value: data.spo2 || 0,
              unit: "%",
              status: getStatus("Oxygen Level", data.spo2 || 0),
              icon: Droplets,
              lastUpdated: "Just now",
            },
          ];
          onVitalsUpdate?.(formatted); // 👈 send vitals up to Dashboard
        }
      } catch (err) {
        console.error("Error fetching vitals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVitals();
    const interval = setInterval(fetchVitals, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatus = (name: string, value: number | string): VitalStatus => {
    switch (name) {
      case "Blood Pressure":
        const [sbp, dbp] =
          typeof value === "string" ? value.split("/").map(Number) : [0, 0];
        if (sbp < 90 || dbp < 60) return "low";
        if (sbp > 140 || dbp > 90) return "high";
        if (sbp >= 120 && sbp <= 139) return "slightly-high";
        return "normal";
      case "Heart Rate":
        if (Number(value) < 60) return "low";
        if (Number(value) > 100) return "high";
        return "normal";
      case "Temperature":
        if (Number(value) < 97) return "low";
        if (Number(value) > 100.4) return "slightly-high";
        if (Number(value) > 102) return "high";
        return "normal";
      case "Oxygen Level":
        if (Number(value) < 90) return "critical";
        if (Number(value) < 95) return "slightly-high";
        return "normal";
      default:
        return "normal";
    }
  };

  // Even when vitals are null (loading), create placeholder cards
  const liveVitals: Vital[] = [
    {
      name: "Blood Pressure",
      value: vitals ? `${vitals.sbp}/${vitals.dbp}` : "--/--",
      unit: "mmHg",
      status: vitals
        ? getStatus("Blood Pressure", `${vitals.sbp}/${vitals.dbp}`)
        : "normal",
      icon: Heart,
      lastUpdated: vitals ? "Just now" : "Loading...",
    },
    {
      name: "Heart Rate",
      value: vitals?.bpm ?? "--",
      unit: "bpm",
      status: vitals ? getStatus("Heart Rate", vitals.bpm || 0) : "normal",
      icon: Activity,
      lastUpdated: vitals ? "Just now" : "Loading...",
    },
    {
      name: "Temperature",
      value: vitals?.temp ?? "--",
      unit: "°F",
      status: vitals ? getStatus("Temperature", vitals.temp || 0) : "normal",
      icon: Thermometer,
      lastUpdated: vitals ? "Just now" : "Loading...",
    },
    {
      name: "Oxygen Level",
      value: vitals?.spo2 ?? "--",
      unit: "%",
      status: vitals ? getStatus("Oxygen Level", vitals.spo2 || 0) : "normal",
      icon: Droplets,
      lastUpdated: vitals ? "Just now" : "Loading...",
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
            <p className="md:block hidden">Check vitals :</p>
            <Button
              variant="outline"
              size="sm"
              className={`${
                vitals?.online
                  ? "text-green-700 border-green-600"
                  : "text-red-700 border-red-600"
              } hover:opacity-80`}
            >
              <span
                className={`md:block hidden text-3xl ${
                  vitals?.online ? "text-green-600" : "text-red-600"
                }`}
              >
                •
              </span>
              {vitals?.online ? "Device connected" : "Device not connected"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {liveVitals.map((vital, index) => (
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
                  {loading ? (
                    <span className="text-muted-foreground animate-pulse">
                      --
                    </span>
                  ) : (
                    <>
                      {vital.value}
                      <span className="text-sm text-muted-foreground ml-1">
                        {vital.unit}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {loading
                    ? "Fetching data..."
                    : `Updated ${vital.lastUpdated}`}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
