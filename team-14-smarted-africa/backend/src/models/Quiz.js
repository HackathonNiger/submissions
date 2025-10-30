// backend/src/models/Quiz.js

// ----------------------------
// Import Modules
// ----------------------------
import mongoose from 'mongoose';

// ----------------------------
// Define Question Sub-Schema
// ----------------------------
const QuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },  // Question text
    options: { type: [String], required: true }, // Array of answer options
    correctIndex: { type: Number, required: true } // Index of correct option
  },
  { _id: false } // Prevent automatic _id for subdocuments
);

// ----------------------------
// Define Quiz Schema
// ----------------------------
const QuizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Quiz title
    lesson: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Lesson', 
      required: true 
    }, // Reference to the lesson this quiz belongs to
    questions: { type: [QuestionSchema], default: [] } // Array of questions
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

// ----------------------------
// Export Model
// ----------------------------
export default mongoose.model('Quiz', QuizSchema);
