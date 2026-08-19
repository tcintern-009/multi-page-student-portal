import { Router } from "express";
import { query } from "../config/db.js";
import { parsePagination, buildPaginationMeta } from "../utils/pagination.js";
import { formatUser } from "../utils/formatters.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

// GET /api/users — admin only
router.get("/", authenticate, authorize("admin"), async (req, res, next) => {
    try {
        const { page, limit, offset } = parsePagination(req.query);
        const { search, role } = req.query;
        const usePagination = req.query.page !== undefined || req.query.limit !== undefined;

        const conditions = [];
        const params = [];

        if (search) {
            params.push(`%${search.trim()}%`);
            conditions.push(
                `(name ILIKE $${params.length} OR email ILIKE $${params.length})`,
            );
        }
        if (role) {
            params.push(role.trim());
            conditions.push(`role = $${params.length}`);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        if (usePagination) {
            const countResult = await query(
                `SELECT COUNT(*)::int AS total FROM users ${whereClause}`,
                params,
            );
            const total = countResult.rows[0].total;

            const listParams = [...params, limit, offset];
            const result = await query(
                `SELECT * FROM users ${whereClause}
                 ORDER BY created_at DESC
                 LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
                listParams,
            );

            return res.json({
                users: result.rows.map(formatUser),
                pagination: buildPaginationMeta(page, limit, total),
            });
        }

        const result = await query(
            `SELECT * FROM users ${whereClause} ORDER BY created_at DESC`,
            params,
        );

        res.json({ users: result.rows.map(formatUser) });
    } catch (err) {
        next(err);
    }
});

// PATCH /api/users/:id/role — admin only, change user role
router.patch("/:id/role", authenticate, authorize("admin"), async (req, res, next) => {
    try {
        const { role } = req.body;
        if (!role || !["student", "admin"].includes(role)) {
            const error = new Error("role must be 'student' or 'admin'");
            error.status = 400;
            return next(error);
        }

        const userId = Number(req.params.id);

        if (userId === req.user.id) {
            const error = new Error("You cannot change your own role.");
            error.status = 403;
            return next(error);
        }

        const existing = await query("SELECT * FROM users WHERE id = $1", [userId]);
        if (existing.rows.length === 0) {
            const error = new Error(`User with id ${userId} not found`);
            error.status = 404;
            return next(error);
        }

        const result = await query(
            `UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
            [role, userId],
        );

        res.json({ user: formatUser(result.rows[0]) });
    } catch (err) {
        next(err);
    }
});

export default router;
