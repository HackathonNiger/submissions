"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  Brain,
  Target,
} from "lucide-react";

const classData = {
  totalStudents: 28,
  activeStudents: 26,
  averageProgress: 76,
  strugglingStudents: 4,
};

const students = [
  {
    id: 1,
    name: "Alex Johnson",
    progress: 78,
    status: "on-track",
    weakAreas: ["Algebra"],
    strengths: ["Geometry"],
  },
  {
    id: 2,
    name: "Sarah Chen",
    progress: 92,
    status: "advanced",
    weakAreas: [],
    strengths: ["Problem Solving", "Analysis"],
  },
  {
    id: 3,
    name: "Marcus Williams",
    progress: 45,
    status: "struggling",
    weakAreas: ["Basic Math", "Word Problems"],
    strengths: ["Visual Learning"],
  },
  {
    id: 4,
    name: "Emma Davis",
    progress: 83,
    status: "on-track",
    weakAreas: ["Fractions"],
    strengths: ["Mental Math"],
  },
  {
    id: 5,
    name: "James Rodriguez",
    progress: 38,
    status: "struggling",
    weakAreas: ["Algebra", "Equations"],
    strengths: ["Geometry"],
  },
];

const aiInsights = [
  {
    type: "recommendation",
    title: "Adaptive Content Suggestion",
    description:
      "3 students would benefit from visual learning materials for quadratic equations",
    priority: "medium",
  },
  {
    type: "alert",
    title: "Learning Gap Detected",
    description:
      "Marcus Williams and James Rodriguez need additional support in foundational algebra",
    priority: "high",
  },
  {
    type: "success",
    title: "Engagement Improvement",
    description:
      "Class engagement increased 23% after implementing personalized learning paths",
    priority: "low",
  },
];

export function TeacherDashboard() {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "advanced":
        return "bg-green-100 text-green-800";
      case "on-track":
        return "bg-blue-100 text-blue-800";
      case "struggling":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-yellow-200 bg-yellow-50";
      case "low":
        return "border-green-200 bg-green-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-900 transition-colors duration-500 animate-gradient-move p-6">
      <div className="max-w-7xl mx-auto w-full animate-fade-in">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2 tracking-tight animate-fade-in">
            Teacher Dashboard
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 animate-fade-in delay-100">
            10th Grade Mathematics • Room 204
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 animate-fade-in delay-200">
          <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 animate-bounce-slow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                Total Students
              </CardTitle>
              <Users className="h-5 w-5 text-blue-500 dark:text-blue-400 drop-shadow-md" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-blue-700 dark:text-blue-300">
                {classData.totalStudents}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {classData.activeStudents} active today
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 animate-bounce-slow delay-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                Class Average
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-indigo-500 dark:text-indigo-400 drop-shadow-md" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300">
                {classData.averageProgress}%
              </div>
              <Progress value={classData.averageProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 animate-bounce-slow delay-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-red-700 dark:text-red-300">
                Need Support
              </CardTitle>
              <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 drop-shadow-md" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-red-700 dark:text-red-300">
                {classData.strugglingStudents}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Students below 50%
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 animate-bounce-slow delay-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                AI Insights
              </CardTitle>
              <Brain className="h-5 w-5 text-purple-500 dark:text-purple-400 drop-shadow-md" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-purple-700 dark:text-purple-300">
                12
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                New recommendations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs
          defaultValue="students"
          className="space-y-6 animate-fade-in delay-300"
        >
          <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl shadow hover:shadow-lg transition-all">
            <TabsTrigger
              value="students"
              className="hover:scale-105 transition-transform"
            >
              Student Overview
            </TabsTrigger>
            <TabsTrigger
              value="insights"
              className="hover:scale-105 transition-transform"
            >
              AI Insights
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="hover:scale-105 transition-transform"
            >
              Content Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 animate-fade-in">
                  <CardHeader>
                    <CardTitle className="font-extrabold text-indigo-700 dark:text-indigo-300">
                      Student Progress
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      Individual student performance and status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {students.map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900 cursor-pointer transition-colors hover:scale-105"
                          onClick={() => setSelectedStudent(student)}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 dark:text-blue-300 font-semibold">
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                {student.name}
                              </h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge
                                  className={
                                    getStatusColor(student.status) +
                                    " rounded-full px-3 py-1 text-xs font-semibold"
                                  }
                                >
                                  {student.status.replace("-", " ")}
                                </Badge>
                                <span className="text-sm text-gray-500 dark:text-gray-300">
                                  {student.progress}% complete
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Progress
                              value={student.progress}
                              className="w-24 mb-1"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-300">
                              {student.weakAreas.length} weak areas
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                {selectedStudent ? (
                  <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 animate-fade-in">
                    <CardHeader>
                      <CardTitle className="font-extrabold text-indigo-700 dark:text-indigo-300">
                        {selectedStudent.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300">
                        Detailed student profile
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-gray-900 dark:text-gray-100">
                          Progress
                        </h4>
                        <Progress
                          value={selectedStudent.progress}
                          className="mb-1"
                        />
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {selectedStudent.progress}% complete
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-gray-900 dark:text-gray-100">
                          Strengths
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedStudent.strengths.map(
                            (strength: string, index: number) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs bg-green-100 text-green-800 rounded-full px-3 py-1"
                              >
                                {strength}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-gray-900 dark:text-gray-100">
                          Areas for Improvement
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedStudent.weakAreas.map(
                            (area: string, index: number) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs bg-orange-100 text-orange-800 rounded-full px-3 py-1"
                              >
                                {area}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>

                      <div className="pt-4 space-y-2">
                        <Button
                          size="sm"
                          className="w-full rounded-full px-6 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-200 hover:scale-105"
                        >
                          <Target className="mr-2 h-4 w-4" />
                          Create Custom Path
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full rounded-full px-6 py-2 text-sm font-semibold bg-transparent border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors duration-200 hover:scale-105"
                        >
                          <Brain className="mr-2 h-4 w-4" />
                          AI Recommendations
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 animate-fade-in">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Users className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                      <p className="text-gray-600 dark:text-gray-300 text-center">
                        Select a student to view detailed information and
                        AI-powered insights
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <div className="space-y-6 animate-fade-in delay-400">
              <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 animate-bounce-slow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-extrabold text-purple-700 dark:text-purple-300">
                    <Brain className="h-5 w-5" />
                    AI-Powered Teaching Insights
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Automated analysis and recommendations based on student
                    performance data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiInsights.map((insight, index) => (
                      <div
                        key={index}
                        className={`p-4 border rounded-lg ${getPriorityColor(
                          insight.priority
                        )} transition-all duration-300 hover:shadow-md`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1 text-gray-900 dark:text-gray-100">
                              {insight.title}
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {insight.description}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="ml-4 rounded-full px-3 py-1 text-xs font-semibold"
                          >
                            {insight.priority} priority
                          </Badge>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full px-4 py-2 text-sm font-semibold bg-transparent border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors duration-200 hover:scale-105"
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            className="rounded-full px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-200 hover:scale-105"
                          >
                            Take Action
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content">
            <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-extrabold text-indigo-700 dark:text-indigo-300">
                  <BookOpen className="h-5 w-5" />
                  AI Content Generation
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Generate personalized learning materials for your students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    Content Management
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Create and manage AI-generated learning materials tailored
                    to your students' needs
                  </p>
                  <Button className="rounded-full px-6 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-200 hover:scale-105">
                    <Brain className="mr-2 h-4 w-4" />
                    Generate New Content
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
