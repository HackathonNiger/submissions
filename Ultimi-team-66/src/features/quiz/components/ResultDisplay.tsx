// 'use client';

// import { BarChart, Award } from 'lucide-react';
// import { motion } from 'framer-motion';

// interface ScoreResult {
//   correct: number;
//   total: number;
//   percentage: number;
// }

// export default function ResultDisplay({
//   score,
//   examType,
// }: {
//   score: ScoreResult;
//   examType: 'WAEC' | 'NECO' | 'JAMB' | 'normal';
// }) {
//   const { correct, total, percentage } = score;

//   // WAEC grading scale
//   const getWAECGrade = (perc: number) => {
//     if (perc >= 75) return 'A1';
//     if (perc >= 70) return 'B2';
//     if (perc >= 65) return 'B3';
//     if (perc >= 60) return 'C4';
//     if (perc >= 55) return 'C5';
//     if (perc >= 50) return 'C6';
//     if (perc >= 45) return 'D7';
//     if (perc >= 40) return 'E8';
//     return 'F9';
//   };

//   // Normal grading scale
//   const getNormalGrade = (perc: number) => {
//     if (perc >= 90) return 'A+';
//     if (perc >= 80) return 'A';
//     if (perc >= 70) return 'B';
//     if (perc >= 60) return 'C';
//     if (perc >= 50) return 'D';
//     return 'F';
//   };

//   const variants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
//   };

//   if (examType === 'WAEC') {
//     return (
//       <motion.div
//         initial="hidden"
//         animate="visible"
//         variants={variants}
//         className="space-y-4 text-center"
//       >
//         <h2 className="text-4xl font-bold  text-transparent bg-clip-text">
//           WAEC Results
//         </h2>
//         <p className="flex justify-center items-center text-2xl">
//           <BarChart className="mr-2" />
//           Score: {correct}/{total}
//         </p>
//         <p className="flex justify-center items-center text-2xl">
//           Percentage: {percentage}%
//         </p>
//         <p className="text-3xl font-semibold text-blue-600 dark:text-blue-400">
//           Grade: {getWAECGrade(percentage)}
//         </p>
//       </motion.div>
//     );
//   } else if (examType === 'JAMB') {
//     const jambScore = Math.round((percentage / 100) * 400);
//     return (
//       <motion.div
//         initial="hidden"
//         animate="visible"
//         variants={variants}
//         className="space-y-4 text-center"
//       >
//         <h2 className="text-4xl font-bold gradient-bg text-transparent bg-clip-text">
//           JAMB Results
//         </h2>
//         <p className="flex justify-center items-center text-2xl">
//           <BarChart className="mr-2" />
//           Score: {jambScore}/400
//         </p>
//         <p className="flex justify-center items-center text-2xl">
//                     Percentage: {percentage}%

//         </p>
//       </motion.div>
//     );
//   } else {
//     return (
//       <motion.div
//         initial="hidden"
//         animate="visible"
//         variants={variants}
//         className="space-y-4 text-center"
//       >
//         <h2 className="text-4xl font-bold gradient-bg text-transparent bg-clip-text">
//           Quiz Results
//         </h2>
//         <p className="flex justify-center items-center text-2xl">
//           <Award className="mr-2" />
//           Score: {correct}/{total}
//         </p>
//         <p className="flex justify-center items-center text-2xl">
//                    Percentage: {percentage}%

//         </p>
//         <p className="text-3xl font-semibold text-blue-600 dark:text-blue-400">
//           Grade: {getNormalGrade(percentage)}
//         </p>
//       </motion.div>
//     );
//   }
// }



'use client';

import { BarChart, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScoreResult {
  correct: number;
  total: number;
  percentage: number;
}

export default function ResultDisplay({
  score,
  examType,
}: {
  score: ScoreResult;
  examType: 'WAEC' | 'NECO' | 'JAMB' | 'normal';
}) {
  const { correct, total, percentage } = score;

  // WAEC grading scale
  const getWAECGrade = (perc: number) => {
    if (perc >= 75) return 'A1';
    if (perc >= 70) return 'B2';
    if (perc >= 65) return 'B3';
    if (perc >= 60) return 'C4';
    if (perc >= 55) return 'C5';
    if (perc >= 50) return 'C6';
    if (perc >= 45) return 'D7';
    if (perc >= 40) return 'E8';
    return 'F9';
  };

  // Normal grading scale
  const getNormalGrade = (perc: number) => {
    if (perc >= 90) return 'A+';
    if (perc >= 80) return 'A';
    if (perc >= 70) return 'B';
    if (perc >= 60) return 'C';
    if (perc >= 50) return 'D';
    return 'F';
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (examType === 'WAEC') {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={variants}
        className="space-y-4 text-center"
      >
        <h2 className="text-4xl font-bold  text-transparent bg-clip-text">
          WAEC Results
        </h2>
        <p className="flex justify-center items-center text-2xl">
          <BarChart className="mr-2" />
          Score: {correct}/{total}
        </p>
        <p className="flex justify-center items-center text-2xl">
          Percentage: {percentage}%
        </p>
        <p className="text-3xl font-semibold text-blue-600 dark:text-blue-400">
          Grade: {getWAECGrade(percentage)}
        </p>
      </motion.div>
    );
  } else if (examType === 'JAMB') {
    const jambScore = Math.round((percentage / 100) * 400);
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={variants}
        className="space-y-4 text-center"
      >
        <h2 className="text-4xl font-bold gradient-bg text-transparent bg-clip-text">
          JAMB Results
        </h2>
        <p className="flex justify-center items-center text-2xl">
          <BarChart className="mr-2" />
          Score: {jambScore}/400
        </p>
        <p className="flex justify-center items-center text-2xl">
          Percentage: {percentage}%
        </p>
      </motion.div>
    );
  } else {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={variants}
        className="space-y-4 text-center"
      >
        <h2 className="text-4xl font-bold gradient-bg text-transparent bg-clip-text">
          Quiz Results
        </h2>
        <p className="flex justify-center items-center text-2xl">
          <Award className="mr-2" />
          Score: {correct}/{total}
        </p>
        <p className="flex justify-center items-center text-2xl">
          Percentage: {percentage}%
        </p>
        <p className="text-3xl font-semibold text-blue-600 dark:text-blue-400">
          Grade: {getNormalGrade(percentage)}
        </p>
      </motion.div>
    );
  }
}