const express = require('express');
const router = express.Router();

const { protect, requireVerification } = require('../middlewares/authMiddleware');

const { 
  getTransactions, 
  createTransaction, 
  getTransactionById 
} = require('../controllers/transactionController');

const { sanitizeInput } = require('../middlewares/validation');

router.use(protect);

router.use(sanitizeInput);
router.get('/', getTransactions);
router.post('/', requireVerification, createTransaction);
router.get('/:id', getTransactionById);

module.exports = router;