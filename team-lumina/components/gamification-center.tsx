"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy, Award, Zap, Star, ShieldCheck, Book } from "lucide-react";
import type { UserProfile } from "@/types/user-profile";

interface GamificationCenterProps {
  userProfile: UserProfile;
}

const leaderboardData = [
  { name: "Sarah C.", points: 1850, avatar: "SC" },
  { name: "You", points: 1250, avatar: "ME" },
  { name: "Alex J.", points: 1100, avatar: "AJ" },
  { name: "Emma D.", points: 950, avatar: "ED" },
  { name: "Marcus W.", points: 450, avatar: "MW" },
];

const badges = [
  { name: "Math Whiz", icon: <Star />, earned: true },
  { name: "Science Explorer", icon: <Zap />, earned: true },
  { name: "Perfect Week", icon: <ShieldCheck />, earned: false },
  { name: "Bookworm", icon: <Book />, earned: true },
  { name: "Top Scorer", icon: <Trophy />, earned: false },
  { name: "Consistent Learner", icon: <Award />, earned: true },
];

export function GamificationCenter({ userProfile }: GamificationCenterProps) {
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-extrabold text-orange-700 dark:text-orange-300">
            <Trophy className="h-6 w-6 text-orange-500" />
            Gamification Center
          </CardTitle>
          <CardDescription>
            Track your progress, earn badges, and climb the leaderboard!
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboardData.map((user, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    user.name === "You"
                      ? "bg-orange-100 dark:bg-orange-900"
                      : "bg-gray-50 dark:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg">{index + 1}</span>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white ${
                        user.name === "You" ? "bg-orange-500" : "bg-gray-400"
                      }`}
                    >
                      {user.avatar}
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <span className="font-bold text-orange-600">
                    {user.points} pts
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Your Badges</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            {badges.map((badge, index) => (
              <div
                key={index}
                className={`flex flex-col items-center p-4 rounded-lg text-center ${
                  badge.earned
                    ? "bg-green-100 dark:bg-green-900"
                    : "bg-gray-100 dark:bg-gray-800 opacity-50"
                }`}
              >
                <div
                  className={`text-4xl ${
                    badge.earned ? "text-green-500" : "text-gray-400"
                  }`}
                >
                  {badge.icon}
                </div>
                <p className="text-sm font-semibold mt-2">{badge.name}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
