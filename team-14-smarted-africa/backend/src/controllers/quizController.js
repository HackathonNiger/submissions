// backend/src/controllers/quizController.js

// ----------------------------
// Import Services & Utilities
// ----------------------------
import * as quizService from '../services/quizService.js';
import { created, success, notFound } from '../utils/response.js';

// ----------------------------
// Create a New Quiz
// ----------------------------
export const createQuiz = async (req, res, next) => {
  try {
    const quiz = await quizService.createQuiz(req.body); // Call service to create quiz
    return created(res, { quiz }, 'Quiz created');
  } catch (err) {
    next(err); // Pass error to global error handler
  }
};

// ----------------------------
// Get Quiz by ID
// ----------------------------
export const getQuiz = async (req, res, next) => {
  try {
    const quiz = await quizService.getQuizById(req.params.id);
    if (!quiz) return notFound(res, 'Quiz not found'); // Return 404 if not found
    return success(res, { quiz }, 'Quiz fetched');
  } catch (err) {
    next(err);
  }
};

// ----------------------------
// Submit Quiz Answers
// ----------------------------
export const submitQuiz = async (req, res, next) => {
  try {
    // answers array defaults to empty if not provided
    const result = await quizService.submitQuiz(req.params.id, req.body.answers || []);
    if (!result) return notFound(res, 'Quiz not found'); // Return 404 if quiz not found
    return success(res, { result }, 'Quiz submitted');
  } catch (err) {
    next(err);
  }
};
