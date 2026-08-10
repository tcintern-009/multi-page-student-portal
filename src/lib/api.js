// Reusable API helper functions for the Student Course Portal.
// All frontend-backend communication goes through these functions.

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
    const url = `${API_URL}${path}`;

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    let response;
    try {
        response = await fetch(url, {
            ...options,
            headers,
        });
    } catch (networkError) {
        const error = new Error(
            "Unable to reach the server. Please check your connection and try again.",
        );
        error.status = 0;
        error.isNetworkError = true;
        throw error;
    }

    let data = null;
    try {
        data = await response.json();
    } catch {
        // No JSON body returned
        data = null;
    }

    if (!response.ok) {
        const message =
            data?.error?.message || `Request failed with status ${response.status}`;
        const error = new Error(message);
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}

// GET /api/courses
export async function fetchCourses() {
    const data = await request("/courses");
    return data.courses;
}

// GET /api/courses/:slug
export async function fetchCourseBySlug(slug) {
    const data = await request(`/courses/${slug}`);
    return data.course;
}

// POST /api/courses
export async function createCourse(courseData) {
    const data = await request("/courses", {
        method: "POST",
        body: JSON.stringify(courseData),
    });
    return data.course;
}

// PUT /api/courses/:slug
export async function updateCourse(slug, courseData) {
    const data = await request(`/courses/${slug}`, {
        method: "PUT",
        body: JSON.stringify(courseData),
    });
    return data.course;
}

// DELETE /api/courses/:slug
export async function deleteCourse(slug) {
    const data = await request(`/courses/${slug}`, {
        method: "DELETE",
    });
    return data;
}