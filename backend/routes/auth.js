import { Router } from "express";
import bcrypt from "bcryptjs";
import { query } from "../config/db.js";
import { authenticate, signToken } from "../middleware/auth.js";
import {
    validateAuthRegister,
    validateAuthLogin,
    validationError,
} from "../utils/validation.js";
import { formatUser } from "../utils/formatters.js";

const router = Router();
const SALT_ROUNDS = 12;

async function findUserByEmail(email) {
    const result = await query("SELECT * FROM users WHERE email = $1", [
        email.trim().toLowerCase(),
    ]);
    return result.rows[0] || null;
}

async function findUserById(id) {
    const result = await query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0] || null;
}

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
    try {
        const errors = validateAuthRegister(req.body);
        if (errors.length) return next(validationError(errors));

        const { name, email, password } = req.body;
        const normalizedEmail = email.trim().toLowerCase();

        const existing = await findUserByEmail(normalizedEmail);
        if (existing) {
            const error = new Error("An account with this email already exists");
            error.status = 409;
            return next(error);
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        let studentId = null;
        const existingStudent = await query(
            "SELECT id FROM students WHERE email = $1",
            [normalizedEmail],
        );

        if (existingStudent.rows.length > 0) {
            studentId = existingStudent.rows[0].id;
        } else {
            const studentResult = await query(
                "INSERT INTO students (name, email) VALUES ($1, $2) RETURNING id",
                [name.trim(), normalizedEmail],
            );
            studentId = studentResult.rows[0].id;
        }

        const result = await query(
            `INSERT INTO users (name, email, password_hash, role, student_id)
             VALUES ($1, $2, $3, 'student', $4)
             RETURNING *`,
            [name.trim(), normalizedEmail, passwordHash, studentId],
        );

        const user = result.rows[0];
        const token = signToken({
            id: user.id,
            email: user.email,
            role: user.role,
            studentId: user.student_id,
        });

        res.status(201).json({
            message: "Registration successful",
            token,
            user: formatUser(user),
        });
    } catch (err) {
        next(err);
    }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
    try {
        const errors = validateAuthLogin(req.body);
        if (errors.length) return next(validationError(errors));

        const { email, password } = req.body;
        const user = await findUserByEmail(email);

        if (!user) {
            const error = new Error("Invalid email or password");
            error.status = 401;
            return next(error);
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            const error = new Error("Invalid email or password");
            error.status = 401;
            return next(error);
        }

        const token = signToken({
            id: user.id,
            email: user.email,
            role: user.role,
            studentId: user.student_id,
        });

        res.json({
            message: "Login successful",
            token,
            user: formatUser(user),
        });
    } catch (err) {
        next(err);
    }
});

// GET /api/auth/me
router.get("/me", authenticate, async (req, res, next) => {
    try {
        const user = await findUserById(req.user.id);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            return next(error);
        }

        res.json({ user: formatUser(user) });
    } catch (err) {
        next(err);
    }
});

// POST /api/auth/logout
router.post("/logout", authenticate, (req, res) => {
    res.json({ message: "Logged out successfully" });
});

export default router;
