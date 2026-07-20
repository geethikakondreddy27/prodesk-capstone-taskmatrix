import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import taskSuggestionRoutes from "./routes/taskSuggestionRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();


connectDB();

const app = express();

// ===============================
// Security Middleware
// ===============================
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

// ===============================
// Global Rate Limiter
// ===============================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again later.",
  },
});

app.use(apiLimiter);

// ===============================
// AI Endpoint Rate Limiter
// ===============================
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "AI request limit exceeded. Please try again later.",
  },
});

// ===============================
// Body Parser
// ===============================
app.use(express.json());

// ===============================
// Health Check
// ===============================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FlowStack API is running.",
  });
});

// ===============================
// API Routes
// ===============================
app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/ai", aiLimiter, taskSuggestionRoutes);

// ===============================
// 404 Handler
// ===============================
app.use(notFound);

// ===============================
// Global Error Handler
// ===============================
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});