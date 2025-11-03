import express from "express";
import {
  loginUser,
  signUp,
  logoutUser,
  requestPasswordReset,
  verifyOTPAndResetPassword,
} from "../controllers/authController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", signUp);
router.post("/login", loginUser);
router.post("/logout", protectRoute, logoutUser);
router.post("/reset", requestPasswordReset);
router.post("/verify", verifyOTPAndResetPassword);

export default router;
