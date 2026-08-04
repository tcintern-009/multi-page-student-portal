import CourseCard from "@/components/CourseCard";
import Button from "@/components/Button";
import SectionTitle from "@/components/SectionTitle";
import { courses } from "@/data/courses";

export default function HomePage() {
  const featuredCourses = courses.slice(0, 3);
  const totalStudents = courses.reduce(
    (sum, course) => sum + course.students,
    0,
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-6">
                🎓 Your Journey to Success Starts Here
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Learn In-Demand Skills with{" "}
                <span className="text-yellow-400">Expert Instructors</span>
              </h1>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                Explore our diverse range of courses in web development, AI,
                data science, and more. Build your future career with hands-on
                learning and real-world projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/courses" variant="yellow" size="lg">
                  Browse Courses
                </Button>
                <Button href="/instructors" variant="secondary" size="lg">
                  Meet Our Instructors
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-2xl font-bold mb-2">
                    Featured Learning Experience
                  </h3>
                  <p className="text-blue-100">
                    Interactive courses designed for real-world success
                  </p>
                </div>
                <div className="space-y-4">
                  {featuredCourses.map((course, index) => (
                    <div
                      key={course.slug}
                      className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-3"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-8 h-8 bg-yellow-400 text-gray-900 rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <p className="text-sm text-blue-200">
                            {course.category}
                          </p>
                        </div>
                      </div>
                      <span className="text-yellow-400 font-semibold">
                        ${course.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600 mb-1">
                {courses.length}+
              </p>
              <p className="text-gray-600 text-sm">Courses</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600 mb-1">5</p>
              <p className="text-gray-600 text-sm">Expert Instructors</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600 mb-1">
                {totalStudents.toLocaleString()}+
              </p>
              <p className="text-gray-600 text-sm">Students</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600 mb-1">4.8</p>
              <p className="text-gray-600 text-sm">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Featured Courses"
            subtitle="Handpicked courses to help you kickstart your journey. Each course is designed by industry experts."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button href="/courses" size="lg">
              View All Courses
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-100 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Why Choose Student Portal?"
            subtitle="We provide everything you need to succeed in your learning journey."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Expert-Led Curriculum
              </h3>
              <p className="text-gray-600">
                Learn from industry professionals with years of real-world
                experience.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Hands-On Projects
              </h3>
              <p className="text-gray-600">
                Build real projects that showcase your skills to employers.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Career Support
              </h3>
              <p className="text-gray-600">
                Get guidance on resumes, interviews, and job placements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students who are building successful careers with
            Student Portal.
          </p>
          <Button href="/contact" variant="white" size="lg">
            Contact Us
          </Button>
        </div>
      </section>
    </div>
  );
}
