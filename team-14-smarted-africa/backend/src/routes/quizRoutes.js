// backend/src/routes/quizRoutes.js

// ----------------------------
// Import Modules
// ----------------------------
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authorize.js';
import { createQuiz, getQuiz, submitQuiz } from '../controllers/quizController.js';

// ----------------------------
// Initialize Router
// ----------------------------
const router = express.Router();

// ----------------------------
// Quiz Routes
// ----------------------------
router.post('/', protect, authorize('teacher','admin'), createQuiz); 
// Protected route for teachers/admins to create a quiz

router.get('/:id', getQuiz); 
// Public route to fetch a specific quiz by ID

router.post('/:id/submit', protect, submitQuiz); 
// Protected route for students to submit quiz answers

// ----------------------------
// Export Router
// ----------------------------
export default router;
