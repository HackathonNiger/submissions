import express from "express";
import connectDB from "./utils/db.js";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import visitRoutes from "./routes/visitRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import hospitalRoutes from "./routes/hospitalRoute.js";

import "./jobs/reminderJobs.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/visit", visitRoutes);
app.use("/api/user", userRoutes);
app.use("/api/reminder", reminderRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/hospitals", hospitalRoutes);

app.get("/", (req, res) => {
  res.send({ message: "This is ayomama backend" });
});

app.listen(port, (req, res) => {
  console.log(`server running on {http://localhost:3000}`);
});
