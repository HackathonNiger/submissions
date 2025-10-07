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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { UserProfile } from "@/types/user-profile";
import { Brain, HelpCircle, Loader2, Sparkles, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PastQuestionExplainerProps {
  userProfile: UserProfile;
}

export function PastQuestionExplainer({
  userProfile,
}: PastQuestionExplainerProps) {
  const { toast } = useToast();
  const [year, setYear] = useState("");
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [explanation, setExplanation] = useState("");

  const handleGenerateExplanation = async () => {
    if (!year || !subject || !question) {
      toast({
        title: "All fields required",
        description: "Please select a year, subject, and enter the question.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setExplanation("");
    try {
      const response = await fetch("/api/explain-past-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userProfile,
          year,
          subject,
          question,
        }),
      });
      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      console.error("Error generating explanation:", error);
      toast({
        title: "Error",
        description: "Failed to generate explanation.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const years = ["2023", "2022", "2021", "2020", "2019"];

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-extrabold text-red-700 dark:text-red-300">
            <HelpCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            WAEC Past Question Explainer
          </CardTitle>
          <CardDescription className="text-base text-gray-600 dark:text-gray-300">
            Get detailed, step-by-step explanations for any past WAEC question.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Year
              </label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Subject
              </label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {userProfile.subjects.map((s) => (
                    <SelectItem key={s.subject} value={s.subject}>
                      {s.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Question
            </label>
            <Textarea
              placeholder="Type or paste the full question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          <Button
            onClick={handleGenerateExplanation}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white"
          >
            {isGenerating ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <Sparkles className="h-5 w-5 mr-2" />
            )}
            Explain Question
          </Button>
        </CardContent>
      </Card>

      {isGenerating && (
        <Card className="text-center p-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-red-500" />
          <p className="font-semibold">
            Our AI Tutor is crafting the perfect explanation...
          </p>
        </Card>
      )}

      {explanation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-red-600" />
              Step-by-Step Explanation
            </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: explanation }} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
