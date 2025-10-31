// backend/src/services/quizService.js

/**
 * Quiz Service
 * - Handles CRUD operations and quiz submissions
 */

import Quiz from '../models/Quiz.js';

// ----------------------------
// Create a new quiz
// ----------------------------
export const createQuiz = async (payload) => {
  // payload should contain { title, lesson, questions }
  return Quiz.create(payload);
};

// ----------------------------
// Get quiz by ID
// ----------------------------
export const getQuizById = async (id) => {
  // Populate lesson info for reference
  return Quiz.findById(id).populate('lesson');
};

// ----------------------------
// Submit quiz answers
// ----------------------------
export const submitQuiz = async (id, answers) => {
  const quiz = await Quiz.findById(id);
  if (!quiz) return null;

  // Calculate correct answers
  let correct = 0;
  quiz.questions.forEach((q, idx) => {
    if (typeof answers[idx] === 'number' && answers[idx] === q.correctIndex) correct++;
  });

  // Calculate score percentage
  const score = Math.round((correct / quiz.questions.length) * 100);

  return {
    score,             // Percentage score
    total: quiz.questions.length, // Total number of questions
    correct            // Number of correct answers
  };
};
