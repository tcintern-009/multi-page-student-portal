import "dotenv/config";
import express from "express";
import cors from "cors";
import { testConnection } from "./config/db.js";
import { setupDatabase } from "./db/setup.js";
import coursesRouter from "./routes/courses.js";
import instructorsRouter from "./routes/instructors.js";
import studentsRouter from "./routes/students.js";
import enrollmentsRouter from "./routes/enrollments.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

app.use(
    cors({
        origin: process.env.NODE_ENV === "production" ? CLIENT_URL : "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);
app.use(express.json());

app.get("/api/health", async (req, res, next) => {
    try {
        const db = await testConnection();
        res.json({
            status: "ok",
            database: "connected",
            timestamp: new Date().toISOString(),
            dbTime: db.now,
        });
    } catch (err) {
        err.status = 503;
        err.message = "Database connection failed";
        next(err);
    }
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/instructors", instructorsRouter);
app.use("/api/students", studentsRouter);
app.use("/api/enrollments", enrollmentsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
    try {
        await setupDatabase();
        await testConnection();
        console.log("PostgreSQL connected successfully");

        app.listen(PORT, () => {
            console.log(`Student Portal API running on http://localhost:${PORT}`);
            console.log(`CORS allowed origin: ${CLIENT_URL}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err.message);
        console.error("Make sure DATABASE_URL is set in backend/.env and run: npm run db:seed");
        process.exit(1);
    }
}

startServer();
