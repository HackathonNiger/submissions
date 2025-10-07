"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Brain, BookOpen, Target } from "lucide-react"

interface AdaptiveContentProps {
  studentData: any
  selectedSubject: string
  onSubjectChange: (subject: string) => void
}

export function AdaptiveContent({ studentData, selectedSubject, onSubjectChange }: AdaptiveContentProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<any>(null)

  const generatePersonalizedContent = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: selectedSubject,
          difficulty: studentData.currentLevel,
          learningStyle: studentData.learningStyle,
          weakAreas: studentData.weakAreas,
        }),
      })

      const data = await response.json()
      setGeneratedContent(data.content)
    } catch (error) {
      console.error("Error generating content:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Generated Personalized Content
          </CardTitle>
          <CardDescription>
            Content tailored to your learning style, current level, and areas needing improvement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Select value={selectedSubject} onValueChange={onSubjectChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {studentData.subjects.map((subject: string) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={generatePersonalizedContent} disabled={isGenerating} className="flex items-center gap-2">
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
              Generate Content
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Level: {studentData.currentLevel}</Badge>
            <Badge variant="outline">Style: {studentData.learningStyle}</Badge>
            <Badge variant="outline">Focus: {studentData.weakAreas.join(", ")}</Badge>
          </div>
        </CardContent>
      </Card>

      {generatedContent && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Personalized Explanation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {generatedContent.explanation || "AI-generated explanation tailored to your visual learning style..."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Practice Problems
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(generatedContent.problems || ["Problem 1", "Problem 2", "Problem 3"]).map(
                  (problem: string, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Problem {index + 1}</span>
                        <Badge variant="secondary">{index === 0 ? "Easy" : index === 1 ? "Medium" : "Hard"}</Badge>
                      </div>
                      <p className="text-gray-700">{problem}</p>
                      <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                        Solve
                      </Button>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle>Improvement Tips</CardTitle>
            <CardDescription>Personalized recommendations based on your weak areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(generatedContent.tips || ["Tip 1", "Tip 2", "Tip 3"]).map((tip: string, index: number) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-blue-900 text-sm">{tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!generatedContent && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Brain className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Generate Content</h3>
            <p className="text-gray-600 text-center mb-4">
              Click "Generate Content" to create personalized learning materials based on your profile
            </p>
            <Button onClick={generatePersonalizedContent} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Brain className="h-4 w-4 mr-2" />}
              Generate AI Content
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
