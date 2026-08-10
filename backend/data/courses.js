// In-memory course data for the Student Course Portal API.
// A database is not required for this task, so we use an array
// that persists in memory while the server is running.

export const courses = [
    {
        slug: "web-development",
        title: "Web Development",
        category: "Programming",
        description:
            "Master modern web development with HTML, CSS, JavaScript, and React. Build responsive, interactive websites from scratch.",
        longDescription:
            "This comprehensive course takes you from the fundamentals of HTML and CSS to advanced React and Next.js development. You'll learn how to build responsive layouts, handle user interactions, manage state, and deploy production-ready applications. Through hands-on projects, you'll create real-world websites and gain the confidence to work as a professional web developer.",
        instructor: "Sarah Ahmed",
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
        instructor: "Dr. Imran Khan",
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
        instructor: "Ayesha Malik",
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