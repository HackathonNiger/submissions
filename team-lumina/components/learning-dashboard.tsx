"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { UserProfile } from "@/types/user-profile";
import {
  Brain,
  BookOpen,
  Target,
  Clock,
  TrendingUp,
  Sparkles,
  Settings,
  Calendar,
  Award,
} from "lucide-react";
import { AdaptiveLearningPath } from "./adaptive-learning-path";
import { PersonalizedContent } from "./personalized-content";
import { ProgressAnalytics } from "./progress-analytics";
import { StudySchedule } from "./study-schedule";

interface LearningDashboardProps {
  userProfile: UserProfile;
  onResetProfile: () => void;
}

export function LearningDashboard({
  userProfile,
  onResetProfile,
}: LearningDashboardProps) {
  // FIX: Added state to manage the selected subject for the child components.
  const [selectedSubject, setSelectedSubject] = useState(
    userProfile.subjects[0]?.subject || ""
  );

  const [currentStreak, setCurrentStreak] = useState(7);
  const [totalPoints, setTotalPoints] = useState(1250);
  const [completedLessons, setCompletedLessons] = useState(23);

  // Calculate overall progress based on subjects
  const overallProgress =
    userProfile.subjects.reduce((acc, subject) => {
      const progress = (subject.currentLevel / subject.targetLevel) * 100;
      return acc + progress;
    }, 0) / (userProfile.subjects.length || 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, {userProfile.name}! 👋
            </h1>
            <p className="text-gray-600 text-lg mt-2">
              Ready to continue your personalized learning journey?
            </p>
          </div>
          <Button
            variant="outline"
            onClick={onResetProfile}
            className="flex items-center gap-2 bg-transparent"
          >
            <Settings className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <Progress value={overallProgress} className="mt-3 bg-blue-400" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Study Streak</p>
                  <p className="text-3xl font-bold">{currentStreak} days</p>
                </div>
                <Clock className="h-8 w-8 text-green-200" />
              </div>
              <p className="text-green-100 text-sm mt-2">Keep it up! 🔥</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Points</p>
                  <p className="text-3xl font-bold">
                    {totalPoints.toLocaleString()}
                  </p>
                </div>
                <Award className="h-8 w-8 text-purple-200" />
              </div>
              <p className="text-purple-100 text-sm mt-2">+85 today</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Lessons Completed</p>
                  <p className="text-3xl font-bold">{completedLessons}</p>
                </div>
                <BookOpen className="h-8 w-8 text-orange-200" />
              </div>
              <p className="text-orange-100 text-sm mt-2">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardContent className="p-6 text-center">
              <Brain className="h-12 w-12 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Continue Learning</h3>
              <p className="text-gray-600 text-sm">
                Pick up where you left off
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer bg-gradient-to-r from-green-50 to-blue-50">
            <CardContent className="p-6 text-center">
              <Target className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Practice Quiz</h3>
              <p className="text-gray-600 text-sm">Test your knowledge</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-6 text-center">
              <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">AI Tutor</h3>
              <p className="text-gray-600 text-sm">Get personalized help</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="learning-path" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger
              value="learning-path"
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Learning Path
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Content
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="learning-path">
            <AdaptiveLearningPath userProfile={userProfile} />
          </TabsContent>

          <TabsContent value="content">
            {/* FIX: Pass the required props down to the PersonalizedContent component */}
            <PersonalizedContent
              userProfile={userProfile}
              selectedSubject={selectedSubject}
              onSubjectChange={setSelectedSubject}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <ProgressAnalytics userProfile={userProfile} />
          </TabsContent>

          <TabsContent value="schedule">
            <StudySchedule userProfile={userProfile} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
