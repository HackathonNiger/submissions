"use client";

import { createContext, useContext, ReactNode, useCallback } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { UserProfile } from "@/types/user-profile";
import type {
  StudentData,
  GeneratedContent,
  QuizAttempt,
} from "@/types/learning-data";

// Define the shape of the context, including all functions
interface DataContextType {
  studentData: StudentData | null;
  updateStudentData: (data: Partial<StudentData> | null) => void;
  saveGeneratedContent: (
    content: Omit<GeneratedContent, "id" | "createdAt">
  ) => void;
  saveQuizAttempt: (
    quizAttempt: Omit<QuizAttempt, "id" | "completedAt">
  ) => void;
  markModuleAsComplete: (moduleTitle: string) => void;
  resetStudentData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [studentData, setStudentData] = useLocalStorage<StudentData | null>(
    "studentData",
    null
  );

  const updateStudentData = useCallback(
    (data: Partial<StudentData> | null) => {
      if (data === null) {
        setStudentData(null);
      } else {
        setStudentData((prev) =>
          prev ? { ...prev, ...data } : (data as StudentData)
        );
      }
    },
    [setStudentData]
  );

  // Saves generated lesson content to the library
  const saveGeneratedContent = useCallback(
    (content: Omit<GeneratedContent, "id" | "createdAt">) => {
      if (!studentData) return;
      const newContent: GeneratedContent = {
        ...content,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      const updatedLibrary = [
        newContent,
        ...(studentData.contentLibrary || []),
      ];
      setStudentData({ ...studentData, contentLibrary: updatedLibrary });
    },
    [studentData, setStudentData]
  );

  // Saves a completed quiz attempt to history
  const saveQuizAttempt = useCallback(
    (quizAttempt: Omit<QuizAttempt, "id" | "completedAt">) => {
      if (!studentData) return;
      const newAttempt: QuizAttempt = {
        ...quizAttempt,
        id: crypto.randomUUID(),
        completedAt: new Date().toISOString(),
      };
      const updatedHistory = [newAttempt, ...(studentData.quizHistory || [])];
      const newPoints = studentData.stats.totalPoints + quizAttempt.score;
      setStudentData({
        ...studentData,
        quizHistory: updatedHistory,
        stats: { ...studentData.stats, totalPoints: newPoints },
      });
    },
    [studentData, setStudentData]
  );

  // Marks a learning path module as complete
  const markModuleAsComplete = useCallback(
    (moduleTitle: string) => {
      if (!studentData || studentData.completedModules?.includes(moduleTitle))
        return;
      const updatedModules = [
        ...(studentData.completedModules || []),
        moduleTitle,
      ];
      const newPoints = studentData.stats.totalPoints + 25; // Award points for module completion
      setStudentData({
        ...studentData,
        completedModules: updatedModules,
        stats: { ...studentData.stats, totalPoints: newPoints },
      });
    },
    [studentData, setStudentData]
  );

  const resetStudentData = useCallback(() => {
    setStudentData(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("studentData");
    }
  }, [setStudentData]);

  const value = {
    studentData,
    updateStudentData,
    saveGeneratedContent,
    saveQuizAttempt,
    markModuleAsComplete,
    resetStudentData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
