import User from "../models/user.js";
import { decodeToken } from "../utils/jwt.js";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  // Get the auth header from the request user is sending
  const authHeader = req.headers["authorization"];

  let token;
  if (authHeader) {
    token = authHeader.split(" ")[1];
    // console.log(token);
  }

  if (!token) {
    return res.status(401).json({ error: "No token Provided" });
  }

  try {
    const decodedUser = decodeToken(token);
    req.user = decodedUser;
    return next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function protectRoute(req, res, next) {
  try {
    const token =
      req.cookies?.token || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: You must be logged in to access this route",
        success: false,
      });
    }

    let decoded;
    try {
      decoded = decodeToken(token);
    } catch (err) {
      return res
        .status(401)
        .json({
          message: "Token expired, please log in again",
          success: false,
        });
    }

    // decoded.userId (since we fixed generateToken)
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found", success: false });
    }

    req.user = user; // attach user object
    next();
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
}

export { authMiddleware };
