// 'use client';

// import { useContext } from 'react';
// import { QuizContext } from '../context/QuizContext';
// import { motion } from 'framer-motion';

// export default function SubjectSwitcher() {
//   const { selectedSubjects, currentSubject, setCurrentSubject } = useContext(QuizContext);

//   const capitalize = (str: string) =>
//     str.replace('_', ' ').replace(/\b\w/, (c) => c.toUpperCase());

//   return (
//     <div className="w-full mb-6 px-4 sm:px-6 md:px-8 lg:px-10">
//       {/* Horizontal scroll container */}
//       <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
//         <div className="flex flex-nowrap gap-2">
//           {selectedSubjects.map((subject) => {
//             const isActive = currentSubject === subject;

//             return (
//               <motion.button
//                 key={subject}
//                 onClick={() => setCurrentSubject(subject)}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className={`relative flex-shrink-0 px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-lg font-medium text-sm sm:text-base md:text-lg transition-colors duration-200 ${
//                   isActive
//                     ? 'text-blue-500'
//                     : 'text-gray-800 dark:text-gray-200 hover:text-blue-500'
//                 }`}
//               >
//                 {capitalize(subject)}

//                 {isActive && (
//                   <motion.div
//                     className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-full"
//                     layoutId="subject-underline"
//                     transition={{ type: 'spring', stiffness: 500, damping: 30 }}
//                   />
//                 )}
//               </motion.button>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }







'use client';

import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';
import { motion } from 'framer-motion';

export default function SubjectSwitcher() {
  const { selectedSubjects, currentSubject, setCurrentSubject } = useContext(QuizContext);

  const capitalize = (str: string) =>
    str.replace('_', ' ').replace(/\b\w/, (c) => c.toUpperCase());

  return (
    <div className="w-full mb-6 px-4 sm:px-6 md:px-8 lg:px-10">
      {/* Horizontal scroll container */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-blue-400 dark:scrollbar-thumb-blue-600 scrollbar-track-gray-200 dark:scrollbar-track-gray-800">
        <div className="flex flex-nowrap gap-2">
          {selectedSubjects.map((subject) => {
            const isActive = currentSubject === subject;

            return (
              <motion.button
                key={subject}
                onClick={() => setCurrentSubject(subject)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex-shrink-0 px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-lg font-medium text-sm sm:text-base md:text-lg transition-colors duration-200 ${
                  isActive
                    ? 'text-blue-500'
                    : 'text-gray-800 dark:text-gray-200 hover:text-blue-500'
                }`}
              >
                {capitalize(subject)}

                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-full"
                    layoutId="subject-underline"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
