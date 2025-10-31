// @ts-nocheck
// src/config/db.js
// ----------------------------
// MongoDB Connection Setup
// ----------------------------

import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Use the same variable name as in .env (DB_URI)
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/smarted_dev";

// ----------------------------
// Connect to MongoDB
// ----------------------------
const connectDB = async (retries = 5, delay = 5000) => {
  try {

    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env file")
    }

    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Stop trying after 5s
    });

    console.log(
      `MongoDB connected: ${conn.connection.host}/${conn.connection.name}`
    );
  } catch (error) {
    console.error("MongoDB connection error:", error.message);

    if (retries > 0) {
      console.log(`Retrying to connect in ${delay / 1000}s... (${retries} left)`);
      setTimeout(() => connectDB(retries - 1, delay), delay);
    } else {
      console.error("Could not connect to MongoDB after multiple attempts.");
      process.exit(1);
    }
  }
};

// ----------------------------
// Graceful Shutdown
// ----------------------------
const gracefulShutdown = async (signal) => {
  try {
    await mongoose.connection.close();
    console.log(`MongoDB connection closed due to app termination (${signal})`);
    process.exit(0);
  } catch (err) {
    console.error("Error during MongoDB shutdown:", err.message);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected!");
});

export default connectDB;
