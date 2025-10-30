// backend/src/services/lessonService.js

/**
 * Lesson Service
 * - Handles CRUD operations for Lessons
 * - Uses Mongoose models
 */

// ----------------------------
// Import Modules
// ----------------------------
import Lesson from '../models/Lesson.js';

// ----------------------------
// Create a new lesson
// payload: { title, content, course, order }
// ----------------------------
export const createLesson = async (payload) => {
  return Lesson.create(payload);
};

// ----------------------------
// Get a lesson by ID
// Populates the 'course' reference
// ----------------------------
export const getLessonById = async (id) => {
  return Lesson.findById(id).populate('course');
};

// ----------------------------
// List all lessons for a specific course
// Sorted by 'order' field ascending
// ----------------------------
export const listLessonsByCourse = async (courseId) => {
  return Lesson.find({ course: courseId }).sort({ order: 1 });
};

// ----------------------------
// Update a lesson by ID
// Returns the updated lesson
// ----------------------------
export const updateLesson = async (id, payload) => {
  return Lesson.findByIdAndUpdate(id, payload, { new: true });
};

// ----------------------------
// Delete a lesson by ID
// ----------------------------
export const deleteLesson = async (id) => {
  return Lesson.findByIdAndDelete(id);
};
