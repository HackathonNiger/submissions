import { Button } from "../../../ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle, Card } from "../../../ui/card";

export default function RecentPatients() {
  const recentPatients = [
    {
      name: "Emma Wilson",
      condition: "Hypertension",
      lastVisit: "2 days ago",
      status: "stable",
      avatar: "EW",
    },
    {
      name: "Michael Chen",
      condition: "Diabetes Type 2",
      lastVisit: "1 week ago",
      status: "attention",
      avatar: "MC",
    },
    {
      name: "Sarah Johnson",
      condition: "Cardiology Follow-up",
      lastVisit: "3 days ago",
      status: "stable",
      avatar: "SJ",
    },
    {
      name: "Robert Davis",
      condition: "Post-surgery Recovery",
      lastVisit: "1 day ago",
      status: "good",
      avatar: "RD",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "attention":
        return "border-warning bg-warning-light text-warning";
      case "good":
        return "border-success bg-success-light text-success";
      default:
        return "border-primary bg-primary/10 text-primary";
    }
  };

  return (
    <div>
      <Card className="lg:col-span-2 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Patients
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardTitle>
          <CardDescription>Patients who need your attention or recent updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPatients.map((patient, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold text-sm">{patient.avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{patient.name}</h4>
                    <p className="text-sm text-muted-foreground">{patient.condition}</p>
                    <p className="text-xs text-muted-foreground">Last visit: {patient.lastVisit}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(patient.status)}`}>{patient.status}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
