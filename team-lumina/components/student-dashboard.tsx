"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  TrendingUp,
  Clock,
  Award,
  Calendar,
  Notebook,
  Sparkles,
  BookCheck,
} from "lucide-react";
import { AdaptiveLearningPath } from "@/components/adaptive-learning-path";
import { PersonalizedContent } from "@/components/personalized-content";
import { ProgressAnalytics } from "@/components/progress-analytics";
import { ContentLibrary } from "@/components/content-library";
import { useData } from "@/context/DataContext";
import Link from "next/link";
import { WaecTutorChat } from "@/components/waec-tutor-chat";
import { JambTutorChat } from "@/components/jamb-tutor-chat"; // Import the new JAMB chat component

export function StudentDashboard() {
  const { studentData } = useData();

  const [selectedSubject, setSelectedSubject] = useState(
    studentData?.profile.subjects[0]?.subject || ""
  );

  if (!studentData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="mb-4">Loading student profile...</p>
          <p className="text-sm text-gray-500 mb-4">
            If you're new, please start from the homepage.
          </p>
          <Link href="/">
            <Button>Go to Homepage</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { profile, stats } = studentData;
  const { examTypes = [] } = profile;
  const [activeTab, setActiveTab] = useState("ai-learning");
  

  const overallProgress =
    profile.subjects.length > 0
      ? profile.subjects.reduce((acc, subject) => {
          const progress = (subject.currentLevel / subject.targetLevel) * 100;
          return acc + progress;
        }, 0) / profile.subjects.length
      : 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-900 transition-colors duration-500 animate-gradient-move p-6">
      <div className="max-w-7xl mx-auto w-full animate-fade-in">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2 tracking-tight animate-fade-in">
            Welcome back, {profile.name}!
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 animate-fade-in delay-100">
            {profile.gradeLevel} • {profile.difficultyPreference} Level
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 animate-fade-in delay-200">
          <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 animate-bounce-slow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                Overall Progress
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-indigo-500 dark:text-indigo-400 drop-shadow-md" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300">
                {Math.round(overallProgress)}%
              </div>
              <Progress value={overallProgress} className="mt-2" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 animate-bounce-slow delay-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                Learning Streak
              </CardTitle>
              <Clock className="h-5 w-5 text-purple-500 dark:text-purple-400 drop-shadow-md" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-purple-700 dark:text-purple-300">
                {stats.streakDays} days
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Keep it up!
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 animate-bounce-slow delay-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                Total Points
              </CardTitle>
              <Award className="h-5 w-5 text-yellow-500 dark:text-yellow-400 drop-shadow-md" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-yellow-700 dark:text-yellow-300">
                {stats.totalPoints.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                from lessons and quizzes
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 animate-bounce-slow delay-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-300">
                Active Subjects
              </CardTitle>
              <BookOpen className="h-5 w-5 text-green-500 dark:text-green-400 drop-shadow-md" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-green-700 dark:text-green-300">
                {profile.subjects.length}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                All on track
              </p>
            </CardContent>
          </Card>
        </div>

<Tabs
  value={activeTab}
  onValueChange={setActiveTab}
  className="space-y-6 animate-fade-in delay-300"
>
  {/* Mobile Dropdown - shows only on mobile */}
  <div className="block md:hidden">
    <select 
      className="w-full p-3 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow hover:shadow-lg transition-all border-0 text-gray-700 dark:text-gray-300"
      onChange={(e) => setActiveTab(e.target.value)}
      value={activeTab}
    >
      <option value="ai-learning">🤖 AI Learning</option>
      <option value="study-schedule">📅 Study Schedule</option>
      <option value="content-library">📚 Content Library</option>
      <option value="performance">📊 Performance</option>
    </select>
  </div>

  {/* Desktop Tabs - shows only on tablet and larger screens */}
  <div className="hidden md:block">
    <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl shadow hover:shadow-lg transition-all">
      <TabsTrigger
        value="ai-learning"
        className="hover:scale-105 transition-transform"
      >
        <Sparkles className="mr-2 h-5 w-5 text-purple-500 dark:text-purple-400 drop-shadow-md" />
        AI Learning
      </TabsTrigger>
      <TabsTrigger
        value="study-schedule"
        className="hover:scale-105 transition-transform"
      >
        <Calendar className="mr-2 h-5 w-5 text-blue-500 dark:text-blue-400 drop-shadow-md" />
        Study Schedule
      </TabsTrigger>
      <TabsTrigger
        value="content-library"
        className="hover:scale-105 transition-transform"
      >
        <Notebook className="mr-2 h-5 w-5 text-green-500 dark:text-green-400 drop-shadow-md" />
        Content Library
      </TabsTrigger>
      <TabsTrigger
        value="performance"
        className="hover:scale-105 transition-transform"
      >
        <TrendingUp className="mr-2 h-5 w-5 text-yellow-500 dark:text-yellow-400 drop-shadow-md" />
        Performance
      </TabsTrigger>
    </TabsList>
  </div>

  {/* Tab Content - This will automatically update when activeTab changes */}
  <TabsContent value="ai-learning">
    <div className="space-y-8">
      {examTypes.includes("WAEC") && (
        <WaecTutorChat userProfile={profile} />
      )}
      {examTypes.includes("JAMB") && (
        <JambTutorChat userProfile={profile} />
      )}
      {(examTypes.includes("Other") ||
        examTypes.includes("Post-UTME") ||
        examTypes.includes("School Exam")) && (
        <PersonalizedContent
          userProfile={profile}
          selectedSubject={selectedSubject}
          onSubjectChange={setSelectedSubject}
        />
      )}
      {examTypes.length === 0 && (
        <PersonalizedContent
          userProfile={profile}
          selectedSubject={selectedSubject}
          onSubjectChange={setSelectedSubject}
        />
      )}
    </div>
  </TabsContent>

  <TabsContent value="study-schedule">
    <AdaptiveLearningPath userProfile={profile} />
  </TabsContent>

  <TabsContent value="content-library">
    <ContentLibrary />
  </TabsContent>

  <TabsContent value="performance">
    <ProgressAnalytics userProfile={profile} />
  </TabsContent>
</Tabs>
      </div>
    </div>
  );
}
