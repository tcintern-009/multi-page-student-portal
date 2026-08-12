import { Router } from "express";
import { query } from "../config/db.js";
import { parsePagination, buildPaginationMeta } from "../utils/pagination.js";
import { validateInstructor, validationError } from "../utils/validation.js";
import { formatInstructor } from "../utils/formatters.js";

const router = Router();

async function getInstructorCourses(instructorId) {
    const result = await query(
        "SELECT title FROM courses WHERE instructor_id = $1 ORDER BY title",
        [instructorId],
    );
    return result.rows.map((row) => row.title);
}

async function findInstructorById(id) {
    const result = await query("SELECT * FROM instructors WHERE id = $1", [id]);
    return result.rows[0] || null;
}

async function formatInstructorWithCourses(row) {
    const courses = await getInstructorCourses(row.id);
    return formatInstructor({ ...row, courses });
}

// GET /api/instructors
router.get("/", async (req, res, next) => {
    try {
        const { page, limit, offset } = parsePagination(req.query);
        const { search } = req.query;
        const usePagination = req.query.page !== undefined || req.query.limit !== undefined;

        const conditions = [];
        const params = [];

        if (search) {
            params.push(`%${search.trim()}%`);
            conditions.push(
                `(name ILIKE $${params.length} OR role ILIKE $${params.length} OR bio ILIKE $${params.length})`,
            );
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        if (usePagination) {
            const countResult = await query(
                `SELECT COUNT(*)::int AS total FROM instructors ${whereClause}`,
                params,
            );
            const total = countResult.rows[0].total;

            const listParams = [...params, limit, offset];
            const result = await query(
                `SELECT * FROM instructors ${whereClause}
                 ORDER BY name ASC
                 LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
                listParams,
            );

            const instructors = await Promise.all(
                result.rows.map((row) => formatInstructorWithCourses(row)),
            );

            return res.json({
                instructors,
                pagination: buildPaginationMeta(page, limit, total),
            });
        }

        const result = await query(`SELECT * FROM instructors ${whereClause} ORDER BY name ASC`, params);
        const instructors = await Promise.all(
            result.rows.map((row) => formatInstructorWithCourses(row)),
        );

        res.json({ instructors });
    } catch (err) {
        next(err);
    }
});

// GET /api/instructors/:id
router.get("/:id", async (req, res, next) => {
    try {
        const instructor = await findInstructorById(req.params.id);
        if (!instructor) {
            const error = new Error(`Instructor with id ${req.params.id} not found`);
            error.status = 404;
            return next(error);
        }

        res.json({ instructor: await formatInstructorWithCourses(instructor) });
    } catch (err) {
        next(err);
    }
});

// POST /api/instructors
router.post("/", async (req, res, next) => {
    try {
        const errors = validateInstructor(req.body);
        if (errors.length) return next(validationError(errors));

        const { name, role, bio, expertise, image, rating, students } = req.body;

        const result = await query(
            `INSERT INTO instructors (name, role, bio, expertise, image, rating, students)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [
                name.trim(),
                role.trim(),
                bio.trim(),
                Array.isArray(expertise) ? expertise : [],
                image || "/images/default-instructor.svg",
                rating ?? 4.5,
                students ?? 0,
            ],
        );

        res.status(201).json({
            instructor: await formatInstructorWithCourses(result.rows[0]),
        });
    } catch (err) {
        next(err);
    }
});

// PUT /api/instructors/:id
router.put("/:id", async (req, res, next) => {
    try {
        const existing = await findInstructorById(req.params.id);
        if (!existing) {
            const error = new Error(`Instructor with id ${req.params.id} not found`);
            error.status = 404;
            return next(error);
        }

        const errors = validateInstructor(req.body);
        if (errors.length) return next(validationError(errors));

        const { name, role, bio, expertise, image, rating, students } = req.body;

        const result = await query(
            `UPDATE instructors SET
                name = $1, role = $2, bio = $3, expertise = $4, image = $5,
                rating = $6, students = $7, updated_at = NOW()
             WHERE id = $8
             RETURNING *`,
            [
                name.trim(),
                role.trim(),
                bio.trim(),
                Array.isArray(expertise) ? expertise : existing.expertise,
                image || existing.image,
                rating ?? existing.rating,
                students ?? existing.students,
                existing.id,
            ],
        );

        res.json({ instructor: await formatInstructorWithCourses(result.rows[0]) });
    } catch (err) {
        next(err);
    }
});

// DELETE /api/instructors/:id
router.delete("/:id", async (req, res, next) => {
    try {
        const existing = await findInstructorById(req.params.id);
        if (!existing) {
            const error = new Error(`Instructor with id ${req.params.id} not found`);
            error.status = 404;
            return next(error);
        }

        await query("DELETE FROM instructors WHERE id = $1", [existing.id]);
        res.json({
            message: "Instructor deleted successfully",
            instructor: await formatInstructorWithCourses(existing),
        });
    } catch (err) {
        next(err);
    }
});

export default router;
