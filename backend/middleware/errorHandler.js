
export function notFoundHandler(req, res, next) {
    const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
    error.status = 404;
    next(error);
}

function mapDatabaseError(err) {
    if (!err.code) return err;

    switch (err.code) {
        case "23505":
            err.status = 409;
            if (err.constraint?.includes("students_email")) {
                err.message = "A student with this email already exists";
            } else if (err.constraint?.includes("users_email")) {
                err.message = "An account with this email already exists";
            } else if (err.constraint?.includes("courses_slug")) {
                err.message = "A course with this slug already exists";
            } else if (err.constraint?.includes("enrollments")) {
                err.message = "This student is already enrolled in this course";
            } else {
                err.message = "Duplicate record";
            }
            break;
        case "23503":
            err.status = 400;
            err.message = "Referenced record does not exist";
            break;
        case "23502":
            err.status = 400;
            err.message = "Required field is missing";
            break;
        case "22P02":
            err.status = 400;
            err.message = "Invalid data format";
            break;
        default:
            break;
    }

    return err;
}

export function errorHandler(err, req, res, next) {
    const mapped = mapDatabaseError(err);
    const status = mapped.status || 500;
    const message = mapped.message || "Internal Server Error";

    console.error(`[${req.method} ${req.originalUrl}] ${status}: ${message}`);

    res.status(status).json({
        error: {
            status,
            message,
        },
    });
}
