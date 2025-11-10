// 'use client';

// import * as THREE from 'three';

// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Award, FileText, Flame, Home, Trophy } from 'lucide-react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { Card, CardContent } from '@/components/ui/card';
// import { Float, OrbitControls } from '@react-three/drei';
// import { motion, useSpring, useTransform } from 'framer-motion';
// import { useContext, useEffect, useRef, useState } from 'react';

// import { Button } from '@/components/ui/button';
// import LoadingSpinner from '@/features/quiz/components/LoadingSpinner';
// import { QuizContext } from '@/features/quiz/context/QuizContext';
// import ResultDisplay from '@/features/quiz/components/ResultDisplay';
// import { supabase } from '@/lib/supabaseClient';
// import { useRouter } from 'next/navigation';
// import { useTheme } from 'next-themes';

// interface ScoreResult {
//   correct: number;
//   total: number;
//   percentage: number;
// }

// interface Profile {
//   id: string;
//   username: string;
//   first_name: string;
//   last_name: string;
//   avatar_url?: string;
//   user_type: 'student' | 'sponsor';
// }

// interface Streak {
//   current_streak: number;
//   longest_streak: number;
// }

// interface Score {
//   points: number;
//   taken_at: string;
//   exam_type: 'WAEC' | 'NECO' | 'JAMB' | 'normal';
// }

// interface LeaderboardEntry {
//   student_id: string;
//   total_points: number;
//   rank: number;
// }

// const LEAGUE_COLORS: Record<string, { color: string; emissive: string }> = {
//   Diamond: { color: '#B9F2FF', emissive: '#40E0D0' },
//   Platinum: { color: '#E5E4E2', emissive: '#BEBEBE' },
//   Gold: { color: '#FFD700', emissive: '#FFA500' },
//   Silver: { color: '#C0C0C0', emissive: '#A9A9A9' },
//   Bronze: { color: '#CD7F32', emissive: '#B87333' },
//   Palladium: { color: '#CED0DD', emissive: '#A9A9B3' },
// };

// function getLeague(points: number) {
//   if (points >= 27300) return 'Diamond';
//   if (points >= 13300) return 'Platinum';
//   if (points >= 5300) return 'Gold';
//   if (points >= 1300) return 'Silver';
//   if (points >= 900) return 'Bronze';
//   return 'Palladium';
// }

// function LeagueBadgeMesh({ league }: { league: string }) {
//   const meshRef = useRef<THREE.Mesh>(null);
//   const { color, emissive } = LEAGUE_COLORS[league] ?? LEAGUE_COLORS.Palladium;

//   useFrame((_, delta) => {
//     if (meshRef.current) {
//       meshRef.current.rotation.y += delta * 0.5;
//       meshRef.current.rotation.x += delta * 0.2;
//     }
//   });

//   return (
//     <Float speed={1.5} rotationIntensity={0.8} floatIntensity={0.5}>
//       <mesh ref={meshRef}>
//         <icosahedronGeometry args={[1, 0]} />
//         <meshStandardMaterial
//           metalness={0.85}
//           roughness={0.2}
//           color={color}
//           emissive={emissive}
//           emissiveIntensity={0.4}
//         />
//       </mesh>
//     </Float>
//   );
// }

// function LeagueBadge3D({ league }: { league: string }) {
//   return (
//     <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }}>
//       <ambientLight intensity={0.7} />
//       <directionalLight position={[3, 3, 5]} intensity={1.5} />
//       <LeagueBadgeMesh league={league} />
//       <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
//     </Canvas>
//   );
// }

// export default function Result() {
//   const { calculateScores } = useContext(QuizContext);
//   const router = useRouter();
//   const { theme } = useTheme();
//   const [loading, setLoading] = useState(true);
//   const [profile, setProfile] = useState<Profile | null>(null);
//   const [score, setScore] = useState<ScoreResult | null>(null);
//   const [latestScore, setLatestScore] = useState<Score | null>(null);
//   const [leaderboardEntry, setLeaderboardEntry] = useState<LeaderboardEntry | null>(null);
//   const [streak, setStreak] = useState<Streak | null>(null);
//   const [streakLoading, setStreakLoading] = useState(true);
//   const [previousPoints, setPreviousPoints] = useState(0);
//   const [totalPoints, setTotalPoints] = useState(0);
//   const [error, setError] = useState<string | null>(null);

//   const pointsSpring = useSpring(previousPoints, { stiffness: 120, damping: 25 });
//   const animatedPoints = useTransform(pointsSpring, (value) => Math.round(value));

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setStreakLoading(true);
//         setError(null);

//         // Check localStorage first
//         const savedState = localStorage.getItem('resultState');
//         if (savedState) {
//           try {
//             const {
//               profile: savedProfile,
//               score: savedScore,
//               latestScore: savedLatestScore,
//               leaderboardEntry: savedLeaderboardEntry,
//               previousPoints: savedPreviousPoints,
//               totalPoints: savedTotalPoints,
//               streak: savedStreak,
//             } = JSON.parse(savedState);
//             setProfile(savedProfile || null);
//             setScore(savedScore || null);
//             setLatestScore(savedLatestScore || null);
//             setLeaderboardEntry(savedLeaderboardEntry || null);
//             setPreviousPoints(savedPreviousPoints || 0);
//             setTotalPoints(savedTotalPoints || 0);
//             setStreak(savedStreak || null);
//             pointsSpring.set(savedTotalPoints || 0);
//             setLoading(false);
//             setStreakLoading(false);
//             return; // Exit if localStorage data is valid
//           } catch (err) {
//             console.error('Error parsing localStorage:', err);
//             localStorage.removeItem('resultState'); // Clear invalid data
//           }
//         }

//         // Fetch from Supabase if no valid localStorage data
//         const { data: { user }, error: authError } = await supabase.auth.getUser();
//         if (authError || !user) {
//           console.error('Auth error:', authError?.message);
//           setError('No authenticated user');
//           router.push('/login');
//           return;
//         }

//         const { data: profileData, error: profileError } = await supabase
//           .from('profiles')
//           .select('id, username, first_name, last_name, avatar_url, user_type')
//           .eq('id', user.id)
//           .maybeSingle();

//         if (profileError || !profileData) {
//           console.error('Profile query error:', profileError?.message);
//           setError('Profile not found');
//           router.push('/dashboard');
//           return;
//         }

//         if (profileData.user_type !== 'student') {
//           console.warn('User is not a student:', profileData.user_type);
//           setError('Only students can view results');
//           router.push('/dashboard');
//           return;
//         }

//         const { data: scoresData, error: scoresError } = await supabase
//           .from('quiz_scores')
//           .select('points, taken_at, exam_type')
//           .eq('student_id', user.id)
//           .order('taken_at', { ascending: false })
//           .limit(1);

//         if (scoresError || !scoresData || scoresData.length === 0) {
//           console.error('Scores query error:', scoresError?.message);
//           setError('No quiz scores found');
//           setLoading(false);
//           setStreakLoading(false);
//           return;
//         }

//         const { data: streakData, error: streakError } = await supabase
//           .from('streaks')
//           .select('current_streak, longest_streak')
//           .eq('user_id', user.id)
//           .maybeSingle();
//         if (streakError || !streakData) {
//           console.error('Streak query error:', streakError?.message);
//           setStreak({ current_streak: 0, longest_streak: 0 });
//         } else {
//           setStreak({
//             current_streak: streakData.current_streak || 0,
//             longest_streak: streakData.longest_streak || 0,
//           });
//         }

//         const { data: leaderboardData, error: leaderboardError } = await supabase
//           .from('leaderboard_view')
//           .select('student_id, total_points, rank')
//           .eq('student_id', user.id);

//         if (leaderboardError) {
//           console.error('Leaderboard query error:', leaderboardError?.message);
//           setError('Failed to fetch leaderboard data');
//           setLoading(false);
//           setStreakLoading(false);
//           return;
//         }

//         if (!leaderboardData || leaderboardData.length === 0) {
//           console.warn('No leaderboard entry found for user:', user.id);
//           setError('No leaderboard entry found');
//           setLoading(false);
//           setStreakLoading(false);
//           return;
//         }

//         if (leaderboardData.length > 1) {
//           console.warn('Multiple leaderboard entries found for user:', user.id, leaderboardData);
//         }

//         const leaderboardEntry = leaderboardData[0];

//         const { data: allScoresData } = await supabase
//           .from('quiz_scores')
//           .select('points')
//           .eq('student_id', user.id)
//           .lt('taken_at', scoresData[0].taken_at);

//         const previousTotal = (allScoresData || []).reduce((acc, s) => acc + Number(s.points), 0);
//         const newTotal = previousTotal + Number(scoresData[0].points);

//         let result: ScoreResult | null = null;
//         try {
//           result = calculateScores();
//           if (!result) {
//             // Fallback: Construct a basic score result from Supabase data
//             const totalQ = 10; // Assume 10 questions if quiz context is unavailable
//             const percentage = Math.round((scoresData[0].points / 10) * 100); // Rough estimate
//             result = { correct: Math.round((percentage / 100) * totalQ), total: totalQ, percentage };
//           }
//         } catch (calcError) {
//           console.error('calculateScores error:', calcError);
//           // Fallback: Construct a basic score result
//           const totalQ = 10;
//           const percentage = Math.round((scoresData[0].points / 10) * 100);
//           result = { correct: Math.round((percentage / 100) * totalQ), total: totalQ, percentage };
//         }

//         setProfile(profileData);
//         setScore(result);
//         setLatestScore(scoresData[0]);
//         setLeaderboardEntry(leaderboardEntry);
//         setPreviousPoints(previousTotal);
//         setTotalPoints(newTotal);
//         setStreakLoading(false);

//         // Save to localStorage to persist across reloads
//         localStorage.setItem(
//           'resultState',
//           JSON.stringify({
//             profile: profileData,
//             score: result,
//             latestScore: scoresData[0],
//             leaderboardEntry,
//             previousPoints: previousTotal,
//             totalPoints: newTotal,
//             streak: streakData || { current_streak: 0, longest_streak: 0 },
//           })
//         );

//         pointsSpring.set(newTotal);
//         setLoading(false);
//       } catch (err) {
//         console.error('Fetch error:', err);
//         setError('An unexpected error occurred');
//         setLoading(false);
//         setStreakLoading(false);
//       }
//     };

//     fetchData();
//   }, [calculateScores, pointsSpring, router]);

//   if (loading) {
//     return <LoadingSpinner message="" />;
//   }

//   if (error || !profile || !score || !leaderboardEntry) {
//     return (
//       <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} text-gray-100`}>
//         <Card className={`p-6 max-w-md ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100'} shadow-lg rounded-xl`}>
//           <CardContent>
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Error</h2>
//             <p className="text-red-400 text-base mt-2">{error || 'Failed to load results'}</p>
//             <Button
//               onClick={() => router.push('/dashboard')}
//               className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-lg transition-all duration-300 shadow-md"
//             >
//               Back to Dashboard
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   const overallLeague = getLeague(totalPoints);

//   return (
//     <div
//       className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}
//     >
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: 'easeOut' }}
//         className="w-full max-w-5xl"
//       >
//         <Card className={`p-6 sm:p-8 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100'} rounded-2xl shadow-xl`}>
//           <CardContent className="flex flex-col gap-6 sm:gap-8">
//             {/* Top Row: Profile, League, Points, Streak, Rank */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4 sm:gap-6"
//             >
//               {/* Profile */}
//               <motion.div
//                 initial={{ scale: 0.8 }}
//                 animate={{ scale: 1 }}
//                 transition={{ duration: 0.5 }}
//                 className={`p-4 sm:p-5 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100'} rounded-xl shadow-lg flex items-center gap-4 w-full sm:w-auto`}
//               >
//                 <Avatar className="w-16 h-16 sm:w-20 sm:h-20 dark:border-4 border-blue-500 rounded-full shadow-md">
//                   {profile.avatar_url ? (
//                     <AvatarImage src={profile.avatar_url} alt={profile.username} />
//                   ) : (
//                     <AvatarFallback className="text-xl sm:text-2xl bg-gray-800 text-blue-400">
//                       {profile.username[0]}
//                     </AvatarFallback>
//                   )}
//                 </Avatar>
//                 <div className="text-center sm:text-left">
//                   <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{profile.username}</h3>
//                   <p className="text-sm text-gray-400">{profile.first_name} {profile.last_name}</p>
//                 </div>
//               </motion.div>

//               {/* League */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.3 }}
//                 className={`p-4 sm:p-5 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100'} rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center gap-4 w-full sm:w-auto`}
//               >
//                 <div className="w-14 h-14 sm:w-16 sm:h-16">
//                   <LeagueBadge3D league={overallLeague} />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">League</p>
//                   <p className="font-bold text-lg sm:text-xl text-gray-900 dark:text-gray-100">{overallLeague}</p>
//                 </div>
//               </motion.div>

//               {/* Points */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.4 }}
//                 className={`p-4 sm:p-5 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100'} rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center gap-4 w-full sm:w-auto`}
//               >
//                 <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
//                 <div>
//                   <p className="text-sm text-gray-400">Previous Points</p>
//                   <p className="font-bold text-lg sm:text-xl text-gray-900 dark:text-gray-100">{previousPoints}</p>
//                   <p className="text-sm text-gray-400 mt-1">New Total Points</p>
//                   <motion.p
//                     className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"
//                     initial={{ scale: 0.95 }}
//                     animate={{ scale: 1 }}
//                     transition={{ duration: 0.5, repeat: 1, repeatType: 'reverse' }}
//                   >
//                     {animatedPoints}
//                   </motion.p>
//                 </div>
//               </motion.div>

//               {/* Streak */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.5 }}
//                 className={`p-4 sm:p-5 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100'} rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center gap-4 w-full sm:w-auto`}
//               >
//                 <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
//                 <div>
//                   <p className="text-sm text-gray-400">Current Streak</p>
//                   <p className="font-bold text-lg sm:text-xl text-gray-900 dark:text-gray-100 flex items-center">
//                     {streakLoading ? (
//                       <span className="inline-block w-16 h-5 bg-gray-400 animate-pulse rounded" />
//                     ) : (
//                       <>
//                         {streak?.current_streak || 0} day{streak?.current_streak !== 1 ? 's' : ''}
//                         {streak?.current_streak && streak.current_streak > 6 ? ' 🔥' : ''}
//                       </>
//                     )}
//                   </p>
//                 </div>
//               </motion.div>

//               {/* Rank */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.6 }}
//                 className={`p-4 sm:p-5 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100'} rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center gap-4 w-full sm:w-auto`}
//               >
//                 <Award className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
//                 <div>
//                   <p className="text-sm text-gray-400">Rank</p>
//                   <p className="font-bold text-xl sm:text-2xl text-gray-900 dark:text-gray-100">{leaderboardEntry.rank}</p>
//                 </div>
//               </motion.div>
//             </motion.div>

//             {/* Bottom Section: Quiz Results */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.7 }}
//               className={`p-6 sm:p-8 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100'} rounded-xl shadow-lg`}
//             >
//               <h3 className="text-2xl sm:text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
//                 Latest Quiz Results
//               </h3>
//               <ResultDisplay score={score} examType={latestScore?.exam_type || 'normal'} />
//             </motion.div>

//             {/* Action Buttons */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.8 }}
//               className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center"
//             >
//               <Button
//                 onClick={() => {
//                   localStorage.removeItem('resultState'); // Clear on navigation
//                   router.push('/quiz/preview');
//                 }}
//                 className="flex items-center py-3 rounded-lg justify-center w-full sm:w-56 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
//               >
//                 <FileText className="mr-2 w-5 h-5" />
//                 Preview Incorrect Answers
//               </Button>
//               <Button
//                 onClick={() => {
//                   localStorage.removeItem('resultState'); // Clear on navigation
//                   router.push('/dashboard');
//                 }}
//                 className="flex items-center py-3 rounded-lg justify-center w-full sm:w-56 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-blue-700 text-white py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
//               >
//                 <Home className="mr-2 w-5 h-5" />
//                 Back to Home
//               </Button>
//             </motion.div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }






'use client';

import * as THREE from 'three';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Award, FileText, Flame, Home, Trophy } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Card, CardContent } from '@/components/ui/card';
import { Float, OrbitControls } from '@react-three/drei';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useContext, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/features/quiz/components/LoadingSpinner';
import { QuizContext } from '@/features/quiz/context/QuizContext';
import ResultDisplay from '@/features/quiz/components/ResultDisplay';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

interface ScoreResult {
  correct: number;
  total: number;
  percentage: number;
}

interface Profile {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  user_type: 'student' | 'sponsor';
}

interface Streak {
  current_streak: number;
  longest_streak: number;
}

interface Score {
  points: number;
  taken_at: string;
  exam_type: 'WAEC' | 'NECO' | 'JAMB' | 'normal';
}

interface LeaderboardEntry {
  student_id: string;
  total_points: number;
  rank: number;
}

const LEAGUE_COLORS: Record<string, { color: string; emissive: string }> = {
  Diamond: { color: '#B9F2FF', emissive: '#40E0D0' },
  Platinum: { color: '#E5E4E2', emissive: '#BEBEBE' },
  Gold: { color: '#FFD700', emissive: '#FFA500' },
  Silver: { color: '#C0C0C0', emissive: '#A9A9A9' },
  Bronze: { color: '#CD7F32', emissive: '#B87333' },
  Palladium: { color: '#CED0DD', emissive: '#A9A9B3' },
};

function getLeague(points: number) {
  if (points >= 27300) return 'Diamond';
  if (points >= 13300) return 'Platinum';
  if (points >= 5300) return 'Gold';
  if (points >= 1300) return 'Silver';
  if (points >= 900) return 'Bronze';
  return 'Palladium';
}

function LeagueBadgeMesh({ league }: { league: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { color, emissive } = LEAGUE_COLORS[league] ?? LEAGUE_COLORS.Palladium;

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.8} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          metalness={0.85}
          roughness={0.2}
          color={color}
          emissive={emissive}
          emissiveIntensity={0.4}
        />
      </mesh>
    </Float>
  );
}

function LeagueBadge3D({ league }: { league: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 3, 5]} intensity={1.5} />
      <LeagueBadgeMesh league={league} />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </Canvas>
  );
}

export default function Result() {
  const { calculateScores } = useContext(QuizContext);
  const router = useRouter();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [latestScore, setLatestScore] = useState<Score | null>(null);
  const [leaderboardEntry, setLeaderboardEntry] = useState<LeaderboardEntry | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [streakLoading, setStreakLoading] = useState(true);
  const [previousPoints, setPreviousPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const pointsSpring = useSpring(previousPoints, { stiffness: 120, damping: 25 });
  const animatedPoints = useTransform(pointsSpring, (value) => Math.round(value));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setStreakLoading(true);
        setError(null);

        // Check localStorage first
        const savedState = localStorage.getItem('resultState');
        if (savedState) {
          try {
            const {
              profile: savedProfile,
              score: savedScore,
              latestScore: savedLatestScore,
              leaderboardEntry: savedLeaderboardEntry,
              previousPoints: savedPreviousPoints,
              totalPoints: savedTotalPoints,
              streak: savedStreak,
            } = JSON.parse(savedState);
            setProfile(savedProfile || null);
            setScore(savedScore || null);
            setLatestScore(savedLatestScore || null);
            setLeaderboardEntry(savedLeaderboardEntry || null);
            setPreviousPoints(savedPreviousPoints || 0);
            setTotalPoints(savedTotalPoints || 0);
            setStreak(savedStreak || null);
            pointsSpring.set(savedTotalPoints || 0);
            setLoading(false);
            setStreakLoading(false);
            return; // Exit if localStorage data is valid
          } catch (err) {
            console.error('Error parsing localStorage:', err);
            localStorage.removeItem('resultState'); // Clear invalid data
          }
        }

        // Fetch from Supabase if no valid localStorage data
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          console.error('Auth error:', authError?.message);
          setError('No authenticated user');
          router.push('/login');
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, first_name, last_name, avatar_url, user_type')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError || !profileData) {
          console.error('Profile query error:', profileError?.message);
          setError('Profile not found');
          router.push('/dashboard');
          return;
        }

        if (profileData.user_type !== 'student') {
          console.warn('User is not a student:', profileData.user_type);
          setError('Only students can view results');
          router.push('/dashboard');
          return;
        }

        const { data: scoresData, error: scoresError } = await supabase
          .from('quiz_scores')
          .select('points, taken_at, exam_type')
          .eq('student_id', user.id)
          .order('taken_at', { ascending: false })
          .limit(1);

        if (scoresError || !scoresData || scoresData.length === 0) {
          console.error('Scores query error:', scoresError?.message);
          setError('No quiz scores found');
          setLoading(false);
          setStreakLoading(false);
          return;
        }

        const { data: streakData, error: streakError } = await supabase
          .from('streaks')
          .select('current_streak, longest_streak')
          .eq('user_id', user.id)
          .maybeSingle();
        if (streakError || !streakData) {
          console.error('Streak query error:', streakError?.message);
          setStreak({ current_streak: 0, longest_streak: 0 });
        } else {
          setStreak({
            current_streak: streakData.current_streak || 0,
            longest_streak: streakData.longest_streak || 0,
          });
        }

        const { data: leaderboardData, error: leaderboardError } = await supabase
          .from('leaderboard_view')
          .select('student_id, total_points, rank')
          .eq('student_id', user.id);

        if (leaderboardError) {
          console.error('Leaderboard query error:', leaderboardError?.message);
          setError('Failed to fetch leaderboard data');
          setLoading(false);
          setStreakLoading(false);
          return;
        }

        if (!leaderboardData || leaderboardData.length === 0) {
          console.warn('No leaderboard entry found for user:', user.id);
          setError('No leaderboard entry found');
          setLoading(false);
          setStreakLoading(false);
          return;
        }

        if (leaderboardData.length > 1) {
          console.warn('Multiple leaderboard entries found for user:', user.id, leaderboardData);
        }

        const leaderboardEntry = leaderboardData[0];

        const { data: allScoresData } = await supabase
          .from('quiz_scores')
          .select('points')
          .eq('student_id', user.id)
          .lt('taken_at', scoresData[0].taken_at);

        const previousTotal = (allScoresData || []).reduce((acc, s) => acc + Number(s.points), 0);
        const newTotal = previousTotal + Number(scoresData[0].points);

        let result: ScoreResult | null = null;
        try {
          result = calculateScores();
          if (!result) {
            // Fallback: Construct a basic score result from Supabase data
            const totalQ = 10; // Assume 10 questions if quiz context is unavailable
            const percentage = Math.round((scoresData[0].points / 10) * 100); // Rough estimate
            result = { correct: Math.round((percentage / 100) * totalQ), total: totalQ, percentage };
          }
        } catch (calcError) {
          console.error('calculateScores error:', calcError);
          // Fallback: Construct a basic score result
          const totalQ = 10;
          const percentage = Math.round((scoresData[0].points / 10) * 100);
          result = { correct: Math.round((percentage / 100) * totalQ), total: totalQ, percentage };
        }

        setProfile(profileData);
        setScore(result);
        setLatestScore(scoresData[0]);
        setLeaderboardEntry(leaderboardEntry);
        setPreviousPoints(previousTotal);
        setTotalPoints(newTotal);
        setStreakLoading(false);

        // Save to localStorage to persist across reloads
        localStorage.setItem(
          'resultState',
          JSON.stringify({
            profile: profileData,
            score: result,
            latestScore: scoresData[0],
            leaderboardEntry,
            previousPoints: previousTotal,
            totalPoints: newTotal,
            streak: streakData || { current_streak: 0, longest_streak: 0 },
          })
        );

        pointsSpring.set(newTotal);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('An unexpected error occurred');
        setLoading(false);
        setStreakLoading(false);
      }
    };

    fetchData();
  }, [calculateScores, pointsSpring, router]);

  if (loading) {
    return <LoadingSpinner message="" />;
  }

  if (error || !profile || !score || !leaderboardEntry) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} text-gray-100`}>
        <Card className={`p-6 max-w-md ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100'} shadow-lg rounded-xl`}>
          <CardContent>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Error</h2>
            <p className="text-red-400 text-base mt-2">{error || 'Failed to load results'}</p>
            <Button
              onClick={() => router.push('/dashboard')}
              className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-lg transition-all duration-300 shadow-md"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const overallLeague = getLeague(totalPoints);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} pb-30 sm: pb-0`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-5xl"
      >
        <Card className={`p-6 sm:p-8 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100'} rounded-2xl shadow-xl`}>
          <CardContent className="flex flex-col gap-6 sm:gap-8">
            {/* Top Row: Profile, League, Points, Streak, Rank */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4 sm:gap-6"
            >
              {/* Profile */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`p-4 sm:p-5 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100'} rounded-xl shadow-lg flex items-center gap-4 w-full sm:w-auto`}
              >
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20 dark:border-4 border-blue-500 rounded-full shadow-md">
                  {profile.avatar_url ? (
                    <AvatarImage src={profile.avatar_url} alt={profile.username} />
                  ) : (
                    <AvatarFallback className="text-xl sm:text-2xl bg-gray-800 text-blue-400">
                      {profile.username[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{profile.username}</h3>
                  <p className="text-sm text-gray-400">{profile.first_name} {profile.last_name}</p>
                </div>
              </motion.div>

              {/* League */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className={`p-4 sm:p-5 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100'} rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center gap-4 w-full sm:w-auto`}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16">
                  <LeagueBadge3D league={overallLeague} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">League</p>
                  <p className="font-bold text-lg sm:text-xl text-gray-900 dark:text-gray-100">{overallLeague}</p>
                </div>
              </motion.div>

              {/* Points */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className={`p-4 sm:p-5 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100'} rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center gap-4 w-full sm:w-auto`}
              >
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
                <div>
                  <p className="text-sm text-gray-400">Previous Points</p>
                  <p className="font-bold text-lg sm:text-xl text-gray-900 dark:text-gray-100">{previousPoints}</p>
                  <p className="text-sm text-gray-400 mt-1">New Total Points</p>
                  <motion.p
                    className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, repeat: 1, repeatType: 'reverse' }}
                  >
                    {animatedPoints}
                  </motion.p>
                </div>
              </motion.div>

              {/* Streak */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className={`p-4 sm:p-5 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100'} rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center gap-4 w-full sm:w-auto`}
              >
                <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-400">Current Streak</p>
                  <p className="font-bold text-lg sm:text-xl text-gray-900 dark:text-gray-100 flex items-center">
                    {streakLoading ? (
                      <span className="inline-block w-16 h-5 bg-gray-400 animate-pulse rounded" />
                    ) : (
                      <>
                        {streak?.current_streak || 0} day{streak?.current_streak !== 1 ? 's' : ''}
                        {streak?.current_streak && streak.current_streak > 6 ? ' 🔥' : ''}
                      </>
                    )}
                  </p>
                </div>
              </motion.div>

              {/* Rank */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className={`p-4 sm:p-5 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100'} rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center gap-4 w-full sm:w-auto`}
              >
                <Award className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
                <div>
                  <p className="text-sm text-gray-400">Rank</p>
                  <p className="font-bold text-xl sm:text-2xl text-gray-900 dark:text-gray-100">{leaderboardEntry.rank}</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Bottom Section: Quiz Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className={`p-6 sm:p-8 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100'} rounded-xl shadow-lg`}
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Latest Quiz Results
              </h3>
              <ResultDisplay score={score} examType={latestScore?.exam_type || 'normal'} />
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center"
            >
              <Button
                onClick={() => {
                  localStorage.removeItem('resultState'); // Clear on navigation
                  router.push('/quiz/preview');
                }}
                className="flex items-center py-3 rounded-lg justify-center w-full sm:w-56 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FileText className="mr-2 w-5 h-5" />
                Preview Incorrect Answers
              </Button>
              <Button
                onClick={() => {
                  localStorage.removeItem('resultState'); // Clear on navigation
                  router.push('/dashboard');
                }}
                className="flex items-center py-3 rounded-lg justify-center w-full sm:w-56 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-blue-700 text-white py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Home className="mr-2 w-5 h-5" />
                Back to Home
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}