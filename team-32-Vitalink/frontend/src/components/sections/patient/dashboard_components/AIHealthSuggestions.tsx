import { Activity, Droplets, Calendar, Brain } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../ui/card";
import { Button } from "../../../ui/button";

export default function AIHealthSuggestions() {
  const aiSuggestions = [
    {
      type: "hydration",
      title: "Stay Hydrated",
      description:
        "Based on your activity level, aim for 8-10 glasses of water today.",
      priority: "medium",
      icon: Droplets,
    },
    {
      type: "exercise",
      title: "Light Exercise",
      description:
        "A 20-minute walk would be beneficial for your cardiovascular health.",
      priority: "high",
      icon: Activity,
    },
    {
      type: "checkup",
      title: "Schedule Check-up",
      description: "It's been 3 months since your last cardiology appointment.",
      priority: "medium",
      icon: Calendar,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-warning text-warning-foreground";
      case "medium":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="w-full">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>AI Health Assistant</span>
          </CardTitle>
          <CardDescription>
            Personalized recommendations based on your health data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <suggestion.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-foreground">
                          {suggestion.title}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            suggestion.priority
                          )}`}
                        >
                          {suggestion.priority}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="secondary">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
