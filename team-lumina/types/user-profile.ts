export interface UserProfile {
  // Personal Information
  name: string;
  age: number;
  gradeLevel: string;
  educationBackground: string;
  examTypes: string[]; // Changed from examType to examTypes (array)
  interests: string[]; // Added interests field

  // Learning Preferences
  learningStyle: string[];
  preferredStudyTime: string[];
  studyEnvironment: string;
  attentionSpan: number;

  // Subject Preferences
  subjects: SubjectPreference[];
  primaryGoals: string[];

  // Schedule & Availability
  availableHours: number;
  preferredSessionLength: number;
  studyDays: string[];
  timeZone: string;

  // Learning Characteristics
  currentSkillLevels: Record<string, number>;
  learningChallenges: string[];
  motivationFactors: string[];
  difficultyPreference: string;

  // Adaptive Parameters
  adaptiveSpeed: string;
  feedbackPreference: string;
  assessmentFrequency: string;

  // Goals & Objectives
  shortTermGoals: string[];
  longTermGoals: string[];
  targetCompletionDate?: string;
}

export interface SubjectPreference {
  subject: string;
  priority: number;
  currentLevel: number;
  targetLevel: number;
  weeklyHours: number;
}
