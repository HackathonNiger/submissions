const express = require('express');
const router = express.Router();

const {
  createGroup,
  getUserGroups,
  getGroupById,
  findGroupByCode,
  joinGroup,
  updateGroupStatus,
  getGroupStats
} = require('../controllers/groupContoller');

const { protect, requireVerification } = require('../middlewares/authMiddleware');
const { sanitizeInput } = require('../middlewares/validation');

// Apply authentication to all routes
router.use(protect);
router.use(sanitizeInput);

// Group CRUD operations
router.post('/', requireVerification, createGroup);
router.get('/', getUserGroups);
router.get('/:id', getGroupById);
router.get('/:id/stats', getGroupStats);

// Group joining
router.get('/find/:code', findGroupByCode);
router.post('/:id/join', requireVerification, joinGroup);

// Group management (admin only)
router.put('/:id/status', requireVerification, updateGroupStatus);

module.exports = router;