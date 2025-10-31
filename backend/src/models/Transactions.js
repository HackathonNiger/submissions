// src/models/Transactions.js

const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  // Core Fields
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },

  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: [true, 'Group ID is required'],
    index: true
  },

  transactionId: {
    type: String,
    required: [true, 'Transaction ID is required'],
    unique: true,
    uppercase: true
  },

  type: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: {
      values: ['contribution', 'payout', 'withdrawal'],
      message: 'Type must be contribution, payout, or withdrawal'
    },
    index: true
  },

  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },

  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['pending', 'completed', 'failed', 'cancelled'],
      message: 'Status must be pending, completed, failed, or cancelled'
    },
    default: 'pending',
    index: true
  },

  // Details
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },

  vendor: {
    type: String,
    trim: true
  },

  paymentMethod: {
    type: String,
    enum: ['card', 'bank_transfer', 'wallet'],
    default: 'card'
  },

  paymentDetails: {
    cardLastFour: {
      type: String,
      maxlength: 4
    },
    cardType: {
      type: String
    },
    processorReference: {
      type: String
    },
    bankName: {
      type: String
    }
  },

  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },

  completedAt: {
    type: Date
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Compound Indexes
TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ groupId: 1, createdAt: -1 });
TransactionSchema.index({ userId: 1, status: 1 });

// Pre-save middleware
TransactionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate unique transaction ID
TransactionSchema.statics.generateTransactionId = function() {
  const prefix = 'TXN';
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${timestamp}${random}`;
};

// Mark transaction as completed
TransactionSchema.methods.markCompleted = function() {
  this.status = 'completed';
  this.completedAt = new Date();
  return this.save();
};

// Mark transaction as failed
TransactionSchema.methods.markFailed = function() {
  this.status = 'failed';
  return this.save();
};

module.exports = mongoose.model('Transaction', TransactionSchema);