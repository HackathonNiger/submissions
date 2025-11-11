// 'use client';

// import { ArrowLeft, ArrowRight, CircleAlert, Home } from 'lucide-react';
// import { useContext, useEffect, useState } from 'react';
// import LoadingSpinner from '@/features/quiz/components/LoadingSpinner';
// import PreviewQuestion from '@/features/quiz/components/PreviewQuestion';
// import { Question } from '@/lib/types';
// import { QuizContext } from '@/features/quiz/context/QuizContext';
// import SubjectSwitcher from '@/features/quiz/components/SubjectSwitcher';
// import { motion } from 'framer-motion';
// import { useRouter } from 'next/navigation';

// export default function Preview() {
//   const {
//     questions,
//     userAnswers,
//     setUserAnswers,
//     currentSubject,
//     setQuestions,
//     setCurrentSubject,
//     setCurrentIndices,
//   } = useContext(QuizContext);

//   const router = useRouter();
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [direction, setDirection] = useState(0);
//   const [ready, setReady] = useState(false);

//   // Load quiz state from localStorage on mount
//   useEffect(() => {
//     const storedQuizState = localStorage.getItem('quizState');
//     if (storedQuizState && (!questions || Object.keys(questions).length === 0)) {
//       const quizState = JSON.parse(storedQuizState);
//       if (quizState.questions) setQuestions(quizState.questions);
//       if (quizState.userAnswers) setUserAnswers(quizState.userAnswers);
//       if (quizState.currentSubject) setCurrentSubject(quizState.currentSubject);
//       if (quizState.currentIndices) setCurrentIndices(quizState.currentIndices);
//     }

//     const storedPreviewState = localStorage.getItem('previewState');
//     if (storedPreviewState) {
//       const { currentIndex: storedIndex } = JSON.parse(storedPreviewState);
//       setCurrentIndex(storedIndex || 0);
//     }

//     setReady(true);
//   }, [questions, setQuestions, setUserAnswers, setCurrentSubject, setCurrentIndices]);

//   // Save currentIndex to localStorage
//   useEffect(() => {
//     localStorage.setItem('previewState', JSON.stringify({ currentIndex }));
//   }, [currentIndex]);

//   // Clear localStorage on route leave
//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       const currentPath = window.location.pathname;
//       if (!['/quiz/home', '/quiz/preview'].includes(currentPath)) {
//         localStorage.removeItem('quizState');
//         localStorage.removeItem('userAnswers');
//         localStorage.removeItem('previewState');
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, []);

//   // Wait until questions and answers are ready
//   if (!ready || !questions[currentSubject] || !userAnswers) {
//     return <LoadingSpinner message="" />;
//   }

//   // Build subject-specific questions
//   const subjectQuestions: (Question & {
//     subject: string;
//     userAnswer: number;
//     questionIndex: number;
//   })[] = questions[currentSubject].map((q, idx) => ({
//     ...q,
//     subject: currentSubject,
//     userAnswer: userAnswers[currentSubject]?.[idx] ?? -1,
//     questionIndex: idx,
//   }));

//   const currentQuestion = subjectQuestions[currentIndex];

//   const handlePrev = () => {
//     if (currentIndex > 0) {
//       setDirection(-1);
//       setCurrentIndex(currentIndex - 1);
//     }
//   };

//   const handleNext = () => {
//     if (currentIndex < subjectQuestions.length - 1) {
//       setDirection(1);
//       setCurrentIndex(currentIndex + 1);
//     }
//   };

//   const handleGoHome = () => {
//     localStorage.removeItem('quizState');
//     localStorage.removeItem('userAnswers');
//     localStorage.removeItem('previewState');
//     setUserAnswers({});
//     setQuestions({});
//     setCurrentIndices({});
//     setCurrentSubject('');
//     router.push('/dashboard');
//   };

//   const variants = {
//     enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
//     center: { x: 0, opacity: 1 },
//     exit: (direction: number) => ({ x: direction > 0 ? -50 : 50, opacity: 0 }),
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="card max-w-2xl w-full"
//       >
//         <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
//           Question Preview ({currentIndex + 1}/{subjectQuestions.length}) –{' '}
//           {currentSubject.charAt(0).toUpperCase() + currentSubject.slice(1)}
//         </h1>

//         <SubjectSwitcher />

//         <motion.div
//           custom={direction}
//           variants={variants}
//           initial="enter"
//           animate="center"
//           exit="exit"
//           transition={{ duration: 0.3 }}
//           key={`${currentSubject}-${currentIndex}`}
//           className="relative"
//         >
//           {currentQuestion.userAnswer === -1 && (
//             <div className="flex items-center justify-center gap-2 mb-4 p-3 rounded-xl border border-red-300 bg-red-50 text-red-700 font-medium shadow-sm dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
//               <CircleAlert className="w-5 h-5 flex-shrink-0" />
//               <span className="text-sm sm:text-base">Not Answered</span>
//             </div>
//           )}

//           <PreviewQuestion
//             question={currentQuestion}
//             userAnswer={currentQuestion.userAnswer}
//           />
//         </motion.div>

//         <div className="flex justify-between mt-8">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={handlePrev}
//             disabled={currentIndex === 0}
//             className="flex items-center bg-gray-200 dark:bg-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition"
//           >
//             <ArrowLeft className="mr-2" /> Previous
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={handleNext}
//             disabled={currentIndex === subjectQuestions.length - 1}
//             className="flex items-center bg-gray-200 dark:bg-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition"
//           >
//             Next <ArrowRight className="ml-2" />
//           </motion.button>
//         </div>

//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={handleGoHome}
//           className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
//         >
//           <Home className="inline mr-2" /> Back to Home
//         </motion.button>
//       </motion.div>
//     </div>
//   );
// }

'use client';

import { ArrowLeft, ArrowRight, CircleAlert, Home } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import LoadingSpinner from '@/features/quiz/components/LoadingSpinner';
import PreviewQuestion from '@/features/quiz/components/PreviewQuestion';
import { Question } from '@/lib/types';
import { QuizContext } from '@/features/quiz/context/QuizContext';
import SubjectSwitcher from '@/features/quiz/components/SubjectSwitcher';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Preview() {
  const {
    questions,
    userAnswers,
    setUserAnswers,
    currentSubject,
    setQuestions,
    setCurrentSubject,
    setCurrentIndices,
  } = useContext(QuizContext);

  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [ready, setReady] = useState(false);

  // Load quiz state from localStorage on mount
  useEffect(() => {
    const storedQuizState = localStorage.getItem('quizState');
    if (storedQuizState && (!questions || Object.keys(questions).length === 0)) {
      const quizState = JSON.parse(storedQuizState);
      if (quizState?.questions) setQuestions(quizState.questions);
      if (quizState?.userAnswers) setUserAnswers(quizState.userAnswers);
      if (quizState?.currentSubject) setCurrentSubject(quizState.currentSubject);
      if (quizState?.currentIndices) setCurrentIndices(quizState.currentIndices);
    }

    const storedPreviewState = localStorage.getItem('previewState');
    if (storedPreviewState) {
      const { currentIndex: storedIndex } = JSON.parse(storedPreviewState);
      setCurrentIndex(storedIndex || 0);
    }

    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only on mount

  // Save currentIndex to localStorage
  useEffect(() => {
    localStorage.setItem('previewState', JSON.stringify({ currentIndex }));
  }, [currentIndex]);

  // Clear localStorage on route leave
  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentPath = window.location.pathname;
      if (!['/quiz/home', '/quiz/preview'].includes(currentPath)) {
        localStorage.removeItem('quizState');
        localStorage.removeItem('userAnswers');
        localStorage.removeItem('previewState');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Wait until questions and answers are ready
  if (!ready || !questions[currentSubject] || !userAnswers) {
    return <LoadingSpinner message="" />;
  }

  // Build subject-specific questions
  const subjectQuestions: (Question & {
    subject: string;
    userAnswer: number;
    questionIndex: number;
  })[] = questions[currentSubject].map((q, idx) => ({
    ...q,
    subject: currentSubject,
    userAnswer: userAnswers[currentSubject]?.[idx] ?? -1,
    questionIndex: idx,
  }));

  const currentQuestion = subjectQuestions[currentIndex];

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < subjectQuestions.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleGoHome = () => {
    localStorage.removeItem('quizState');
    localStorage.removeItem('userAnswers');
    localStorage.removeItem('previewState');
    setUserAnswers({});
    setQuestions({});
    setCurrentIndices({});
    setCurrentSubject('');
    router.push('/dashboard');
  };

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -50 : 50, opacity: 0 }),
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 p-4 pb-30 sm: pb-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card max-w-2xl w-full"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
          Question Preview ({currentIndex + 1}/{subjectQuestions.length}) –{' '}
          {currentSubject.charAt(0).toUpperCase() + currentSubject.slice(1)}
        </h1>

        <SubjectSwitcher />

        <motion.div
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
          key={`${currentSubject}-${currentIndex}`}
          className="relative"
        >
          {currentQuestion?.userAnswer === -1 && (
            <div className="flex items-center justify-center gap-2 mb-4 p-3 rounded-xl border border-red-300 bg-red-50 text-red-700 font-medium shadow-sm dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
              <CircleAlert className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm sm:text-base">Not Answered</span>
            </div>
          )}

          <PreviewQuestion
            question={currentQuestion}
            userAnswer={currentQuestion?.userAnswer}
          />
        </motion.div>

        <div className="flex justify-between mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center bg-gray-200 dark:bg-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition"
          >
            <ArrowLeft className="mr-2" /> Previous
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={currentIndex === subjectQuestions?.length - 1}
            className="flex items-center bg-gray-200 dark:bg-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition"
          >
            Next <ArrowRight className="ml-2" />
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoHome}
          className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
        >
          <Home className="inline mr-2" /> Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
}