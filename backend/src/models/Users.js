const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({

  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [
      /^(\+234|234|0)[789][01]\d{8}$/,
      'Please provide a valid Nigerian phone number'
    ]
  },
  
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(value) {
        // User must be at least 18 years old
        const today = new Date();
        const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        return value <= eighteenYearsAgo;
      },
      message: 'You must be at least 18 years old to register'
    }
  },
  
  address: {
    type: String,
    trim: true,
    minlength: [10, 'Address must be at least 10 characters'],
    maxlength: [200, 'Address cannot exceed 200 characters']
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Exclude from queries by default for security
  },
  
  bvn: {
    type: String,
    required: [true, 'BVN is required'],
    unique: true,
    match: [/^\d{11}$/, 'BVN must be exactly 11 digits'],
    select: false // Exclude from queries by default for security
  },
  
  nin: {
    type: String,
    required: [true, 'NIN is required'],
    unique: true,
    match: [/^\d{11}$/, 'NIN must be exactly 11 digits'],
    select: false // Exclude from queries by default for security
  },
  
  isVerified: {
    type: Boolean,
    default: false,
    index: true // Index for faster queries
  },
  
  verifiedAt: {
    type: Date,
    default: null
  },
  
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  emailVerifiedAt: {
    type: Date,
    default: null
  },
  
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  
  phoneVerifiedAt: {
    type: Date,
    default: null
  },
  
  // Account status flags
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  
  isDeactivated: {
    type: Boolean,
    default: false
  },
  
  isSuspended: {
    type: Boolean,
    default: false
  },
  
  suspendedAt: {
    type: Date,
    default: null
  },
  
  suspensionReason: {
    type: String,
    trim: true
  },

  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  
  twoFactorSecret: {
    type: String,
    select: false // Never include in queries
  },
  
  twoFactorBackupCodes: [{
    code: {
      type: String,
      select: false
    },
    used: {
      type: Boolean,
      default: false
    },
    usedAt: {
      type: Date,
      default: null
    }
  }],
  
  preferences: {
    language: {
      type: String,
      enum: ['en', 'ig', 'yo', 'ha'],
      default: 'en'
    },
    currency: {
      type: String,
      enum: ['NGN', 'USD'],
      default: 'NGN'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      marketing: {
        type: Boolean,
        default: false
      }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'friends'
      },
      allowFriendRequests: {
        type: Boolean,
        default: true
      }
    }
  },
  
  lastLoginAt: {
    type: Date,
    default: null
  },
  
  lastLogoutAt: {
    type: Date,
    default: null
  },
  
  loginAttempts: {
    type: Number,
    default: 0
  },
  
  lockUntil: {
    type: Date,
    default: null
  },
  
  passwordChangedAt: {
    type: Date,
    default: Date.now
  },
  
  passwordResetToken: {
    type: String,
    select: false
  },
  
  passwordResetExpires: {
    type: Date,
    select: false
  },
  
  emailVerificationToken: {
    type: String,
    select: false
  },
  
  emailVerificationExpires: {
    type: Date,
    select: false
  },
  
  financialProfile: {
    monthlyIncome: {
      type: Number,
      min: 0
    },
    occupation: {
      type: String,
      trim: true,
      maxlength: [100, 'Occupation cannot exceed 100 characters']
    },
    employer: {
      type: String,
      trim: true,
      maxlength: [100, 'Employer name cannot exceed 100 characters']
    },
    riskTolerance: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  },
  
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user',
    index: true
  },
  
  registrationSource: {
    type: String,
    enum: ['web', 'mobile', 'api'],
    default: 'web'
  },
  
  ipAddress: {
    type: String,
    trim: true
  },
  
  userAgent: {
    type: String,
    trim: true
  },
  
  referralCode: {
    type: String,
    unique: true,
    sparse: true // Allow multiple null values
  },
  
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

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
  // Schema options
  timestamps: true, // Automatically manage createdAt and updatedAt
  
  // Transform JSON output to remove sensitive fields
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.bvn;
      delete ret.nin;
      delete ret.twoFactorSecret;
      delete ret.passwordResetToken;
      delete ret.emailVerificationToken;
      delete ret.__v;
      return ret;
    }
  },
  
  // Transform Object output to remove sensitive fields
  toObject: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.bvn;
      delete ret.nin;
      delete ret.twoFactorSecret;
      delete ret.passwordResetToken;
      delete ret.emailVerificationToken;
      delete ret.__v;
      return ret;
    }
  }
});

UserSchema.index({ email: 1, isActive: 1 });
UserSchema.index({ phoneNumber: 1, isActive: 1 });
UserSchema.index({ isVerified: 1, isActive: 1 });
UserSchema.index({ createdAt: -1 });

// Unique indexes with partial filter (ignore null values)
UserSchema.index({ referralCode: 1 }, { unique: true, sparse: true });


UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.virtual('accountAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // Days
});

UserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

/**
 * Pre-save middleware to hash password
 * 
 * Automatically hashes the password before saving to database
 * Only runs when password is modified to avoid unnecessary hashing
 */
UserSchema.pre('save', async function(next) {
  // Only hash password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(12); // Higher salt rounds for better security
    this.password = await bcrypt.hash(this.password, salt);
    
    // Update password changed timestamp
    this.passwordChangedAt = Date.now();
    
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Pre-save middleware to generate referral code
 * 
 * Automatically generates a unique referral code for new users
 */
UserSchema.pre('save', async function(next) {
  // Only generate referral code for new users who don't have one
  if (this.isNew && !this.referralCode) {
    try {
      let referralCode;
      let isUnique = false;
      
      // Generate unique referral code
      while (!isUnique) {
        referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const existing = await this.constructor.findOne({ referralCode });
        if (!existing) {
          isUnique = true;
        }
      }
      
      this.referralCode = referralCode;
    } catch (error) {
      console.error('Error generating referral code:', error);
      // Don't fail the save operation for referral code generation
    }
  }
  
  next();
});

/**
 * Pre-save middleware to update the updatedAt timestamp
 */
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

/**
 * Compare entered password with hashed password in database
 * 
 * @param {string} enteredPassword - Plain text password to compare
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 */
UserSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

/**
 * Check if password was changed after JWT token was issued
 * 
 * @param {number} JWTTimestamp - Timestamp when JWT was issued
 * @returns {boolean} True if password was changed after token issue
 */
UserSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

UserSchema.methods.createPasswordResetToken = function() {
  const resetToken = require('crypto').randomBytes(32).toString('hex');
  
  // Hash and store the token
  this.passwordResetToken = require('crypto')
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Token expires in 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
  return resetToken; // Return unhashed token to send via email
};

/**
 * Generate email verification token
 * 
 * @returns {string} Email verification token
 */
UserSchema.methods.createEmailVerificationToken = function() {
  const verificationToken = require('crypto').randomBytes(32).toString('hex');
  
  // Hash and store the token
  this.emailVerificationToken = require('crypto')
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  
  // Token expires in 24 hours
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  
  return verificationToken; // Return unhashed token to send via email
};

/**
 * Increment failed login attempts and lock account if necessary
 */
UserSchema.methods.incLoginAttempts = async function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // If we hit max attempts and it's not locked already, lock the account
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // Lock for 2 hours
  }
  
  return this.updateOne(updates);
};

/**
 * Reset login attempts (called on successful login)
 */
UserSchema.methods.resetLoginAttempts = async function() {
  return this.updateOne({
    $unset: {
      loginAttempts: 1,
      lockUntil: 1
    }
  });
};

/**
 * Find user by email or phone number
 * 
 * @param {string} identifier - Email or phone number
 * @returns {Promise<Object|null>} User document or null
 */
UserSchema.statics.findByIdentifier = function(identifier) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { phoneNumber: identifier }
    ],
    isActive: true
  });
};

/**
 * Get users by verification status
 * 
 * @param {boolean} isVerified - Verification status
 * @returns {Promise<Array>} Array of user documents
 */
UserSchema.statics.getByVerificationStatus = function(isVerified = true) {
  return this.find({ 
    isVerified, 
    isActive: true 
  }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('User', UserSchema);