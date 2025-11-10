// 'use client';

// import { useContext, useState, ChangeEvent } from 'react';
// import { useRouter } from 'next/navigation';
// import { Play, AlertCircle, RefreshCw, Plus, Minus, ArrowLeft } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import questionsPool from '@/lib/questions';
// import { QuizContext } from '@/features/quiz/context/QuizContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// const scienceSubjects = [
//   'english',
//   'math',
//   'physics',
//   'chemistry',
//   'biology',
//   'further_math',
//   'agricultural_science',
//   'computer_studies',
// ];
// const artsSubjects = [
//   'english',
//   'math',
//   'literature',
//   'government',
//   'history',
//   'economics',
//   'geography',
//   'civic_education',
//   'crs',
//   'irs',
//   'commerce',
//   'accounting',
//   'fine_arts',
//   'music',
//   'home_economics',
//   'french',
//   'yoruba',
//   'igbo',
//   'hausa',
// ];

// const difficultyLevels = [
//   { value: 'easy', label: 'Easy', timePerQuestion: 60 },
//   { value: 'medium', label: 'Medium', timePerQuestion: 45 },
//   { value: 'hard', label: 'Hard', timePerQuestion: 30 },
// ];

// interface QuizFormProps {
//   route: string;
//   examType: string;
//   onBack: () => void;
// }

// export default function QuizForm({ route, examType, onBack }: QuizFormProps) {
//   const {
//     selectedSubjects,
//     setSelectedSubjects,
//     questionsPerSubject,
//     setQuestionsPerSubject,
//     setTotalTime,
//     generateQuestions,
//     resetQuiz,
//   } = useContext(QuizContext);
//   const router = useRouter();
//   const [hours, setHours] = useState('');
//   const [minutes, setMinutes] = useState('');
//   const [seconds, setSeconds] = useState('');
//   const [difficulty, setDifficulty] = useState<string>('medium');
//   const [timeMode, setTimeMode] = useState<'manual' | 'difficulty'>('difficulty');
//   const [error, setError] = useState('');
//   const maxSubjects =
//     examType === 'WAEC' || examType === 'NECO'
//       ? 9
//       : examType === 'JAMB'
//       ? 4
//       : Infinity;

//   const availableSubjects =
//     route === 'science'
//       ? scienceSubjects
//       : route === 'arts'
//       ? artsSubjects
//       : [...scienceSubjects, ...artsSubjects];

//   const handleSubjectChange = (sub: string, checked: boolean) => {
//     if (examType === 'JAMB' && sub === 'english' && !checked) {
//       setError('English is compulsory for JAMB.');
//       return;
//     }
//     const newSubjects = checked
//       ? [...selectedSubjects, sub]
//       : selectedSubjects.filter(s => s !== sub);
//     if (checked && newSubjects.length > maxSubjects) {
//       setError(`You can select up to ${maxSubjects} subjects for ${examType}.`);
//       return;
//     }
//     setSelectedSubjects(newSubjects);
//     setQuestionsPerSubject(prevCounts => {
//       const newCounts = { ...prevCounts };
//       if (!checked) {
//         delete newCounts[sub];
//       } else if (!(sub in newCounts)) {
//         newCounts[sub] = 1;
//       }
//       return newCounts;
//     });
//     setError('');
//   };

//   const handleQuestionCountChange = (sub: string, e: ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     const num = value === '' ? 0 : parseInt(value, 10);
//     const maxQuestions = questionsPool[sub]?.length || 10;
//     if (value === '' || (!isNaN(num) && num >= 0 && num <= maxQuestions)) {
//       setQuestionsPerSubject(prev => ({ ...prev, [sub]: num }));
//       setError('');
//     } else if (!isNaN(num) && num > maxQuestions) {
//       setError(`Only ${maxQuestions} questions available for ${sub.replace('_', ' ')}.`);
//     }
//   };

//   const handleQuestionCountAdjust = (sub: string, increment: boolean) => {
//     const maxQuestions = questionsPool[sub]?.length || 10;
//     setQuestionsPerSubject(prev => {
//       const current = prev[sub] || 1;
//       const newCount = increment
//         ? Math.min(current + 1, maxQuestions)
//         : Math.max(current - 1, 1);
//       return { ...prev, [sub]: newCount };
//     });
//     setError('');
//   };

//   const handleNumberInput = (
//     value: string,
//     setter: React.Dispatch<React.SetStateAction<string>>,
//     min = 0,
//     max?: number
//   ) => {
//     if (value === '') {
//       setter('');
//       return;
//     }
//     const num = parseInt(value, 10);
//     if (!isNaN(num) && num >= min && (max === undefined || num <= max)) {
//       setter(num.toString());
//     }
//   };

//   const calculateTotalQuestions = () => {
//     return selectedSubjects.reduce((sum, sub) => sum + (questionsPerSubject[sub] || 0), 0);
//   };

//   const getTimeFromDifficulty = () => {
//     const totalQuestions = calculateTotalQuestions();
//     const selectedDifficulty = difficultyLevels.find(d => d.value === difficulty);
//     return totalQuestions * (selectedDifficulty?.timePerQuestion || 45);
//   };

//   const isFormValid = () => {
//     const hasQuestions = selectedSubjects.every(
//       sub => (questionsPerSubject[sub] || 0) > 0
//     );
//     const withinLimits = selectedSubjects.every(
//       sub =>
//         (questionsPerSubject[sub] || 0) <= (questionsPool[sub]?.length || 10)
//     );
//     return (
//       selectedSubjects.length > 0 &&
//       hasQuestions &&
//       withinLimits &&
//       !(examType === 'JAMB' && !selectedSubjects.includes('english')) 
//     );
//   };

//   const handleStart = () => {
//     if (!isFormValid()) {
//       if (selectedSubjects.length === 0) {
//         setError('Please select at least one subject.');
//       } else if (examType === 'JAMB' && !selectedSubjects.includes('english')) {
//         setError('English is compulsory for JAMB.');
//       } else if (!selectedSubjects.every(sub => (questionsPerSubject[sub] || 0) > 0)) {
//         setError('Number of questions cannot be zero for any subject.');
//       } else {
//         setError('One or more subjects have too many questions selected.');
//       }
//       return;
//     }
//     const timeInSec =
//       timeMode === 'manual' && (hours || minutes || seconds)
//         ? (parseInt(hours) || 0) * 3600 +
//           (parseInt(minutes) || 0) * 60 +
//           (parseInt(seconds) || 0)
//         : getTimeFromDifficulty();
//     if (timeInSec === 0) {
//       setError('Calculated time is zero. Please adjust questions or difficulty.');
//       return;
//     }
//     setTotalTime(timeInSec);
//     generateQuestions();
//     router.push('/quiz/home');
//   };

//   const handleReset = () => {
//     resetQuiz();
//     setHours('');
//     setMinutes('');
//     setSeconds('');
//     setDifficulty('medium');
//     setTimeMode('difficulty');
//     setError('');
//   };

//   return (
//     <motion.form
//       onSubmit={e => e.preventDefault()}
//       className="space-y-8 max-w-6xl  w-full mx-auto px-4 sm:px-6 lg:px-8"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//     >
//       <AnimatePresence>
//         {error && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             transition={{ duration: 0.3 }}
//             className="flex items-center text-sm"
//             role="alert"
//           >
//             <AlertCircle className="mr-2 h-4 w-4" />
//             {error}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Back Button */}
//       <motion.button
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         onClick={onBack}
//         className="flex items-center text-sm"
//       >
//         <ArrowLeft className="mr-2 h-4 w-4" />
//         Back to Exam Type
//       </motion.button>

//       {/* Subjects */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Select Subjects </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-8">
//           {route !== 'arts' && (
//             <div>
//               <h3 className="font-medium mb-3">Science Subjects</h3>
//               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
//                 {scienceSubjects.map(sub => (
//                   <motion.div
//                     key={sub}
//                     whileHover={{ scale: 1.02 }}
//                     className="flex items-center space-x-2"
//                   >
//                     <Checkbox
//                       id={sub}
//                       checked={selectedSubjects.includes(sub)}
//                       onCheckedChange={checked => handleSubjectChange(sub, Boolean(checked))}
//                       disabled={
//                         (sub === 'english' && examType === 'JAMB' && selectedSubjects.includes('english')) 
//                       }
//                       className="h-6 w-6"
//                       aria-label={`Select ${sub.replace('_', ' ')}`}
//                     />
//                     <Label htmlFor={sub} className="capitalize text-md">
//                       {sub.replace('_', ' ')}
//                     </Label>
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           )}
//           {route !== 'science' && (
//             <div>
//               <h3 className="font-medium mb-3">Arts/Commercial/Languages</h3>
//               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
//                 {artsSubjects.map(sub => (
//                   <motion.div
//                     key={sub}
//                     whileHover={{ scale: 1.02 }}
//                     className="flex items-center space-x-2"
//                   >
//                     <Checkbox
//                       id={sub}
//                       checked={selectedSubjects.includes(sub)}
//                       onCheckedChange={checked => handleSubjectChange(sub, Boolean(checked))}
//                       disabled={
//                         (sub === 'english' && examType === 'JAMB' && selectedSubjects.includes('english')) ||
//                         (sub === 'math' && ['WAEC', 'NECO'].includes(examType) && selectedSubjects.includes('math'))
//                       }
//                       className="h-6 w-6"
//                       aria-label={`Select ${sub.replace('_', ' ')}`}
//                     />
//                     <Label htmlFor={sub} className="capitalize text-md">
//                       {sub.replace('_', ' ')}
//                     </Label>
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Questions per Subject */}
//       {selectedSubjects.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Number of Questions per Subject</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-3">
//               {selectedSubjects.map(sub => (
//                 <div key={sub} className="flex flex-wrap items-center gap-2">
//                   <span className="w-28 capitalize text-md">
//                     {sub.replace('_', ' ')}
                   
//                   </span>
//                   <div className="flex items-center gap-1">
//                     <Button
//                       type="button"
//                       size="icon"
//                       variant="outline"
//                       onClick={() => handleQuestionCountAdjust(sub, false)}
//                       disabled={questionsPerSubject[sub] <= 1}
//                       className="h-12 w-12"
//                       aria-label={`Decrease questions for ${sub.replace('_', ' ')}`}
//                     >
//                       <Minus size={20} />
//                     </Button>
//                     <Input
//                       type="number"
//                       min={0}
//                       max={questionsPool[sub]?.length || 10}
//                       value={questionsPerSubject[sub] || 0}
//                       onChange={(e: ChangeEvent<HTMLInputElement>) => handleQuestionCountChange(sub, e)}
//                       className="w-24 text-center h-12 text-md"
//                       aria-label={`Number of questions for ${sub.replace('_', ' ')}`}
//                     />
//                     <Button
//                       type="button"
//                       size="icon"
//                       variant="outline"
//                       onClick={() => handleQuestionCountAdjust(sub, true)}
//                       disabled={questionsPerSubject[sub] >= (questionsPool[sub]?.length || 10)}
//                       className="h-12 w-12"
//                       aria-label={`Increase questions for ${sub.replace('_', ' ')}`}
//                     >
//                       <Plus size={20} />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Time Mode Selection */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Time Settings</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <RadioGroup
//             value={timeMode}
//             onValueChange={(value: 'manual' | 'difficulty') => setTimeMode(value)}
//             className="flex space-x-4 mb-4"
//           >
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="difficulty" id="difficulty" className="h-6 w-6" />
//               <Label htmlFor="difficulty" className="text-md">Difficulty-Based</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="manual" id="manual" className="h-6 w-6" />
//               <Label htmlFor="manual" className="text-md">Manual Time</Label>
//             </div>
//           </RadioGroup>

//           <AnimatePresence mode="wait">
//             {timeMode === 'difficulty' ? (
//               <motion.div
//                 key="difficulty"
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: 'auto' }}
//                 exit={{ opacity: 0, height: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <Label htmlFor="difficulty-select" className="block text-md mb-2">
//                   Difficulty Level
//                 </Label>
//                 <Select value={difficulty} onValueChange={setDifficulty}>
//                   <SelectTrigger
//                     id="difficulty-select"
//                     className="h-16 w-full text-md"
//                   >
//                     <SelectValue placeholder="Select difficulty" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {difficultyLevels.map(level => (
//                       <SelectItem key={level.value} value={level.value} className="text-md">
//                         {level.label} ({level.timePerQuestion}s per question)
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <p className="mt-2 text-sm">
//                   Total time: {Math.floor(getTimeFromDifficulty() / 60)} min {getTimeFromDifficulty() % 60} sec
//                 </p>
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="manual"
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: 'auto' }}
//                 exit={{ opacity: 0, height: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <Label className="block text-md mb-2">Custom Time Limit</Label>
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                   <div>
//                     <Label htmlFor="hours" className="text-sm mb-1">Hours</Label>
//                     <Input
//                       id="hours"
//                       type="number"
//                       placeholder="Hours"
//                       value={hours}
//                       onChange={(e: ChangeEvent<HTMLInputElement>) => handleNumberInput(e.target.value, setHours, 0)}
//                       className="h-12 text-md"
//                       aria-label="Hours"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="minutes" className="text-sm mb-1">Minutes</Label>
//                     <Input
//                       id="minutes"
//                       type="number"
//                       placeholder="Minutes"
//                       value={minutes}
//                       onChange={(e: ChangeEvent<HTMLInputElement>) => handleNumberInput(e.target.value, setMinutes, 0, 59)}
//                       className="h-12 text-md"
//                       aria-label="Minutes"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="seconds" className="text-sm mb-1">Seconds</Label>
//                     <Input
//                       id="seconds"
//                       type="number"
//                       placeholder="Seconds"
//                       value={seconds}
//                       onChange={(e: ChangeEvent<HTMLInputElement>) => handleNumberInput(e.target.value, setSeconds, 0, 59)}
//                       className="h-12 text-md"
//                       aria-label="Seconds"
//                     />
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </CardContent>
//       </Card>

//       {/* Buttons */}
//       <div className="flex flex-col sm:flex-row gap-3">
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           type="button"
//           onClick={handleStart}
//           disabled={!isFormValid()}
//           className="flex-1 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-base"
//         >
//           <Play className="mr-2" size={18} />
//           Start Quiz
//         </motion.button>
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           type="button"
//           onClick={handleReset}
//           className="flex-1 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-4 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition text-base"
//         >
//           <RefreshCw className="mr-2" size={18} />
//           Reset
//         </motion.button>
//       </div>
//     </motion.form>
//   );
// }




'use client';

import { useContext, useState, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Play, AlertCircle, RefreshCw, Plus, Minus, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizContext } from '@/features/quiz/context/QuizContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Question } from '@/lib/types';

const scienceSubjects = [
  'english',
  'math',
  'physics',
  'chemistry',
  'biology',
  'further_math',
  'agricultural_science',
  'computer_studies',
];
const artsSubjects = [
  'english',
  'math',
  'literature',
  'government',
  'history',
  'economics',
  'geography',
  'civic_education',
  'crs',
  'irs',
  'commerce',
  'accounting',
  'fine_arts',
  'music',
  'home_economics',
  'french',
  'yoruba',
  'igbo',
  'hausa',
];

const difficultyLevels = [
  { value: 'easy', label: 'Easy', timePerQuestion: 60 },
  { value: 'medium', label: 'Medium', timePerQuestion: 45 },
  { value: 'hard', label: 'Hard', timePerQuestion: 30 },
];

interface QuizFormProps {
  route: string;
  examType: string;
  onBack: () => void;
}

type QuestionItem = {
  question: string
  option: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
};

export default function QuizForm({ route, examType, onBack }: QuizFormProps) {
  const {
    selectedSubjects,
    setSelectedSubjects,
    questionsPerSubject,
    setQuestionsPerSubject,
    setTotalTime,
    setQuestions,
    setCurrentSubject,
    setCurrentIndices,
    resetQuiz,
  } = useContext(QuizContext);
  const router = useRouter();
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [difficulty, setDifficulty] = useState<string>('medium');
  const [timeMode, setTimeMode] = useState<'manual' | 'difficulty'>('difficulty');
  const [error, setError] = useState('');
  const [fetchedQuestions, setFetchedQuestions] = useState<Record<string, Question[]>>({});
  const [loadingSubjects, setLoadingSubjects] = useState<Set<string>>(new Set());
  const [isStartingQuiz, setIsStartingQuiz] = useState(false);
  const maxSubjects =
    examType === 'WAEC' || examType === 'NECO'
      ? 9
      : examType === 'JAMB'
      ? 4
      : Infinity;

  // const availableSubjects =
  //   route === 'science'
  //     ? scienceSubjects
  //     : route === 'arts'
  //     ? artsSubjects
  //     : [...scienceSubjects, ...artsSubjects];

  // Mapping internal subjects to API subjects
  const subjectMapping: Record<string, string> = {
    math: 'mathematics',
    literature: 'englishlit',
    crs: 'crk',
    irs: 'irk',
    civic_education: 'civiledu',
    // Add more if needed; others like english, physics, chemistry match directly
    further_math: 'mathematics', // Assuming same as math
    agricultural_science: 'biology', // Approximate; adjust if API has specific
    computer_studies: 'economics', // Approximate
    fine_arts: 'englishlit', // Approximate
    music: 'englishlit', // Approximate
    home_economics: 'biology', // Approximate
    french: 'english', // Approximate
    yoruba: 'english', // Approximate
    igbo: 'english', // Approximate
    hausa: 'english', // Approximate
  };

  // Mapping examType to API type
  const examTypeMapping: Record<string, string> = {
    WAEC: 'waec',
    NECO: 'neco',
    JAMB: 'utme',
    normal: 'post-utme',
  };

  const fetchQuestions = async (subject: string, apiExamType?: string, count: number = 100): Promise<Question[]> => {
    const mappedSubject = subjectMapping[subject] || subject;
    const apiType = apiExamType ? `&type=${apiExamType}` : '';
    const endpoint = count > 40 ? `/m?subject=${mappedSubject}${apiType}` : `/q/${count}?subject=${mappedSubject}${apiType}`;
    const url = `https://questions.aloc.com.ng/api/v2${endpoint}`;
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'AccessToken': 'QB-a0d4917231d7e57dfa98'
        },
        method: "GET",
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.log({response})
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const apiData = await response.json();
      let rawQuestions = apiData.data;
      if (!Array.isArray(rawQuestions)) {
        rawQuestions = [rawQuestions]; // Handle single question case
      }
      // Process each API question to match Question type
      const questions: Question[] = rawQuestions
        .filter((q: QuestionItem | null | undefined) => q && q.question && q.option)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((q: any): Question => {
          const opts = [
            q.option.a,
            q.option.b,
            q.option.c,
            q.option.d,
            q.option.e
          ].filter(Boolean) as string[];
          const answerKey = q.answer;
          const correctIndex = ['a', 'b', 'c', 'd', 'e'].indexOf(answerKey);
          return {
            text: q.question,
            options: opts,
            correct: correctIndex >= 0 ? correctIndex : 0, // Fallback to 0 if invalid
            image: q.image || '',
          };
        });
      console.log(`Fetched ${questions.length} questions for ${subject} (${apiExamType || 'all types'}). Requested: ${count}`); // Debug log
      return questions;
    } catch (error) {
      console.error(`Failed to fetch questions for ${subject}:`, error);
      toast.error(`Failed to load questions for ${subject.replace('_', ' ')}`);
      return [];
    }
  };

  useEffect(() => {
    const loadAllQuestions = async () => {
      const apiExamType = examTypeMapping[examType];
      const promises = selectedSubjects
        .filter(sub => !fetchedQuestions[sub])
        .map(async (sub) => {
          setLoadingSubjects(prev => new Set([...prev, sub]));
          let questions: Question[] = [];
          const cachedKey = `questions_${sub}_${examType}`;
          const cached = localStorage.getItem(cachedKey);
          if (cached) {
            try {
              questions = JSON.parse(cached) as Question[];
            } catch (e) {
              console.error('Failed to parse cached questions:', e);
            }
          }
          if (questions?.length === 0) {
            questions = await fetchQuestions(sub, apiExamType, 100);
            if (questions.length > 0) {
              localStorage.setItem(cachedKey, JSON.stringify(questions));
            }
          }
          setFetchedQuestions(prev => ({ ...prev, [sub]: questions }));
          setLoadingSubjects(prev => {
            const newSet = new Set(prev);
            newSet.delete(sub);
            return newSet;
          });
        });
      await Promise.all(promises);
    };

    if (selectedSubjects.length > 0 && selectedSubjects.some(sub => !fetchedQuestions[sub])) {
      loadAllQuestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [selectedSubjects, examType, fetchedQuestions]);

  useEffect(() => {
    // Clear cache if examType changes
    Object.keys(fetchedQuestions).forEach(sub => localStorage.removeItem(`questions_${sub}_${examType}`));
    setFetchedQuestions({});
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [examType]);

  const handleSubjectChange = (sub: string, checked: boolean) => {
    const newSubjects = checked
      ? [...selectedSubjects, sub]
      : selectedSubjects.filter(s => s !== sub);
    if (checked && newSubjects.length > maxSubjects) {
      setError(`You can select up to ${maxSubjects} subjects for ${examType}.`);
      return;
    }
    setSelectedSubjects(newSubjects);
    setQuestionsPerSubject(prevCounts => {
      const newCounts = { ...prevCounts };
      if (!checked) {
        delete newCounts[sub];
      } else if (!(sub in newCounts)) {
        newCounts[sub] = 1;
      }
      return newCounts;
    });
    setError('');
  };

  const handleQuestionCountChange = (sub: string, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const num = value === '' ? 0 : parseInt(value, 10);
    const maxQuestions = fetchedQuestions[sub]?.length || 0;
    if (value === '' || (!isNaN(num) && num >= 0 && num <= maxQuestions)) {
      setQuestionsPerSubject(prev => ({ ...prev, [sub]: num }));
      setError('');
    } else if (!isNaN(num) && num > maxQuestions) {
      setError(`Only ${maxQuestions} questions available for ${sub.replace('_', ' ')}.`);
    }
  };

  const handleQuestionCountAdjust = (sub: string, increment: boolean) => {
    const maxQuestions = fetchedQuestions[sub]?.length || 0;
    setQuestionsPerSubject(prev => {
      const current = prev[sub] || 1;
      const newCount = increment
        ? Math.min(current + 1, maxQuestions)
        : Math.max(current - 1, 1);
      return { ...prev, [sub]: newCount };
    });
    setError('');
  };

  const handleNumberInput = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    min = 0,
    max?: number
  ) => {
    if (value === '') {
      setter('');
      return;
    }
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= min && (max === undefined || num <= max)) {
      setter(num.toString());
    }
  };

  const calculateTotalQuestions = () => {
    return selectedSubjects.reduce((sum, sub) => sum + (questionsPerSubject[sub] || 0), 0);
  };

  const getTimeFromDifficulty = () => {
    const totalQuestions = calculateTotalQuestions();
    const selectedDifficulty = difficultyLevels.find(d => d.value === difficulty);
    return totalQuestions * (selectedDifficulty?.timePerQuestion || 45);
  };

  const isFormValid = () => {
    const hasQuestions = selectedSubjects.every(
      sub => (questionsPerSubject[sub] || 0) > 0
    );
    const withinLimits = selectedSubjects.every(
      sub =>
        (questionsPerSubject[sub] || 0) <= (fetchedQuestions[sub]?.length || 0)
    );
    return (
      selectedSubjects.length > 0 &&
      hasQuestions &&
      withinLimits
    );
  };

  const handleStart = async () => {
    if (loadingSubjects.size > 0) {
      setError('Please wait while loading questions...');
      return;
    }
    if (!isFormValid()) {
      if (selectedSubjects.length === 0) {
        setError('Please select at least one subject.');
      } else if (!selectedSubjects.every(sub => (questionsPerSubject[sub] || 0) > 0)) {
        setError('Number of questions cannot be zero for any subject.');
      } else {
        setError('One or more subjects have too many questions selected.');
      }
      return;
    }
    const timeInSec =
      timeMode === 'manual' && (hours || minutes || seconds)
        ? (parseInt(hours) || 0) * 3600 +
          (parseInt(minutes) || 0) * 60 +
          (parseInt(seconds) || 0)
        : getTimeFromDifficulty();
    if (timeInSec === 0) {
      setError('Calculated time is zero. Please adjust questions or difficulty.');
      return;
    }

    setIsStartingQuiz(true);
    try {
      const generatedQuestions: Record<string, Question[]> = {};
      for (const sub of selectedSubjects) {
        const pool = fetchedQuestions[sub];
        if (!pool || pool.length === 0) {
          setError(`No questions available for ${sub.replace('_', ' ')}`);
          return;
        }
        const count = questionsPerSubject[sub] || 1;
        if (count > pool.length) {
          setError(`Not enough questions available for ${sub.replace('_', ' ')}`);
          return;
        }
        const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, count);
        generatedQuestions[sub] = shuffled;
      }

      setQuestions(generatedQuestions);
      setCurrentSubject(selectedSubjects[0] || '');
      setCurrentIndices(selectedSubjects.reduce((acc: Record<string, number>, s) => ({ ...acc, [s]: 0 }), {}));
      setTotalTime(timeInSec);
      router.push('/quiz/home');
    } finally {
      setIsStartingQuiz(false);
    }
  };

  const handleReset = () => {
    resetQuiz();
    setHours('');
    setMinutes('');
    setSeconds('');
    setDifficulty('medium');
    setTimeMode('difficulty');
    setError('');
    setFetchedQuestions({});
    setLoadingSubjects(new Set());
    // Clear all localStorage caches
    Object.keys(localStorage).filter(key => key.startsWith('questions_')).forEach(key => localStorage.removeItem(key));
  };

  return (
    <motion.form
      onSubmit={e => e.preventDefault()}
      className="space-y-8 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-30 sm: pb-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center text-sm w-full"
            role="alert"
          >
            <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="flex items-center text-sm w-full sm:w-auto"
      >
        <ArrowLeft className="mr-2 h-4 w-4 flex-shrink-0" />
        Back to Exam Type
      </motion.button>

      {/* Subjects Selection Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold">Select Subjects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {route !== 'arts' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-base sm:text-lg">Science Subjects</h3>
              {/* Responsive grid: 1 col on mobile, up to 4 on large */}
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                {scienceSubjects.map((sub) => (
                  <motion.div
                    key={sub}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-md sm:rounded-lg hover:border-gray-300 transition-colors min-w-[140px] xs:min-w-[150px] sm:min-w-[160px] lg:min-w-[180px] flex-grow"
                  >
                    <Checkbox
                      id={sub}
                      checked={selectedSubjects.includes(sub)}
                      onCheckedChange={(checked) =>
                        handleSubjectChange(sub, Boolean(checked))
                      }
                      className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
                      aria-label={`Select ${sub.replace('_', ' ')}`}
                    />
                    <Label
                      htmlFor={sub}
                      className="text-sm sm:text-base cursor-pointer capitalize leading-tight"
                    >
                      {sub.replace('_', ' ')}
                    </Label>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {route !== 'science' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-base sm:text-lg">
                Arts/Commercial/Languages
              </h3>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
                {artsSubjects.map((sub) => (
                  <motion.div
                    key={sub}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-md sm:rounded-lg hover:border-gray-300 transition-colors min-w-[140px] xs:min-w-[150px] sm:min-w-[160px] lg:min-w-[180px] flex-grow"
                  >
                    <Checkbox
                      id={sub}
                      checked={selectedSubjects.includes(sub)}
                      onCheckedChange={(checked) =>
                        handleSubjectChange(sub, Boolean(checked))
                      }
                      className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
                      aria-label={`Select ${sub.replace('_', ' ')}`}
                    />
                    <Label
                      htmlFor={sub}
                      className="text-sm sm:text-base cursor-pointer capitalize leading-tight"
                    >
                      {sub.replace('_', ' ')}
                    </Label>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Questions per Subject Section */}
      {selectedSubjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold">Number of Questions per Subject</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {selectedSubjects.map(sub => {
                if (loadingSubjects.has(sub)) {
                  return (
                    <div key={sub} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 sm:py-6 px-3 sm:px-4 border rounded-lg gap-3 sm:gap-4">
                      <div className="h-5 bg-gray-200 rounded w-full sm:w-32 animate-pulse"></div>
                      <div className="flex items-center justify-between sm:justify-start gap-1 sm:gap-2 w-full sm:w-auto">
                        <div className="h-10 w-10 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
                        <div className="h-10 w-20 bg-gray-200 rounded animate-pulse flex-1 sm:flex-none"></div>
                        <div className="h-10 w-10 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
                      </div>
                    </div>
                  );
                }
                const avail = fetchedQuestions[sub]?.length || 0;
                return (
                  <div key={sub} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg">
                    <span className="w-full sm:w-[250px] capitalize text-base sm:text-lg font-medium truncate">
                      {sub.replace('_', ' ')} ({avail} available)
                    </span>
                    <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-center sm:justify-start">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => handleQuestionCountAdjust(sub, false)}
                        disabled={questionsPerSubject[sub] <= 1}
                        className="h-10 w-10 flex-shrink-0"
                        aria-label={`Decrease questions for ${sub.replace('_', ' ')}`}
                      >
                        <Minus size={16} />
                      </Button>
                      <Input
                        type="number"
                        min={0}
                        max={avail}
                        value={questionsPerSubject[sub] || 0}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleQuestionCountChange(sub, e)}
                        className="w-20 text-center h-10 text-base sm:text-lg flex-shrink-0"
                        aria-label={`Number of questions for ${sub.replace('_', ' ')}`}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => handleQuestionCountAdjust(sub, true)}
                        disabled={questionsPerSubject[sub] >= avail}
                        className="h-10 w-10 flex-shrink-0"
                        aria-label={`Increase questions for ${sub.replace('_', ' ')}`}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Time Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold">Time Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col space-y-4">
            <RadioGroup
              value={timeMode}
              onValueChange={(value: 'manual' | 'difficulty') => setTimeMode(value)}
              className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="difficulty" id="difficulty" className="h-5 w-5" />
                <Label htmlFor="difficulty" className="text-base sm:text-lg cursor-pointer">Difficulty-Based</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="manual" id="manual" className="h-5 w-5" />
                <Label htmlFor="manual" className="text-base sm:text-lg cursor-pointer">Manual Time</Label>
              </div>
            </RadioGroup>

            <AnimatePresence mode="wait">
              {timeMode === 'difficulty' ? (
                <motion.div
                  key="difficulty"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <Label htmlFor="difficulty-select" className="block text-base sm:text-lg">
                    Difficulty Level
                  </Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger
                      id="difficulty-select"
                      className="h-10 sm:h-12 w-full text-base sm:text-lg"
                    >
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyLevels.map(level => (
                        <SelectItem key={level.value} value={level.value} className="text-base sm:text-lg">
                          {level.label} ({level.timePerQuestion}s per question)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm sm:text-base font-medium">
                    Total time: {Math.floor(getTimeFromDifficulty() / 60)} min {getTimeFromDifficulty() % 60} sec
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="manual"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <Label className="block text-base sm:text-lg">Custom Time Limit</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hours" className="text-xs sm:text-sm">Hours</Label>
                      <Input
                        id="hours"
                        type="number"
                        placeholder="0"
                        value={hours}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleNumberInput(e.target.value, setHours, 0)}
                        className="h-10 sm:h-12 text-base sm:text-lg"
                        aria-label="Hours"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minutes" className="text-xs sm:text-sm">Minutes</Label>
                      <Input
                        id="minutes"
                        type="number"
                        placeholder="0"
                        value={minutes}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleNumberInput(e.target.value, setMinutes, 0, 59)}
                        className="h-10 sm:h-12 text-base sm:text-lg"
                        aria-label="Minutes"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seconds" className="text-xs sm:text-sm">Seconds</Label>
                      <Input
                        id="seconds"
                        type="number"
                        placeholder="0"
                        value={seconds}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleNumberInput(e.target.value, setSeconds, 0, 59)}
                        className="h-10 sm:h-12 text-base sm:text-lg"
                        aria-label="Seconds"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handleStart}
          disabled={!isFormValid() || loadingSubjects.size > 0 || isStartingQuiz}
          className="flex-1 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-base sm:text-lg shadow-lg"
        >
          {isStartingQuiz ? (
            <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
          ) : (
            <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          )}
          Start Quiz
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handleReset}
          className="flex-1 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition text-base sm:text-lg shadow-lg"
        >
          <RefreshCw className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Reset
        </motion.button>
      </div>
    </motion.form>
  );
}