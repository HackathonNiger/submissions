// 'use client';

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog';
// import { BronzeCelebration } from '@/components/ui/leagueBadge/BronzeCelebration';
// import { SilverCelebration } from '@/components/ui/leagueBadge/SilverCelebration';
// import { DiamondCelebration } from '@/components/ui/leagueBadge/DiamondCelebration';
// import { PalladiumCelebration } from '@/components/ui/leagueBadge/PalladiumCelebration';
// import { PlatinumCelebration } from '@/components/ui/leagueBadge/PlatinumCelebration';
// import { GoldCelebration } from '@/components/ui/leagueBadge/GoldCelebration';
// import { Calculator, Loader2 } from 'lucide-react';
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from '@/components/ui/sheet';
// import { useContext, useEffect, useState } from 'react';
// import Box from '@/components/ui/box';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import LoadingSpinner from '@/features/quiz/components/LoadingSpinner';
// import NavigationButtons from '@/features/quiz/components/NavigationButtons';
// import QuestionDisplay from '@/features/quiz/components/QuestionDisplay';
// import { QuizContext } from '@/features/quiz/context/QuizContext';
// import { QuizScoreRow } from '@/lib/types';
// import SubjectSwitcher from '@/features/quiz/components/SubjectSwitcher';
// import Timer from '@/features/quiz/components/Timer';
// import { motion } from 'framer-motion';
// import { supabase } from '@/lib/supabaseClient';
// import { toast } from 'sonner';
// import { useRouter } from 'next/navigation';

// // Calculate points for quiz performance
// const calcPoints = (percentage: number) => {
//   if (percentage >= 90) return 10;
//   if (percentage >= 70) return 8;
//   if (percentage >= 50) return 6;
//   if (percentage >= 30) return 4;
//   if (percentage >= 10) return 2;
//   return 0;
// };

// // Calculate points for streak completion
// const calcStreakPoints = (currentStreak: number) => {
//   const milestones = [
//     { days: 7, points: 5 },
//     { days: 30, points: 15 },
//     { days: 100, points: 50 },
//   ];
//   return milestones.find(m => m.days === currentStreak)?.points || 0;
// };

// // Update streak and award points
// async function updateStreak(userId: string) {
//   try {
//     const today = new Date().toISOString().split('T')[0];

//     const { data: streakData, error: fetchError } = await supabase
//       .from('streaks')
//       .select('current_streak, longest_streak, last_active, streak_freezes')
//       .eq('user_id', userId)
//       .single();

//     if (fetchError && fetchError.code !== 'PGRST116') {
//       console.error('Error fetching streak:', fetchError.message);
//       toast.error('Failed to update streak');
//       return { completedToday: false, currentStreak: 0 };
//     }

//     let currentStreak = 1;
//     let longestStreak = 1;
//     let streakFreezes = 0;

//     if (streakData) {
//       const lastDate = new Date(streakData.last_active);
//       const todayDate = new Date(today);
//       const diffTime = todayDate.getTime() - lastDate.getTime();
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//       streakFreezes = streakData.streak_freezes || 0;

//       if (diffDays === 1) {
//         currentStreak = streakData.current_streak + 1;
//       } else if (diffDays === 2 && streakFreezes > 0) {
//         currentStreak = streakData.current_streak + 1;
//         streakFreezes -= 1;
//       } else if (diffDays === 0) {
//         return { currentStreak: streakData.current_streak, completedToday: false };
//       } else {
//         currentStreak = 1;
//       }

//       longestStreak = Math.max(streakData.longest_streak || 0, currentStreak);
//     }

//     const { error: updateError } = await supabase
//       .from('streaks')
//       .upsert({
//         user_id: userId,
//         current_streak: currentStreak,
//         longest_streak: longestStreak,
//         last_active: today,
//         streak_freezes: streakFreezes,
//       });

//     if (updateError) {
//       toast.error('Failed to update streak');
//       return { completedToday: false, currentStreak };
//     }

//     // Award daily points for completing streak
//     const dailyPoints = 4;
//     const { error: dailyError } = await supabase
//       .from('quiz_scores')
//       .insert({
//         student_id: userId,
//         quiz_id: 'daily_streak',
//         points: dailyPoints,
//         taken_at: new Date().toISOString(),
//         exam_type: 'streak',
//       });

//     if (dailyError) {
//       console.error('Error awarding daily streak points:', dailyError.message);
//       toast.error('Failed to award daily streak points');
//     } else {
//       toast.success(`Awarded ${dailyPoints} points for completing today's streak!`);
//     }

//     // Award points for streak milestones
//     const streakPoints = calcStreakPoints(currentStreak);
//     if (streakPoints > 0) {
//       const { error: scoreError } = await supabase
//         .from('quiz_scores')
//         .insert({
//           student_id: userId,
//           quiz_id: 'streak_reward',
//           points: streakPoints,
//           taken_at: new Date().toISOString(),
//           exam_type: 'streak',
//         });

//       if (scoreError) {
//         console.error('Error awarding streak points:', scoreError.message);
//         toast.error('Failed to award streak points');
//       } else {
//         toast.success(`Awarded ${streakPoints} points for ${currentStreak}-day streak!`);
//       }
//     }

//     // Send milestone notifications
//     const milestones = [7, 30, 100];
//     if (milestones.includes(currentStreak)) {
//       const { error: notificationError } = await supabase
//         .from('notifications')
//         .insert({
//           user_id: userId,
//           type: 'streak_milestone',
//           message: `Congrats on your ${currentStreak} day streak! You earned ${streakPoints} points! 🔥`,
//           status: 'pending',
//         });

//       if (notificationError) {
//         console.error('Error sending milestone notification:', notificationError.message);
//       } else {
//         console.log('Milestone notification sent for', currentStreak, 'days streak.');
//       }
//     }

//     return { currentStreak, completedToday: true };
//   } catch (err) {
//     console.error('Unexpected error updating streak:', err);
//     toast.error('An unexpected error occurred');
//     return { completedToday: false, currentStreak: 0 };
//   }
// }

// export default function Quiz() {
//   const {
//     questions,
//     totalTime,
//     isSubmitted,
//     setIsSubmitted,
//     currentSubject,
//     currentIndices,
//     setCurrentIndices,
//     userAnswers,
//     // setUserAnswers,
//     examType,
//     isStarting,
//     calculateScores,
//     // setQuestions,
//     // setCurrentSubject,
//   } = useContext(QuizContext);

//   const router = useRouter();
//   const [openConfirm, setOpenConfirm] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [currentLeague, setCurrentLeague] = useState<string | null>(null);
//   const [completedToday, setCompletedToday] = useState(false);

//   const currentIndex = currentIndices[currentSubject] ?? 0;
//   const totalQuestions = questions[currentSubject]?.length ?? 0;

//   const leagueThresholds = [
//     { name: 'Palladium', min: 70, column: 'celebrated_palladium', component: PalladiumCelebration },
//     { name: 'Bronze', min: 1300, column: 'celebrated_bronze', component: BronzeCelebration },
//     { name: 'Silver', min: 2300, column: 'celebrated_silver', component: SilverCelebration },
//     { name: 'Gold', min: 3300, column: 'celebrated_gold', component: GoldCelebration },
//     { name: 'Platinum', min: 4300, column: 'celebrated_platinum', component: PlatinumCelebration },
//     { name: 'Diamond', min: 5300, column: 'celebrated_diamond', component: DiamondCelebration },
//   ];

//   // Save quiz state to localStorage
//   useEffect(() => {
//     if (!questions || Object.keys(questions).length === 0) return;

//     const quizState = {
//       questions,
//       userAnswers,
//       currentSubject,
//       currentIndices,
//       totalTime,
//       examType,
//       isSubmitted,
//     };
//     localStorage.setItem('quizState', JSON.stringify(quizState));
//   }, [questions, userAnswers, currentSubject, currentIndices, totalTime, examType, isSubmitted]);

//   // Clear localStorage on route leave
//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       const currentPath = window.location.pathname;
//       if (!['/quiz/home', '/quiz/preview'].includes(currentPath)) {
//         localStorage.removeItem('quizState');
//         localStorage.removeItem('userAnswers');
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, []);

//   // Auto-submit on tab/window leave
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.hidden && !isSubmitted) {
//         setIsSubmitted(true);
//       }
//     };
//     const handleBlur = () => {
//       if (!isSubmitted) {
//         setIsSubmitted(true);
//       }
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     window.addEventListener('blur', handleBlur);

//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//       window.removeEventListener('blur', handleBlur);
//     };
//   }, [isSubmitted, setIsSubmitted]);

//   // Handle quiz submission
//   useEffect(() => {
//     if (!isSubmitted) return;

//     const handleQuizSubmission = async () => {
//       try {
//         setSaving(true);
//         const { data: authData } = await supabase.auth.getUser();
//         const user = authData?.user;
//         if (!user) {
//           console.error('No user authenticated.');
//           toast.error('You must be logged in to submit a quiz');
//           router.push('/login');
//           return;
//         }

//         // Calculate quiz results
//         const answers = userAnswers[currentSubject] ?? [];
//         const totalQ = questions[currentSubject]?.length ?? 0;
//         const correct = questions[currentSubject]?.filter((q, i) => answers[i] === q.correct).length ?? 0;
//         const percentage = totalQ ? Math.round((correct / totalQ) * 100) : 0;
//         const newPoints = calcPoints(percentage);

//         // Calculate detailed scores for local storage
//         const scoreResult = calculateScores();

//         // Upsert quiz score
//         const { data: existingData } = await supabase
//           .from('quiz_scores')
//           .select('*')
//           .eq('student_id', user.id)
//           .eq('quiz_id', currentSubject)
//           .maybeSingle();

//         let scoreId: number = 0;
//         if (existingData) {
//           await supabase
//             .from('quiz_scores')
//             .update({
//               points: existingData.points + newPoints,
//               taken_at: new Date().toISOString(),
//               exam_type: examType,
//             })
//             .eq('id', existingData.id);
//           scoreId = existingData.id;
//         } else {
//           const { data: inserted, error } = await supabase
//             .from('quiz_scores')
//             .insert({
//               student_id: user.id,
//               quiz_id: currentSubject,
//               points: newPoints,
//               taken_at: new Date().toISOString(),
//               exam_type: examType,
//             })
//             .select('id')
//             .single();

//           if (error || !inserted) {
//             console.error('Insert failed', error?.message);
//             toast.error('Failed to save quiz score');
//             return;
//           }
//           scoreId = inserted.id;
//         }

//         // Fetch user profile for result storage
//         const { data: profileData, error: profileError } = await supabase
//           .from('profiles')
//           .select('id, username, first_name, last_name, avatar_url, user_type')
//           .eq('id', user.id)
//           .single();

//         if (profileError || !profileData) {
//           console.error('Profile fetch error:', profileError?.message);
//           toast.error('Failed to fetch profile');
//           router.push('/dashboard');
//           return;
//         }

//         // Fetch leaderboard data
//         const { data: leaderboardData, error: leaderboardError } = await supabase
//           .from('leaderboard_view')
//           .select('student_id, total_points, rank')
//           .eq('student_id', user.id)
//           .single();

//         if (leaderboardError || !leaderboardData) {
//           console.error('Leaderboard fetch error:', leaderboardError?.message);
//           toast.error('Failed to fetch leaderboard data');
//           router.push('/dashboard');
//           return;
//         }

//         // Fetch all previous scores to calculate total points
//         const { data: allScoresData } = await supabase
//           .from('quiz_scores')
//           .select('points')
//           .eq('student_id', user.id)
//           .lt('taken_at', new Date().toISOString());

//         const previousTotal = (allScoresData || []).reduce((acc, s) => acc + Number(s.points), 0);
//         const newTotal = previousTotal + newPoints;

//         // Fetch streak data
//         const { data: streakData } = await supabase
//           .from('streaks')
//           .select('current_streak, longest_streak')
//           .eq('user_id', user.id)
//           .single();

//         // Save results to local storage
//         localStorage.setItem(
//           'resultState',
//           JSON.stringify({
//             profile: profileData,
//             score: scoreResult,
//             latestScore: { points: newPoints, taken_at: new Date().toISOString(), exam_type: examType },
//             leaderboardEntry: leaderboardData,
//             previousPoints: previousTotal,
//             totalPoints: newTotal,
//             streak: streakData || { current_streak: 0, longest_streak: 0 },
//           })
//         );

//         // Update streak and check if completed today
//         const streakResponse = await updateStreak(user.id);
//         setCompletedToday(streakResponse?.completedToday ?? false);

//         // Fetch previous submission for league check
//         const { data: prevSubmission } = await supabase
//           .from('quiz_scores')
//           .select('*')
//           .eq('student_id', user.id)
//           .eq('quiz_id', currentSubject)
//           .order('taken_at', { ascending: false })
//           .limit(1)
//           .maybeSingle();

//         if (!prevSubmission) {
//           if (streakResponse?.completedToday) {
//             router.push('/streaks');
//           } else {
//             router.push('/quiz/result');
//           }
//           return;
//         }

//         const totalPoints = prevSubmission.points;
//         const league = leagueThresholds.slice().reverse().find((l) => totalPoints >= l.min);

//         if (!league) {
//           if (streakResponse?.completedToday) {
//             router.push('/streaks');
//           } else {
//             router.push('/quiz/result');
//           }
//           return;
//         }

//         const hasCelebrated = prevSubmission[league.column as keyof QuizScoreRow] ?? false;

//         if (!hasCelebrated) {
//           setCurrentLeague(league.name);
//           await supabase
//             .from('quiz_scores')
//             .update({ [league.column]: true })
//             .eq('id', prevSubmission.id);
//         } else {
//           if (streakResponse?.completedToday) {
//             router.push('/streaks');
//           } else {
//             router.push('/quiz/result');
//           }
//         }
//       } catch (err) {
//         console.error('Error handling quiz submission:', err);
//         toast.error('An unexpected error occurred');
//         router.push('/dashboard');
//       } finally {
//         setSaving(false);
//       }
//     };
//     handleQuizSubmission();
//         // eslint-disable-next-line react-hooks/exhaustive-deps 

//   }, [isSubmitted, calculateScores, currentSubject, userAnswers, examType, router, setCurrentIndices]);

//   const jumpToQuestion = (index: number) => {
//     setCurrentIndices({ ...currentIndices, [currentSubject]: index });
//   };

//   const handleConfirmSubmit = () => {
//     setOpenConfirm(true);
//   };

//   const leagueObj = leagueThresholds.find((l) => l.name === currentLeague);
//   const CelebrationComp = leagueObj?.component;

//   if (isStarting || !questions || Object.keys(questions).length === 0) {
//     return <LoadingSpinner message={isStarting ? "" : ""} />;
//   }

//   if (CelebrationComp) {
//     return (
//       <CelebrationComp
//         onClose={() => {
//           setCurrentLeague(null);
//           if (completedToday) {
//             router.push('/streaks');
//           } else {
//             router.push('/quiz/result');
//           }
//         }}
//       />
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="card max-w-3xl w-full p-4 sm:p-6 md:p-8"
//       >
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">Quiz in Progress</h1>
//           <div className="flex items-center gap-4 text-lg font-semibold">
//             <Timer
//               totalSeconds={totalTime}
//               onTimeUp={() => {
//                 setIsSubmitted(true);
//               }}
//             />
//             <Sheet>
//               <SheetTrigger asChild>
//                 <Button className="cursor-pointer" variant="default" size="icon">
//                   <Calculator className="w-5 h-5" />
//                 </Button>
//               </SheetTrigger>
//               <SheetContent side="right" className="w-72">
//                 <SheetHeader>
//                   <SheetTitle>Calculator</SheetTitle>
//                 </SheetHeader>
//                 <CalculatorComponent />
//               </SheetContent>
//             </Sheet>
//           </div>
//         </div>

//         <SubjectSwitcher />

//         <h2 className="mt-4 mb-4 text-center text-lg sm:text-xl md:text-2xl font-semibold">
//           Question ({currentIndex + 1}/{totalQuestions})
//         </h2>

//         <QuestionDisplay />

//         {/* Navigator */}
//         <Box as="div" className="mt-6">
//           <div className="flex flex-wrap justify-center gap-2">
//             {questions[currentSubject]?.map((_, idx) => {
//               const isAnswered = userAnswers[currentSubject]?.[idx] !== -1;
//               const isCurrent = currentIndex === idx;
//               return (
//                 <div
//                   key={idx}
//                   className={`w-10 h-10 flex items-center justify-center rounded-md cursor-pointer
//                     border transition-colors duration-200
//                     ${isAnswered ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-400 border-gray-300'}
//                     ${isCurrent ? 'ring-2 ring-blue-400' : ''}`}
//                   onClick={() => jumpToQuestion(idx)}
//                 >
//                   {idx + 1}
//                 </div>
//               );
//             })}
//           </div>
//         </Box>

//         {/* Actions */}
//         <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4">
//           <NavigationButtons />
//           <Button onClick={handleConfirmSubmit} className="flex cursor-pointer items-center justify-center gap-2">
//             {saving && <Loader2 className="h-4 w-4 animate-spin" />}
//             Submit Quiz
//           </Button>
//         </div>
//       </motion.div>

//       {/* Confirmation Modal */}
//       <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={() => setIsSubmitted(true)}>Yes, Submit</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }

// // Calculator Component
// function CalculatorComponent() {
//   const [input, setInput] = useState('');

//   const handleClick = (value: string) => {
//     if (value === '=') {
//       try {
//         setInput(eval(input).toString());
//       } catch {
//         setInput('Error');
//       }
//     } else if (value === 'C') {
//       setInput('');
//     } else {
//       setInput(input + value);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     const allowed = '0123456789+-*/.=C';
//     if (allowed.includes(e.key)) {
//       e.preventDefault();
//       if (e.key === 'Enter') handleClick('=');
//       else if (e.key === 'Backspace') setInput(input.slice(0, -1));
//       else handleClick(e.key === '.' ? '.' : e.key);
//     }
//   };

//   const buttons = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+', 'C'];

//   return (
//     <div className="mt-4 flex flex-col gap-3">
//       <Input value={input} onKeyDown={handleKeyDown} onChange={() => {}} className="text-right font-mono text-lg" />
//       <div className="grid grid-cols-4 gap-2">
//         {buttons.map(btn => (
//           <Button
//             key={btn}
//             variant={btn === 'C' ? 'destructive' : 'secondary'}
//             onClick={() => handleClick(btn)}
//             className="cursor-pointer p-4"
//           >
//             {btn}
//           </Button>
//         ))}
//       </div>
//     </div>
//   );
// }


// 'use client';

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog';
// import { BronzeCelebration } from '@/components/ui/leagueBadge/BronzeCelebration';
// import { SilverCelebration } from '@/components/ui/leagueBadge/SilverCelebration';
// import { DiamondCelebration } from '@/components/ui/leagueBadge/DiamondCelebration';
// import { PalladiumCelebration } from '@/components/ui/leagueBadge/PalladiumCelebration';
// import { PlatinumCelebration } from '@/components/ui/leagueBadge/PlatinumCelebration';
// import { GoldCelebration } from '@/components/ui/leagueBadge/GoldCelebration';
// import { Calculator, Loader2 } from 'lucide-react';
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from '@/components/ui/sheet';
// import { useContext, useEffect, useState } from 'react';
// import Box from '@/components/ui/box';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import LoadingSpinner from '@/features/quiz/components/LoadingSpinner';
// import NavigationButtons from '@/features/quiz/components/NavigationButtons';
// import QuestionDisplay from '@/features/quiz/components/QuestionDisplay';
// import { QuizContext } from '@/features/quiz/context/QuizContext';
// import { QuizScoreRow } from '@/lib/types';
// import SubjectSwitcher from '@/features/quiz/components/SubjectSwitcher';
// import Timer from '@/features/quiz/components/Timer';
// import { motion } from 'framer-motion';
// import { supabase } from '@/lib/supabaseClient';
// import { toast } from 'sonner';
// import { useRouter } from 'next/navigation';

// // Calculate points for quiz performance
// const calcPoints = (percentage: number) => {
//   if (percentage >= 90) return 10;
//   if (percentage >= 70) return 8;
//   if (percentage >= 50) return 6;
//   if (percentage >= 30) return 4;
//   if (percentage >= 10) return 2;
//   return 0;
// };

// // Calculate points for streak completion
// const calcStreakPoints = (currentStreak: number) => {
//   const milestones = [
//     { days: 7, points: 5 },
//     { days: 30, points: 15 },
//     { days: 100, points: 50 },
//   ];
//   return milestones.find(m => m.days === currentStreak)?.points || 0;
// };

// // Update streak and award points
// async function updateStreak(userId: string) {
//   try {
//     const today = new Date().toISOString().split('T')[0];

//     const { data: streakData, error: fetchError } = await supabase
//       .from('streaks')
//       .select('current_streak, longest_streak, last_active, streak_freezes')
//       .eq('user_id', userId)
//       .single();

//     if (fetchError && fetchError.code !== 'PGRST116') {
//       console.error('Error fetching streak:', fetchError.message);
//       toast.error('Failed to update streak');
//       return { completedToday: false, currentStreak: 0 };
//     }

//     let currentStreak = 1;
//     let longestStreak = 1;
//     let streakFreezes = 0;

//     if (streakData) {
//       const lastDate = new Date(streakData.last_active);
//       const todayDate = new Date(today);
//       const diffTime = todayDate.getTime() - lastDate.getTime();
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//       streakFreezes = streakData.streak_freezes || 0;

//       if (diffDays === 1) {
//         currentStreak = streakData.current_streak + 1;
//       } else if (diffDays === 2 && streakFreezes > 0) {
//         currentStreak = streakData.current_streak + 1;
//         streakFreezes -= 1;
//       } else if (diffDays === 0) {
//         return { currentStreak: streakData.current_streak, completedToday: false };
//       } else {
//         currentStreak = 1;
//       }

//       longestStreak = Math.max(streakData.longest_streak || 0, currentStreak);
//     }

//     const { error: updateError } = await supabase
//       .from('streaks')
//       .upsert({
//         user_id: userId,
//         current_streak: currentStreak,
//         longest_streak: longestStreak,
//         last_active: today,
//         streak_freezes: streakFreezes,
//       });

//     if (updateError) {
//       toast.error('Failed to update streak');
//       return { completedToday: false, currentStreak };
//     }

//     // Award daily points for completing streak
//     const dailyPoints = 4;
//     const { error: dailyError } = await supabase
//       .from('quiz_scores')
//       .insert({
//         student_id: userId,
//         quiz_id: 'daily_streak',
//         points: dailyPoints,
//         taken_at: new Date().toISOString(),
//         exam_type: 'streak',
//       });

//     if (dailyError) {
//       console.error('Error awarding daily streak points:', dailyError.message);
//       toast.error('Failed to award daily streak points');
//     } else {
//       toast.success(`Awarded ${dailyPoints} points for completing today's streak!`);
//     }

//     // Award points for streak milestones
//     const streakPoints = calcStreakPoints(currentStreak);
//     if (streakPoints > 0) {
//       const { error: scoreError } = await supabase
//         .from('quiz_scores')
//         .insert({
//           student_id: userId,
//           quiz_id: 'streak_reward',
//           points: streakPoints,
//           taken_at: new Date().toISOString(),
//           exam_type: 'streak',
//         });

//       if (scoreError) {
//         console.error('Error awarding streak points:', scoreError.message);
//         toast.error('Failed to award streak points');
//       } else {
//         toast.success(`Awarded ${streakPoints} points for ${currentStreak}-day streak!`);
//       }
//     }

//     // Send milestone notifications
//     const milestones = [7, 30, 100];
//     if (milestones.includes(currentStreak)) {
//       const { error: notificationError } = await supabase
//         .from('notifications')
//         .insert({
//           user_id: userId,
//           type: 'streak_milestone',
//           message: `Congrats on your ${currentStreak} day streak! You earned ${streakPoints} points! 🔥`,
//           status: 'pending',
//         });

//       if (notificationError) {
//         console.error('Error sending milestone notification:', notificationError.message);
//       } else {
//         console.log('Milestone notification sent for', currentStreak, 'days streak.');
//       }
//     }

//     return { currentStreak, completedToday: true };
//   } catch (err) {
//     console.error('Unexpected error updating streak:', err);
//     toast.error('An unexpected error occurred');
//     return { completedToday: false, currentStreak: 0 };
//   }
// }

// export default function Quiz() {
//   const {
//     questions,
//     totalTime,
//     isSubmitted,
//     setIsSubmitted,
//     currentSubject,
//     currentIndices,
//     setCurrentIndices,
//     userAnswers,
//     examType,
//     isStarting,
//     calculateScores,
//   } = useContext(QuizContext);

//   const router = useRouter();
//   const [openConfirm, setOpenConfirm] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [currentLeague, setCurrentLeague] = useState<string | null>(null);
//   const [completedToday, setCompletedToday] = useState(false);

//   const currentIndex = currentIndices[currentSubject] ?? 0;
//   const totalQuestions = questions[currentSubject]?.length ?? 0;

//   const leagueThresholds = [
//     { name: 'Palladium', min: 70, column: 'celebrated_palladium', component: PalladiumCelebration },
//     { name: 'Bronze', min: 1300, column: 'celebrated_bronze', component: BronzeCelebration },
//     { name: 'Silver', min: 2300, column: 'celebrated_silver', component: SilverCelebration },
//     { name: 'Gold', min: 3300, column: 'celebrated_gold', component: GoldCelebration },
//     { name: 'Platinum', min: 4300, column: 'celebrated_platinum', component: PlatinumCelebration },
//     { name: 'Diamond', min: 5300, column: 'celebrated_diamond', component: DiamondCelebration },
//   ];

//   // Save quiz state to localStorage
//   useEffect(() => {
//     if (!questions || Object.keys(questions).length === 0) return;

//     const quizState = {
//       questions,
//       userAnswers,
//       currentSubject,
//       currentIndices,
//       totalTime,
//       examType,
//       isSubmitted,
//     };
//     localStorage.setItem('quizState', JSON.stringify(quizState));
//   }, [questions, userAnswers, currentSubject, currentIndices, totalTime, examType, isSubmitted]);

//   // Clear localStorage on route leave
//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       const currentPath = window.location.pathname;
//       if (!['/quiz/home', '/quiz/preview'].includes(currentPath)) {
//         localStorage.removeItem('quizState');
//         localStorage.removeItem('userAnswers');
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, []);

//   // Auto-submit on tab/window leave
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.hidden && !isSubmitted) {
//         setIsSubmitted(true);
//       }
//     };
//     const handleBlur = () => {
//       if (!isSubmitted) {
//         setIsSubmitted(true);
//       }
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     window.addEventListener('blur', handleBlur);

//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//       window.removeEventListener('blur', handleBlur);
//     };
//   }, [isSubmitted, setIsSubmitted]);

//   // Handle quiz submission
//   useEffect(() => {
//     if (!isSubmitted) return;

//     const handleQuizSubmission = async () => {
//       try {
//         setSaving(true);
//         const { data: authData } = await supabase.auth.getUser();
//         const user = authData?.user;
//         if (!user) {
//           console.error('No user authenticated.');
//           toast.error('You must be logged in to submit a quiz');
//           router.push('/login');
//           return;
//         }

//         // Calculate quiz results
//         const answers = userAnswers[currentSubject] ?? [];
//         const totalQ = questions[currentSubject]?.length ?? 0;
//         const correct = questions[currentSubject]?.filter((q, i) => answers[i] === q.correct).length ?? 0;
//         const percentage = totalQ ? Math.round((correct / totalQ) * 100) : 0;
//         const newPoints = calcPoints(percentage);

//         // Calculate detailed scores for local storage
//         const scoreResult = calculateScores();

//         // Upsert quiz score
//         const { data: existingData } = await supabase
//           .from('quiz_scores')
//           .select('*')
//           .eq('student_id', user.id)
//           .eq('quiz_id', currentSubject)
//           .maybeSingle();

//         let scoreId: number = 0;
//         if (existingData) {
//           await supabase
//             .from('quiz_scores')
//             .update({
//               points: existingData.points + newPoints,
//               taken_at: new Date().toISOString(),
//               exam_type: examType,
//             })
//             .eq('id', existingData.id);
//           scoreId = existingData.id;
//         } else {
//           const { data: inserted, error } = await supabase
//             .from('quiz_scores')
//             .insert({
//               student_id: user.id,
//               quiz_id: currentSubject,
//               points: newPoints,
//               taken_at: new Date().toISOString(),
//               exam_type: examType,
//             })
//             .select('id')
//             .single();

//           if (error || !inserted) {
//             console.error('Insert failed', error?.message);
//             toast.error('Failed to save quiz score');
//             return;
//           }
//           scoreId = inserted.id;
//         }

//         // Fetch user profile for result storage
//         const { data: profileData, error: profileError } = await supabase
//           .from('profiles')
//           .select('id, username, first_name, last_name, avatar_url, user_type')
//           .eq('id', user.id)
//           .single();

//         if (profileError || !profileData) {
//           console.error('Profile fetch error:', profileError?.message);
//           toast.error('Failed to fetch profile');
//           router.push('/dashboard');
//           return;
//         }

//         // Fetch leaderboard data
//         const { data: leaderboardData, error: leaderboardError } = await supabase
//           .from('leaderboard_view')
//           .select('student_id, total_points, rank')
//           .eq('student_id', user.id)
//           .single();

//         if (leaderboardError || !leaderboardData) {
//           console.error('Leaderboard fetch error:', leaderboardError?.message);
//           toast.error('Failed to fetch leaderboard data');
//           router.push('/dashboard');
//           return;
//         }

//         // Fetch all previous scores to calculate total points
//         const { data: allScoresData } = await supabase
//           .from('quiz_scores')
//           .select('points')
//           .eq('student_id', user.id)
//           .lt('taken_at', new Date().toISOString());

//         const previousTotal = (allScoresData || []).reduce((acc, s) => acc + Number(s.points), 0);
//         const newTotal = previousTotal + newPoints;

//         // Fetch streak data
//         const { data: streakData } = await supabase
//           .from('streaks')
//           .select('current_streak, longest_streak')
//           .eq('user_id', user.id)
//           .single();

//         // Save results to local storage
//         localStorage.setItem(
//           'resultState',
//           JSON.stringify({
//             profile: profileData,
//             score: scoreResult,
//             latestScore: { points: newPoints, taken_at: new Date().toISOString(), exam_type: examType },
//             leaderboardEntry: leaderboardData,
//             previousPoints: previousTotal,
//             totalPoints: newTotal,
//             streak: streakData || { current_streak: 0, longest_streak: 0 },
//           })
//         );

//         // Update streak and check if completed today
//         const streakResponse = await updateStreak(user.id);
//         setCompletedToday(streakResponse?.completedToday ?? false);

//         // Fetch previous submission for league check
//         const { data: prevSubmission } = await supabase
//           .from('quiz_scores')
//           .select('*')
//           .eq('student_id', user.id)
//           .eq('quiz_id', currentSubject)
//           .order('taken_at', { ascending: false })
//           .limit(1)
//           .maybeSingle();

//         if (!prevSubmission) {
//           if (streakResponse?.completedToday) {
//             router.push('/streaks');
//           } else {
//             router.push('/quiz/result');
//           }
//           return;
//         }

//         const totalPoints = prevSubmission.points;
//         const league = leagueThresholds.slice().reverse().find((l) => totalPoints >= l.min);

//         if (!league) {
//           if (streakResponse?.completedToday) {
//             router.push('/streaks');
//           } else {
//             router.push('/quiz/result');
//           }
//           return;
//         }

//         const hasCelebrated = prevSubmission[league.column as keyof QuizScoreRow] ?? false;

//         if (!hasCelebrated) {
//           setCurrentLeague(league.name);
//           await supabase
//             .from('quiz_scores')
//             .update({ [league.column]: true })
//             .eq('id', prevSubmission.id);
//         } else {
//           if (streakResponse?.completedToday) {
//             router.push('/streaks');
//           } else {
//             router.push('/quiz/result');
//           }
//         }

//         // Clear stored questions from localStorage after successful submission
//         Object.keys(localStorage).filter(key => key.startsWith('questions_')).forEach(key => localStorage.removeItem(key));
//       } catch (err) {
//         console.error('Error handling quiz submission:', err);
//         toast.error('An unexpected error occurred');
//         router.push('/dashboard');
//       } finally {
//         setSaving(false);
//       }
//     };
//     handleQuizSubmission();
//   }, [isSubmitted]); // Simplified deps - only trigger on isSubmitted

//   const jumpToQuestion = (index: number) => {
//     setCurrentIndices({ ...currentIndices, [currentSubject]: index });
//   };

//   const handleConfirmSubmit = () => {
//     setOpenConfirm(true);
//   };

//   const leagueObj = leagueThresholds.find((l) => l.name === currentLeague);
//   const CelebrationComp = leagueObj?.component;

//   if (isStarting || !questions || Object.keys(questions).length === 0) {
//     return <LoadingSpinner message={isStarting ? "" : ""} />;
//   }

//   if (CelebrationComp) {
//     return (
//       <CelebrationComp
//         onClose={() => {
//           setCurrentLeague(null);
//           if (completedToday) {
//             router.push('/streaks');
//           } else {
//             router.push('/quiz/result');
//           }
//         }}
//       />
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="card max-w-3xl w-full p-4 sm:p-6 md:p-8"
//       >
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">Quiz in Progress</h1>
//           <div className="flex items-center gap-4 text-lg font-semibold">
//             <Timer
//               totalSeconds={totalTime}
//               onTimeUp={() => {
//                 setIsSubmitted(true);
//               }}
//             />
//             <Sheet>
//               <SheetTrigger asChild>
//                 <Button className="cursor-pointer" variant="default" size="icon">
//                   <Calculator className="w-5 h-5" />
//                 </Button>
//               </SheetTrigger>
//               <SheetContent side="right" className="w-72">
//                 <SheetHeader>
//                   <SheetTitle>Calculator</SheetTitle>
//                 </SheetHeader>
//                 <CalculatorComponent />
//               </SheetContent>
//             </Sheet>
//           </div>
//         </div>

//         <SubjectSwitcher />

//         <h2 className="mt-4 mb-4 text-center text-lg sm:text-xl md:text-2xl font-semibold">
//           Question ({currentIndex + 1}/{totalQuestions})
//         </h2>

//         <QuestionDisplay />

//         {/* Navigator */}
//         <Box as="div" className="mt-6">
//           <div className="flex flex-wrap justify-center gap-2">
//             {questions[currentSubject]?.map((_, idx) => {
//               const isAnswered = userAnswers[currentSubject]?.[idx] !== -1;
//               const isCurrent = currentIndex === idx;
//               return (
//                 <div
//                   key={idx}
//                   className={`w-10 h-10 flex items-center justify-center rounded-md cursor-pointer
//                     border transition-colors duration-200
//                     ${isAnswered ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-400 border-gray-300'}
//                     ${isCurrent ? 'ring-2 ring-blue-400' : ''}`}
//                   onClick={() => jumpToQuestion(idx)}
//                 >
//                   {idx + 1}
//                 </div>
//               );
//             })}
//           </div>
//         </Box>

//         {/* Actions */}
//         <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4">
//           <NavigationButtons />
//           <Button onClick={handleConfirmSubmit} className="flex cursor-pointer items-center justify-center gap-2">
//             {saving && <Loader2 className="h-4 w-4 animate-spin" />}
//             Submit Quiz
//           </Button>
//         </div>
//       </motion.div>

//       {/* Confirmation Modal */}
//       <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={() => setIsSubmitted(true)}>Yes, Submit</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }

// // Calculator Component
// function CalculatorComponent() {
//   const [input, setInput] = useState('');

//   const handleClick = (value: string) => {
//     if (value === '=') {
//       try {
//         setInput(eval(input).toString());
//       } catch {
//         setInput('Error');
//       }
//     } else if (value === 'C') {
//       setInput('');
//     } else {
//       setInput(input + value);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     const allowed = '0123456789+-*/.=C';
//     if (allowed.includes(e.key)) {
//       e.preventDefault();
//       if (e.key === 'Enter') handleClick('=');
//       else if (e.key === 'Backspace') setInput(input.slice(0, -1));
//       else handleClick(e.key === '.' ? '.' : e.key);
//     }
//   };

//   const buttons = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+', 'C'];

//   return (
//     <div className="mt-4 flex flex-col gap-3">
//       <Input value={input} onKeyDown={handleKeyDown} onChange={() => {}} className="text-right font-mono text-lg" />
//       <div className="grid grid-cols-4 gap-2">
//         {buttons.map(btn => (
//           <Button
//             key={btn}
//             variant={btn === 'C' ? 'destructive' : 'secondary'}
//             onClick={() => handleClick(btn)}
//             className="cursor-pointer p-4"
//           >
//             {btn}
//           </Button>
//         ))}
//       </div>
//     </div>
//   );
// }


// 'use client';

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog';
// import { BronzeCelebration } from '@/components/ui/leagueBadge/BronzeCelebration';
// import { SilverCelebration } from '@/components/ui/leagueBadge/SilverCelebration';
// import { DiamondCelebration } from '@/components/ui/leagueBadge/DiamondCelebration';
// import { PalladiumCelebration } from '@/components/ui/leagueBadge/PalladiumCelebration';
// import { PlatinumCelebration } from '@/components/ui/leagueBadge/PlatinumCelebration';
// import { GoldCelebration } from '@/components/ui/leagueBadge/GoldCelebration';
// import { Calculator, Loader2 } from 'lucide-react';
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from '@/components/ui/sheet';
// import { useContext, useEffect, useState } from 'react';
// import Box from '@/components/ui/box';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import LoadingSpinner from '@/features/quiz/components/LoadingSpinner';
// import NavigationButtons from '@/features/quiz/components/NavigationButtons';
// import QuestionDisplay from '@/features/quiz/components/QuestionDisplay';
// import { QuizContext } from '@/features/quiz/context/QuizContext';
// import { QuizScoreRow } from '@/lib/types';
// import SubjectSwitcher from '@/features/quiz/components/SubjectSwitcher';
// import Timer from '@/features/quiz/components/Timer';
// import { motion } from 'framer-motion';
// import { supabase } from '@/lib/supabaseClient';
// import { toast } from 'sonner';
// import { useRouter } from 'next/navigation';

// // Calculate points for quiz performance
// const calcPoints = (percentage: number) => {
//   if (percentage >= 90) return 10;
//   if (percentage >= 70) return 8;
//   if (percentage >= 50) return 6;
//   if (percentage >= 30) return 4;
//   if (percentage >= 10) return 2;
//   return 0;
// };

// // Calculate points for streak completion
// const calcStreakPoints = (currentStreak: number) => {
//   const milestones = [
//     { days: 7, points: 5 },
//     { days: 30, points: 15 },
//     { days: 100, points: 50 },
//   ];
//   return milestones.find(m => m.days === currentStreak)?.points || 0;
// };
// // Update streak and award points
// async function updateStreak(userId: string) {
//   try {
//     const today = new Date().toISOString().split('T')[0];

//     const { data: streakData, error: fetchError } = await supabase
//       .from('streaks')
//       .select('current_streak, longest_streak, last_active, streak_freezes')
//       .eq('user_id', userId)
//       .single();

//     if (fetchError && fetchError.code !== 'PGRST116') {
//       console.error('Error fetching streak:', fetchError.message);
//       toast.error('Failed to update streak');
//       return { completedToday: false, currentStreak: 0 };
//     }

//     let currentStreak = 1;
//     let longestStreak = 1;
//     let streakFreezes = 0;

//     if (streakData) {
//       const lastDate = new Date(streakData.last_active);
//       const todayDate = new Date(today);
//       const diffTime = todayDate.getTime() - lastDate.getTime();
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//       streakFreezes = streakData.streak_freezes || 0;

//       if (diffDays === 1) {
//         currentStreak = streakData.current_streak + 1;
//       } else if (diffDays === 2 && streakFreezes > 0) {
//         currentStreak = streakData.current_streak + 1;
//         streakFreezes -= 1;
//       } else if (diffDays === 0) {
//         return { currentStreak: streakData.current_streak, completedToday: false };
//       } else {
//         currentStreak = 1;
//       }

//       longestStreak = Math.max(streakData.longest_streak || 0, currentStreak);
//     }

//     const { error: updateError } = await supabase
//       .from('streaks')
//       .upsert({
//         user_id: userId,
//         current_streak: currentStreak,
//         longest_streak: longestStreak,
//         last_active: today,
//         streak_freezes: streakFreezes,
//       });

//     if (updateError) {
//       toast.error('Failed to update streak');
//       return { completedToday: false, currentStreak };
//     }

//     // Award daily points for completing streak
//     const dailyPoints = 4;
//     const { error: dailyError } = await supabase
//       .from('quiz_scores')
//       .insert({
//         student_id: userId,
//         quiz_id: 'daily_streak',
//         points: dailyPoints,
//         taken_at: new Date().toISOString(),
//         exam_type: 'streak',
//       });

//     if (dailyError) {
//       console.error('Error awarding daily streak points:', dailyError.message);
//       toast.error('Failed to award daily streak points');
//     } else {
//       toast.success(`Awarded ${dailyPoints} points for completing today's streak!`);
//     }

//     // Award points for streak milestones
//     const streakPoints = calcStreakPoints(currentStreak);
//     if (streakPoints > 0) {
//       const { error: scoreError } = await supabase
//         .from('quiz_scores')
//         .insert({
//           student_id: userId,
//           quiz_id: 'streak_reward',
//           points: streakPoints,
//           taken_at: new Date().toISOString(),
//           exam_type: 'streak',
//         });

//       if (scoreError) {
//         console.error('Error awarding streak points:', scoreError.message);
//         toast.error('Failed to award streak points');
//       } else {
//         toast.success(`Awarded ${streakPoints} points for ${currentStreak}-day streak!`);
//       }
//     }

//     // Send milestone notifications
//     const milestones = [7, 30, 100];
//     if (milestones.includes(currentStreak)) {
//       const { error: notificationError } = await supabase
//         .from('notifications')
//         .insert({
//           user_id: userId,
//           type: 'streak_milestone',
//           message: `Congrats on your ${currentStreak} day streak! You earned ${streakPoints} points! 🔥`,
//           status: 'pending',
//         });

//       if (notificationError) {
//         console.error('Error sending milestone notification:', notificationError.message);
//       } else {
//         console.log('Milestone notification sent for', currentStreak, 'days streak.');
//       }
//     }

//     return { currentStreak, completedToday: true };
//   } catch (err) {
//     console.error('Unexpected error updating streak:', err);
//     toast.error('An unexpected error occurred');
//     return { completedToday: false, currentStreak: 0 };
//   }
// }

// export default function Quiz() {
//   const {
//     questions,
//     totalTime,
//     isSubmitted,
//     setIsSubmitted,
//     currentSubject,
//     currentIndices,
//     setCurrentIndices,
//     userAnswers,
//     setUserAnswers, // Assuming this is added to the context for initialization
//     examType,
//     isStarting,
//     calculateScores,
//   } = useContext(QuizContext);

//   const router = useRouter();
//   const [openConfirm, setOpenConfirm] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [currentLeague, setCurrentLeague] = useState<string | null>(null);
//   const [completedToday, setCompletedToday] = useState(false);

//   const currentIndex = currentIndices[currentSubject] ?? 0;
//   const totalQuestions = questions[currentSubject]?.length ?? 0;
   
//   const leagueThresholds = [
//     { name: 'Palladium', min: 70, column: 'celebrated_palladium', component: PalladiumCelebration },
//     { name: 'Bronze', min: 1300, column: 'celebrated_bronze', component: BronzeCelebration },
//     { name: 'Silver', min: 2300, column: 'celebrated_silver', component: SilverCelebration },
//     { name: 'Gold', min: 3300, column: 'celebrated_gold', component: GoldCelebration },
//     { name: 'Platinum', min: 4300, column: 'celebrated_platinum', component: PlatinumCelebration },
//     { name: 'Diamond', min: 5300, column: 'celebrated_diamond', component: DiamondCelebration },
//   ];
   
//   // Initialize userAnswers for the current subject if not already set
//   useEffect(() => {
//     if (questions && questions[currentSubject] && (!userAnswers || !userAnswers[currentSubject])) {
//       setUserAnswers(prev => ({
//         ...prev,
//         [currentSubject]: Array(questions[currentSubject].length).fill(-1),
//       }));
//     }
//   }, [questions, currentSubject, userAnswers, setUserAnswers]);

//   // Save quiz state to localStorage
//   useEffect(() => {
//     if (!questions || Object.keys(questions).length === 0) return;

//     const quizState = {
//       questions,
//       userAnswers,
//       currentSubject,
//       currentIndices,
//       totalTime,
//       examType,
//       isSubmitted,
//     };
//     localStorage.setItem('quizState', JSON.stringify(quizState));
//   }, [questions, userAnswers, currentSubject, currentIndices, totalTime, examType, isSubmitted]);

//   // Clear localStorage on route leave
//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       const currentPath = window.location.pathname;
//       if (!['/quiz/home', '/quiz/preview'].includes(currentPath)) {
//         localStorage.removeItem('quizState');
//         localStorage.removeItem('userAnswers');
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, []);

//   // Auto-submit on tab/window leave
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.hidden && !isSubmitted) {
//         setIsSubmitted(true);
//       }
//     };
//     const handleBlur = () => {
//       if (!isSubmitted) {
//         setIsSubmitted(true);
//       }
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     window.addEventListener('blur', handleBlur);

//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//       window.removeEventListener('blur', handleBlur);
//     };
//   }, [isSubmitted, setIsSubmitted]);

//   // Handle quiz submission
//   useEffect(() => {
//     if (!isSubmitted) return;

//     const handleQuizSubmission = async () => {
//       try {
//         setSaving(true);
//         const { data: authData } = await supabase.auth.getUser();
//         const user = authData?.user;
//         if (!user) {
//           console.error('No user authenticated.');
//           toast.error('You must be logged in to submit a quiz');
//           router.push('/login');
//           return;
//         }

//         // Calculate quiz results
//         const answers = userAnswers[currentSubject] ?? [];
//         const totalQ = questions[currentSubject]?.length ?? 0;
//         const correct = questions[currentSubject]?.filter((q, i) => answers[i] === q.correct).length ?? 0;
//         const percentage = totalQ ? Math.round((correct / totalQ) * 100) : 0;
//         const newPoints = calcPoints(percentage);

//         // Calculate detailed scores for local storage
//         const scoreResult = calculateScores();

//         // Upsert quiz score
//         const { data: existingData } = await supabase
//           .from('quiz_scores')
//           .select('*')
//           .eq('student_id', user.id)
//           .eq('quiz_id', currentSubject)
//           .maybeSingle();

//         let scoreId: number = 0;
//         if (existingData) {
//           await supabase
//             .from('quiz_scores')
//             .update({
//               points: existingData.points + newPoints,
//               taken_at: new Date().toISOString(),
//               exam_type: examType,
//             })
//             .eq('id', existingData.id);
//           scoreId = existingData.id;
//         } else {
//           const { data: inserted, error } = await supabase
//             .from('quiz_scores')
//             .insert({
//               student_id: user.id,
//               quiz_id: currentSubject,
//               points: newPoints,
//               taken_at: new Date().toISOString(),
//               exam_type: examType,
//             })
//             .select('id')
//             .single();

//           if (error || !inserted) {
//             console.error('Insert failed', error?.message);
//             toast.error('Failed to save quiz score');
//             return;
//           }
//           scoreId = inserted.id;
//         }

//         // Fetch user profile for result storage
//         const { data: profileData, error: profileError } = await supabase
//           .from('profiles')
//           .select('id, username, first_name, last_name, avatar_url, user_type')
//           .eq('id', user.id)
//           .single();

//         if (profileError || !profileData) {
//           console.error('Profile fetch error:', profileError?.message);
//           toast.error('Failed to fetch profile');
//           router.push('/dashboard');
//           return;
//         }

//         // Fetch leaderboard data
//         const { data: leaderboardData, error: leaderboardError } = await supabase
//           .from('leaderboard_view')
//           .select('student_id, total_points, rank')
//           .eq('student_id', user.id)
//           .single();

//         if (leaderboardError || !leaderboardData) {
//           console.error('Leaderboard fetch error:', leaderboardError?.message);
//           toast.error('Failed to fetch leaderboard data');
//           router.push('/dashboard');
//           return;
//         }

//         // Fetch all previous scores to calculate total points
//         const { data: allScoresData } = await supabase
//           .from('quiz_scores')
//           .select('points')
//           .eq('student_id', user.id)
//           .lt('taken_at', new Date().toISOString());

//         const previousTotal = (allScoresData || []).reduce((acc, s) => acc + Number(s.points), 0);
//         const newTotal = previousTotal + newPoints;

//         // Fetch streak data
//         const { data: streakData } = await supabase
//           .from('streaks')
//           .select('current_streak, longest_streak')
//           .eq('user_id', user.id)
//           .single();

//         // Save results to local storage
//         localStorage.setItem(
//           'resultState',
//           JSON.stringify({
//             profile: profileData,
//             score: scoreResult,
//             latestScore: { points: newPoints, taken_at: new Date().toISOString(), exam_type: examType },
//             leaderboardEntry: leaderboardData,
//             previousPoints: previousTotal,
//             totalPoints: newTotal,
//             streak: streakData || { current_streak: 0, longest_streak: 0 },
//           })
//         );

//         // Update streak and check if completed today
//         const streakResponse = await updateStreak(user.id);
//         setCompletedToday(streakResponse?.completedToday ?? false);

//         // Fetch previous submission for league check
//         const { data: prevSubmission } = await supabase
//           .from('quiz_scores')
//           .select('*')
//           .eq('student_id', user.id)
//           .eq('quiz_id', currentSubject)
//           .order('taken_at', { ascending: false })
//           .limit(1)
//           .maybeSingle();

//         if (!prevSubmission) {
//           if (streakResponse?.completedToday) {
//             router.push('/streaks');
//           } else {
//             router.push('/quiz/result');
//           }
//           return;
//         }

//         const totalPoints = prevSubmission.points;
//         const league = leagueThresholds.slice().reverse().find((l) => totalPoints >= l.min);

//         if (!league) {
//           if (streakResponse?.completedToday) {
//             router.push('/streaks');
//           } else {
//             router.push('/quiz/result');
//           }
//           return;
//         }

//         const hasCelebrated = prevSubmission[league.column as keyof QuizScoreRow] ?? false;

//         if (!hasCelebrated) {
//           setCurrentLeague(league.name);
//           await supabase
//             .from('quiz_scores')
//             .update({ [league.column]: true })
//             .eq('id', prevSubmission.id);
//         } else {
//           if (streakResponse?.completedToday) {
//             router.push('/streaks');
//           } else {
//             router.push('/quiz/result');
//           }
//         }

//         // Clear stored questions and answers from localStorage after successful submission to ensure fresh questions next time
//         Object.keys(localStorage).filter(key => key.startsWith('questions_')).forEach(key => localStorage.removeItem(key));
//         localStorage.removeItem('quizState');
//         localStorage.removeItem('userAnswers');
//       } catch (err) {
//         console.error('Error handling quiz submission:', err);
//         toast.error('An unexpected error occurred');
//         router.push('/dashboard');
//       } finally {
//         setSaving(false);
//       }
//     };
//     handleQuizSubmission();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isSubmitted]); // Simplified deps - only trigger on isSubmitted

//   const jumpToQuestion = (index: number) => {
//     setCurrentIndices({ ...currentIndices, [currentSubject]: index });
//   };

//   const handleConfirmSubmit = () => {
//     setOpenConfirm(true);
//   };

//   const leagueObj = leagueThresholds.find((l) => l.name === currentLeague);
//   const CelebrationComp = leagueObj?.component;

//   if (isStarting || !questions || Object.keys(questions).length === 0) {
//     return <LoadingSpinner message={isStarting ? "" : ""} />;
//   }

//   if (CelebrationComp) {
//     return (
//       <CelebrationComp
//         onClose={() => {
//           setCurrentLeague(null);
//           if (completedToday) {
//             router.push('/streaks');
//           } else {
//             router.push('/quiz/result');
//           }
//         }}
//       />
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-4 pb-30 sm: pb-0">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="card max-w-3xl w-full p-4 sm:p-6 md:p-8"
//       >
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">Quiz in Progress</h1>
//           <div className="flex items-center gap-4 text-lg font-semibold">
//             <Timer
//               totalSeconds={totalTime}
//               onTimeUp={() => {
//                 setIsSubmitted(true);
//               }}
//             />
//             <Sheet>
//               <SheetTrigger asChild>
//                 <Button className="cursor-pointer" variant="default" size="icon">
//                   <Calculator className="w-5 h-5" />
//                 </Button>
//               </SheetTrigger>
//               <SheetContent side="right" className="w-72">
//                 <SheetHeader>
//                   <SheetTitle>Calculator</SheetTitle>
//                 </SheetHeader>
//                 <CalculatorComponent />
//               </SheetContent>
//             </Sheet>
//           </div>
//         </div>

//         <SubjectSwitcher />

//         <h2 className="mt-4 mb-4 text-center text-lg sm:text-xl md:text-2xl font-semibold">
//           Question ({currentIndex + 1}/{totalQuestions})
//         </h2>

//         <QuestionDisplay />

//         {/* Navigator */}
//         <Box as="div" className="mt-6">
//           <div className="flex flex-wrap justify-center gap-2">
//             {questions[currentSubject]?.map((_, idx) => {
//               const answer = userAnswers?.[currentSubject]?.[idx];
//               const isAnswered = answer !== undefined && answer !== -1;
//               const isCurrent = currentIndex === idx;
//               return (
//                 <div
//                   key={idx}
//                   className={`w-10 h-10 flex items-center justify-center rounded-md cursor-pointer
//                     border transition-colors duration-200
//                     ${isAnswered ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}
//                     ${isCurrent ? 'ring-2 ring-blue-400' : ''}`}
//                   onClick={() => jumpToQuestion(idx)}
//                 >
//                   {idx + 1}
//                 </div>
//               );
//             })}
//           </div>
//         </Box>

//         {/* Actions */}
//         <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4">
//           <NavigationButtons />
//           <Button onClick={handleConfirmSubmit} className="flex cursor-pointer items-center justify-center gap-2">
//             {saving && <Loader2 className="h-4 w-4 animate-spin" />}
//             Submit Quiz
//           </Button>
//         </div>
//       </motion.div>

//       {/* Confirmation Modal */}
//       <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={() => setIsSubmitted(true)}>Yes, Submit</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }

// // Calculator Component
// function CalculatorComponent() {
//   const [input, setInput] = useState('');

//   const handleClick = (value: string) => {
//     if (value === '=') {
//       try {
//         setInput(eval(input).toString());
//       } catch {
//         setInput('Error');
//       }
//     } else if (value === 'C') {
//       setInput('');
//     } else {
//       setInput(input + value);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     const allowed = '0123456789+-*/.=C';
//     if (allowed.includes(e.key)) {
//       e.preventDefault();
//       if (e.key === 'Enter') handleClick('=');
//       else if (e.key === 'Backspace') setInput(input.slice(0, -1));
//       else handleClick(e.key === '.' ? '.' : e.key);
//     }
//   };

//   const buttons = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+', 'C'];

//   return (
//     <div className="mt-4 flex flex-col gap-3">
//       <Input value={input} onKeyDown={handleKeyDown} onChange={() => {}} className="text-right font-mono text-lg" />
//       <div className="grid grid-cols-4 gap-2">
//         {buttons.map(btn => (
//           <Button
//             key={btn}
//             variant={btn === 'C' ? 'destructive' : 'secondary'}
//             onClick={() => handleClick(btn)}
//             className="cursor-pointer p-4"
//           >
//             {btn}
//           </Button>
//         ))}
//       </div>
//     </div>
//   );
// }


'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BronzeCelebration } from '@/components/ui/leagueBadge/BronzeCelebration';
import { SilverCelebration } from '@/components/ui/leagueBadge/SilverCelebration';
import { DiamondCelebration } from '@/components/ui/leagueBadge/DiamondCelebration';
import { PalladiumCelebration } from '@/components/ui/leagueBadge/PalladiumCelebration';
import { PlatinumCelebration } from '@/components/ui/leagueBadge/PlatinumCelebration';
import { GoldCelebration } from '@/components/ui/leagueBadge/GoldCelebration';
import { Calculator, Loader2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useContext, useEffect, useState } from 'react';
import Box from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '@/features/quiz/components/LoadingSpinner';
import NavigationButtons from '@/features/quiz/components/NavigationButtons';
import QuestionDisplay from '@/features/quiz/components/QuestionDisplay';
import { QuizContext } from '@/features/quiz/context/QuizContext';
import { QuizScoreRow } from '@/lib/types';
import SubjectSwitcher from '@/features/quiz/components/SubjectSwitcher';
import Timer from '@/features/quiz/components/Timer';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Calculate points for quiz performance
const calcPoints = (percentage: number) => {
  if (percentage >= 90) return 10;
  if (percentage >= 70) return 8;
  if (percentage >= 50) return 6;
  if (percentage >= 30) return 4;
  if (percentage >= 10) return 2;
  return 0;
};

// Calculate points for streak completion
const calcStreakPoints = (currentStreak: number) => {
  const milestones = [
    { days: 7, points: 5 },
    { days: 30, points: 15 },
    { days: 100, points: 50 },
  ];
  return milestones.find(m => m.days === currentStreak)?.points || 0;
};
// Update streak and award points
async function updateStreak(userId: string) {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: streakData, error: fetchError } = await supabase
      .from('streaks')
      .select('current_streak, longest_streak, last_active, streak_freezes')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching streak:', fetchError.message);
      toast.error('Failed to update streak');
      return { completedToday: false, currentStreak: 0 };
    }

    let currentStreak = 1;
    let longestStreak = 1;
    let streakFreezes = 0;

    if (streakData) {
      const lastDate = new Date(streakData.last_active);
      const todayDate = new Date(today);
      const diffTime = todayDate.getTime() - lastDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      streakFreezes = streakData.streak_freezes || 0;

      if (diffDays === 1) {
        currentStreak = streakData.current_streak + 1;
      } else if (diffDays === 2 && streakFreezes > 0) {
        currentStreak = streakData.current_streak + 1;
        streakFreezes -= 1;
      } else if (diffDays === 0) {
        return { currentStreak: streakData.current_streak, completedToday: false };
      } else {
        currentStreak = 1;
      }

      longestStreak = Math.max(streakData.longest_streak || 0, currentStreak);
    }

    const { error: updateError } = await supabase
      .from('streaks')
      .upsert({
        user_id: userId,
        current_streak: currentStreak,
        longest_streak: longestStreak,
        last_active: today,
        streak_freezes: streakFreezes,
      });

    if (updateError) {
      toast.error('Failed to update streak');
      return { completedToday: false, currentStreak };
    }

    // Award daily points for completing streak
    const dailyPoints = 4;
    const { error: dailyError } = await supabase
      .from('quiz_scores')
      .insert({
        student_id: userId,
        quiz_id: 'daily_streak',
        points: dailyPoints,
        taken_at: new Date().toISOString(),
        exam_type: 'streak',
      });

    if (dailyError) {
      console.error('Error awarding daily streak points:', dailyError.message);
      toast.error('Failed to award daily streak points');
    } else {
      toast.success(`Awarded ${dailyPoints} points for completing today's streak!`);
    }

    // Award points for streak milestones
    const streakPoints = calcStreakPoints(currentStreak);
    if (streakPoints > 0) {
      const { error: scoreError } = await supabase
        .from('quiz_scores')
        .insert({
          student_id: userId,
          quiz_id: 'streak_reward',
          points: streakPoints,
          taken_at: new Date().toISOString(),
          exam_type: 'streak',
        });

      if (scoreError) {
        console.error('Error awarding streak points:', scoreError.message);
        toast.error('Failed to award streak points');
      } else {
        toast.success(`Awarded ${streakPoints} points for ${currentStreak}-day streak!`);
      }
    }

    // Send milestone notifications
    const milestones = [7, 30, 100];
    if (milestones.includes(currentStreak)) {
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'streak_milestone',
          message: `Congrats on your ${currentStreak} day streak! You earned ${streakPoints} points! 🔥`,
          status: 'pending',
        });

      if (notificationError) {
        console.error('Error sending milestone notification:', notificationError.message);
      } else {
        console.log('Milestone notification sent for', currentStreak, 'days streak.');
      }
    }

    return { currentStreak, completedToday: true };
  } catch (err) {
    console.error('Unexpected error updating streak:', err);
    toast.error('An unexpected error occurred');
    return { completedToday: false, currentStreak: 0 };
  }
}

export default function Quiz() {
  const {
    questions,
    totalTime,
    isSubmitted,
    setIsSubmitted,
    currentSubject,
    currentIndices,
    setCurrentIndices,
    userAnswers,
    setUserAnswers, // Assuming this is added to the context for initialization
    examType,
    isStarting,
    calculateScores,
  } = useContext(QuizContext);

  const router = useRouter();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentLeague, setCurrentLeague] = useState<string | null>(null);
  const [completedToday, setCompletedToday] = useState(false);

  const currentIndex = currentIndices[currentSubject] ?? 0;
  const totalQuestions = questions[currentSubject]?.length ?? 0;
   
  const leagueThresholds = [
    { name: 'Palladium', min: 70, column: 'celebrated_palladium', component: PalladiumCelebration },
    { name: 'Bronze', min: 1300, column: 'celebrated_bronze', component: BronzeCelebration },
    { name: 'Silver', min: 2300, column: 'celebrated_silver', component: SilverCelebration },
    { name: 'Gold', min: 3300, column: 'celebrated_gold', component: GoldCelebration },
    { name: 'Platinum', min: 4300, column: 'celebrated_platinum', component: PlatinumCelebration },
    { name: 'Diamond', min: 5300, column: 'celebrated_diamond', component: DiamondCelebration },
  ];
   
  // Initialize userAnswers for the current subject if not already set
  useEffect(() => {
    if (questions && questions[currentSubject] && (!userAnswers || !userAnswers[currentSubject])) {
      const updatedUserAnswers: Record<string, number[]> = {
        ...(userAnswers || {}),
        [currentSubject]: Array(questions[currentSubject].length).fill(-1),
      };
      setUserAnswers(updatedUserAnswers);
    }
  }, [questions, currentSubject, userAnswers, setUserAnswers]);

  // Save quiz state to localStorage
  useEffect(() => {
    if (!questions || Object.keys(questions).length === 0) return;

    const quizState = {
      questions,
      userAnswers,
      currentSubject,
      currentIndices,
      totalTime,
      examType,
      isSubmitted,
    };
    localStorage.setItem('quizState', JSON.stringify(quizState));
  }, [questions, userAnswers, currentSubject, currentIndices, totalTime, examType, isSubmitted]);

  // Clear localStorage on route leave
  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentPath = window.location.pathname;
      if (!['/quiz/home', '/quiz/preview'].includes(currentPath)) {
        localStorage.removeItem('quizState');
        localStorage.removeItem('userAnswers');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Auto-submit on tab/window leave
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isSubmitted) {
        setIsSubmitted(true);
      }
    };
    const handleBlur = () => {
      if (!isSubmitted) {
        setIsSubmitted(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isSubmitted, setIsSubmitted]);

  // Handle quiz submission
  useEffect(() => {
    if (!isSubmitted) return;

    const handleQuizSubmission = async () => {
      try {
        setSaving(true);
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        if (!user) {
          console.error('No user authenticated.');
          toast.error('You must be logged in to submit a quiz');
          router.push('/login');
          return;
        }

        // Calculate quiz results
        const answers = userAnswers[currentSubject] ?? [];
        const totalQ = questions[currentSubject]?.length ?? 0;
        const correct = questions[currentSubject]?.filter((q, i) => answers[i] === q.correct).length ?? 0;
        const percentage = totalQ ? Math.round((correct / totalQ) * 100) : 0;
        const newPoints = calcPoints(percentage);

        // Calculate detailed scores for local storage
        const scoreResult = calculateScores();

        // Upsert quiz score
        const { data: existingData } = await supabase
          .from('quiz_scores')
          .select('*')
          .eq('student_id', user.id)
          .eq('quiz_id', currentSubject)
          .maybeSingle();

        let scoreId: number = 0;
        if (existingData) {
          await supabase
            .from('quiz_scores')
            .update({
              points: existingData.points + newPoints,
              taken_at: new Date().toISOString(),
              exam_type: examType,
            })
            .eq('id', existingData.id);
          scoreId = existingData.id;
        } else {
          const { data: inserted, error } = await supabase
            .from('quiz_scores')
            .insert({
              student_id: user.id,
              quiz_id: currentSubject,
              points: newPoints,
              taken_at: new Date().toISOString(),
              exam_type: examType,
            })
            .select('id')
            .single();

          if (error || !inserted) {
            console.error('Insert failed', error?.message);
            toast.error('Failed to save quiz score');
            return;
          }
          scoreId = inserted.id;
        }

        // Fetch user profile for result storage
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, first_name, last_name, avatar_url, user_type')
          .eq('id', user.id)
          .single();

        if (profileError || !profileData) {
          console.error('Profile fetch error:', profileError?.message);
          toast.error('Failed to fetch profile');
          router.push('/dashboard');
          return;
        }

        // Fetch leaderboard data
        const { data: leaderboardData, error: leaderboardError } = await supabase
          .from('leaderboard_view')
          .select('student_id, total_points, rank')
          .eq('student_id', user.id)
          .single();

        if (leaderboardError || !leaderboardData) {
          console.error('Leaderboard fetch error:', leaderboardError?.message);
          toast.error('Failed to fetch leaderboard data');
          router.push('/dashboard');
          return;
        }

        // Fetch all previous scores to calculate total points
        const { data: allScoresData } = await supabase
          .from('quiz_scores')
          .select('points')
          .eq('student_id', user.id)
          .lt('taken_at', new Date().toISOString());

        const previousTotal = (allScoresData || []).reduce((acc, s) => acc + Number(s.points), 0);
        const newTotal = previousTotal + newPoints;

        // Fetch streak data
        const { data: streakData } = await supabase
          .from('streaks')
          .select('current_streak, longest_streak')
          .eq('user_id', user.id)
          .single();

        // Save results to local storage
        localStorage.setItem(
          'resultState',
          JSON.stringify({
            profile: profileData,
            score: scoreResult,
            latestScore: { points: newPoints, taken_at: new Date().toISOString(), exam_type: examType },
            leaderboardEntry: leaderboardData,
            previousPoints: previousTotal,
            totalPoints: newTotal,
            streak: streakData || { current_streak: 0, longest_streak: 0 },
          })
        );

        // Update streak and check if completed today
        const streakResponse = await updateStreak(user.id);
        setCompletedToday(streakResponse?.completedToday ?? false);

        // Fetch previous submission for league check
        const { data: prevSubmission } = await supabase
          .from('quiz_scores')
          .select('*')
          .eq('student_id', user.id)
          .eq('quiz_id', currentSubject)
          .order('taken_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!prevSubmission) {
          if (streakResponse?.completedToday) {
            router.push('/streaks');
          } else {
            router.push('/quiz/result');
          }
          return;
        }

        const totalPoints = prevSubmission.points;
        const league = leagueThresholds.slice().reverse().find((l) => totalPoints >= l.min);

        if (!league) {
          if (streakResponse?.completedToday) {
            router.push('/streaks');
          } else {
            router.push('/quiz/result');
          }
          return;
        }

        const hasCelebrated = prevSubmission[league.column as keyof QuizScoreRow] ?? false;

        if (!hasCelebrated) {
          setCurrentLeague(league.name);
          await supabase
            .from('quiz_scores')
            .update({ [league.column]: true })
            .eq('id', prevSubmission.id);
        } else {
          if (streakResponse?.completedToday) {
            router.push('/streaks');
          } else {
            router.push('/quiz/result');
          }
        }

        // Clear stored questions and answers from localStorage after successful submission to ensure fresh questions next time
        Object.keys(localStorage).filter(key => key.startsWith('questions_')).forEach(key => localStorage.removeItem(key));
        localStorage.removeItem('quizState');
        localStorage.removeItem('userAnswers');
      } catch (err) {
        console.error('Error handling quiz submission:', err);
        toast.error('An unexpected error occurred');
        router.push('/dashboard');
      } finally {
        setSaving(false);
      }
    };
    handleQuizSubmission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitted]); // Simplified deps - only trigger on isSubmitted

  const jumpToQuestion = (index: number) => {
    setCurrentIndices({ ...currentIndices, [currentSubject]: index });
  };

  const handleConfirmSubmit = () => {
    setOpenConfirm(true);
  };

  const leagueObj = leagueThresholds.find((l) => l.name === currentLeague);
  const CelebrationComp = leagueObj?.component;

  if (isStarting || !questions || Object.keys(questions).length === 0) {
    return <LoadingSpinner message={isStarting ? "" : ""} />;
  }

  if (CelebrationComp) {
    return (
      <CelebrationComp
        onClose={() => {
          setCurrentLeague(null);
          if (completedToday) {
            router.push('/streaks');
          } else {
            router.push('/quiz/result');
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pb-30 sm: pb-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card max-w-3xl w-full p-4 sm:p-6 md:p-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Quiz in Progress</h1>
          <div className="flex items-center gap-4 text-lg font-semibold">
            <Timer
              totalSeconds={totalTime}
              onTimeUp={() => {
                setIsSubmitted(true);
              }}
            />
            <Sheet>
              <SheetTrigger asChild>
                <Button className="cursor-pointer" variant="default" size="icon">
                  <Calculator className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle>Calculator</SheetTitle>
                </SheetHeader>
                <CalculatorComponent />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <SubjectSwitcher />

        <h2 className="mt-4 mb-4 text-center text-lg sm:text-xl md:text-2xl font-semibold">
          Question ({currentIndex + 1}/{totalQuestions})
        </h2>

        <QuestionDisplay />

        {/* Navigator */}
        <Box as="div" className="mt-6">
          <div className="flex flex-wrap justify-center gap-2">
            {questions[currentSubject]?.map((_, idx) => {
              const answer = userAnswers?.[currentSubject]?.[idx];
              const isAnswered = answer !== undefined && answer !== -1;
              const isCurrent = currentIndex === idx;
              return (
                <div
                  key={idx}
                  className={`w-10 h-10 flex items-center justify-center rounded-md cursor-pointer
                    border transition-colors duration-200
                    ${isAnswered ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}
                    ${isCurrent ? 'ring-2 ring-blue-400' : ''}`}
                  onClick={() => jumpToQuestion(idx)}
                >
                  {idx + 1}
                </div>
              );
            })}
          </div>
        </Box>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4">
          <NavigationButtons />
          <Button onClick={handleConfirmSubmit} className="flex cursor-pointer items-center justify-center gap-2">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Submit Quiz
          </Button>
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => setIsSubmitted(true)}>Yes, Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Calculator Component
function CalculatorComponent() {
  const [input, setInput] = useState('');

  const handleClick = (value: string) => {
    if (value === '=') {
      try {
        setInput(eval(input).toString());
      } catch {
        setInput('Error');
      }
    } else if (value === 'C') {
      setInput('');
    } else {
      setInput(input + value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = '0123456789+-*/.=C';
    if (allowed.includes(e.key)) {
      e.preventDefault();
      if (e.key === 'Enter') handleClick('=');
      else if (e.key === 'Backspace') setInput(input.slice(0, -1));
      else handleClick(e.key === '.' ? '.' : e.key);
    }
  };

  const buttons = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+', 'C'];

  return (
    <div className="mt-4 flex flex-col gap-3">
      <Input value={input} onKeyDown={handleKeyDown} onChange={() => {}} className="text-right font-mono text-lg" />
      <div className="grid grid-cols-4 gap-2">
        {buttons.map(btn => (
          <Button
            key={btn}
            variant={btn === 'C' ? 'destructive' : 'secondary'}
            onClick={() => handleClick(btn)}
            className="cursor-pointer p-4"
          >
            {btn}
          </Button>
        ))}
      </div>
    </div>
  );
}