"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { UserProfile } from "@/types/user-profile"
import { Calendar, Clock, BookOpen, Target, Plus, Edit } from "lucide-react"

interface StudyScheduleProps {
  userProfile: UserProfile
}

interface ScheduleItem {
  id: string
  subject: string
  topic: string
  startTime: string
  duration: number
  day: string
  type: "lesson" | "practice" | "review" | "assessment"
  completed: boolean
}

export function StudySchedule({ userProfile }: StudyScheduleProps) {
  const [currentWeek, setCurrentWeek] = useState(0)

  // Generate adaptive schedule based on user profile
  const generateWeeklySchedule = (): ScheduleItem[] => {
    const schedule: ScheduleItem[] = []
    let itemId = 1

    userProfile.studyDays.forEach((day, dayIndex) => {
      const dayHours = userProfile.availableHours / userProfile.studyDays.length
      let currentTime =
        userProfile.preferredStudyTime[0] === "early-morning"
          ? "06:00"
          : userProfile.preferredStudyTime[0] === "morning"
            ? "09:00"
            : userProfile.preferredStudyTime[0] === "afternoon"
              ? "14:00"
              : userProfile.preferredStudyTime[0] === "evening"
                ? "18:00"
                : "20:00"

      // Distribute subjects across the day based on priority
      const sortedSubjects = [...userProfile.subjects].sort((a, b) => a.priority - b.priority)

      sortedSubjects.forEach((subject, subjectIndex) => {
        if (dayIndex % 2 === subjectIndex % 2) {
          // Alternate subjects across days
          const sessionDuration = Math.min(userProfile.preferredSessionLength, (dayHours * 60) / 2)

          schedule.push({
            id: `item-${itemId++}`,
            subject: subject.subject,
            topic: `${subject.subject} - Progressive Learning`,
            startTime: currentTime,
            duration: sessionDuration,
            day: day,
            type: dayIndex % 3 === 0 ? "lesson" : dayIndex % 3 === 1 ? "practice" : "review",
            completed: Math.random() > 0.7, // Simulate some completed sessions
          })

          // Update time for next session
          const [hours, minutes] = currentTime.split(":").map(Number)
          const newMinutes = minutes + sessionDuration + 15 // 15 min break
          const newHours = hours + Math.floor(newMinutes / 60)
          currentTime = `${String(newHours % 24).padStart(2, "0")}:${String(newMinutes % 60).padStart(2, "0")}`
        }
      })
    })

    return schedule
  }

  const weeklySchedule = generateWeeklySchedule()
  const todaySchedule = weeklySchedule.filter(
    (item) => item.day === new Date().toLocaleDateString("en-US", { weekday: "long" }),
  )

  const getTypeColor = (type: string) => {
    switch (type) {
      case "lesson":
        return "bg-blue-100 text-blue-800"
      case "practice":
        return "bg-green-100 text-green-800"
      case "review":
        return "bg-yellow-100 text-yellow-800"
      case "assessment":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lesson":
        return BookOpen
      case "practice":
        return Target
      case "review":
        return Clock
      case "assessment":
        return Calendar
      default:
        return BookOpen
    }
  }

  return (
    <div className="space-y-6">
      {/* Schedule Overview */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-green-600" />
            Your Adaptive Study Schedule
          </CardTitle>
          <CardDescription className="text-base">
            Personalized schedule based on your availability ({userProfile.availableHours}h/week) and preferred study
            times
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{userProfile.availableHours}h</div>
              <div className="text-sm text-gray-600">Weekly Hours</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{userProfile.studyDays.length}</div>
              <div className="text-sm text-gray-600">Study Days</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{userProfile.preferredSessionLength}min</div>
              <div className="text-sm text-gray-600">Session Length</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <BookOpen className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{userProfile.subjects.length}</div>
              <div className="text-sm text-gray-600">Active Subjects</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Today's Schedule</CardTitle>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Session
            </Button>
          </div>
          <CardDescription>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todaySchedule.length > 0 ? (
            <div className="space-y-4">
              {todaySchedule.map((item) => {
                const TypeIcon = getTypeIcon(item.type)
                return (
                  <div
                    key={item.id}
                    className={`flex items-center space-x-4 p-4 border rounded-lg transition-colors ${
                      item.completed ? "bg-green-50 border-green-200" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className={`p-2 rounded-full ${item.completed ? "bg-green-500" : "bg-gray-200"}`}>
                      <TypeIcon className={`h-4 w-4 ${item.completed ? "text-white" : "text-gray-600"}`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-semibold ${item.completed ? "line-through text-gray-500" : ""}`}>
                          {item.topic}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                          <span className="text-sm text-gray-500">{item.duration}min</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{item.startTime}</span>
                        <span>•</span>
                        <span>{item.subject}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!item.completed && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Start
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions scheduled for today</h3>
              <p className="text-gray-600 mb-4">
                {userProfile.studyDays.includes(new Date().toLocaleDateString("en-US", { weekday: "long" }))
                  ? "Add a study session to get started"
                  : "Today is not in your scheduled study days"}
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Study Session
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
          <CardDescription>Your complete study schedule for the week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`grid grid-cols-1 md:grid-cols-${userProfile.studyDays.length} gap-4`}>
            {userProfile.studyDays.map((day) => {
              const daySchedule = weeklySchedule.filter((item) => item.day === day)
              const completedSessions = daySchedule.filter((item) => item.completed).length

              return (
                <div
                  key={day}
                  className="p-4 rounded-lg border bg-blue-50 border-blue-200"
                >
                  <div className="text-center mb-3">
                    <h4 className="font-semibold">{day.slice(0, 3)}</h4>
                    <p className="text-xs text-gray-600">{day}</p>
                  </div>

                  {daySchedule.length > 0 ? (
                    <div className="space-y-2">
                      {daySchedule.map((item) => (
                        <div
                          key={item.id}
                          className={`p-2 rounded text-xs ${
                            item.completed ? "bg-green-100 text-green-800" : "bg-white border"
                          }`}
                        >
                          <div className="font-medium">{item.subject}</div>
                          <div className="text-gray-600">{item.startTime}</div>
                        </div>
                      ))}
                      <div className="text-center pt-2 border-t">
                        <span className="text-xs text-gray-600">
                          {completedSessions}/{daySchedule.length} completed
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 text-xs">No sessions</div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Insights */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle>Schedule Insights</CardTitle>
          <CardDescription>AI-powered recommendations for your study schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-purple-900">Optimization Suggestions</h4>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-sm text-purple-800">
                    <strong>Peak Performance:</strong> Your {userProfile.preferredStudyTime[0]} sessions show highest
                    engagement. Consider scheduling challenging topics during this time.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-sm text-purple-800">
                    <strong>Session Length:</strong> Your {userProfile.preferredSessionLength}-minute sessions align
                    well with your {userProfile.attentionSpan}-minute attention span.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-sm text-purple-800">
                    <strong>Subject Distribution:</strong> Consider alternating high-priority subjects with easier
                    topics to maintain motivation.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-indigo-900">Adaptive Features</h4>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-sm text-indigo-800">
                    <strong>Smart Rescheduling:</strong> Sessions automatically adjust based on your progress and
                    performance patterns.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-sm text-indigo-800">
                    <strong>Difficulty Balancing:</strong> The system balances challenging and review sessions based on
                    your {userProfile.difficultyPreference} preference.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-sm text-indigo-800">
                    <strong>Goal Alignment:</strong> Schedule prioritizes subjects that align with your primary goals:{" "}
                    {userProfile.primaryGoals.slice(0, 2).join(", ")}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
