const Transaction = require('../models/Transactions');
const Wallet = require('../models/Wallets');
const Group = require('../models/Groups');
// NOTE: You must have axios installed (npm install axios)
const axios = require('axios'); 
const { asyncErrorHandler, ValidationError, NotFoundError } = require('../middlewares/errorHandler');

/**
 * Get Transactions Handler
 * * @route   GET /api/transactions
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
 * * @route   POST /api/transactions/contribution
 * @desc    Process a contribution payment (after Paystack verification)
 * @access  Private
 */
const createContribution = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;
  const { groupId, reference, amount } = req.body;

  console.log(`💰 Processing contribution:`, { userId, groupId, amount, reference });

  // 1. Check for Paystack Secret Key
  if (!process.env.PAYSTACK_SECRET_KEY) {
      console.error('❌ PAYSTACK_SECRET_KEY environment variable is not set!');
      throw new Error('Configuration Error: Payment verification key missing.');
  }

  try {
    // 2. Verify group exists and user is a member
    const group = await Group.findById(groupId);
    if (!group) {
      throw new NotFoundError('Group not found');
    }

    if (!group.members.includes(userId)) {
      throw new ValidationError('You are not a member of this group');
    }

    // 3. Check for duplicate transaction (MUST be done BEFORE contacting Paystack)
    const existingTxn = await Transaction.findOne({ 
      'metadata.paystack_reference': reference 
    });
    
    if (existingTxn) {
      console.warn('⚠️ Duplicate transaction detected:', reference);
      
      // FIX: Ensure the response structure matches the successful one 
      // by fetching the related wallet and group data.
      const wallet = await Wallet.findOne({ userId });
      
      // Return success if transaction was already processed
      return res.status(200).json({
        success: true,
        message: 'Transaction already processed',
        data: {
          transaction: existingTxn,
          wallet: {
            totalContributions: wallet ? wallet.totalContributions : 0, 
            availableBalance: wallet ? wallet.availableBalance : 0
          },
          group: {
            totalPool: group.totalPool,
            name: group.name
          }
        }
      });
    }

    // 4. *** CRITICAL STEP: VERIFY TRANSACTION WITH PAYSTACK ***
    const paystackResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const verificationData = paystackResponse.data.data;
    console.log(`📡 Paystack Status: ${verificationData.status} | Gateway Response: ${verificationData.gateway_response}`);

    // 5. Paystack Verification and Security Checks
    if (paystackResponse.data.status !== true || verificationData.status !== 'success') {
      throw new ValidationError(`Payment failed verification. Status: ${verificationData.status}`);
    }

    // 6. Security Check: Amount Mismatch (Naira vs Kobo)
    // Paystack returns amount in kobo. Frontend sends amount in Naira.
    const expectedAmountInKobo = group.contributionAmount * 100;
    
    if (verificationData.amount !== expectedAmountInKobo) {
      console.error(`❌ Amount Mismatch! Expected: ${expectedAmountInKobo} Kobo, Actual: ${verificationData.amount} Kobo`);
      throw new ValidationError('Amount paid does not match required group contribution.');
    }

    // --- If we reach this point, the payment is verified, successful, and the amount is correct ---

    // 7. Get user's wallet
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      console.log('💰 Creating wallet for user:', userId);
      wallet = new Wallet({
        userId,
        totalBalance: 0,
        availableBalance: 0,
        lockedBalance: 0,
        // FIX: Ensure totalContributions is initialized for new users
        totalContributions: 0 
      });
      await wallet.save();
    }

    // 8. Generate unique transaction ID
    const transactionId = Transaction.generateTransactionId();

    // 9. Create transaction record
    const transaction = new Transaction({
      userId,
      groupId,
      transactionId,
      type: 'contribution',
      // IMPORTANT: Use the verified amount from Paystack if necessary, 
      // but here we use the `amount` from the request as it was verified.
      amount, 
      status: 'completed',
      description: `Contribution to ${group.name}`,
      paymentMethod: verificationData.channel || 'card',
      metadata: {
        paystack_reference: reference,
        paystack_channel: verificationData.channel,
        group_name: group.name,
        frequency: group.frequency
      },
      completedAt: new Date()
    });

    await transaction.save();
    console.log('✅ Transaction created:', transactionId);

    // 10. Update wallet (This step previously crashed if `totalContributions` was undefined)
    wallet.totalContributions += amount;
    await wallet.save();
    console.log('✅ Wallet updated - Total contributions:', wallet.totalContributions);

    // 11. Update group pool
    group.totalPool += amount;
    
    // 12. Update member's contribution count in membersList
    const memberIndex = group.membersList.findIndex(
      m => m.userId.toString() === userId.toString()
    );
    
    if (memberIndex !== -1) {
      group.membersList[memberIndex].contributionsMade += 1;
      console.log(`✅ Member contribution count updated: ${group.membersList[memberIndex].contributionsMade}`);
    }

    await group.save();
    console.log('✅ Group updated - Total pool:', group.totalPool);

    // 13. Return success response
    res.status(201).json({
      success: true,
      message: 'Contribution processed successfully',
      data: {
        transaction,
        wallet: {
          // Send back the fields the frontend expects
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
    // If the error is an Axios error (from Paystack API call)
    if (axios.isAxiosError(error) && error.response && error.response.data) {
        console.error(`❌ Paystack Verification Error:`, error.response.data);
        // Throw a specific error for the frontend to catch
        throw new ValidationError('Failed to verify payment with Paystack API. Check logs for details.');
    }
    
    // For all other errors (DB, business logic, etc.)
    console.error(`❌ Contribution processing failed:`, error.message);
    // Let the asyncErrorHandler handle the error translation
    throw error;
  }
});

/**
 * Get Transaction by ID Handler
 * * @route   GET /api/transactions/:id
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
 * * @route   GET /api/transactions/stats
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
