import { Activity, Calendar, TrendingUp, UserPlus, Users } from "lucide-react";
import { Button } from "../../../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../ui/card";

export default function QuickActions() {
  return (
    <div>
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start h-12">
            <Users className="h-4 w-4 mr-3" />
            View All Patients
          </Button>
          <Button variant="outline" className="w-full justify-start h-12">
            <UserPlus className="h-4 w-4 mr-3" />
            Add New Patient
          </Button>
          <Button variant="outline" className="w-full justify-start h-12">
            <Calendar className="h-4 w-4 mr-3" />
            Schedule Appointment
          </Button>
          <Button variant="outline" className="w-full justify-start h-12">
            <TrendingUp className="h-4 w-4 mr-3" />
            View Analytics
          </Button>
          <Button variant="outline" className="w-full justify-start h-12">
            <Activity className="h-4 w-4 mr-3" />
            Patient Vitals
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
