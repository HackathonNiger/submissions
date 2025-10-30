// backend/src/routes/course.js

// ----------------------------
// Import Modules
// ----------------------------
import express from 'express';
import * as ctrl from '../controllers/courseController.js'; // Import all course controller functions
import { protect } from '../middleware/authMiddleware.js';   // Protect routes (JWT)
import { authorize } from '../middleware/authorize.js';       // Role-based access control
import { upload } from '../config/multer.js';                // File upload middleware

// ----------------------------
// Initialize Router
// ----------------------------
const router = express.Router();

// ----------------------------
// Course Routes
// ----------------------------

// List all courses
router.get('/', ctrl.listCourses);

// Get single course by ID
router.get('/:id', ctrl.getCourse);

// Create a new course (requires authentication and role)
router.post(
  '/',
  protect,                                // Verify JWT
  authorize('teacher', 'admin'),          // Only teachers or admins can create
  upload.single('image'),                 // Handle single image upload
  ctrl.createCourse
);

// Update an existing course (requires authentication and role)
router.put(
  '/:id',
  protect,
  authorize('teacher', 'admin'),
  upload.single('image'),
  ctrl.updateCourse
);

// Delete a course (requires authentication and role)
router.delete(
  '/:id',
  protect,
  authorize('teacher', 'admin'),
  ctrl.deleteCourse
);

// ----------------------------
// Export Router
// ----------------------------
export default router;
