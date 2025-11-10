'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import QuizForm from '@/features/quiz/components/QuizForm';

export const QuizModule = () => {
  const [selectedRoute, setSelectedRoute] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card max-w-3xl w-full p-8"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Quiz Master</h1>
        {!selectedRoute ? (
          <div className="space-y-4">
            <label className="block text-xl font-semibold mb-4">
              Select Department
            </label>
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
                  onChange={() => setSelectedRoute(route)}
                  className="form-radio h-7 w-7"
                  aria-label={`Select ${route === 'arts' ? 'Arts/Commercial/Languages' : route} route`}
                />
                <span className="text-lg capitalize">
                  {route === 'arts' ? 'Arts/Commercial/Languages' : route}
                </span>
              </motion.label>
            ))}
          </div>
        ) : !selectedExamType ? (
          <div className="space-y-4">
            <label className="block text-xl font-semibold mb-4">
              Select Exam Type
            </label>
            {['WAEC', 'NECO', 'JAMB', 'normal'].map(examType => (
              <motion.label
                key={examType}
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name="examType"
                  value={examType}
                  checked={selectedExamType === examType}
                  onChange={() => setSelectedExamType(examType)}
                  className="form-radio h-7 w-7"
                  aria-label={`Select ${examType} exam type`}
                />
                <span className="text-lg capitalize">{examType}</span>
              </motion.label>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedRoute('')}
              className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg"
            >
              Back
            </motion.button>
          </div>
        ) : (
          <QuizForm
            route={selectedRoute}
            examType={selectedExamType}
            onBack={() => setSelectedExamType('')}
          />
        )}
      </motion.div>
    </div>
  );
}