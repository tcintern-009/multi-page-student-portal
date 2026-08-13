import { Router } from "express";
import { query } from "../config/db.js";
import { generateSlug } from "../utils/slug.js";
import { parsePagination, buildPaginationMeta } from "../utils/pagination.js";
import { validateCourse, validationError } from "../utils/validation.js";
import { formatCourse } from "../utils/formatters.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

const COURSE_SELECT = `
    SELECT c.*, i.name AS instructor_name
    FROM courses c
    LEFT JOIN instructors i ON c.instructor_id = i.id
`;

async function resolveInstructorId({ instructor, instructorId }) {
    if (instructorId !== undefined) {
        const result = await query("SELECT id FROM instructors WHERE id = $1", [instructorId]);
        if (result.rows.length === 0) {
            const error = new Error(`Instructor with id ${instructorId} not found`);
            error.status = 404;
            throw error;
        }
        return result.rows[0].id;
    }

    if (instructor) {
        const result = await query("SELECT id FROM instructors WHERE name ILIKE $1 LIMIT 1", [
            instructor.trim(),
        ]);
        if (result.rows.length === 0) {
            const error = new Error(`Instructor "${instructor}" not found. Create the instructor first.`);
            error.status = 404;
            throw error;
        }
        return result.rows[0].id;
    }

    return null;
}

async function findCourseBySlug(slug) {
    const result = await query(`${COURSE_SELECT} WHERE c.slug = $1`, [slug]);
    return result.rows[0] || null;
}

// GET /api/courses
router.get("/", async (req, res, next) => {
    try {
        const { page, limit, offset } = parsePagination(req.query);
        const { search, category, level } = req.query;
        const usePagination = req.query.page !== undefined || req.query.limit !== undefined;

        const conditions = [];
        const params = [];

        if (search) {
            params.push(`%${search.trim()}%`);
            conditions.push(
                `(c.title ILIKE $${params.length} OR c.description ILIKE $${params.length} OR i.name ILIKE $${params.length})`,
            );
        }
        if (category) {
            params.push(category.trim());
            conditions.push(`c.category ILIKE $${params.length}`);
        }
        if (level) {
            params.push(level.trim());
            conditions.push(`c.level ILIKE $${params.length}`);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        if (usePagination) {
            const countResult = await query(
                `SELECT COUNT(*)::int AS total
                 FROM courses c
                 LEFT JOIN instructors i ON c.instructor_id = i.id
                 ${whereClause}`,
                params,
            );
            const total = countResult.rows[0].total;

            const listParams = [...params, limit, offset];
            const result = await query(
                `${COURSE_SELECT} ${whereClause}
                 ORDER BY c.created_at DESC
                 LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
                listParams,
            );

            return res.json({
                courses: result.rows.map(formatCourse),
                pagination: buildPaginationMeta(page, limit, total),
            });
        }

        const result = await query(
            `${COURSE_SELECT} ${whereClause} ORDER BY c.created_at DESC`,
            params,
        );

        res.json({ courses: result.rows.map(formatCourse) });
    } catch (err) {
        next(err);
    }
});

// GET /api/courses/:id
router.get("/:id", async (req, res, next) => {
    try {
        const course = await findCourseBySlug(req.params.id);
        if (!course) {
            const error = new Error(`Course with slug "${req.params.id}" not found`);
            error.status = 404;
            return next(error);
        }
        res.json({ course: formatCourse(course) });
    } catch (err) {
        next(err);
    }
});

// POST /api/courses — admin only
router.post("/", authenticate, authorize("admin"), async (req, res, next) => {
    try {
        const errors = validateCourse(req.body);
        if (errors.length) return next(validationError(errors));

        const {
            title,
            category,
            description,
            longDescription,
            instructor,
            instructorId,
            duration,
            level,
            students,
            rating,
            price,
            image,
            topics,
        } = req.body;

        const slug = generateSlug(title);
        const existing = await query("SELECT id FROM courses WHERE slug = $1", [slug]);
        if (existing.rows.length > 0) {
            const error = new Error(`A course with the title "${title}" already exists`);
            error.status = 409;
            return next(error);
        }

        const resolvedInstructorId = await resolveInstructorId({ instructor, instructorId });

        const result = await query(
            `INSERT INTO courses (
                slug, title, category, description, long_description, instructor_id,
                duration, level, students, rating, price, image, topics
             ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
             RETURNING *`,
            [
                slug,
                title.trim(),
                category.trim(),
                description.trim(),
                longDescription || description.trim(),
                resolvedInstructorId,
                duration || "12 weeks",
                level || "Beginner",
                students ?? 0,
                rating ?? 4.5,
                price ?? 99,
                image || "/images/default-course.svg",
                Array.isArray(topics) ? topics : [],
            ],
        );

        const created = await findCourseBySlug(result.rows[0].slug);
        res.status(201).json({ course: formatCourse(created) });
    } catch (err) {
        next(err);
    }
});

// PUT /api/courses/:id — admin only
router.put("/:id", authenticate, authorize("admin"), async (req, res, next) => {
    try {
        const existing = await findCourseBySlug(req.params.id);
        if (!existing) {
            const error = new Error(`Course with slug "${req.params.id}" not found`);
            error.status = 404;
            return next(error);
        }

        const errors = validateCourse(req.body);
        if (errors.length) return next(validationError(errors));

        const {
            title,
            category,
            description,
            longDescription,
            instructor,
            instructorId,
            duration,
            level,
            students,
            rating,
            price,
            image,
            topics,
        } = req.body;

        const newSlug = generateSlug(title);
        if (newSlug !== existing.slug) {
            const duplicate = await query("SELECT id FROM courses WHERE slug = $1", [newSlug]);
            if (duplicate.rows.length > 0) {
                const error = new Error(`A course with the title "${title}" already exists`);
                error.status = 409;
                return next(error);
            }
        }

        const resolvedInstructorId = await resolveInstructorId({ instructor, instructorId });

        await query(
            `UPDATE courses SET
                slug = $1, title = $2, category = $3, description = $4, long_description = $5,
                instructor_id = $6, duration = $7, level = $8, students = $9, rating = $10,
                price = $11, image = $12, topics = $13, updated_at = NOW()
             WHERE id = $14`,
            [
                newSlug,
                title.trim(),
                category.trim(),
                description.trim(),
                longDescription || existing.long_description,
                resolvedInstructorId,
                duration || existing.duration,
                level || existing.level,
                students ?? existing.students,
                rating ?? existing.rating,
                price ?? existing.price,
                image || existing.image,
                Array.isArray(topics) ? topics : existing.topics,
                existing.id,
            ],
        );

        const updated = await findCourseBySlug(newSlug);
        res.json({ course: formatCourse(updated) });
    } catch (err) {
        next(err);
    }
});

// DELETE /api/courses/:id — admin only
router.delete("/:id", authenticate, authorize("admin"), async (req, res, next) => {
    try {
        const existing = await findCourseBySlug(req.params.id);
        if (!existing) {
            const error = new Error(`Course with slug "${req.params.id}" not found`);
            error.status = 404;
            return next(error);
        }

        await query("DELETE FROM courses WHERE id = $1", [existing.id]);
        res.json({
            message: "Course deleted successfully",
            course: formatCourse(existing),
        });
    } catch (err) {
        next(err);
    }
});

export default router;
