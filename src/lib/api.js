// Reusable API helper functions for the Student Course Portal.
// All frontend-backend communication goes through these functions.

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "student_portal_token";

export function getStoredToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
    const url = `${API_URL}${path}`;

    const token = getStoredToken();
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

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

function buildQuery(params = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            searchParams.set(key, String(value));
        }
    });
    const query = searchParams.toString();
    return query ? `?${query}` : "";
}

// --- Auth ---

export async function register({ name, email, password }) {
    const data = await request("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
    });
    return data;
}

export async function login({ email, password }) {
    const data = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
    return data;
}

export async function fetchCurrentUser() {
    const data = await request("/auth/me");
    return data.user;
}

export async function logout() {
    return request("/auth/logout", { method: "POST" });
}

// --- Courses ---

export async function fetchCourses(params = {}) {
    const data = await request(`/courses${buildQuery(params)}`);
    return data.courses;
}

export async function fetchCourseBySlug(slug) {
    const data = await request(`/courses/${slug}`);
    return data.course;
}

export async function createCourse(courseData) {
    const data = await request("/courses", {
        method: "POST",
        body: JSON.stringify(courseData),
    });
    return data.course;
}

export async function updateCourse(slug, courseData) {
    const data = await request(`/courses/${slug}`, {
        method: "PUT",
        body: JSON.stringify(courseData),
    });
    return data.course;
}

export async function deleteCourse(slug) {
    return request(`/courses/${slug}`, { method: "DELETE" });
}

// --- Instructors ---

export async function fetchInstructors(params = {}) {
    const data = await request(`/instructors${buildQuery(params)}`);
    return data.instructors;
}

export async function fetchInstructorById(id) {
    const data = await request(`/instructors/${id}`);
    return data.instructor;
}

export async function createInstructor(instructorData) {
    const data = await request("/instructors", {
        method: "POST",
        body: JSON.stringify(instructorData),
    });
    return data.instructor;
}

export async function updateInstructor(id, instructorData) {
    const data = await request(`/instructors/${id}`, {
        method: "PUT",
        body: JSON.stringify(instructorData),
    });
    return data.instructor;
}

export async function deleteInstructor(id) {
    return request(`/instructors/${id}`, { method: "DELETE" });
}

// --- Students ---

export async function fetchStudents(params = {}) {
    const data = await request(`/students${buildQuery(params)}`);
    return data.students;
}

export async function fetchStudentById(id) {
    const data = await request(`/students/${id}`);
    return data.student;
}

export async function createStudent(studentData) {
    const data = await request("/students", {
        method: "POST",
        body: JSON.stringify(studentData),
    });
    return data.student;
}

export async function updateStudent(id, studentData) {
    const data = await request(`/students/${id}`, {
        method: "PUT",
        body: JSON.stringify(studentData),
    });
    return data.student;
}

export async function deleteStudent(id) {
    return request(`/students/${id}`, { method: "DELETE" });
}

// --- Enrollments ---

export async function fetchEnrollments(params = {}) {
    const data = await request(`/enrollments${buildQuery(params)}`);
    return data.enrollments;
}

export async function createEnrollment(enrollmentData) {
    const data = await request("/enrollments", {
        method: "POST",
        body: JSON.stringify(enrollmentData),
    });
    return data.enrollment;
}

export async function deleteEnrollment(id) {
    return request(`/enrollments/${id}`, { method: "DELETE" });
}

// --- Health ---

export async function fetchHealth() {
    return request("/health");
}
