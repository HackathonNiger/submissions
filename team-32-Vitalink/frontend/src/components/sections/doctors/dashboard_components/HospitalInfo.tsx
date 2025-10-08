import { useUser } from "../../../../contexts/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../ui/card";

export default function HospitalInfo() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div>
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Hospital Information</CardTitle>
          <CardDescription>Your current workplace and department details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Current Hospital</h4>
              <p className="text-muted-foreground">{user.hospital}</p>
              <p className="text-sm text-muted-foreground">{user.address}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Department</h4>
              <p className="text-muted-foreground capitalize">{user.specs}</p>
              <p className="text-sm text-muted-foreground">Senior Attending Physician</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Contact</h4>
              <p className="text-muted-foreground">{user.contact}</p>
              <p className="text-sm text-muted-foreground">Extension: {user.license}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
