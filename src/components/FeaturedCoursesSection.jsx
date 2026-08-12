"use client";

import { useState, useEffect } from "react";
import CourseCard from "@/components/CourseCard";
import Button from "@/components/Button";
import SectionTitle from "@/components/SectionTitle";
import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fetchCourses, fetchInstructors } from "@/lib/api";

export default function FeaturedCoursesSection() {
  const [courses, setCourses] = useState([]);
  const [instructorCount, setInstructorCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [courseData, instructorData] = await Promise.all([
          fetchCourses(),
          fetchInstructors(),
        ]);
        setCourses(courseData);
        setInstructorCount(instructorData.length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const featuredCourses = courses.slice(0, 3);
  const totalStudents = courses.reduce(
    (sum, course) => sum + course.students,
    0,
  );
  const avgRating =
    courses.length > 0
      ? (
          courses.reduce((sum, course) => sum + course.rating, 0) /
          courses.length
        ).toFixed(1)
      : "4.8";

  return (
    <div>
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600 mb-1">
                {loading ? "..." : `${courses.length}+`}
              </p>
              <p className="text-gray-600 text-sm">Courses</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600 mb-1">
                {loading ? "..." : instructorCount}
              </p>
              <p className="text-gray-600 text-sm">Expert Instructors</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600 mb-1">
                {loading ? "..." : `${totalStudents.toLocaleString()}+`}
              </p>
              <p className="text-gray-600 text-sm">Students</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600 mb-1">
                {loading ? "..." : avgRating}
              </p>
              <p className="text-gray-600 text-sm">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Featured Courses"
            subtitle="Handpicked courses to help you kickstart your journey. Each course is designed by industry experts."
          />
          {loading ? (
            <LoadingSpinner label="Loading featured courses..." />
          ) : error ? (
            <EmptyState title="Failed to load courses" message={error} />
          ) : featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <CourseCard key={course.slug} course={course} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No featured courses yet"
              message="Our featured courses are being curated. Check back soon!"
            />
          )}
          <div className="text-center mt-12">
            <Button href="/courses" size="lg">
              View All Courses
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
