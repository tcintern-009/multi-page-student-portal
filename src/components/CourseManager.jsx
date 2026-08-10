"use client";

import { useState, useEffect, useCallback } from "react";
import CourseSearch from "@/components/CourseSearch";
import CourseForm from "@/components/CourseForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import {
  fetchCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "@/lib/api";

export default function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCourses();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleAdd = () => {
    setEditingCourse(null);
    setActionError(null);
    setShowForm(true);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setActionError(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCourse(null);
    setActionError(null);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setActionError(null);
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.slug, formData);
      } else {
        await createCourse(formData);
      }
      await loadCourses();
      setShowForm(false);
      setEditingCourse(null);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (course) => {
    if (!window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
      return;
    }
    setActionError(null);
    try {
      await deleteCourse(course.slug);
      await loadCourses();
    } catch (err) {
      setActionError(err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading courses..." />;
  }

  if (error) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Failed to load courses
        </h3>
        <p className="text-gray-600 max-w-md mx-auto mb-6">{error}</p>
        <button
          onClick={loadCourses}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <p className="text-gray-600">
          {courses.length} {courses.length === 1 ? "course" : "courses"}{" "}
          available
        </p>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Course
        </button>
      </div>

      {actionError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {actionError}
        </div>
      )}

      {showForm && (
        <div className="mb-10">
          <CourseForm
            initialData={editingCourse}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitting={submitting}
          />
        </div>
      )}

      {courses.length > 0 ? (
        <CourseSearch
          courses={courses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <EmptyState
          title="No courses available"
          message="Add your first course to get started."
          actionLabel="Add Course"
          onAction={handleAdd}
        />
      )}
    </div>
  );
}
