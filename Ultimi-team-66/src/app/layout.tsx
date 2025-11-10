'use client';

import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import ModeToggle from '@/app/theme/page';
import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import Box from '@/components/ui/box';
import clsx from 'clsx';

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      enabled: typeof window !== 'undefined' && navigator.onLine,
    },
  },
});




export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Box as="html" lang="en">
      <Box as="body" suppressHydrationWarning className="relative">
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            
            {/* Offline Banner with Animation */}
            <AnimatePresence>
              {!isOnline && (
                <motion.div
                  initial={{ y: -80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -80, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                  className="absolute top-4 left-[55%] -translate-x-1/2 z-50 w-[90%] md:w-[500px]"
                >
                  <Box as="div" className="flex items-center justify-center gap-3  bg-white dark:bg-gray-900 border border-red-500 text-red-600 px-4 py-3 rounded-xl shadow-xl">
                    <Box as="div" className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-800">
                      <WifiOff className="h-5 w-5" />
                    </Box>
                    <Box as="div" className="flex-1">
                      <Box as="p" className="text-sm font-semibold">No Internet Connection</Box>
                      <Box as="p" className="text-xs text-gray-600 dark:text-gray-400">
                        Please check your connection and try again.
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Page Content */}
            {/* <Box as="div" className={`${!isOnline ? 'pt-0' : ''} transition-all`}> */}
                  <Box as="body" className={clsx( !isOnline ? "pt-0" : "", "transition-all" , "text-[1.05rem]") }>

              <ModeToggle />
              {children}
            </Box>

            <Toaster />
          </ThemeProvider>
        </QueryClientProvider>
      </Box>
    </Box>
  );
}
