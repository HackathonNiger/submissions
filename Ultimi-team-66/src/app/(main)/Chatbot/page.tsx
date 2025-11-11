"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import {
  Copy,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  Mic,
  Paperclip,
  X,
  ArrowRight,
  Check,
  XCircle,
  Trophy,
  Target,
  TrendingUp,
  Clock,
  Menu,
  Search,
  Image as ImageIcon,
  Smartphone,
  Brain,
  SendHorizonal,
  RotateCcw,
  PencilLine,
  DownloadCloud,
  Coins,
  Trash2,
  Sparkles,
  GraduationCap,
  MessageSquarePlus,
} from "lucide-react";
import Box from '@/components/ui/box';

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import InfinityLoader from "@/components/ui/InfinityLoader";
import { supabase } from '@/lib/supabaseClient';

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}

interface Message {
  sender: "user" | "bot";
  text: string;
  typing?: boolean;
  id: number;
  images?: string[];
  liked?: boolean;
  disliked?: boolean;
  type?: string;
}

interface Chat {
  id: string;
  title: string;
  date: string;
  messages: Message[];
}

interface QuizQuestion {
  number: number;
  text: string;
  options: Array<{ letter: string; text: string }>;
}

interface QuizAnswer {
  questionNumber: number;
  questionText: string;
  selectedAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

interface QuizFeedback {
  questionIndex: number;
  isCorrect: boolean;
  explanation: string;
}

// Animate helper classes for better animations
const animationClasses = {
  slideInUp: "animate-slide-in-up",
  slideInRight: "animate-slide-in-right",
  fadeInFast: "animate-fade-in-fast",
  scaleIn: "animate-scale-in",
  pulseSuccess: "animate-pulse-success",
  pulseError: "animate-pulse-error",
};

// Enhanced Quiz Progress Component with smoother progress bar animation
function QuizProgress({
  current,
  total,
  answeredQuestions,
  correctAnswers,
}: {
  current: number;
  total: number;
  answeredQuestions: Set<number>;
  correctAnswers: Set<number>;
}) {
  const progress = ((current + 1) / total) * 100;

  return (
    <Box className="space-y-4 w-full">
      <Box className="w-full bg-muted rounded-md h-2 overflow-hidden">
        <Box
          className="bg-primary h-2 rounded-md transition-[width,background-color] duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </Box>

      <Box className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Question {current + 1} of {total}
        </p>
        <p className="text-sm font-medium text-foreground">{Math.round(progress)}% Complete</p>
      </Box>

      <Box className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
        {Array.from({ length: total }, (_, i) => {
          const isAnswered = answeredQuestions.has(i);
          const isCorrect = correctAnswers.has(i);
          const isCurrent = i === current;

          return (
            <Box
              key={i}
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                isCurrent
                  ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                  : isAnswered
                  ? isCorrect
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
              aria-current={isCurrent ? "step" : undefined}
              aria-label={`Question ${i + 1} ${isAnswered ? (isCorrect ? "correct" : "incorrect") : "not answered"}`}
            >
              {i + 1}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

// Enhanced Quiz Option Component with animated selection & correct/incorrect feedback
function QuizOption({
  letter,
  text,
  index,
  isSelected,
  isChecked,
  isCorrect,
  onSelect,
  disabled,
}: {
  letter: string;
  text: string;
  index: number;
  isSelected: boolean;
  isChecked: boolean;
  isCorrect: boolean | null;
  onSelect: () => void;
  disabled: boolean;
}) {
  const colors = ["bg-primary", "bg-green-500", "bg-yellow-500", "bg-red-500"];
  const badgeColor = colors[index % 4];

  let optionClasses =
    "bg-card border border-border hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary";
  let icon = null;
  let animationClass = "";

  if (isChecked) {
    if (isCorrect && isSelected) {
      optionClasses = "bg-green-900/20 border-green-500 shadow-md";
      icon = <Check className="w-5 h-5 text-green-500 ml-auto" />;
      animationClass = animationClasses.pulseSuccess;
    } else if (!isCorrect && isSelected) {
      optionClasses = "bg-red-900/30 border-red-500 shadow-md";
      icon = <XCircle className="w-5 h-5 text-red-500 ml-auto" />;
      animationClass = animationClasses.pulseError;
    } else {
      optionClasses = "bg-card border border-border";
    }
  } else if (isSelected) {
    optionClasses =
      "bg-primary/10 border-primary ring-2 ring-primary shadow-inner transition-shadow";
  }

  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={`w-full flex items-center p-3 sm:p-4 rounded-md border-2 transition-all duration-300 disabled:cursor-not-allowed ${optionClasses} ${animationClass}`}
      aria-pressed={isSelected}
      aria-disabled={disabled}
    >
      <span
        className={`mr-2 sm:mr-3 min-w-[2rem] h-8 rounded-md flex items-center justify-center font-bold text-primary-foreground select-none ${badgeColor}`}
      >
        {letter}
      </span>
      <span className="text-left text-sm font-medium flex-1">{text}</span>
      {icon}
    </button>
  );
}

// Enhanced Quiz Feedback Component with smooth slide and fade + icon bounce for correct
function QuizFeedbackDisplay({ isCorrect, explanation }: { isCorrect: boolean; explanation: string }) {
  return (
    <Box
      className={`p-3 sm:p-4 rounded-md border-2 shadow-md ${
        isCorrect
          ? "bg-green-900/20 border-green-500"
          : "bg-red-900/20 border-red-500"
      } animate-slide-in-right`}
      role="alert"
      aria-live="polite"
    >
      <Box className="flex items-start gap-3">
        {isCorrect ? (
          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5 animate-bounce" />
        ) : (
          <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5 animate-shake" />
        )}
        <Box className="flex-1">
          <p
            className={`font-semibold text-sm mb-1 ${
              isCorrect ? "text-green-400" : "text-red-400"
            }`}
          >
            {isCorrect ? "Correct! ✅" : "Incorrect ❌"}
          </p>
          <Box className="text-sm text-foreground prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{explanation}</ReactMarkdown>
          </Box>
        </Box>
      </Box>
      <style jsx>{`
        @keyframes shake {
          10%, 90% {
            transform: translateX(-1px);
          }
          20%, 80% {
            transform: translateX(2px);
          }
          30%, 50%, 70% {
            transform: translateX(-4px);
          }
          40%, 60% {
            transform: translateX(4px);
          }
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </Box>
  );
}

// Enhanced Quiz Results Component with animated circular progress and smooth expand/collapse
function QuizResults({
  answers,
  onRetake,
}: {
  answers: QuizAnswer[];
  onRetake?: () => void;
}) {
  const totalQuestions = answers.length;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const incorrectCount = totalQuestions - correctCount;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  const getGrade = (pct: number) => {
    if (pct >= 90) return { grade: "A", color: "text-green-500", message: "Excellent work! 🌟" };
    if (pct >= 80) return { grade: "B", color: "text-green-500", message: "Great job—keep it up! 👍" };
    if (pct >= 70) return { grade: "C", color: "text-yellow-500", message: "Good effort, room to grow! 📈" };
    if (pct >= 60) return { grade: "D", color: "text-yellow-500", message: "Solid start—practice more! 💪" };
    return { grade: "F", color: "text-red-500", message: "No worries—let's try again! 🔄" };
  };

  const { grade, color, message } = getGrade(percentage);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <Box className="space-y-6 animate-slide-in-up w-full max-w-4xl mx-auto">
      <Box className="p-4 sm:p-8 bg-card rounded-xl text-center border-2 border-border shadow-lg">
        <Box className="mb-6">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4 animate-bounce" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">Quiz Complete! 🎉</h2>
          <p className="text-muted-foreground">{message}</p>
        </Box>

        <Box className="flex items-center justify-center mb-6">
          <Box className="relative w-32 h-32 sm:w-40 sm:h-40">
            <svg className="w-full h-full transform -rotate-90" aria-hidden="true">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - percentage / 100)}`}
                className={color}
                style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
              />
            </svg>
            <Box className="absolute inset-0 flex items-center justify-center flex-col" aria-label="Score percentage">
              <span className={`text-3xl sm:text-5xl font-extrabold ${color} select-none`}>{percentage}%</span>
              <span className="text-sm text-muted-foreground select-none">Score</span>
            </Box>
          </Box>
        </Box>

        <Box className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Box className="p-4 bg-card rounded-md shadow-sm">
            <Target className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold text-foreground">{totalQuestions}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </Box>
          <Box className="p-4 bg-green-900/20 rounded-md shadow-sm">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-400" />
            <p className="text-2xl font-bold text-green-400">{correctCount}</p>
            <p className="text-xs text-muted-foreground">Correct</p>
          </Box>
          <Box className="p-4 bg-red-900/20 rounded-md shadow-sm">
            <Clock className="w-6 h-6 mx-auto mb-2 text-red-400" />
            <p className="text-2xl font-bold text-red-400">{incorrectCount}</p>
            <p className="text-xs text-muted-foreground">Incorrect</p>
          </Box>
        </Box>

        <Box className={`text-5xl sm:text-7xl font-extrabold mb-2 select-none ${color}`}>{grade}</Box>
        <p className="text-sm text-muted-foreground mb-6 select-none">Final Grade</p>

        {onRetake && (
          <button
            onClick={onRetake}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8 rounded-xl transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Retake Quiz 🔄
          </button>
        )}
      </Box>

      <Box className="p-4 sm:p-6 bg-card rounded-xl border-2 border-border shadow-inner w-full max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Answer Review 📝</h3>
        <Box className="space-y-2">
          {answers.map((answer, idx) => (
            <Box key={idx} className="border-2 border-border rounded-md overflow-hidden">
              <button
                onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                aria-expanded={expandedIndex === idx}
                aria-controls={`answer-review-${idx}`}
              >
                <Box className="flex items-center gap-3">
                  <Box
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold select-none ${
                      answer.isCorrect ? "bg-green-500 text-primary-foreground" : "bg-red-500 text-primary-foreground"
                    }`}
                  >
                    {idx + 1}
                  </Box>
                  <span className="text-sm font-medium text-foreground select-none">
                    Question {answer.questionNumber}
                  </span>
                </Box>
                <ArrowRight
                  className={`w-4 h-4 transition-transform ${
                    expandedIndex === idx ? "rotate-90" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
              {expandedIndex === idx && (
                <Box
                  id={`answer-review-${idx}`}
                  className="px-3 sm:px-4 pb-4 pt-2 bg-muted/50 space-y-2 text-sm animate-fade-in"
                >
                  <p className="font-medium text-foreground">{answer.questionText}</p>
                  <p className="text-muted-foreground">
                    Your answer:{" "}
                    <span
                      className={
                        answer.isCorrect
                          ? "text-green-400 font-semibold"
                          : "text-red-400 font-semibold"
                      }
                    >
                      {answer.selectedAnswer}
                    </span>
                  </p>
                  <Box className="text-muted-foreground prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer.explanation}</ReactMarkdown>
                  </Box>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

// Enhanced QuizCard Component with improved animations on answer check and transitions
function QuizCard({
  text,
  onSubmit,
  messageId,
}: {
  text: string;
  onSubmit: (answers: Record<number, string>) => Promise<void>;
  messageId: number;
}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selections, setSelections] = useState<Record<number, string>>({});
  const [feedback, setFeedback] = useState<Record<number, QuizFeedback>>({});
  const [isChecking, setIsChecking] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const parsed = parseQuiz(text);
    setQuestions(parsed);
  }, [text]);

  const parseQuiz = (text: string): QuizQuestion[] => {
    const parsedQuestions: QuizQuestion[] = [];

    const questionRegex = /\*\*Question\s+(\d+):\*\*\s*([\s\S]*?)(?=\*\*Question\s+\d+:|$)/gi;
    const matches = Array.from(text.matchAll(questionRegex));

    for (const match of matches) {
      const [, numStr, content] = match;
      const num = parseInt(numStr, 10);

      const lines = content.split("\n").filter((line: string) => line.trim());
      const questionText = lines.find((line: string) => !line.trim().match(/^-?\s*[A-D]\./))?.trim() || "";

      const optionRegex = /-?\s*([A-D])\.\s*(.*?)$/gm;
      const options: Array<{ letter: string; text: string }> = [];
      let optMatch;

      while ((optMatch = optionRegex.exec(content)) !== null) {
        const letter = optMatch[1];
        const text = optMatch[2].trim();
        if (text) {
          options.push({ letter, text });
        }
      }

      if (options.length > 0) {
        parsedQuestions.push({ number: num, text: questionText, options });
      }
    }

    return parsedQuestions;
  };

  const currentQ = questions[currentQuestion];
  const isChecked = feedback[currentQuestion] !== undefined;
  const answeredQuestions = new Set(Object.keys(selections).map(Number));
  const correctAnswers = new Set(
    Object.entries(feedback)
      .filter(([, f]) => f.isCorrect)
      .map(([idx]) => Number(idx))
  );

  const handleSelection = (letter: string) => {
    setSelections((prev) => ({ ...prev, [currentQuestion]: letter }));
    if (isChecked) {
      const newFeedback = { ...feedback };
      delete newFeedback[currentQuestion];
      setFeedback(newFeedback);
    }
  };

  const handleCheck = async () => {
    if (!selections[currentQuestion]) {
      toast.error("Please select an answer! 🤔");
      return;
    }

    setIsChecking(true);

    try {
      const checkMessage = `Check this single quiz question answer. Provide structured Markdown feedback:

**Question ${currentQ.number}:** ${currentQ.text}

**Selected Answer:** ${selections[currentQuestion]}

**Is Correct:** Yes or No (be explicit: start with "Yes" or "No")

**Explanation:** Brief reason why it's correct or incorrect, and what the right answer is if wrong.

Quiz context for accuracy: ${text}`;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: checkMessage }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();

      // Improved parsing: Look for "Yes" or "No" after "**Is Correct:**"
      const lowerReply = data.reply.toLowerCase();
      let isCorrect = false;
      const yesMatch = data.reply.match(/(\*\*is correct:\*\*\s*)(yes|correct)/i);
      const noMatch = data.reply.match(/(\*\*is correct:\*\*\s*)(no|incorrect)/i);
      if (yesMatch && !noMatch) {
        isCorrect = true;
      } else if (noMatch) {
        isCorrect = false;
      } else {
        // Fallback to original logic
        isCorrect = lowerReply.includes("yes") || (lowerReply.includes("correct") && !lowerReply.includes("incorrect"));
      }

      setFeedback((prev) => ({
        ...prev,
        [currentQuestion]: {
          questionIndex: currentQuestion,
          isCorrect,
          explanation: data.reply,
        },
      }));
    } catch (error) {
      toast.error("Error checking answer 😔");
      console.error(error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleComplete = () => {
    const unanswered = questions.filter((_, idx) => !selections[idx]);
    if (unanswered.length > 0) {
      toast.error(`Please answer all questions! ${unanswered.length} remaining 🤔`);
      return;
    }

    const allAnswered = questions.every((_, idx) => feedback[idx]);
    if (!allAnswered) {
      toast.error("Please check all your answers before completing! ✅");
      return;
    }

    setIsComplete(true);
  };

  if (questions.length === 0) {
    return (
      <Box className="prose prose-sm max-w-none animate-fade-in-slow">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      </Box>
    );
  }

  if (isComplete) {
    const results: QuizAnswer[] = questions.map((q, idx) => ({
      questionNumber: q.number,
      questionText: q.text,
      selectedAnswer: selections[idx],
      isCorrect: feedback[idx]?.isCorrect || false,
      explanation: feedback[idx]?.explanation || "Not checked",
    }));

    return (
      <QuizResults
        answers={results}
        onRetake={() => {
          setCurrentQuestion(0);
          setSelections({});
          setFeedback({});
          setIsComplete(false);
        }}
      />
    );
  }

  const isLastQuestion = currentQuestion === questions.length - 1;
  const canProceed = isChecked;

  return (
    <Box className="space-y-6 animate-slide-in-up w-full max-w-4xl mx-auto">
      <QuizProgress current={currentQuestion} total={questions.length} answeredQuestions={answeredQuestions} correctAnswers={correctAnswers} />

      <Box className="p-4 sm:p-6 bg-card rounded-xl border-2 border-border shadow-md w-full">
        <h3 className="font-semibold text-lg mb-6 text-foreground">
          Question {currentQ.number}: {currentQ.text}
        </h3>

        <Box className="space-y-3">
          {currentQ.options.map((opt, idx) => (
            <QuizOption
              key={opt.letter}
              letter={opt.letter}
              text={opt.text}
              index={idx}
              isSelected={selections[currentQuestion] === opt.letter}
              isChecked={isChecked}
              isCorrect={feedback[currentQuestion]?.isCorrect ?? null}
              onSelect={() => handleSelection(opt.letter)}
              disabled={isChecking}
            />
          ))}
        </Box>

        {isChecked && feedback[currentQuestion] && (
          <Box className="mt-6">
            <QuizFeedbackDisplay isCorrect={feedback[currentQuestion].isCorrect} explanation={feedback[currentQuestion].explanation} />
          </Box>
        )}

        <Box className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={handleCheck}
            disabled={isChecking || !selections[currentQuestion] || isChecked}
            className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {isChecking ? (
              <>
                <InfinityLoader />
                Checking...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Check Answer
              </>
            )}
          </button>
          {!isLastQuestion ? (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed text-foreground font-medium py-3 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-border"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={!canProceed}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-medium py-3 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
            >
              Complete
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ToolButton({ icon: Icon, label, onClick, active = false, iconColor }: { icon: React.ComponentType<any>; label: string; onClick: () => void; active?: boolean; iconColor?: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg transition-all duration-200 hover:scale-[1.02] ${
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      }`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${iconColor || ''}`} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [pendingImagePreviews, setPendingImagePreviews] = useState<string[]>([]);
  const [activeTool, setActiveTool] = useState<string>("AI Chat");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messageIdRef = useRef(0);

  const router = useRouter();

  const storageKey = currentUserId ? `chats_${currentUserId}` : null;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        toast.error('Failed to fetch user.');
        return;
      }
      setCurrentUserId(user?.id || null);
    };
    fetchCurrentUser();
  }, []);

  // Load chats from localStorage
  useEffect(() => {
    if (!currentUserId || !storageKey) return;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsedChats: Chat[] = JSON.parse(stored);
      setChats(parsedChats);
      if (parsedChats.length > 0) {
        const latestChat = parsedChats[0];
        setCurrentChatId(latestChat.id);
        setMessages(latestChat.messages);
      }
    }
  }, [currentUserId, storageKey]);

  // Save chats to localStorage whenever chats or current messages change
  useEffect(() => {
    if (!currentUserId || !storageKey || !currentChatId) return;
    setChats(prev => {
      const updated = prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages }
          : chat
      );
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  }, [messages, currentChatId, currentUserId, storageKey]);

  const saveCurrentChat = () => {
    if (!currentUserId || !storageKey || !currentChatId) return;
    setChats(prev => {
      const updated = prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages }
          : chat
      );
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  };

const newChat = () => {
  const id = Date.now().toString();
  const newChatObj: Chat = {
    id,
    title: 'New Chat',
    date: new Date().toISOString(),
    messages: [],
  };
  setChats(prev => [newChatObj, ...prev]);
  setCurrentChatId(id);
  setMessages([]);
  setInput(""); // Clear input for fresh start
  setPendingImages([]); // Clear any pending uploads
  setPendingImagePreviews([]); // Clear previews
  setIsSidebarOpen(false);
  // toast.info("New chat started! 📝");
};
  const loadChat = (id: string) => {
    const chat = chats.find(c => c.id === id);
    if (chat) {
      setCurrentChatId(id);
      setMessages(chat.messages);
      setInput(""); // Clear input on switch
      setPendingImages([]); // Clear pending uploads
      setPendingImagePreviews([]); // Clear previews
      setIsSidebarOpen(false);
      toast.info(`Loaded: ${chat.title}`);
    }
  };

  const deleteChat = (id: string) => {
    if (confirm("Delete this chat?")) {
      setChats(prev => {
        const updated = prev.filter(c => c.id !== id);
        if (storageKey) {
          localStorage.setItem(storageKey, JSON.stringify(updated));
        }
        return updated;
      });
      if (currentChatId === id) {
        if (chats.length > 1) {
          const nextChat = chats.find(c => c.id !== id);
          if (nextChat) {
            loadChat(nextChat.id);
          } else {
            newChat();
          }
        } else {
          newChat();
        }
      }
      toast.success('Chat deleted');
    }
  };

  const updateChatTitle = (title: string) => {
    if (currentChatId) {
      setChats(prev => prev.map(chat => 
        chat.id === currentChatId ? { ...chat, title } : chat
      ));
    }
  };

  // Typing animation with fade-in and smooth typing effect at typewriter speed (10ms per char for natural feel)
  const typeBotMessage = (fullText: string, tempMsgId: number, botType?: string, speed = 10) => {
    let index = 0;
    const interval = setInterval(() => {
      index++;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempMsgId
            ? {
                ...m,
                text: fullText.slice(0, index),
                typing: index < fullText.length,
              }
            : m
        )
      );
      if (index >= fullText.length) {
        clearInterval(interval);
        // Set type only when done typing
        if (botType) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempMsgId ? { ...m, type: botType, typing: false } : m
            )
          );
        }
      }
    }, speed);
  };

  // Utility handlers
  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied to clipboard 📋");
      })
      .catch(() => {
        toast.error("Failed to copy");
      });
  };

  const handleLike = (id: number) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, liked: !m.liked, disliked: m.liked ? m.disliked : false }
          : m
      )
    );
  };

  const handleDislike = (id: number) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, disliked: !m.disliked, liked: m.disliked ? m.liked : false }
          : m
      )
    );
  };

  const handleEdit = (id: number) => {
    const msg = messages.find((m) => m.id === id);
    if (msg) {
      setInput(msg.text);
      textareaRef.current?.focus();
    }
  };

  const handleRegenerate = async (userMsgId: number) => {
    const userMsg = messages.find((m) => m.id === userMsgId);
    if (!userMsg) return;

    const botMsgIndex = messages.findIndex(
      (m, i) => m.id === userMsgId && messages[i + 1]?.sender === "bot"
    );
    if (botMsgIndex === -1) return;

    setMessages((prev) => prev.filter((_, i) => i !== botMsgIndex + 1));

    await handleSend(userMsg.text);
  };

  const handleQuizSubmit = async (selections: Record<number, string>) => {
    // Handled per question check in QuizCard
  };

  // Tool handlers (placeholders)
  const handleToolClick = (tool: string) => {
    setActiveTool(tool);
    toast.info(`Switched to ${tool} 🔧`);
  };

  // Main send handler with typewriter animations for all bot responses (including quizzes)
  const handleSend = async (overrideText?: string) => {
    const messageText = overrideText ?? input;
    if (!messageText.trim() && pendingImages.length === 0) return;

    // Update title if first message
    if (messages.length === 0 && messageText.trim()) {
      updateChatTitle(messageText.slice(0, 50) + '...');
    }

    if (pendingImages.length > 0) {
      const previews = [...pendingImagePreviews];
      const userMsg: Message = {
        sender: "user",
        text: messageText || "[Images]",
        images: previews,
        id: messageIdRef.current++,
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setPendingImages([]);
      setPendingImagePreviews([]);

      const tempBotMsg: Message = {
        sender: "bot",
        text: "",
        typing: true,
        id: messageIdRef.current++,
      };
      setMessages((prev) => [...prev, tempBotMsg]);
      setIsTyping(true);

      try {
        const promises = pendingImages.map(
          (file) =>
            new Promise<{ base64: string; mimeType: string }>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => {
                const base64 = reader.result?.toString().split(",")[1] || "";
                resolve({ base64, mimeType: file.type });
              };
              reader.readAsDataURL(file);
            })
        );
        const files = await Promise.all(promises);

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ files, description: messageText }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        const data = await res.json();

        // For images: Use typewriter unless quiz (rare, but consistent)
        if (data.type === 'quiz') {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempBotMsg.id
                ? { ...m, text: data.reply, type: data.type, typing: false }
                : m
            )
          );
        } else {
          // Apply typewriter to non-quiz types
          typeBotMessage(data.reply, tempBotMsg.id, data.type, 10);
        }

        if (data.action && data.action.startsWith("navigate:")) {
          const target = data.action.split(":")[1];
          if (target && target !== window.location.pathname) {
            router.push(target);
          }
        }

        setTimeout(() => {
          previews.forEach(URL.revokeObjectURL);
        }, 1000);
      } catch (error) {
        console.error("Navigation or API error:", error);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempBotMsg.id
              ? {
                  sender: "bot",
                  text: "Error: Could not analyze images. Try again? 😔",
                  id: tempBotMsg.id,
                  typing: false,
                }
              : m
          )
        );
      } finally {
        setIsTyping(false);
      }
      saveCurrentChat();
      return;
    }

    const userMessage: Message = { sender: "user", text: messageText, id: messageIdRef.current++ };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const tempBotMsg: Message = { sender: "bot", text: "", typing: true, id: messageIdRef.current++ };
    setMessages((prev) => [...prev, tempBotMsg]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();

      // Fix for quiz duplication: Skip typewriter for quizzes, set full text immediately
      if (data.type === 'quiz') {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempBotMsg.id
              ? { ...m, text: data.reply, type: data.type, typing: false }
              : m
          )
        );
      } else {
        // Apply typewriter to non-quiz types
        typeBotMessage(data.reply, tempBotMsg.id, data.type, 10);
      }

      if (data.action && data.action.startsWith("navigate:")) {
        const target = data.action.split(":")[1];
        if (target && target !== window.location.pathname) {
          router.push(target);
        }
      }
    } catch (error) {
      console.error("Navigation or API error:", error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempBotMsg.id
            ? { sender: "bot", text: "Error: Could not get response. Try rephrasing? 🤔", id: tempBotMsg.id, typing: false }
            : m
        )
      );
    } finally {
      setIsTyping(false);
      saveCurrentChat();
    }
  };

  // Image handling
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setPendingImages((prev) => [...prev, ...files]);
    setPendingImagePreviews((prev) => [...prev, ...previews]);
  };

  const removePendingImage = (index: number) => {
    setPendingImages((prev) => prev.filter((_, i) => i !== index));
    setPendingImagePreviews((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index]);
      return filtered;
    });
  };

  // Keyboard handling
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Speech recognition
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Your browser does not support Speech Recognition");

    setIsRecording(true);
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;

    let finalTranscript = "";
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + " ";
        else interimTranscript += transcript;
      }
      setInput(finalTranscript + interimTranscript);
    };
    recognition.onend = () => {
      setIsRecording(false);
      const trimmed = finalTranscript.trim();
      if (trimmed) handleSend(trimmed);
    };
    recognition.start();
  };

  // Effects
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
      textareaRef.current.style.overflowY = textareaRef.current.scrollHeight > 200 ? "auto" : "hidden";
    }
  }, [input]);

  // Improved scroll effect: Always scroll to bottom on chat switch (via currentChatId change) or if near bottom
  useEffect(() => {
    const chat = chatContainerRef.current;
    if (!chat) return;
    const isNearBottom = chat.scrollHeight - chat.scrollTop - chat.clientHeight < 100;
    chat.scrollTo({ top: chat.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping, currentChatId]); // Added currentChatId to force scroll on switch

  // Initial load: No auto-new-chat; show empty state if no chats
  useEffect(() => {
    if (chats.length === 0 && currentChatId === null) {
      // Empty state - no greeting
      return;
    }
    if (messages.length === 0 && currentChatId && chats.length > 0) {
      // Load last chat without new greeting
      return;
    }
  }, [chats, currentChatId, messages.length]);

  // Close sidebar on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSidebarOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  if (currentUserId === null) {
    return (
      <Box className="flex-1 flex flex-col justify-center items-center p-4 space-y-4 text-center animate-fade-in-slow">
        <InfinityLoader />
        <p className="text-muted-foreground">Loading...</p>
      </Box>
    );
  }

  // Empty state render if no messages
  if (messages.length === 0 && chats.length === 0) {
    return (
      <Box className="flex-1 flex flex-col justify-center items-center p-4 space-y-4 text-center animate-fade-in-slow">
        <Brain className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold text-foreground">Welcome to Ultimi AI</h2>
        <p className="text-muted-foreground">Your academic companion. Start a new chat to begin! 📚</p>
        <button
          onClick={newChat}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors"
        >
          New Chat
        </button>
      </Box>
    );
  }

  return (
    <Box className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* 🌙 Sidebar */}
      <aside
        className={`w-64 bg-sidebar border-r border-sidebar-border flex flex-col transform transition-transform duration-300 ease-in-out fixed lg:relative h-full z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <Box className="p-4 border-b border-sidebar-border flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold text-sidebar-foreground tracking-wide">
            Academic AI
          </h1>
        </Box>

        {/* Sidebar content */}
        <Box className="flex-1 overflow-y-auto p-3">
          <ToolButton
            icon={MessageSquarePlus}
            label="New Chat"
            onClick={newChat}
            iconColor="text-indigo-500"
          />

          {/* History */}
          <section className="mt-6 space-y-1">
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase px-2 mb-2 tracking-wider">
              Chat History
            </h3>
            {chats.map((chat) => (
              <Box key={chat.id} className="relative group">
                <button
                  onClick={() => loadChat(chat.id)}
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-all ${
                    currentChatId === chat.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-sidebar-accent"
                  }`}
                >
                  <Box>
                    <p className="text-sm font-medium truncate">{chat.title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(chat.date).toLocaleDateString()}
                    </p>
                  </Box>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-destructive/10 transition-opacity"
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </button>
              </Box>
            ))}
          </section>

          {/* Tools */}
          <section className="mt-6 space-y-1">
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase px-2 mb-2 tracking-wider">
              Tools
            </h3>
            <ToolButton
              icon={Sparkles}
              label="AI Chat"
              onClick={() => handleToolClick("AI Chat")}
              active={activeTool === "AI Chat"}
              iconColor="text-blue-500"
            />
            <ToolButton
              icon={Search}
              label="AI Search"
              onClick={() => handleToolClick("AI Search Engine")}
              active={activeTool === "AI Search Engine"}
              iconColor="text-purple-500"
            />
          </section>

          {/* Others */}
          <section className="mt-6 space-y-1">
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase px-2 mb-2 tracking-wider">
              Others
            </h3>
            <ToolButton
              icon={Smartphone}
              label="Mobile App"
              onClick={() => window.open("https://ultimi.ai/app", "_blank")}
              iconColor="text-green-500"
            />
            <ToolButton
              icon={DownloadCloud}
              label="Export"
              onClick={() => toast.info("Export feature coming soon")}
              iconColor="text-orange-500"
            />
            <ToolButton
              icon={Coins}
              label="Pricing Plans"
              onClick={() => window.open("https://ultimi.ai/pricing", "_blank")}
              iconColor="text-yellow-500"
            />
          </section>
        </Box>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <Box
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 🌟 Main Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border p-3 sm:p-4 flex items-center gap-4 justify-start rounded-t-lg shadow-sm">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 hover:bg-muted rounded-md transition"
          >
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>
          <Box className="flex items-start gap-3 justify-start">
            <img
              src="/logo.png"
              alt="Ultimi AI Logo"
              className="w-10 h-8 animate-pulse-slow"
            />
            <Box>
              <h2 className="text-lg font-bold text-card-foreground">
                Academic AI Assistant
              </h2>
              <p className="text-xs text-muted-foreground">
                Your personalized learning partner ✨
              </p>
            </Box>
          </Box>
        </header>

        {/* Chat Area */}
        <section
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-2 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-10 prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-semibold prose-h2:text-lg prose-h3:text-base scroll-smooth relative"
        >
          {messages.map((msg, index) => {
            const isBot = msg.sender === "bot";
            const prevUserMsg =
              index > 0 && messages[index - 1]?.sender === "user"
                ? messages[index - 1]
                : null;
            const isQuiz = msg.type === "quiz";

            return (
              <Box
                key={msg.id}
                className={`flex w-full ${
                  isBot ? "justify-start" : "justify-end"
                } animate-fade-in-fast group`}
              >
                <Box
                  className={`max-w-[90%] sm:max-w-[75%] rounded-2xl p-3 sm:p-4 shadow-md border text-sm leading-relaxed transition-all ${
                    isBot
                      ? "bg-muted/30 border-border/40 text-foreground rounded-bl-none"
                      : "bg-primary text-primary-foreground border-primary/20 rounded-br-none"
                  } ${isQuiz ? animationClasses.slideInUp : ""}`}
                >
                  {msg.images?.length
                    ? msg.images.map((img, i) => (
                        <Image
                          key={i}
                          src={img}
                          alt="Uploaded"
                          width={200}
                          height={200}
                          className="rounded-lg mb-2 object-cover shadow-md animate-fade-in w-full max-w-[250px]"
                          priority
                        />
                      ))
                    : null}

                  {isBot ? (
                    isQuiz ? (
                      <QuizCard text={msg.text} onSubmit={handleQuizSubmit} messageId={msg.id} />
                    ) : (
                      <Box className="prose prose-invert max-w-none prose-p:leading-relaxed prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-strong:font-semibold prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80 prose-ul:list-disc prose-ol:list-decimal prose-li:my-1 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-img:rounded-lg prose-img:shadow-md prose-pre:bg-muted prose-pre:p-3 prose-pre:rounded-lg prose-pre:text-sm">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.text}
                        </ReactMarkdown>
                      </Box>
                    )
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}

                  {msg.typing && (
                    <Box className="flex items-center justify-start mt-3">
                      <InfinityLoader />
                    </Box>
                  )}

                  {/* Message Actions - Fix: Always visible on mobile, hover on sm+ */}
                  {!msg.typing && (
                    <Box className="flex items-center gap-2 mt-2 pt-2 border-t border-border/40 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => handleCopy(msg.text)}
                        title="Copy"
                        className="p-1 rounded-full hover:bg-muted transition-colors"
                      >
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      </button>
                      {msg.sender === "user" && (
                        <button
                          onClick={() => handleEdit(msg.id)}
                          title="Edit"
                          className="p-1 rounded-full hover:bg-muted transition-colors"
                        >
                          <PencilLine className="w-4 h-4 text-muted-foreground" />
                        </button>
                      )}
                      {isBot && (
                        <>
                          <button
                            onClick={() => handleLike(msg.id)}
                            title="Like"
                            className={`p-1 rounded-full hover:bg-muted transition-colors ${msg.liked ? "text-green-400" : ""}`}
                          >
                            <ThumbsUp className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleDislike(msg.id)}
                            title="Dislike"
                            className={`p-1 rounded-full hover:bg-muted transition-colors ${msg.disliked ? "text-red-400" : ""}`}
                          >
                            <ThumbsDown className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() =>
                              handleRegenerate(prevUserMsg?.id || 0)
                            }
                            title="Regenerate"
                            className="p-1 rounded-full hover:bg-muted transition-colors"
                          >
                            <RotateCcw className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}
        </section>

        {/* Input */}
        <footer className="bg-card border-t border-border p-3 sm:p-4 rounded-b-lg pb-[90px] sm:pb-[30px] md:pb-[20px] relative z-10">
          <Box className="max-w-2xl mx-auto flex items-end gap-2 sm:gap-3 w-full">
            <label className="p-2 rounded-full bg-muted hover:bg-muted/80 cursor-pointer transition-colors flex-shrink-0">
              <Paperclip className="w-5 h-5 text-muted-foreground" />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1 resize-none bg-input text-foreground p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary min-h-[40px] max-h-[200px]"
              rows={1}
            />

            <button
              onClick={startListening}
              type="button"
              className="p-2 rounded-full bg-muted hover:bg-muted/80 relative transition-colors flex-shrink-0"
            >
              {isRecording && (
                <>
                  <span className="absolute inset-0 rounded-full border-2 border-primary animate-ping"></span>
                  <span
                    className="absolute inset-0 rounded-full border-2 border-primary opacity-50 animate-ping"
                    style={{ animationDelay: "75ms" }}
                  ></span>
                </>
              )}
              <Mic className="w-5 h-5 text-muted-foreground relative z-10" />
            </button>

            <button
              onClick={() => {
                if ("vibrate" in navigator) navigator.vibrate(40);
                handleSend();
              }}
              disabled={isTyping}
              className="p-3 sm:p-4 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 flex-shrink-0"
            >
              <SendHorizonal className="w-5 h-5 text-primary-foreground" />
            </button>
          </Box>

          {pendingImagePreviews.length > 0 && (
            <Box className="flex gap-2 mt-3 animate-fade-in flex-wrap">
              {pendingImagePreviews.map((preview, index) => (
                <Box key={index} className="relative w-12 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => removePendingImage(index)}
                    className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Box>
              ))}
            </Box>
          )}
        </footer>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        .animate-fade-in-fast {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slide-in-up {
          animation: slideInUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.4s ease-out;
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out;
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-pulse-success {
          animation: pulseSuccess 1.5s ease-in-out;
        }
        @keyframes pulseSuccess {
          0% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
          }
        }
        .animate-pulse-error {
          animation: pulseError 1.5s ease-in-out;
        }
        @keyframes pulseError {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-fade-in-slow {
          animation: fadeIn 0.6s ease-out;
        }
        .delay-75 {
          animation-delay: 75ms;
        }
      `}</style>
    </Box>
  );
}