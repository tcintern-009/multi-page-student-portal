import CourseSearch from "@/components/CourseSearch";
import { courses } from "@/data/courses";

export const metadata = {
  title: "Courses | Student Course Portal",
  description: "Browse all available courses at Student Course Portal",
};

export default function CoursesPage() {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Our Courses</h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Explore our comprehensive range of courses designed to help you
            build in-demand skills and advance your career.
          </p>
        </div>
      </section>

      {/* Search + Courses Grid */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CourseSearch courses={courses} />
        </div>
      </section>
    </div>
  );
}
