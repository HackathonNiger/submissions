// 'use client';

// import { useContext } from 'react';
// import { motion } from 'framer-motion';
// import { QuizContext } from '@/features/quiz/context/QuizContext';

// export default function QuestionDisplay() {
//   const { questions, userAnswers, setUserAnswers, currentSubject, currentIndices, isSubmitted } = useContext(QuizContext);
//   const currentIndex = currentIndices[currentSubject] || 0;
//   const question = questions[currentSubject]?.[currentIndex];
//   const selectedOption = userAnswers[currentSubject]?.[currentIndex] ?? -1;
//   const isLocked = isSubmitted; // Only lock on submission, allow changes before

//   if (!question) return <p className="text-center text-gray-500">No questions available for this subject.</p>;

//   const handleOptionChange = (optionIndex: number) => {
//     if (isLocked) return; // Prevent changes only if submitted
//     const newAnswers = { ...userAnswers };
//     if (!newAnswers[currentSubject]) newAnswers[currentSubject] = [];
//     newAnswers[currentSubject][currentIndex] = optionIndex;
//     setUserAnswers(newAnswers);
//   };

//   return (
//     <motion.div
//       key={`${currentSubject}-${currentIndex}`}
//       initial={{ opacity: 0, x: 20 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ duration: 0.3 }}
//     >
//       <h2 className="text-xl font-semibold mb-4">{question.text}</h2>
//       <div className="space-y-3">
//         {question.options.map((opt, idx) => (
//           <label
//             key={idx}
//             className={`flex items-center p-3 border rounded-lg cursor-pointer transition hover:bg-gray-100 dark:hover:bg-gray-700 ${
//               selectedOption === idx ? 'bg-blue-100 dark:bg-blue-900 border-blue-500' : 'border-gray-300 dark:border-gray-600'
//             } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
//           >
//             <input
//               type="radio"
//               name="option"
//               checked={selectedOption === idx}
//               onChange={() => handleOptionChange(idx)}
//               disabled={isLocked}
//               className="form-radio h-5 w-5 text-blue-600 mr-3 disabled:opacity-50"
//             />
//             {opt}
//           </label>
//         ))}
//       </div>
//       {isLocked && <p className="text-sm text-gray-500 mt-2">Quiz submitted - answers locked.</p>}
//     </motion.div>
//   );
// }



'use client';

import { useContext } from 'react';
import { motion } from 'framer-motion';
import { QuizContext } from '@/features/quiz/context/QuizContext';
import Image from 'next/image';

export default function QuestionDisplay() {
  const { questions, userAnswers, setUserAnswers, currentSubject, currentIndices, isSubmitted } = useContext(QuizContext);
  const currentIndex = currentIndices[currentSubject] || 0;
  const question = questions[currentSubject]?.[currentIndex];
  const selectedOption = userAnswers[currentSubject]?.[currentIndex] ?? -1;
  const isLocked = isSubmitted; // Only lock on submission, allow changes before

  if (!question) return <p className="text-center text-gray-500">No questions available for this subject.</p>;

  const handleOptionChange = (optionIndex: number) => {
    if (isLocked) return; // Prevent changes only if submitted
    const newAnswers = { ...userAnswers };
    if (!newAnswers[currentSubject]) newAnswers[currentSubject] = [];
    newAnswers[currentSubject][currentIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  return (
    <motion.div
      key={`${currentSubject}-${currentIndex}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-4">{question.text}</h2>
      {question.image && (
        <div className="mb-4 flex justify-center">
          <Image
            src={question.image}
            alt="Question image"
            width={400}
            height={300}
            className="max-w-full h-auto rounded-lg shadow-md"
          />
        </div>
      )}
      <div className="space-y-3">
        {question.options.map((opt, idx) => (
          <label
            key={idx}
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition hover:bg-gray-100 dark:hover:bg-gray-700 ${
              selectedOption === idx ? 'bg-blue-100 dark:bg-blue-900 border-blue-500' : 'border-gray-300 dark:border-gray-600'
            } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input
              type="radio"
              name="option"
              checked={selectedOption === idx}
              onChange={() => handleOptionChange(idx)}
              disabled={isLocked}
              className="form-radio h-5 w-5 text-blue-600 mr-3 disabled:opacity-50"
            />
            {opt}
          </label>
        ))}
      </div>
      {isLocked && <p className="text-sm text-gray-500 mt-2">Quiz submitted - answers locked.</p>}
    </motion.div>
  );
}