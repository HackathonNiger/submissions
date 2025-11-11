'use client';

import { useEffect, useState } from 'react';
import { Zap, X } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/features/quiz/components/LoadingSpinner';
import { useTheme } from 'next-themes';

// Define interface for streak data
interface StreakData {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_active: string;
  streak_freezes: number;
}

export default function Streaks() {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const router = useRouter();
  const { theme } = useTheme();
  const controls = useAnimation();

  // Animation for energy effect
  useEffect(() => {
    controls.start({
      scale: [1, 1.25, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    });
  }, [controls]);

  // Fetch streak data
  useEffect(() => {
    async function fetchStreak() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      const { data } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', user.id)
        .single();
      setStreakData(data);
    }
    fetchStreak();
  }, [router]);

  if (!streakData) {
    return <LoadingSpinner message="" />;
  }

  const currentStreak = streakData?.current_streak;

  // Weekly display logic
  const dayLabels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + offset);

  const weekDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekDates.push(d.toISOString().split('T')[0]);
  }

  const streakStart = new Date(today);
  streakStart.setDate(today.getDate() - (currentStreak - 1));
  const streakStartStr = streakStart.toISOString().split('T')[0];

  const isTodayFunc = (dateStr: string) => dateStr === todayStr;
  const isPast = (dateStr: string) => new Date(dateStr) < today;
  const isActive = (dateStr: string) => dateStr >= streakStartStr && dateStr <= todayStr;
  const isFuture = (dateStr: string) => new Date(dateStr) > today;

  // Define background gradient based on theme
  const backgroundGradient = theme === 'dark'
    ? 'linear-gradient(180deg, #1f2937 0%, #111827 50%)'
    : theme === 'custom'
    ? 'linear-gradient(180deg, #bfdbfe 0%, #eff6ff 50%)'
    : 'linear-gradient(180deg, #bae6fd 0%, #f0f9ff 50%)';

  // Define energy effect gradient based on theme
  const energyGradient = theme === 'dark'
    ? 'radial-gradient(circle, #374151 60%, #1f2937 100%)'
    : theme === 'custom'
    ? 'radial-gradient(circle, #dbeafe 60%, #bfdbfe 100%)'
    : 'radial-gradient(circle, #e0f2fe 60%, #bae6fd 100%)';

  return (
    // <motion.div
    //   className="min-h-screen flex flex-col items-center justify-center p-4"
    //   style={{ background: backgroundGradient }}
    //   initial={{ opacity: 0 }}
    //   animate={{ opacity: 1 }}
    //   transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
    // >
    //   {/* Energy effect + Icon */}
    //   <motion.div
    //     className="relative flex flex-col items-center mb-8 mt-8"
    //     initial={{ opacity: 0, y: 20 }}
    //     animate={{ opacity: 1, y: 0 }}
    //     transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.4 }}
    //   >
    //     <motion.div
    //       animate={controls}
    //       className="absolute"
    //       style={{
    //         width: 160,
    //         height: 160,
    //         borderRadius: '50%',
    //         background: energyGradient,
    //         filter: 'blur(16px)',
    //         zIndex: 0,
    //       }}
    //     />
    //     <motion.div
    //       initial={{ opacity: 0, y: 20 }}
    //       animate={{ opacity: 1, y: 0, rotate: [0, 10, -10, 0] }}
    //       transition={{
    //         opacity: { duration: 0.8, ease: 'easeInOut', delay: 0.4 },
    //         y: { duration: 0.8, ease: 'easeInOut', delay: 0.4 },
    //         rotate: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
    //       }}
    //       className="z-10"
    //     >
    //       <Zap size={96} color="#d6e800" strokeWidth={2.5} className="drop-shadow-lg" />
    //     </motion.div>
    //   </motion.div>

    //   {/* Streak Number */}
    //   <motion.div
    //     className="text-5xl font-extrabold mb-2"
    //     initial={{ opacity: 0, y: 20 }}
    //     animate={{ opacity: 1, y: 0 }}
    //     transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.6 }}
    //   >
    //     {currentStreak}
    //   </motion.div>
    //   <motion.div
    //     className="text-xl font-bold mb-6"
    //     initial={{ opacity: 0, y: 20 }}
    //     animate={{ opacity: 1, y: 0 }}
    //     transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.8 }}
    //   >
    //     {currentStreak === 1
    //       ? "You've started your streak!"
    //       : `You've extended your streak to ${currentStreak} days!`}
    //   </motion.div>
    //   <motion.div
    //     className="text-lg mb-12"
    //     initial={{ opacity: 0, y: 20 }}
    //     animate={{ opacity: 1, y: 0 }}
    //     transition={{ duration: 0.8, ease: 'easeInOut', delay: 1.0 }}
    //   >
    //     You earned 4 points!
    //   </motion.div>

    //   {/* Weekly Streak Tracker */}
    //   <motion.div
    //     className="flex items-center gap-4 mb-12"
    //     initial={{ opacity: 0, y: 20 }}
    //     animate={{ opacity: 1, y: 0 }}
    //     transition={{ duration: 0.8, ease: 'easeInOut', delay: 1.2 }}
    //   >
    //     {dayLabels.map((label, idx) => {
    //       const dateStr = weekDates[idx];
    //       const isTod = isTodayFunc(dateStr);
    //       const active = isActive(dateStr);
    //       const past = isPast(dateStr);
    //       const future = isFuture(dateStr);
    //       return (
    //         <div
    //           key={idx}
    //           className={`flex flex-col items-center ${isTod ? 'font-bold' : ''} ${future ? 'opacity-30' : ''}`}
    //         >
    //           <div
    //             className={`rounded-full flex items-center justify-center border-2 ${isTod ? 'w-12 h-12' : 'w-10 h-10'}`}
    //             style={{
    //               background: active ? '#bef264' : past ? '#e5e7eb' : 'transparent',
    //               borderColor: active ? '#a3e635' : '#d1d5db',
    //             }}
    //           >
    //             {active ? <Zap size={isTod ? 28 : 24} color="#22c55e" /> : past ? <X size={isTod ? 28 : 24} color="#ef4444" /> : null}
    //           </div>
    //           <span className={`mt-1 font-semibold ${isTod ? 'text-base' : 'text-sm'}`}>
    //             {label}
    //           </span>
    //         </div>
    //       );
    //     })}
    //   </motion.div>

    //   {/* Continue Button */}
    //   <motion.div
    //     initial={{ opacity: 0, y: 20 }}
    //     animate={{ opacity: 1, y: 0 }}
    //     transition={{ duration: 0.8, ease: 'easeInOut', delay: 1.4 }}
    //   >
    //     <Button
    //       className="w-80 py-4 rounded-full text-lg font-semibold transition"
    //       style={{
    //         background: 'linear-gradient(to right, #3b82f6, #2563eb)',
    //         color: '#ffffff',
    //       }}
    //       onClick={() => router.push('/quiz/result')}
    //     >
    //       Continue to Results
    //     </Button>
    //   </motion.div>
    // </motion.div>
  <motion.div
  
      className="min-h-screen flex flex-col items-center justify-center px-4 py-6 sm:px-6 lg:px-8"
      style={{ background: backgroundGradient }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
    >
       <head>
        <title>Streak | Ultimi</title>
      </head>
      {/* Energy effect + Icon */}
      <motion.div
        className="relative flex flex-col items-center mb-6 mt-6 sm:mb-8 sm:mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.4 }}
      >
        <motion.div
          animate={controls}
          className="absolute"
          style={{
            width: 'clamp(120px, 30vw, 160px)',
            height: 'clamp(120px, 30vw, 160px)',
            borderRadius: '50%',
            background: energyGradient,
            filter: 'blur(clamp(12px, 2vw, 16px))',
            zIndex: 0,
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, rotate: [0, 10, -10, 0] }}
          transition={{
            opacity: { duration: 0.8, ease: 'easeInOut', delay: 0.4 },
            y: { duration: 0.8, ease: 'easeInOut', delay: 0.4 },
            rotate: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
          }}
          className="z-10"
        >
          <Zap
            size="clamp(64px, 20vw, 96px)"
            color="#d6e800"
            strokeWidth={2.5}
            className="drop-shadow-lg"
          />
        </motion.div>
      </motion.div>

      {/* Streak Number */}
      <motion.div
        className="text-4xl sm:text-5xl font-extrabold mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.6 }}
      >
        {currentStreak}
      </motion.div>
      <motion.div
        className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.8 }}
      >
        {currentStreak === 1
          ? "You've started your streak!"
          : `You've extended your streak to ${currentStreak} days!`}
      </motion.div>
      <motion.div
        className="text-base sm:text-lg mb-8 sm:mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut', delay: 1.0 }}
      >
        You earned 4 points!
      </motion.div>

      {/* Weekly Streak Tracker */}
      <motion.div
        className="flex items-center gap-2 sm:gap-4 mb-8 sm:mb-12 flex-wrap justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut', delay: 1.2 }}
      >
        {dayLabels.map((label, idx) => {
          const dateStr = weekDates[idx];
          const isTod = isTodayFunc(dateStr);
          const active = isActive(dateStr);
          const past = isPast(dateStr);
          const future = isFuture(dateStr);
          return (
            <div
              key={idx}
              className={`flex flex-col items-center ${isTod ? 'font-bold' : ''} ${
                future ? 'opacity-30' : ''
              }`}
            >
              <div
                className={`rounded-full flex items-center justify-center border-2 ${
                  isTod ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-8 h-8 sm:w-10 sm:h-10'
                }`}
                style={{
                  background: active ? '#bef264' : past ? '#e5e7eb' : 'transparent',
                  borderColor: active ? '#a3e635' : '#d1d5db',
                }}
              >
                {active ? (
                  <Zap size={isTod ? 'clamp(20px, 5vw, 28px)' : 'clamp(16px, 4vw, 24px)'} color="#22c55e" />
                ) : past ? (
                  <X size={isTod ? 'clamp(20px, 5vw, 28px)' : 'clamp(16px, 4vw, 24px)'} color="#ef4444" />
                ) : null}
              </div>
              <span
                className={`mt-1 font-semibold ${
                  isTod ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </motion.div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut', delay: 1.4 }}
      >
        <Button
          className="w-full sm:w-80 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition"
          style={{
            background: 'linear-gradient(to right, #3b82f6, #2563eb)',
            color: '#ffffff',
          }}
          onClick={() => router.push('/quiz/result')}
        >
          Continue to Results
        </Button>
      </motion.div>
    </motion.div>
  
  );
}