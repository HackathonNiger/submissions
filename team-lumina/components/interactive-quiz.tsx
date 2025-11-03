"use client";

import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, CheckCircle, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface QuizQuestion {
  id: number;
  type: "multiple_choice" | "fill_in_the_blank";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
}

interface QuizData {
  questions: QuizQuestion[];
}

interface InteractiveQuizProps {
  selectedSubject: string;
  selectedTopic: string;
}

export function InteractiveQuiz({
  selectedSubject,
  selectedTopic,
}: InteractiveQuizProps) {
  const { studentData, saveQuizAttempt, updateStudentData } = useData();
  const { toast } = useToast();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleGenerateQuiz = async () => {
    if (!studentData) return;

    if (!selectedTopic) {
      toast({
        title: "Topic Required",
        description:
          "Please enter a topic in the content generator above before creating a quiz.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setQuizData(null);
    setSubmitted(false);
    setUserAnswers({});
    setScore(0);

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userProfile: studentData.profile,
          subject: selectedSubject,
          topic: selectedTopic,
          difficulty: "Medium",
          questionCount: 5,
          questionTypes: ["multiple_choice", "fill_in_the_blank"],
        }),
      });
      const data = await response.json();
      setQuizData(data.quiz);
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast({
        title: "Error",
        description: "Could not generate quiz.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    if (!quizData) return;
    let correctAnswers = 0;
    quizData.questions.forEach((q) => {
      if (
        userAnswers[q.id]?.trim().toLowerCase() ===
        q.correctAnswer.trim().toLowerCase()
      ) {
        correctAnswers++;
      }
    });
    const finalScore = Math.round(
      (correctAnswers / quizData.questions.length) * 100
    );
    setScore(finalScore);
    setSubmitted(true);

    saveQuizAttempt({
      subject: selectedSubject,
      topic: `Quiz: ${selectedTopic}`,
      questions: quizData.questions,
      userAnswers,
      score: finalScore,
    });

    if (studentData) {
      const newProfile = { ...studentData.profile };
      const subjectIndex = newProfile.subjects.findIndex(
        (s) => s.subject === selectedSubject
      );
      if (subjectIndex !== -1) {
        const currentSubject = newProfile.subjects[subjectIndex];
        const levelChange = finalScore > 80 ? 0.1 : finalScore < 50 ? -0.1 : 0;
        currentSubject.currentLevel = parseFloat(
          Math.max(
            1,
            Math.min(10, currentSubject.currentLevel + levelChange)
          ).toFixed(1)
        );
        updateStudentData({ profile: newProfile });
      }
    }

    toast({
      title: "Quiz Submitted!",
      description: `You scored ${finalScore}%`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Quiz</CardTitle>
        <CardDescription>
          Test your knowledge with a quiz generated just for you on the selected
          topic.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!quizData && (
          <div className="text-center">
            <Button onClick={handleGenerateQuiz} disabled={isGenerating}>
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate Quiz for "{selectedTopic || "Your Topic"}"
            </Button>
          </div>
        )}

        {quizData && !submitted && (
          <div className="space-y-8">
            {quizData.questions.map((q, index) => (
              <div key={q.id}>
                <p className="font-semibold mb-2">
                  {index + 1}. {q.question}
                </p>
                {q.type === "multiple_choice" && q.options && (
                  <RadioGroup
                    onValueChange={(value) => handleAnswerChange(q.id, value)}
                  >
                    {q.options.map((option, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${q.id}-${i}`} />
                        <Label htmlFor={`${q.id}-${i}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                {q.type === "fill_in_the_blank" && (
                  <Input
                    placeholder="Type your answer here..."
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  />
                )}
              </div>
            ))}
            <Button onClick={handleSubmit} className="w-full">
              Submit Quiz
            </Button>
          </div>
        )}

        {submitted && quizData && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Quiz Results</h2>
              <p className="text-4xl font-bold my-2">{score}%</p>
              <Progress value={score} className="w-full" />
            </div>
            <div className="space-y-4">
              {quizData.questions.map((q) => (
                <div key={q.id} className="p-4 border rounded-lg">
                  <p className="font-semibold">{q.question}</p>
                  <div className="flex items-center mt-2">
                    {userAnswers[q.id]?.trim().toLowerCase() ===
                    q.correctAnswer.trim().toLowerCase() ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <p>
                      Your answer:{" "}
                      <span className="font-medium">
                        {userAnswers[q.id] || "No answer"}
                      </span>
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Correct answer:{" "}
                    <span className="font-medium">{q.correctAnswer}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                    Explanation: {q.explanation}
                  </p>
                </div>
              ))}
            </div>
            <Button onClick={handleGenerateQuiz} className="w-full">
              Take Another Quiz
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
