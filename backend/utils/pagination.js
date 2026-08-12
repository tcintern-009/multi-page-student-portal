export function parsePagination(query) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
    const offset = (page - 1) * limit;

    return { page, limit, offset };
}

export function buildPaginationMeta(page, limit, total) {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
    };
}
