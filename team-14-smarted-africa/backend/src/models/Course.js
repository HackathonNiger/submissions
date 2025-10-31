// backend/src/models/Course.js

// ----------------------------
// Import Modules
// ----------------------------
import mongoose from 'mongoose';

// ----------------------------
// Define Course Schema
// ----------------------------
const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },                  // Course title (required)
    description: { type: String, default: '' },              // Optional description
    level: {                                                  
      type: String, 
      enum: ['beginner', 'intermediate', 'advanced'],        // Allowed levels
      default: 'beginner'
    },
    language: { type: String, default: 'en' },               // Language code, default English
    image: { type: String },                                  // Optional course image URL
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to User
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

// ----------------------------
// Export Model
// ----------------------------
export default mongoose.model('Course', CourseSchema);
