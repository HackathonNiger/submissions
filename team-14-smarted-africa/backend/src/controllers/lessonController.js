// backend/src/controllers/lessonController.js

// ----------------------------
// Import Services & Utilities
// ----------------------------
import * as lessonService from '../services/lessonService.js';
import { created, success, notFound } from '../utils/response.js';

// ----------------------------
// Create a New Lesson
// ----------------------------
export const createLesson = async (req, res, next) => {
  try {
    const data = await lessonService.createLesson(req.body);
    return created(res, { lesson: data }, 'Lesson created');
  } catch (err) {
    next(err);
  }
};

// ----------------------------
// Get Single Lesson by ID
// ----------------------------
export const getLesson = async (req, res, next) => {
  try {
    const lesson = await lessonService.getLessonById(req.params.id);
    if (!lesson) return notFound(res, 'Lesson not found');

    return success(res, { lesson }, 'Lesson fetched');
  } catch (err) {
    next(err);
  }
};

// ----------------------------
// List Lessons by Course ID
// ----------------------------
export const listLessons = async (req, res, next) => {
  try {
    const list = await lessonService.listLessonsByCourse(req.params.courseId);
    return success(res, { items: list }, 'Lessons listed');
  } catch (err) {
    next(err);
  }
};

// ----------------------------
// Update Lesson by ID
// ----------------------------
export const updateLesson = async (req, res, next) => {
  try {
    const updatedLesson = await lessonService.updateLesson(req.params.id, req.body);
    return success(res, { lesson: updatedLesson }, 'Lesson updated');
  } catch (err) {
    next(err);
  }
};

// ----------------------------
// Delete Lesson by ID
// ----------------------------
export const deleteLesson = async (req, res, next) => {
  try {
    await lessonService.deleteLesson(req.params.id);
    return success(res, null, 'Lesson deleted');
  } catch (err) {
    next(err);
  }
};
