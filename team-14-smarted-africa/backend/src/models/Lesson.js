// backend/src/models/Lesson.js

// ----------------------------
// Import Modules
// ----------------------------
import mongoose from 'mongoose';

// ----------------------------
// Define Lesson Schema
// ----------------------------
const LessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },               // Lesson title (required)
    content: { type: String, default: '' },               // Lesson content, optional
    course: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Course', 
      required: true 
    }, // Reference to the parent course
    order: { type: Number, default: 0 }                   // Order of the lesson within course
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

// ----------------------------
// Export Model
// ----------------------------
export default mongoose.model('Lesson', LessonSchema);
