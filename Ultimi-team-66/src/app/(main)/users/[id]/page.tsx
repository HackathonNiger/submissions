'use client';

import * as THREE from 'three';

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import {
  ArrowLeft,
  Building2,
  FileText,
  Info,
  Mail,
  MapPin,
  Phone,
  Trophy,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Canvas, useFrame } from '@react-three/fiber';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Float, OrbitControls } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Line } from 'react-chartjs-2';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabaseClient';
import { useTheme } from 'next-themes';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
);

interface Profile {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  company?: string;
  avatar_url?: string;
  user_type: 'student' | 'sponsor';
  bio?: string;
  email?: string;
  phone?: string;
  city?: string;
  reason?: string;
}

interface Score {
  points: number;
  taken_at: string;
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
      meshRef.current.rotation.y += delta * 0.75;
      meshRef.current.rotation.x += delta * 0.3;
    }
  });

  return (
    <Float speed={1.3} rotationIntensity={1} floatIntensity={0.6}>
      <mesh ref={meshRef}>
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          metalness={0.9}
          roughness={0.25}
          color={color}
          emissive={emissive}
          emissiveIntensity={0.35}
        />
      </mesh>
    </Float>
  );
}

function LeagueBadge3D({ league }: { league: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 3.2], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 2, 5]} intensity={1.2} />
      <LeagueBadgeMesh league={league} />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </Canvas>
  );
}

export default function UserProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    async function fetchProfileAndScores() {
      if (!id) return;
      try {
        setLoading(true);

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (!profileData) return;

        let scoreData: Score[] = [];
        let total = 0;

        if (profileData.user_type === 'student') {
          const { data: scoresFetched } = await supabase
            .from('quiz_scores')
            .select('points, taken_at')
            .eq('student_id', id)
            .order('taken_at', { ascending: true });

          scoreData = scoresFetched || [];
          total = scoreData.reduce((acc, s) => acc + Number(s.points), 0);
        }

        setProfile(profileData);
        setScores(scoreData);
        setTotalPoints(total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfileAndScores();
  }, [id]);

  const overallLeague = getLeague(totalPoints);

  const labels = scores.map((s) => new Date(s.taken_at).toLocaleDateString());
  const dataValues = scores.map((s) => s.points);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Points',
        data: dataValues,
        borderColor: '#00f2ff',
        backgroundColor: '#00f2ff33',
        fill: true,
      },
    ],
  };

  // return (
  //   <div
  //     className={`min-h-screen max-h-[fit-content] p-4 sm:p-6 lg:p-8 ${
  //       theme === 'dark'
  //         ? 'bg-gray-900 text-gray-100'
  //         : 'bg-gray-50 text-gray-900'
  //     }`}
  //   >
  //     {/* Back Button */}
  //     <button
  //       onClick={() =>
  //         router.push(
  //           profile?.user_type === 'student'
  //             ? '/leaderboard'
  //             : '/sponsors'
  //         )
  //       }
  //       className="relative flex-1 top-[7px] left-4 w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-300 dark:hover:bg-gray-700 z-50"
  //     >
  //       <ArrowLeft className="w-5 h-5 text-blue-600 dark:text-blue-400" />
  //     </button>

  //     {loading ? (
  //       <div className="flex justify-center items-center h-64">
  //         <Skeleton className="w-16 h-16 rounded-full" />
  //       </div>
  //     ) : (
  //       <>
  //         {/* Profile Card */}
  //         <Card className="mb-6 p-4 sm:p-6 flex flex-col md:flex-row justify-between gap-4">
  //           <div className="flex items-center gap-4">
  //             <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
  //               {profile?.avatar_url ? (
  //                 <AvatarImage src={profile.avatar_url} />
  //               ) : (
  //                 <AvatarFallback>{profile?.username[0]}</AvatarFallback>
  //               )}
  //             </Avatar>
  //             <div>
  //               <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
  //                 {profile?.username}
  //               </h2>
  //               <p className="text-sm sm:text-base opacity-70">
  //                 {profile?.first_name} {profile?.last_name}
  //                 {profile?.company && ` • ${profile.company}`}
  //               </p>
  //             </div>
  //           </div>

  //           {/* Student-only stats */}
  //           {profile?.user_type === 'student' && (
  //             <div className="flex flex-wrap gap-4 justify-center md:justify-end">
  //               <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 min-w-[120px]">
  //                 <Trophy className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-yellow-400" />
  //                 <div>
  //                   <p className="text-xs sm:text-sm">Points</p>
  //                   <p className="font-bold text-lg sm:text-xl">
  //                     {totalPoints}<span className="text-[13px]">{'𝙐𝙥'}</span>
  //                   </p>
  //                 </div>
  //               </div>
  //               <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 min-w-[140px]">
  //                 <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24">
  //                   <LeagueBadge3D league={overallLeague} />
  //                 </div>
  //                 <div>
  //                   <p className="text-xs sm:text-sm">League</p>
  //                   <p className="font-bold text-lg sm:text-xl">
  //                     {overallLeague}
  //                   </p>
  //                 </div>
  //               </div>
  //             </div>
  //           )}
  //         </Card>

  //         {/* Contact & Info */}
  //         <Card className="mb-6 p-6">
  //           <CardHeader>
  //             <CardTitle className="text-xl font-bold">Contact Info</CardTitle>
  //           </CardHeader>
  //           <CardContent className="space-y-3 text-sm sm:text-base">
  //             <div className="flex items-center gap-2">
  //               <Mail className="w-4 h-4 opacity-70" />
  //               <span>{profile?.email || 'No email provided'}</span>
  //             </div>
  //             <div className="flex items-center gap-2">
  //               <Phone className="w-4 h-4 opacity-70" />
  //               <span>{profile?.phone || 'No phone provided'}</span>
  //             </div>
  //             <div className="flex items-center gap-2">
  //               <MapPin className="w-4 h-4 opacity-70" />
  //               <span>{profile?.city || 'No state provided'}</span>
  //             </div>
  //             <div className="flex items-center gap-2">
  //               <FileText className="w-4 h-4 opacity-70" />
  //               <span>{profile?.reason || 'No reason provided'}</span>
  //             </div>
  //           </CardContent>
  //         </Card>

  //         {/* Sponsor-only Bio Section */}
  //         {profile?.user_type === 'sponsor' && (
  //           <Card className="mb-6 p-6">
  //             <CardHeader>
  //               <CardTitle className="flex items-center gap-2 text-xl">
  //                 <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
  //                 About
  //               </CardTitle>
  //             </CardHeader>
  //             <CardContent>
  //               <p className="text-sm sm:text-base leading-relaxed">
  //                 {profile?.bio || 'This sponsor has not added a bio yet.'}
  //               </p>
  //               {profile?.company && (
  //                 <div className="flex items-center gap-2 mt-3 text-blue-600 dark:text-blue-400">
  //                   <Building2 className="w-4 h-4" />
  //                   <span className="font-medium">{profile.company}</span>
  //                 </div>
  //               )}
  //             </CardContent>
  //           </Card>
  //         )}

  //         {/* Student-only charts */}
  //         {profile?.user_type === 'student' && (
  //           <Card className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
  //             <CardHeader>
  //               <CardTitle className="text-xl sm:text-2xl font-bold mb-4">
  //                 Progress Over Time
  //               </CardTitle>
  //             </CardHeader>
  //             <CardContent>
  //               {loading ? (
  //                 <div className="w-full h-[400px] flex items-center justify-center">
  //                   <Skeleton className="w-full h-[400px] rounded-xl animate-pulse" />
  //                 </div>
  //               ) : (
  //                 <div className="w-full h-[400px]">
  //                   <Line
  //                     data={chartData}
  //                     options={{
  //                       responsive: true,
  //                       maintainAspectRatio: false,
  //                     }}
  //                   />
  //                 </div>
  //               )}
  //             </CardContent>
  //           </Card>
  //         )}
  //       </>
  //     )}
  //   </div>
  // );



  return (
    <div
      className={`min-h-screen max-h-[fit-content] p-4 sm:p-6 lg:p-8 xl:p-10 ${
        theme === 'dark'
          ? 'bg-gray-900 text-gray-100'
          : 'bg-gray-50 text-gray-900'
      }`}
    >
       <head>
        <title>User | Ultimi</title>
      </head>
      {/* Back Button */}
      <div className="relative mb-6">
        <button
          onClick={() =>
            router.push(
              profile?.user_type === 'student' ? '/leaderboard' : '/sponsors'
            )
          }
          className="absolute top-0 left-0 w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-300 dark:hover:bg-gray-700 z-50 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Skeleton className="w-16 h-16 rounded-full" />
        </div>
      ) : (
        <>
          {/* Profile Card */}
          <Card className="mb-6 p-4 sm:p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28">
                {profile?.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} />
                ) : (
                  <AvatarFallback>{profile?.username[0]}</AvatarFallback>
                )}
              </Avatar>
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                  {profile?.username}
                </h2>
                <p className="text-sm sm:text-base lg:text-lg opacity-70 mt-1">
                  {profile?.first_name} {profile?.last_name}
                  {profile?.company && ` • ${profile.company}`}
                </p>
              </div>
            </div>

            {/* Student-only stats */}
            {profile?.user_type === 'student' && (
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 mt-4 md:mt-0">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 min-w-[120px] shadow-sm">
                  <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400" />
                  <div>
                    <p className="text-xs sm:text-sm opacity-80">Points</p>
                    <p className="font-bold text-lg sm:text-xl">
                      {totalPoints}<span className="text-[13px] opacity-60">{'𝙐𝙥'}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 min-w-[140px] shadow-sm">
                  <div className="w-16 h-16 sm:w-20 sm:h-20">
                    <LeagueBadge3D league={overallLeague} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm opacity-80">League</p>
                    <p className="font-bold text-lg sm:text-xl">
                      {overallLeague}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Contact & Info */}
          <Card className="mb-6 p-4 sm:p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-lg sm:text-xl font-bold">Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm sm:text-base p-0">
              <div className="flex items-start sm:items-center gap-2">
                <Mail className="w-4 h-4 mt-1 sm:mt-0 opacity-70" />
                <span>{profile?.email || 'No email provided'}</span>
              </div>
              <div className="flex items-start sm:items-center gap-2">
                <Phone className="w-4 h-4 mt-1 sm:mt-0 opacity-70" />
                <span>{profile?.phone || 'No phone provided'}</span>
              </div>
              <div className="flex items-start sm:items-center gap-2">
                <MapPin className="w-4 h-4 mt-1 sm:mt-0 opacity-70" />
                <span>{profile?.city || 'No state provided'}</span>
              </div>
              <div className="flex items-start sm:items-center gap-2">
                <FileText className="w-4 h-4 mt-1 sm:mt-0 opacity-70" />
                <span>{profile?.reason || 'No reason provided'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Sponsor-only Bio Section */}
          {profile?.user_type === 'sponsor' && (
            <Card className="mb-6 p-4 sm:p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-bold">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-sm sm:text-base leading-relaxed">
                  {profile?.bio || 'This sponsor has not added a bio yet.'}
                </p>
                {profile?.company && (
                  <div className="flex items-center gap-2 mt-3 text-blue-600 dark:text-blue-400">
                    <Building2 className="w-4 h-4" />
                    <span className="font-medium text-sm sm:text-base">{profile.company}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Student-only charts */}
          {profile?.user_type === 'student' && (
            <Card className="p-4 sm:p-6 rounded-lg bg-gray-100 dark:bg-gray-800">
              <CardHeader className="p-0">
                <CardTitle className="text-lg sm:text-2xl font-bold mb-4">
                  Progress Over Time
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="w-full h-[300px] sm:h-[400px] flex items-center justify-center">
                    <Skeleton className="w-full h-[300px] sm:h-[400px] rounded-xl animate-pulse" />
                  </div>
                ) : (
                  <div className="w-full h-[300px] sm:h-[400px]">
                    <Line
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        // Add more options for chart responsiveness
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );




}
