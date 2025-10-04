import { useUser } from "../../../../contexts/UserContext";
import { Card, CardContent } from "../../../ui/card";

export default function PatientInfoCard() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div>
      <Card className="shadow-soft bg-gradient-card">
        <CardContent className="p-6">
          <div className="flex md:flex-nowrap flex-wrap gap-2 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-fit h-fit p-4 bg-primary rounded-full flex items-center justify-center">
                <h1 className="text-primary-foreground font-semibold text-xl">{user?.avatar}</h1>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground"> {user?.name}</h2>
                <p className="text-sm text-nowrap text-muted-foreground">
                  <strong>Patient ID:</strong> {user?.patientId}
                </p>
                <p className="text-sm text-nowrap text-muted-foreground">
                  <strong>Hospital:</strong> {user?.hospital}
                </p>
                <p className="text-sm text-muted-foreground text-nowrap">
                  <strong> Doctor:</strong> Dr. Sarah Johnson
                </p>
              </div>
            </div>
            <div className="flex w-full items-end flex-col md:text-right">
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
