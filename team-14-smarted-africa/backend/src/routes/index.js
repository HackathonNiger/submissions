// backend/src/routes/index.js

// ----------------------------
// Import Modules
// ----------------------------
import express from 'express';
import authRoutes from './authRoutes.js';
import courseRoutes from './courseRoutes.js';
import lessonRoutes from './lessonRoutes.js';
import quizRoutes from './quizRoutes.js';
import paymentRoutes from './paymentRoutes.js';

// ----------------------------
// Initialize Router
// ----------------------------
const router = express.Router();

// ----------------------------
// Health Check Route
// ----------------------------
router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// ----------------------------
// Mount Feature Routes
// ----------------------------
router.use('/auth', authRoutes);                     // Authentication routes
router.use('/courses', courseRoutes);               // Course routes
router.use('/courses/:courseId/lessons', lessonRoutes); // Lessons nested under courses
router.use('/quizzes', quizRoutes);                 // Quiz routes
router.use('/payments', paymentRoutes);             // Payment routes

// ----------------------------
// Export Router
// ----------------------------
export default router;
