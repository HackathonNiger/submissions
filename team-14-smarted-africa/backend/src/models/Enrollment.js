// backend/src/models/Enrollment.js

// ----------------------------
// Import Modules
// ----------------------------
import mongoose from 'mongoose';

// ----------------------------
// Define Enrollment Schema
// ----------------------------
const EnrollmentSchema = new mongoose.Schema(
  {
    student: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    }, // Reference to the student
    course: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Course', 
      required: true 
    }, // Reference to the course
    status: { 
      type: String, 
      enum: ['pending', 'paid', 'active', 'cancelled'], 
      default: 'pending' 
    }, // Enrollment status
    amount: { 
      type: Number, 
      required: true, 
      default: 0 
    }, // Paid amount
    currency: { type: String, default: 'USD' }, // Currency code
    provider: { type: String },                  // Payment provider name
    providerPaymentId: { type: String }          // Payment transaction ID from provider
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

// ----------------------------
// Export Model
// ----------------------------
export default mongoose.model('Enrollment', EnrollmentSchema);
