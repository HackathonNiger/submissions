// backend/src/services/courseService.js

// ----------------------------
// Import Modules
// ----------------------------
import Course from '../models/Course.js';

// ----------------------------
// Create a new course
// ----------------------------
export const createCourse = async (payload) => {
  return Course.create(payload);
};

// ----------------------------
// Get a course by ID (with author info)
// ----------------------------
export const getCourseById = async (id) => {
  return Course.findById(id).populate('author', 'name email role');
};

// ----------------------------
// List courses with optional filtering and pagination
// ----------------------------
export const listCourses = async (q) => {
  const page = Math.max(1, q.page || 1);
  const limit = Math.max(1, q.limit || 10);
  const skip = (page - 1) * limit;

  // Apply filters if provided
  const filter = {};
  if (q.level) filter.level = q.level;
  if (q.language) filter.language = q.language;

  // Fetch courses and total count in parallel
  const [items, total] = await Promise.all([
    Course.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Course.countDocuments(filter)
  ]);

  return { items, total, page, limit };
};

// ----------------------------
// Update course by ID
// ----------------------------
export const updateCourse = async (id, payload) => {
  return Course.findByIdAndUpdate(id, payload, { new: true }).populate('author', 'name email role');
};

// ----------------------------
// Delete course by ID
// ----------------------------
export const deleteCourse = async (id) => {
  return Course.findByIdAndDelete(id);
};
