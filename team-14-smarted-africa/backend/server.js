// @ts-nocheck
// backend/server.js
// ----------------------------
// Backend Entry Point (Production-Ready)
// ----------------------------

import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import app from "./src/app.js"; // Import your production-ready app

// ----------------------------
// Load environment variables
// ----------------------------
dotenv.config();

// ----------------------------
// Dynamic Port and Environment
// ----------------------------
const PORT = parseInt(process.env.PORT, 10) || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// ----------------------------
// Start Server after DB Connection
// ----------------------------
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log("MongoDB connected successfully");

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1); // Exit process with failure
  }
};

startServer();
