import { useUser } from "../../../../contexts/UserContext";
import { Card, CardContent } from "../../../ui/card";

export default function PatientInfoCard() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div>
      <Card className="shadow-soft bg-gradient-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-xl">{user?.avatar}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground"> {user?.name}</h2>
                <p className="text-muted-foreground">Patient ID: {user?.patientId}</p>
                <p className="text-sm text-muted-foreground">
                  <strong>Hospital:</strong> {user?.hospital} •<strong> Doctor:</strong> Dr. Sarah Johnson
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Health Score</div>
              <div className="text-3xl font-bold text-success">Good</div>
              <div className="text-xs text-muted-foreground">Last updated today</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
