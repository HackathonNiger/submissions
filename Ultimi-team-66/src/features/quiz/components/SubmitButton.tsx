// // 'use client';

// // import { useContext } from 'react';
// // import { Send } from 'lucide-react';
// // import { motion } from 'framer-motion';
// // import { QuizContext } from '@/features/quiz/context/QuizContext';

// // export default function SubmitButton() {
// //   const { setIsSubmitted } = useContext(QuizContext);

// //   return (
// //     <motion.button
// //       whileHover={{ scale: 1.05 }}
// //       whileTap={{ scale: 0.95 }}
// //       onClick={() => setIsSubmitted(true)}
// //       className="w-full sm:w-auto flex items-center justify-center bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition text-base sm:text-lg font-medium"
// //     >
// //       <Send className="mr-2" />
// //       Submit Quiz
// //     </motion.button>
// //   );
// // }



// 'use client';

// import { useContext } from 'react';
// import { Send } from 'lucide-react';
// import { motion } from 'framer-motion';
// import { QuizContext } from '@/features/quiz/context/QuizContext';

// export default function SubmitButton() {
//   const { setIsSubmitted } = useContext(QuizContext);

//   return (
//     <motion.button
//       whileHover={{ scale: 1.05 }}
//       whileTap={{ scale: 0.95 }}
//       onClick={() => setIsSubmitted(true)}
//       className="
//         fixed bottom-4 left-1/2 transform -translate-x-1/2 
//         w-11/12 sm:w-64 md:w-72 lg:w-80
//         flex items-center justify-center
//         bg-red-500 text-white
//         py-2 sm:py-3 md:py-4
//         px-4 sm:px-6 md:px-8
//         rounded-lg hover:bg-red-600
//         transition text-sm sm:text-base md:text-lg font-medium
//         z-50
//       "
//     >
//       <Send className="mr-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
//       Submit Quiz
//     </motion.button>
//   );
// }




'use client';

import { useContext } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { QuizContext } from '@/features/quiz/context/QuizContext';

interface SubmitButtonProps {
  disabled?: boolean;
}

export default function SubmitButton({ disabled }: SubmitButtonProps) {
  const { setIsSubmitted } = useContext(QuizContext);

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={() => !disabled && setIsSubmitted(true)}
      disabled={disabled}
      className={`
        fixed bottom-4 left-1/2 transform -translate-x-1/2 
        w-11/12 sm:w-64 md:w-72 lg:w-80
        flex items-center justify-center
        ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}
        text-white
        py-2 sm:py-3 md:py-4
        px-4 sm:px-6 md:px-8
        rounded-lg transition
        text-sm sm:text-base md:text-lg font-medium
        z-50
      `}
    >
      <Send className="mr-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
      {disabled ? 'Saving...' : 'Submit Quiz'}
    </motion.button>
  );
}
