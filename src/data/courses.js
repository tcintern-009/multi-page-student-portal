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
    {
        slug: "mobile-development",
        title: "Mobile App Development",
        category: "Programming",
        description:
            "Build cross-platform mobile apps with React Native and Flutter. Create stunning iOS and Android applications.",
        longDescription:
            "Learn to build beautiful, high-performance mobile applications for both iOS and Android using React Native and Flutter. This course covers mobile UI design, state management, navigation, and integrating native device features. You'll build several complete apps and understand how to publish them to the App Store and Google Play.",
        instructor: "Bilal Hussain",
        duration: "12 weeks",
        level: "Intermediate",
        students: 720,
        rating: 4.6,
        price: 159,
        image: "/images/mobile-development.svg",
        topics: [
            "React Native Fundamentals",
            "Flutter & Dart",
            "Mobile UI/UX Design",
            "State Management",
            "Native Device APIs",
            "App Store Publishing",
        ],
    },
    {
        slug: "cloud-computing",
        title: "Cloud Computing",
        category: "DevOps",
        description:
            "Master AWS, Azure, and Google Cloud. Learn to deploy, scale, and manage applications in the cloud.",
        longDescription:
            "This course provides a comprehensive introduction to cloud computing with hands-on experience on AWS, Azure, and Google Cloud Platform. You'll learn about cloud architecture, virtual machines, containers, serverless computing, and infrastructure as code. Perfect for developers and IT professionals looking to modernize their skills and build scalable cloud solutions.",
        instructor: "Dr. Imran Khan",
        duration: "10 weeks",
        level: "Intermediate",
        students: 640,
        rating: 4.5,
        price: 189,
        image: "/images/cloud-computing.svg",
        topics: [
            "Cloud Fundamentals",
            "AWS Core Services",
            "Azure & GCP Basics",
            "Docker & Kubernetes",
            "Serverless Architecture",
            "Infrastructure as Code",
        ],
    },
    {
        slug: "cybersecurity",
        title: "Cybersecurity",
        category: "Security",
        description:
            "Learn ethical hacking, network security, and how to protect systems from cyber threats and attacks.",
        longDescription:
            "In an increasingly connected world, cybersecurity skills are essential. This course covers network security, ethical hacking, penetration testing, cryptography, and security best practices. You'll learn how to identify vulnerabilities, protect against common attacks, and implement robust security measures for organizations of all sizes.",
        instructor: "Fatima Noor",
        duration: "12 weeks",
        level: "Beginner to Intermediate",
        students: 510,
        rating: 4.7,
        price: 169,
        image: "/images/cybersecurity.svg",
        topics: [
            "Network Security",
            "Ethical Hacking",
            "Penetration Testing",
            "Cryptography",
            "Web Application Security",
            "Incident Response",
        ],
    },
];

export function getCourseBySlug(slug) {
    return courses.find((course) => course.slug === slug);
}