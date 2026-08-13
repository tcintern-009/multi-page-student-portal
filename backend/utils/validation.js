function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateCourse(body, { partial = false } = {}) {
    const errors = [];

    if (!partial || body.title !== undefined) {
        if (!isNonEmptyString(body.title)) errors.push("title is required");
    }
    if (!partial || body.category !== undefined) {
        if (!isNonEmptyString(body.category)) errors.push("category is required");
    }
    if (!partial || body.description !== undefined) {
        if (!isNonEmptyString(body.description)) errors.push("description is required");
    }
    if (!partial || body.instructor !== undefined || body.instructorId !== undefined) {
        const hasInstructor =
            isNonEmptyString(body.instructor) ||
            (body.instructorId !== undefined && Number.isInteger(Number(body.instructorId)));
        if (!hasInstructor) errors.push("instructor or instructorId is required");
    }
    if (body.price !== undefined && (typeof body.price !== "number" || body.price < 0)) {
        errors.push("price must be a non-negative number");
    }
    if (body.rating !== undefined && (typeof body.rating !== "number" || body.rating < 0 || body.rating > 5)) {
        errors.push("rating must be between 0 and 5");
    }
    if (body.students !== undefined && (!Number.isInteger(body.students) || body.students < 0)) {
        errors.push("students must be a non-negative integer");
    }

    return errors;
}

export function validateInstructor(body, { partial = false } = {}) {
    const errors = [];

    if (!partial || body.name !== undefined) {
        if (!isNonEmptyString(body.name)) errors.push("name is required");
    }
    if (!partial || body.role !== undefined) {
        if (!isNonEmptyString(body.role)) errors.push("role is required");
    }
    if (!partial || body.bio !== undefined) {
        if (!isNonEmptyString(body.bio)) errors.push("bio is required");
    }
    if (body.rating !== undefined && (typeof body.rating !== "number" || body.rating < 0 || body.rating > 5)) {
        errors.push("rating must be between 0 and 5");
    }
    if (body.students !== undefined && (!Number.isInteger(body.students) || body.students < 0)) {
        errors.push("students must be a non-negative integer");
    }

    return errors;
}

export function validateStudent(body, { partial = false } = {}) {
    const errors = [];

    if (!partial || body.name !== undefined) {
        if (!isNonEmptyString(body.name)) errors.push("name is required");
    }
    if (!partial || body.email !== undefined) {
        if (!isNonEmptyString(body.email)) errors.push("email is required");
        else if (!isValidEmail(body.email.trim())) errors.push("email must be valid");
    }

    return errors;
}

export function validateAuthRegister(body) {
    const errors = [];

    if (!isNonEmptyString(body.name)) errors.push("name is required");
    if (!isNonEmptyString(body.email)) {
        errors.push("email is required");
    } else if (!isValidEmail(body.email.trim())) {
        errors.push("email must be valid");
    }
    if (!isNonEmptyString(body.password)) {
        errors.push("password is required");
    } else if (body.password.length < 6) {
        errors.push("password must be at least 6 characters");
    }

    return errors;
}

export function validateAuthLogin(body) {
    const errors = [];

    if (!isNonEmptyString(body.email)) {
        errors.push("email is required");
    } else if (!isValidEmail(body.email.trim())) {
        errors.push("email must be valid");
    }
    if (!isNonEmptyString(body.password)) errors.push("password is required");

    return errors;
}

export function validateEnrollment(body) {
    const errors = [];

    if (body.studentId === undefined || !Number.isInteger(Number(body.studentId))) {
        errors.push("studentId is required and must be an integer");
    }
    if (body.courseId === undefined && !isNonEmptyString(body.courseSlug)) {
        errors.push("courseId or courseSlug is required");
    }
    if (body.status !== undefined && !["active", "completed", "cancelled"].includes(body.status)) {
        errors.push("status must be active, completed, or cancelled");
    }

    return errors;
}

export function validationError(errors) {
    const error = new Error(`Validation failed: ${errors.join(", ")}`);
    error.status = 400;
    return error;
}
