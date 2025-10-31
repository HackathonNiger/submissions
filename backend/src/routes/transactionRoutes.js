// backend/src/routes/transactionRoutes.js - UPDATED

const express = require('express');
const router = express.Router();

const { protect, requireVerification } = require('../middlewares/authMiddleware');

const { 
  getTransactions,
  createContribution,
  getTransactionById,
  getTransactionStats
} = require('../controllers/transactionController');

const { sanitizeInput } = require('../middlewares/validation');

// Apply authentication to all routes
router.use(protect);

// Apply input sanitization
router.use(sanitizeInput);

// Transaction routes
router.get('/', getTransactions);
router.get('/stats', getTransactionStats);
router.post('/contribution', requireVerification, createContribution);
router.get('/:id', getTransactionById);

module.exports = router;