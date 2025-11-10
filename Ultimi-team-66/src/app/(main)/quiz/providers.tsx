'use client';

import { MotionConfig } from 'framer-motion';
import { QuizProvider } from '@/features/quiz/context/QuizContext';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QuizProvider>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </QuizProvider>
  );
}
