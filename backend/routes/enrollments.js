import { Router } from "express";
import { query } from "../config/db.js";
import { parsePagination, buildPaginationMeta } from "../utils/pagination.js";
import { validateEnrollment, validationError } from "../utils/validation.js";
import { formatEnrollment } from "../utils/formatters.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

const ENROLLMENT_SELECT = `
    SELECT e.*,
           s.name AS student_name, s.email AS student_email,
           c.slug AS course_slug, c.title AS course_title
    FROM enrollments e
    JOIN students s ON e.student_id = s.id
    JOIN courses c ON e.course_id = c.id
`;

async function resolveCourseId({ courseId, courseSlug }) {
    if (courseId !== undefined) {
        const result = await query("SELECT id FROM courses WHERE id = $1", [courseId]);
        if (result.rows.length === 0) {
            const error = new Error(`Course with id ${courseId} not found`);
            error.status = 404;
            throw error;
        }
        return result.rows[0].id;
    }

    if (courseSlug) {
        const result = await query("SELECT id FROM courses WHERE slug = $1", [courseSlug]);
        if (result.rows.length === 0) {
            const error = new Error(`Course with slug "${courseSlug}" not found`);
            error.status = 404;
            throw error;
        }
        return result.rows[0].id;
    }

    const error = new Error("courseId or courseSlug is required");
    error.status = 400;
    throw error;
}

async function findEnrollmentById(id) {
    const result = await query(`${ENROLLMENT_SELECT} WHERE e.id = $1`, [id]);
    return result.rows[0] || null;
}

// GET /api/enrollments
router.get("/", async (req, res, next) => {
    try {
        const { page, limit, offset } = parsePagination(req.query);
        const { studentId, courseId, status } = req.query;
        const usePagination = req.query.page !== undefined || req.query.limit !== undefined;

        const conditions = [];
        const params = [];

        if (studentId) {
            params.push(Number(studentId));
            conditions.push(`e.student_id = $${params.length}`);
        }
        if (courseId) {
            params.push(Number(courseId));
            conditions.push(`e.course_id = $${params.length}`);
        }
        if (status) {
            params.push(status.trim());
            conditions.push(`e.status = $${params.length}`);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        if (usePagination) {
            const countResult = await query(
                `SELECT COUNT(*)::int AS total FROM enrollments e ${whereClause}`,
                params,
            );
            const total = countResult.rows[0].total;

            const listParams = [...params, limit, offset];
            const result = await query(
                `${ENROLLMENT_SELECT} ${whereClause}
                 ORDER BY e.enrolled_at DESC
                 LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
                listParams,
            );

            return res.json({
                enrollments: result.rows.map(formatEnrollment),
                pagination: buildPaginationMeta(page, limit, total),
            });
        }

        const result = await query(
            `${ENROLLMENT_SELECT} ${whereClause} ORDER BY e.enrolled_at DESC`,
            params,
        );

        res.json({ enrollments: result.rows.map(formatEnrollment) });
    } catch (err) {
        next(err);
    }
});

// GET /api/enrollments/:id
router.get("/:id", async (req, res, next) => {
    try {
        const enrollment = await findEnrollmentById(req.params.id);
        if (!enrollment) {
            const error = new Error(`Enrollment with id ${req.params.id} not found`);
            error.status = 404;
            return next(error);
        }

        res.json({ enrollment: formatEnrollment(enrollment) });
    } catch (err) {
        next(err);
    }
});

// POST /api/enrollments — authenticated students enroll themselves
router.post("/", authenticate, authorize("student", "admin"), async (req, res, next) => {
    try {
        const enrollmentBody = { ...req.body };

        if (req.user.role === "student") {
            if (!req.user.studentId) {
                const error = new Error("Your account is not linked to a student profile");
                error.status = 400;
                return next(error);
            }
            enrollmentBody.studentId = req.user.studentId;
        }

        const errors = validateEnrollment(enrollmentBody);
        if (errors.length) return next(validationError(errors));

        const { studentId, courseId, courseSlug, status } = enrollmentBody;

        const studentResult = await query("SELECT id FROM students WHERE id = $1", [studentId]);
        if (studentResult.rows.length === 0) {
            const error = new Error(`Student with id ${studentId} not found`);
            error.status = 404;
            return next(error);
        }

        const resolvedCourseId = await resolveCourseId({ courseId, courseSlug });

        const result = await query(
            `INSERT INTO enrollments (student_id, course_id, status)
             VALUES ($1, $2, $3)
             RETURNING id`,
            [studentId, resolvedCourseId, status || "active"],
        );

        const enrollment = await findEnrollmentById(result.rows[0].id);
        res.status(201).json({ enrollment: formatEnrollment(enrollment) });
    } catch (err) {
        next(err);
    }
});

// PUT /api/enrollments/:id — admin only
router.put("/:id", authenticate, authorize("admin"), async (req, res, next) => {
    try {
        const existing = await findEnrollmentById(req.params.id);
        if (!existing) {
            const error = new Error(`Enrollment with id ${req.params.id} not found`);
            error.status = 404;
            return next(error);
        }

        const { status } = req.body;
        if (status !== undefined && !["active", "completed", "cancelled"].includes(status)) {
            return next(validationError(["status must be active, completed, or cancelled"]));
        }

        await query(
            `UPDATE enrollments SET status = $1 WHERE id = $2`,
            [status || existing.status, existing.id],
        );

        const updated = await findEnrollmentById(existing.id);
        res.json({ enrollment: formatEnrollment(updated) });
    } catch (err) {
        next(err);
    }
});

// DELETE /api/enrollments/:id — admin only
router.delete("/:id", authenticate, authorize("admin"), async (req, res, next) => {
    try {
        const existing = await findEnrollmentById(req.params.id);
        if (!existing) {
            const error = new Error(`Enrollment with id ${req.params.id} not found`);
            error.status = 404;
            return next(error);
        }

        await query("DELETE FROM enrollments WHERE id = $1", [existing.id]);
        res.json({
            message: "Enrollment deleted successfully",
            enrollment: formatEnrollment(existing),
        });
    } catch (err) {
        next(err);
    }
});

export default router;
