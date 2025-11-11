'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function RouteSelection() {
  const router = useRouter();
  const [selectedRoute, setSelectedRoute] = useState('');

  const handleRouteChange = (route: string) => {
    setSelectedRoute(route);
    router.push(`/quiz-form?route=${route}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card max-w-3xl w-full p-8"
      >
        <h1 className="text-3xl font-bold mb-6 text-center gradient-bg text-transparent bg-clip-text">
          Select Your Department
        </h1>
        <div className="space-y-4">
          {['science', 'arts', 'both'].map(route => (
            <motion.label
              key={route}
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <input
                type="radio"
                name="route"
                value={route}
                checked={selectedRoute === route}
                onChange={() => handleRouteChange(route)}
                className="form-radio h-6 w-6 text-blue-600 dark:text-blue-400 rounded-full focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-150 ease-in-out"
              />
              <span className="text-base capitalize text-gray-800 dark:text-gray-200">
                {route === 'arts' ? 'Arts/Commercial/Languages' : route}
              </span>
            </motion.label>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
