"use client";

import StudentManager from "@/components/StudentManager";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function StudentsPageClient() {
  return (
    <ProtectedRoute requireAdmin>
      <div>
        <section className="bg-gradient-to-r from-emerald-700 to-teal-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Students</h1>
            <p className="text-emerald-100 text-lg max-w-2xl">
              View and manage student records. Students can enroll in courses
              after registering and signing in.
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StudentManager />
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}
