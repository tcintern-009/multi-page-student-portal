"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { fetchEnrollments, deleteEnrollment } from "@/lib/api";

function EnrollmentsList() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEnrollments();
      setEnrollments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCancel = async (enrollment) => {
    if (!window.confirm(`Cancel enrollment in "${enrollment.course?.title}"?`))
      return;
    setActionError(null);
    try {
      await deleteEnrollment(enrollment.id);
      await load();
    } catch (err) {
      setActionError(err.message);
    }
  };

  if (loading) return <LoadingSpinner label="Loading enrollments..." />;

  if (error) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Failed to load enrollments
        </h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={load}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {actionError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {actionError}
        </div>
      )}

      {enrollments.length > 0 ? (
        <div className="grid gap-4">
          {enrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div>
                <Link
                  href={`/courses/${enrollment.course?.slug}`}
                  className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {enrollment.course?.title}
                </Link>
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      enrollment.status === "active"
                        ? "bg-green-100 text-green-800"
                        : enrollment.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {enrollment.status}
                  </span>
                  <span>
                    Enrolled{" "}
                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {enrollment.status === "active" && (
                <button
                  onClick={() => handleCancel(enrollment)}
                  className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Cancel Enrollment
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No enrollments yet"
          message="Browse courses and enroll to get started!"
          actionLabel="Browse Courses"
          onAction={() => (window.location.href = "/courses")}
        />
      )}
    </div>
  );
}

export default function MyEnrollmentsPage() {
  return (
    <ProtectedRoute>
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">My Enrollments</h1>
          <p className="text-blue-100 text-lg mt-2">
            Track your course enrollments and progress.
          </p>
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <EnrollmentsList />
        </div>
      </section>
    </ProtectedRoute>
  );
}
