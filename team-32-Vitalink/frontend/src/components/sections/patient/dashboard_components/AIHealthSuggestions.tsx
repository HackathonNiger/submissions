import { useEffect, useState } from "react";
import { Activity, Droplets, Brain, HeartPulse } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../ui/card";
import { Button } from "../../../ui/button";
import { getGeminiResponse } from "../../../../services/gemini";

interface VitalData {
  spo2: number;
  bpm: number;
  temp: number;
  sbp: number;
  dbp: number;
  current_step_count: number;
  alert: string;
  online: boolean;
}

export default function AIHealthSuggestions() {
  const [vitals, setVitals] = useState<VitalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiMessage, setAiMessage] = useState(""); // 👈 Store Gemini response
  const [thinking, setThinking] = useState(false); // 👈 Loading state for AI

  useEffect(() => {
    async function fetchVitals() {
      try {
        const res = await fetch("https://vitalink.pythonanywhere.com/pull");
        const data = await res.json();
        setVitals(data);
      } catch (error) {
        console.error("Failed to fetch vitals:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVitals();
    const interval = setInterval(fetchVitals, 15000); // auto-refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const handleAskAI = async () => {
    if (!vitals) return;

    setThinking(true);
    const formattedVitals = [
      {
        name: "Oxygen Level",
        value: vitals.spo2,
        unit: "%",
        status: getVitalStatus("spo2", vitals.spo2),
        lastUpdated: "Just now",
      },
      {
        name: "Heart Rate",
        value: vitals.bpm,
        unit: "bpm",
        status: getVitalStatus("bpm", vitals.bpm),
        lastUpdated: "Just now",
      },
      {
        name: "Temperature",
        value: vitals.temp,
        unit: "°C",
        status: getVitalStatus("temp", vitals.temp),
        lastUpdated: "Just now",
      },
      {
        name: "Blood Pressure",
        value: `${vitals.sbp}/${vitals.dbp}`,
        unit: "mmHg",
        status: getVitalStatus("bp", vitals.sbp),
        lastUpdated: "Just now",
      },
    ];

    const prompt = `How am I doing today?\nVitals:\n${JSON.stringify(
      formattedVitals,
      null,
      2
    )}`;
    const response = await getGeminiResponse(prompt);
    setAiMessage(response);
    setThinking(false);
  };

  if (loading) {
    return (
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>AI Health Assistant</span>
          </CardTitle>
          <CardDescription>Loading your health data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!vitals) {
    return (
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>AI Health Assistant</CardTitle>
          <CardDescription>
            Could not load vitals. Please check your connection.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const aiSuggestions = generateSuggestions(vitals);

  return (
    <div className="w-full">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>AI Health Assistant</span>
          </CardTitle>
          <CardDescription>
            Personalized recommendations based on your latest vitals
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

            {/* Gemini AI Interaction */}
            <div className="mt-6">
              <Button
                onClick={handleAskAI}
                className="w-full bg-primary text-white"
                disabled={thinking}
              >
                {thinking ? "Analyzing your vitals..." : "Ask about my health"}
              </Button>

              {aiMessage && (
                <p className="mt-4 text-sm text-muted-foreground whitespace-pre-wrap">
                  {aiMessage}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper: determine basic status category
function getVitalStatus(type: string, value: number) {
  switch (type) {
    case "spo2":
      return value < 90 ? "critical" : value < 95 ? "low" : "normal";
    case "bpm":
      return value < 60 ? "low" : value > 100 ? "high" : "normal";
    case "temp":
      return value > 37.5 ? "high" : "normal";
    case "bp":
      return value > 140 ? "high" : value < 90 ? "low" : "normal";
    default:
      return "normal";
  }
}

// Color tag helper
function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-600";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-green-100 text-green-700";
  }
}

// Basic rule-based local suggestions
function generateSuggestions(vitals: VitalData) {
  const suggestions = [];

  if (vitals.temp > 37.5) {
    suggestions.push({
      title: "High Temperature Detected",
      description: "You may be running a fever. Stay hydrated and rest well.",
      priority: "high",
      icon: Activity,
    });
  }

  if (vitals.spo2 < 95) {
    suggestions.push({
      title: "Low Oxygen Level",
      description: "Consider breathing exercises or consulting a doctor.",
      priority: "high",
      icon: HeartPulse,
    });
  }

  if (vitals.bpm > 100) {
    suggestions.push({
      title: "High Heart Rate",
      description:
        "Try to relax and monitor your pulse. Avoid caffeine and stress.",
      priority: "medium",
      icon: Brain,
    });
  }

  if (vitals.current_step_count < 1000) {
    suggestions.push({
      title: "Low Activity Level",
      description: "Take a short walk or stretch to improve circulation.",
      priority: "medium",
      icon: Activity,
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      title: "All Good!",
      description:
        "Your vitals look stable. Keep maintaining your healthy routine.",
      priority: "low",
      icon: Droplets,
    });
  }

  return suggestions;
}
