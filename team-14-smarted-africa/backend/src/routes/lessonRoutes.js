// backend/src/routes/lessonRoutes.js

// ----------------------------
// Import Modules
// ----------------------------
import express from 'express';
import * as ctrl from '../controllers/lessonController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authorize.js';

// ----------------------------
// Initialize Router with mergeParams
// ----------------------------
// mergeParams allows access to params from parent router (e.g., courseId)
const router = express.Router({ mergeParams: true });

// ----------------------------
// Lesson Routes
// ----------------------------
router.get('/', ctrl.listLessons);  // List all lessons for a course
router.post('/', protect, authorize('teacher','admin'), ctrl.createLesson); // Create a new lesson
router.get('/:id', ctrl.getLesson); // Get a single lesson by ID
router.put('/:id', protect, authorize('teacher','admin'), ctrl.updateLesson); // Update lesson by ID
router.delete('/:id', protect, authorize('teacher','admin'), ctrl.deleteLesson); // Delete lesson by ID

// ----------------------------
// Export Router
// ----------------------------
export default router;
