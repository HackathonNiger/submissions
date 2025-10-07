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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { UserProfile, SubjectPreference } from "@/types/user-profile";
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Brain,
  Target,
  Clock,
  BookOpen,
  Settings,
  Lightbulb,
} from "lucide-react";
import { useLocalStorage } from "../hooks/use-local-storage";

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
}

const TOTAL_STEPS = 8;

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useLocalStorage<Partial<UserProfile>>(
    "userProfile",
    {
      examTypes: [], // Changed to examTypes array
      interests: [], // Added interests array
      subjects: [],
      learningStyle: [],
      preferredStudyTime: [],
      studyDays: [],
      learningChallenges: [],
      motivationFactors: [],
      primaryGoals: [],
      shortTermGoals: [],
      longTermGoals: [],
      currentSkillLevels: {},
    }
  );

  const updateFormData = (updates: Partial<UserProfile>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData as UserProfile);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-900 transition-colors duration-500 animate-gradient-move">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-5">
            <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-700 dark:to-purple-800 shadow-lg rounded-full animate-bounce-slow">
              <Brain className="h-10 w-10 text-white drop-shadow-lg" />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-3 tracking-tight animate-fade-in">
            Personalize Your Learning
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-xl animate-fade-in delay-100">
            Let's set up your AI-powered study plan
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-10 animate-fade-in delay-200">
          <div className="flex justify-between text-base text-gray-500 dark:text-gray-400 mb-2">
            <span>
              Step {currentStep} of {TOTAL_STEPS}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress
            value={progress}
            className="h-3 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 dark:from-indigo-800 dark:to-purple-800"
          />
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto animate-fade-in delay-300">
          {currentStep === 1 && (
            <ExamSelectionStep
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {currentStep === 2 && (
            <PersonalInfoStep
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {currentStep === 3 && (
            <LearningStyleStep
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {currentStep === 4 && (
            <SubjectPreferencesStep
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {currentStep === 5 && (
            <ScheduleStep formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 6 && (
            <LearningCharacteristicsStep
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {currentStep === 7 && (
            <GoalsStep formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 8 && <ReviewStep formData={formData} />}
        </div>

        {/* Navigation */}
        <div className="max-w-2xl mx-auto mt-10 flex justify-between animate-fade-in delay-400">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 bg-white/60 dark:bg-gray-900/60 border-2 border-indigo-200 dark:border-indigo-800 shadow hover:scale-105 transition-transform duration-200"
          >
            <ChevronLeft className="h-5 w-5" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-700 dark:to-purple-800 shadow-lg hover:scale-105 transition-transform duration-200 text-white px-8 py-3 text-lg font-semibold rounded-xl"
          >
            {currentStep === TOTAL_STEPS ? "Complete Setup" : "Next"}
            {currentStep !== TOTAL_STEPS && (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ExamSelectionStep({
  formData,
  updateFormData,
}: {
  formData: Partial<UserProfile>;
  updateFormData: (updates: Partial<UserProfile>) => void;
}) {
  const exams = ["WAEC", "JAMB", "Post-UTME", "School Exam", "Other"];

  const handleExamChange = (exam: string) => {
    const currentExams = formData.examTypes || [];
    const updatedExams = currentExams.includes(exam)
      ? currentExams.filter((e) => e !== exam)
      : [...currentExams, exam];
    updateFormData({ examTypes: updatedExams });
  };

  return (
    <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Target className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-extrabold">
          Which exam(s) are you preparing for?
        </CardTitle>
        <CardDescription className="text-base">
          Select all that apply. This will help us tailor the experience for
          you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {exams.map((exam) => (
          <div
            key={exam}
            className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors"
            onClick={() => handleExamChange(exam)}
          >
            <Checkbox
              id={exam}
              checked={formData.examTypes?.includes(exam)}
              onCheckedChange={() => handleExamChange(exam)}
            />
            <Label htmlFor={exam} className="ml-3 text-base cursor-pointer">
              {exam}
            </Label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
// --- PersonalInfoStep remains the same ---
function PersonalInfoStep({
  formData,
  updateFormData,
}: {
  formData: Partial<UserProfile>;
  updateFormData: (updates: Partial<UserProfile>) => void;
}) {
  return (
    <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1">
      <CardContent className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="space-y-2">
      <Label htmlFor="name" className="text-sm font-medium">
        Full Name <span className="text-red-500">*</span>
      </Label>
      <Input
        id="name"
        placeholder="Enter your full name"
        value={formData.name || ""}
        onChange={(e) => updateFormData({ name: e.target.value })}
        required
        className="h-12 px-4 py-2 rounded-lg border border-indigo-200 dark:border-indigo-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-700 transition-all"
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="age" className="text-sm font-medium">
        Age <span className="text-red-500">*</span>
      </Label>
      <Input
        id="age"
        type="number"
        placeholder="Your age"
        value={formData.age || ""}
        onChange={(e) =>
          updateFormData({ age: Number.parseInt(e.target.value) })
        }
        required
        className="h-12 px-4 py-2 rounded-lg border border-indigo-200 dark:border-indigo-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-700 transition-all"
      />
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        Grade Level <span className="text-red-500">*</span>
      </Label>
      <Select
        value={formData.gradeLevel || ""}
        onValueChange={(value) => updateFormData({ gradeLevel: value })}
        required
      >
        <SelectTrigger className="h-12 px-4 py-2 rounded-lg border border-indigo-200 dark:border-indigo-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-700 transition-all">
          <SelectValue placeholder="Select grade level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="elementary">Elementary (K-5)</SelectItem>
          <SelectItem value="middle">Middle School (6-8)</SelectItem>
          <SelectItem value="high">High School (9-12)</SelectItem>
          <SelectItem value="college">College/University</SelectItem>
          <SelectItem value="adult">Adult Learner</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label className="text-sm font-medium">
        Educational Background <span className="text-red-500">*</span>
      </Label>
      <Select
        value={formData.educationBackground || ""}
        onValueChange={(value) =>
          updateFormData({ educationBackground: value })
        }
        required
      >
        <SelectTrigger className="h-12 px-4 py-2 rounded-lg border border-indigo-200 dark:border-indigo-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-700 transition-all">
          <SelectValue placeholder="Select background" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="traditional">Traditional School</SelectItem>
          <SelectItem value="homeschool">Homeschooled</SelectItem>
          <SelectItem value="online">Online Learning</SelectItem>
          <SelectItem value="mixed">Mixed/Hybrid</SelectItem>
          <SelectItem value="self-taught">Self-Taught</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>

  <div className="space-y-2">
    <Label htmlFor="interests" className="text-sm font-medium">
      Your Interests <span className="text-red-500">*</span>
    </Label>
    <Textarea
      id="interests"
      placeholder="List some of your hobbies or interests..."
      value={formData.interests?.join(", ") || ""}
      onChange={(e) =>
        updateFormData({
          interests: e.target.value
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean),
        })
      }
      required
      className="min-h-[100px] px-4 py-3 rounded-lg border border-indigo-200 dark:border-indigo-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-700 transition-all"
    />
  </div>
</CardContent>

    </Card>
  );
}

// --- Other steps (LearningStyle, SubjectPreferences, etc.) remain the same ---
// --- For brevity, I'll only show the relevant changed components ---

function LearningStyleStep({
  formData,
  updateFormData,
}: {
  formData: Partial<UserProfile>;
  updateFormData: (updates: Partial<UserProfile>) => void;
}) {
  const learningStyles = [
    {
      id: "visual",
      label: "Visual",
      description: "Learn through images, diagrams, and visual aids",
      icon: "👁️",
    },
    {
      id: "auditory",
      label: "Auditory",
      description: "Learn through listening and verbal instruction",
      icon: "👂",
    },
    {
      id: "kinesthetic",
      label: "Kinesthetic",
      description: "Learn through hands-on activities and movement",
      icon: "✋",
    },
    {
      id: "reading",
      label: "Reading/Writing",
      description: "Learn through text and written materials",
      icon: "📝",
    },
  ];

  const studyTimes = [
    { id: "early-morning", label: "Early Morning", time: "5:00 AM - 8:00 AM" },
    { id: "morning", label: "Morning", time: "8:00 AM - 12:00 PM" },
    { id: "afternoon", label: "Afternoon", time: "12:00 PM - 5:00 PM" },
    { id: "evening", label: "Evening", time: "5:00 PM - 9:00 PM" },
    { id: "night", label: "Night", time: "9:00 PM - 12:00 AM" },
  ];

  const toggleLearningStyle = (style: string) => {
    const current = formData.learningStyle || [];
    const updated = current.includes(style)
      ? current.filter((s) => s !== style)
      : [...current, style];
    updateFormData({ learningStyle: updated });
  };

  const toggleStudyTime = (time: string) => {
    const current = formData.preferredStudyTime || [];
    const updated = current.includes(time)
      ? current.filter((t) => t !== time)
      : [...current, time];
    updateFormData({ preferredStudyTime: updated });
  };

  return (
    <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <Brain className="h-6 w-6 text-purple-600 drop-shadow-md" />
        </div>
        <CardTitle className="text-2xl font-extrabold">
          How do you learn best?
        </CardTitle>
        <CardDescription className="text-base">
          Select all learning styles that apply to you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Learning Styles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningStyles.map((style) => (
              <div
                key={style.id}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                  formData.learningStyle?.includes(style.id)
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900"
                    : "border-gray-200 hover:border-gray-300 dark:hover:border-gray-700"
                }`}
                onClick={() => toggleLearningStyle(style.id)}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{style.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold">{style.label}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {style.description}
                    </p>
                  </div>
                  <Checkbox
                    checked={formData.learningStyle?.includes(style.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Preferred Study Times</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {studyTimes.map((time) => (
              <div
                key={time.id}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.preferredStudyTime?.includes(time.id)
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900"
                    : "border-gray-200 hover:border-gray-300 dark:hover:border-gray-700"
                }`}
                onClick={() => toggleStudyTime(time.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{time.label}</h4>
                    <p className="text-sm text-gray-600">{time.time}</p>
                  </div>
                  <Checkbox
                    checked={formData.preferredStudyTime?.includes(time.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Attention Span</h3>
          <div className="space-y-3">
            <Label className="text-sm">
              How long can you typically focus on learning? (minutes)
            </Label>
            <div className="px-4">
              <Slider
                value={[formData.attentionSpan || 30]}
                onValueChange={(value) =>
                  updateFormData({ attentionSpan: value[0] })
                }
                max={120}
                min={10}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>10 min</span>
                <span className="font-medium">
                  {formData.attentionSpan || 30} minutes
                </span>
                <span>120 min</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SubjectPreferencesStep({
  formData,
  updateFormData,
}: {
  formData: Partial<UserProfile>;
  updateFormData: (updates: Partial<UserProfile>) => void;
}) {
  const availableSubjects = [
    "Mathematics",
    "Science",
    "English/Language Arts",
    "History",
    "Foreign Languages",
    "Computer Science",
    "Art",
    "Music",
    "Physical Education",
    "Psychology",
    "Economics",
    "Philosophy",
    "Chemistry",
    "Physics",
    "Biology",
  ];

  const addSubject = (subject: string) => {
    const current = formData.subjects || [];
    if (!current.find((s) => s.subject === subject)) {
      const newSubject: SubjectPreference = {
        subject,
        priority: current.length + 1,
        currentLevel: 5,
        targetLevel: 8,
        weeklyHours: 3,
      };
      updateFormData({ subjects: [...current, newSubject] });
    }
  };

  const removeSubject = (subject: string) => {
    const current = formData.subjects || [];
    updateFormData({ subjects: current.filter((s) => s.subject !== subject) });
  };

  const updateSubject = (
    subject: string,
    updates: Partial<SubjectPreference>
  ) => {
    const current = formData.subjects || [];
    const updated = current.map((s) =>
      s.subject === subject ? { ...s, ...updates } : s
    );
    updateFormData({ subjects: updated });
  };

  return (
    <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Target className="h-6 w-6 text-green-600 drop-shadow-md" />
        </div>
        <CardTitle className="text-2xl font-extrabold">
          What subjects interest you?
        </CardTitle>
        <CardDescription className="text-base">
          Choose subjects and set your learning goals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Available Subjects</h3>
          <div className="flex flex-wrap gap-2">
            {availableSubjects.map((subject) => (
              <Badge
                key={subject}
                variant={
                  formData.subjects?.find((s) => s.subject === subject)
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer px-3 py-1 rounded-full hover:scale-105 transition-transform dark:hover:bg-indigo-900 dark:hover:text-indigo-300"
                onClick={() => {
                  if (formData.subjects?.find((s) => s.subject === subject)) {
                    removeSubject(subject);
                  } else {
                    addSubject(subject);
                  }
                }}
              >
                {subject}
              </Badge>
            ))}
          </div>
        </div>

        {formData.subjects && formData.subjects.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Subject Details</h3>
            <div className="space-y-4">
              {formData.subjects.map((subject) => (
                <div
                  key={subject.subject}
                  className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">{subject.subject}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubject(subject.subject)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Current Level (1-10)</Label>
                      <Slider
                        value={[subject.currentLevel]}
                        onValueChange={(value) =>
                          updateSubject(subject.subject, {
                            currentLevel: value[0],
                          })
                        }
                        max={10}
                        min={1}
                        step={1}
                      />
                      <div className="text-center text-sm text-gray-600">
                        {subject.currentLevel}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Target Level (1-10)</Label>
                      <Slider
                        value={[subject.targetLevel]}
                        onValueChange={(value) =>
                          updateSubject(subject.subject, {
                            targetLevel: value[0],
                          })
                        }
                        max={10}
                        min={1}
                        step={1}
                      />
                      <div className="text-center text-sm text-gray-600">
                        {subject.targetLevel}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Weekly Hours</Label>
                      <Slider
                        value={[subject.weeklyHours]}
                        onValueChange={(value) =>
                          updateSubject(subject.subject, {
                            weeklyHours: value[0],
                          })
                        }
                        max={20}
                        min={1}
                        step={1}
                      />
                      <div className="text-center text-sm text-gray-600">
                        {subject.weeklyHours}h
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ScheduleStep({
  formData,
  updateFormData,
}: {
  formData: Partial<UserProfile>;
  updateFormData: (updates: Partial<UserProfile>) => void;
}) {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const toggleStudyDay = (day: string) => {
    const current = formData.studyDays || [];
    const updated = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    updateFormData({ studyDays: updated });
  };

  return (
    <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
          <Clock className="h-6 w-6 text-orange-600 drop-shadow-md" />
        </div>
        <CardTitle className="text-2xl font-extrabold">
          Plan your study schedule
        </CardTitle>
        <CardDescription className="text-base">
          Help us create the perfect learning schedule for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Available Hours Per Week
            </Label>
            <div className="px-4">
              <Slider
                value={[formData.availableHours || 10]}
                onValueChange={(value) =>
                  updateFormData({ availableHours: value[0] })
                }
                max={40}
                min={2}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>2 hours</span>
                <span className="font-medium">
                  {formData.availableHours || 10} hours/week
                </span>
                <span>40 hours</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Preferred Session Length (minutes)
            </Label>
            <div className="px-4">
              <Slider
                value={[formData.preferredSessionLength || 45]}
                onValueChange={(value) =>
                  updateFormData({ preferredSessionLength: value[0] })
                }
                max={180}
                min={15}
                step={15}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>15 min</span>
                <span className="font-medium">
                  {formData.preferredSessionLength || 45} minutes
                </span>
                <span>3 hours</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Study Days</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all text-center ${
                  formData.studyDays?.includes(day)
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900"
                    : "border-gray-200 hover:border-gray-300 dark:hover:border-gray-700"
                }`}
                onClick={() => toggleStudyDay(day)}
              >
                <div className="font-medium">{day.slice(0, 3)}</div>
                <div className="text-sm text-gray-600">{day}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Study Environment</Label>
          <Select
            value={formData.studyEnvironment || ""}
            onValueChange={(value) =>
              updateFormData({ studyEnvironment: value })
            }
          >
            <SelectTrigger className="h-12 px-4 py-2 rounded-lg border border-indigo-200 dark:border-indigo-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-700 transition-all">
              <SelectValue placeholder="Select your preferred study environment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quiet-room">Quiet Room</SelectItem>
              <SelectItem value="background-music">
                With Background Music
              </SelectItem>
              <SelectItem value="library">Library Setting</SelectItem>
              <SelectItem value="cafe">Cafe/Social Environment</SelectItem>
              <SelectItem value="outdoors">Outdoors</SelectItem>
              <SelectItem value="flexible">Flexible/Varies</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

function LearningCharacteristicsStep({
  formData,
  updateFormData,
}: {
  formData: Partial<UserProfile>;
  updateFormData: (updates: Partial<UserProfile>) => void;
}) {
  const challenges = [
    "Attention/Focus Issues",
    "Dyslexia",
    "Math Anxiety",
    "Test Anxiety",
    "Memory Issues",
    "Processing Speed",
    "Language Barriers",
    "Time Management",
  ];

  const motivationFactors = [
    "Achievement/Grades",
    "Personal Growth",
    "Career Goals",
    "Competition",
    "Recognition",
    "Helping Others",
    "Curiosity",
    "Creative Expression",
  ];

  const toggleChallenge = (challenge: string) => {
    const current = formData.learningChallenges || [];
    const updated = current.includes(challenge)
      ? current.filter((c) => c !== challenge)
      : [...current, challenge];
    updateFormData({ learningChallenges: updated });
  };

  const toggleMotivation = (factor: string) => {
    const current = formData.motivationFactors || [];
    const updated = current.includes(factor)
      ? current.filter((f) => f !== factor)
      : [...current, factor];
    updateFormData({ motivationFactors: updated });
  };

  return (
    <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Settings className="h-6 w-6 text-red-600 drop-shadow-md" />
        </div>
        <CardTitle className="text-2xl font-extrabold">
          Learning characteristics
        </CardTitle>
        <CardDescription className="text-base">
          Help us understand your learning profile better
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">
            Learning Challenges (Optional)
          </h3>
          <p className="text-sm text-gray-600">
            Select any challenges that might affect your learning
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {challenges.map((challenge) => (
              <div
                key={challenge}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.learningChallenges?.includes(challenge)
                    ? "border-red-500 bg-red-50 dark:bg-red-900"
                    : "border-gray-200 hover:border-gray-300 dark:hover:border-gray-700"
                }`}
                onClick={() => toggleChallenge(challenge)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{challenge}</span>
                  <Checkbox
                    checked={formData.learningChallenges?.includes(challenge)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">
            What motivates you to learn?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {motivationFactors.map((factor) => (
              <div
                key={factor}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.motivationFactors?.includes(factor)
                    ? "border-green-500 bg-green-50 dark:bg-green-900"
                    : "border-gray-200 hover:border-gray-300 dark:hover:border-gray-700"
                }`}
                onClick={() => toggleMotivation(factor)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{factor}</span>
                  <Checkbox
                    checked={formData.motivationFactors?.includes(factor)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Difficulty Preference</Label>
            <Select
              value={formData.difficultyPreference || ""}
              onValueChange={(value) =>
                updateFormData({ difficultyPreference: value })
              }
            >
              <SelectTrigger className="h-12 px-4 py-2 rounded-lg border border-indigo-200 dark:border-indigo-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-700 transition-all">
                <SelectValue placeholder="Select difficulty preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gradual">Gradual Progression</SelectItem>
                <SelectItem value="challenging">
                  Challenging from Start
                </SelectItem>
                <SelectItem value="mixed">Mixed Difficulty</SelectItem>
                <SelectItem value="adaptive">Fully Adaptive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Feedback Preference</Label>
            <Select
              value={formData.feedbackPreference || ""}
              onValueChange={(value) =>
                updateFormData({ feedbackPreference: value })
              }
            >
              <SelectTrigger className="h-12 px-4 py-2 rounded-lg border border-indigo-200 dark:border-indigo-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-700 transition-all">
                <SelectValue placeholder="Select feedback preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate Feedback</SelectItem>
                <SelectItem value="delayed">Delayed Feedback</SelectItem>
                <SelectItem value="summary">Summary Feedback</SelectItem>
                <SelectItem value="minimal">Minimal Feedback</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GoalsStep({
  formData,
  updateFormData,
}: {
  formData: Partial<UserProfile>;
  updateFormData: (updates: Partial<UserProfile>) => void;
}) {
  const primaryGoals = [
    "Improve Grades",
    "Prepare for Exams",
    "Learn New Skills",
    "Career Advancement",
    "Personal Interest",
    "Academic Requirements",
    "Certification",
    "Competition Prep",
  ];

  const togglePrimaryGoal = (goal: string) => {
    const current = formData.primaryGoals || [];
    const updated = current.includes(goal)
      ? current.filter((g) => g !== goal)
      : [...current, goal];
    updateFormData({ primaryGoals: updated });
  };

  return (
    <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <Sparkles className="h-6 w-6 text-yellow-600 drop-shadow-md" />
        </div>
        <CardTitle className="text-2xl font-extrabold">
          What are your learning goals?
        </CardTitle>
        <CardDescription className="text-base">
          Define what you want to achieve
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Primary Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {primaryGoals.map((goal) => (
              <div
                key={goal}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.primaryGoals?.includes(goal)
                    ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900"
                    : "border-gray-200 hover:border-gray-300 dark:hover:border-gray-700"
                }`}
                onClick={() => togglePrimaryGoal(goal)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{goal}</span>
                  <Checkbox checked={formData.primaryGoals?.includes(goal)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="shortTermGoals" className="text-sm font-medium">
            Short-term Goals (Next 3 months)
          </Label>
          <Textarea
            id="shortTermGoals"
            placeholder="What do you want to achieve in the next 3 months?"
            value={formData.shortTermGoals?.join("\n") || ""}
            onChange={(e) =>
              updateFormData({
                shortTermGoals: e.target.value
                  .split("\n")
                  .filter((g) => g.trim()),
              })
            }
            className="min-h-[100px] px-4 py-3 rounded-lg border border-indigo-200 dark:border-indigo-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-700 transition-all"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="longTermGoals" className="text-sm font-medium">
            Long-term Goals (6+ months)
          </Label>
          <Textarea
            id="longTermGoals"
            placeholder="What are your long-term learning objectives?"
            value={formData.longTermGoals?.join("\n") || ""}
            onChange={(e) =>
              updateFormData({
                longTermGoals: e.target.value
                  .split("\n")
                  .filter((g) => g.trim()),
              })
            }
            className="min-h-[100px] px-4 py-3 rounded-lg border border-indigo-200 dark:border-indigo-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-700 transition-all"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="targetDate" className="text-sm font-medium">
            Target Completion Date (Optional)
          </Label>
          <Input
            id="targetDate"
            type="date"
            value={formData.targetCompletionDate || ""}
            onChange={(e) =>
              updateFormData({ targetCompletionDate: e.target.value })
            }
            className="h-12 px-4 py-2 rounded-lg border border-indigo-200 dark:border-indigo-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-700 transition-all"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewStep({ formData }: { formData: Partial<UserProfile> }) {
  return (
    <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
          <Sparkles className="h-6 w-6 text-white drop-shadow-lg" />
        </div>
        <CardTitle className="text-2xl font-extrabold">
          Review your profile
        </CardTitle>
        <CardDescription className="text-base">
          Make sure everything looks correct before we create your personalized
          learning experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg dark:bg-blue-900">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                Personal Info
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Name: {formData.name}
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Age: {formData.age}
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Grade: {formData.gradeLevel}
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Exams: {formData.examTypes?.join(", ")}
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg dark:bg-purple-900">
              <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
                Learning Style
              </h3>
              <div className="flex flex-wrap gap-1">
                {formData.learningStyle?.map((style) => (
                  <Badge
                    key={style}
                    variant="secondary"
                    className="text-xs bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-200"
                  >
                    {style}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg dark:bg-green-900">
              <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">
                Schedule
              </h3>
              <p className="text-sm text-green-800 dark:text-green-200">
                {formData.availableHours}h/week
              </p>
              <p className="text-sm text-green-800 dark:text-green-200">
                {formData.preferredSessionLength} min sessions
              </p>
              <p className="text-sm text-green-800 dark:text-green-200">
                {formData.studyDays?.length} study days
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-orange-50 rounded-lg dark:bg-orange-900">
              <h3 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">
                Subjects ({formData.subjects?.length})
              </h3>
              <div className="flex flex-wrap gap-1">
                {formData.subjects?.map((subject) => (
                  <Badge
                    key={subject.subject}
                    variant="secondary"
                    className="text-xs bg-orange-200 text-orange-800 dark:bg-orange-800 dark:text-orange-200"
                  >
                    {subject.subject}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg dark:bg-yellow-900">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
                Goals
              </h3>
              <div className="flex flex-wrap gap-1">
                {formData.primaryGoals?.map((goal) => (
                  <Badge
                    key={goal}
                    variant="secondary"
                    className="text-xs bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
                  >
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg dark:bg-pink-900">
              <h3 className="font-semibold text-pink-900 dark:text-pink-300 mb-2">
                Interests
              </h3>
              <div className="flex flex-wrap gap-1">
                {formData.interests?.map((interest) => (
                  <Badge
                    key={interest}
                    variant="secondary"
                    className="text-xs bg-pink-200 text-pink-800 dark:bg-pink-800 dark:text-pink-200"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
