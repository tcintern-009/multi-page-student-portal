import "dotenv/config";
import { setupDatabase, closePool } from "./setup.js";
import { query } from "../config/db.js";
import bcrypt from "bcryptjs";

const instructors = [
    {
        name: "Sarah Ahmed",
        role: "Senior Web Developer",
        bio: "Full-stack developer with 10+ years of experience building web applications. Passionate about teaching modern JavaScript and React.",
        expertise: ["React", "Next.js", "Node.js", "TypeScript"],
        image: "/images/instructor-sarah.svg",
        rating: 4.9,
        students: 2500,
    },
    {
        name: "Dr. Imran Khan",
        role: "AI & Cloud Architect",
        bio: "PhD in Computer Science with expertise in machine learning and cloud infrastructure. Has worked with Fortune 500 companies on AI solutions.",
        expertise: ["Machine Learning", "Deep Learning", "AWS", "Python"],
        image: "/images/instructor-imran.svg",
        rating: 4.8,
        students: 1800,
    },
    {
        name: "Ayesha Malik",
        role: "Data Scientist",
        bio: "Data scientist specializing in predictive analytics and data visualization. Former analyst at a leading tech company.",
        expertise: ["Python", "pandas", "Statistics", "SQL"],
        image: "/images/instructor-ayesha.svg",
        rating: 4.7,
        students: 2100,
    },
    {
        name: "Bilal Hussain",
        role: "Mobile App Developer",
        bio: "Mobile developer with expertise in React Native and Flutter. Has published 20+ apps on both iOS and Android stores.",
        expertise: ["React Native", "Flutter", "Dart", "UI/UX"],
        image: "/images/instructor-bilal.svg",
        rating: 4.6,
        students: 1200,
    },
    {
        name: "Fatima Noor",
        role: "Cybersecurity Expert",
        bio: "Certified ethical hacker and security consultant. Specializes in penetration testing and network security.",
        expertise: ["Ethical Hacking", "Network Security", "Cryptography"],
        image: "/images/instructor-fatima.svg",
        rating: 4.8,
        students: 950,
    },
];

const courses = [
    {
        slug: "web-development",
        title: "Web Development",
        category: "Programming",
        description:
            "Master modern web development with HTML, CSS, JavaScript, and React. Build responsive, interactive websites from scratch.",
        longDescription:
            "This comprehensive course takes you from the fundamentals of HTML and CSS to advanced React and Next.js development. You'll learn how to build responsive layouts, handle user interactions, manage state, and deploy production-ready applications. Through hands-on projects, you'll create real-world websites and gain the confidence to work as a professional web developer.",
        instructorName: "Sarah Ahmed",
        duration: "12 weeks",
        level: "Beginner to Intermediate",
        students: 1240,
        rating: 4.8,
        price: 149,
        image: "/images/web-development.svg",
        topics: [
            "HTML5 & CSS3 Fundamentals",
            "JavaScript ES6+",
            "Responsive Design with Tailwind CSS",
            "React & Next.js",
            "REST APIs & Fetch",
            "Deployment & Git",
        ],
    },
    {
        slug: "ai-engineering",
        title: "AI Engineering",
        category: "Artificial Intelligence",
        description:
            "Learn machine learning, neural networks, and AI application development with Python and modern AI frameworks.",
        longDescription:
            "Dive deep into the world of artificial intelligence. This course covers machine learning fundamentals, deep learning with neural networks, natural language processing, and computer vision. You'll work with Python, TensorFlow, and PyTorch to build intelligent systems that can learn from data, understand language, and recognize patterns. Perfect for aspiring AI engineers and data scientists.",
        instructorName: "Dr. Imran Khan",
        duration: "16 weeks",
        level: "Intermediate",
        students: 890,
        rating: 4.9,
        price: 199,
        image: "/images/ai-engineering.svg",
        topics: [
            "Python for AI",
            "Machine Learning Fundamentals",
            "Deep Learning & Neural Networks",
            "Natural Language Processing",
            "Computer Vision",
            "Model Deployment",
        ],
    },
    {
        slug: "data-science",
        title: "Data Science",
        category: "Data",
        description:
            "Analyze data, build predictive models, and extract insights using Python, pandas, and visualization tools.",
        longDescription:
            "Become a data-driven problem solver. This course teaches you how to collect, clean, analyze, and visualize data using Python's powerful ecosystem. You'll learn statistical analysis, data wrangling with pandas, and create compelling visualizations with Matplotlib and Seaborn. By the end, you'll be able to build predictive models and communicate insights effectively to stakeholders.",
        instructorName: "Ayesha Malik",
        duration: "14 weeks",
        level: "Beginner to Intermediate",
        students: 1560,
        rating: 4.7,
        price: 179,
        image: "/images/data-science.svg",
        topics: [
            "Python & NumPy",
            "Data Wrangling with pandas",
            "Data Visualization",
            "Statistical Analysis",
            "Machine Learning Basics",
            "SQL for Data Analysis",
        ],
    },
];

const students = [
    { name: "Ali Hassan", email: "ali.hassan@example.com", phone: "+92-300-1234567" },
    { name: "Sana Khan", email: "sana.khan@example.com", phone: "+92-301-2345678" },
    { name: "Usman Ali", email: "usman.ali@example.com", phone: "+92-302-3456789" },
];

async function ensureAdminUser() {
    const existing = await query("SELECT id FROM users WHERE email = $1", [
        "admin@studentportal.com",
    ]);
    if (existing.rows.length > 0) return;

    const passwordHash = await bcrypt.hash("admin123", 12);
    await query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, 'admin')`,
        ["Portal Admin", "admin@studentportal.com", passwordHash],
    );
    console.log("Admin user created: admin@studentportal.com / admin123");
}

async function seed() {
    await setupDatabase();

    const instructorCount = await query("SELECT COUNT(*)::int AS count FROM instructors");
    if (instructorCount.rows[0].count > 0) {
        await ensureAdminUser();
        console.log("Database already seeded. Skipping seed data.");
        return;
    }

    const instructorMap = new Map();

    for (const instructor of instructors) {
        const result = await query(
            `INSERT INTO instructors (name, role, bio, expertise, image, rating, students)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, name`,
            [
                instructor.name,
                instructor.role,
                instructor.bio,
                instructor.expertise,
                instructor.image,
                instructor.rating,
                instructor.students,
            ],
        );
        instructorMap.set(result.rows[0].name, result.rows[0].id);
    }

    const courseMap = new Map();

    for (const course of courses) {
        const instructorId = instructorMap.get(course.instructorName) || null;
        const result = await query(
            `INSERT INTO courses (
                slug, title, category, description, long_description, instructor_id,
                duration, level, students, rating, price, image, topics
             ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
             RETURNING id, slug`,
            [
                course.slug,
                course.title,
                course.category,
                course.description,
                course.longDescription,
                instructorId,
                course.duration,
                course.level,
                course.students,
                course.rating,
                course.price,
                course.image,
                course.topics,
            ],
        );
        courseMap.set(result.rows[0].slug, result.rows[0].id);
    }

    const studentIds = [];
    for (const student of students) {
        const result = await query(
            `INSERT INTO students (name, email, phone) VALUES ($1, $2, $3) RETURNING id`,
            [student.name, student.email, student.phone],
        );
        studentIds.push(result.rows[0].id);
    }

    const webDevId = courseMap.get("web-development");
    const dataScienceId = courseMap.get("data-science");

    if (studentIds[0] && webDevId) {
        await query(
            `INSERT INTO enrollments (student_id, course_id, status) VALUES ($1, $2, 'active')`,
            [studentIds[0], webDevId],
        );
    }
    if (studentIds[1] && webDevId) {
        await query(
            `INSERT INTO enrollments (student_id, course_id, status) VALUES ($1, $2, 'active')`,
            [studentIds[1], webDevId],
        );
    }
    if (studentIds[2] && dataScienceId) {
        await query(
            `INSERT INTO enrollments (student_id, course_id, status) VALUES ($1, $2, 'active')`,
            [studentIds[2], dataScienceId],
        );
    }

    await ensureAdminUser();
    console.log("Seed data inserted successfully.");
}

seed()
    .then(() => closePool())
    .catch((err) => {
        console.error("Seed failed:", err.message);
        process.exit(1);
    });
