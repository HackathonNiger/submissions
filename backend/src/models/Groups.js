const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true,
    minlength: [2, 'Group name must be at least 2 characters'],
    maxlength: [100, 'Group name cannot exceed 100 characters']
  },

  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },

  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Group admin is required'],
    index: true
  },

  maxMembers: {
    type: Number,
    required: [true, 'Maximum members is required'],
    min: [2, 'Minimum 2 members required'],
    max: [50, 'Maximum 50 members allowed']
  },

  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  invitationCode: {
    type: String,
    required: [true, 'Invitation code is required'],
    unique: true,
    uppercase: true,
    minlength: 6,
    maxlength: 6
  },

  // Contribution Settings
  contributionAmount: {
    type: Number,
    required: [true, 'Contribution amount is required'],
    min: [100, 'Minimum contribution is ₦100']
  },

  frequency: {
    type: String,
    required: [true, 'Contribution frequency is required'],
    enum: {
      values: ['Weekly', 'Bi-Weekly', 'Monthly'],
      message: 'Frequency must be Weekly, Bi-Weekly, or Monthly'
    }
  },

  payoutOrder: {
    type: String,
    required: [true, 'Payout order is required'],
    enum: {
      values: ['random', 'firstCome', 'bidding'],
      message: 'Payout order must be random, firstCome, or bidding'
    }
  },

  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Minimum duration is 1 month'],
    max: [24, 'Maximum duration is 24 months']
  },

  // Status and Progress
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending',
    index: true
  },

  currentTurn: {
    type: Number,
    default: 0,
    min: 0
  },

  totalPool: {
    type: Number,
    default: 0,
    min: 0
  },

  credibilityScore: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  },

  // Dates
  startDate: {
    type: Date,
    default: Date.now
  },

  nextContribution: {
    type: Date,
    index: true
  },

  nextPayout: {
    type: Date
  },

  // Member Details
  membersList: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    joinDate: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['Admin', 'Member'],
      required: true
    },
    status: {
      type: String,
      enum: ['completed', 'current', 'pending', 'missed'],
      default: 'pending'
    },
    turns: {
      type: Number,
      default: 0,
      min: 0
    },
    contributionsMade: {
      type: Number,
      default: 0,
      min: 0
    },
    missedContributions: {
      type: Number,
      default: 0,
      min: 0
    }
  }],

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
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

// Indexes
GroupSchema.index({ admin: 1, status: 1 });
GroupSchema.index({ members: 1 });

// Pre-save middleware to update updatedAt
GroupSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate unique invitation code
GroupSchema.statics.generateInvitationCode = async function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  let isUnique = false;
  
  while (!isUnique) {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    const existing = await this.findOne({ invitationCode: code });
    if (!existing) {
      isUnique = true;
    }
  }
  
  return code;
};

// Calculate next contribution date
GroupSchema.methods.calculateNextContribution = function() {
  const now = new Date();
  
  switch (this.frequency) {
    case 'Weekly':
      return new Date(now.setDate(now.getDate() + 7));
    case 'Bi-Weekly':
      return new Date(now.setDate(now.getDate() + 14));
    case 'Monthly':
      return new Date(now.setMonth(now.getMonth() + 1));
    default:
      return new Date(now.setMonth(now.getMonth() + 1));
  }
};

// Check if group is full
GroupSchema.methods.isFull = function() {
  return this.members.length >= this.maxMembers;
};

// Add member to group
GroupSchema.methods.addMember = async function(userId, userName) {
  if (this.isFull()) {
    throw new Error('Group is full');
  }
  
  // Check if user is already a member
  if (this.members.includes(userId)) {
    throw new Error('User is already a member of this group');
  }
  
  this.members.push(userId);
  this.membersList.push({
    userId,
    name: userName,
    joinDate: new Date(),
    role: 'Member',
    status: 'pending',
    turns: 0,
    contributionsMade: 0,
    missedContributions: 0
  });
  
  return this.save();
};

module.exports = mongoose.model('Group', GroupSchema);