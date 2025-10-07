"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { UserProfile } from "@/types/user-profile";
import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import { useData } from "@/context/DataContext";
import { subWeeks } from "date-fns";

interface ProgressAnalyticsProps {
  userProfile: UserProfile;
}

export function ProgressAnalytics({ userProfile }: ProgressAnalyticsProps) {
  const { studentData } = useData();

  const chartData = useMemo(() => {
    if (!studentData) return { progressData: [], skillRadarData: [] };

    const { profile } = studentData;
const activities = studentData.quizHistory || [];

    const weeks = Array.from({ length: 8 }, (_, i) =>
      subWeeks(new Date(), 7 - i)
    );

    const progressData = weeks.reduce<any[]>((acc, weekStart, i) => {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const weekActivities = activities.filter((act: { completedAt: string | number | Date; }) => {
        const actDate = new Date(act.completedAt);
        return actDate >= weekStart && actDate < weekEnd;
      });

      const weekScores: any = { week: `Week ${i + 1}` };
      profile.subjects.forEach((subject) => {
        const subjectActivities = weekActivities.filter(
          (a) => a.subject === subject.subject && a.score != null
        );
        if (subjectActivities.length > 0) {
          const avgScore =
            subjectActivities.reduce((sum, a) => sum + (a.score || 0), 0) /
            subjectActivities.length;
          weekScores[subject.subject] = avgScore;
        } else {
          const prevWeekData = i > 0 ? acc[i - 1]?.[subject.subject] : null;
          weekScores[subject.subject] =
            prevWeekData !== null ? prevWeekData : subject.currentLevel * 10;
        }
      });

      acc.push(weekScores);
      return acc;
    }, []);

    const skillRadarData = profile.subjects.map((subject) => ({
      subject: subject.subject.slice(0, 10),
      current: subject.currentLevel * 10,
      target: subject.targetLevel * 10,
      fullMark: 100,
    }));

    return { progressData, skillRadarData };
  }, [studentData]);

  if (!studentData) return null;

  const { profile } = studentData;
  const { progressData, skillRadarData } = chartData;

  const overallProgress =
    profile.subjects.reduce((acc, subject) => {
      return acc + (subject.currentLevel / subject.targetLevel) * 100;
    }, 0) / (profile.subjects.length || 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Overall Progress</p>
                <p className="text-3xl font-bold">
                  {Math.round(overallProgress)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-200" />
            </div>
            <div className="mt-3">
              <Progress value={overallProgress} className="bg-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Progress Over Time</CardTitle>
            <CardDescription>
              Your average quiz scores across subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                {profile.subjects.map((subject, index) => (
                  <Line
                    key={subject.subject}
                    type="monotone"
                    dataKey={subject.subject}
                    stroke={`hsl(${index * 60}, 70%, 50%)`}
                    strokeWidth={2}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Skill Level Radar</CardTitle>
            <CardDescription>
              Your current vs target skill levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <Radar
                  name="Current"
                  dataKey="current"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Target"
                  dataKey="target"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.3}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
