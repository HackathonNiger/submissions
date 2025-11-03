import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function generateToken(payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });
  return token;
}

export function decodeToken(token) {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  return decodedToken;
}
