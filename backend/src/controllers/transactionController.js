// backend/src/controllers/transactionController.js - UPDATED

const Transaction = require('../models/Transactions');
const Wallet = require('../models/Wallets');
const Group = require('../models/Groups');
const { asyncErrorHandler, ValidationError, NotFoundError } = require('../middlewares/errorHandler');

/**
 * Get Transactions Handler
 * 
 * @route   GET /api/transactions
 * @desc    Get user's transactions with optional filters
 * @access  Private
 */
const getTransactions = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;
  const { type, groupId, status, limit = 50, skip = 0 } = req.query;

  console.log(`📊 Getting transactions for user: ${userId}`);

  try {
    // Build query
    const query = { userId };
    
    if (type) query.type = type;
    if (groupId) query.groupId = groupId;
    if (status) query.status = status;

    // Fetch transactions
    const transactions = await Transaction.find(query)
      .populate('groupId', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Transaction.countDocuments(query);

    console.log(`✅ Found ${transactions.length} transactions`);

    res.status(200).json({
      success: true,
      message: 'Transactions retrieved successfully',
      data: {
        transactions,
        count: transactions.length,
        total,
        hasMore: total > (parseInt(skip) + transactions.length)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`❌ Failed to get transactions:`, error.message);
    throw error;
  }
});

/**
 * Create Contribution Transaction Handler
 * 
 * @route   POST /api/transactions/contribution
 * @desc    Process a contribution payment (after Paystack verification)
 * @access  Private
 */
const createContribution = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;
  const { groupId, reference, amount } = req.body;

  console.log(`💰 Processing contribution:`, { userId, groupId, amount, reference });

  try {
    // 1. Verify group exists and user is a member
    const group = await Group.findById(groupId);
    if (!group) {
      throw new NotFoundError('Group not found');
    }

    if (!group.members.includes(userId)) {
      throw new ValidationError('You are not a member of this group');
    }

    // 2. Verify amount matches group contribution
    if (amount !== group.contributionAmount) {
      throw new ValidationError('Amount does not match group contribution amount');
    }

    // 3. Check for duplicate transaction (same reference)
    const existingTxn = await Transaction.findOne({ 
      'metadata.paystack_reference': reference 
    });
    
    if (existingTxn) {
      console.warn('⚠️ Duplicate transaction detected:', reference);
      return res.status(200).json({
        success: true,
        message: 'Transaction already processed',
        data: {
          transaction: existingTxn
        }
      });
    }

    // 4. Get user's wallet
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      console.log('💰 Creating wallet for user:', userId);
      wallet = new Wallet({
        userId,
        totalBalance: 0,
        availableBalance: 0,
        lockedBalance: 0
      });
      await wallet.save();
    }

    // 5. Generate unique transaction ID
    const transactionId = Transaction.generateTransactionId();

    // 6. Create transaction record
    const transaction = new Transaction({
      userId,
      groupId,
      transactionId,
      type: 'contribution',
      amount,
      status: 'completed',
      description: `Contribution to ${group.name}`,
      paymentMethod: 'card',
      metadata: {
        paystack_reference: reference,
        group_name: group.name,
        frequency: group.frequency
      },
      completedAt: new Date()
    });

    await transaction.save();
    console.log('✅ Transaction created:', transactionId);

    // 7. Update wallet
    wallet.totalContributions += amount;
    await wallet.save();
    console.log('✅ Wallet updated - Total contributions:', wallet.totalContributions);

    // 8. Update group pool
    group.totalPool += amount;
    
    // 9. Update member's contribution count in membersList
    const memberIndex = group.membersList.findIndex(
      m => m.userId.toString() === userId.toString()
    );
    
    if (memberIndex !== -1) {
      group.membersList[memberIndex].contributionsMade += 1;
      console.log(`✅ Member contribution count updated: ${group.membersList[memberIndex].contributionsMade}`);
    }

    await group.save();
    console.log('✅ Group updated - Total pool:', group.totalPool);

    // 10. Return success response
    res.status(201).json({
      success: true,
      message: 'Contribution processed successfully',
      data: {
        transaction,
        wallet: {
          totalContributions: wallet.totalContributions,
          availableBalance: wallet.availableBalance
        },
        group: {
          totalPool: group.totalPool,
          name: group.name
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Contribution processing failed:`, error.message);
    throw error;
  }
});

/**
 * Get Transaction by ID Handler
 * 
 * @route   GET /api/transactions/:id
 * @desc    Get a specific transaction by ID
 * @access  Private
 */
const getTransactionById = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;
  const transactionId = req.params.id;

  console.log(`🔍 Getting transaction ${transactionId} for user: ${userId}`);

  try {
    const transaction = await Transaction.findById(transactionId)
      .populate('groupId', 'name contributionAmount frequency')
      .populate('userId', 'firstName lastName email');

    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    // Verify user owns this transaction
    if (transaction.userId._id.toString() !== userId.toString()) {
      throw new ValidationError('Access denied to this transaction');
    }

    console.log('✅ Transaction found:', transaction.transactionId);

    res.status(200).json({
      success: true,
      message: 'Transaction retrieved successfully',
      data: {
        transaction
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Failed to get transaction:`, error.message);
    throw error;
  }
});

/**
 * Get Transaction Statistics Handler
 * 
 * @route   GET /api/transactions/stats
 * @desc    Get user's transaction statistics
 * @access  Private
 */
const getTransactionStats = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;

  console.log(`📊 Getting transaction stats for user: ${userId}`);

  try {
    // Aggregate statistics
    const stats = await Transaction.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Format stats
    const formattedStats = {
      contributions: {
        total: 0,
        count: 0
      },
      payouts: {
        total: 0,
        count: 0
      },
      withdrawals: {
        total: 0,
        count: 0
      }
    };

    stats.forEach(stat => {
      if (stat._id === 'contribution') {
        formattedStats.contributions = {
          total: stat.total,
          count: stat.count
        };
      } else if (stat._id === 'payout') {
        formattedStats.payouts = {
          total: stat.total,
          count: stat.count
        };
      } else if (stat._id === 'withdrawal') {
        formattedStats.withdrawals = {
          total: stat.total,
          count: stat.count
        };
      }
    });

    console.log('✅ Transaction stats calculated');

    res.status(200).json({
      success: true,
      message: 'Transaction statistics retrieved successfully',
      data: {
        stats: formattedStats
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Failed to get transaction stats:`, error.message);
    throw error;
  }
});

// Export all controller functions
module.exports = {
  getTransactions,
  createContribution,
  getTransactionById,
  getTransactionStats
};