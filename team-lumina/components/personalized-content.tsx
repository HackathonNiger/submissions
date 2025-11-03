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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import type { UserProfile } from "@/types/user-profile";
import {
  Brain,
  BookOpen,
  Target,
  Loader2,
  Sparkles,
  MessageSquare,
  FileText,
  Youtube,
  CheckCircle,
} from "lucide-react";
import { useData } from "@/context/DataContext";
import { InteractiveQuiz } from "./interactive-quiz";
import { useToast } from "@/hooks/use-toast";

interface PersonalizedContentProps {
  userProfile: UserProfile;
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
}

interface GeneratedContent {
  id: string; // Unique ID for the content module
  explanation: string;
  examples: string[];
  exercises: Array<{
    question: string;
    difficulty: string;
    type: string;
  }>;
  tips: string[];
  nextSteps: string[];
  youtubeSuggestions?: string[];
}

export function PersonalizedContent({
  userProfile,
  selectedSubject,
  onSubjectChange,
}: PersonalizedContentProps) {
  const { saveGeneratedContent, markModuleAsComplete } = useData();
  const { toast } = useToast();
  const [selectedTopic, setSelectedTopic] = useState("");
  const [contentType, setContentType] = useState("lesson");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] =
    useState<GeneratedContent | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState("");

  const generateContent = async () => {
    if (!selectedSubject || !selectedTopic) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic to generate content.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedContent(null);
    try {
      const response = await fetch("/api/generate-personalized-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userProfile,
          subject: selectedSubject,
          topic: selectedTopic,
          contentType,
          customPrompt,
        }),
      });
      const data = await response.json();
      const newContent = {
        ...data.content,
        subject: selectedSubject,
        topic: selectedTopic,
        contentType,
      };
      setGeneratedContent(newContent);

      // Save the generated content to the library in DataContext
      saveGeneratedContent({
        body: {
          explanation: newContent.explanation,
          examples: newContent.examples,
          tips: newContent.tips,
          youtubeSuggestions: newContent.youtubeSuggestions,
        },
        subject: selectedSubject,
        topic: selectedTopic,
        contentType: contentType,
      });
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description: "Failed to generate content.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMarkAsComplete = (content: GeneratedContent) => {
    // This function marks a module in the learning path as complete
    markModuleAsComplete(selectedTopic);
    setCompletedModules((prev) => [...prev, content.id]);
    toast({
      title: "Module Completed!",
      description: `Great job on finishing the lesson for ${selectedTopic}. Your learning path is updated.`,
    });
  };

  const contentTypes = [
    { value: "lesson", label: "Interactive Lesson", icon: BookOpen },
    { value: "practice", label: "Practice Session", icon: Target },
    { value: "explanation", label: "Concept Explanation", icon: MessageSquare },
    { value: "summary", label: "Topic Summary", icon: FileText },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 animate-bounce-slow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-extrabold text-purple-700 dark:text-purple-300">
            <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400 drop-shadow-md" />
            AI Content Generator
          </CardTitle>
          <CardDescription className="text-base text-gray-600 dark:text-gray-300">
            Generate personalized learning content or quizzes tailored to your
            profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Subject</label>
              <Select value={selectedSubject} onValueChange={onSubjectChange}>
                <SelectTrigger className="h-12 px-4 py-2 rounded-lg border border-purple-200 dark:border-purple-800 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-700 transition-all bg-white/80 dark:bg-gray-800/80">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {userProfile.subjects.map((subject) => (
                    <SelectItem key={subject.subject} value={subject.subject} className="hover:scale-105 transition-transform">
                      {subject.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Topic</label>
              <input
                type="text"
                placeholder="e.g., Photosynthesis"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full h-12 px-4 py-2 border border-purple-200 dark:border-purple-800 bg-white/80 dark:bg-gray-800/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-700 transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Content Type</label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger className="h-12 px-4 py-2 rounded-lg border border-purple-200 dark:border-purple-800 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-700 transition-all bg-white/80 dark:bg-gray-800/80">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="hover:scale-105 transition-transform">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Custom Request (Optional)
            </label>
            <Textarea
              placeholder="e.g., 'Explain it like I'm 10' or 'Focus on real-world examples.'"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="min-h-[80px] px-4 py-3 rounded-lg border border-purple-200 dark:border-purple-800 bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-700 transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={generateContent}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full px-8 py-3 text-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isGenerating && (
        <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 animate-fade-in">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Brain className="h-12 w-12 text-purple-500 dark:text-purple-400 animate-pulse mb-4 drop-shadow-md" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Our AI is crafting your personalized content...
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">This may take a moment.</p>
          </CardContent>
        </Card>
      )}

      {generatedContent && (
        <div className="space-y-6 animate-fade-in delay-300">
          <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 animate-bounce-slow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-extrabold text-blue-700 dark:text-blue-300">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400 drop-shadow-md" />
                  Personalized{" "}
                  {contentTypes.find((t) => t.value === contentType)?.label}
                </div>
                <Button
                  size="sm"
                  onClick={() => handleMarkAsComplete(generatedContent)}
                  disabled={completedModules.includes(generatedContent.id)}
                  className="rounded-full px-6 py-2 text-sm font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors duration-200 hover:scale-105"
                >
                  {completedModules.includes(generatedContent.id) ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Completed
                    </>
                  ) : (
                    "Mark as Complete"
                  )}
                </Button>
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Tailored for {selectedSubject}{" "}
                {selectedTopic && `- ${selectedTopic}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    Explanation
                  </h4>
                  <p className="text-blue-800 dark:text-blue-200 leading-relaxed whitespace-pre-wrap">
                    {generatedContent.explanation}
                  </p>
                </div>
              </div>
              {generatedContent.examples?.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold mt-4 text-gray-900 dark:text-gray-100">Examples</h4>
                  {generatedContent.examples.map((example, index) => (
                    <div
                      key={index}
                      className="p-3 bg-green-50 dark:bg-green-900/50 rounded-lg border-l-4 border-green-400 dark:border-green-600 hover:shadow-md transition-all duration-200 hover:scale-105"
                    >
                      <p className="text-green-800 dark:text-green-200 text-sm">{example}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {generatedContent.exercises?.length > 0 && (
            <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 animate-bounce-slow delay-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-extrabold text-green-700 dark:text-green-300">
                  <Target className="h-5 w-5 text-green-600 dark:text-green-400 drop-shadow-md" />
                  Practice Exercises
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedContent.exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="p-4 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/50 transition-all duration-200 hover:scale-105"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">Exercise {index + 1}</span>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{exercise.difficulty}</Badge>
                        <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-semibold border-green-300 dark:border-green-700 text-green-700 dark:text-green-300">{exercise.type}</Badge>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{exercise.question}</p>
                    <Button size="sm" variant="outline" className="rounded-full px-4 py-2 text-sm font-semibold bg-transparent border-green-600 text-green-600 hover:bg-green-50 transition-colors duration-200 hover:scale-105">
                      Start Exercise
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {generatedContent.tips?.length > 0 && (
              <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 animate-bounce-slow delay-200">
                <CardHeader>
                  <CardTitle className="text-lg font-extrabold text-yellow-700 dark:text-yellow-300">Learning Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {generatedContent.tips.map((tip, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/50 rounded-lg hover:shadow-md transition-all duration-200 hover:scale-105"
                      >
                        <div className="w-6 h-6 bg-yellow-500 dark:bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-yellow-900 dark:text-yellow-200 text-sm">{tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {generatedContent.youtubeSuggestions &&
              generatedContent.youtubeSuggestions.length > 0 && (
                <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 animate-bounce-slow delay-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-extrabold text-red-700 dark:text-red-300">
                      <Youtube className="h-5 w-5 text-red-600 dark:text-red-400 drop-shadow-md" />
                      Recommended Videos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {generatedContent.youtubeSuggestions.map(
                        (suggestion, index) => (
                          <li key={index} className="flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50 transition-all duration-200 hover:scale-105">
                            <Youtube className="h-4 w-4 text-red-500 dark:text-red-400" />
                            <a
                              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                                suggestion
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                            >
                              {suggestion}
                            </a>
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>
              )}
          </div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <InteractiveQuiz
          selectedSubject={selectedSubject}
          selectedTopic={selectedTopic}
        />
      </div>
    </div>
  );
}
