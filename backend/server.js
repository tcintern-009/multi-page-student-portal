import "dotenv/config";
import express from "express";
import cors from "cors";
import coursesRouter from "./routes/courses.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// Middleware - allow all origins for development
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"],
    }),
);
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/courses", coursesRouter);

// 404 handler for unknown routes
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Student Portal API running on http://localhost:${PORT}`);
    console.log(`CORS allowed origin: ${CLIENT_URL}`);
});