// 'use client';

// import { useContext } from 'react';
// import { QuizContext } from '../context/QuizContext';
// import { ArrowLeft, ArrowRight } from 'lucide-react';
// import { motion } from 'framer-motion';

// export default function NavigationButtons() {
//   const { questions, currentSubject, currentIndices, setCurrentIndices } = useContext(QuizContext);
//   const currentIndex = currentIndices[currentSubject] || 0;
//   const totalInSubject = questions[currentSubject]?.length || 0;

//   const handlePrev = () => {
//     if (currentIndex > 0) {
//       setCurrentIndices({ ...currentIndices, [currentSubject]: currentIndex - 1 });
//     }
//   };

//   const handleNext = () => {
//     if (currentIndex < totalInSubject - 1) {
//       setCurrentIndices({ ...currentIndices, [currentSubject]: currentIndex + 1 });
//     }
//   };

//   return (
//     <div className="flex space-x-4">
//       <motion.button
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         onClick={handlePrev}
//         disabled={currentIndex === 0}
//         className="flex items-center bg-gray-200 dark:bg-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition"
//       >
//         <ArrowLeft className="mr-2" /> Previous
//       </motion.button>
//       <motion.button
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         onClick={handleNext}
//         disabled={currentIndex === totalInSubject - 1}
//         className="flex items-center bg-gray-200 dark:bg-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition"
//       >
//         Next <ArrowRight className="ml-2" />
//       </motion.button>
//     </div>
//   );
// }






// 'use client';

// import { useContext } from 'react';
// import { QuizContext } from '../context/QuizContext';
// import { ArrowLeft, ArrowRight } from 'lucide-react';
// import { motion } from 'framer-motion';

// export default function NavigationButtons() {
//   const { questions, currentSubject, currentIndices, setCurrentIndices } = useContext(QuizContext);
//   const currentIndex = currentIndices[currentSubject] || 0;
//   const totalInSubject = questions[currentSubject]?.length || 0;

//   const handlePrev = () => {
//     if (currentIndex > 0) {
//       setCurrentIndices({ ...currentIndices, [currentSubject]: currentIndex - 1 });
//     }
//   };

//   const handleNext = () => {
//     if (currentIndex < totalInSubject - 1) {
//       setCurrentIndices({ ...currentIndices, [currentSubject]: currentIndex + 1 });
//     }
//   };

//   return (
//     <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 w-full">
//       <motion.button
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         onClick={handlePrev}
//         disabled={currentIndex === 0}
//         className="flex-1 flex items-center justify-center bg-gray-200 dark:bg-gray-700 py-2 px-4 sm:py-3 sm:px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition text-sm sm:text-base md:text-lg"
//       >
//         <ArrowLeft className="mr-2 w-4 h-4 sm:w-5 sm:h-5" /> Previous
//       </motion.button>

//       <motion.button
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         onClick={handleNext}
//         disabled={currentIndex === totalInSubject - 1}
//         className="flex-1 flex items-center justify-center bg-gray-200 dark:bg-gray-700 py-2 px-4 sm:py-3 sm:px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition text-sm sm:text-base md:text-lg"
//       >
//         Next <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
//       </motion.button>
//     </div>
//   );
// }





'use client';

import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NavigationButtons() {
  const { questions, currentSubject, currentIndices, setCurrentIndices } = useContext(QuizContext);
  const currentIndex = currentIndices[currentSubject] || 0;
  const totalInSubject = questions[currentSubject]?.length || 0;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndices({ ...currentIndices, [currentSubject]: currentIndex - 1 });
    }
  };

  const handleNext = () => {
    if (currentIndex < totalInSubject - 1) {
      setCurrentIndices({ ...currentIndices, [currentSubject]: currentIndex + 1 });
    }
  };

  return (
    <div className="flex gap-3 w-full">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className="flex-1 flex items-center justify-center bg-gray-200 dark:bg-gray-700 py-2 px-3 sm:py-3 sm:px-4 md:py-3 md:px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition text-sm sm:text-base md:text-lg"
      >
        <ArrowLeft className="mr-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        Previous
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNext}
        disabled={currentIndex === totalInSubject - 1}
        className="flex-1 flex items-center justify-center bg-gray-200 dark:bg-gray-700 py-2 px-3 sm:py-3 sm:px-4 md:py-3 md:px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition text-sm sm:text-base md:text-lg"
      >
        Next
        <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </motion.button>
    </div>
  );
}
