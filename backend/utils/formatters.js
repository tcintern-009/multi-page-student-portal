export function formatUser(row) {
    if (!row) return null;

    return {
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        studentId: row.student_id ?? null,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export function formatInstructor(row) {
    if (!row) return null;

    return {
        id: row.id,
        name: row.name,
        role: row.role,
        bio: row.bio,
        expertise: row.expertise || [],
        courses: row.courses || [],
        image: row.image,
        rating: Number(row.rating),
        students: row.students,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export function formatStudent(row) {
    if (!row) return null;

    return {
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export function formatCourse(row) {
    if (!row) return null;

    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        category: row.category,
        description: row.description,
        longDescription: row.long_description || row.description,
        instructor: row.instructor_name || null,
        instructorId: row.instructor_id || null,
        duration: row.duration,
        level: row.level,
        students: row.students,
        rating: Number(row.rating),
        price: Number(row.price),
        image: row.image,
        topics: row.topics || [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export function formatEnrollment(row) {
    if (!row) return null;

    return {
        id: row.id,
        studentId: row.student_id,
        courseId: row.course_id,
        status: row.status,
        enrolledAt: row.enrolled_at,
        student: row.student_name
            ? {
                  id: row.student_id,
                  name: row.student_name,
                  email: row.student_email,
              }
            : undefined,
        course: row.course_title
            ? {
                  id: row.course_id,
                  slug: row.course_slug,
                  title: row.course_title,
              }
            : undefined,
    };
}
