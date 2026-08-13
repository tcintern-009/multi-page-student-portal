import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

export function signToken(payload) {
    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        const error = new Error("Authentication required. Please log in.");
        error.status = 401;
        return next(error);
    }

    const token = authHeader.slice(7);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            studentId: decoded.studentId ?? null,
        };
        next();
    } catch (err) {
        const error = new Error(
            err.name === "TokenExpiredError"
                ? "Your session has expired. Please log in again."
                : "Invalid authentication token. Please log in again.",
        );
        error.status = 401;
        next(error);
    }
}

export function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            const error = new Error("Authentication required. Please log in.");
            error.status = 401;
            return next(error);
        }

        if (!roles.includes(req.user.role)) {
            const error = new Error("You do not have permission to perform this action.");
            error.status = 403;
            return next(error);
        }

        next();
    };
}
