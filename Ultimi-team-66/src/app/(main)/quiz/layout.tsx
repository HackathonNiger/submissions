// 'use client';

// import { MotionConfig } from 'framer-motion';
// import '../../globals.css';
// import { QuizProvider } from '@/features/quiz/context/QuizContext';

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" className="">
//       <body >
//         <QuizProvider>
//           <MotionConfig reducedMotion="user">{children}</MotionConfig>
//         </QuizProvider>
//       </body>
//     </html>
//   );
// }





'use client';

import { MotionConfig } from 'framer-motion';
import { QuizProvider } from '@/features/quiz/context/QuizContext';
import '../../globals.css';

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <QuizProvider>
      <head>
        <title>Quiz | Ultimi</title>
        <meta name="description" content="Learn more about us." />
      </head>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </QuizProvider>
  );
}
