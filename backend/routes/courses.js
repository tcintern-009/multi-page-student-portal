import { Router } from "express";
import { courses } from "../data/courses.js";

const router = Router();

// Helper to find a course by slug
function findCourse(slug) {
    return courses.find((course) => course.slug === slug);
}

// Helper to generate a slug from a title
function generateSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

// Validate required course fields for POST/PUT
function validateCourse(body) {
    const errors = [];
    if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
        errors.push("title is required");
    }
    if (!body.category || typeof body.category !== "string" || !body.category.trim()) {
        errors.push("category is required");
    }
    if (!body.instructor || typeof body.instructor !== "string" || !body.instructor.trim()) {
        errors.push("instructor is required");
    }
    if (!body.description || typeof body.description !== "string" || !body.description.trim()) {
        errors.push("description is required");
    }
    if (body.price !== undefined && (typeof body.price !== "number" || body.price < 0)) {
        errors.push("price must be a non-negative number");
    }
    return errors;
}

// GET /api/courses - list all courses
router.get("/", (req, res) => {
    res.json({ courses });
});

// GET /api/courses/:id - get a single course by slug
router.get("/:id", (req, res, next) => {
    const course = findCourse(req.params.id);
    if (!course) {
        const error = new Error(`Course with slug "${req.params.id}" not found`);
        error.status = 404;
        return next(error);
    }
    res.json({ course });
});

// POST /api/courses - create a new course
router.post("/", (req, res, next) => {
    const errors = validateCourse(req.body);
    if (errors.length > 0) {
        const error = new Error(`Validation failed: ${errors.join(", ")}`);
        error.status = 400;
        return next(error);
    }

    const { title, category, description, longDescription, instructor, duration, level, students, rating, price, image, topics } = req.body;

    const newCourse = {
        slug: generateSlug(title),
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        longDescription: longDescription || description,
        instructor: instructor.trim(),
        duration: duration || "12 weeks",
        level: level || "Beginner",
        students: students || 0,
        rating: rating || 4.5,
        price: price !== undefined ? price : 99,
        image: image || "/images/default-course.svg",
        topics: Array.isArray(topics) ? topics : [],
    };

    // Check for duplicate slug
    if (findCourse(newCourse.slug)) {
        const error = new Error(`A course with the title "${title}" already exists`);
        error.status = 409;
        return next(error);
    }

    courses.push(newCourse);
    res.status(201).json({ course: newCourse });
});

// PUT /api/courses/:id - update a course by slug
router.put("/:id", (req, res, next) => {
    const course = findCourse(req.params.id);
    if (!course) {
        const error = new Error(`Course with slug "${req.params.id}" not found`);
        error.status = 404;
        return next(error);
    }

    const errors = validateCourse(req.body);
    if (errors.length > 0) {
        const error = new Error(`Validation failed: ${errors.join(", ")}`);
        error.status = 400;
        return next(error);
    }

    const { title, category, description, longDescription, instructor, duration, level, students, rating, price, image, topics } = req.body;

    // If title changed, generate a new slug (but keep old slug if unchanged)
    const newSlug = generateSlug(title);
    if (newSlug !== course.slug && findCourse(newSlug)) {
        const error = new Error(`A course with the title "${title}" already exists`);
        error.status = 409;
        return next(error);
    }

    course.slug = newSlug;
    course.title = title.trim();
    course.category = category.trim();
    course.description = description.trim();
    course.longDescription = longDescription || course.longDescription;
    course.instructor = instructor.trim();
    if (duration) course.duration = duration;
    if (level) course.level = level;
    if (students !== undefined) course.students = students;
    if (rating !== undefined) course.rating = rating;
    if (price !== undefined) course.price = price;
    if (image) course.image = image;
    if (Array.isArray(topics)) course.topics = topics;

    res.json({ course });
});

// DELETE /api/courses/:id - delete a course by slug
router.delete("/:id", (req, res, next) => {
    const index = courses.findIndex((course) => course.slug === req.params.id);
    if (index === -1) {
        const error = new Error(`Course with slug "${req.params.id}" not found`);
        error.status = 404;
        return next(error);
    }

    const [deleted] = courses.splice(index, 1);
    res.json({ message: "Course deleted successfully", course: deleted });
});

export default router;