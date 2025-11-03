"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Lock, Play, Brain } from "lucide-react"

interface LearningPathProps {
  studentData: any
}

const learningPaths = {
  Mathematics: [
    { id: 1, title: "Basic Algebra Review", status: "completed", progress: 100, difficulty: "Easy" },
    { id: 2, title: "Linear Equations", status: "completed", progress: 100, difficulty: "Easy" },
    { id: 3, title: "Quadratic Equations", status: "current", progress: 65, difficulty: "Medium" },
    { id: 4, title: "Systems of Equations", status: "next", progress: 0, difficulty: "Medium" },
    { id: 5, title: "Polynomial Functions", status: "locked", progress: 0, difficulty: "Hard" },
    { id: 6, title: "Exponential Functions", status: "locked", progress: 0, difficulty: "Hard" },
  ],
  Science: [
    { id: 1, title: "Atomic Structure", status: "completed", progress: 100, difficulty: "Easy" },
    { id: 2, title: "Chemical Bonding", status: "current", progress: 80, difficulty: "Medium" },
    { id: 3, title: "Chemical Reactions", status: "next", progress: 0, difficulty: "Medium" },
    { id: 4, title: "Thermodynamics", status: "locked", progress: 0, difficulty: "Hard" },
  ],
}

export function LearningPath({ studentData }: LearningPathProps) {
  const currentPath = learningPaths.Mathematics

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "current":
        return <Play className="h-5 w-5 text-blue-500" />
      case "next":
        return <Circle className="h-5 w-5 text-gray-400" />
      case "locked":
        return <Lock className="h-5 w-5 text-gray-300" />
      default:
        return <Circle className="h-5 w-5 text-gray-400" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Personalized Learning Path: Mathematics
          </CardTitle>
          <CardDescription>
            Your learning path has been customized based on your performance, learning style (
            {studentData.learningStyle}), and identified areas for improvement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentPath.map((lesson, index) => (
              <div
                key={lesson.id}
                className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0">{getStatusIcon(lesson.status)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                    <Badge className={getDifficultyColor(lesson.difficulty)}>{lesson.difficulty}</Badge>
                  </div>

                  {lesson.progress > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Progress</span>
                        <span>{lesson.progress}%</span>
                      </div>
                      <Progress value={lesson.progress} className="h-2" />
                    </div>
                  )}
                </div>

                <div className="flex-shrink-0">
                  {lesson.status === "current" && <Button size="sm">Continue</Button>}
                  {lesson.status === "next" && (
                    <Button size="sm" variant="outline">
                      Start
                    </Button>
                  )}
                  {lesson.status === "completed" && (
                    <Button size="sm" variant="ghost">
                      Review
                    </Button>
                  )}
                  {lesson.status === "locked" && (
                    <Button size="sm" variant="ghost" disabled>
                      Locked
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Adaptive Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Focus Area</p>
              <p className="text-sm text-blue-700">
                Spend extra time on algebraic manipulation before moving to systems of equations.
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-900">Learning Style Match</p>
              <p className="text-sm text-green-700">
                Visual diagrams and graphs have been added to your quadratic equations lessons.
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-purple-900">Pace Adjustment</p>
              <p className="text-sm text-purple-700">
                Based on your progress, we've adjusted the difficulty curve to match your learning speed.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subject Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(learningPaths).map(([subject, path]) => {
                const completed = path.filter((lesson) => lesson.status === "completed").length
                const total = path.length
                const progress = (completed / total) * 100

                return (
                  <div key={subject} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{subject}</span>
                      <span className="text-sm text-gray-600">
                        {completed}/{total} completed
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
