const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  // Core Fields
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true,
    index: true
  },

  totalBalance: {
    type: Number,
    required: [true, 'Total balance is required'],
    default: 0,
    min: [0, 'Balance cannot be negative']
  },

  availableBalance: {
    type: Number,
    required: [true, 'Available balance is required'],
    default: 0,
    min: [0, 'Available balance cannot be negative']
  },

  lockedBalance: {
    type: Number,
    required: [true, 'Locked balance is required'],
    default: 0,
    min: [0, 'Locked balance cannot be negative']
  },

  // Statistics
  totalPayouts: {
    type: Number,
    default: 0,
    min: [0, 'Total payouts cannot be negative']
  },

  totalContributions: {
    type: Number,
    default: 0,
    min: [0, 'Total contributions cannot be negative']
  },

  totalWithdrawals: {
    type: Number,
    default: 0,
    min: [0, 'Total withdrawals cannot be negative']
  },

  // Auto-Withdrawal Settings
  autoWithdrawal: {
    enabled: {
      type: Boolean,
      default: false
    },
    bankAccount: {
      type: String,
      trim: true
    },
    percentage: {
      type: Number,
      min: 10,
      max: 100,
      default: 100
    },
    minAmount: {
      type: Number,
      min: 100,
      default: 1000
    }
  },

  // Linked Bank Accounts
  linkedBankAccounts: [{
    accountNumber: {
      type: String,
      required: true,
      trim: true
    },
    accountName: {
      type: String,
      required: true,
      trim: true
    },
    bankName: {
      type: String,
      required: true,
      trim: true
    },
    bankCode: {
      type: String,
      trim: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    addedAt: {
      type: Date,
      default: Date.now
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

// Pre-save middleware
WalletSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Ensure totalBalance equals availableBalance + lockedBalance
  this.totalBalance = this.availableBalance + this.lockedBalance;
  
  next();
});

// Add funds to available balance
WalletSchema.methods.addFunds = function(amount) {
  if (amount <= 0) {
    throw new Error('Amount must be positive');
  }
  
  this.availableBalance += amount;
  return this.save();
};

// Deduct funds from available balance
WalletSchema.methods.deductFunds = function(amount) {
  if (amount <= 0) {
    throw new Error('Amount must be positive');
  }
  
  if (this.availableBalance < amount) {
    throw new Error('Insufficient balance');
  }
  
  this.availableBalance -= amount;
  return this.save();
};

// Lock funds (move from available to locked)
WalletSchema.methods.lockFunds = function(amount) {
  if (amount <= 0) {
    throw new Error('Amount must be positive');
  }
  
  if (this.availableBalance < amount) {
    throw new Error('Insufficient available balance');
  }
  
  this.availableBalance -= amount;
  this.lockedBalance += amount;
  return this.save();
};

// Unlock funds (move from locked to available)
WalletSchema.methods.unlockFunds = function(amount) {
  if (amount <= 0) {
    throw new Error('Amount must be positive');
  }
  
  if (this.lockedBalance < amount) {
    throw new Error('Insufficient locked balance');
  }
  
  this.lockedBalance -= amount;
  this.availableBalance += amount;
  return this.save();
};

// Record payout
WalletSchema.methods.recordPayout = function(amount) {
  this.totalPayouts += amount;
  return this.addFunds(amount);
};

// Record contribution
WalletSchema.methods.recordContribution = function(amount) {
  this.totalContributions += amount;
  return this.deductFunds(amount);
};

// Record withdrawal
WalletSchema.methods.recordWithdrawal = function(amount) {
  this.totalWithdrawals += amount;
  return this.deductFunds(amount);
};

// Add bank account
WalletSchema.methods.addBankAccount = function(accountDetails) {
  // If this is the first account or marked as primary, make it primary
  if (this.linkedBankAccounts.length === 0 || accountDetails.isPrimary) {
    // Remove primary flag from other accounts
    this.linkedBankAccounts.forEach(account => {
      account.isPrimary = false;
    });
    accountDetails.isPrimary = true;
  }
  
  this.linkedBankAccounts.push(accountDetails);
  return this.save();
};

// Get primary bank account
WalletSchema.methods.getPrimaryAccount = function() {
  return this.linkedBankAccounts.find(account => account.isPrimary);
};

module.exports = mongoose.model('Wallet', WalletSchema);