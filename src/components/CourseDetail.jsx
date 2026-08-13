"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import Button from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fetchCourseBySlug, createEnrollment } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function CourseDetail({ slug }) {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEnroll, setShowEnroll] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollMessage, setEnrollMessage] = useState(null);
  const [enrollError, setEnrollError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCourseBySlug(slug);
        setCourse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return <LoadingSpinner label="Loading course details..." />;
  }

  if (error) {
    notFound();
  }

  if (!course) {
    return null;
  }

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/courses/${slug}`);
      return;
    }
    setShowEnroll(true);
    setEnrollError(null);
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    setEnrolling(true);
    setEnrollError(null);
    setEnrollMessage(null);

    try {
      await createEnrollment({ courseSlug: course.slug });
      setEnrollMessage("Successfully enrolled! Welcome to the course.");
      setShowEnroll(false);
    } catch (err) {
      setEnrollError(err.message);
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <Link
            href="/courses"
            className="inline-flex items-center text-blue-100 hover:text-white mb-6 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Courses
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-block bg-yellow-400 text-gray-900 text-sm font-semibold px-4 py-1.5 rounded-full">
              {course.category}
            </span>
            <span className="inline-block bg-white/10 backdrop-blur text-sm px-4 py-1.5 rounded-full">
              {course.level}
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            {course.title}
          </h1>
          <p className="text-blue-100 text-lg max-w-3xl mb-8 leading-relaxed">
            {course.description}
          </p>

          <div className="flex flex-wrap gap-8 text-sm">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white font-medium">
                {course.rating} Rating
              </span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="text-white font-medium">
                {course.students.toLocaleString()} Students
              </span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-white font-medium">{course.duration}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About This Course
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {course.longDescription}
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  What You'll Learn
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {course.topics.map((topic, index) => (
                    <div
                      key={topic}
                      className="flex items-start bg-white rounded-lg border border-gray-200 p-4"
                    >
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 font-medium">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Your Instructor
                </h2>
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {course.instructor}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 lg:sticky lg:top-24">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 h-32 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-14 h-14 text-white/90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                    />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  ${course.price}
                </h3>
                {enrollMessage && (
                  <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                    {enrollMessage}
                  </div>
                )}
                <Button
                  className="w-full mb-3"
                  onClick={handleEnrollClick}
                  disabled={authLoading}
                >
                  {isAuthenticated ? "Enroll Now" : "Login to Enroll"}
                </Button>
                <Button variant="outline" className="w-full">
                  Add to Cart
                </Button>

                {showEnroll && isAuthenticated && (
                  <form
                    onSubmit={handleEnroll}
                    className="mt-6 pt-6 border-t border-gray-200 space-y-4"
                  >
                    <h4 className="font-semibold text-gray-900">
                      Confirm enrollment
                    </h4>
                    <p className="text-sm text-gray-600">
                      Enroll as <span className="font-medium">{user.name}</span>{" "}
                      ({user.email})
                    </p>
                    {enrollError && (
                      <p className="text-sm text-red-600">{enrollError}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={enrolling}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {enrolling ? "Enrolling..." : "Confirm Enrollment"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowEnroll(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
                <div className="mt-6 space-y-3 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Duration</span>
                    <span className="font-medium text-gray-900">
                      {course.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Level</span>
                    <span className="font-medium text-gray-900">
                      {course.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Language</span>
                    <span className="font-medium text-gray-900">English</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Certificate</span>
                    <span className="font-medium text-gray-900">
                      Yes, included
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
