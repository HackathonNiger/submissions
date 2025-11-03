import { useUser } from "../../../../contexts/UserContext";
import { Card, CardContent } from "../../../ui/card";
import { useEffect, useState } from "react";

function evaluateHealth(vitals: any[]) {
  let score = 100;

  for (const v of vitals) {
    const name = v.name.toLowerCase();
    const value = Number(v.value);

    if (name.includes("heart") && (value < 60 || value > 100)) score -= 25;
    if (name.includes("temperature") && (value < 36.1 || value > 37.5))
      score -= 20;
    if (name.includes("oxygen") && value < 95) score -= 25;
    if (name.includes("blood pressure")) {
      const [systolic, diastolic] = value.toString().split("/").map(Number);
      if (systolic > 130 || diastolic > 85) score -= 30;
    }
  }

  if (score > 80) return { text: "Good", color: "text-green-600" };
  if (score > 60) return { text: "Need Rest", color: "text-yellow-500" };
  return { text: "Bad", color: "text-red-600" };
}

export default function PatientInfoCard() {
  const { user } = useUser();
  const [healthStatus, setHealthStatus] = useState("Checking...");
  const [statusColor, setStatusColor] = useState("text-muted-foreground");

  useEffect(() => {
    if (!user || !user.vitals) return;

    const status = evaluateHealth(user.vitals);
    setHealthStatus(status.text);
    setStatusColor(status.color);
  }, [user]);

  if (!user) return null;

  return (
    <div>
      <Card className="shadow-soft bg-gradient-card">
        <CardContent className="p-6">
          <div className="flex md:flex-nowrap flex-wrap gap-2 items-center justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-fit h-fit p-4 px-5 bg-primary rounded-full flex items-center justify-center">
                <h1 className="text-primary-foreground font-semibold text-xl">
                  {user?.avatar}
                </h1>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {user?.name}
                </h2>
                <p className="text-sm text-nowrap text-muted-foreground">
                  <strong>Device ID:</strong> {user?.patientId}
                </p>
                <p className="text-sm text-nowrap text-muted-foreground">
                  <strong>Hospital:</strong> {user?.hospital}
                </p>
                <p className="text-sm text-muted-foreground text-nowrap">
                  <strong>Doctor:</strong> Dr. Sarah Johnson
                </p>
              </div>
            </div>

            <div className="flex w-full items-end flex-col md:text-right">
              <div className="text-sm text-muted-foreground">Health Score</div>
              <div className={`text-3xl font-bold ${statusColor}`}>
                {healthStatus}
              </div>
              <div className="text-xs text-muted-foreground">
                Last updated today
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
