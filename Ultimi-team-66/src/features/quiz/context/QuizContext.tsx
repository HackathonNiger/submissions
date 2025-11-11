'use client';

import { ReactNode, SetStateAction, createContext, useMemo, useState } from 'react';

import { Question } from '@/lib/types';
import questionsPool from '@/lib/questions';

interface ScoreResult {
  correct: number;
  total: number;
  percentage: number;
}

interface QuizContextType {
  selectedSubjects: string[];
  setSelectedSubjects: (subjects: string[]) => void;
  questionsPerSubject: Record<string, number>;
  setQuestionsPerSubject: React.Dispatch<SetStateAction<Record<string, number>>>;
  totalTime: number;
  setTotalTime: (time: number) => void;
  examType: 'WAEC' | 'NECO' | 'JAMB' | 'normal';
  setExamType: (examType: 'WAEC' | 'NECO' | 'JAMB' | 'normal') => void;
  questions: Record<string, Question[]>;
  setQuestions: (questions: Record<string, Question[]>) => void;
  userAnswers: Record<string, number[]>;
  setUserAnswers: (answers: Record<string, number[]>) => void;
  isSubmitted: boolean;
  setIsSubmitted: (submitted: boolean) => void;
  currentSubject: string;
  setCurrentSubject: (subject: string) => void;
  currentIndices: Record<string, number>;
  setCurrentIndices: (indices: Record<string, number>) => void;
  generateQuestions: () => void;
  resetQuiz: () => void;
  calculateScores: () => ScoreResult;
  isStarting: boolean;
  setIsStarting: (starting: boolean) => void;
}

export const QuizContext = createContext<QuizContextType>({
  selectedSubjects: [],
  setSelectedSubjects: () => {},
  questionsPerSubject: {},
  setQuestionsPerSubject: () => {},
  totalTime: 0,
  setTotalTime: () => {},
  examType: 'normal',
  setExamType: () => {},
  questions: {},
  setQuestions: () => {},
  userAnswers: {},
  setUserAnswers: () => {},
  isSubmitted: false,
  setIsSubmitted: () => {},
  currentSubject: '',
  setCurrentSubject: () => {},
  currentIndices: {},
  setCurrentIndices: () => {},
  generateQuestions: () => {},
  resetQuiz: () => {},
  calculateScores: () => ({ correct: 0, total: 0, percentage: 0 }),
  isStarting: false,
  setIsStarting: () => {},
});

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [questionsPerSubject, setQuestionsPerSubject] = useState<Record<string, number>>({});
  const [totalTime, setTotalTime] = useState(0);
  const [examType, setExamType] = useState<'WAEC' | 'NECO' | 'JAMB' | 'normal'>('normal');
  const [questions, setQuestions] = useState<Record<string, Question[]>>({});
  const [userAnswers, setUserAnswers] = useState<Record<string, number[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentIndices, setCurrentIndices] = useState<Record<string, number>>({});
  const [isStarting, setIsStarting] = useState(false); // ✅ fixed: state added

  const generateQuestions = () => {
    const newQuestions: Record<string, Question[]> = {};
    const newAnswers: Record<string, number[]> = {};
    const newIndices: Record<string, number> = {};

    const subjects =
      examType === 'JAMB' && !selectedSubjects.includes('english')
        ? [...selectedSubjects, 'english']
        : selectedSubjects;

    subjects.forEach(subject => {
      const count = Math.min(
        questionsPerSubject[subject] || 1,
        questionsPool[subject]?.length || 0
      );
      const subjectQuestions = questionsPool[subject] || [];
      const shuffled = [...subjectQuestions].sort(() => Math.random() - 0.5);
      newQuestions[subject] = shuffled.slice(0, count);
      newAnswers[subject] = new Array(count).fill(-1);
      newIndices[subject] = 0;
    });

    setQuestions(newQuestions);
    setUserAnswers(newAnswers);
    setCurrentIndices(newIndices);

    if (subjects.length > 0) {
      setCurrentSubject(subjects[0]);
    }
  };

  const resetQuiz = () => {
    setSelectedSubjects([]);
    setQuestionsPerSubject({});
    setTotalTime(0);
    setExamType('normal');
    setQuestions({});
    setUserAnswers({});
    setIsSubmitted(false);
    setCurrentSubject('');
    setCurrentIndices({});
    setIsStarting(false);
  };

  const calculateScores = (): ScoreResult => {
    let correct = 0;
    let total = 0;

    Object.keys(questions).forEach(subject => {
      questions[subject].forEach((q, idx) => {
        if (userAnswers[subject]?.[idx] === q.correct) {
          correct++;
        }
        total++;
      });
    });

    return {
      correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  };

  const contextValue = useMemo(
    () => ({
      selectedSubjects,
      setSelectedSubjects,
      questionsPerSubject,
      setQuestionsPerSubject,
      totalTime,
      setTotalTime,
      examType,
      setExamType,
      questions,
      setQuestions,
      userAnswers,
      setUserAnswers,
      isSubmitted,
      setIsSubmitted,
      currentSubject,
      setCurrentSubject,
      currentIndices,
      setCurrentIndices,
      generateQuestions,
      resetQuiz,
      calculateScores,
      isStarting,
      setIsStarting,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps 
    [
      selectedSubjects,
      questionsPerSubject,
      totalTime,
      examType,
      questions,
      userAnswers,
      isSubmitted,
      currentSubject,
      currentIndices,
      isStarting,
      calculateScores,
    ]
  );

  return <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>;
};

