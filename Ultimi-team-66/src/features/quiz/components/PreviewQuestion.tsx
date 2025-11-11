// import { Question } from '@/lib/types';
// import { CheckCircle, XCircle } from 'lucide-react';

// interface PreviewProps {
//   question: Question & { subject: string };
//   userAnswer: number;
// }

// export default function PreviewQuestion({ question, userAnswer }: PreviewProps) {
//   const isCorrect = userAnswer === question.correct;

//   return (
//     <div className="space-y-4">
//       <h2 className="text-xl font-semibold">{question.text} <span className="text-gray-500">({question.subject.charAt(0).toUpperCase() + question.subject.slice(1)})</span></h2>
//       <div className="space-y-3">
//         {question.options.map((opt, idx) => (
//           <div
//             key={idx}
//             className={`flex items-center p-3 border rounded-lg ${
//               idx === question.correct ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
//               idx === userAnswer && !isCorrect ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
//               'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
//             }`}
//           >
//             {idx === userAnswer && (
//               isCorrect ? <CheckCircle className="mr-3 text-green-600" /> : <XCircle className="mr-3 text-red-600" />
//             )}
//             {opt}
//             {idx === question.correct && <span className="ml-2 font-medium">(Correct)</span>}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import { Question } from '@/lib/types';
import { CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';

interface PreviewProps {
  question: Question & { subject: string };
  userAnswer: number;
}

export default function PreviewQuestion({ question, userAnswer }: PreviewProps) {
  const isCorrect = userAnswer === question.correct;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{question.text} <span className="text-gray-500">({question.subject.charAt(0).toUpperCase() + question.subject.slice(1)})</span></h2>
      {question.image && (
        <div className="flex justify-center">
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
          <div
            key={idx}
            className={`flex items-center p-3 border rounded-lg ${
              idx === question.correct ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
              idx === userAnswer && !isCorrect ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
              'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
            }`}
          >
            {idx === userAnswer && (
              isCorrect ? <CheckCircle className="mr-3 text-green-600" /> : <XCircle className="mr-3 text-red-600" />
            )}
            {opt}
            {idx === question.correct && <span className="ml-2 font-medium">(Correct)</span>}
          </div>
        ))}
      </div>
    </div>
  );
}