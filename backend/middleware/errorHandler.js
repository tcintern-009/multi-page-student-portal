

export function notFoundHandler(req, res, next) {
    const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
    error.status = 404;
    next(error);
}

export function errorHandler(err, req, res, next) {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";

    // Log the error for debugging (real apps would use a logger)
    console.error(`[${req.method} ${req.originalUrl}] ${status}: ${message}`);

    res.status(status).json({
        error: {
            status,
            message,
        },
    });
}