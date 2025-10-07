const router = require("express").Router();
const {  register, verifyCode, login } = require("../controller/userController");

// Register
router.post("/register", register);

// Email Verification
router.post("/verify", verifyCode);

// Login
router.post("/login", login);

module.exports = router;
