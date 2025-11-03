import type { UserProfile } from "./user-profile";

// Represents a single generated piece of content (lesson, summary, etc.)
export interface GeneratedContent {
  id: string; // Unique ID for the content
  subject: string;
  topic: string;
  contentType: string;
  body: {
    explanation: string;
    examples: string[];
    tips: string[];
    youtubeSuggestions?: string[];
  };
  createdAt: string; // ISO Date string
}

// Represents a quiz taken by the user
export interface QuizAttempt {
  id: string; // Unique ID for the attempt
  subject: string;
  topic: string;
  questions: any[]; // The questions that were asked
  userAnswers: Record<number, string>;
  score: number;
  completedAt: string; // ISO Date string
}

// FIX: Added 'export' to make this interface available to other files.
export interface LearningActivity {
  id: string;
  subject: string;
  topic: string;
  type: "lesson" | "quiz" | "practice";
  score?: number; // Optional score for quizzes or assessments
  completedAt: string; // ISO date string for when the activity was completed
}

// The main data structure for the student
export interface StudentData {
  profile: UserProfile;
  // A library of all generated content for review
  contentLibrary: GeneratedContent[];
  // A log of all quiz attempts
  quizHistory: QuizAttempt[];
  // A simple log for tracking module completions for the learning path
  completedModules: string[]; // Array of module titles or IDs
  stats: {
    streakDays: number;
    totalPoints: number;
  };
}
