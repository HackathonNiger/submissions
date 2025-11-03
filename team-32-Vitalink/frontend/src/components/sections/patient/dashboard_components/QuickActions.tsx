import { Activity, Brain, Calendar, Heart, MessageCircle } from "lucide-react";
import { Button } from "../../../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../ui/card";

export default function QuickActions() {
  return (
    <div className="w-full">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and health tools</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start h-12">
            <Activity className="h-4 w-4 mr-3" />
            Log Vitals
          </Button>
          <Button variant="outline" className="w-full justify-start h-12">
            <MessageCircle className="h-4 w-4 mr-3" />
            Message Doctor
          </Button>
          <Button variant="outline" className="w-full justify-start h-12">
            <Calendar className="h-4 w-4 mr-3" />
            Book Appointment
          </Button>
          <Button variant="outline" className="w-full justify-start h-12">
            <Brain className="h-4 w-4 mr-3" />
            AI Insights
          </Button>
          <Button variant="outline" className="w-full justify-start h-12">
            <Heart className="h-4 w-4 mr-3" />
            Health Trends
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
