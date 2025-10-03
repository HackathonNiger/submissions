const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  verifyUser, 
  logoutUser, 
  getCurrentUser, 
  refreshToken 
} = require('../controllers/authController');

const { protect, requireVerification } = require('../middlewares/authMiddleware');

const { 
  validateRegistration, 
  validateLogin, 
  validateVerification 
} = require('../middlewares/validation');

router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);
router.put('/verify', protect, validateVerification, verifyUser);
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getCurrentUser);
router.post('/refresh', protect, refreshToken);

router.get('/profile', protect, requireVerification, (req, res) => {
  res.json({
    success: true,
    message: 'Access granted to verified user profile',
    user: req.user
  });
});

module.exports = router;