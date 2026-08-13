import { Router } from "express";
import { query } from "../config/db.js";
import { parsePagination, buildPaginationMeta } from "../utils/pagination.js";
import { validateStudent, validationError } from "../utils/validation.js";
import { formatStudent } from "../utils/formatters.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

async function findStudentById(id) {
    const result = await query("SELECT * FROM students WHERE id = $1", [id]);
    return result.rows[0] || null;
}

// GET /api/students — admin only
router.get("/", authenticate, authorize("admin"), async (req, res, next) => {
    try {
        const { page, limit, offset } = parsePagination(req.query);
        const { search } = req.query;
        const usePagination = req.query.page !== undefined || req.query.limit !== undefined;

        const conditions = [];
        const params = [];

        if (search) {
            params.push(`%${search.trim()}%`);
            conditions.push(
                `(name ILIKE $${params.length} OR email ILIKE $${params.length})`,
            );
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        if (usePagination) {
            const countResult = await query(
                `SELECT COUNT(*)::int AS total FROM students ${whereClause}`,
                params,
            );
            const total = countResult.rows[0].total;

            const listParams = [...params, limit, offset];
            const result = await query(
                `SELECT * FROM students ${whereClause}
                 ORDER BY name ASC
                 LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
                listParams,
            );

            return res.json({
                students: result.rows.map(formatStudent),
                pagination: buildPaginationMeta(page, limit, total),
            });
        }

        const result = await query(
            `SELECT * FROM students ${whereClause} ORDER BY name ASC`,
            params,
        );

        res.json({ students: result.rows.map(formatStudent) });
    } catch (err) {
        next(err);
    }
});

// GET /api/students/:id — admin only
router.get("/:id", authenticate, authorize("admin"), async (req, res, next) => {
    try {
        const student = await findStudentById(req.params.id);
        if (!student) {
            const error = new Error(`Student with id ${req.params.id} not found`);
            error.status = 404;
            return next(error);
        }

        const enrollments = await query(
            `SELECT e.*, c.slug AS course_slug, c.title AS course_title
             FROM enrollments e
             JOIN courses c ON e.course_id = c.id
             WHERE e.student_id = $1
             ORDER BY e.enrolled_at DESC`,
            [student.id],
        );

        res.json({
            student: {
                ...formatStudent(student),
                enrollments: enrollments.rows.map((row) => ({
                    id: row.id,
                    courseId: row.course_id,
                    courseSlug: row.course_slug,
                    courseTitle: row.course_title,
                    status: row.status,
                    enrolledAt: row.enrolled_at,
                })),
            },
        });
    } catch (err) {
        next(err);
    }
});

// POST /api/students — admin only
router.post("/", authenticate, authorize("admin"), async (req, res, next) => {
    try {
        const errors = validateStudent(req.body);
        if (errors.length) return next(validationError(errors));

        const { name, email, phone } = req.body;

        const result = await query(
            `INSERT INTO students (name, email, phone) VALUES ($1, $2, $3) RETURNING *`,
            [name.trim(), email.trim().toLowerCase(), phone?.trim() || null],
        );

        res.status(201).json({ student: formatStudent(result.rows[0]) });
    } catch (err) {
        next(err);
    }
});

// PUT /api/students/:id — admin only
router.put("/:id", authenticate, authorize("admin"), async (req, res, next) => {
    try {
        const existing = await findStudentById(req.params.id);
        if (!existing) {
            const error = new Error(`Student with id ${req.params.id} not found`);
            error.status = 404;
            return next(error);
        }

        const errors = validateStudent(req.body);
        if (errors.length) return next(validationError(errors));

        const { name, email, phone } = req.body;

        const result = await query(
            `UPDATE students SET name = $1, email = $2, phone = $3, updated_at = NOW()
             WHERE id = $4 RETURNING *`,
            [
                name.trim(),
                email.trim().toLowerCase(),
                phone?.trim() || null,
                existing.id,
            ],
        );

        res.json({ student: formatStudent(result.rows[0]) });
    } catch (err) {
        next(err);
    }
});

// DELETE /api/students/:id — admin only
router.delete("/:id", authenticate, authorize("admin"), async (req, res, next) => {
    try {
        const existing = await findStudentById(req.params.id);
        if (!existing) {
            const error = new Error(`Student with id ${req.params.id} not found`);
            error.status = 404;
            return next(error);
        }

        await query("DELETE FROM students WHERE id = $1", [existing.id]);
        res.json({
            message: "Student deleted successfully",
            student: formatStudent(existing),
        });
    } catch (err) {
        next(err);
    }
});

export default router;
