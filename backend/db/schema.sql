-- Student Course Portal - PostgreSQL schema (Neon)

CREATE TABLE IF NOT EXISTS instructors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    expertise TEXT[] NOT NULL DEFAULT '{}',
    image VARCHAR(500) NOT NULL DEFAULT '/images/default-instructor.svg',
    rating DECIMAL(3, 1) NOT NULL DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5),
    students INTEGER NOT NULL DEFAULT 0 CHECK (students >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT,
    instructor_id INTEGER REFERENCES instructors(id) ON DELETE SET NULL,
    duration VARCHAR(100) NOT NULL DEFAULT '12 weeks',
    level VARCHAR(100) NOT NULL DEFAULT 'Beginner',
    students INTEGER NOT NULL DEFAULT 0 CHECK (students >= 0),
    rating DECIMAL(3, 1) NOT NULL DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5),
    price DECIMAL(10, 2) NOT NULL DEFAULT 99 CHECK (price >= 0),
    image VARCHAR(500) NOT NULL DEFAULT '/images/default-course.svg',
    topics TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (student_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
